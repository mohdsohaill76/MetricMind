"""Pydantic models for API response payloads."""

from typing import Any

from pydantic import BaseModel


class ChatResponse(BaseModel):
    """Response payload containing the generated chat response."""

    response: str


class UploadProfile(BaseModel):
    """Dataset profiling details for an uploaded CSV."""

    shape: dict[str, int]
    missing_values: dict[str, int]
    missing_percentage: dict[str, float]
    dtypes: dict[str, str]
    numeric_columns: list[str]
    categorical_columns: list[str]
    unique_values: dict[str, int]
    duplicate_rows: int
    memory_usage_bytes: int
    numeric_summary: dict[str, dict[str, float]]


class UploadResponse(BaseModel):
    """Response payload containing a CSV dataset preview."""

    filename: str
    rows: int
    columns: int
    column_names: list[str]
    preview: list[dict[str, Any]]
    profile: UploadProfile
