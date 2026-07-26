"""Analytics summary service for MetricMind."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

import pandas as pd
from fastapi import HTTPException

from app.models.response_models import (
    AnalyticsSummaryResponse,
    CategoricalColumnAnalytics,
    NumericColumnAnalytics,
    ReportDatasetSummary,
)
from app.services.dataset_service import get_dataset, has_dataset
from app.services.report_service import _build_available_charts, _build_quality_assessment
from app.services.upload_service import _build_profile


def generate_analytics_summary() -> AnalyticsSummaryResponse:
    """Build analytics suitable for the Analytics page from the shared dataset."""
    dataset = _get_analytics_dataset()
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

    return AnalyticsSummaryResponse(
        total_rows=profile.shape["rows"],
        total_columns=profile.shape["columns"],
        numeric_columns=profile.numeric_columns,
        categorical_columns=profile.categorical_columns,
        total_missing_values=sum(profile.missing_values.values()),
        duplicate_rows=profile.duplicate_rows,
        memory_usage_bytes=profile.memory_usage_bytes,
        dataset_quality=report_summary.quality_assessment,
        available_charts=_build_available_charts(report_summary),
        generated_at=datetime.now(UTC),
        dataset_insights=_build_dataset_insights(dataset, profile, report_summary),
        numeric_analysis=_build_numeric_analysis(profile.numeric_summary),
        categorical_analysis=_build_categorical_analysis(dataset, profile.categorical_columns),
    )


def _get_analytics_dataset() -> pd.DataFrame | None:
    """Return the dataset used for analytics summary generation."""
    if not has_dataset():
        return None

    dataset = get_dataset()
    return dataset if not dataset.empty or list(dataset.columns) else None


def _build_numeric_analysis(
    numeric_summary: dict[str, dict[str, float]],
) -> dict[str, NumericColumnAnalytics]:
    """Map upload profiling statistics into analytics-friendly numeric models."""
    analytics: dict[str, NumericColumnAnalytics] = {}

    for column_name, summary in numeric_summary.items():
        analytics[column_name] = NumericColumnAnalytics(
            count=summary["count"],
            mean=summary["mean"],
            median=summary["50%"],
            standard_deviation=summary["std"],
            minimum=summary["min"],
            maximum=summary["max"],
            first_quartile=summary["25%"],
            third_quartile=summary["75%"],
        )

    return analytics


def _build_categorical_analysis(
    dataframe: pd.DataFrame,
    categorical_columns: list[str],
) -> dict[str, CategoricalColumnAnalytics]:
    """Build deterministic categorical analytics from the shared dataset."""
    analytics: dict[str, CategoricalColumnAnalytics] = {}

    for column_name in categorical_columns:
        series = dataframe[column_name]
        value_counts = series.value_counts(dropna=False)
        most_frequent_value: Any
        frequency = 0

        if not value_counts.empty:
            most_frequent_value = value_counts.index[0]
            frequency = int(value_counts.iloc[0])
        else:
            most_frequent_value = None

        if pd.isna(most_frequent_value):
            most_frequent_value = None

        analytics[column_name] = CategoricalColumnAnalytics(
            unique_values=int(series.nunique(dropna=True)),
            most_frequent_value=most_frequent_value,
            frequency=frequency,
        )

    return analytics


def _build_dataset_insights(
    dataframe: pd.DataFrame,
    profile: Any,
    report_summary: ReportDatasetSummary,
) -> list[str]:
    """Generate deterministic insights for the analytics page."""
    total_missing = sum(profile.missing_values.values())
    rows, columns = profile.shape["rows"], profile.shape["columns"]
    total_cells = rows * columns
    missing_rate = (total_missing / total_cells * 100) if total_cells else 0.0

    insights = [
        f"Dataset contains {rows} rows and {columns} columns.",
        report_summary.quality_assessment,
    ]

    if total_missing == 0:
        insights.append("Missing values are absent across the current dataset.")
    elif missing_rate <= 5:
        insights.append("Missing values are low and unlikely to materially affect most analyses.")
    elif missing_rate <= 20:
        insights.append("Missing values are moderate and should be reviewed before reporting.")
    else:
        insights.append("Missing values are high and may materially affect conclusions.")

    if profile.duplicate_rows == 0:
        insights.append("No duplicate rows were detected.")
    else:
        insights.append(f"Duplicate rows were detected ({profile.duplicate_rows}).")

    if profile.numeric_columns:
        insights.append(
            f"Numeric features available for analysis: {', '.join(profile.numeric_columns)}."
        )
    else:
        insights.append("No numeric features are available for quantitative analysis.")

    if profile.categorical_columns:
        insights.append(
            f"Categorical features available for segmentation: {', '.join(profile.categorical_columns)}."
        )
    else:
        insights.append("No categorical features are available for segmentation.")

    return insights