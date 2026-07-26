"""FastAPI application entry point for MetricMind."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import router
from app.config.settings import settings
from app.exceptions.handlers import (
    http_exception_handler,
    unhandled_exception_handler,
)
from app.middleware.request_logging import RequestLoggingMiddleware


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Run application lifecycle tasks."""
    logger.info("MetricMind backend starting...")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

"""The FastAPI application instance."""


# ---------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------

app.add_exception_handler(
    HTTPException,
    http_exception_handler,
)

app.add_exception_handler(
    StarletteHTTPException,
    http_exception_handler,
)

app.add_exception_handler(
    Exception,
    unhandled_exception_handler,
)


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.42.161.14:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Request Logging
# ---------------------------------------------------------

app.add_middleware(
    RequestLoggingMiddleware
)


# ---------------------------------------------------------
# Generated Charts
# ---------------------------------------------------------

GENERATED_CHARTS_DIRECTORY = (
    Path(__file__).resolve().parents[1]
    / "generated_charts"
)

GENERATED_CHARTS_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)

app.mount(
    "/generated_charts",
    StaticFiles(
        directory=GENERATED_CHARTS_DIRECTORY
    ),
    name="generated_charts",
)


# ---------------------------------------------------------
# API Routes
# ---------------------------------------------------------

app.include_router(router)
