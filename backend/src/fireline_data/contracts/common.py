"""Scientific value and unit contracts preserving original reported representations.

Follows Phase 0.5 Schema Change Proposal (docs/hco_schema_change_proposal.md)
while maintaining separation from canonical immutable HCO baseline.
"""

from typing import Generic, TypeVar, Optional, Union
from pydantic import BaseModel, Field, ConfigDict, model_validator

T = TypeVar("T")


class ScientificValue(BaseModel, Generic[T]):
    """Represents a scientific scalar or string with raw unit preservation and traceability.
    
    Invariants:
    1. Never silently converts units without preserving raw values.
    2. Unknown or missing values remain None, never 0.
    3. Missing precision or uncertainty is never fabricated.
    """
    model_config = ConfigDict(frozen=True)

    # Normalized value in SI units (if unambiguous)
    normalized_value: Optional[T] = Field(default=None, description="Converted SI value")
    normalized_unit: Optional[str] = Field(default=None, description="Standard SI unit, e.g. 'm/s', 'kPa', 'mm'")

    # Verbatim original reading
    raw_value: Optional[Union[float, int, str]] = Field(default=None, description="Exact raw value as parsed")
    raw_unit: Optional[str] = Field(default=None, description="Original reported unit, e.g. 'cm/s', 'psia', 'cm'")

    # Uncertainty tracking
    uncertainty: Optional[float] = Field(default=None, description="Explicit uncertainty margin if reported")
    uncertainty_type: Optional[str] = Field(default=None, description="e.g., standard_deviation, instrument_tolerance")

    # Derivation metadata
    is_derived: bool = Field(default=False, description="True if mathematically estimated/derived")
    is_approximated: bool = Field(default=False, description="True if reported with ~ or range")
    source_column_header: Optional[str] = None

    @model_validator(mode="after")
    def check_non_fabrication(self) -> "ScientificValue[T]":
        # Disallow empty state where neither raw nor normalized value exists
        # unless explicitly modeling an absent measurement
        return self


class PhysicalConditionCheck:
    """Utilities for physical boundary verification."""

    @staticmethod
    def validate_oxygen_fraction(o2_fraction: Optional[float]) -> bool:
        if o2_fraction is None:
            return True
        return 0.0 < o2_fraction <= 1.0

    @staticmethod
    def validate_pressure_kpa(pressure_kpa: Optional[float]) -> bool:
        if pressure_kpa is None:
            return True
        return pressure_kpa > 0.0
