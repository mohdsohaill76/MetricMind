"""Tests for LangChain-backed analytics tool handling."""

from collections.abc import Generator
import json
from types import SimpleNamespace
from typing import Any

import pandas as pd
import pytest

from app.services import ai_service, dataset_service


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test uses isolated shared dataset state."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


@pytest.fixture()
def sales_dataset() -> None:
    """Store compact source data for verified tool calls."""
    dataset_service.set_dataset(
        pd.DataFrame(
            {
                "Category": ["Technology", "Furniture", "Technology"],
                "Sales": [100.0, 200.0, 300.0],
                "Profit": [10.0, 20.0, 45.0],
            }
        )
    )


def test_analytics_tool_calls_verified_calculation(sales_dataset: None) -> None:
    from langchain_core.tools import tool

    analytics_tool = ai_service._build_analytics_tool(tool)
    result = analytics_tool.invoke({"operation": "SUM", "column": "Profit"})

    assert result == {
        "operation": "SUM",
        "column": "Profit",
        "filters": {},
        "result": 75.0,
        "rows_affected": 3,
    }


def test_analytics_tool_applies_filter(sales_dataset: None) -> None:
    result = ai_service.calculate_dataset_metric(
        "SUM", "Sales", {"Category": "Technology"}
    )

    assert result["result"] == 400.0
    assert result["rows_affected"] == 2


def test_analytics_tool_returns_grouped_sales_for_highest_category_question(
    sales_dataset: None,
) -> None:
    result = ai_service.calculate_dataset_metric("SUM", "Sales", group_by="Category")

    assert result["group_by"] == "Category"
    assert result["grouped_results"] == [
        {"group": "Technology", "result": 400.0, "rows_affected": 2},
        {"group": "Furniture", "result": 200.0, "rows_affected": 1},
    ]


def test_analytics_tool_supports_count_and_average(sales_dataset: None) -> None:
    assert ai_service.calculate_dataset_metric("COUNT")["result"] == 3
    assert ai_service.calculate_dataset_metric("AVG", "Profit")["result"] == 25.0


def test_analytics_tool_returns_safe_validation_error(sales_dataset: None) -> None:
    result = ai_service.calculate_dataset_metric("SUM", "Unknown")

    assert result == {"error": "Unknown column: Unknown."}


def test_analytics_tool_returns_safe_missing_dataset_error() -> None:
    result = ai_service.calculate_dataset_metric("COUNT")

    assert result == {"error": "No dataset has been uploaded."}


def test_tool_agent_provides_verified_tool_result_to_model(sales_dataset: None) -> None:
    class Prompt:
        def format_messages(self, **_: str) -> list[str]:
            return ["system prompt"]

    class ToolMessage:
        def __init__(self, content: str, tool_call_id: str) -> None:
            self.content = content
            self.tool_call_id = tool_call_id

    class Tool:
        name = "calculate_dataset_metric"

        def invoke(self, arguments: dict[str, Any]) -> dict[str, Any]:
            return ai_service.calculate_dataset_metric(**arguments)

    class Model:
        def __init__(self) -> None:
            self.calls: list[list[Any]] = []

        def invoke(self, messages: list[Any]) -> object:
            self.calls.append(messages.copy())
            if len(self.calls) == 1:
                return SimpleNamespace(
                    tool_calls=[
                        {
                            "id": "call-1",
                            "name": "calculate_dataset_metric",
                            "args": {
                                "operation": "SUM",
                                "column": "Sales",
                                "filters": {"Category": "Technology"},
                            },
                        }
                    ]
                )
            return SimpleNamespace(content="Verified Technology sales are 400.", tool_calls=[])

    model = Model()
    agent = ai_service._MetricMindToolAgent(Prompt(), model, Tool(), ToolMessage)

    response = agent.invoke({"input": "What are Technology sales?"})

    assert response.content == "Verified Technology sales are 400."
    tool_message = model.calls[1][-1]
    assert json.loads(tool_message.content)["result"] == 400.0
    assert json.loads(tool_message.content)["rows_affected"] == 2


def test_tool_agent_returns_final_response_after_grouped_tool_call(sales_dataset: None) -> None:
    class Prompt:
        def format_messages(self, **_: str) -> list[str]:
            return ["system prompt"]

    class ToolMessage:
        def __init__(self, content: str, tool_call_id: str) -> None:
            self.content = content
            self.tool_call_id = tool_call_id

    class Tool:
        name = "calculate_dataset_metric"

        def invoke(self, arguments: dict[str, Any]) -> dict[str, Any]:
            return ai_service.calculate_dataset_metric(**arguments)

    class Model:
        def __init__(self) -> None:
            self.calls: list[list[Any]] = []

        def invoke(self, messages: list[Any]) -> object:
            self.calls.append(messages.copy())
            if len(self.calls) == 1:
                return SimpleNamespace(
                    tool_calls=[
                        {
                            "id": "call-category-sales",
                            "name": "calculate_dataset_metric",
                            "args": {"operation": "SUM", "column": "Sales", "group_by": "Category"},
                        }
                    ]
                )
            return SimpleNamespace(
                content="Technology has the highest total sales: 400.", tool_calls=[]
            )

    model = Model()
    agent = ai_service._MetricMindToolAgent(Prompt(), model, Tool(), ToolMessage)

    response = agent.invoke({"input": "Which product category has the highest total sales?"})

    assert response.content == "Technology has the highest total sales: 400."
    tool_message = model.calls[1][-1]
    assert tool_message.tool_call_id == "call-category-sales"
    assert json.loads(tool_message.content)["grouped_results"][0]["result"] == 400.0


def test_tool_agent_allows_a_final_response_after_three_tool_rounds(
    sales_dataset: None,
) -> None:
    class Prompt:
        def format_messages(self, **_: str) -> list[str]:
            return ["system prompt"]

    class ToolMessage:
        def __init__(self, content: str, tool_call_id: str) -> None:
            self.content = content
            self.tool_call_id = tool_call_id

    class Tool:
        name = "calculate_dataset_metric"

        def invoke(self, arguments: dict[str, Any]) -> dict[str, Any]:
            return ai_service.calculate_dataset_metric(**arguments)

    class Model:
        def __init__(self) -> None:
            self.call_count = 0

        def invoke(self, _: list[Any]) -> object:
            self.call_count += 1
            if self.call_count <= 3:
                return SimpleNamespace(
                    tool_calls=[
                        {
                            "id": f"call-{self.call_count}",
                            "name": "calculate_dataset_metric",
                            "args": {"operation": "COUNT"},
                        }
                    ]
                )
            return SimpleNamespace(content="Verified answer.", tool_calls=[])

    model = Model()
    agent = ai_service._MetricMindToolAgent(Prompt(), model, Tool(), ToolMessage)

    assert agent.invoke({"input": "Verify the data."}).content == "Verified answer."
    assert model.call_count == 4


def test_generate_response_uses_existing_agent_chain(monkeypatch: pytest.MonkeyPatch) -> None:
    class Agent:
        def invoke(self, values: dict[str, str]) -> object:
            assert values == {"input": "How is retention trending?"}
            return SimpleNamespace(content="Retention is improving.")

    monkeypatch.setattr(ai_service, "_get_agent_chain", lambda: Agent())

    assert ai_service.generate_response("How is retention trending?") == "Retention is improving."


def test_generate_report_insights_calls_groq_and_returns_structured_output(monkeypatch: pytest.MonkeyPatch) -> None:
    """generate_report_insights uses ChatGroq with structured output and returns the parsed dict."""
    monkeypatch.setattr(ai_service.settings, "GROQ_API_KEY", "mock-groq-key")

    from langchain_core.runnables import Runnable

    class MockStructuredLLM(Runnable):
        def invoke(self, inputs: Any, config: Any = None, **kwargs: Any) -> Any:
            return ai_service.ReportInsights(
                key_insights=["Mocked AI Insight"],
                recommendations=["Mocked AI Recommendation"]
            )

    class MockChatGroq:
        def __init__(self, *args, **kwargs) -> None:
            assert kwargs["request_timeout"] == ai_service.REPORT_INSIGHTS_TIMEOUT_SECONDS
            assert kwargs["max_retries"] == 0

        def with_structured_output(self, schema: Any) -> Any:
            assert schema is ai_service.ReportInsights
            return MockStructuredLLM()

    import sys
    from types import ModuleType

    # Save original modules
    orig_langchain_groq = sys.modules.get("langchain_groq")
    orig_langchain_core_prompts = sys.modules.get("langchain_core.prompts")

    try:
        # Create mock langchain_groq module
        mock_langchain_groq = ModuleType("langchain_groq")
        mock_langchain_groq.ChatGroq = MockChatGroq
        sys.modules["langchain_groq"] = mock_langchain_groq

        # Create mock langchain_core.prompts module
        from langchain_core.prompts import ChatPromptTemplate
        mock_langchain_core_prompts = ModuleType("langchain_core.prompts")
        mock_langchain_core_prompts.ChatPromptTemplate = ChatPromptTemplate
        sys.modules["langchain_core.prompts"] = mock_langchain_core_prompts

        summary = {"shape": {"rows": 100, "columns": 5}}
        result = ai_service.generate_report_insights(summary, "test focus")

        assert result == {
            "key_insights": ["Mocked AI Insight"],
            "recommendations": ["Mocked AI Recommendation"]
        }
    finally:
        # Restore original modules
        if orig_langchain_groq is not None:
            sys.modules["langchain_groq"] = orig_langchain_groq
        else:
            sys.modules.pop("langchain_groq", None)

        if orig_langchain_core_prompts is not None:
            sys.modules["langchain_core.prompts"] = orig_langchain_core_prompts
        else:
            sys.modules.pop("langchain_core.prompts", None)
