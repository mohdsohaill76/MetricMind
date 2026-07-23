"""Pydantic models for API request payloads."""

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """Request payload for submitting a chat question."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {"question": "What metrics should I track for customer retention?"}
            ]
        }
    )

    question: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="The question to send to MetricMind for analysis.",
        examples=["What metrics should I track for customer retention?"],
    )


class ChartGenerationRequest(BaseModel):
    """Request payload for chart generation."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "chart_type": "bar",
                    "x_column": "category",
                    "y_column": "sales",
                },
                {
                    "chart_type": "histogram",
                    "x_column": "response_time",
                },
            ]
        }
    )

    chart_type: str = Field(
        ...,
        min_length=1,
        description="The type of chart to generate.",
        examples=["bar", "histogram"],
    )
    x_column: str | None = Field(
        default=None,
        min_length=1,
        description="The column to use for the x-axis or distribution input.",
        examples=["category", "response_time"],
    )
    y_column: str | None = Field(
        default=None,
        min_length=1,
        description="The column to use for the y-axis when required by the chart type.",
        examples=["sales"],
    )
