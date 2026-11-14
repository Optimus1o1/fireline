"""Deterministic source CSV reader preserving original headers, rows, and empty cells."""

import csv
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class RawSourceRow(BaseModel):
    """Encapsulates an extracted row with explicit line-number provenance."""
    model_config = ConfigDict(frozen=True)

    artifact_id: str
    row_number: int  # 1-based data row number (excluding header)
    headers: List[str]
    raw_fields: Dict[str, str]
    is_blank_row: bool = False


class SourceReadResult(BaseModel):
    """Outcome of reading a source CSV artifact."""
    model_config = ConfigDict(frozen=True)

    artifact_id: str
    file_path: str
    headers: List[str]
    rows: List[RawSourceRow]
    total_rows_found: int
    missing_headers: List[str] = []
    unexpected_headers: List[str] = []


class DeterministicSourceReader:
    """Safely extracts CSV content preserving row order, raw text, and empty cells."""

    @staticmethod
    def read_csv(file_path: str, artifact_id: str, expected_headers: Optional[List[str]] = None) -> SourceReadResult:
        p = Path(file_path)
        if not p.is_file():
            raise FileNotFoundError(f"Source artifact file not found: {file_path}")

        with open(p, mode="r", encoding="utf-8-sig", newline="") as f:
            reader = csv.reader(f)
            try:
                header_row = next(reader)
            except StopIteration:
                return SourceReadResult(
                    artifact_id=artifact_id,
                    file_path=file_path,
                    headers=[],
                    rows=[],
                    total_rows_found=0,
                )

            headers = [h.strip() for h in header_row]
            rows: List[RawSourceRow] = []

            for idx, raw_record in enumerate(reader, start=1):
                # Map headers to fields, handling rows shorter than header
                fields: Dict[str, str] = {}
                is_all_empty = True
                for h_idx, h_name in enumerate(headers):
                    val = raw_record[h_idx].strip() if h_idx < len(raw_record) else ""
                    fields[h_name] = val
                    if val != "":
                        is_all_empty = False

                rows.append(
                    RawSourceRow(
                        artifact_id=artifact_id,
                        row_number=idx,
                        headers=headers,
                        raw_fields=fields,
                        is_blank_row=is_all_empty,
                    )
                )

        missing = []
        unexpected = []
        if expected_headers:
            missing = [h for h in expected_headers if h not in headers]
            unexpected = [h for h in headers if h not in expected_headers]

        return SourceReadResult(
            artifact_id=artifact_id,
            file_path=file_path,
            headers=headers,
            rows=rows,
            total_rows_found=len(rows),
            missing_headers=missing,
            unexpected_headers=unexpected,
        )
