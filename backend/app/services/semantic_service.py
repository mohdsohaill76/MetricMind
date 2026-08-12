"""Semantic processing service for MetricMind chat questions."""

from __future__ import annotations

import json
from pathlib import Path
import yaml

from app.services.dataset_service import get_dataset, get_dataset_profile, has_dataset

SEMANTIC_LAYER_DIR = Path(__file__).resolve().parents[3] / "semantic-layer"


def load_semantic_cubes() -> dict[str, object]:
    """Load semantic layer cube definitions from YAML files."""
    cubes: dict[str, object] = {}
    if not SEMANTIC_LAYER_DIR.exists():
        return cubes

    for file_path in SEMANTIC_LAYER_DIR.glob("*.yml"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if data and isinstance(data, dict) and "cubes" in data:
                    cubes[file_path.stem] = data["cubes"]
        except Exception:
            continue
    return cubes


def process_question(question: str) -> str:
    """Ground a question in the semantic layer and shared dataset before AI generation."""
    if not has_dataset():
        return question

    profile = get_dataset_profile()
    dataset = get_dataset()
    context: dict[str, object] = {
        "profile": profile.model_dump(mode="json") if profile is not None else {},
        "sample_rows": dataset.head(10).where(dataset.notna(), None).to_dict(orient="records"),
    }

    semantic_cubes = load_semantic_cubes()
    if semantic_cubes:
        context["semantic_layer_cubes"] = semantic_cubes

    return (
        f"User question: {question}\n\n"
        "Semantic layer context from the currently uploaded dataset:\n"
        f"{json.dumps(context, default=str)}"
    )
