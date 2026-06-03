import threading
from typing import Dict
from langchain_core.chat_history import InMemoryChatMessageHistory

class MemoryManager:
    def __init__(self):
        self._histories: Dict[str, InMemoryChatMessageHistory] = {}
        self._lock = threading.Lock()

    def get_history(self, session_id: str) -> InMemoryChatMessageHistory:
        with self._lock:
            if session_id not in self._histories:
                self._histories[session_id] = InMemoryChatMessageHistory()
            return self._histories[session_id]

    def clear_history(self, session_id: str) -> None:
        with self._lock:
            if session_id in self._histories:
                del self._histories[session_id]

memory_manager = MemoryManager()
