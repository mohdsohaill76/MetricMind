"""PostgreSQL-backed storage for generated MetricMind reports."""

from app.models.response_models import ReportMetadata
from app.database import SessionLocal
from app.repositories.report_repository import ReportRepository


def save_report(report: dict) -> None:
    """Store a generated report, replacing any report with the same identifier."""
    with SessionLocal() as session:
        ReportRepository(session).save(report)


def get_report(report_id: str) -> dict | None:
    """Return a copy of one stored report, when available."""
    with SessionLocal() as session:
        return ReportRepository(session).get(report_id)


def get_all_reports() -> list[dict]:
    """Return copies of all stored reports in generation order."""
    with SessionLocal() as session:
        return ReportRepository(session).get_all()


def get_all_report_metadata() -> list[ReportMetadata]:
    """Return lightweight metadata for every stored report."""
    with SessionLocal() as session:
        return ReportRepository(session).get_all_metadata()


def clear_reports() -> None:
    """Remove all stored reports for test isolation."""
    with SessionLocal() as session:
        ReportRepository(session).clear()
