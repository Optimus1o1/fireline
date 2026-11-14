"""Tests for validation disposition and scientific integrity rules."""

import pytest
from fireline_data.contracts.validation import ValidationResult, ValidationDisposition
from fireline_data.contracts.provenance import DataVerificationStatus


def test_valid_record_does_not_receive_verified_empirical():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    A valid parsed record must receive PRELIMINARY_UNAUDITED, not VERIFIED_EMPIRICAL.
    """
    res = ValidationResult.valid_unverified()
    assert res.disposition == ValidationDisposition.VALID_RECORD
    assert res.assigned_verification == DataVerificationStatus.PRELIMINARY_UNAUDITED
    assert res.assigned_verification != DataVerificationStatus.VERIFIED_EMPIRICAL
    assert res.is_safe_for_ingestion is True


def test_quarantined_record_marked_unsafe():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS."""
    res = ValidationResult.quarantined("Non-physical oxygen fraction: -0.05")
    assert res.disposition == ValidationDisposition.INVALID_RECORD
    assert res.assigned_verification == DataVerificationStatus.QUARANTINED
    assert res.is_safe_for_ingestion is False
    assert "Non-physical" in res.quarantine_reason


def test_blocked_adr_decision_handled():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS."""
    res = ValidationResult.blocked("ADR-003: FLEX Droplet Geometry & Non-Nullable Velocity")
    assert res.disposition == ValidationDisposition.BLOCKED_DECISION
    assert res.is_safe_for_ingestion is False
    assert any("ADR-003" in n for n in res.notes)
