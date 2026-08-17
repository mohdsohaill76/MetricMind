"""LangChain-backed AI response generation for MetricMind."""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any, Callable, Final

from fastapi import HTTPException, status

from pydantic import BaseModel, Field

from app.config.settings import settings
from app.services.dataset_operations_service import calculate_metric

logger = logging.getLogger(__name__)


REPORT_INSIGHTS_TIMEOUT_SECONDS: Final[float] = 30.0


def calculate_dataset_metric(
    operation: str,
    column: str | None = None,
    filters: dict[str, Any] | None = None,
    group_by: str | None = None,
) -> dict[str, Any]:
    """Calculate a verified metric from the full uploaded dataset.

    Use this for exact totals, averages, counts, minimums, or maximums. Filters
    are equality comparisons such as ``{"Category": "Technology"}``. Set
    ``group_by`` to an uploaded column when the question requires comparing an
    aggregate across groups, such as total sales by category.
    """
    try:
        calculation = calculate_metric(operation, column, filters, group_by)
    except HTTPException as exc:
        return {"error": str(exc.detail)}

    result: dict[str, Any] = {
        "operation": calculation.operation,
        "column": calculation.column,
        "filters": calculation.filters,
        "result": calculation.result,
        "rows_affected": calculation.rows_affected,
    }
    if calculation.group_by is not None:
        result["group_by"] = calculation.group_by
        result["grouped_results"] = [
            {
                "group": grouped_result.group,
                "result": grouped_result.result,
                "rows_affected": grouped_result.rows_affected,
            }
            for grouped_result in calculation.grouped_results
        ]
    return result


class _MetricMindToolAgent:
    """Execute LangChain tool calls and provide their verified results to the model."""

    def __init__(self, prompt: Any, model: Any, tool: Any, tool_message_class: Any) -> None:
        self._prompt = prompt
        self._model = model
        self._tool = tool
        self._tool_message_class = tool_message_class

    def invoke(self, values: dict[str, str]) -> Any:
        """Run the model, executing analytics tool calls until it returns an answer."""
        messages = self._prompt.format_messages(input=values["input"])

        # A model may need to recover from a validation error or make a follow-up
        # calculation. Keep the bounded loop, but allow enough turns for that.
        for _ in range(6):
            response = self._model.invoke(messages)
            tool_calls = getattr(response, "tool_calls", [])
            if not tool_calls:
                return response

            messages.append(response)
            for tool_call in tool_calls:
                tool_result = self._run_tool_call(tool_call)
                messages.append(
                    self._tool_message_class(
                        content=json.dumps(tool_result, default=str),
                        tool_call_id=tool_call["id"],
                    )
                )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="MetricMind AI could not complete the requested analysis.",
        )

    def _run_tool_call(self, tool_call: dict[str, Any]) -> dict[str, Any]:
        """Execute only the registered analytics tool and return a safe result."""
        if tool_call.get("name") != self._tool.name:
            return {"error": "The requested analysis tool is unavailable."}

        try:
            return self._tool.invoke(tool_call.get("args", {}))
        except Exception:
            return {"error": "The requested metric calculation could not be completed."}


def _build_analytics_tool(tool_factory: Callable[..., Any]) -> Any:
    """Create the LangChain tool around the verified operations service."""
    return tool_factory("calculate_dataset_metric")(calculate_dataset_metric)


@lru_cache(maxsize=1)
def _get_agent_chain():
    """Build the existing MetricMind LangChain/Groq agent on first use."""
    try:
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_core.messages import ToolMessage
        from langchain_core.tools import tool
        from langchain_groq import ChatGroq
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI dependencies are not installed.",
        ) from exc

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the MetricMind AI Agent. Answer the user's question using the "
                "provided semantic-layer dataset context when it is available. For greetings, "
                "small talk, or general conversational questions such as 'hello', 'hi', "
                "'how are you?', or 'who are you?', respond directly and politely as the "
                "MetricMind AI Assistant. Do NOT invoke any dataset analysis tool for these "
                "messages. For any question that requires an exact dataset value, use the "
                "calculate_dataset_metric tool. Never calculate from sample rows or "
                "invent totals, averages, counts, minimums, or maximums. If the tool "
                "cannot provide the requested value, explain that clearly. For a "
                "comparison across categories or other groups, make one tool call with "
                "group_by set to that column and compare the returned grouped_results. "
                "Do not write raw SQL.",
            ),
            ("user", "{input}"),
        ]
    )
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI is not configured. Set GROQ_API_KEY to enable chat.",
        )
    has_api_key = bool(settings.GROQ_API_KEY)
    logger.info("Initializing ChatGroq agent: model=%s, has_api_key=%s", "openai/gpt-oss-120b", has_api_key)
    try:
        llm = ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI is not configured. Set GROQ_API_KEY to enable chat.",
        ) from exc

    analytics_tool = _build_analytics_tool(tool)
    return _MetricMindToolAgent(
        prompt=prompt,
        model=llm.bind_tools([analytics_tool]),
        tool=analytics_tool,
        tool_message_class=ToolMessage,
    )


def generate_response(question: str) -> str:
    """Generate a LangChain response for a semantically processed question.

    Args:
        question: The user's chat question.

    Returns:
        The generated response text.
    """
    try:
        response = _get_agent_chain().invoke({"input": question})
        content = getattr(response, "content", response)
        return str(content)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"MetricMind AI service error: {exc}",
        ) from exc


class ReportInsights(BaseModel):
    """Structured insights and recommendations for the business report."""

    key_insights: list[str] = Field(
        ...,
        description="A list of executive key insights extracted from the dataset summary and quality metrics.",
    )
    recommendations: list[str] = Field(
        ...,
        description="A list of actionable next-step recommendations for the business.",
    )


def generate_report_insights(
    dataset_summary: dict[str, Any],
    focus: str | None = None,
) -> dict[str, list[str]]:
    """Generate AI-powered insights and recommendations for the business report."""
    try:
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_groq import ChatGroq
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI dependencies are not installed.",
        ) from exc

    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI is not configured. Set GROQ_API_KEY to generate report.",
        )

    has_api_key = bool(settings.GROQ_API_KEY)
    logger.info("Initializing ChatGroq report insights: model=%s, has_api_key=%s", "openai/gpt-oss-120b", has_api_key)
    try:
        llm = ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY,
            request_timeout=REPORT_INSIGHTS_TIMEOUT_SECONDS,
            max_retries=0,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MetricMind AI is not configured. Set GROQ_API_KEY to generate report.",
        ) from exc

    structured_llm = llm.with_structured_output(ReportInsights)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the MetricMind AI Agent. Analyze the provided dataset summary "
                "and quality metrics. Generate key executive insights (at least 3 insights) "
                "and actionable business recommendations (at least 3 recommendations). "
                "The insights must highlight interesting attributes of the dataset "
                "like its size, missing values, duplicates, and column distributions. "
                "If the user specifies a particular focus area, customize the insights "
                "and recommendations to address that focus area.",
            ),
            (
                "user",
                "Dataset Summary:\n{dataset_summary}\n\n"
                "User Focus Area: {focus}\n",
            ),
        ]
    )

    chain = prompt | structured_llm
    result = chain.invoke(
        {
            "dataset_summary": json.dumps(dataset_summary, default=str),
            "focus": focus or "General analysis",
        }
    )

    return {
        "key_insights": result.key_insights,
        "recommendations": result.recommendations,
    }

