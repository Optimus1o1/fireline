"""Tests for common provenance and source identification contracts."""

import pytest
from fireline_data.contracts.provenance import (
    SourceProvenance,
    SourceLocation,
    RepositoryCategory,
    InspectionLifecycleStage,
    DataVerificationStatus,
)


def test_valid_source_provenance_creation():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    prov = SourceProvenance(
        artifact_id="SYNTH-ART-001",
        investigation_id="PSI-98",
        source_title_or_filename="saffire_synthetic_table.csv",
        official_source_url="https://psi.nasa.gov/test",
        repository_category=RepositoryCategory.EXPERIMENTAL_TABLE,
        source_location=SourceLocation(table_name="specimens", row_index=1),
        lifecycle_stage=InspectionLifecycleStage.STAGE_5_PARSED_EVALUATED,
        verification_status=DataVerificationStatus.PRELIMINARY_UNAUDITED,
        associated_claim_ids=["SAFFIRE-001"],
        is_synthetic=True,
    )
    assert prov.artifact_id == "SYNTH-ART-001"
    assert prov.investigation_id == "PSI-98"
    assert prov.is_synthetic is True
    assert prov.verification_status == DataVerificationStatus.PRELIMINARY_UNAUDITED


def test_provenance_default_status_is_not_verified():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    A source row must never default to VERIFIED_EMPIRICAL.
    """
    prov = SourceProvenance(
        artifact_id="SYNTH-ART-002",
        investigation_id="PSI-25",
        source_title_or_filename="bass_synthetic.csv",
    )
    assert prov.verification_status == DataVerificationStatus.PRELIMINARY_UNAUDITED
    assert prov.verification_status != DataVerificationStatus.VERIFIED_EMPIRICAL


def test_missing_required_identifiers_raise_error():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS."""
    with pytest.raises(Exception):
        # Missing artifact_id and investigation_id
        SourceProvenance(source_title_or_filename="incomplete.csv")


def test_synthetic_fixture_provenance_preserved():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Synthetic test fixture must retain its is_synthetic flag.
    """
    prov = SourceProvenance(
        artifact_id="SYNTH-FIXTURE-01",
        investigation_id="PSI-69",
        source_title_or_filename="synthetic_flex.csv",
        is_synthetic=True,
        verification_status=DataVerificationStatus.SYNTHETIC_ILLUSTRATIVE,
    )
    assert prov.is_synthetic is True
    assert prov.verification_status == DataVerificationStatus.SYNTHETIC_ILLUSTRATIVE
