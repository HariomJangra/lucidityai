import asyncio
import json
import threading
from dataclasses import dataclass
from typing import Any, AsyncGenerator, Optional

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain.messages import HumanMessage, SystemMessage

from app.core.prompts import SYSTEM_PROMPT
from app.services.agent import build_agent

router = APIRouter()


@dataclass
class StreamContext:
	loop: asyncio.AbstractEventLoop
	queue: asyncio.Queue[Any]


active_streams: dict[str, list[StreamContext]] = {}
active_streams_lock = threading.Lock()


def _sse_payload(data: dict[str, Any]) -> str:
	return f"data: {json.dumps(data)}\n\n"


def _enqueue_active_streams(user_message: str, context: StreamContext) -> None:
	with active_streams_lock:
		active_streams.setdefault(user_message.strip().lower(), []).append(context)


def _dequeue_active_streams(user_message: str, context: StreamContext) -> None:
	key = user_message.strip().lower()
	with active_streams_lock:
		queues = active_streams.get(key)
		if not queues:
			return
		try:
			queues.remove(context)
		except ValueError:
			pass
		if not queues:
			active_streams.pop(key, None)


async def event_stream(user_message: str, model_name: Optional[str]) -> AsyncGenerator[str, None]:
	agent = build_agent(model_name)
	stream = await agent.astream_events(
		{
			"messages": [
				SystemMessage(content=SYSTEM_PROMPT),
				HumanMessage(content=user_message),
			]
		},
		version="v3",  # LangChain v3 exposes typed projections like messages and tool_calls.
	)

	queue: asyncio.Queue[Any] = asyncio.Queue()
	context = StreamContext(loop=asyncio.get_running_loop(), queue=queue)
	sentinel = None
	_enqueue_active_streams(user_message, context)

	async def publish_messages() -> None:
		async for message in stream.messages:
			async def stream_reasoning() -> None:
				async for delta in message.reasoning:
					await queue.put({"type": "thinking", "delta": delta})

			async def stream_text() -> None:
				async for delta in message.text:
					await queue.put({"type": "generating", "delta": delta})

			await asyncio.gather(stream_reasoning(), stream_text())

	async def publish_tool_calls() -> None:
		async for item in stream.tool_calls:
			# These tool events let the frontend show web search links and other tool activity early.
			await queue.put({
				"type": "tool_start",
				"tool": item.tool_name,
				"input": item.input,
			})
			async for delta in item.output_deltas:
				await queue.put({"type": "tool_delta", "delta": str(delta)})
			await queue.put({
				"type": "tool_end",
				"tool": item.tool_name,
				"output": str(getattr(item, "output", "")),
				"error": str(getattr(item, "error", "")) or None,
			})

	async def run_publishers() -> None:
		try:
			await asyncio.gather(publish_messages(), publish_tool_calls())
		finally:
			await queue.put(sentinel)

	producer = asyncio.create_task(run_publishers())
	try:
		while True:
			item = await queue.get()
			if item is sentinel:
				break
			if isinstance(item, str):
				yield item
			else:
				yield _sse_payload(item)
		await producer
	finally:
		_dequeue_active_streams(user_message, context)
		if not producer.done():
			producer.cancel()

	yield _sse_payload({"type": "done"})


@router.get("/stream")
async def stream_endpoint(message: str, model: Optional[str] = None) -> StreamingResponse:
	return StreamingResponse(
		event_stream(message, model),
		media_type="text/event-stream",
		headers={
			"Cache-Control": "no-cache",
			"X-Accel-Buffering": "no",
		},
	)