"""Pydantic models for API request payloads."""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Request payload for submitting a chat question."""

    question: str
