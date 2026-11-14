"""Tests for database persistence adapter mapping and safeguards."""

import pytest
from fireline_data.contracts.saffire import SaffireSpecimenRecord, SaffireRawRecord
from fireline_data.contracts.bass_ii import BassIIThinFilmRecord, BassIIRawRecord
from fireline_data.contracts.provenance import SourceProvenance
from fireline_data.ingestion.database_writer import DatabaseWriter


@pytest.fixture
def saffire_prov():
    return SourceProvenance(
        artifact_id="SYNTH-98",
        investigation_id="PSI-98",
        source_title_or_filename="saffire.csv",
        is_synthetic=True,
    )


@pytest.fixture
def bass_prov():
    return SourceProvenance(
        artifact_id="SYNTH-25",
        investigation_id="PSI-25",
        source_title_or_filename="bass.csv",
        is_synthetic=True,
    )


def test_db_writer_saffire_mapping(saffire_prov):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    raw = SaffireRawRecord(
        **{
            "Sample Number": "S1",
            "Material": "SIBAL Fabric",
            "Sample Thickness (cm)": "0.37",
            "Sample Length (cm)": "40.6",
            "Sample Width (cm)": "94",
            "Air Flow (cm/s)": "20",
            "Percent O2": "21.5 - 21.7",
            "Ignition Power (W)": "182",
        }
    )
    rec = SaffireSpecimenRecord.from_raw(raw, saffire_prov)
    candidates = DatabaseWriter.map_saffire_record(rec)

    assert len(candidates) == 3
    tables = {c.table_name: c for c in candidates}
    assert "material_samples" in tables
    assert "environmental_conditions" in tables
    assert "experimental_runs" in tables

    mat_fields = tables["material_samples"].fields
    assert mat_fields["thickness_mm"] == 3.7
    assert mat_fields["thickness_raw"] == "0.37"
    assert mat_fields["is_thickness_approximated"] is True

    run_fields = tables["experimental_runs"].fields
    assert run_fields["is_synthetic"] is True  # Synthetic isolation preserved!


def test_db_writer_bass_mapping(bass_prov):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    raw = BassIIRawRecord(
        **{
            "PI": "Bhattacharjee",
            "Test #": "B1",
            "Date": "2/19/2014",
            "GMT": "50",
            "Sample #": "147",
            "Fuel Sample Material": "100 micron PMMA film 2 cm wide",
            "Flow restrictor": "2",
            "Fan display": "62",
        }
    )
    rec = BassIIThinFilmRecord.from_raw(raw, bass_prov)
    candidates = DatabaseWriter.map_bass_record(rec)

    assert len(candidates) == 3
    tables = {c.table_name: c for c in candidates}

    env_fields = tables["environmental_conditions"].fields
    assert env_fields["fan_display_index"] == 62
    assert env_fields["is_flow_uncalibrated"] is True
    assert "flow_velocity_cm_s" not in env_fields  # Uncalibrated index not converted to velocity
