"""Shared dataset storage for MetricMind backend services."""

from __future__ import annotations

from typing import Final

import pandas as pd


_DATASET: pd.DataFrame | None = None
_EMPTY_DATASET: Final[pd.DataFrame] = pd.DataFrame()


def set_dataset(dataframe: pd.DataFrame) -> None:
    """Store a copy of the most recently uploaded dataset."""
    global _DATASET
    _DATASET = dataframe.copy(deep=True)


def get_dataset() -> pd.DataFrame:
    """Return a copy of the stored dataset, or an empty frame when unavailable."""
    if _DATASET is None:
        return _EMPTY_DATASET.copy(deep=True)

    return _DATASET.copy(deep=True)


def clear_dataset() -> None:
    """Remove the stored dataset."""
    global _DATASET
    _DATASET = None


def has_dataset() -> bool:
    """Return whether a dataset has been stored."""
    return _DATASET is not None