# MetricMind AI Service

## Project Overview
MetricMind is an AI-powered Business Intelligence system that answers business questions using a Semantic Layer instead of raw SQL. This backend module translates natural language questions into structured semantic layer queries (JSON) using LangChain and the Groq LLM. It is designed to be imported by the main backend to execute queries via the Cube REST API.

## Required Packages
The project requires the following dependencies (listed in `requirements.txt`):
* fastapi
* uvicorn
* langchain
* langchain-core
* langchain-groq
* python-dotenv
* pydantic

## Environment Variables
To run this project, you must configure your environment variables. 
1. Copy `.env.example` and rename it to `.env`.
2. Add your active Groq API key:
`GROQ_API_KEY=your_actual_key_here`

## Installation Steps
1. Clone the repository and switch to the backend folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: 
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`

## Usage Integration
This service is now integrated as a reusable Python function rather than a standalone API. 
To use it in the main backend, import it like this:

```python
from agent import get_semantic_query

# Example usage
response = get_semantic_query("Show me the total revenue for the European region last quarter")

#json response
{
  "measures": ["retail_sales.revenue"],
  "dimensions": ["retail_sales.category"],
  "filters": []
}