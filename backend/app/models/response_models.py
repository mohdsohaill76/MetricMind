"""Pydantic models for API response payloads."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ChatResponse(BaseModel):
    """Response payload containing the generated chat response."""

    response: str


class ChartGenerationResponse(BaseModel):
    """Response payload for chart generation."""

    chart_type: str
    filename: str
    chart_path: str
    message: str


class UploadProfile(BaseModel):
    """Dataset profiling details for an uploaded CSV."""

    shape: dict[str, int]
    missing_values: dict[str, int]
    missing_percentage: dict[str, float]
    dtypes: dict[str, str]
    numeric_columns: list[str]
    categorical_columns: list[str]
    unique_values: dict[str, int]
    duplicate_rows: int
    memory_usage_bytes: int
    numeric_summary: dict[str, dict[str, float]]


class UploadResponse(BaseModel):
    """Response payload containing a CSV dataset preview."""

    filename: str
    rows: int
    columns: int
    column_names: list[str]
    preview: list[dict[str, Any]]
    profile: UploadProfile


class ReportDatasetSummary(BaseModel):
    """Dataset summary used in AI report generation."""

    shape: dict[str, int]
    missing_values: dict[str, int]
    missing_percentage: dict[str, float]
    dtypes: dict[str, str]
    numeric_columns: list[str]
    categorical_columns: list[str]
    unique_values: dict[str, int]
    duplicate_rows: int
    memory_usage_bytes: int
    numeric_summary: dict[str, dict[str, float]]
    quality_assessment: str


class ReportGenerationResponse(BaseModel):
    """Response payload containing the generated business report."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "report_id": "report-1a2b3c4d5e6f",
                    "generated_at": "2026-07-24T12:00:00Z",
                    "dataset_summary": {
                        "shape": {"rows": 120, "columns": 8},
                        "missing_values": {"sales": 0, "region": 3},
                        "missing_percentage": {"sales": 0.0, "region": 2.5},
                        "dtypes": {"sales": "int64", "region": "object"},
                        "numeric_columns": ["sales"],
                        "categorical_columns": ["region"],
                        "unique_values": {"sales": 40, "region": 4},
                        "duplicate_rows": 2,
                        "memory_usage_bytes": 8192,
                        "numeric_summary": {
                            "sales": {
                                "count": 120.0,
                                "mean": 245.5,
                                "std": 54.2,
                                "min": 120.0,
                                "25%": 200.0,
                                "50%": 240.0,
                                "75%": 290.0,
                                "max": 410.0,
                            }
                        },
                        "quality_assessment": "Dataset quality is good with limited missing data.",
                    },
                    "key_insights": [
                        "Dataset contains 120 rows and 8 columns.",
                        "Missing values are low and concentrated in a single categorical field.",
                    ],
                    "recommendations": [
                        "Review the columns with missing values before downstream analysis.",
                    ],
                    "charts_available": ["histogram", "box", "bar", "line", "scatter"],
                    "status": "completed",
                }
            ]
        }
    )

    report_id: str
    generated_at: datetime
    dataset_summary: ReportDatasetSummary
    key_insights: list[str]
    recommendations: list[str]
    charts_available: list[str]
    status: str


class DashboardSummaryResponse(BaseModel):
    """Response payload containing a high-level dataset dashboard summary."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "total_rows": 120,
                    "total_columns": 8,
                    "numeric_columns_count": 3,
                    "categorical_columns_count": 5,
                    "duplicate_rows": 2,
                    "missing_values_total": 4,
                    "memory_usage_bytes": 8192,
                    "dataset_quality": "Dataset quality is good with limited missing data and no duplicate rows.",
                    "upload_status": "uploaded",
                    "available_charts": ["histogram", "box", "bar", "line", "scatter"],
                    "generated_at": "2026-07-24T12:00:00Z",
                }
            ]
        }
    )

    total_rows: int
    total_columns: int
    numeric_columns_count: int
    categorical_columns_count: int
    duplicate_rows: int
    missing_values_total: int
    memory_usage_bytes: int
    dataset_quality: str
    upload_status: str
    available_charts: list[str]
    generated_at: datetime


class NumericColumnAnalytics(BaseModel):
    """Numeric-column analytics for the dataset summary endpoint."""

    count: float
    mean: float
    median: float
    standard_deviation: float
    minimum: float
    maximum: float
    first_quartile: float
    third_quartile: float


class CategoricalColumnAnalytics(BaseModel):
    """Categorical-column analytics for the dataset summary endpoint."""

    unique_values: int
    most_frequent_value: str | int | float | None
    frequency: int


class AnalyticsSummaryResponse(BaseModel):
    """Response payload for the analytics summary endpoint."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "total_rows": 120,
                    "total_columns": 8,
                    "numeric_columns": ["sales", "margin"],
                    "categorical_columns": ["region", "segment"],
                    "total_missing_values": 4,
                    "duplicate_rows": 2,
                    "memory_usage_bytes": 8192,
                    "dataset_quality": "Dataset quality is good with limited missing data and no duplicate rows.",
                    "available_charts": ["histogram", "box", "bar", "line", "scatter"],
                    "generated_at": "2026-07-24T12:00:00Z",
                    "dataset_insights": [
                        "Dataset contains 120 rows and 8 columns.",
                        "Missing values are low and unlikely to materially affect most analyses.",
                    ],
                    "numeric_analysis": {
                        "sales": {
                            "count": 120.0,
                            "mean": 245.5,
                            "median": 240.0,
                            "standard_deviation": 54.2,
                            "minimum": 120.0,
                            "maximum": 410.0,
                            "first_quartile": 200.0,
                            "third_quartile": 290.0,
                        }
                    },
                    "categorical_analysis": {
                        "region": {
                            "unique_values": 4,
                            "most_frequent_value": "North",
                            "frequency": 48,
                        }
                    },
                }
            ]
        }
    )

    total_rows: int
    total_columns: int
    numeric_columns: list[str]
    categorical_columns: list[str]
    total_missing_values: int
    duplicate_rows: int
    memory_usage_bytes: int
    dataset_quality: str
    available_charts: list[str]
    generated_at: datetime
    dataset_insights: list[str]
    numeric_analysis: dict[str, NumericColumnAnalytics]
    categorical_analysis: dict[str, CategoricalColumnAnalytics]
