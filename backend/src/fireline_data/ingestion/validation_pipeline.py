"""Deterministic validation pipeline orchestrator for NASA PSI datasets."""

from pathlib import Path
from typing import Union, List
from .manifest import ArtifactManifest
from .source_reader import DeterministicSourceReader
from .saffire_ingest import SaffireIngestor
from .bass_ii_ingest import BassIIIngestor
from .reporting import IngestionReport, IngestionRowReport
from ..contracts.validation import ValidationDisposition


class ValidationPipeline:
    """Orchestrates file integrity, reading, Pydantic validation, and reporting."""

    @staticmethod
    def run_pipeline(
        manifest: ArtifactManifest,
        dry_run: bool = True,
        is_synthetic: bool = False,
    ) -> IngestionReport:
        # Step 1: File integrity verification
        if not manifest.verify_file_integrity():
            return IngestionReport(
                artifact_id=manifest.artifact_id,
                investigation_id=manifest.investigation_id,
                source_checksum="CHECKSUM_MISMATCH_OR_MISSING",
                mode="dry-run" if dry_run else "apply",
                row_details=[
                    IngestionRowReport(
                        row_number=0,
                        disposition=ValidationDisposition.INVALID_RECORD.value,
                        verification_status="QUARANTINED",
                        quarantine_reason=f"File integrity check failed for {manifest.local_path}",
                    )
                ],
                rows_quarantined=1,
            )

        # Resolve path if running from backend subfolder
        resolved_path = Path(manifest.local_path)
        if not resolved_path.is_file() and (Path.cwd().parent / resolved_path).is_file():
            resolved_path = Path.cwd().parent / resolved_path

        # Step 2: Read CSV
        read_res = DeterministicSourceReader.read_csv(
            file_path=str(resolved_path),
            artifact_id=manifest.artifact_id,
            expected_headers=manifest.expected_columns,
        )

        rows_accepted = 0
        rows_review = 0
        rows_quarantined = 0
        rows_rejected = 0
        missing_val_count = 0
        row_reports: List[IngestionRowReport] = []

        seen_identifiers = set()
        duplicate_count = 0

        # Step 3: Row processing
        for r in read_res.rows:
            # Count missing fields
            for k, v in r.raw_fields.items():
                if v == "":
                    missing_val_count += 1

            if manifest.investigation_id == "PSI-98":
                rec, val_res = SaffireIngestor.process_row(manifest, r, is_synthetic=is_synthetic)
                rec_id = rec.sample_number if rec else None
            elif manifest.investigation_id == "PSI-25":
                rec, val_res = BassIIIngestor.process_row(manifest, r, is_synthetic=is_synthetic)
                rec_id = rec.test_id if rec else None
            else:
                rec = None
                val_res = ValidationResult.quarantined(f"Unsupported investigation: {manifest.investigation_id}")
                rec_id = None

            # Check duplicates
            if rec_id:
                if rec_id in seen_identifiers:
                    duplicate_count += 1
                else:
                    seen_identifiers.add(rec_id)

            if val_res.disposition == ValidationDisposition.VALID_RECORD:
                rows_accepted += 1
            elif val_res.disposition == ValidationDisposition.REQUIRES_REVIEW:
                rows_review += 1
            elif val_res.disposition == ValidationDisposition.INVALID_RECORD:
                rows_quarantined += 1
            else:
                rows_rejected += 1

            row_reports.append(
                IngestionRowReport(
                    row_number=r.row_number,
                    record_id=rec_id,
                    disposition=val_res.disposition.value,
                    verification_status=val_res.assigned_verification.value,
                    notes=val_res.notes,
                    quarantine_reason=val_res.quarantine_reason,
                )
            )

        return IngestionReport(
            artifact_id=manifest.artifact_id,
            investigation_id=manifest.investigation_id,
            source_checksum=manifest.expected_sha256,
            mode="dry-run" if dry_run else "apply",
            total_rows_discovered=read_res.total_rows_found,
            rows_parsed=len(read_res.rows),
            rows_accepted=rows_accepted,
            rows_requiring_review=rows_review,
            rows_quarantined=rows_quarantined,
            rows_rejected=rows_rejected,
            rows_persisted=0 if dry_run else rows_accepted,
            duplicate_rows_detected=duplicate_count,
            missing_value_count=missing_val_count,
            row_details=row_reports,
        )
