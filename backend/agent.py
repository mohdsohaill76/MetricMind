import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Load the environment variables from your .env file
load_dotenv()

# Verify the key is loaded correctly
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is missing from your .env file!")

# Initialize the Groq LLM using the powerful Llama 3.3 model
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0
)

# The strict system instructions for the MetricMind agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are the MetricMind AI Agent. Your job is to translate user natural language questions into structured semantic layer queries using metric definitions. Do not write raw SQL statements."),
    ("user", "{input}")
])

# Create the LangChain processing chain
agent_chain = prompt | llm

if __name__ == "__main__":
    # Test your setup directly in the terminal
    test_query = "Show me the total revenue for the European region last quarter"
    print(f"Sending test query to Groq: '{test_query}'\n")
    
    try:
        response = agent_chain.invoke({"input": test_query})
        print("--- AI RESPONSE ---")
        print(response.content)
    except Exception as e:
        print(f"An error occurred: {e}")