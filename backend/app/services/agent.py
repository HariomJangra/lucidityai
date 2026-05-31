from typing import Any, Dict, Optional

from app.core.config import get_settings
from app.core.prompts import SYSTEM_PROMPT
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage
from app.services.tools import web_search, calculator, fetch_url, code_execution, chart_visualization

settings = get_settings()

DEFAULT_MODEL_ID = "gemma-4-31b-it"

MODEL_CONFIG: Dict[str, Dict[str, Any]] = {
	"gemma-4-31b-it": {
		"provider": "google_genai",
		"api_key": settings.gemini_api_key,
	},
	"mistral-small-latest": {
		"provider": "mistralai",
		"api_key": settings.mistral_api_key,
	},
}

def build_agent(model_id: Optional[str]) -> Any:
	resolved_model_id = model_id or DEFAULT_MODEL_ID
	if resolved_model_id == "Default":
		resolved_model_id = DEFAULT_MODEL_ID

	spec = MODEL_CONFIG.get(resolved_model_id, MODEL_CONFIG[DEFAULT_MODEL_ID])
	model = init_chat_model(
		resolved_model_id,
		model_provider=spec["provider"],
		api_key=spec["api_key"],
	)
	return create_agent(model=model, tools=[web_search, calculator, fetch_url, code_execution, chart_visualization])


def run_agent(user_message: str, model_name: Optional[str] = None) -> str:
	agent = build_agent(model_name)
	result: Any = agent.invoke(
		{
			"messages": [
				SystemMessage(content=SYSTEM_PROMPT),
				HumanMessage(content=user_message),
			]
		}
	)

	if isinstance(result, dict):
		if "output" in result:
			return str(result["output"])
		messages = result.get("messages")
		if messages:
			last_message = messages[-1]
			return str(getattr(last_message, "content", last_message))

	return str(getattr(result, "content", result))

