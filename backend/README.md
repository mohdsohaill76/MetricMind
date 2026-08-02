# MetricMind AI Service

## Project Overview
MetricMind is an AI-powered Business Intelligence system that answers business questions using a Semantic Layer instead of raw SQL. This backend module translates natural language questions into structured semantic layer queries (JSON) using LangChain and the Groq LLM. It is designed to be imported by the main backend to automatically execute queries via the Cube REST API.

## System Requirements
* Python Version: Python 3.10 or higher 

## Required Packages
The project requires the following dependencies (listed in requirements.txt):
* fastapi
* uvicorn
* langchain
* langchain-core
* langchain-groq
* python-dotenv
* pydantic
* requests

## Environment Variables
To run this project, you must configure your environment variables. 
1. Copy .env.example and rename it to .env.
2. Add your active API keys and endpoints:

GROQ_API_KEY=your_actual_key_here
CUBE_API_URL=your_cube_api_url_here
CUBE_API_TOKEN=your_cube_api_token_here

### How to obtain the Groq API Key

You can generate your own free API key for testing by following these steps:
1. Go to the Groq Cloud Console: https://console.groq.com
2. Log in or create a free account.
3. On the top right navigation menu, click on API Keys.
4. Click the Create API Key button.
5. Give it a name (e.g., "MetricMind").
6. Copy the generated key immediately and paste it into your .env file as GROQ_API_KEY=your_new_key_here.

Alternatively, if you need the active project API key to run this locally, you can ping me directly to get it.

## Installation Steps
1. Clone the repository and switch to the backend folder.
2. Create a virtual environment: python -m venv venv
3. Activate the environment: 
   * Windows: venv\Scripts\activate
   * Mac/Linux: source venv/bin/activate
4. Install dependencies: pip install -r requirements.txt

## Usage Integration & API Contract

This service is integrated as a reusable Python module rather than a standalone REST server.

### 1. Full Workflow (AI Translation -> Cube API -> Data Results)
To execute the complete process and fetch data from Cube, import answer_business_question:

from agent import answer_business_question

# Example request
user_question = "Show me the total revenue for the European region last quarter"
final_data = answer_business_question(user_question)

print(final_data)

#### Successful Response Format (Mock / Live):
{
  "status": "success",
  "mode": "mock",
  "generated_query": {
    "measures": ["retail_sales.revenue"],
    "dimensions": ["retail_sales.category"],
    "filters": []
  },
  "data": [
    { "message": "Mock data response. Add real CUBE_API_URL in .env to fetch database records." }
  ]
}

### 2. Semantic Query Generation Only
If you only need to generate the structured JSON query without executing the Cube API request:

from agent import get_semantic_query

# Example request
response = get_semantic_query("Show me the total revenue by category")
print(response)

#### Intermediate Semantic Query JSON Output:
{
  "measures": ["retail_sales.revenue"],
  "dimensions": ["retail_sales.category"],
  "filters": []
}

## Automated Testing

Automated unit tests are provided in test_agent.py covering agent initialization, input validation (empty/whitespace inputs), structured JSON output validation, and full workflow execution.

### How to Run Tests
Ensure your virtual environment is activated, then run:

python -m unittest test_agent.py

### Expected Test Output
....
----------------------------------------------------------------------
Ran 4 tests in 3.641s

OK

## Error Handling

* Missing Credentials: If GROQ_API_KEY is missing from .env, the function gracefully returns an error dictionary ({"error": "GROQ_API_KEY is missing from environment variables."}) without crashing the application host.
* Invalid Input: Empty strings or whitespace-only inputs are caught immediately and return {"error": "User question cannot be empty."}.
* Network & Execution Timeouts: Groq LLM requests and Cube API calls have explicit timeouts (10 seconds). Any API errors, timeouts, or exceptions are caught inside try-except blocks and returned as structured error dictionaries to keep the main backend stable.