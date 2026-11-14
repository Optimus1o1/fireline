"""Tests for source artifact reading and header validation."""

import pytest
from pathlib import Path
from fireline_data.ingestion.source_reader import DeterministicSourceReader


def test_reader_saffire_actual_headers(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "test_saffire.csv"
    csv_file.write_text(
        "Sample Number,Material,Sample Thickness (cm),Sample Length (cm),Sample Width (cm),Air Flow (cm/s),Percent O2,Ignition Power (W)\n"
        "S1,SIBAL Fabric,0.37,40.6,94,20,21.5 - 21.7,182\n"
    )

    res = DeterministicSourceReader.read_csv(
        file_path=str(csv_file),
        artifact_id="SYNTH-SAFFIRE",
        expected_headers=[
            "Sample Number",
            "Material",
            "Sample Thickness (cm)",
            "Sample Length (cm)",
            "Sample Width (cm)",
            "Air Flow (cm/s)",
            "Percent O2",
            "Ignition Power (W)",
        ],
    )

    assert res.total_rows_found == 1
    assert len(res.missing_headers) == 0
    assert len(res.unexpected_headers) == 0
    row = res.rows[0]
    assert row.row_number == 1
    assert row.raw_fields["Sample Number"] == "S1"
    assert row.raw_fields["Air Flow (cm/s)"] == "20"


def test_reader_bass_actual_headers(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "test_bass.csv"
    csv_file.write_text(
        "PI,Test #,Date,GMT,Sample #,Fuel Sample Material,Flow restrictor,Fan display\n"
        "Bhattacharjee,B1,2/19/2014,50,147,100 micron PMMA film 2 cm wide,2,62\n"
    )

    res = DeterministicSourceReader.read_csv(
        file_path=str(csv_file),
        artifact_id="SYNTH-BASS",
        expected_headers=[
            "PI",
            "Test #",
            "Date",
            "GMT",
            "Sample #",
            "Fuel Sample Material",
            "Flow restrictor",
            "Fan display",
        ],
    )

    assert res.total_rows_found == 1
    assert len(res.missing_headers) == 0
    row = res.rows[0]
    assert row.raw_fields["Test #"] == "B1"
    assert row.raw_fields["Fan display"] == "62"


def test_reader_missing_required_headers(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "missing_headers.csv"
    csv_file.write_text("Sample Number,Material\nS1,SIBAL\n")

    res = DeterministicSourceReader.read_csv(
        file_path=str(csv_file),
        artifact_id="SYNTH-MISSING",
        expected_headers=["Sample Number", "Material", "Sample Thickness (cm)"],
    )

    assert "Sample Thickness (cm)" in res.missing_headers


def test_reader_unexpected_columns(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "extra_headers.csv"
    csv_file.write_text("Sample Number,Material,ExtraColumn\nS1,SIBAL,Foo\n")

    res = DeterministicSourceReader.read_csv(
        file_path=str(csv_file),
        artifact_id="SYNTH-EXTRA",
        expected_headers=["Sample Number", "Material"],
    )

    assert "ExtraColumn" in res.unexpected_headers


def test_reader_blank_row_preserved(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "blank_row.csv"
    csv_file.write_text("A,B\n1,2\n,\n")

    res = DeterministicSourceReader.read_csv(str(csv_file), "SYNTH-BLANK")
    assert res.total_rows_found == 2
    assert res.rows[0].is_blank_row is False
    assert res.rows[1].is_blank_row is True


def test_reader_empty_file(tmp_path):
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    csv_file = tmp_path / "empty.csv"
    csv_file.write_text("")

    res = DeterministicSourceReader.read_csv(str(csv_file), "SYNTH-EMPTY")
    assert res.total_rows_found == 0
    assert len(res.rows) == 0
