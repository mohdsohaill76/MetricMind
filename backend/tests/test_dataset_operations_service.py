"""Unit tests for verified dataset metric calculations."""

from collections.abc import Generator

import pandas as pd
import pytest
from fastapi import HTTPException

from app.services import dataset_service
from app.services.dataset_operations_service import calculate_metric


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each calculation uses isolated shared dataset state."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


@pytest.fixture()
def sales_dataset() -> None:
    """Store a compact dataset suitable for operation tests."""
    dataset_service.set_dataset(
        pd.DataFrame(
            {
                "Category": ["Technology", "Furniture", "Technology", "Office Supplies"],
                "Region": ["West", "West", "East", "West"],
                "Sales": [100.0, 200.0, 300.0, 50.0],
                "Profit": [10.0, 20.0, 45.0, -5.0],
            }
        )
    )


def test_calculate_sum_for_numeric_column(sales_dataset: None) -> None:
    result = calculate_metric("SUM", "Profit")

    assert result.result == 70.0
    assert result.rows_affected == 4


def test_calculate_average_for_numeric_column(sales_dataset: None) -> None:
    assert calculate_metric("AVG", "Profit").result == 17.5


def test_count_uses_full_dataset(sales_dataset: None) -> None:
    result = calculate_metric("COUNT")

    assert result.column is None
    assert result.result == 4
    assert result.rows_affected == 4


def test_count_applies_filter(sales_dataset: None) -> None:
    result = calculate_metric("COUNT", filters={"Region": "West"})

    assert result.filters == {"Region": "West"}
    assert result.result == 3
    assert result.rows_affected == 3


def test_calculate_max_for_numeric_column(sales_dataset: None) -> None:
    assert calculate_metric("MAX", "Sales").result == 300.0


def test_calculate_min_for_numeric_column(sales_dataset: None) -> None:
    assert calculate_metric("MIN", "Profit").result == -5.0


def test_calculate_sum_with_categorical_filter(sales_dataset: None) -> None:
    result = calculate_metric("SUM", "Sales", {"Category": "Technology"})

    assert result.result == 400.0
    assert result.rows_affected == 2


@pytest.mark.parametrize(
    ("operation", "column", "detail"),
    [
        ("MEDIAN", "Sales", "Unsupported metric operation."),
        ("SUM", "Revenue", "Unknown column: Revenue."),
        ("SUM", "Category", "Column 'Category' must be numeric."),
    ],
)
def test_calculate_metric_validates_operation_and_column(
    sales_dataset: None,
    operation: str,
    column: str,
    detail: str,
) -> None:
    with pytest.raises(HTTPException) as exc_info:
        calculate_metric(operation, column)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == detail


def test_calculate_metric_rejects_unknown_filter_column(sales_dataset: None) -> None:
    with pytest.raises(HTTPException) as exc_info:
        calculate_metric("COUNT", filters={"Territory": "West"})

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Unknown filter column: Territory."


def test_count_returns_zero_when_filter_has_no_matching_rows(sales_dataset: None) -> None:
    result = calculate_metric("COUNT", filters={"Region": "North"})

    assert result.result == 0
    assert result.rows_affected == 0


def test_calculate_metric_requires_dataset() -> None:
    with pytest.raises(HTTPException) as exc_info:
        calculate_metric("COUNT")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "No dataset has been uploaded."
