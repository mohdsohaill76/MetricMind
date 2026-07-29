import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List

# Load the environment variables
load_dotenv()

# Verify the key is loaded correctly
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

# Create the new LangChain processing chain
agent_chain = prompt | structured_llm

# --- NEW: Reusable Function for the Existing Backend ---
def get_semantic_query(user_question: str) -> dict:
    """
    Takes a natural language question and returns a structured semantic query dictionary.
    This can now be imported by the existing backend!
    """
    try:
        response = agent_chain.invoke({"input": user_question})
        # Convert the Pydantic model into a standard Python dictionary
        return response.model_dump()
    except Exception as e:
        print(f"Error generating query: {e}")
        # Return an empty safe structure if the AI fails
        return {"measures": [], "dimensions": [], "filters": []}