"""HTTP routes for the MetricMind API."""

import logging
from typing import Annotated, Dict

from fastapi import APIRouter, File, UploadFile

from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse, UploadResponse
from app.services.ai_service import generate_response
from app.services.semantic_service import process_question
from app.services.upload_service import process_upload

router = APIRouter(prefix="/api/v1")
logger = logging.getLogger(__name__)


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
    logger.info("Received chat request")
    processed_question = process_question(request.question)
    response = generate_response(processed_question)
    logger.info("Chat response generated successfully")
    return ChatResponse(response=response)


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: Annotated[UploadFile, File(...)]) -> UploadResponse:
    """Return a preview of an uploaded CSV dataset."""
    return await process_upload(file)
