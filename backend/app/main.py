"""FastAPI application entry point for MetricMind."""

from fastapi import FastAPI

from app.api.routes import router


app = FastAPI(title="MetricMind Backend")
"""The FastAPI application instance."""

app.include_router(router)
