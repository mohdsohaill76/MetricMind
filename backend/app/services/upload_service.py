"""CSV upload processing for the MetricMind API."""

import asyncio
import csv
import json
from io import TextIOWrapper
from typing import Any, BinaryIO

import pandas as pd
from fastapi import HTTPException, UploadFile
from pandas.errors import EmptyDataError, ParserError

from app.models.response_models import UploadResponse


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
    )


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
