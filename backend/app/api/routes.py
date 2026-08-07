"""HTTP routes for the MetricMind API."""

import logging
from typing import Annotated, Dict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.models.request_models import (
    ChatRequest,
    ChartGenerationRequest,
    ChangePasswordRequest,
    ReportGenerationRequest,
    UserLoginRequest,
    UserRegistrationRequest,
    UserUpdateRequest,
)
from app.models.response_models import (
    AnalyticsSummaryResponse,
    ChatResponse,
    ChartGenerationResponse,
    DashboardSummaryResponse,
    MessageResponse,
    ReportGenerationResponse,
    ReportResponse,
    ReportsListResponse,
    RegistrationResponse,
    TokenResponse,
    UserUpdateResponse,
    UploadResponse,
    UserResponse,
)
from app.services.ai_service import generate_response
from app.services.analytics_service import generate_analytics_summary
from app.services.chart_service import generate_chart
from app.services.dashboard_service import generate_dashboard_summary
from app.services.jwt_service import create_access_token, verify_access_token
from app.services.report_service import generate_report
from app.services.report_storage_service import get_all_report_metadata, get_report
from app.services.semantic_service import process_question
from app.services.upload_service import process_upload
from app.services.user_service import (
    authenticate_user,
    change_password,
    delete_user,
    get_user,
    register_user,
    update_user,
)

router = APIRouter(prefix="/api/v1")
logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=False)


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


def _credentials_exception() -> HTTPException:
    """Build the standard unauthenticated response."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.get(
    "/auth/me",
    response_model=UserResponse,
    summary="Get the authenticated user",
)
async def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> UserResponse:
    """Return the user represented by a valid bearer token."""
    if credentials is None:
        raise _credentials_exception()

    username = verify_access_token(credentials.credentials)
    user = get_user(username)
    if user is None:
        raise _credentials_exception()

    return user


AuthenticatedUser = Annotated[UserResponse, Depends(get_authenticated_user)]


@router.post("/chart", response_model=ChartGenerationResponse)
async def chart(
    request: ChartGenerationRequest,
    user: AuthenticatedUser,
) -> ChartGenerationResponse:
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
async def dashboard_summary(user: AuthenticatedUser) -> DashboardSummaryResponse:
    """Return the current dashboard summary for the uploaded dataset."""
    return generate_dashboard_summary()


@router.get(
    "/analytics/summary",
    response_model=AnalyticsSummaryResponse,
    summary="Get an analytics summary for the uploaded dataset",
    description=(
        "Return analytical information for the currently uploaded dataset using the shared "
        "dataset service and existing profiling logic."
    ),
)
async def analytics_summary(user: AuthenticatedUser) -> AnalyticsSummaryResponse:
    """Return the current analytics summary for the uploaded dataset."""
    return generate_analytics_summary()


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
    user: AuthenticatedUser,
    request: ReportGenerationRequest | None = None,
) -> ReportGenerationResponse:
    """Return a structured report derived from the uploaded dataset."""
    return generate_report(request)


@router.get(
    "/reports",
    response_model=ReportsListResponse,
    summary="List generated reports",
    description=(
        "Return lightweight metadata for all reports generated during this application run."
    ),
)
async def list_reports(user: AuthenticatedUser) -> ReportsListResponse:
    """Return metadata for all stored reports."""
    metadata = get_all_report_metadata()
    return ReportsListResponse(count=len(metadata), reports=metadata)


@router.get(
    "/reports/{report_id}",
    response_model=ReportResponse,
    summary="Get a generated report",
    description="Return the complete report for the requested report identifier.",
)
async def get_stored_report(report_id: str, user: AuthenticatedUser) -> ReportResponse:
    """Return one complete stored report."""
    report = get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found.")

    return ReportResponse.model_validate(report)


@router.post(
    "/auth/register",
    response_model=RegistrationResponse,
    status_code=201,
    summary="Register a new user",
)
async def register(request: UserRegistrationRequest) -> RegistrationResponse:
    """Register a user in the in-memory user store."""
    user = register_user(request)
    return RegistrationResponse(message="User registered successfully.", user=user)


@router.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Authenticate and receive an access token",
)
async def login(request: UserLoginRequest) -> TokenResponse:
    """Validate credentials and issue a JWT bearer access token."""
    user = authenticate_user(request.username, request.password)
    return TokenResponse(
        access_token=create_access_token(user.username),
        token_type="bearer",
    )


@router.get(
    "/users/me",
    response_model=UserResponse,
    summary="Get the authenticated user's profile",
)
async def get_my_profile(user: AuthenticatedUser) -> UserResponse:
    """Return the authenticated user's profile."""
    return user


@router.put(
    "/users/me",
    response_model=UserUpdateResponse,
    response_model_exclude_none=True,
    summary="Update the authenticated user's profile",
)
async def update_my_profile(
    request: UserUpdateRequest,
    user: AuthenticatedUser,
) -> UserUpdateResponse:
    """Update the authenticated user's username and/or email."""
    updated_user = update_user(user.username, request)
    if updated_user.username == user.username:
        return UserUpdateResponse(**updated_user.model_dump())

    return UserUpdateResponse(
        **updated_user.model_dump(),
        access_token=create_access_token(updated_user.username),
        token_type="bearer",
    )


@router.put(
    "/users/change-password",
    response_model=MessageResponse,
    summary="Change the authenticated user's password",
)
async def change_my_password(
    request: ChangePasswordRequest,
    user: AuthenticatedUser,
) -> MessageResponse:
    """Change the authenticated user's password after current-password verification."""
    change_password(user.username, request)
    return MessageResponse(message="Password changed successfully.")


@router.delete(
    "/users/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete the authenticated user",
)
async def delete_my_profile(user: AuthenticatedUser) -> None:
    """Delete the authenticated user from the in-memory store."""
    delete_user(user.username)


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(
    file: Annotated[UploadFile, File(...)],
    user: AuthenticatedUser,
) -> UploadResponse:
    """Return a preview of an uploaded CSV dataset."""
    return await process_upload(file)
