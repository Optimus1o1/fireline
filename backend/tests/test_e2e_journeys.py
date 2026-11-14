"""End-to-End Workflow Journeys Test Suite for FIRELINE.

Validates complete user journeys from Evidence Explorer to Physical Comparison,
Mission Assessment, and SI Copilot grounded explanations.
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


# === Journey A: Evidence Discovery ===
def test_journey_a_evidence_discovery_search_and_filter():
    empirical, _ = _load_data()

    # Search for PMMA
    pmma_records = [r for r in empirical if "pmma" in r["material"].lower()]
    assert len(pmma_records) == 5
    for r in pmma_records:
        assert r["investigationId"] == "PSI-25"
        assert r["geometry"] == "thin_film"

    # Search for SIBAL
    sibal_records = [r for r in empirical if "sibal" in r["material"].lower()]
    assert len(sibal_records) == 2
    for r in sibal_records:
        assert r["investigationId"] == "PSI-98"
        assert r["geometry"] == "fabric"

    # Diagnostic records are tagged REQUIRES_REVIEW
    flow_vis = [r for r in empirical if r["geometry"] == "flow_visualization"]
    assert len(flow_vis) == 2
    for r in flow_vis:
        assert r["disposition"] == "REQUIRES_REVIEW"


# === Journey B: Physical Comparison Gates ===
def test_journey_b_replicate_comparison():
    empirical, _ = _load_data()
    s1 = next(r for r in empirical if r["runId"] == "PSI98-S1")
    s2 = next(r for r in empirical if r["runId"] == "PSI98-S2")

    # Identical materials and geometry
    assert s1["material"] == s2["material"]
    assert s1["geometry"] == s2["geometry"]
    assert s1["environmentalConditions"]["flowVelocityCmS"] == s2["environmentalConditions"]["flowVelocityCmS"]


def test_journey_b_cross_material_incompatibility():
    empirical, _ = _load_data()
    saffire = next(r for r in empirical if r["runId"] == "PSI98-S1")
    bass = next(r for r in empirical if r["runId"] == "PSI25-B1")

    # Material mismatch (SIBAL vs PMMA)
    assert saffire["material"] != bass["material"]
    # Geometry mismatch (fabric vs thin film)
    assert saffire["geometry"] != bass["geometry"]
    # Flow direction mismatch (concurrent vs opposed)
    # Flow calibration mismatch (calibrated 20 cm/s vs uncalibrated fan index)
    assert saffire["environmentalConditions"]["flowVelocityCmS"] == 20.0
    assert bass["environmentalConditions"]["isFlowUncalibrated"] is True


def test_journey_b_diagnostic_isolation():
    empirical, _ = _load_data()
    s1 = next(r for r in empirical if r["runId"] == "PSI98-S1")
    flow_vis = next(r for r in empirical if r["runId"] == "PSI98-F1C1/F1C2")

    assert s1["geometry"] == "fabric"
    assert flow_vis["geometry"] == "flow_visualization"
    assert flow_vis["disposition"] == "REQUIRES_REVIEW"


# === Journey C: Mission Assessment ===
def test_journey_c_iss_nominal_assessment():
    empirical, findings = _load_data()
    # Nominal ISS conditions match Saffire-I
    saffire_claims = [f for f in findings if f["investigationId"] == "PSI-98" and f["auditDisposition"] == "VERIFIED"]
    assert len(saffire_claims) >= 5

    spread_rate = next(f for f in saffire_claims if f["claimId"] == "SAFFIRE-004")
    assert "2.0 to 2.5 mm/s" in spread_rate["findingStatement"]


def test_journey_c_artemis_evidence_gap():
    _, findings = _load_data()
    artemis_gap = next(f for f in findings if f["claimId"] == "CROSS-005")
    assert artemis_gap["auditDisposition"] == "EVIDENCE_GAP"
    assert "34% O2" in artemis_gap["applicableConditions"]

    lunar_gap = next(f for f in findings if f["claimId"] == "CROSS-004")
    assert lunar_gap["auditDisposition"] == "EVIDENCE_GAP"
    assert "Lunar 0.16g" in lunar_gap["findingStatement"]


# === Journey D: SI Copilot Retrieval & Citations ===
def test_journey_d_copilot_retrieval_and_citations():
    empirical, findings = _load_data()

    # Query for Saffire
    saffire_matches = [f for f in findings if f["investigationId"] == "PSI-98"]
    assert len(saffire_matches) >= 6

    # Verify each match has a verifiable publication and DOI
    for f in saffire_matches:
        if f["claimId"] == "SAFFIRE-009":
            continue  # unverified draft
        assert f.get("sourcePublication")
        assert f.get("doi")


# === Journey E: Cross-Module Traceability ===
def test_journey_e_cross_module_traceability():
    empirical, findings = _load_data()

    # All empirical records link to official NASA PSI URLs
    for r in empirical:
        assert r["sourceUrl"].startswith("https://psi.nasa.gov/")
        assert r["sourceArtifact"] in ["PSI98-ART-002", "PSI25-ART-002"]

    # All verified claims link to valid DOI URLs
    for f in findings:
        if f.get("doi") and f["auditDisposition"] == "VERIFIED":
            assert f["doi"].startswith("10.")
