"""Ingestion transform for Saffire-I PSI-98 table."""

from typing import Tuple, Optional
from .manifest import ArtifactManifest
from .source_reader import RawSourceRow
from .provenance_builder import ProvenanceBuilder
from ..contracts.saffire import SaffireRawRecord, SaffireSpecimenRecord
from ..contracts.validation import ValidationResult, ValidationDisposition


class SaffireIngestor:
    @staticmethod
    def process_row(
        manifest: ArtifactManifest,
        row: RawSourceRow,
        is_synthetic: bool = False,
    ) -> Tuple[Optional[SaffireSpecimenRecord], ValidationResult]:
        if row.is_blank_row:
            return None, ValidationResult.requires_review("Blank delimiter row ignored")

        sample_num = row.raw_fields.get("Sample Number", "").strip()
        if not sample_num:
            return None, ValidationResult.quarantined(f"Row {row.row_number} missing Sample Number")

        run_id = f"PSI98-{sample_num}"
        prov = ProvenanceBuilder.build_row_provenance(manifest, row, run_id=run_id, is_synthetic=is_synthetic)

        try:
            raw_rec = SaffireRawRecord(**row.raw_fields)
            specimen_rec = SaffireSpecimenRecord.from_raw(raw_rec, prov)

            if specimen_rec.is_flow_visualization:
                return specimen_rec, ValidationResult.requires_review(
                    f"Flow visualization record ({sample_num}); segregated from specimen measurements"
                )

            return specimen_rec, ValidationResult.valid_unverified(
                notes=[f"Successfully parsed Saffire-I specimen run {run_id}"]
            )
        except Exception as e:
            return None, ValidationResult.quarantined(f"Validation error on row {row.row_number}: {str(e)}")
