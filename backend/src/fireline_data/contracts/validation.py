"""Validation disposition and record processing pipeline rules.

Distinguishes:
- VALID_RECORD: Passed structural validation and physical safeguards.
- INVALID_RECORD: Violates physical laws or malformed headers.
- REQUIRES_REVIEW: Ambiguous ranges, conflicting literature, or missing metadata.
- BLOCKED_DECISION: Dependent on unresolved canonical HCO schema decision.

A valid record DOES NOT automatically receive VERIFIED_EMPIRICAL status.
"""

from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from .provenance import DataVerificationStatus


class ValidationDisposition(str, Enum):
    VALID_RECORD = "VALID_RECORD"
    INVALID_RECORD = "INVALID_RECORD"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"
    BLOCKED_DECISION = "BLOCKED_DECISION"


class ValidationResult(BaseModel):
    """Encapsulates outcome of validating a source record."""
    model_config = ConfigDict(frozen=True)

    disposition: ValidationDisposition
    assigned_verification: DataVerificationStatus
    notes: List[str] = Field(default_factory=list)
    quarantine_reason: Optional[str] = None
    is_safe_for_ingestion: bool = False

    @classmethod
    def valid_unverified(cls, notes: Optional[List[str]] = None) -> "ValidationResult":
        """Record passed parsing, but remains PRELIMINARY_UNAUDITED pending human verification."""
        return cls(
            disposition=ValidationDisposition.VALID_RECORD,
            assigned_verification=DataVerificationStatus.PRELIMINARY_UNAUDITED,
            notes=notes or ["Passed schema parsing"],
            is_safe_for_ingestion=True
        )

    @classmethod
    def requires_review(cls, reason: str) -> "ValidationResult":
        return cls(
            disposition=ValidationDisposition.REQUIRES_REVIEW,
            assigned_verification=DataVerificationStatus.PARTIALLY_VERIFIED,
            notes=[reason],
            is_safe_for_ingestion=False
        )

    @classmethod
    def quarantined(cls, reason: str) -> "ValidationResult":
        return cls(
            disposition=ValidationDisposition.INVALID_RECORD,
            assigned_verification=DataVerificationStatus.QUARANTINED,
            quarantine_reason=reason,
            notes=[f"Quarantined: {reason}"],
            is_safe_for_ingestion=False
        )

    @classmethod
    def blocked(cls, adr_reference: str) -> "ValidationResult":
        return cls(
            disposition=ValidationDisposition.BLOCKED_DECISION,
            assigned_verification=DataVerificationStatus.PRELIMINARY_UNAUDITED,
            notes=[f"Blocked pending ADR: {adr_reference}"],
            is_safe_for_ingestion=False
        )
