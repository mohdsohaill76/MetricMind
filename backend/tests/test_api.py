"""Request-validation tests for the MetricMind API."""

from io import StringIO
from pathlib import Path

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.request_models import ChartGenerationRequest
from app.services import chart_service


client = TestClient(app)


@pytest.fixture()
def chart_dataset() -> pd.DataFrame:
    """Provide a deterministic dataset for chart generation tests."""
    return pd.DataFrame(
        {
            "category": ["A", "B", "C", "D"],
            "sales": [100, 150, 120, 180],
            "response_time": [1.2, 2.1, 1.8, 3.0],
            "segment": ["Retail", "Retail", "SMB", "Enterprise"],
        }
    )


@pytest.fixture()
def chart_output_dir(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Redirect chart output into a temporary directory during tests."""
    output_dir = tmp_path / "generated_charts"
    monkeypatch.setattr(chart_service, "CHARTS_DIRECTORY", output_dir)
    return output_dir


@pytest.fixture()
def chart_dataset_patch(
    chart_dataset: pd.DataFrame,
    monkeypatch: pytest.MonkeyPatch,
) -> pd.DataFrame:
    """Patch the chart service to use the test dataset."""
    monkeypatch.setattr(chart_service, "CHART_DATASET", chart_dataset)
    return chart_dataset


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
    numeric_column_names = [str(column) for column in numeric_columns.columns]
    categorical_column_names = [
        str(column)
        for column in dataframe.columns
        if str(column) not in numeric_column_names
    ]
    missing_values = dataframe.isna().sum().astype(int).to_dict()

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
            "shape": {"rows": 4, "columns": 4},
            "missing_values": missing_values,
            "missing_percentage": {
                column: round((count / len(dataframe.index)) * 100, 2)
                for column, count in missing_values.items()
            },
            "dtypes": dataframe.dtypes.astype(str).to_dict(),
            "numeric_columns": numeric_column_names,
            "categorical_columns": categorical_column_names,
            "unique_values": dataframe.nunique(dropna=True).astype(int).to_dict(),
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


def test_chart_generates_valid_bar_chart(
    chart_dataset_patch: pd.DataFrame,
    chart_output_dir: Path,
) -> None:
    """A valid bar request generates a PNG chart and returns metadata."""
    response = client.post(
        "/api/v1/chart",
        json={
            "chart_type": "bar",
            "x_column": "category",
            "y_column": "sales",
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["chart_type"] == "bar"
    assert body["message"] == "Chart generated successfully."
    assert body["filename"].endswith(".png")
    assert body["chart_path"].endswith(body["filename"])

    chart_file = Path(body["chart_path"])
    assert chart_file.exists()
    assert chart_file.parent == chart_output_dir
    assert chart_file.read_bytes().startswith(b"\x89PNG\r\n\x1a\n")


def test_chart_generates_valid_histogram(
    chart_dataset_patch: pd.DataFrame,
    chart_output_dir: Path,
) -> None:
    """A valid histogram request generates a PNG chart."""
    response = client.post(
        "/api/v1/chart",
        json={
            "chart_type": "histogram",
            "x_column": "response_time",
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["chart_type"] == "histogram"
    assert body["message"] == "Chart generated successfully."
    assert Path(body["chart_path"]).exists()
    assert Path(body["chart_path"]).parent == chart_output_dir


@pytest.mark.parametrize(
    ("payload", "message"),
    [
        (
            {"chart_type": "pie", "x_column": "category", "y_column": "sales"},
            "Unsupported chart type.",
        ),
        (
            {"chart_type": "bar", "y_column": "sales"},
            "The x column is required.",
        ),
        (
            {"chart_type": "bar", "x_column": "category"},
            "The y column is required for this chart type.",
        ),
        (
            {"chart_type": "bar", "x_column": "missing", "y_column": "sales"},
            "The requested x column does not exist.",
        ),
        (
            {"chart_type": "histogram", "x_column": "category"},
            "The requested x column must be numeric.",
        ),
        (
            {"chart_type": "scatter", "x_column": "response_time", "y_column": "segment"},
            "The requested y column must be numeric.",
        ),
    ],
    ids=[
        "invalid-chart-type",
        "missing-x-column",
        "missing-y-column",
        "missing-x-field",
        "non-numeric-histogram-column",
        "non-numeric-scatter-y-column",
    ],
)
def test_chart_rejects_invalid_requests(
    payload: dict[str, str],
    message: str,
    chart_dataset_patch: pd.DataFrame,
) -> None:
    """Invalid chart requests use the API's standard HTTP error response."""
    response = client.post("/api/v1/chart", json=payload)

    assert response.status_code == 400
    assert response.json() == {"error": "HTTP Error", "message": message}


def test_chart_rejects_missing_dataset(monkeypatch: pytest.MonkeyPatch) -> None:
    """The chart service returns a 400 when no dataset is available."""
    monkeypatch.setattr(chart_service, "CHART_DATASET", None)

    response = client.post(
        "/api/v1/chart",
        json={
            "chart_type": "bar",
            "x_column": "category",
            "y_column": "sales",
        },
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": "HTTP Error",
        "message": "Chart dataset is unavailable.",
    }
