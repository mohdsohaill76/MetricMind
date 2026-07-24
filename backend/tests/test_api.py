"""Request-validation tests for the MetricMind API."""

from io import StringIO
from pathlib import Path
from collections.abc import Generator

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import dataset_service
from app.services import chart_service


client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test starts with an empty shared dataset."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


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


def test_upload_stores_dataset() -> None:
    """A successful upload stores the parsed DataFrame in the shared dataset service."""
    csv_contents = "category,sales,response_time\nA,100,1.2\nB,150,2.1\n"

    response = client.post(
        "/api/v1/upload",
        files={"file": ("metrics.csv", csv_contents, "text/csv")},
    )

    stored_dataset = dataset_service.get_dataset()

    assert response.status_code == 200
    assert dataset_service.has_dataset() is True
    assert stored_dataset.equals(pd.read_csv(StringIO(csv_contents)))
    assert stored_dataset is not dataset_service.get_dataset()


def test_multiple_uploads_replace_the_previous_dataset() -> None:
    """Uploading a second CSV replaces the prior shared dataset."""
    first_csv = "category,sales\nA,100\n"
    second_csv = "category,sales\nB,200\n"

    client.post(
        "/api/v1/upload",
        files={"file": ("first.csv", first_csv, "text/csv")},
    )
    client.post(
        "/api/v1/upload",
        files={"file": ("second.csv", second_csv, "text/csv")},
    )

    stored_dataset = dataset_service.get_dataset()

    assert stored_dataset.equals(pd.read_csv(StringIO(second_csv)))


def test_dataset_manager_stores_and_retrieves_safely() -> None:
    """The dataset manager returns copies instead of exposing internal state."""
    original = pd.DataFrame({"category": ["A", "B"], "sales": [10, 20]})

    dataset_service.set_dataset(original)
    retrieved = dataset_service.get_dataset()
    retrieved.loc[0, "sales"] = 999

    assert dataset_service.has_dataset() is True
    assert dataset_service.get_dataset().loc[0, "sales"] == 10
    assert retrieved.loc[0, "sales"] == 999


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


def test_chart_generates_valid_bar_chart(chart_output_dir: Path) -> None:
    """A valid bar request generates a PNG chart and returns metadata."""
    client.post(
        "/api/v1/upload",
        files={
            "file": (
                "metrics.csv",
                "category,sales,response_time\nA,100,1.2\nB,150,2.1\nC,120,1.8\nD,180,3.0\n",
                "text/csv",
            )
        },
    )

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


def test_chart_generates_valid_histogram(chart_output_dir: Path) -> None:
    """A valid histogram request generates a PNG chart."""
    client.post(
        "/api/v1/upload",
        files={
            "file": (
                "metrics.csv",
                "category,sales,response_time\nA,100,1.2\nB,150,2.1\nC,120,1.8\nD,180,3.0\n",
                "text/csv",
            )
        },
    )

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
) -> None:
    """Invalid chart requests use the API's standard HTTP error response."""
    client.post(
        "/api/v1/upload",
        files={
            "file": (
                "metrics.csv",
                "category,sales,response_time,segment\nA,100,1.2,Retail\nB,150,2.1,Retail\nC,120,1.8,SMB\nD,180,3.0,Enterprise\n",
                "text/csv",
            )
        },
    )

    response = client.post("/api/v1/chart", json=payload)

    assert response.status_code == 400
    assert response.json() == {"error": "HTTP Error", "message": message}


def test_chart_rejects_missing_dataset() -> None:
    """The chart service returns a 400 when no dataset is available."""
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
        "message": "No dataset has been uploaded.",
    }


def test_dashboard_summary_returns_dataset_overview() -> None:
    """The dashboard summary endpoint returns a high-level view of the uploaded dataset."""
    csv_contents = (
        "category,sales,response_time,segment\n"
        "A,100,1.2,Retail\n"
        "B,150,2.1,Retail\n"
        "B,150,2.1,Retail\n"
        "C,180,3.0,Enterprise\n"
    )

    client.post(
        "/api/v1/upload",
        files={"file": ("metrics.csv", csv_contents, "text/csv")},
    )

    response = client.get("/api/v1/dashboard/summary")
    body = response.json()

    assert response.status_code == 200
    assert body["total_rows"] == 4
    assert body["total_columns"] == 4
    assert body["numeric_columns_count"] == 2
    assert body["categorical_columns_count"] == 2
    assert body["duplicate_rows"] == 1
    assert body["missing_values_total"] == 0
    assert body["upload_status"] == "uploaded"
    assert body["dataset_quality"] == (
        "Dataset quality is acceptable, but several data-quality checks should be reviewed."
    )
    assert body["available_charts"] == ["histogram", "box", "bar", "line", "scatter"]
    assert "generated_at" in body


def test_dashboard_summary_rejects_missing_dataset() -> None:
    """The dashboard summary endpoint returns a 400 when no dataset is available."""
    response = client.get("/api/v1/dashboard/summary")

    assert response.status_code == 400
    assert response.json() == {
        "error": "HTTP Error",
        "message": "No dataset has been uploaded.",
    }


def test_generate_report_returns_dataset_insights() -> None:
    """A populated dataset returns a structured AI report payload."""
    csv_contents = (
        "region,sales,margin,notes\n"
        "North,100,0.20,\n"
        "North,100,0.20,\n"
        "South,150,0.35,Stable\n"
        "West,200,0.40,\n"
    )

    client.post(
        "/api/v1/upload",
        files={"file": ("metrics.csv", csv_contents, "text/csv")},
    )

    response = client.post("/api/v1/ai/generate-report")
    body = response.json()

    assert response.status_code == 200
    assert body["report_id"].startswith("report-")
    assert body["status"] == "completed"
    assert body["dataset_summary"]["shape"] == {"rows": 4, "columns": 4}
    assert body["dataset_summary"]["duplicate_rows"] == 1
    assert body["dataset_summary"]["numeric_columns"] == ["sales", "margin"]
    assert body["dataset_summary"]["categorical_columns"] == ["region", "notes"]
    assert "Dataset contains 4 rows and 4 columns." in body["key_insights"]
    assert any(
        insight.startswith("Duplicate rows were detected") for insight in body["key_insights"]
    )
    assert body["charts_available"] == ["histogram", "box", "bar", "line", "scatter"]
    assert any("duplicate rows" in recommendation.lower() for recommendation in body["recommendations"])


def test_generate_report_rejects_missing_dataset() -> None:
    """The report service returns a 400 when no dataset is available."""
    response = client.post("/api/v1/ai/generate-report")

    assert response.status_code == 400
    assert response.json() == {
        "error": "HTTP Error",
        "message": "No dataset has been uploaded.",
    }
