"""Integration tests for EvidenceRepository and search API contracts."""

import json
from pathlib import Path


def _get_data_path() -> Path:
    p = Path("src/data/empirical_records.json")
    if p.is_file():
        return p
    parent_p = Path("../src/data/empirical_records.json")
    if parent_p.is_file():
        return parent_p
    raise FileNotFoundError("empirical_records.json not found")


def test_evidence_records_json_integrity():
    data_file = _get_data_path()
    assert data_file.is_file()

    with open(data_file, "r", encoding="utf-8") as f:
        records = json.load(f)

    assert len(records) == 9  # 4 Saffire + 5 BASS
    # Invariant: No synthetic records in empirical export
    for r in records:
        assert r["isSynthetic"] is False
        assert r["sourceArtifact"] in ["PSI98-ART-002", "PSI25-ART-002"]


def test_saffire_discrepancy_and_diagnostics_preserved():
    data_file = _get_data_path()
    with open(data_file, "r", encoding="utf-8") as f:
        records = json.load(f)

    saffire_runs = [r for r in records if r["investigationId"] == "PSI-98"]
    assert len(saffire_runs) == 4

    # S1 & S2 are valid specimens
    s1 = next(r for r in saffire_runs if r["runId"] == "PSI98-S1")
    assert s1["disposition"] == "VALID_RECORD"
    assert s1["dimensions"]["thicknessRaw"] == "0.37"
    assert s1["dimensions"]["thicknessMm"] == 3.7
    assert s1["dimensions"]["isThicknessApproximated"] is True
    assert len(s1["discrepancyWarnings"]) > 0

    # Flow visualization cards are diagnostics requiring review
    f1 = next(r for r in saffire_runs if r["runId"] == "PSI98-F1C1/F1C2")
    assert f1["disposition"] == "REQUIRES_REVIEW"
    assert f1["geometry"] == "flow_visualization"


def test_bass_ii_fan_display_uncalibrated_preserved():
    data_file = _get_data_path()
    with open(data_file, "r", encoding="utf-8") as f:
        records = json.load(f)

    bass_runs = [r for r in records if r["investigationId"] == "PSI-25"]
    assert len(bass_runs) == 5

    b1 = next(r for r in bass_runs if r["runId"] == "PSI25-B1")
    assert b1["geometry"] == "thin_film"
    assert b1["environmentalConditions"]["isFlowUncalibrated"] is True
    assert b1["environmentalConditions"]["fanDisplayIndex"] == 62
    assert b1["environmentalConditions"]["flowVelocityCmS"] is None
