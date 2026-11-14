"""Saffire-I (PSI-98) source-specific data contracts.

Preserves exact column headers, unresolved thickness discrepancies (0.37 cm vs 0.4 mm),
oxygen ranges, and distinguishes flow-visualization runs from combustion specimen records.
"""

from typing import Optional, Union
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from .provenance import SourceProvenance, DataVerificationStatus
from .common import ScientificValue


class SaffireRawRecord(BaseModel):
    """Verbatim representation of a row in PSI-98 Experimental Table.
    
    Columns from PSI98-ART-002:
    - Sample Number
    - Material
    - Sample Thickness (cm)
    - Sample Length (cm)
    - Sample Width (cm)
    - Air Flow (cm/s)
    - Percent O2
    - Ignition Power (W)
    """
    model_config = ConfigDict(populate_by_name=True)

    sample_number: str = Field(..., alias="Sample Number")
    material: Optional[str] = Field(default=None, alias="Material")
    sample_thickness_cm: Optional[str] = Field(default=None, alias="Sample Thickness (cm)")
    sample_length_cm: Optional[str] = Field(default=None, alias="Sample Length (cm)")
    sample_width_cm: Optional[str] = Field(default=None, alias="Sample Width (cm)")
    air_flow_cm_s: Optional[str] = Field(default=None, alias="Air Flow (cm/s)")
    percent_o2: Optional[str] = Field(default=None, alias="Percent O2")
    ignition_power_w: Optional[str] = Field(default=None, alias="Ignition Power (W)")


class SaffireSpecimenRecord(BaseModel):
    """Validated scientific interpretation of a Saffire-I specimen record.
    
    Enforces critical safeguards:
    - Thickness 0.37 cm preserved verbatim without automatic conversion or merging with 0.4 mm paper value (DEC-01).
    - Flow-visualization records are segregated from specimen combustion records.
    - Missing cells remain None, never 0.
    """
    model_config = ConfigDict(frozen=True)

    sample_number: str
    material_description: str
    is_flow_visualization: bool = False
    
    # Dimensions (Preserving dual raw and normalized SI mm)
    thickness: Optional[ScientificValue[float]] = None
    length: Optional[ScientificValue[float]] = None
    width: Optional[ScientificValue[float]] = None

    # Environmental conditions
    air_flow: Optional[ScientificValue[float]] = None
    oxygen_percentage_raw: Optional[str] = None
    oxygen_mole_fraction_nominal: Optional[float] = None
    is_oxygen_range: bool = False
    ignition_power_w: Optional[ScientificValue[float]] = None

    # Provenance
    provenance: SourceProvenance

    @classmethod
    def from_raw(cls, raw: SaffireRawRecord, provenance: SourceProvenance) -> "SaffireSpecimenRecord":
        mat_text = (raw.material or "").strip()
        is_flow_vis = "flow visulation" in mat_text.lower() or "flow visualization" in mat_text.lower()

        # Parse Thickness: Do not reconcile 0.37 cm with 0.4 mm. Retain verbatim raw representation.
        thickness_val = None
        if raw.sample_thickness_cm and raw.sample_thickness_cm.strip():
            try:
                cm_val = float(raw.sample_thickness_cm.strip())
                thickness_val = ScientificValue[float](
                    normalized_value=cm_val * 10.0, # convert cm to mm
                    normalized_unit="mm",
                    raw_value=cm_val,
                    raw_unit="cm",
                    is_approximated=True, # Flagged due to DEC-01 unresolved pack vs weave discrepancy
                    source_column_header="Sample Thickness (cm)"
                )
            except ValueError:
                thickness_val = ScientificValue[float](
                    raw_value=raw.sample_thickness_cm,
                    raw_unit="cm",
                    is_approximated=True,
                    source_column_header="Sample Thickness (cm)"
                )

        # Parse Length
        length_val = None
        if raw.sample_length_cm and raw.sample_length_cm.strip():
            try:
                cm_l = float(raw.sample_length_cm.strip())
                length_val = ScientificValue[float](
                    normalized_value=cm_l * 10.0,
                    normalized_unit="mm",
                    raw_value=cm_l,
                    raw_unit="cm",
                    source_column_header="Sample Length (cm)"
                )
            except ValueError:
                pass

        # Parse Width
        width_val = None
        if raw.sample_width_cm and raw.sample_width_cm.strip():
            try:
                cm_w = float(raw.sample_width_cm.strip())
                width_val = ScientificValue[float](
                    normalized_value=cm_w * 10.0,
                    normalized_unit="mm",
                    raw_value=cm_w,
                    raw_unit="cm",
                    source_column_header="Sample Width (cm)"
                )
            except ValueError:
                pass

        # Parse Air Flow
        flow_val = None
        if raw.air_flow_cm_s and raw.air_flow_cm_s.strip():
            try:
                cm_s = float(raw.air_flow_cm_s.strip())
                flow_val = ScientificValue[float](
                    normalized_value=cm_s, # cm/s is canonical in HCO
                    normalized_unit="cm/s",
                    raw_value=cm_s,
                    raw_unit="cm/s",
                    source_column_header="Air Flow (cm/s)"
                )
            except ValueError:
                pass

        # Parse Oxygen: Handle ranges (e.g., '21.5 - 21.7') and approximate strings ('~ 21.5')
        o2_raw = (raw.percent_o2 or "").strip()
        is_range = "-" in o2_raw or "~" in o2_raw
        nominal_o2 = None
        if o2_raw:
            cleaned = o2_raw.replace("~", "").strip()
            if "-" in cleaned:
                parts = cleaned.split("-")
                try:
                    p1, p2 = float(parts[0].strip()), float(parts[1].strip())
                    nominal_o2 = ((p1 + p2) / 2.0) / 100.0 # nominal mole fraction
                except (ValueError, IndexError):
                    nominal_o2 = None
            else:
                try:
                    nominal_o2 = float(cleaned) / 100.0
                except ValueError:
                    nominal_o2 = None

        # Parse Ignition Power
        power_val = None
        if raw.ignition_power_w and raw.ignition_power_w.strip():
            try:
                w_val = float(raw.ignition_power_w.strip())
                power_val = ScientificValue[float](
                    normalized_value=w_val,
                    normalized_unit="W",
                    raw_value=w_val,
                    raw_unit="W",
                    source_column_header="Ignition Power (W)"
                )
            except ValueError:
                pass

        return cls(
            sample_number=raw.sample_number,
            material_description=mat_text,
            is_flow_visualization=is_flow_vis,
            thickness=thickness_val,
            length=length_val,
            width=width_val,
            air_flow=flow_val,
            oxygen_percentage_raw=o2_raw if o2_raw else None,
            oxygen_mole_fraction_nominal=nominal_o2,
            is_oxygen_range=is_range,
            ignition_power_w=power_val,
            provenance=provenance
        )
