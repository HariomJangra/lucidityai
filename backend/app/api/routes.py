import json
import asyncio
import threading
from typing import Optional
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.agent import run_agent, build_agent

router = APIRouter()


class StreamContext:
	def __init__(self, loop, queue):
		self.loop = loop
		self.queue = queue


# Global thread-safe registry of active streaming requests
active_streams_lock = threading.Lock()
active_streams = {}  # query_str -> list of StreamContext


@router.get("/search")
def search(q: str, model: Optional[str] = None):
	return {"response": run_agent(q, model)}


@router.get("/search/stream")
async def search_stream(q: str, model: Optional[str] = None):
	from langchain.messages import HumanMessage, SystemMessage
	from app.core.prompts import SYSTEM_PROMPT

	# Create async queue and context for this request
	loop = asyncio.get_running_loop()
	queue = asyncio.Queue()
	ctx = StreamContext(loop, queue)

	q_key = f"{q.strip().lower()}::{model or 'default'}"
	with active_streams_lock:
		if q_key not in active_streams:
			active_streams[q_key] = []
		active_streams[q_key].append(ctx)

	agent = build_agent(model)

	def sse(data: dict) -> str:
		return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

	async def run_agent_events():
		try:
			await queue.put(sse({"type": "message_start", "node": "model"}))

			stream = await agent.astream_events(
				{
					"messages": [
						SystemMessage(content=SYSTEM_PROMPT),
						HumanMessage(content=q),
					]
				},
				version="v3",
			)

			async def consume_messages():
				async for message in stream.messages:
					async for delta in message.reasoning:
						await queue.put(sse({"type": "thought", "thought": str(delta)}))
					async for delta in message.text:
						await queue.put(sse({"type": "token", "token": str(delta)}))

			async def consume_tools():
				async for call in stream.tool_calls:
					await queue.put(sse({"type": "tool_start", "tool": call.tool_name, "input": str(call.input)}))
					output = ""
					async for delta in call.output_deltas:
						output += str(delta)
					if not output and call.output:
						output = str(call.output)
					if call.error:
						output = f"{output}\n{call.error}".strip()
					await queue.put(sse({"type": "tool_end", "tool": call.tool_name, "output": output[:300]}))

			await asyncio.gather(consume_messages(), consume_tools())

		except Exception as e:
			await queue.put(sse({"type": "error", "message": str(e)}))
		finally:
			await queue.put(sse({"type": "done"}))

	# Start agent runner in the background on the asyncio event loop
	runner_task = asyncio.create_task(run_agent_events())

	async def event_generator():
		try:
			while True:
				event_data = await queue.get()
				yield event_data
				if "type\": \"done" in event_data or "type\": \"error" in event_data:
					break
		finally:
			# Cancel background task if stream is disconnected
			if not runner_task.done():
				runner_task.cancel()
			# Deregister from active streams
			with active_streams_lock:
				if q_key in active_streams:
					if ctx in active_streams[q_key]:
						active_streams[q_key].remove(ctx)
					if not active_streams[q_key]:
						del active_streams[q_key]

	return StreamingResponse(
		event_generator(),
		media_type="text/event-stream",
		headers={
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
		},
	)

