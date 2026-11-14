"""Builds immutable SourceProvenance objects for ingested rows."""

from .manifest import ArtifactManifest
from .source_reader import RawSourceRow
from ..contracts.provenance import (
    SourceProvenance,
    SourceLocation,
    InspectionLifecycleStage,
    DataVerificationStatus,
)


class ProvenanceBuilder:
    @staticmethod
    def build_row_provenance(
        manifest: ArtifactManifest,
        row: RawSourceRow,
        run_id: str,
        is_synthetic: bool = False,
    ) -> SourceProvenance:
        return SourceProvenance(
            artifact_id=manifest.artifact_id,
            investigation_id=manifest.investigation_id,
            source_organization="NASA Physical Sciences Informatics (PSI)",
            source_title_or_filename=manifest.original_filename,
            official_source_url=manifest.source_url,
            doi_or_persistent_id=manifest.doi_or_persistent_id,
            repository_category=manifest.repository_category,
            source_location=SourceLocation(
                table_name=manifest.original_filename,
                row_index=row.row_number,
            ),
            lifecycle_stage=InspectionLifecycleStage.STAGE_5_PARSED_EVALUATED,
            verification_status=(
                DataVerificationStatus.SYNTHETIC_ILLUSTRATIVE
                if is_synthetic
                else DataVerificationStatus.PRELIMINARY_UNAUDITED
            ),
            associated_claim_ids=manifest.associated_claim_ids,
            relevant_run_id=run_id,
            is_synthetic=is_synthetic,
        )
