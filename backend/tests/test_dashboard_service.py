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
    assert response.revenue_overview.model_dump() == {
        "total_sales": 0.0,
        "total_profit": 0.0,
        "average_sales": 0.0,
        "average_profit": 0.0,
    }
    assert response.sales_by_region == []
    assert response.monthly_performance == []
    assert response.category_sales == []
    assert response.top_products == []


def test_generate_dashboard_summary_reuses_stored_profile(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Dashboard generation does not rebuild the profile after dataset storage."""
    dataset_service.set_dataset(pd.DataFrame({"sales": [100, 150]}))

    def fail_if_profile_is_rebuilt(_: pd.DataFrame) -> None:
        pytest.fail("Dashboard generation rebuilt the stored dataset profile.")

    monkeypatch.setattr(dataset_service, "build_dataset_profile", fail_if_profile_is_rebuilt)

    assert generate_dashboard_summary().total_rows == 2


def test_generate_dashboard_summary_builds_chart_analytics() -> None:
    """Dashboard analytics aggregate a Superstore-shaped shared dataset."""
    dataset_service.set_dataset(
        pd.DataFrame(
            {
                "Order Date": ["2024-02-12", "2024-01-03", "2024-02-20", "2024-01-27"],
                "Region": ["West", "East", "West", "East"],
                "Category": ["Furniture", "Office Supplies", "Furniture", "Technology"],
                "Product Name": ["Desk", "Paper", "Desk", "Laptop"],
                "Sales": [200.0, 50.0, 300.0, 500.0],
                "Profit": [20.0, 5.0, 30.0, -50.0],
            }
        )
    )

    response = generate_dashboard_summary()

    assert response.revenue_overview.model_dump() == {
        "total_sales": 1050.0,
        "total_profit": 5.0,
        "average_sales": 262.5,
        "average_profit": 1.25,
    }
    assert [item.model_dump() for item in response.sales_by_region] == [
        {"region": "East", "sales": 550.0},
        {"region": "West", "sales": 500.0},
    ]
    assert [item.model_dump() for item in response.monthly_performance] == [
        {"month": "2024-01", "sales": 550.0, "profit": -45.0},
        {"month": "2024-02", "sales": 500.0, "profit": 50.0},
    ]
    assert [item.model_dump() for item in response.category_sales] == [
        {"category": "Furniture", "sales": 500.0},
        {"category": "Office Supplies", "sales": 50.0},
        {"category": "Technology", "sales": 500.0},
    ]
    assert [item.model_dump() for item in response.top_products] == [
        {"product": "Desk", "sales": 500.0},
        {"product": "Laptop", "sales": 500.0},
        {"product": "Paper", "sales": 50.0},
    ]


def test_generate_dashboard_summary_handles_missing_columns() -> None:
    """Absent source fields return empty chart arrays without raising an error."""
    dataset_service.set_dataset(pd.DataFrame({"Region": ["East"], "Sales": [100]}))

    response = generate_dashboard_summary()

    assert response.revenue_overview.model_dump() == {
        "total_sales": 100.0,
        "total_profit": 0.0,
        "average_sales": 100.0,
        "average_profit": 0.0,
    }
    assert [item.model_dump() for item in response.sales_by_region] == [
        {"region": "East", "sales": 100.0}
    ]
    assert response.monthly_performance == []
    assert response.category_sales == []
    assert response.top_products == []


def test_generate_dashboard_summary_handles_empty_dataset() -> None:
    """An empty stored dataset returns valid zero metrics and chart arrays."""
    dataset_service.set_dataset(pd.DataFrame(columns=["Region", "Sales"]))

    response = generate_dashboard_summary()

    assert response.total_rows == 0
    assert response.revenue_overview.model_dump() == {
        "total_sales": 0.0,
        "total_profit": 0.0,
        "average_sales": 0.0,
        "average_profit": 0.0,
    }
    assert response.sales_by_region == []
    assert response.monthly_performance == []
    assert response.category_sales == []
    assert response.top_products == []


def test_generate_dashboard_summary_requires_dataset() -> None:
    """The service raises the standard HTTP error when no dataset is loaded."""
    with pytest.raises(HTTPException) as exc_info:
        generate_dashboard_summary()

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "No dataset has been uploaded."
