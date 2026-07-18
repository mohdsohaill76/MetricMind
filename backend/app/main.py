"""FastAPI application entry point for MetricMind."""

import logging

from fastapi import FastAPI

from app.api.routes import router


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="MetricMind Backend")
"""The FastAPI application instance."""

app.include_router(router)


@app.on_event("startup")
async def log_startup() -> None:
    """Log application startup."""
    logger.info("MetricMind backend starting...")
