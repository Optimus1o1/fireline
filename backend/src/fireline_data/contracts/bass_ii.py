"""BASS-II (PSI-25) source-specific data contracts.

Preserves Subrata Bhattacharjee thin PMMA film test series columns:
- PI, Test #, Date, GMT, Sample #, Fuel Sample Material, Flow restrictor, Fan display

Enforces critical safeguards:
- Fan display remains an integer index; NEVER converted to cm/s or m/s (DEC-04).
- Thin PMMA films are isolated from Olson & Ferkul cylindrical PMMA rods (DEC-02).
- Flow restrictor remains a discrete orifice setting.
"""

import re
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from .provenance import SourceProvenance, DataVerificationStatus
from .common import ScientificValue


class BassIIRawRecord(BaseModel):
    """Verbatim representation of a row in PSI-25 Experimental Table.
    
    Columns from PSI25-ART-002:
    - PI
    - Test #
    - Date
    - GMT
    - Sample #
    - Fuel Sample Material
    - Flow restrictor
    - Fan display
    """
    model_config = ConfigDict(populate_by_name=True)

    pi: str = Field(..., alias="PI")
    test_number: str = Field(..., alias="Test #")
    date: Optional[str] = Field(default=None, alias="Date")
    gmt: Optional[str] = Field(default=None, alias="GMT")
    sample_number: str = Field(..., alias="Sample #")
    fuel_sample_material: str = Field(..., alias="Fuel Sample Material")
    flow_restrictor: Optional[str] = Field(default=None, alias="Flow restrictor")
    fan_display: Optional[str] = Field(default=None, alias="Fan display")


class BassIIThinFilmRecord(BaseModel):
    """Validated scientific interpretation of a BASS-II thin-film test record.
    
    Enforces critical safeguards:
    - Fan display is preserved strictly as integer index without physical conversion.
    - Geometry is strictly labeled 'thin_film' to prevent merging with cylindrical rods.
    """
    model_config = ConfigDict(frozen=True)

    test_id: str
    pi_name: str
    sample_number: str
    material_raw: str
    fuel_type: str = "PMMA"
    geometry_type: str = "thin_film" # Hardcoded boundary; rods are barred

    # Parsed thickness/width from string (e.g. '100 micron PMMA film 2 cm wide')
    thickness: Optional[ScientificValue[float]] = None
    width: Optional[ScientificValue[float]] = None

    # Hardware flow settings (Uncalibrated indices)
    flow_restrictor_index: Optional[int] = None
    fan_display_index: Optional[int] = None
    is_flow_uncalibrated: bool = True # Safeguard: Fan display has no flight velocity curve

    # Provenance
    provenance: SourceProvenance

    @classmethod
    def from_raw(cls, raw: BassIIRawRecord, provenance: SourceProvenance) -> "BassIIThinFilmRecord":
        mat_text = raw.fuel_sample_material.strip()

        # Parse thickness from material string (e.g., '100 micron')
        thickness_val = None
        thick_match = re.search(r"(\d+)\s*(micron|microns|um|µm)", mat_text, re.IGNORECASE)
        if thick_match:
            val = float(thick_match.group(1))
            thickness_val = ScientificValue[float](
                normalized_value=val / 1000.0, # convert micron to mm
                normalized_unit="mm",
                raw_value=val,
                raw_unit="micron",
                source_column_header="Fuel Sample Material"
            )

        # Parse width from material string (e.g., '2 cm wide')
        width_val = None
        width_match = re.search(r"(\d+(\.\d+)?)\s*cm", mat_text, re.IGNORECASE)
        if width_match:
            val = float(width_match.group(1))
            width_val = ScientificValue[float](
                normalized_value=val * 10.0, # convert cm to mm
                normalized_unit="mm",
                raw_value=val,
                raw_unit="cm",
                source_column_header="Fuel Sample Material"
            )

        # Parse Flow Restrictor
        restrictor_idx = None
        if raw.flow_restrictor and raw.flow_restrictor.strip():
            try:
                restrictor_idx = int(raw.flow_restrictor.strip())
            except ValueError:
                pass

        # Parse Fan Display (Index ONLY, never velocity)
        fan_idx = None
        if raw.fan_display and raw.fan_display.strip():
            try:
                fan_idx = int(raw.fan_display.strip())
            except ValueError:
                pass

        return cls(
            test_id=raw.test_number.strip(),
            pi_name=raw.pi.strip(),
            sample_number=raw.sample_number.strip(),
            material_raw=mat_text,
            thickness=thickness_val,
            width=width_val,
            flow_restrictor_index=restrictor_idx,
            fan_display_index=fan_idx,
            is_flow_uncalibrated=True,
            provenance=provenance
        )
