"""Tests for BASS-II (PSI-25) thin-film contracts and safeguards."""

import pytest
from fireline_data.contracts.bass_ii import BassIIRawRecord, BassIIThinFilmRecord
from fireline_data.contracts.provenance import SourceProvenance


@pytest.fixture
def base_provenance():
    return SourceProvenance(
        artifact_id="SYNTH-PSI25-001",
        investigation_id="PSI-25",
        source_title_or_filename="bass_ii_synthetic.csv",
        is_synthetic=True,
    )


def test_bass_ii_thin_film_valid_record(base_provenance):
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
    rec = BassIIThinFilmRecord.from_raw(raw, base_provenance)

    assert rec.test_id == "B1"
    assert rec.pi_name == "Bhattacharjee"
    assert rec.sample_number == "147"
    assert rec.geometry_type == "thin_film"
    
    # Thickness & Width parsing
    assert rec.thickness is not None
    assert rec.thickness.raw_value == 100.0
    assert rec.thickness.raw_unit == "micron"
    assert rec.thickness.normalized_value == 0.1 # 100 micron = 0.1 mm
    assert rec.thickness.normalized_unit == "mm"

    assert rec.width is not None
    assert rec.width.raw_value == 2.0
    assert rec.width.raw_unit == "cm"
    assert rec.width.normalized_value == 20.0 # 2 cm = 20 mm
    assert rec.width.normalized_unit == "mm"


def test_bass_ii_fan_display_remains_index_never_velocity(base_provenance):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Critical Safeguard: Fan display is an integer display setting.
    It must NEVER be converted to cm/s or m/s without an approved calibration curve (DEC-04).
    """
    raw = BassIIRawRecord(
        **{
            "PI": "Bhattacharjee",
            "Test #": "B2",
            "Date": "2/19/2014",
            "GMT": "50",
            "Sample #": "155",
            "Fuel Sample Material": "200 micron PMMA film 2 cm wide",
            "Flow restrictor": "2",
            "Fan display": "47",
        }
    )
    rec = BassIIThinFilmRecord.from_raw(raw, base_provenance)

    assert rec.fan_display_index == 47
    assert rec.is_flow_uncalibrated is True
    assert not hasattr(rec, "flow_velocity_cm_s")


def test_bass_ii_thin_film_isolated_from_cylindrical_rods(base_provenance):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Critical Safeguard: Thin PMMA films cannot be reclassified as Olson & Ferkul cylindrical rods (DEC-02).
    """
    raw = BassIIRawRecord(
        **{
            "PI": "Bhattacharjee",
            "Test #": "B3",
            "Date": "2/19/2014",
            "GMT": "50",
            "Sample #": "148",
            "Fuel Sample Material": "300 micron PMMA film 2 cm wide",
            "Flow restrictor": "2",
            "Fan display": "61",
        }
    )
    rec = BassIIThinFilmRecord.from_raw(raw, base_provenance)

    assert rec.geometry_type == "thin_film"
    assert rec.geometry_type != "cylindrical_rod"
