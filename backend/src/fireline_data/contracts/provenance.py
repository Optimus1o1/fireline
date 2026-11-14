"""Common provenance and source identification contracts.

Preserves origin metadata, repository category, inspection lifecycle stage,
and verification status without inventing unprovided IDs.
"""

from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl, ConfigDict


class RepositoryCategory(str, Enum):
    INVESTIGATION_LANDING_PAGE = "Investigation Landing Page"
    EXPERIMENTAL_TABLE = "Repository Experimental Table"
    DOWNLOADABLE_ARCHIVE = "Downloadable Dataset / Archive"
    RAW_TELEMETRY = "Raw Sensor Measurements / Telemetry"
    PUBLISHED_RESULTS = "Published Scientific Results"
    REFERENCE_DOCUMENTS = "Reference & Engineering Documents"
    UNINSPECTED_ARTIFACT = "Uninspected / Inaccessible Artifact"


class InspectionLifecycleStage(str, Enum):
    STAGE_1_LISTED = "Stage 1 - Listed in Repository"
    STAGE_2_METADATA_INSPECTED = "Stage 2 - Metadata Inspected"
    STAGE_3_CONTENTS_INSPECTED = "Stage 3 - Contents Opened & Inspected"
    STAGE_4_DOWNLOADED_LOCALLY = "Stage 4 - Downloaded Locally"
    STAGE_5_PARSED_EVALUATED = "Stage 5 - Parsed / Schema Evaluated"
    STAGE_6_MAPPED_CLAIM = "Stage 6 - Mapped to Scientific Claim"


class DataVerificationStatus(str, Enum):
    """Runtime data verification level.
    
    A parsed source row must never automatically receive VERIFIED_EMPIRICAL.
    """
    VERIFIED_EMPIRICAL = "VERIFIED_EMPIRICAL"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"
    PRELIMINARY_UNAUDITED = "PRELIMINARY_UNAUDITED"
    QUARANTINED = "QUARANTINED"
    SYNTHETIC_ILLUSTRATIVE = "SYNTHETIC_ILLUSTRATIVE"


class SourceLocation(BaseModel):
    """Specific location of a data point within an artifact."""
    model_config = ConfigDict(frozen=True)

    table_name: Optional[str] = None
    row_index: Optional[int] = None
    column_header: Optional[str] = None
    page_number: Optional[int] = None
    section: Optional[str] = None


class SourceProvenance(BaseModel):
    """Full provenance record linking evidence to authoritative NASA sources."""
    model_config = ConfigDict(frozen=True)

    artifact_id: str = Field(..., description="Stable artifact ID, e.g., PSI98-ART-002")
    investigation_id: str = Field(..., description="NASA PSI Investigation ID, e.g., PSI-98, PSI-25")
    source_organization: str = Field(default="NASA Physical Sciences Informatics (PSI)")
    source_title_or_filename: str = Field(..., description="Official title or filename")
    official_source_url: Optional[str] = None
    doi_or_persistent_id: Optional[str] = None
    repository_category: RepositoryCategory = RepositoryCategory.EXPERIMENTAL_TABLE
    source_location: Optional[SourceLocation] = None
    lifecycle_stage: InspectionLifecycleStage = InspectionLifecycleStage.STAGE_3_CONTENTS_INSPECTED
    verification_status: DataVerificationStatus = Field(
        default=DataVerificationStatus.PRELIMINARY_UNAUDITED,
        description="Must not be set to VERIFIED_EMPIRICAL merely because row was parsed."
    )
    associated_claim_ids: List[str] = Field(default_factory=list)
    relevant_run_id: Optional[str] = None
    is_synthetic: bool = Field(
        default=False,
        description="True if this fixture is synthetic test data, barring it from empirical DB"
    )
