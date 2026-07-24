"""HTTP routes for the MetricMind API."""

import logging
from typing import Annotated, Dict

from fastapi import APIRouter, File, UploadFile

from app.models.request_models import (
    ChatRequest,
    ChartGenerationRequest,
    ReportGenerationRequest,
)
from app.models.response_models import (
    ChatResponse,
    ChartGenerationResponse,
    DashboardSummaryResponse,
    ReportGenerationResponse,
    UploadResponse,
)
from app.services.chart_service import generate_chart
from app.services.ai_service import generate_response
from app.services.dashboard_service import generate_dashboard_summary
from app.services.report_service import generate_report
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


@router.post("/chart", response_model=ChartGenerationResponse)
async def chart(request: ChartGenerationRequest) -> ChartGenerationResponse:
    """Return chart metadata for the requested chart configuration."""
    return generate_chart(request)


@router.get(
    "/dashboard/summary",
    response_model=DashboardSummaryResponse,
    summary="Get a dashboard summary for the uploaded dataset",
    description=(
        "Return a high-level summary of the currently uploaded dataset using the shared "
        "dataset service and existing profiling logic."
    ),
)
async def dashboard_summary() -> DashboardSummaryResponse:
    """Return the current dashboard summary for the uploaded dataset."""
    return generate_dashboard_summary()


@router.post(
    "/ai/generate-report",
    response_model=ReportGenerationResponse,
    summary="Generate a business report from the uploaded dataset",
    description=(
        "Build a deterministic, structured business report from the shared dataset. "
        "This endpoint does not call an external AI service yet."
    ),
)
async def generate_ai_report(
    request: ReportGenerationRequest | None = None,
) -> ReportGenerationResponse:
    """Return a structured report derived from the uploaded dataset."""
    return generate_report(request)


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: Annotated[UploadFile, File(...)]) -> UploadResponse:
    """Return a preview of an uploaded CSV dataset."""
    return await process_upload(file)
