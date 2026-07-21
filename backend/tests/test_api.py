"""Request-validation tests for the MetricMind API."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_chat_accepts_valid_question() -> None:
    """A non-empty question within the length limit is accepted."""
    response = client.post("/api/v1/chat", json={"question": "How is retention trending?"})

    assert response.status_code == 200
    assert response.json() == {"response": "MetricMind AI is under development."}


@pytest.mark.parametrize(
    "payload",
    [
        {"question": ""},
        {},
        {"question": "a" * 501},
    ],
)
def test_chat_rejects_invalid_questions(payload: dict[str, str]) -> None:
    """Empty, missing, and overlong questions return validation errors."""
    response = client.post("/api/v1/chat", json=payload)

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "question"]


def test_request_logging_includes_method_path_status_and_duration(caplog: pytest.LogCaptureFixture) -> None:
    """Every HTTP request emits a completion log with request details."""
    caplog.set_level("INFO", logger="app.middleware.request_logging")

    response = client.post("/api/v1/chat", json={"question": "How is retention trending?"})

    assert response.status_code == 200
    assert any(
        "POST /api/v1/chat -> 200 (" in record.message
        and record.message.endswith(" ms)")
        for record in caplog.records
    )


def test_upload_returns_dataset_preview() -> None:
    """An uploaded CSV returns its metadata and first ten rows."""
    response = client.post(
        "/api/v1/upload",
        files={"file": ("metrics.csv", "metric,value\nrevenue,100\n", "text/csv")},
    )

    assert response.status_code == 200
    assert response.json() == {
        "filename": "metrics.csv",
        "rows": 1,
        "columns": 2,
        "column_names": ["metric", "value"],
        "preview": [{"metric": "revenue", "value": 100}],
    }
