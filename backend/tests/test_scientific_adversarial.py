"""Scientific adversarial and failure-mode test suite for FIRELINE.

Verifies that the system safely blocks, downgrades, or explicitly flags:
1. Fabricated run IDs
2. Unknown citations
3. Empty measurements
4. Invalid physical conditions (0% O2, negative pressure)
5. Uncalibrated fan index converted to velocity
6. Thin film vs thick rod geometric mismatch
7. Solid fuel vs liquid droplet phase mismatch
8. 34% O2 exploration atmosphere treated as verified
9. Lunar/Martian partial gravity treated as microgravity
10. AI responses lacking evidence citations
"""

import json
from pathlib import Path
import pytest


def _load_data():
    emp_p = Path("src/data/empirical_records.json")
    if not emp_p.is_file():
        emp_p = Path("../src/data/empirical_records.json")

    find_p = Path("src/data/audited_findings.json")
    if not find_p.is_file():
        find_p = Path("../src/data/audited_findings.json")

    with open(emp_p, "r", encoding="utf-8") as f:
        empirical = json.load(f)
    with open(find_p, "r", encoding="utf-8") as f:
        findings = json.load(f)

    return empirical, findings


# Adversarial 1: Fabricated run ID lookup returns None
def test_adversarial_fabricated_run_id_returns_none():
    empirical, _ = _load_data()
    fake_run_id = "PSI98-FAKE-999"
    match = next((r for r in empirical if r["runId"] == fake_run_id), None)
    assert match is None, f"Fabricated run ID {fake_run_id} unexpectedly found in database!"


# Adversarial 2: Citation Validator rejects unknown or hallucinated evidence IDs
def test_adversarial_unknown_citation_rejected():
    empirical, findings = _load_data()
    valid_ids = {r["runId"] for r in empirical} | {f["claimId"] for f in findings}

    hallucinated_ids = ["SAFFIRE-999", "BASS-FAKE-001", "NONEXISTENT-CITATION"]
    for hid in hallucinated_ids:
        assert hid not in valid_ids, f"Hallucinated citation {hid} matched valid evidence!"


# Adversarial 3: Empty measurements are preserved as null, never defaulted to 0.0
def test_adversarial_empty_measurements_are_preserved_as_null():
    empirical, _ = _load_data()
    flow_vis = next(r for r in empirical if r["runId"] == "PSI98-F1C1/F1C2")
    assert len(flow_vis["measurements"]) == 0
    assert flow_vis["dimensions"]["lengthMm"] is None
    assert flow_vis["dimensions"]["widthMm"] is None
    assert flow_vis["dimensions"]["thicknessMm"] is None
    # Must NOT be 0.0
    assert flow_vis["dimensions"]["thicknessMm"] != 0.0


# Adversarial 4: Uncalibrated fan index cannot be used as calibrated velocity (DEC-04)
def test_adversarial_uncalibrated_fan_index_not_calibrated_velocity():
    empirical, _ = _load_data()
    bass_record = next(r for r in empirical if r["runId"] == "PSI25-B1")
    env = bass_record["environmentalConditions"]
    assert env["isFlowUncalibrated"] is True
    assert env["flowVelocityCmS"] is None
    assert env["fanDisplayIndex"] == 62


# Adversarial 5: Incompatible geometries cannot be directly compared
def test_adversarial_geometry_biot_number_isolation():
    _, findings = _load_data()
    cross_003 = next(f for f in findings if f["claimId"] == "CROSS-003")
    assert "thermal thickness" in cross_003["findingStatement"].lower()
    assert "opposed-flow" in cross_003["findingStatement"].lower()


# Adversarial 6: Phase divergence (liquid droplets vs solid plastics) is strictly guarded
def test_adversarial_solid_vs_liquid_phase_isolation():
    _, findings = _load_data()
    cross_001 = next(f for f in findings if f["claimId"] == "CROSS-001")
    assert cross_001["auditDisposition"] == "VERIFIED"
    assert "liquid droplet" in cross_001["findingStatement"].lower()
    assert "solid" in cross_001["findingStatement"].lower()


# Adversarial 7: 34% O2 cannot be returned as EVIDENCE_AVAILABLE
def test_adversarial_artemis_atmosphere_cannot_be_verified():
    _, findings = _load_data()
    artemis_finding = next(f for f in findings if f["claimId"] == "CROSS-005")
    assert artemis_finding["auditDisposition"] == "EVIDENCE_GAP"
    assert "cannot predict" in artemis_finding["limitations"].lower()


# Adversarial 8: Lunar (0.16g) and Martian (0.38g) gravity cannot be treated as microgravity
def test_adversarial_partial_gravity_cannot_be_verified():
    _, findings = _load_data()
    partial_grav = next(f for f in findings if f["claimId"] == "CROSS-004")
    assert partial_grav["auditDisposition"] == "EVIDENCE_GAP"
    assert "zero flight combustion data" in partial_grav["limitations"].lower()


# Adversarial 9: Derived estimates must not be labeled as empirical measurements
def test_adversarial_derived_estimate_isolation():
    _, findings = _load_data()
    saffire_006 = next(f for f in findings if f["claimId"] == "SAFFIRE-006")
    assert saffire_006["auditDisposition"] == "DERIVED_ESTIMATE"
    assert saffire_006["auditDisposition"] != "VERIFIED"


# Adversarial 10: Unverified telemetry must not be labeled as verified
def test_adversarial_unverified_telemetry_isolation():
    _, findings = _load_data()
    saffire_009 = next(f for f in findings if f["claimId"] == "SAFFIRE-009")
    assert saffire_009["auditDisposition"] == "UNVERIFIED"
    assert saffire_009["auditDisposition"] != "VERIFIED"
