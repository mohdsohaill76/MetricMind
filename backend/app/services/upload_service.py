"""CSV upload processing for the MetricMind API."""

import asyncio
import json
from typing import Any, BinaryIO

import pandas as pd
from fastapi import UploadFile

from app.models.response_models import UploadResponse


async def process_upload(file: UploadFile) -> UploadResponse:
    """Read an uploaded CSV and build its dataset preview response."""
    await file.seek(0)
    return await asyncio.to_thread(
        _build_upload_response,
        file.file,
        file.filename or "",
    )


def _build_upload_response(file: BinaryIO, filename: str) -> UploadResponse:
    """Parse CSV contents and create a JSON-compatible dataset preview."""
    dataframe = pd.read_csv(file)
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
