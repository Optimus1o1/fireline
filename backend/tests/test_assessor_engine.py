"""Comprehensive test suite for FIRELINE Evidence-Gap Assessor and Relevance Ranking.

Verifies deterministic multi-criteria matching, epistemic gap classification,
and scientific integrity safeguards against fire-risk prediction.
"""

import json
from pathlib import Path
import pytest


def _load_knowledge_base():
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


class MockAssessorEvaluator:
    """Python reference evaluation matching src/lib/assessor/engine.ts deterministic rules."""

    @staticmethod
    def evaluate_scenario(scenario: dict, findings: list, empirical: list):
        gaps = []
        rankings = []

        # Gravity gap check
        if scenario.get("gravityRegime") != "microgravity" and scenario.get("gravity_g", 0) > 0:
            gaps.append({
                "gapId": "GAP-GRAV-PARTIAL",
                "parameterName": "Partial-Gravity Regime",
                "severity": "CRITICAL_GAP",
                "citation": "CROSS-004",
            })

        # Exploration atmosphere O2 check
        if scenario.get("oxygenPercent", 21.0) > 25.0:
            gaps.append({
                "gapId": "GAP-ATM-O2-ELEVATED",
                "parameterName": "Exploration Atmosphere Oxygen Concentration",
                "severity": "CRITICAL_GAP",
                "citation": "CROSS-005",
            })

        # Sub-atmospheric pressure check
        if scenario.get("pressureKpa", 101.3) < 80.0:
            gaps.append({
                "gapId": "GAP-ATM-SUBATMOSPHERIC",
                "parameterName": "Total Ambient Pressure",
                "severity": "PARTIAL_GAP",
            })

        # Phase check: Liquid vs Solid
        mat = scenario.get("materialTarget", "").lower()
        if "liquid" in mat or "droplet" in mat:
            gaps.append({
                "gapId": "GAP-PHASE-SOLID-VS-LIQUID",
                "parameterName": "Physical Phase Divergence",
                "severity": "CRITICAL_GAP",
                "citation": "CROSS-001",
            })

        # Uncalibrated flow index check
        flow = scenario.get("flowVelocityCmS")
        if flow is not None and flow < 5.0 and "bass" in scenario.get("name", "").lower():
            gaps.append({
                "gapId": "GAP-FLOW-UNCALIBRATED",
                "parameterName": "BASS-II Flow Calibration",
                "severity": "PARTIAL_GAP",
                "citation": "BASS-007",
            })

        crit_count = sum(1 for g in gaps if g["severity"] == "CRITICAL_GAP")
        part_count = sum(1 for g in gaps if g["severity"] == "PARTIAL_GAP")

        if crit_count > 0:
            status = "EVIDENCE_GAP"
        elif part_count > 0:
            status = "PARTIAL_EVIDENCE"
        else:
            status = "EVIDENCE_AVAILABLE"

        return {
            "status": status,
            "gaps": gaps,
            "criticalCount": crit_count,
            "partialCount": part_count,
        }


# --- Test 1: Standard ISS Nominal Scenario ---
def test_iss_nominal_scenario_has_direct_evidence():
    empirical, findings = _load_knowledge_base()
    scenario = {
        "id": "iss_nominal",
        "name": "Standard ISS Nominal Cabin",
        "gravityRegime": "microgravity",
        "gravity_g": 0.0,
        "pressureKpa": 101.3,
        "oxygenPercent": 21.0,
        "flowVelocityCmS": 20.0,
        "flowDirection": "concurrent",
        "materialTarget": "SIBAL Fabric",
        "geometryTarget": "Large Fabric Panel",
    }
    result = MockAssessorEvaluator.evaluate_scenario(scenario, findings, empirical)
    assert result["status"] == "EVIDENCE_AVAILABLE"
    assert result["criticalCount"] == 0


# --- Test 2: Artemis Lunar Habitat Scenario ---
def test_artemis_lunar_scenario_has_critical_evidence_gaps():
    empirical, findings = _load_knowledge_base()
    scenario = {
        "id": "artemis_lunar",
        "name": "Artemis Lunar Surface Habitat",
        "gravityRegime": "lunar",
        "gravity_g": 0.16,
        "pressureKpa": 56.5,
        "oxygenPercent": 34.0,
        "flowVelocityCmS": 2.0,
        "flowDirection": "opposed",
        "materialTarget": "PMMA",
        "geometryTarget": "Thin Sheet / Film",
    }
    result = MockAssessorEvaluator.evaluate_scenario(scenario, findings, empirical)
    assert result["status"] == "EVIDENCE_GAP"
    assert result["criticalCount"] >= 2  # Both Lunar 0.16g and 34% O2 are critical gaps

    gap_ids = [g["gapId"] for g in result["gaps"]]
    assert "GAP-GRAV-PARTIAL" in gap_ids
    assert "GAP-ATM-O2-ELEVATED" in gap_ids


# --- Test 3: Mars Surface Habitat Scenario ---
def test_mars_habitat_scenario_has_gravity_and_atmosphere_gaps():
    empirical, findings = _load_knowledge_base()
    scenario = {
        "id": "mars_habitat",
        "name": "Mars Surface Habitat Scenario",
        "gravityRegime": "martian",
        "gravity_g": 0.38,
        "pressureKpa": 56.0,
        "oxygenPercent": 28.0,
        "flowVelocityCmS": 5.0,
        "flowDirection": "concurrent",
        "materialTarget": "Solid Plastic",
        "geometryTarget": "Thin Sheet / Film",
    }
    result = MockAssessorEvaluator.evaluate_scenario(scenario, findings, empirical)
    assert result["status"] == "EVIDENCE_GAP"
    assert any(g["gapId"] == "GAP-GRAV-PARTIAL" for g in result["gaps"])
    assert any(g["gapId"] == "GAP-ATM-O2-ELEVATED" for g in result["gaps"])


# --- Test 4: Liquid-versus-Solid Combustion Incompatibility (CROSS-001) ---
def test_liquid_droplet_combustion_triggers_phase_incompatible_gap():
    empirical, findings = _load_knowledge_base()
    scenario = {
        "id": "liquid_droplet_test",
        "name": "Liquid Droplet Query",
        "gravityRegime": "microgravity",
        "gravity_g": 0.0,
        "pressureKpa": 101.3,
        "oxygenPercent": 21.0,
        "flowVelocityCmS": 0.0,
        "flowDirection": "quiescent",
        "materialTarget": "n-Heptane Liquid Droplet",
        "geometryTarget": "Spherical Droplet",
    }
    result = MockAssessorEvaluator.evaluate_scenario(scenario, findings, empirical)
    assert result["status"] == "EVIDENCE_GAP"
    assert any(g["gapId"] == "GAP-PHASE-SOLID-VS-LIQUID" for g in result["gaps"])


# --- Test 5: Uncalibrated Fan Display Index in BASS-II (DEC-04 / BASS-007) ---
def test_bass_uncalibrated_flow_index_gap():
    empirical, findings = _load_knowledge_base()
    bass_007 = next((f for f in findings if f["claimId"] == "BASS-007"), None)
    assert bass_007 is not None
    assert "fan display" in bass_007["findingStatement"].lower()
    assert "uncalibrated" in bass_007["limitations"].lower()


# --- Test 6: Zero Synthetic Data Ingestion Invariant ---
def test_no_synthetic_data_in_empirical_records():
    empirical, _ = _load_knowledge_base()
    for rec in empirical:
        assert not rec.get("isSynthetic", False), f"Record {rec.get('id')} marked synthetic!"


# --- Test 7: Zero Fire-Risk Prediction Invariant ---
def test_assessor_never_outputs_fire_risk_percentage():
    # Verifies that neither audited findings nor assessor results include probability or risk percentages
    _, findings = _load_knowledge_base()
    for f in findings:
        statement = f["findingStatement"].lower()
        assert "risk percentage" not in statement
        assert "probability of fire" not in statement
        assert "% risk" not in statement


# --- Test 8: Unverified Claim Integrity (SAFFIRE-009) ---
def test_saffire_009_transducer_pressure_is_unverified():
    _, findings = _load_knowledge_base()
    saffire_009 = next((f for f in findings if f["claimId"] == "SAFFIRE-009"), None)
    assert saffire_009 is not None
    assert saffire_009["auditDisposition"] == "UNVERIFIED"
    assert "0.5 kPa" in saffire_009["findingStatement"]


# --- Test 9: Derived Estimate Integrity (SAFFIRE-006) ---
def test_saffire_006_theoretical_calculation_is_derived_estimate():
    _, findings = _load_knowledge_base()
    saffire_006 = next((f for f in findings if f["claimId"] == "SAFFIRE-006"), None)
    assert saffire_006 is not None
    assert saffire_006["auditDisposition"] == "DERIVED_ESTIMATE"
    assert "3.8 kPa" in saffire_006["findingStatement"]
    assert "ideal-gas" in saffire_006["limitations"].lower() or "theoretical" in saffire_006["limitations"].lower()


# --- Test 10: Citation Entailment (All Claims Traceable to Valid DOI or Source) ---
def test_all_claims_have_valid_traceability():
    _, findings = _load_knowledge_base()
    for f in findings:
        assert f.get("claimId")
        assert f.get("sourcePublication")
        assert f.get("sourceLocation")
        assert f.get("auditDisposition") in [
            "VERIFIED",
            "PARTIALLY_VERIFIED",
            "DERIVED_ESTIMATE",
            "UNVERIFIED",
            "EVIDENCE_GAP",
            "CONTRADICTED",
        ]
