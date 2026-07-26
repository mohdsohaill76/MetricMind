"""Unit tests for the dashboard summary service."""

from collections.abc import Generator

import pandas as pd
import pytest
from fastapi import HTTPException

from app.services import dataset_service
from app.services.dashboard_service import generate_dashboard_summary


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test starts with an empty shared dataset."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


def test_generate_dashboard_summary_uses_shared_dataset_profile() -> None:
    """The service reuses the shared dataset profile and exposes dashboard facts."""
    dataframe = pd.DataFrame(
        {
            "category": ["A", "B", "B", "C"],
            "sales": [100, 150, 150, 180],
            "response_time": [1.2, 2.1, 2.1, 3.0],
            "segment": ["Retail", "Retail", "Retail", "Enterprise"],
        }
    )
    dataset_service.set_dataset(dataframe)

    response = generate_dashboard_summary()

    assert response.total_rows == 4
    assert response.total_columns == 4
    assert response.numeric_columns_count == 2
    assert response.categorical_columns_count == 2
    assert response.duplicate_rows == 1
    assert response.missing_values_total == 0
    assert response.memory_usage_bytes == int(dataframe.memory_usage(deep=True).sum())
    assert response.dataset_quality == (
        "Dataset quality is acceptable, but several data-quality checks should be reviewed."
    )
    assert response.upload_status == "uploaded"
    assert response.available_charts == ["histogram", "box", "bar", "line", "scatter"]


def test_generate_dashboard_summary_requires_dataset() -> None:
    """The service raises the standard HTTP error when no dataset is loaded."""
    with pytest.raises(HTTPException) as exc_info:
        generate_dashboard_summary()

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "No dataset has been uploaded."