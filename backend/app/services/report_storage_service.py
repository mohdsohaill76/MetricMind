"""In-memory storage for generated MetricMind reports."""

from copy import deepcopy

from app.models.response_models import ReportMetadata


_reports: dict[str, dict] = {}


def save_report(report: dict) -> None:
    """Store a generated report, replacing any report with the same identifier."""
    _reports[report["report_id"]] = deepcopy(report)


def get_report(report_id: str) -> dict | None:
    """Return a copy of one stored report, when available."""
    report = _reports.get(report_id)
    return deepcopy(report) if report is not None else None


def get_all_reports() -> list[dict]:
    """Return copies of all stored reports in generation order."""
    return deepcopy(list(_reports.values()))


def get_all_report_metadata() -> list[ReportMetadata]:
    """Return lightweight metadata for every stored report."""
    return [
        ReportMetadata(
            report_id=report["report_id"],
            generated_at=report["generated_at"],
            status=report["status"],
            dataset_quality=report.get("dataset_quality", "Unknown"),
        )
        for report in _reports.values()
    ]


def clear_reports() -> None:
    """Remove all stored reports."""
    _reports.clear()
