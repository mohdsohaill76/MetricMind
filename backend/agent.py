import os
import requests
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Load environment variables
load_dotenv()


# Define the exact JSON structure requested by the team leader
class SemanticQuery(BaseModel):
    measures: List[str] = Field(description="List of measures, e.g., retail_sales.revenue")
    dimensions: List[str] = Field(description="List of dimensions, e.g., retail_sales.category")
    filters: List[str] = Field(description="List of filters to apply")


def get_semantic_query(user_question: str) -> Dict[str, Any]:
    """
    Translates a natural language question into a structured JSON query.
    Includes graceful error handling for missing keys, empty inputs, and timeouts.
    """
    # 1. Gracefully handle empty or whitespace-only inputs
    if not user_question or not user_question.strip():
        return {"error": "User question cannot be empty."}

    # 2. Gracefully handle missing GROQ API Key
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return {"error": "GROQ_API_KEY is missing from environment variables."}

    try:
        # Initialize Groq LLM with a 10-second timeout to prevent hanging
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0,
            groq_api_key=groq_api_key,
            request_timeout=10.0
        )

        # Force structured JSON output matching SemanticQuery
        structured_llm = llm.with_structured_output(SemanticQuery)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the MetricMind AI Service. Translate user questions into structured semantic layer queries. Always return exact JSON matching the schema."),
            ("user", "{input}")
        ])

        agent_chain = prompt | structured_llm
        response = agent_chain.invoke({"input": user_question.strip()})
        return response.model_dump()

    except Exception as e:
        # Catch network timeouts, API errors, or schema parsing issues
        return {"error": f"Failed to generate query: {str(e)}"}


def execute_cube_query(semantic_query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends the structured JSON query to the Cube REST API.
    Handles defaults, missing URLs, and request errors gracefully.
    """
    # If upstream step produced an error, pass it along
    if "error" in semantic_query:
        return semantic_query

    cube_url = os.getenv("CUBE_API_URL")
    cube_token = os.getenv("CUBE_API_TOKEN", "")

    # Failsafe if Cube API URL is missing or set to placeholder
    if not cube_url or cube_url == "your_cube_api_url_here":
        return {
            "status": "success",
            "mode": "mock",
            "generated_query": semantic_query,
            "data": [{"message": "Mock data response. Add real CUBE_API_URL in .env to fetch database records."}]
        }

    headers = {
        "Authorization": f"Bearer {cube_token}",
        "Content-Type": "application/json"
    }

    try:
        payload = {"query": semantic_query}
        response = requests.post(
            f"{cube_url.rstrip('/')}/cubejs-api/v1/load", 
            json=payload, 
            headers=headers, 
            timeout=10.0
        )
        response.raise_for_status()
        
        return {
            "status": "success",
            "mode": "live",
            "generated_query": semantic_query,
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:
        return {
            "error": f"Cube API connection failed: {str(e)}",
            "generated_query": semantic_query
        }


def answer_business_question(user_question: str) -> Dict[str, Any]:
    """
    The full workflow: User Question -> LangChain -> JSON -> Cube API -> Results
    """
    semantic_json = get_semantic_query(user_question)
    
    # If translation failed, return the error immediately
    if "error" in semantic_json:
        return semantic_json

    return execute_cube_query(semantic_json)