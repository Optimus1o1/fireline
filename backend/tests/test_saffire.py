"""Tests for Saffire-I (PSI-98) contracts and safeguards."""

import pytest
from fireline_data.contracts.saffire import SaffireRawRecord, SaffireSpecimenRecord
from fireline_data.contracts.provenance import SourceProvenance, DataVerificationStatus


@pytest.fixture
def base_provenance():
    return SourceProvenance(
        artifact_id="SYNTH-PSI98-001",
        investigation_id="PSI-98",
        source_title_or_filename="saffire_synthetic.csv",
        is_synthetic=True,
    )


def test_saffire_specimen_valid_record(base_provenance):
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
    rec = SaffireSpecimenRecord.from_raw(raw, base_provenance)

    assert rec.sample_number == "S1"
    assert rec.is_flow_visualization is False
    assert rec.thickness is not None
    assert rec.thickness.raw_value == 0.37
    assert rec.thickness.raw_unit == "cm"
    assert rec.thickness.normalized_value == 3.7
    assert rec.thickness.normalized_unit == "mm"
    assert rec.thickness.is_approximated is True # Preserved DEC-01 safeguard
    assert rec.is_oxygen_range is True
    assert rec.oxygen_percentage_raw == "21.5 - 21.7"
    assert rec.oxygen_mole_fraction_nominal == pytest.approx(0.216, rel=1e-3)


def test_saffire_thickness_safeguard_does_not_merge_0_4_mm(base_provenance):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Critical Safeguard: The 0.37 cm reported table value must NOT be silently
    reconciled or replaced with the ~0.4 mm paper value without an explicit provenance trail.
    """
    raw = SaffireRawRecord(
        **{
            "Sample Number": "S2",
            "Material": "SIBAL Fabric",
            "Sample Thickness (cm)": "0.37",
            "Sample Length (cm)": "40.6",
            "Sample Width (cm)": "94",
            "Air Flow (cm/s)": "20",
            "Percent O2": "~ 21.5",
            "Ignition Power (W)": "182",
        }
    )
    rec = SaffireSpecimenRecord.from_raw(raw, base_provenance)

    # 0.37 cm is converted to 3.7 mm, NOT 0.4 mm
    assert rec.thickness.normalized_value == 3.7
    assert rec.thickness.normalized_value != 0.4
    assert rec.thickness.raw_value == 0.37


def test_saffire_flow_visualization_row_segregated(base_provenance):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Flow visualization rows must be flagged and blank values must remain None, NOT 0.
    """
    raw = SaffireRawRecord(
        **{
            "Sample Number": "F1C1/F1C2",
            "Material": "Pre-test flow visulation data for sample 1",
            "Sample Thickness (cm)": "",
            "Sample Length (cm)": "",
            "Sample Width (cm)": "",
            "Air Flow (cm/s)": "",
            "Percent O2": "",
            "Ignition Power (W)": "",
        }
    )
    rec = SaffireSpecimenRecord.from_raw(raw, base_provenance)

    assert rec.is_flow_visualization is True
    assert rec.thickness is None
    assert rec.length is None
    assert rec.air_flow is None
    assert rec.ignition_power_w is None
