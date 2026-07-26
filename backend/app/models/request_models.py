"""Pydantic models for API request payloads."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


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


class ReportGenerationRequest(BaseModel):
    """Optional request payload for AI report generation."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {"report_focus": "sales performance and data quality"}
            ]
        }
    )

    report_focus: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Optional focus area to guide future report-generation logic.",
        examples=["sales performance and data quality"],
    )


class UserRegistrationRequest(BaseModel):
    """Request payload for creating a MetricMind user."""

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLoginRequest(BaseModel):
    """Request payload for authenticating a MetricMind user."""

    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1, max_length=128)


class UserUpdateRequest(BaseModel):
    """Request payload for updating the authenticated user's profile."""

    username: str | None = Field(default=None, min_length=3, max_length=50)
    email: EmailStr | None = None

    @model_validator(mode="after")
    def require_profile_change(self) -> "UserUpdateRequest":
        """Require at least one profile field to be supplied."""
        if self.username is None and self.email is None:
            raise ValueError("At least one of username or email must be provided.")
        return self


class ChangePasswordRequest(BaseModel):
    """Request payload for changing the authenticated user's password."""

    current_password: str = Field(..., min_length=1, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)
