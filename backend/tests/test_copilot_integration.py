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
    assert len(findings) >= 15  # Comprehensive reconciled claims

    # Check that CROSS-005 (Artemis atmosphere gap) is present
    artemis = next((f for f in findings if f["claimId"] == "CROSS-005"), None)
    assert artemis is not None
    assert artemis["auditDisposition"] == "EVIDENCE_GAP"
    assert "34% O2" in artemis["applicableConditions"]


def test_copilot_saffire_claims_cite_paper_not_raw_table():
    empirical, findings = _load_data()
    # Canonical SAFFIRE-004 is spread rate
    saffire_004 = next(f for f in findings if f["claimId"] == "SAFFIRE-004")
    assert "Urban et al." in saffire_004["sourcePublication"]
    assert "10.1016/j.combustflame.2018.10.012" in saffire_004["doi"]
    assert "2.0 to 2.5 mm/s" in saffire_004["findingStatement"]

    # Canonical SAFFIRE-001 is SIBAL sample dimensions
    saffire_001 = next(f for f in findings if f["claimId"] == "SAFFIRE-001")
    assert "40.6 cm" in saffire_001["findingStatement"]
    assert "SIBAL" in saffire_001["findingStatement"]

    # Canonical SAFFIRE-006 is derived cabin pressure rise
    saffire_006 = next(f for f in findings if f["claimId"] == "SAFFIRE-006")
    assert saffire_006["auditDisposition"] == "DERIVED_ESTIMATE"
    assert "3.8 kPa" in saffire_006["findingStatement"]

    # Canonical SAFFIRE-008 is PMMA card spread rate
    saffire_008 = next(f for f in findings if f["claimId"] == "SAFFIRE-008")
    assert "0.18 mm/s" in saffire_008["findingStatement"]
    assert "PMMA" in saffire_008["findingStatement"]


def test_copilot_bass_fan_display_discrepancy_preserved():
    empirical, findings = _load_data()
    # BASS-007 is Bhattacharjee fan display series
    bass_007 = next(f for f in findings if f["claimId"] == "BASS-007")
    assert "fan display" in bass_007["findingStatement"].lower()
    assert "uncalibrated" in bass_007["limitations"].lower()

    # BASS-002 is Olson & Ferkul rod quenching
    bass_002 = next(f for f in findings if f["claimId"] == "BASS-002")
    assert "quenching" in bass_002["findingStatement"].lower()
    assert "1.0 to 1.5 cm/s" in bass_002["findingStatement"]


def test_copilot_rod_vs_film_geometry_isolation():
    empirical, findings = _load_data()
    cross_001 = next(f for f in findings if f["claimId"] == "CROSS-001")
    assert "liquid droplet" in cross_001["findingStatement"].lower()
    assert "phase_incompatible" in cross_001["limitations"].lower()

    cross_003 = next(f for f in findings if f["claimId"] == "CROSS-003")
    assert "thermal thickness" in cross_003["findingStatement"].lower()
