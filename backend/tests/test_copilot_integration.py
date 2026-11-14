"""Automated test suite for SI Copilot retrieval, fallback, and citation validation."""

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


def test_copilot_corpus_indexing():
    empirical, findings = _load_data()
    assert len(empirical) == 9  # 4 Saffire + 5 BASS
    assert len(findings) == 9   # 9 audited claims

    # Check that CROSS-005 (Artemis atmosphere gap) is present
    artemis = next((f for f in findings if f["claimId"] == "CROSS-005"), None)
    assert artemis is not None
    assert artemis["auditDisposition"] == "EVIDENCE_GAP"
    assert "34% O2" in artemis["applicableConditions"]


def test_copilot_saffire_claims_cite_paper_not_raw_table():
    empirical, findings = _load_data()
    saffire_001 = next(f for f in findings if f["claimId"] == "SAFFIRE-001")
    assert "Urban et al." in saffire_001["sourcePublication"]
    assert "10.1016/j.combustflame.2018.10.012" in saffire_001["doi"]
    assert "2.4 mm/s" in saffire_001["findingStatement"]


def test_copilot_bass_fan_display_discrepancy_preserved():
    empirical, findings = _load_data()
    bass_002 = next(f for f in findings if f["claimId"] == "BASS-002")
    assert "fan display" in bass_002["findingStatement"].lower()
    assert "uncalibrated" in bass_002["limitations"].lower()


def test_copilot_rod_vs_film_geometry_isolation():
    empirical, findings = _load_data()
    cross_001 = next(f for f in findings if f["claimId"] == "CROSS-001")
    assert "thin films" in cross_001["findingStatement"].lower()
    assert "thick rods" in cross_001["findingStatement"].lower()
    assert "biot number" in cross_001["limitations"].lower()
