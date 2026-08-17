"""Synchronous SQLAlchemy database configuration for MetricMind."""

from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.config.settings import settings


engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)
"""Shared synchronous SQLAlchemy engine."""

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)
"""Factory for synchronous database sessions."""


def get_database_session() -> Generator[Session, None, None]:
    """Yield a database session and close it after the caller finishes."""
    database_session = SessionLocal()
    try:
        yield database_session
    finally:
        database_session.close()


def verify_database_connection() -> None:
    """Raise an exception when the configured PostgreSQL connection is unavailable."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
