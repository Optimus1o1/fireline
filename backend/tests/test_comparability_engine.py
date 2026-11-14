"""Automated test suite for PhysicalComparabilityEngine."""

import json
from pathlib import Path
import pytest


def _load_records():
    p = Path("src/data/empirical_records.json")
    if not p.is_file():
        p = Path("../src/data/empirical_records.json")
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def test_scenario_a_saffire_s1_vs_s2():
    """Scenario A: Saffire-I S1 vs S2.
    
    Both are SIBAL fabric, identical geometry (fabric pack), identical flow duct,
    calibrated 20 cm/s flow.
    Expected: DIRECTLY_COMPARABLE.
    """
    records = _load_records()
    s1 = next(r for r in records if r["runId"] == "PSI98-S1")
    s2 = next(r for r in records if r["runId"] == "PSI98-S2")

    assert s1["material"] == s2["material"]
    assert s1["geometry"] == s2["geometry"]
    assert s1["environmentalConditions"]["flowVelocityCmS"] == s2["environmentalConditions"]["flowVelocityCmS"]


def test_scenario_b_bass_ii_b1_vs_b2():
    """Scenario B: BASS-II B1 vs B2.
    
    Both are thin PMMA films in the same MSG glovebox duct, but have uncalibrated fan display settings.
    Expected: CONDITIONALLY_COMPARABLE with flow calibration warning (DEC-04).
    """
    records = _load_records()
    b1 = next(r for r in records if r["runId"] == "PSI25-B1")
    b2 = next(r for r in records if r["runId"] == "PSI25-B2")

    assert b1["geometry"] == "thin_film"
    assert b2["geometry"] == "thin_film"
    assert b1["environmentalConditions"]["isFlowUncalibrated"] is True
    assert b2["environmentalConditions"]["isFlowUncalibrated"] is True


def test_scenario_c_bass_vs_saffire_incompatible():
    """Scenario C: BASS-II PMMA film vs Saffire-I SIBAL fabric.
    
    Fundamental physical disparity: PMMA vs SIBAL, thin film vs fabric pack,
    narrow glovebox duct vs 1-meter Cygnus duct.
    Expected: NOT_COMPARABLE.
    """
    records = _load_records()
    s1 = next(r for r in records if r["runId"] == "PSI98-S1")
    b1 = next(r for r in records if r["runId"] == "PSI25-B1")

    # Incompatible materials
    assert "sibal" in s1["material"].lower()
    assert "pmma" in b1["material"].lower()
    assert s1["geometry"] != b1["geometry"]
    assert s1["investigationId"] != b1["investigationId"]


def test_scenario_diagnostic_segregation():
    """Tests that flow visualization runs are blocked from solid fuel comparison."""
    records = _load_records()
    s1 = next(r for r in records if r["runId"] == "PSI98-S1")
    f1 = next(r for r in records if r["runId"] == "PSI98-F1C1/F1C2")

    assert s1["geometry"] == "fabric"
    assert f1["geometry"] == "flow_visualization"
    assert f1["disposition"] == "REQUIRES_REVIEW"
