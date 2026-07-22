"""CSV upload processing for the MetricMind API."""

import asyncio
import csv
import json
from io import TextIOWrapper
from typing import Any, BinaryIO

import pandas as pd
from fastapi import HTTPException, UploadFile
from pandas.errors import EmptyDataError, ParserError

from app.models.response_models import UploadProfile, UploadResponse


async def process_upload(file: UploadFile) -> UploadResponse:
    """Read an uploaded CSV and build its dataset preview response."""
    filename = file.filename or ""
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    await file.seek(0)
    return await asyncio.to_thread(
        _build_upload_response,
        file.file,
        filename,
    )


def _build_upload_response(file: BinaryIO, filename: str) -> UploadResponse:
    """Parse CSV contents and create a JSON-compatible dataset preview."""
    _validate_csv(file)

    try:
        dataframe = pd.read_csv(file)
    except EmptyDataError as exc:
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV is empty.",
        ) from exc
    except (ParserError, UnicodeDecodeError) as exc:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid CSV.",
        ) from exc

    preview: list[dict[str, Any]] = json.loads(
        dataframe.head(10).to_json(orient="records")
    )

    return UploadResponse(
        filename=filename,
        rows=len(dataframe.index),
        columns=len(dataframe.columns),
        column_names=[str(column) for column in dataframe.columns],
        preview=preview,
        profile=_build_profile(dataframe),
    )


def _build_profile(dataframe: pd.DataFrame) -> UploadProfile:
    """Build profiling details for the uploaded dataset."""
    numeric_frame = dataframe.select_dtypes(include="number")
    numeric_column_names = [str(column) for column in numeric_frame.columns]
    numeric_column_set = set(numeric_column_names)
    categorical_columns = [
        str(column)
        for column in dataframe.columns
        if str(column) not in numeric_column_set
    ]
    missing_values = _build_missing_values(dataframe)
    rows, columns = dataframe.shape

    return UploadProfile(
        shape={"rows": int(rows), "columns": int(columns)},
        missing_values=missing_values,
        missing_percentage=_build_missing_percentage(missing_values, rows),
        dtypes=_build_dtypes(dataframe),
        numeric_columns=numeric_column_names,
        categorical_columns=categorical_columns,
        unique_values=_build_unique_values(dataframe),
        duplicate_rows=_count_duplicate_rows(dataframe),
        memory_usage_bytes=_calculate_memory_usage_bytes(dataframe),
        numeric_summary=_build_numeric_summary(numeric_frame),
    )


def _build_missing_values(dataframe: pd.DataFrame) -> dict[str, int]:
    """Count missing values per column."""
    return {
        str(column): int(count)
        for column, count in dataframe.isna().sum().items()
    }


def _build_missing_percentage(
    missing_values: dict[str, int],
    rows: int,
) -> dict[str, float]:
    """Calculate missing-value percentages per column."""
    if rows == 0:
        return {column: 0.0 for column in missing_values}

    return {
        column: round((missing_count / rows) * 100, 2)
        for column, missing_count in missing_values.items()
    }


def _build_dtypes(dataframe: pd.DataFrame) -> dict[str, str]:
    """Capture the inferred dtype for each column."""
    return {str(column): str(dtype) for column, dtype in dataframe.dtypes.items()}


def _count_duplicate_rows(dataframe: pd.DataFrame) -> int:
    """Count duplicate rows in the uploaded dataset."""
    return int(dataframe.duplicated().sum())


def _build_unique_values(dataframe: pd.DataFrame) -> dict[str, int]:
    """Count unique values per column."""
    return {
        str(column): int(count)
        for column, count in dataframe.nunique(dropna=True).items()
    }


def _calculate_memory_usage_bytes(dataframe: pd.DataFrame) -> int:
    """Calculate the deep memory footprint of the dataset."""
    return int(dataframe.memory_usage(deep=True).sum())


def _build_numeric_summary(numeric_frame: pd.DataFrame) -> dict[str, dict[str, float]]:
    """Build summary statistics for numeric columns."""
    if numeric_frame.empty:
        return {}

    summary_frame = numeric_frame.describe(percentiles=[0.25, 0.5, 0.75])
    population_std = numeric_frame.std(ddof=0)
    numeric_summary: dict[str, dict[str, float]] = {}

    for column in numeric_frame.columns:
        column_name = str(column)
        if summary_frame[column].get("count", 0.0) == 0.0:
            numeric_summary[column_name] = {
                "count": 0.0,
                "mean": 0.0,
                "std": 0.0,
                "min": 0.0,
                "25%": 0.0,
                "50%": 0.0,
                "75%": 0.0,
                "max": 0.0,
            }
            continue

        numeric_summary[column_name] = {
            "count": float(summary_frame[column]["count"]),
            "mean": float(summary_frame[column]["mean"]),
            "std": float(population_std[column]),
            "min": float(summary_frame[column]["min"]),
            "25%": float(summary_frame[column]["25%"]),
            "50%": float(summary_frame[column]["50%"]),
            "75%": float(summary_frame[column]["75%"]),
            "max": float(summary_frame[column]["max"]),
        }

    return numeric_summary


def _validate_csv(file: BinaryIO) -> None:
    """Ensure a CSV has headers, consistently shaped rows, and data rows."""
    sample = file.read(8_192)
    if not sample.strip():
        raise HTTPException(status_code=400, detail="The uploaded CSV is empty.")

    file.seek(0)

    text_file = TextIOWrapper(file, encoding="utf-8-sig", newline="")
    try:
        reader = csv.reader(text_file, strict=True)
        header = next(reader, None)
        if header is None:
            raise HTTPException(status_code=400, detail="The uploaded CSV is empty.")
        if not all(column.strip() for column in header):
            raise HTTPException(
                status_code=400,
                detail="The uploaded CSV must include headers.",
            )

        data_rows = 0
        for row in reader:
            if not row:
                continue
            if len(row) != len(header):
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded file is not a valid CSV.",
                )
            data_rows += 1
    except (csv.Error, UnicodeDecodeError) as exc:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid CSV.",
        ) from exc
    finally:
        text_file.detach()
        file.seek(0)

    if not data_rows:
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV must contain at least one data row.",
        )
