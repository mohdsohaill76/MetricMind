"""HTTP routes for the MetricMind API."""

from typing import Dict

from fastapi import APIRouter

from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse
from app.services.ai_service import generate_response

router = APIRouter()


@router.get("/", response_model=Dict[str, str])
async def read_root() -> Dict[str, str]:
    """Return the MetricMind backend welcome message."""
    return {"message": "Welcome to MetricMind Backend"}


@router.get("/health", response_model=Dict[str, str])
async def health_check() -> Dict[str, str]:
    """Return the current health status of the application."""
    return {"status": "healthy"}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Return a response to the submitted chat question."""
    return ChatResponse(response=generate_response(request.question))
