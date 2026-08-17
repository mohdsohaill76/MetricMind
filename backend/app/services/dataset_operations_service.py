"""Verified metric calculations for the currently uploaded dataset."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final, Mapping

import pandas as pd
from fastapi import HTTPException

from app.services.dataset_service import get_dataset, has_dataset


SUPPORTED_OPERATIONS: Final[frozenset[str]] = frozenset(
    {"SUM", "AVG", "COUNT", "MIN", "MAX"}
)


@dataclass(frozen=True)
class MetricCalculation:
    """A verified calculation and the dataset scope used to produce it."""

    operation: str
    column: str | None
    filters: dict[str, Any]
    result: int | float | None
    rows_affected: int
    group_by: str | None = None
    grouped_results: tuple["GroupedMetricResult", ...] = ()


@dataclass(frozen=True)
class GroupedMetricResult:
    """One verified aggregation result within a grouping column."""

    group: Any
    result: int | float
    rows_affected: int


def calculate_metric(
    operation: str,
    column: str | None = None,
    filters: Mapping[str, Any] | None = None,
    group_by: str | None = None,
) -> MetricCalculation:
    """Calculate a supported metric against the full shared dataset.

    ``COUNT`` counts rows and does not require a column. The remaining operations
    require a numeric column. Filters are simple equality comparisons combined
    with logical AND. ``group_by`` produces one verified result for each value of
    an uploaded dataset column.
    """
    dataset = _get_dataset()
    normalized_operation = _validate_operation(operation)
    normalized_filters = dict(filters or {})
    _validate_filter_columns(dataset, normalized_filters)
    normalized_group_by = _validate_group_by_column(dataset, group_by)

    filtered_dataset = _apply_filters(dataset, normalized_filters)
    rows_affected = len(filtered_dataset)

    if normalized_operation == "COUNT":
        if normalized_group_by is not None:
            return MetricCalculation(
                operation=normalized_operation,
                column=None,
                filters=normalized_filters,
                result=None,
                rows_affected=rows_affected,
                group_by=normalized_group_by,
                grouped_results=_calculate_grouped_count(filtered_dataset, normalized_group_by),
            )
        return MetricCalculation(
            operation=normalized_operation,
            column=None,
            filters=normalized_filters,
            result=rows_affected,
            rows_affected=rows_affected,
        )

    numeric_column = _validate_numeric_column(dataset, column)
    if filtered_dataset.empty:
        raise HTTPException(status_code=400, detail="No rows match the provided filters.")

    if normalized_group_by is not None:
        return MetricCalculation(
            operation=normalized_operation,
            column=numeric_column,
            filters=normalized_filters,
            result=None,
            rows_affected=rows_affected,
            group_by=normalized_group_by,
            grouped_results=_calculate_grouped_metric(
                normalized_operation, filtered_dataset, numeric_column, normalized_group_by
            ),
        )

    values = filtered_dataset[numeric_column].dropna()
    if values.empty:
        raise HTTPException(
            status_code=400,
            detail="No numeric values are available for the requested calculation.",
        )

    result = _calculate(normalized_operation, values)
    return MetricCalculation(
        operation=normalized_operation,
        column=numeric_column,
        filters=normalized_filters,
        result=result,
        rows_affected=rows_affected,
    )


def _get_dataset() -> pd.DataFrame:
    """Return the currently uploaded dataset or raise the standard application error."""
    if not has_dataset():
        raise HTTPException(status_code=400, detail="No dataset has been uploaded.")

    return get_dataset()


def _validate_operation(operation: str) -> str:
    """Validate and normalize an operation name."""
    if not isinstance(operation, str):
        raise HTTPException(status_code=400, detail="Unsupported metric operation.")

    normalized_operation = operation.upper()
    if normalized_operation not in SUPPORTED_OPERATIONS:
        raise HTTPException(status_code=400, detail="Unsupported metric operation.")

    return normalized_operation


def _validate_filter_columns(dataframe: pd.DataFrame, filters: Mapping[str, Any]) -> None:
    """Ensure each equality filter names an uploaded dataset column."""
    for filter_column in filters:
        if filter_column not in dataframe.columns:
            raise HTTPException(status_code=400, detail=f"Unknown filter column: {filter_column}.")


def _validate_group_by_column(dataframe: pd.DataFrame, group_by: str | None) -> str | None:
    """Ensure an optional grouping column names an uploaded dataset column."""
    if group_by is None:
        return None
    if not isinstance(group_by, str) or not group_by:
        raise HTTPException(status_code=400, detail="A grouping column must be provided.")
    if group_by not in dataframe.columns:
        raise HTTPException(status_code=400, detail=f"Unknown grouping column: {group_by}.")
    return group_by


def _apply_filters(dataframe: pd.DataFrame, filters: Mapping[str, Any]) -> pd.DataFrame:
    """Apply simple equality filters to a dataset."""
    filtered_dataframe = dataframe
    for filter_column, filter_value in filters.items():
        filtered_dataframe = filtered_dataframe[
            filtered_dataframe[filter_column] == filter_value
        ]

    return filtered_dataframe


def _validate_numeric_column(dataframe: pd.DataFrame, column: str | None) -> str:
    """Ensure a requested aggregation column exists and contains numeric values."""
    if not column:
        raise HTTPException(status_code=400, detail="A numeric column is required.")
    if column not in dataframe.columns:
        raise HTTPException(status_code=400, detail=f"Unknown column: {column}.")
    if not pd.api.types.is_numeric_dtype(dataframe[column]):
        raise HTTPException(status_code=400, detail=f"Column '{column}' must be numeric.")

    return column


def _calculate(operation: str, values: pd.Series) -> float:
    """Perform an already validated numeric calculation."""
    if operation == "SUM":
        return float(values.sum())
    if operation == "AVG":
        return float(values.mean())
    if operation == "MIN":
        return float(values.min())
    if operation == "MAX":
        return float(values.max())

    raise AssertionError(f"Unexpected supported operation: {operation}")


def _calculate_grouped_count(
    dataframe: pd.DataFrame, group_by: str
) -> tuple[GroupedMetricResult, ...]:
    """Count all filtered rows in each group, including rows with null group values."""
    return tuple(
        GroupedMetricResult(group=group, result=len(group_frame), rows_affected=len(group_frame))
        for group, group_frame in dataframe.groupby(group_by, dropna=False, sort=False)
    )


def _calculate_grouped_metric(
    operation: str,
    dataframe: pd.DataFrame,
    column: str,
    group_by: str,
) -> tuple[GroupedMetricResult, ...]:
    """Aggregate valid numeric values from the full filtered dataset for each group."""
    grouped_results: list[GroupedMetricResult] = []
    for group, group_frame in dataframe.groupby(group_by, dropna=False, sort=False):
        values = group_frame[column].dropna()
        if not values.empty:
            grouped_results.append(
                GroupedMetricResult(
                    group=group,
                    result=_calculate(operation, values),
                    rows_affected=len(group_frame),
                )
            )

    if not grouped_results:
        raise HTTPException(
            status_code=400,
            detail="No numeric values are available for the requested calculation.",
        )
    return tuple(grouped_results)
