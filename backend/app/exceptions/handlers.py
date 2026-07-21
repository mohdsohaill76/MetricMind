"""Global exception handlers for the MetricMind API."""

import logging

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)


async def http_exception_handler(
    request: Request, exc: HTTPException
) -> JSONResponse:
    """Return a consistent JSON response for HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "HTTP Error", "message": exc.detail},
        headers=exc.headers,
    )


async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Log and safely respond to unhandled application exceptions."""
    logger.exception(
        "Unhandled exception while processing %s %s",
        request.method,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred.",
        },
    )
