"""Unit tests for the analytics summary service."""

from collections.abc import Generator

import pandas as pd
import pytest
from fastapi import HTTPException

from app.services import dataset_service
from app.services.analytics_service import generate_analytics_summary


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test starts with an empty shared dataset."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


def test_generate_analytics_summary_builds_column_analytics() -> None:
    """The service returns detailed analytics for numeric and categorical columns."""
    dataframe = pd.DataFrame(
        {
            "category": ["A", "B", "B", "C"],
            "sales": [100, 150, 150, 180],
            "response_time": [1.2, 2.1, 2.1, 3.0],
            "segment": ["Retail", "Retail", "Retail", "Enterprise"],
        }
    )
    dataset_service.set_dataset(dataframe)

    response = generate_analytics_summary()

    assert response.total_rows == 4
    assert response.total_columns == 4
    assert response.numeric_columns == ["sales", "response_time"]
    assert response.categorical_columns == ["category", "segment"]
    assert response.total_missing_values == 0
    assert response.duplicate_rows == 1
    assert response.memory_usage_bytes == int(dataframe.memory_usage(deep=True).sum())
    assert response.dataset_quality == (
        "Dataset quality is acceptable, but several data-quality checks should be reviewed."
    )
    assert response.available_charts == ["histogram", "box", "bar", "line", "scatter"]
    assert response.dataset_insights[0] == "Dataset contains 4 rows and 4 columns."
    assert response.numeric_analysis["sales"].median == 150.0
    assert response.numeric_analysis["sales"].first_quartile == 137.5
    assert response.numeric_analysis["sales"].third_quartile == 157.5
    assert response.categorical_analysis["category"].unique_values == 3
    assert response.categorical_analysis["category"].most_frequent_value == "B"
    assert response.categorical_analysis["category"].frequency == 2


def test_generate_analytics_summary_requires_dataset() -> None:
    """The service raises the standard HTTP error when no dataset is loaded."""
    with pytest.raises(HTTPException) as exc_info:
        generate_analytics_summary()

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "No dataset has been uploaded."