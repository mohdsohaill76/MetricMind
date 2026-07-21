"""Pydantic models for API response payloads."""

from typing import Any

from pydantic import BaseModel


class ChatResponse(BaseModel):
    """Response payload containing the generated chat response."""

    response: str


class UploadResponse(BaseModel):
    """Response payload containing a CSV dataset preview."""

    filename: str
    rows: int
    columns: int
    column_names: list[str]
    preview: list[dict[str, Any]]
