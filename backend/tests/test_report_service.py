"""Unit tests for the AI report generation service."""

from io import StringIO
from collections.abc import Generator

import pandas as pd
import pytest
from fastapi import HTTPException

from app.models.request_models import ReportGenerationRequest
from app.services import dataset_service
from app.services.report_service import generate_report


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test starts with an empty shared dataset."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


def test_generate_report_builds_expected_summary(monkeypatch: pytest.MonkeyPatch) -> None:
    """The service returns stable insights for a shared dataset when AI is not available."""
    def mock_generate_report_insights(*args, **kwargs):
        raise Exception("AI unavailable")

    monkeypatch.setattr(
        "app.services.ai_service.generate_report_insights",
        mock_generate_report_insights,
    )

    csv_contents = (
        "region,sales,margin,notes\n"
        "North,100,0.20,\n"
        "North,100,0.20,\n"
        "South,150,0.35,Stable\n"
        "West,200,0.40,\n"
    )
    dataset_service.set_dataset(pd.read_csv(StringIO(csv_contents)))

    report = generate_report(ReportGenerationRequest(report_focus="margin analysis"))

    assert report.report_id.startswith("report-")
    assert report.dataset_summary.shape == {"rows": 4, "columns": 4}
    assert report.dataset_summary.duplicate_rows == 1
    assert report.dataset_summary.numeric_columns == ["sales", "margin"]
    assert report.dataset_summary.categorical_columns == ["region", "notes"]
    assert report.dataset_summary.quality_assessment == (
        "Dataset quality is acceptable, but several data-quality checks should be reviewed."
    )
    assert report.key_insights[0] == "Dataset contains 4 rows and 4 columns."
    assert report.key_insights[-1] == "Requested focus area: margin analysis."
    assert report.charts_available == ["histogram", "box", "bar", "line", "scatter"]
    assert report.status == "completed"


def test_generate_report_uses_ai_when_available(monkeypatch: pytest.MonkeyPatch) -> None:
    """The service calls the AI generation helper and returns the dynamic insights."""
    def mock_generate_report_insights(summary, focus=None):
        assert focus == "margin analysis"
        return {
            "key_insights": ["AI Insight 1", "AI Insight 2"],
            "recommendations": ["AI Rec 1", "AI Rec 2"],
        }

    monkeypatch.setattr(
        "app.services.ai_service.generate_report_insights",
        mock_generate_report_insights,
    )

    csv_contents = (
        "region,sales,margin,notes\n"
        "North,100,0.20,\n"
        "North,100,0.20,\n"
        "South,150,0.35,Stable\n"
        "West,200,0.40,\n"
    )
    dataset_service.set_dataset(pd.read_csv(StringIO(csv_contents)))

    report = generate_report(ReportGenerationRequest(report_focus="margin analysis"))

    assert report.report_id.startswith("report-")
    assert report.key_insights == ["AI Insight 1", "AI Insight 2"]
    assert report.recommendations == ["AI Rec 1", "AI Rec 2"]
    assert report.status == "completed"


def test_generate_report_requires_dataset() -> None:
    """The service raises the standard HTTP error when no dataset is loaded."""
    with pytest.raises(HTTPException) as exc_info:
        generate_report()

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "No dataset has been uploaded."