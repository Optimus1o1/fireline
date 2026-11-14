"""Ingestion execution report model."""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class IngestionRowReport(BaseModel):
    model_config = ConfigDict(frozen=True)

    row_number: int
    record_id: Optional[str] = None
    disposition: str
    verification_status: str
    notes: List[str] = []
    quarantine_reason: Optional[str] = None


class IngestionReport(BaseModel):
    """Authoritative structured report of an ingestion run."""
    model_config = ConfigDict(frozen=True)

    artifact_id: str
    investigation_id: str
    source_checksum: str
    execution_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    mode: str = "dry-run"  # 'dry-run' or 'apply'
    total_rows_discovered: int = 0
    rows_parsed: int = 0
    rows_accepted: int = 0
    rows_requiring_review: int = 0
    rows_quarantined: int = 0
    rows_rejected: int = 0
    rows_persisted: int = 0
    duplicate_rows_detected: int = 0
    missing_value_count: int = 0
    row_details: List[IngestionRowReport] = []
