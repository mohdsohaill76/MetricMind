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

# 1. Define the exact JSON structure requested by the team leader
class SemanticQuery(BaseModel):
    measures: List[str] = Field(description="List of measures, e.g., retail_sales.revenue")
    dimensions: List[str] = Field(description="List of dimensions, e.g., retail_sales.category")
    filters: List[str] = Field(description="List of filters to apply")

# 2. Initialize the Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0
)

# 3. Force the LLM to use the JSON structure
structured_llm = llm.with_structured_output(SemanticQuery)

# 4. Update the strict system instructions
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are the MetricMind AI Service. Translate user questions into structured semantic layer queries. Always return exact JSON matching the schema."),
    ("user", "{input}")
])

# 5. Create the new LangChain processing chain
agent_chain = prompt | structured_llm

if __name__ == "__main__":
    # Test your setup directly in the terminal!
    test_query = "Show me the total revenue for the European region last quarter"
    print(f"Sending test query: '{test_query}'\n")
    
    try:
        response = agent_chain.invoke({"input": test_query})
        print("--- AI JSON RESPONSE ---")
        # Print the output perfectly formatted as JSON
        print(response.model_dump_json(indent=2))
    except Exception as e:
        print(f"An error occurred: {e}")