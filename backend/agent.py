import os
import requests
from dotenv import load_dotenv
from functools import lru_cache
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# Load environment variables from .env
load_dotenv()


# ==========================================================
# 1. CUBE.JS PYDANTIC MODELS (Requirements #1 & #4)
# ==========================================================

class CubeFilter(BaseModel):
    member: str = Field(description="Cube dimension or measure name (e.g., 'superstore.category')")
    operator: str = Field(description="Filter operator (e.g., 'equals', 'contains', 'gt', 'gte', 'lt', 'lte', 'set', 'notSet')")
    values: Optional[List[Any]] = Field(default=None, description="List of filter target values")

class TimeDimension(BaseModel):
    dimension: str = Field(description="Time dimension field name (e.g., 'base_orders.created_at')")
    granularity: Optional[str] = Field(default=None, description="e.g., 'day', 'week', 'month', 'year'")
    dateRange: Optional[Any] = Field(default=None, description="String like 'Last 30 days' or list like ['2026-01-01', '2026-08-01']")

class SemanticQuery(BaseModel):
    measures: List[str] = Field(default_factory=list, description="List of measures, e.g., ['superstore.revenue']")
    dimensions: List[str] = Field(default_factory=list, description="List of dimensions, e.g., ['superstore.category']")
    filters: List[CubeFilter] = Field(default_factory=list, description="Structured filters matching Cube.js REST format")
    timeDimensions: List[TimeDimension] = Field(default_factory=list, description="List of time dimensions and date ranges")


# ==========================================================
# 2. SCHEMA CONTEXT & METADATA INJECTION (Requirement #3)
# ==========================================================

FALLBACK_SCHEMA = """
Available Cube Models and Members:

Cube: superstore
  Measures:
    - superstore.count
    - superstore.quantity
    - superstore.revenue
    - superstore.profit
    - superstore.cost
    - superstore.margin
  Dimensions:
    - superstore.id
    - superstore.category
    - superstore.city
    - superstore.country
    - superstore.discount
    - superstore.profit
    - superstore.region
    - superstore.sales
    - superstore.segment
    - superstore.ship_mode
    - superstore.state
    - superstore.sub_category

Cube: base_orders
  Measures:
    - base_orders.count
    - base_orders.completed_count
    - base_orders.completed_percentage
    - base_orders.total
    - base_orders.dau
    - base_orders.wau
    - base_orders.mau
  Dimensions:
    - base_orders.id
    - base_orders.status
  Time Dimensions:
    - base_orders.created_at
    - base_orders.completed_at

Cube: products
  Measures:
    - products.count
  Dimensions:
    - products.id
    - products.name
    - products.product_category
  Time Dimensions:
    - products.created_at

Cube: users
  Measures:
    - users.count
  Dimensions:
    - users.id
    - users.first_name
    - users.last_name
    - users.full_name
    - users.age
    - users.age_bucket
    - users.gender
    - users.state
    - users.city
    - users.orders_made
  Time Dimensions:
    - users.created_at

Cube: retail_sales
  Measures:
    - retail_sales.count
    - retail_sales.quantity
  Dimensions:
    - retail_sales.customer_id
    - retail_sales.gender
    - retail_sales.price_per_unit
    - retail_sales.product_category
    - retail_sales.total_amount
  Time Dimensions:
    - retail_sales.date
"""

@lru_cache(maxsize=1)
def fetch_live_cube_schema() -> str:
    """
    Dynamically fetches schema metadata directly from Cube's REST API endpoint /cubejs-api/v1/meta.
    Falls back gracefully to hardcoded YAML schema if Cube is offline or unconfigured.
    """
    cube_url = os.getenv("CUBE_API_URL")
    cube_token = os.getenv("CUBE_API_TOKEN", "")

    if not cube_url or "placeholder" in cube_url.lower() or cube_url.startswith("your_"):
        return FALLBACK_SCHEMA

    headers = {"Authorization": f"Bearer {cube_token}" if not cube_token.startswith("Bearer ") else cube_token}
    
    try:
        response = requests.get(f"{cube_url.rstrip('/')}/cubejs-api/v1/meta", headers=headers, timeout=5.0)
        if response.status_code != 200:
            return FALLBACK_SCHEMA
        
        meta = response.json()
        schema_lines = ["Available Cube Models and Members:"]
        
        for cube in meta.get("cubes", []):
            schema_lines.append(f"\nCube: {cube['name']}")
            
            measures = [m["name"] for m in cube.get("measures", [])]
            if measures:
                schema_lines.append("  Measures:\n    - " + "\n    - ".join(measures))
                
            dimensions = [d["name"] for d in cube.get("dimensions", []) if d.get("type") != "time"]
            if dimensions:
                schema_lines.append("  Dimensions:\n    - " + "\n    - ".join(dimensions))
                
            time_dims = [d["name"] for d in cube.get("dimensions", []) if d.get("type") == "time"]
            if time_dims:
                schema_lines.append("  Time Dimensions:\n    - " + "\n    - ".join(time_dims))

        return "\n".join(schema_lines)

    except Exception:
        return FALLBACK_SCHEMA


# ==========================================================
# 3. HELPER & CACHED LANGCHAIN INSTANCES (Requirements #5 & #6)
# ==========================================================

def _validate_api_key(key: Optional[str], key_name: str) -> Optional[str]:
    """Validates presence and checks for non-functional placeholder API keys."""
    if not key or not key.strip():
        return f"{key_name} is missing from environment variables."
    cleaned_key = key.strip().lower()
    placeholders = ["your_", "placeholder", "xxx", "12345"]
    if any(cleaned_key.startswith(p) for p in placeholders):
        return f"{key_name} appears to be an unconfigured placeholder."
    return None

@lru_cache(maxsize=1)
def _get_cached_agent_chain():
    """Caches the LangChain prompt and LLM pipeline in memory."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    schema_context = fetch_live_cube_schema()
    
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        groq_api_key=groq_api_key,
        request_timeout=10.0
    )
    
    structured_llm = llm.with_structured_output(SemanticQuery)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the MetricMind AI Service. Translate user questions into structured semantic layer queries for Cube.js.
Always select exact measures, dimensions, filters, and timeDimensions strictly matching the schema context provided. Do not hallucinate fields.

Schema Context:
{schema_context}"""),
        ("user", "{input}")
    ])

    return prompt | structured_llm


# ==========================================================
# 4. CORE AGENT PIPELINE FUNCTIONS
# ==========================================================

def get_semantic_query(user_question: str) -> Dict[str, Any]:
    """Translates natural language questions into structured Cube JSON queries."""
    if not user_question or not user_question.strip():
        return {"error": "User question cannot be empty."}

    key_error = _validate_api_key(os.getenv("GROQ_API_KEY"), "GROQ_API_KEY")
    if key_error:
        return {"error": key_error}

    try:
        chain = _get_cached_agent_chain()
        schema_context = fetch_live_cube_schema()
        response: SemanticQuery = chain.invoke({
            "schema_context": schema_context,
            "input": user_question.strip()
        })
        return response.model_dump()

    except Exception as e:
        return {"error": f"Failed to generate query: {str(e)}"}


def execute_cube_query(semantic_query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends structured JSON queries to Cube REST API or returns mock results.
    Guarantees consistent output contracts across mock and live modes (Requirement #2).
    """
    if "error" in semantic_query:
        return {
            "status": "error",
            "mode": "unknown",
            "generated_query": semantic_query,
            "data": [],
            "error": semantic_query["error"]
        }

    cube_url = os.getenv("CUBE_API_URL")
    cube_token = os.getenv("CUBE_API_TOKEN", "")

    is_mock = not cube_url or cube_url.startswith("your_") or "placeholder" in cube_url.lower()

    if is_mock:
        return {
            "status": "success",
            "mode": "mock",
            "generated_query": semantic_query,
            "data": [
                {
                    "superstore.category": "Technology",
                    "superstore.revenue": 14500.50,
                    "message": "Mock response: Add CUBE_API_URL to .env to fetch live records."
                }
            ],
            "error": None
        }

    headers = {
        "Authorization": f"Bearer {cube_token}" if not cube_token.startswith("Bearer ") else cube_token,
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
        
        # Enhanced Cube Error Messages (Requirement #7)
        if response.status_code != 200:
            try:
                err_detail = response.json().get("error", response.text)
            except Exception:
                err_detail = response.text

            return {
                "status": "error",
                "mode": "live",
                "generated_query": semantic_query,
                "data": [],
                "error": f"Cube API Error ({response.status_code}): {err_detail}"
            }

        res_data = response.json()
        return {
            "status": "success",
            "mode": "live",
            "generated_query": semantic_query,
            "data": res_data.get("data", []),
            "error": None
        }

    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "mode": "live",
            "generated_query": semantic_query,
            "data": [],
            "error": f"Cube API connection failed: {str(e)}"
        }


def answer_business_question(user_question: str) -> Dict[str, Any]:
    """Full pipeline execution: User Prompt -> LangChain -> Cube JSON -> Results."""
    semantic_json = get_semantic_query(user_question)
    
    if "error" in semantic_json:
        return {
            "status": "error",
            "mode": "unknown",
            "generated_query": semantic_json,
            "data": [],
            "error": semantic_json["error"]
        }

    return execute_cube_query(semantic_json)


if __name__ == "__main__":
    test_q = "Show total revenue by category for superstore"
    print(f"Testing Question: {test_q}\n")
    print(answer_business_question(test_q))