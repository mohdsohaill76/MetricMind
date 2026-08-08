"""SQLAlchemy model for persisted MetricMind reports."""

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for application-owned persistence models."""


class ReportRecord(Base):
    """Persist the complete generated report and its list metadata."""

    __tablename__ = "reports"
    __table_args__ = {"schema": "public"}

    report_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    dataset_quality: Mapped[str] = mapped_column(String(50), nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
