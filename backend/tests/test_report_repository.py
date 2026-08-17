"""Integration tests for PostgreSQL report persistence."""

from collections.abc import Generator
from datetime import UTC, datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session, sessionmaker

from app.config.settings import settings
from app.models.report_model import Base
from app.repositories.report_repository import ReportRepository


@pytest.fixture()
def database_session() -> Generator[Session, None, None]:
    """Provide an isolated PostgreSQL session for report repository tests."""
    engine = create_engine(settings.TEST_DATABASE_URL, pool_pre_ping=True)
    try:
        with engine.connect():
            pass
    except OperationalError:
        pytest.skip("TEST_DATABASE_URL is not connected to an available PostgreSQL database.")

    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    try:
        ReportRepository(session).clear()
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


def test_report_repository_persists_and_retrieves_report(database_session: Session) -> None:
    """A persisted report retains its full API payload and list metadata."""
    report = _report("report-persisted")
    repository = ReportRepository(database_session)

    repository.save(report)

    assert repository.get("report-persisted") == report
    assert repository.get_all_metadata()[0].model_dump() == {
        "report_id": "report-persisted",
        "generated_at": datetime(2026, 7, 25, 12, 0, tzinfo=UTC),
        "status": "completed",
        "dataset_quality": "Good",
    }


def test_report_repository_replaces_matching_report_id(database_session: Session) -> None:
    """Saving an existing report identifier replaces its stored payload."""
    repository = ReportRepository(database_session)
    repository.save(_report("report-replaced"))
    replacement = _report("report-replaced")
    replacement["status"] = "updated"

    repository.save(replacement)

    assert repository.get("report-replaced") == replacement


def _report(report_id: str) -> dict:
    """Build a valid persisted-report payload."""
    return {
        "report_id": report_id,
        "generated_at": "2026-07-25T12:00:00Z",
        "dataset_quality": "Good",
        "dataset_summary": {
            "shape": {"rows": 1, "columns": 1},
            "missing_values": {"sales": 0},
            "missing_percentage": {"sales": 0.0},
            "dtypes": {"sales": "int64"},
            "numeric_columns": ["sales"],
            "categorical_columns": [],
            "unique_values": {"sales": 1},
            "duplicate_rows": 0,
            "memory_usage_bytes": 140,
            "numeric_summary": {},
            "quality_assessment": "Dataset quality is strong with no missing values or duplicate rows.",
        },
        "key_insights": [],
        "recommendations": [],
        "charts_available": ["histogram"],
        "status": "completed",
    }
