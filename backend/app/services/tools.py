from langchain.tools import tool
from app.services.websearch import websearch
from app.core.config import get_settings
from enh_web_search import websearch
settings = get_settings()
import requests
import trafilatura
from sympy import sympify


@tool('web_search', description='A tool to perform a web search and retrieve relevant information. Input should be a search query as a string, e.g. "What is the capital of France?".')
def web_search(query: str) -> str:
    return websearch(query)
   
@tool('calculator', description='A tool to evaluate mathematical expressions. Input should be a valid math expression as a string, e.g. "2 + 2 * (3 - 1)".')
def calculator(expression: str) -> str:
    try:
        result = sympify(expression)
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

@tool('fetch_url', description='A tool to fetch and extract text content from a given URL. Input should be a valid URL as a string, e.g. "https://www.example.com".')
def fetch_url(url: str) -> str:
    try:
        downloaded = trafilatura.fetch_url(url)
        result = trafilatura.extract(downloaded, include_comments=False, include_tables=False)
        return result if result else "No content extracted."
    except Exception as e:
        return f"Error: {str(e)}"

@tool('code_execution', description='A tool to execute code snippets. Input should be a valid code as a string.')
def code_execution(code: str, language: str = "python", input: str = "")-> str:
    compilers = {
        "python": "python-3.14",
        "cpp": "cpp-g++15",
        "c": "c-gcc15",
        "java": "java-openjdk25",
        "javascript": "typescript-deno",
        "typescript": "typescript-deno",
        "go": "go-1.26",
        "rust": "rust-1.93",
    }

    response = requests.post(
        "https://api.onlinecompiler.io/api/run-code-sync/",
        headers={
            "Authorization": settings.compiler_api_key.get_secret_value()
        },
        json={
            "compiler": compilers[language],
            "code": code,
            "input": input
        }
    )
    return response.json().get("output", "")
    
@tool('chart_visualization', description='A tool to create charts from data. Input should be a JSON string containing the data and chart type, e.g. {"type": "bar", "data": {"labels": ["A", "B"], "values": [10, 20]}}.')
def chart_visualization(data: str) -> str:
    pass
