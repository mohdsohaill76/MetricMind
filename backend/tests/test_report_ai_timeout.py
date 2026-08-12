"""Report fallback coverage for failed Groq insight generation."""

from io import StringIO

import pandas as pd
import pytest

from app.models.request_models import ChartGenerationRequest, ReportGenerationRequest
from app.services import dataset_service
from app.services.report_service import generate_report


@pytest.fixture(autouse=True)
def clear_shared_dataset():
    """Keep the shared in-memory dataset isolated for this module."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


def test_generate_report_uses_fallback_after_ai_timeout_and_generates_charts(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A timed-out Groq call still returns a completed report and unchanged charts."""
    def raise_timeout(*args, **kwargs):
        raise TimeoutError("Groq request timed out")

    generated_chart_requests: list[ChartGenerationRequest] = []
    monkeypatch.setattr(
        "app.services.ai_service.generate_report_insights",
        raise_timeout,
    )
    monkeypatch.setattr(
        "app.services.report_service.generate_chart",
        generated_chart_requests.append,
    )
    dataset_service.set_dataset(
        pd.read_csv(
            StringIO(
                "region,sales,margin\n"
                "North,100,0.20\n"
                "South,150,0.35\n"
                "West,200,0.40\n"
            )
        )
    )

    report = generate_report(ReportGenerationRequest(report_focus="margin analysis"))

    assert report.status == "completed"
    assert report.key_insights[0] == "Dataset contains 3 rows and 3 columns."
    assert report.key_insights[-1] == "Requested focus area: margin analysis."
    assert report.recommendations
    assert generated_chart_requests == [
        ChartGenerationRequest(chart_type="histogram", x_column="sales"),
        ChartGenerationRequest(chart_type="box", x_column="region", y_column="sales"),
        ChartGenerationRequest(chart_type="bar", x_column="region", y_column="sales"),
        ChartGenerationRequest(chart_type="scatter", x_column="sales", y_column="margin"),
    ]
