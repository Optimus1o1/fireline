"""Tests for full validation pipeline execution and reporting."""

import pytest
from fireline_data.ingestion.manifest import OFFICIAL_MANIFESTS, ArtifactManifest
from fireline_data.ingestion.validation_pipeline import ValidationPipeline


def test_pipeline_saffire_staged_artifact():
    """Runs ingestion pipeline against locally staged PSI98-ART-002."""
    manifest = OFFICIAL_MANIFESTS["PSI98-ART-002"]
    report = ValidationPipeline.run_pipeline(manifest, dry_run=True)

    assert report.artifact_id == "PSI98-ART-002"
    assert report.investigation_id == "PSI-98"
    assert report.mode == "dry-run"
    assert report.total_rows_discovered == 5
    assert report.rows_accepted == 2  # S1, S2
    assert report.rows_requiring_review == 3  # F1C1/F1C2, F2C1/F2C2, blank row
    assert report.rows_quarantined == 0
    assert report.rows_persisted == 0  # Dry-run invariant


def test_pipeline_bass_ii_staged_artifact():
    """Runs ingestion pipeline against locally staged PSI25-ART-002."""
    manifest = OFFICIAL_MANIFESTS["PSI25-ART-002"]
    report = ValidationPipeline.run_pipeline(manifest, dry_run=True)

    assert report.artifact_id == "PSI25-ART-002"
    assert report.investigation_id == "PSI-25"
    assert report.mode == "dry-run"
    assert report.total_rows_discovered == 5
    assert report.rows_accepted == 5  # B1 through B5
    assert report.rows_quarantined == 0
    assert report.rows_persisted == 0


def test_pipeline_quarantine_corrupted_checksum(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "corrupted.csv"
    csv_file.write_text("Header1,Header2\nVal1,Val2\n")

    manifest = ArtifactManifest(
        artifact_id="SYNTH-CORRUPT",
        investigation_id="PSI-98",
        original_filename="corrupted.csv",
        source_url="https://psi.nasa.gov",
        expected_sha256="0000000000000000000000000000000000000000000000000000000000000000",
        local_path=str(csv_file),
        expected_columns=["Header1", "Header2"],
    )

    report = ValidationPipeline.run_pipeline(manifest, dry_run=True)
    assert report.rows_quarantined == 1
    assert "File integrity check failed" in report.row_details[0].quarantine_reason


def test_pipeline_duplicate_id_detection(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "duplicates.csv"
    csv_file.write_text(
        "Sample Number,Material,Sample Thickness (cm),Sample Length (cm),Sample Width (cm),Air Flow (cm/s),Percent O2,Ignition Power (W)\n"
        "S1,SIBAL Fabric,0.37,40.6,94,20,21.5,182\n"
        "S1,SIBAL Fabric,0.37,40.6,94,20,21.5,182\n"
    )

    import hashlib
    hasher = hashlib.sha256()
    with open(csv_file, "rb") as f:
        hasher.update(f.read())
    h = hasher.hexdigest()

    manifest = ArtifactManifest(
        artifact_id="SYNTH-DUP",
        investigation_id="PSI-98",
        original_filename="duplicates.csv",
        source_url="https://psi.nasa.gov",
        expected_sha256=h,
        local_path=str(csv_file),
        expected_columns=[
            "Sample Number",
            "Material",
            "Sample Thickness (cm)",
            "Sample Length (cm)",
            "Sample Width (cm)",
            "Air Flow (cm/s)",
            "Percent O2",
            "Ignition Power (W)",
        ],
    )

    report = ValidationPipeline.run_pipeline(manifest, dry_run=True)
    assert report.total_rows_discovered == 2
    assert report.rows_accepted == 2
    assert report.duplicate_rows_detected == 1


def test_pipeline_idempotency_simulation():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Verifies that running pipeline multiple times produces identical deterministic reports.
    """
    manifest = OFFICIAL_MANIFESTS["PSI98-ART-002"]
    rep1 = ValidationPipeline.run_pipeline(manifest, dry_run=True)
    rep2 = ValidationPipeline.run_pipeline(manifest, dry_run=True)

    assert rep1.total_rows_discovered == rep2.total_rows_discovered
    assert rep1.rows_accepted == rep2.rows_accepted
    assert rep1.rows_quarantined == rep2.rows_quarantined
    assert rep1.rows_requiring_review == rep2.rows_requiring_review
