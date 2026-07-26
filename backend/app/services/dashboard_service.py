"""Dashboard summary service for MetricMind."""

from __future__ import annotations

from datetime import UTC, datetime

import pandas as pd
from fastapi import HTTPException

from app.models.response_models import (
    DashboardSummaryResponse,
    ReportDatasetSummary,
)
from app.services.dataset_service import get_dataset, has_dataset
from app.services.report_service import (
    _build_available_charts,
    _build_quality_assessment,
)
from app.services.upload_service import _build_profile


def generate_dashboard_summary() -> DashboardSummaryResponse:
    """Build a high-level dashboard summary from the shared dataset."""
    dataset = _get_dashboard_dataset()
    if dataset is None:
        raise HTTPException(status_code=400, detail="No dataset has been uploaded.")

    profile = _build_profile(dataset)
    report_summary = ReportDatasetSummary(
        shape=profile.shape,
        missing_values=profile.missing_values,
        missing_percentage=profile.missing_percentage,
        dtypes=profile.dtypes,
        numeric_columns=profile.numeric_columns,
        categorical_columns=profile.categorical_columns,
        unique_values=profile.unique_values,
        duplicate_rows=profile.duplicate_rows,
        memory_usage_bytes=profile.memory_usage_bytes,
        numeric_summary=profile.numeric_summary,
        quality_assessment=_build_quality_assessment(
            dataframe=dataset,
            missing_values=profile.missing_values,
            duplicate_rows=profile.duplicate_rows,
        ),
    )

    return DashboardSummaryResponse(
        total_rows=profile.shape["rows"],
        total_columns=profile.shape["columns"],
        numeric_columns_count=len(profile.numeric_columns),
        categorical_columns_count=len(profile.categorical_columns),
        duplicate_rows=profile.duplicate_rows,
        missing_values_total=sum(profile.missing_values.values()),
        memory_usage_bytes=profile.memory_usage_bytes,
        dataset_quality=report_summary.quality_assessment,
        upload_status="uploaded",
        available_charts=_build_available_charts(report_summary),
        generated_at=datetime.now(UTC),
    )


def _get_dashboard_dataset() -> pd.DataFrame | None:
    """Return the dataset used for dashboard summary generation."""
    if not has_dataset():
        return None

    dataset = get_dataset()
    return dataset if not dataset.empty or list(dataset.columns) else None