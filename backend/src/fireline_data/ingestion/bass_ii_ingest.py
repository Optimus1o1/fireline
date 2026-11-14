"""Ingestion transform for BASS-II PSI-25 thin-film table."""

from typing import Tuple, Optional
from .manifest import ArtifactManifest
from .source_reader import RawSourceRow
from .provenance_builder import ProvenanceBuilder
from ..contracts.bass_ii import BassIIRawRecord, BassIIThinFilmRecord
from ..contracts.validation import ValidationResult, ValidationDisposition


class BassIIIngestor:
    @staticmethod
    def process_row(
        manifest: ArtifactManifest,
        row: RawSourceRow,
        is_synthetic: bool = False,
    ) -> Tuple[Optional[BassIIThinFilmRecord], ValidationResult]:
        if row.is_blank_row:
            return None, ValidationResult.requires_review("Blank delimiter row ignored")

        test_num = row.raw_fields.get("Test #", "").strip()
        if not test_num:
            return None, ValidationResult.quarantined(f"Row {row.row_number} missing Test #")

        run_id = f"PSI25-{test_num}"
        prov = ProvenanceBuilder.build_row_provenance(manifest, row, run_id=run_id, is_synthetic=is_synthetic)

        try:
            raw_rec = BassIIRawRecord(**row.raw_fields)
            thin_film_rec = BassIIThinFilmRecord.from_raw(raw_rec, prov)

            return thin_film_rec, ValidationResult.valid_unverified(
                notes=[f"Successfully parsed BASS-II thin-film run {run_id}"]
            )
        except Exception as e:
            return None, ValidationResult.quarantined(f"Validation error on row {row.row_number}: {str(e)}")
