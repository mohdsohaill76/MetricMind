"""AI report generation service for MetricMind."""

from __future__ import annotations

from datetime import UTC, datetime
from hashlib import sha256
from typing import Final

import pandas as pd
from fastapi import HTTPException

from app.models.request_models import ReportGenerationRequest
from app.models.response_models import (
    ReportDatasetSummary,
    ReportGenerationResponse,
)
from app.services.dataset_service import get_dataset, has_dataset


SUPPORTED_CHART_TYPES: Final[list[str]] = ["histogram", "box", "bar", "line", "scatter"]


def generate_report(
    request: ReportGenerationRequest | None = None,
) -> ReportGenerationResponse:
    """Build a deterministic business report from the shared dataset."""
    dataset = _get_report_dataset()
    if dataset is None:
        raise HTTPException(status_code=400, detail="No dataset has been uploaded.")

    dataset_summary = _build_dataset_summary(dataset)
    key_insights = _build_key_insights(dataset_summary, request)
    recommendations = _build_recommendations(dataset_summary)

    return ReportGenerationResponse(
        report_id=_build_report_id(dataset),
        generated_at=datetime.now(UTC),
        dataset_summary=dataset_summary,
        key_insights=key_insights,
        recommendations=recommendations,
        charts_available=_build_available_charts(dataset_summary),
        status="completed",
    )


def _get_report_dataset() -> pd.DataFrame | None:
    """Return the dataset used for report generation."""
    if not has_dataset():
        return None

    dataset = get_dataset()
    return dataset if not dataset.empty or list(dataset.columns) else None


def _build_dataset_summary(dataframe: pd.DataFrame) -> ReportDatasetSummary:
    """Build a report-friendly summary for the shared dataset."""
    numeric_frame = dataframe.select_dtypes(include="number")
    numeric_column_names = [str(column) for column in numeric_frame.columns]
    numeric_column_set = set(numeric_column_names)
    categorical_columns = [
        str(column)
        for column in dataframe.columns
        if str(column) not in numeric_column_set
    ]
    missing_values = _build_missing_values(dataframe)
    rows, columns = dataframe.shape
    duplicate_rows = int(dataframe.duplicated().sum())

    return ReportDatasetSummary(
        shape={"rows": int(rows), "columns": int(columns)},
        missing_values=missing_values,
        missing_percentage=_build_missing_percentage(missing_values, rows),
        dtypes=_build_dtypes(dataframe),
        numeric_columns=numeric_column_names,
        categorical_columns=categorical_columns,
        unique_values=_build_unique_values(dataframe),
        duplicate_rows=duplicate_rows,
        memory_usage_bytes=int(dataframe.memory_usage(deep=True).sum()),
        numeric_summary=_build_numeric_summary(numeric_frame),
        quality_assessment=_build_quality_assessment(
            dataframe=dataframe,
            missing_values=missing_values,
            duplicate_rows=duplicate_rows,
        ),
    )


def _build_key_insights(
    summary: ReportDatasetSummary,
    request: ReportGenerationRequest | None,
) -> list[str]:
    """Generate deterministic executive insights from the dataset summary."""
    rows = summary.shape["rows"]
    columns = summary.shape["columns"]
    total_missing = sum(summary.missing_values.values())
    total_cells = rows * columns
    missing_rate = (total_missing / total_cells * 100) if total_cells else 0.0

    insights = [
        f"Dataset contains {rows} rows and {columns} columns.",
        _missing_value_insight(missing_rate, total_missing),
        _duplicate_row_insight(summary.duplicate_rows),
        _column_mix_insight(summary.numeric_columns, summary.categorical_columns),
        summary.quality_assessment,
    ]

    if request and request.report_focus:
        insights.append(f"Requested focus area: {request.report_focus}.")

    return insights


def _build_recommendations(summary: ReportDatasetSummary) -> list[str]:
    """Generate next-step recommendations from the dataset summary."""
    recommendations: list[str] = []

    if any(count > 0 for count in summary.missing_values.values()):
        recommendations.append(
            "Review columns with missing values before downstream reporting or modeling."
        )

    if summary.duplicate_rows > 0:
        recommendations.append(
            "Remove duplicate rows to avoid skewing aggregated business metrics."
        )

    if summary.numeric_columns:
        recommendations.append(
            "Use histogram and box charts to evaluate numeric distributions and outliers."
        )

    if summary.categorical_columns:
        recommendations.append(
            "Segment the dataset by categorical fields to compare performance across groups."
        )

    if not recommendations:
        recommendations.append(
            "The dataset is structurally simple; validate business relevance before deeper analysis."
        )

    return recommendations


def _build_available_charts(summary: ReportDatasetSummary) -> list[str]:
    """Infer chart types that are likely useful for the uploaded dataset."""
    charts: list[str] = []

    if summary.numeric_columns:
        charts.extend(["histogram", "box"])

    if summary.numeric_columns and summary.categorical_columns:
        charts.extend(["bar", "line", "scatter"])

    return [chart for chart in SUPPORTED_CHART_TYPES if chart in charts]


def _build_report_id(dataframe: pd.DataFrame) -> str:
    """Create a deterministic report identifier from the dataset contents."""
    digest = sha256(dataframe.to_csv(index=False).encode("utf-8")).hexdigest()[:12]
    return f"report-{digest}"


def _build_missing_values(dataframe: pd.DataFrame) -> dict[str, int]:
    """Count missing values per column."""
    return {
        str(column): int(count)
        for column, count in dataframe.isna().sum().items()
    }


def _build_missing_percentage(
    missing_values: dict[str, int],
    rows: int,
) -> dict[str, float]:
    """Calculate missing-value percentages per column."""
    if rows == 0:
        return {column: 0.0 for column in missing_values}

    return {
        column: round((missing_count / rows) * 100, 2)
        for column, missing_count in missing_values.items()
    }


def _build_dtypes(dataframe: pd.DataFrame) -> dict[str, str]:
    """Capture the inferred dtype for each column."""
    return {str(column): str(dtype) for column, dtype in dataframe.dtypes.items()}


def _build_unique_values(dataframe: pd.DataFrame) -> dict[str, int]:
    """Count unique values per column."""
    return {
        str(column): int(count)
        for column, count in dataframe.nunique(dropna=True).items()
    }


def _build_numeric_summary(numeric_frame: pd.DataFrame) -> dict[str, dict[str, float]]:
    """Build summary statistics for numeric columns."""
    if numeric_frame.empty:
        return {}

    summary_frame = numeric_frame.describe(percentiles=[0.25, 0.5, 0.75])
    population_std = numeric_frame.std(ddof=0)
    numeric_summary: dict[str, dict[str, float]] = {}

    for column in numeric_frame.columns:
        column_name = str(column)
        if summary_frame[column].get("count", 0.0) == 0.0:
            numeric_summary[column_name] = {
                "count": 0.0,
                "mean": 0.0,
                "std": 0.0,
                "min": 0.0,
                "25%": 0.0,
                "50%": 0.0,
                "75%": 0.0,
                "max": 0.0,
            }
            continue

        numeric_summary[column_name] = {
            "count": float(summary_frame[column]["count"]),
            "mean": float(summary_frame[column]["mean"]),
            "std": float(population_std[column]),
            "min": float(summary_frame[column]["min"]),
            "25%": float(summary_frame[column]["25%"]),
            "50%": float(summary_frame[column]["50%"]),
            "75%": float(summary_frame[column]["75%"]),
            "max": float(summary_frame[column]["max"]),
        }

    return numeric_summary


def _build_quality_assessment(
    dataframe: pd.DataFrame,
    missing_values: dict[str, int],
    duplicate_rows: int,
) -> str:
    """Generate a concise data-quality assessment."""
    rows, columns = dataframe.shape
    total_missing = sum(missing_values.values())
    total_cells = rows * columns
    missing_rate = (total_missing / total_cells * 100) if total_cells else 0.0

    if total_missing == 0 and duplicate_rows == 0:
        return "Dataset quality is strong with no missing values or duplicate rows."

    if missing_rate <= 5 and duplicate_rows == 0:
        return "Dataset quality is good with limited missing data and no duplicate rows."

    if missing_rate <= 20:
        return "Dataset quality is acceptable, but several data-quality checks should be reviewed."

    return "Dataset quality requires attention due to significant missing data or duplicates."


def _missing_value_insight(missing_rate: float, total_missing: int) -> str:
    """Describe the overall missing-value profile."""
    if total_missing == 0:
        return "Missing values are absent, which supports clean downstream analysis."

    if missing_rate <= 5:
        return "Missing values are low and unlikely to materially affect most analyses."

    if missing_rate <= 20:
        return "Missing values are moderate and should be reviewed before reporting."

    return "Missing values are high and could materially affect business conclusions."


def _duplicate_row_insight(duplicate_rows: int) -> str:
    """Describe the duplicate-row profile."""
    if duplicate_rows == 0:
        return "No duplicate rows were detected in the dataset."

    return f"Duplicate rows were detected ({duplicate_rows}), which may inflate repeated observations."


def _column_mix_insight(numeric_columns: list[str], categorical_columns: list[str]) -> str:
    """Describe the column mix available for analysis."""
    if numeric_columns and categorical_columns:
        return "The dataset includes both numeric and categorical columns, enabling segmented quantitative analysis."

    if numeric_columns:
        return "Numeric columns are available for distribution analysis and trend assessment."

    if categorical_columns:
        return "Categorical columns are available for grouping and classification-style analysis."

    return "The dataset does not expose analyzable columns for standard business reporting."