import os
import requests
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List

# Load the environment variables
load_dotenv()

# Verify the Groq key is loaded correctly
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is missing from your .env file!")

# Define the exact JSON structure requested by the team leader
class SemanticQuery(BaseModel):
    measures: List[str] = Field(description="List of measures, e.g., retail_sales.revenue")
    dimensions: List[str] = Field(description="List of dimensions, e.g., retail_sales.category")
    filters: List[str] = Field(description="List of filters to apply")

# Initialize the Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0
)

# Force the LLM to use the JSON structure
structured_llm = llm.with_structured_output(SemanticQuery)

# Update the strict system instructions
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are the MetricMind AI Service. Translate user questions into structured semantic layer queries. Always return exact JSON matching the schema."),
    ("user", "{input}")
])

# Create the LangChain processing chain
agent_chain = prompt | structured_llm


def get_semantic_query(user_question: str) -> dict:
    """
    Translates a natural language question into a structured JSON query.
    """
    try:
        response = agent_chain.invoke({"input": user_question})
        return response.model_dump()
    except Exception as e:
        print(f"Error generating query: {e}")
        return {"measures": [], "dimensions": [], "filters": []}


# --- NEW: Requirement 8 - Connect to Cube API ---
def execute_cube_query(semantic_query: dict) -> dict:
    """
    Sends the structured JSON query to the Cube REST API.
    """
    cube_url = os.getenv("CUBE_API_URL")
    cube_token = os.getenv("CUBE_API_TOKEN")

    # Failsafe if your teammate hasn't provided the real URL yet
    if not cube_url or cube_url == "your_cube_api_url_here":
        print("⚠️ Cube API placeholders detected. Returning mocked results.")
        return {"status": "success", "mock_data": "Waiting for real Cube API URL"}

    headers = {
        "Authorization": f"Bearer {cube_token}",
        "Content-Type": "application/json"
    }

    try:
        # Wrap the semantic query in a payload that Cube expects
        payload = {"query": semantic_query}
        
        # Make the POST request to the Cube semantic layer API
        response = requests.post(f"{cube_url}/cubejs-api/v1/load", json=payload, headers=headers)
        response.raise_for_status()
        
        # Return the final business data
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Cube API: {e}")
        return {"error": str(e)}


# --- NEW: Full Integration Workflow ---
def answer_business_question(user_question: str) -> dict:
    """
    The full workflow: User Question -> LangChain -> JSON -> Cube API -> Results
    """
    # 1. AI translates the question into JSON
    semantic_json = get_semantic_query(user_question)
    
    # 2. Python sends the JSON to Cube to get the final numbers
    final_data = execute_cube_query(semantic_json)
    
    return final_data