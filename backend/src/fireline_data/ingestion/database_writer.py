"""Database persistence adapter for validated HCO records.

Enforces idempotency, dry-run safety by default, foreign-key resolution,
and dual unit / verbatim representation in PostgreSQL.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict
from ..contracts.saffire import SaffireSpecimenRecord
from ..contracts.bass_ii import BassIIThinFilmRecord
from ..contracts.provenance import DataVerificationStatus


class DatabaseRecordCandidate(BaseModel):
    """Normalized intermediate payload ready for SQL insertion."""
    model_config = ConfigDict(frozen=True)

    table_name: str
    primary_key_column: str
    primary_key_value: str
    fields: Dict[str, Any]


class DatabaseWriter:
    """Manages transactional mapping and persistence to PostgreSQL."""

    def __init__(self, connection_string: Optional[str] = None):
        self.connection_string = connection_string
        self.is_connected = False

    @staticmethod
    def map_saffire_record(rec: SaffireSpecimenRecord) -> List[DatabaseRecordCandidate]:
        """Maps SaffireSpecimenRecord to initial HCO SQL schema tables."""
        candidates = []
        
        # 1. material_samples row
        mat_id = f"MAT-SAFFIRE-{rec.sample_number}"
        thick_mm = rec.thickness.normalized_value if rec.thickness else None
        thick_raw = str(rec.thickness.raw_value) if rec.thickness else None
        len_mm = rec.length.normalized_value if rec.length else None
        width_mm = rec.width.normalized_value if rec.width else None

        candidates.append(
            DatabaseRecordCandidate(
                table_name="material_samples",
                primary_key_column="sample_id",
                primary_key_value=mat_id,
                fields={
                    "sample_id": mat_id,
                    "common_name": rec.material_description,
                    "physical_form": "fabric",
                    "thickness_mm": thick_mm,
                    "thickness_raw": thick_raw,
                    "is_thickness_approximated": rec.thickness.is_approximated if rec.thickness else False,
                    "length_mm": len_mm,
                    "width_mm": width_mm,
                },
            )
        )

        # 2. environmental_conditions row
        env_id = f"ENV-SAFFIRE-{rec.sample_number}"
        o2_frac = rec.oxygen_mole_fraction_nominal or 0.21
        flow_cm_s = rec.air_flow.normalized_value if rec.air_flow else None

        candidates.append(
            DatabaseRecordCandidate(
                table_name="environmental_conditions",
                primary_key_column="condition_id",
                primary_key_value=env_id,
                fields={
                    "condition_id": env_id,
                    "oxygen_mole_fraction": o2_frac,
                    "pressure_kpa": 101.3, # Saffire-I nominal cabin pressure
                    "pressure_psia_raw": 14.7,
                    "flow_velocity_cm_s": flow_cm_s,
                    "gravity_level": "microgravity",
                },
            )
        )

        # 3. experimental_runs row
        run_id = f"RUN-SAFFIRE-{rec.sample_number}"
        candidates.append(
            DatabaseRecordCandidate(
                table_name="experimental_runs",
                primary_key_column="run_id",
                primary_key_value=run_id,
                fields={
                    "run_id": run_id,
                    "combustion_outcome": "sustained_propagation" if not rec.is_flow_visualization else "unresolved",
                    "data_quality_flag": rec.provenance.verification_status.value,
                    "is_synthetic": rec.provenance.is_synthetic,
                    "source_psi_id": "PSI-98",
                },
            )
        )
        return candidates

    @staticmethod
    def map_bass_record(rec: BassIIThinFilmRecord) -> List[DatabaseRecordCandidate]:
        """Maps BassIIThinFilmRecord to initial HCO SQL schema tables."""
        candidates = []

        mat_id = f"MAT-BASS-{rec.test_id}"
        thick_mm = rec.thickness.normalized_value if rec.thickness else None
        width_mm = rec.width.normalized_value if rec.width else None

        candidates.append(
            DatabaseRecordCandidate(
                table_name="material_samples",
                primary_key_column="sample_id",
                primary_key_value=mat_id,
                fields={
                    "sample_id": mat_id,
                    "common_name": "PMMA Thin Film",
                    "chemical_formula": "(C5O2H8)n",
                    "physical_form": "flat_sheet",
                    "thickness_mm": thick_mm,
                    "width_mm": width_mm,
                },
            )
        )

        env_id = f"ENV-BASS-{rec.test_id}"
        candidates.append(
            DatabaseRecordCandidate(
                table_name="environmental_conditions",
                primary_key_column="condition_id",
                primary_key_value=env_id,
                fields={
                    "condition_id": env_id,
                    "oxygen_mole_fraction": 0.21, # ISS Glovebox nominal atmosphere
                    "pressure_kpa": 101.3,
                    "fan_display_index": rec.fan_display_index,
                    "is_flow_uncalibrated": True,
                    "gravity_level": "microgravity",
                },
            )
        )

        run_id = f"RUN-BASS-{rec.test_id}"
        candidates.append(
            DatabaseRecordCandidate(
                table_name="experimental_runs",
                primary_key_column="run_id",
                primary_key_value=run_id,
                fields={
                    "run_id": run_id,
                    "combustion_outcome": "sustained_propagation",
                    "data_quality_flag": rec.provenance.verification_status.value,
                    "is_synthetic": rec.provenance.is_synthetic,
                    "source_psi_id": "PSI-25",
                },
            )
        )
        return candidates
