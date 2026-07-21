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
