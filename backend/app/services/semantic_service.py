"""Semantic processing service for MetricMind chat questions."""

from __future__ import annotations

import json

from app.services.dataset_service import get_dataset, get_dataset_profile, has_dataset


def process_question(question: str) -> str:
    """Ground a question in the shared dataset before AI generation."""
    if not has_dataset():
        return question

    profile = get_dataset_profile()
    dataset = get_dataset()
    context = {
        "profile": profile.model_dump(mode="json") if profile is not None else {},
        "sample_rows": dataset.head(10).where(dataset.notna(), None).to_dict(orient="records"),
    }
    return (
        f"User question: {question}\n\n"
        "Semantic layer context from the currently uploaded dataset:\n"
        f"{json.dumps(context, default=str)}"
    )
