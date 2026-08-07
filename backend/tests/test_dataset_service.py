"""Unit tests for shared dataset storage and profiling."""

from collections.abc import Generator

import pandas as pd
import pytest

from app.services import dataset_service


@pytest.fixture(autouse=True)
def clear_shared_dataset() -> Generator[None, None, None]:
    """Ensure each test starts with an empty shared dataset."""
    dataset_service.clear_dataset()
    yield
    dataset_service.clear_dataset()


def test_set_dataset_stores_a_defensive_profile_copy() -> None:
    """The dataset profile is generated once when a dataset is stored."""
    dataframe = pd.DataFrame({"category": ["A", None], "sales": [10, 10]})
    dataset_service.set_dataset(dataframe)

    profile = dataset_service.get_dataset_profile()

    assert profile is not None
    assert profile.missing_values == {"category": 1, "sales": 0}
    assert profile.missing_percentage == {"category": 50.0, "sales": 0.0}
    assert profile.dtypes == dataframe.dtypes.astype(str).to_dict()
    assert profile.duplicate_rows == 0

    profile.missing_values["category"] = 0
    stored_profile = dataset_service.get_dataset_profile()

    assert stored_profile is not None
    assert stored_profile.missing_values["category"] == 1
