"""HTTP routes for the MetricMind API."""

from typing import Dict

from fastapi import APIRouter


router = APIRouter()


@router.get("/", response_model=Dict[str, str])
async def read_root() -> Dict[str, str]:
    """Return the MetricMind backend welcome message."""
    return {"message": "Welcome to MetricMind Backend"}


@router.get("/health", response_model=Dict[str, str])
async def health_check() -> Dict[str, str]:
    """Return the current health status of the application."""
    return {"status": "healthy"}
