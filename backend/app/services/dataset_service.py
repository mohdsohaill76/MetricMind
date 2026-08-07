"""Shared dataset storage for MetricMind backend services."""

from __future__ import annotations

from typing import Final

import pandas as pd

from app.models.response_models import UploadProfile


_DATASET: pd.DataFrame | None = None
_DATASET_PROFILE: UploadProfile | None = None
_EMPTY_DATASET: Final[pd.DataFrame] = pd.DataFrame()


def set_dataset(dataframe: pd.DataFrame) -> None:
    """Store a copy of the most recently uploaded dataset and its profile."""
    global _DATASET, _DATASET_PROFILE
    _DATASET = dataframe.copy(deep=True)
    _DATASET_PROFILE = build_dataset_profile(_DATASET)


def get_dataset() -> pd.DataFrame:
    """Return a copy of the stored dataset, or an empty frame when unavailable."""
    if _DATASET is None:
        return _EMPTY_DATASET.copy(deep=True)

    return _DATASET.copy(deep=True)


def clear_dataset() -> None:
    """Remove the stored dataset."""
    global _DATASET, _DATASET_PROFILE
    _DATASET = None
    _DATASET_PROFILE = None


def has_dataset() -> bool:
    """Return whether a dataset has been stored."""
    return _DATASET is not None


def get_dataset_profile() -> UploadProfile | None:
    """Return a copy of the stored dataset profile when available."""
    if _DATASET_PROFILE is None:
        return None

    return _DATASET_PROFILE.model_copy(deep=True)


def build_dataset_profile(dataframe: pd.DataFrame) -> UploadProfile:
    """Build the shared profile used by upload, analytics, dashboard, and reports."""
    numeric_frame = dataframe.select_dtypes(include="number")
    numeric_column_names = [str(column) for column in numeric_frame.columns]
    numeric_column_set = set(numeric_column_names)
    missing_values = {
        str(column): int(count)
        for column, count in dataframe.isna().sum().items()
    }
    rows, columns = dataframe.shape

    return UploadProfile(
        shape={"rows": int(rows), "columns": int(columns)},
        missing_values=missing_values,
        missing_percentage={
            column: round((missing_count / rows) * 100, 2) if rows else 0.0
            for column, missing_count in missing_values.items()
        },
        dtypes={str(column): str(dtype) for column, dtype in dataframe.dtypes.items()},
        numeric_columns=numeric_column_names,
        categorical_columns=[
            str(column)
            for column in dataframe.columns
            if str(column) not in numeric_column_set
        ],
        unique_values={
            str(column): int(count)
            for column, count in dataframe.nunique(dropna=True).items()
        },
        duplicate_rows=int(dataframe.duplicated().sum()),
        memory_usage_bytes=int(dataframe.memory_usage(deep=True).sum()),
        numeric_summary=_build_numeric_summary(numeric_frame),
    )


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
