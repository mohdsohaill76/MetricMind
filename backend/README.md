# MetricMind AI Service

## Project Overview
MetricMind is an AI-powered Business Intelligence system that answers business questions using a Semantic Layer instead of raw SQL. This backend module translates natural language questions into structured semantic layer queries (JSON) using LangChain and the Groq LLM. It is designed to be imported by the main backend to automatically execute queries via the Cube REST API.

## System Requirements
* **Python Version:** Python 3.10 or higher 

## Required Packages
The project requires the following dependencies (listed in `requirements.txt`):
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
1. Copy `.env.example` and rename it to `.env`.
2. Add your active API keys and endpoints:
```env
GROQ_API_KEY=your_actual_key_here
CUBE_API_URL=your_cube_api_url_here
CUBE_API_TOKEN=your_cube_api_token_here
```

### How to obtain the Groq API Key

you can generate your own free API key for testing by following these steps:
1. Go to the Groq Cloud Console: https://console.groq.com
2. Log in or create a free account.
3. On the top right navigation menu, click on **API Keys**.
4. Click the **Create API Key** button.
5. Give it a name (e.g., "MetricMind").
6. Copy the generated key immediately and paste it into your `.env` file as `GROQ_API_KEY=your_new_key_here`.

Alternatively, if you need the active project API key to run this locally, you can ping me directly to get it.

## Installation Steps
1. Clone the repository and switch to the backend folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: 
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`

## Usage Integration
This service is now integrated as a reusable Python function rather than a standalone API. 

### 1. Full Workflow (AI Translation ➔ Cube API ➔ Data Results)
To execute the complete process and fetch real data from Cube, import it into the main backend like this:

```python
from agent import answer_business_question

# Example request
user_question = "Show me the total revenue for the European region last quarter"
final_data = answer_business_question(user_question)

print(final_data)
```

### 2. Semantic Query Generation Only
If you only need to generate the intermediate JSON format without calling the Cube API:

```python
from agent import get_semantic_query

# Example request
response = get_semantic_query("Show me the total revenue for the European region last quarter")
```

### Example JSON Response
```json
{
  "measures": ["retail_sales.revenue"],
  "dimensions": ["retail_sales.category"],
  "filters": []
}
```

## Error Handling
* **Missing Credentials:** If the `GROQ_API_KEY` is missing, the service raises a `ValueError` on startup. If the Cube credentials are missing, the query function returns a mock data response safely.
* **Execution Failures:** Network timeouts and generation errors are caught in `try-except` blocks. In the event of a failure, the AI service returns an empty safe structure (`{"measures": [], "dimensions": [], "filters": []}`) or an error dictionary to prevent the main backend from crashing.