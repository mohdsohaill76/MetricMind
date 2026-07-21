"""Pydantic models for API response payloads."""

from pydantic import BaseModel


class ChatResponse(BaseModel):
    """Response payload containing the generated chat response."""

    response: str


class UploadResponse(BaseModel):
    """Response payload containing an uploaded file name."""

    filename: str
