"""Request-validation tests for the MetricMind API."""

from io import StringIO

import pandas as pd
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
    csv_contents = "metric,value,category,notes\nrevenue,0,A,\nrevenue,0,A,\ncost,10,B,\nprofit,10,B,note\n"
    response = client.post(
        "/api/v1/upload",
        files={"file": ("metrics.csv", csv_contents, "text/csv")},
    )

    dataframe = pd.read_csv(StringIO(csv_contents))
    numeric_columns = dataframe.select_dtypes(include="number")

    assert response.status_code == 200
    assert response.json() == {
        "filename": "metrics.csv",
        "rows": 4,
        "columns": 4,
        "column_names": ["metric", "value", "category", "notes"],
        "preview": [
            {"metric": "revenue", "value": 0, "category": "A", "notes": None},
            {"metric": "revenue", "value": 0, "category": "A", "notes": None},
            {"metric": "cost", "value": 10, "category": "B", "notes": None},
            {"metric": "profit", "value": 10, "category": "B", "notes": "note"},
        ],
        "profile": {
            "missing_values": dataframe.isna().sum().astype(int).to_dict(),
            "dtypes": dataframe.dtypes.astype(str).to_dict(),
            "duplicate_rows": int(dataframe.duplicated().sum()),
            "memory_usage_bytes": int(dataframe.memory_usage(deep=True).sum()),
            "numeric_summary": {
                column: {
                    "count": float(series.count()),
                    "mean": float(series.mean()),
                    "std": float(series.std(ddof=0)),
                    "min": float(series.min()),
                    "25%": float(series.quantile(0.25)),
                    "50%": float(series.quantile(0.5)),
                    "75%": float(series.quantile(0.75)),
                    "max": float(series.max()),
                }
                for column, series in numeric_columns.items()
            },
        },
    }


@pytest.mark.parametrize(
    ("filename", "contents", "message"),
    [
        (
            "metrics.txt",
            "metric,value\nrevenue,100\n",
            "Only CSV files are supported.",
        ),
        ("metrics.csv", "", "The uploaded CSV is empty."),
        (
            "metrics.csv",
            "metric,value\nrevenue,100,unexpected\n",
            "The uploaded file is not a valid CSV.",
        ),
        (
            "metrics.csv",
            "metric,\nrevenue,100\n",
            "The uploaded CSV must include headers.",
        ),
        (
            "metrics.csv",
            "metric,value\n",
            "The uploaded CSV must contain at least one data row.",
        ),
    ],
    ids=[
        "invalid-extension",
        "empty-file",
        "malformed-csv",
        "blank-header",
        "empty-dataset",
    ],
)
def test_upload_rejects_invalid_csv(
    filename: str,
    contents: str,
    message: str,
) -> None:
    """Invalid uploads use the API's standard HTTP error response."""
    response = client.post(
        "/api/v1/upload",
        files={"file": (filename, contents, "text/csv")},
    )

    assert response.status_code == 400
    assert response.json() == {"error": "HTTP Error", "message": message}
