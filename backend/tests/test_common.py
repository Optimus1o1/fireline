"""Tests for scientific value, unit preservation, and physical checks."""

import pytest
from fireline_data.contracts.common import ScientificValue, PhysicalConditionCheck


def test_scientific_value_preserves_raw_and_normalized():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS"""
    val = ScientificValue[float](
        normalized_value=3.7,
        normalized_unit="mm",
        raw_value=0.37,
        raw_unit="cm",
        source_column_header="Sample Thickness (cm)"
    )
    assert val.normalized_value == 3.7
    assert val.normalized_unit == "mm"
    assert val.raw_value == 0.37
    assert val.raw_unit == "cm"


def test_missing_values_remain_none_never_zero():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS.
    
    Critical Invariant: Absent values are None, NOT 0.
    """
    val = ScientificValue[float](
        normalized_value=None,
        normalized_unit=None,
        raw_value=None,
        raw_unit=None
    )
    assert val.normalized_value is None
    assert val.raw_value is None
    assert val.normalized_value != 0


def test_physical_condition_oxygen_boundary():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS."""
    assert PhysicalConditionCheck.validate_oxygen_fraction(0.21) is True
    assert PhysicalConditionCheck.validate_oxygen_fraction(1.0) is True
    assert PhysicalConditionCheck.validate_oxygen_fraction(0.0) is False  # Non-physical: zero O2
    assert PhysicalConditionCheck.validate_oxygen_fraction(-0.1) is False # Non-physical: negative
    assert PhysicalConditionCheck.validate_oxygen_fraction(1.05) is False # Non-physical: > 100%


def test_physical_condition_pressure_boundary():
    """SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS."""
    assert PhysicalConditionCheck.validate_pressure_kpa(101.3) is True
    assert PhysicalConditionCheck.validate_pressure_kpa(0.0) is False    # Hard boundary: zero pressure
    assert PhysicalConditionCheck.validate_pressure_kpa(-5.0) is False   # Hard boundary: negative
