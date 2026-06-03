from typing import Any, Dict
from app.core.config import get_settings
from sentence_transformers import SentenceTransformer, CrossEncoder

# Bi Encoder
bi_encoder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Cross Encoder
cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# LLM Models Configuration
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
	"openai/gpt-oss-120b": {
		"provider": "groq",
		"api_key": settings.groq_api_key,
	}
}
