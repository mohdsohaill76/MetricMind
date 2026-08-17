"""PostgreSQL persistence operations for generated reports."""

from copy import deepcopy
from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report_model import ReportRecord
from app.models.response_models import ReportMetadata


class ReportRepository:
    """Persist and retrieve reports using the application-owned public.reports table."""

    def __init__(self, session: Session) -> None:
        """Initialize the repository with an active synchronous database session."""
        self._session = session

    def save(self, report: dict[str, Any]) -> None:
        """Create or replace a report with the supplied identifier."""
        record = ReportRecord(
            report_id=report["report_id"],
            generated_at=_as_datetime(report["generated_at"]),
            status=report["status"],
            dataset_quality=report.get("dataset_quality", "Unknown"),
            payload=deepcopy(report),
        )
        self._session.merge(record)
        self._session.commit()

    def get(self, report_id: str) -> dict[str, Any] | None:
        """Return the full persisted report, when it exists."""
        record = self._session.get(ReportRecord, report_id)
        return deepcopy(record.payload) if record is not None else None

    def get_all(self) -> list[dict[str, Any]]:
        """Return complete reports in stable generation order."""
        records = self._session.scalars(
            select(ReportRecord).order_by(ReportRecord.generated_at, ReportRecord.report_id)
        ).all()
        return [deepcopy(record.payload) for record in records]

    def get_all_metadata(self) -> list[ReportMetadata]:
        """Return lightweight metadata for all persisted reports."""
        records = self._session.scalars(
            select(ReportRecord).order_by(ReportRecord.generated_at, ReportRecord.report_id)
        ).all()
        return [
            ReportMetadata(
                report_id=record.report_id,
                generated_at=record.generated_at,
                status=record.status,
                dataset_quality=record.dataset_quality,
            )
            for record in records
        ]

    def clear(self) -> None:
        """Remove all persisted reports for test isolation."""
        for record in self._session.scalars(select(ReportRecord)).all():
            self._session.delete(record)
        self._session.commit()


def _as_datetime(value: datetime | str) -> datetime:
    """Normalize serialized report timestamps for PostgreSQL storage."""
    if isinstance(value, datetime):
        return value

    return datetime.fromisoformat(value.replace("Z", "+00:00"))
