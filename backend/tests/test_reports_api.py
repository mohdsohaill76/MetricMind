"""Tests for generated report storage and retrieval endpoints."""

from collections.abc import Generator

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import dataset_service
from app.services.report_storage_service import clear_reports, get_report, save_report


client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_report_state() -> Generator[None, None, None]:
    """Ensure each report API test uses isolated in-memory state."""
    dataset_service.clear_dataset()
    clear_reports()
    yield
    dataset_service.clear_dataset()
    clear_reports()


def test_list_reports_is_empty_when_no_reports_exist() -> None:
    """The list endpoint returns an empty typed payload by default."""
    response = client.get("/api/v1/reports")

    assert response.status_code == 200
    assert response.json() == {"count": 0, "reports": []}


def test_generated_report_is_saved_and_retrievable() -> None:
    """Generating a report persists it for both list and detail retrieval."""
    dataset_service.set_dataset(
        pd.DataFrame({"region": ["North", "South"], "sales": [100, 200]})
    )

    generated = client.post("/api/v1/ai/generate-report")
    assert generated.status_code == 200
    report_id = generated.json()["report_id"]
    stored_report = get_report(report_id)
    listed = client.get("/api/v1/reports")
    retrieved = client.get(f"/api/v1/reports/{report_id}")

    assert listed.json()["count"] == 1
    assert stored_report is not None
    assert stored_report["dataset_quality"] == "Good"
    assert listed.json()["reports"] == [
        {
            "report_id": report_id,
            "generated_at": generated.json()["generated_at"],
            "status": "completed",
            "dataset_quality": "Good",
        }
    ]
    assert retrieved.status_code == 200
    assert retrieved.json() == generated.json()


def test_list_reports_returns_the_correct_count() -> None:
    """The list count reflects every stored report."""
    save_report(_report("report-first"))
    save_report(_report("report-second"))

    response = client.get("/api/v1/reports")

    assert response.status_code == 200
    assert response.json()["count"] == 2


def test_get_report_returns_404_for_unknown_identifier() -> None:
    """Unknown report identifiers use the application's standard 404 response."""
    response = client.get("/api/v1/reports/report-missing")

    assert response.status_code == 404
    assert response.json() == {"error": "HTTP Error", "message": "Report not found."}


def _report(report_id: str) -> dict:
    """Build a valid stored-report fixture."""
    return {
        "report_id": report_id,
        "generated_at": "2026-07-25T12:00:00Z",
        "dataset_quality": "Good",
        "dataset_summary": {
            "shape": {"rows": 1, "columns": 1},
            "missing_values": {"sales": 0},
            "missing_percentage": {"sales": 0.0},
            "dtypes": {"sales": "int64"},
            "numeric_columns": ["sales"],
            "categorical_columns": [],
            "unique_values": {"sales": 1},
            "duplicate_rows": 0,
            "memory_usage_bytes": 140,
            "numeric_summary": {},
            "quality_assessment": "Dataset quality is strong with no missing values or duplicate rows.",
        },
        "key_insights": [],
        "recommendations": [],
        "charts_available": ["histogram"],
        "status": "completed",
    }
