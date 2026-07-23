"""Chart generation service for MetricMind."""

from __future__ import annotations

from pathlib import Path
from typing import Final
from uuid import uuid4

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import pandas as pd
from fastapi import HTTPException

from app.models.request_models import ChartGenerationRequest
from app.models.response_models import ChartGenerationResponse


SUPPORTED_CHART_TYPES: Final[set[str]] = {"bar", "line", "scatter", "histogram", "box"}
CHARTS_DIRECTORY: Final[Path] = Path(__file__).resolve().parents[2] / "generated_charts"

CHART_DATASET: pd.DataFrame | None = pd.DataFrame(
    {
        "category": ["A", "B", "C", "D"],
        "sales": [120, 180, 150, 210],
        "response_time": [1.2, 2.4, 1.8, 3.1],
        "score": [7.4, 8.1, 6.9, 9.0],
        "segment": ["Retail", "Retail", "Enterprise", "SMB"],
    }
)


def generate_chart(request: ChartGenerationRequest) -> ChartGenerationResponse:
    """Validate the request and persist a PNG chart to disk."""
    dataset = _get_chart_dataset()
    if dataset is None:
        raise HTTPException(status_code=400, detail="Chart dataset is unavailable.")

    chart_type = request.chart_type.lower()
    if chart_type not in SUPPORTED_CHART_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported chart type.")

    if request.x_column is None:
        raise HTTPException(status_code=400, detail="The x column is required.")

    _ensure_column_exists(dataset, request.x_column, "x column")
    if chart_type in {"bar", "line", "scatter", "box"}:
        if request.y_column is None:
            raise HTTPException(
                status_code=400,
                detail="The y column is required for this chart type.",
            )
        _ensure_column_exists(dataset, request.y_column, "y column")

    _validate_chart_requirements(dataset, chart_type, request.x_column, request.y_column)

    CHARTS_DIRECTORY.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}.png"
    chart_path = CHARTS_DIRECTORY / filename

    _render_chart(dataset, chart_type, request.x_column, request.y_column, chart_path)

    return ChartGenerationResponse(
        chart_type=chart_type,
        filename=filename,
        chart_path=str(chart_path),
        message="Chart generated successfully.",
    )


def _get_chart_dataset() -> pd.DataFrame | None:
    """Return the dataset used for chart generation."""
    return CHART_DATASET.copy() if CHART_DATASET is not None else None


def _ensure_column_exists(dataframe: pd.DataFrame, column_name: str, label: str) -> None:
    """Raise a validation error when a requested column is missing."""
    if column_name not in dataframe.columns:
        raise HTTPException(
            status_code=400,
            detail=f"The requested {label} does not exist.",
        )


def _validate_chart_requirements(
    dataframe: pd.DataFrame,
    chart_type: str,
    x_column: str,
    y_column: str | None,
) -> None:
    """Validate chart-type specific numeric requirements."""
    if chart_type == "histogram":
        _ensure_numeric_column(dataframe, x_column, "x column")
        return

    if chart_type == "scatter":
        _ensure_numeric_column(dataframe, x_column, "x column")
        _ensure_numeric_column(dataframe, y_column or "", "y column")
        return

    if chart_type == "box":
        _ensure_numeric_column(dataframe, y_column or "", "y column")
        return

    if chart_type in {"bar", "line"}:
        _ensure_numeric_column(dataframe, y_column or "", "y column")


def _ensure_numeric_column(dataframe: pd.DataFrame, column_name: str, label: str) -> None:
    """Raise a validation error when a requested numeric column is not numeric."""
    if column_name not in dataframe.columns:
        raise HTTPException(
            status_code=400,
            detail=f"The requested {label} does not exist.",
        )

    if not pd.api.types.is_numeric_dtype(dataframe[column_name]):
        raise HTTPException(
            status_code=400,
            detail=f"The requested {label} must be numeric.",
        )


def _render_chart(
    dataframe: pd.DataFrame,
    chart_type: str,
    x_column: str,
    y_column: str | None,
    chart_path: Path,
) -> None:
    """Render and save the requested chart as a PNG image."""
    figure, axis = plt.subplots(figsize=(8, 5))
    try:
        if chart_type == "bar":
            axis.bar(dataframe[x_column].astype(str), dataframe[y_column].astype(float))
        elif chart_type == "line":
            axis.plot(dataframe[x_column], dataframe[y_column], marker="o")
        elif chart_type == "scatter":
            axis.scatter(dataframe[x_column], dataframe[y_column])
        elif chart_type == "histogram":
            axis.hist(dataframe[x_column].dropna(), bins=10, edgecolor="black")
        elif chart_type == "box":
            grouped_values = [
                group[y_column].dropna().astype(float).tolist()
                for _, group in dataframe.groupby(x_column, sort=False)
            ]
            axis.boxplot(grouped_values)
            axis.set_xticklabels(
                [str(label) for label in dataframe[x_column].drop_duplicates().tolist()]
            )

        axis.set_title(f"{chart_type.title()} Chart")
        axis.set_xlabel(x_column)
        axis.set_ylabel(y_column if y_column is not None else x_column)
        figure.tight_layout()
        figure.savefig(chart_path, format="png")
    finally:
        plt.close(figure)