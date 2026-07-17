"""Pydantic models for API response payloads."""

from pydantic import BaseModel


class ChatResponse(BaseModel):
    """Response payload containing the generated chat response."""

    response: str
