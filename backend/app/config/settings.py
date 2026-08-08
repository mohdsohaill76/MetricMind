"""Centralized application configuration."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables and ``.env``."""

    APP_NAME: str = "MetricMind Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CHART_RETENTION_HOURS: int = 24
    DATABASE_URL: str
    TEST_DATABASE_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
