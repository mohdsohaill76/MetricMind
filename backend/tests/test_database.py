"""Tests for the synchronous SQLAlchemy database foundation."""

from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database import SessionLocal, engine, get_database_session


def test_database_configuration_uses_postgresql_psycopg_url() -> None:
    """The configured database URL targets PostgreSQL through psycopg."""
    url = make_url(settings.DATABASE_URL)

    assert url.drivername == "postgresql+psycopg"
    assert settings.TEST_DATABASE_URL == settings.DATABASE_URL


def test_session_factory_creates_a_synchronous_session() -> None:
    """The session factory creates a session without connecting eagerly."""
    database_session = SessionLocal()
    try:
        assert isinstance(database_session, Session)
        assert database_session.bind is engine
    finally:
        database_session.close()


def test_database_session_dependency_yields_a_session() -> None:
    """The service-compatible dependency yields and closes a session."""
    dependency = get_database_session()
    database_session = next(dependency)

    assert isinstance(database_session, Session)
    dependency.close()
