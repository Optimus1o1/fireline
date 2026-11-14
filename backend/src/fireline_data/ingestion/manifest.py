"""Artifact manifest model and integrity verification."""

import hashlib
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from ..contracts.provenance import RepositoryCategory, DataVerificationStatus


class ArtifactManifest(BaseModel):
    """Describes an authoritative NASA source artifact staged locally."""
    model_config = ConfigDict(frozen=True)

    artifact_id: str
    investigation_id: str
    original_filename: str
    source_url: str
    doi_or_persistent_id: Optional[str] = None
    expected_sha256: str
    local_path: str
    expected_columns: List[str]
    repository_category: RepositoryCategory = RepositoryCategory.EXPERIMENTAL_TABLE
    verification_status: DataVerificationStatus = DataVerificationStatus.PRELIMINARY_UNAUDITED
    associated_claim_ids: List[str] = Field(default_factory=list)

    def verify_file_integrity(self, base_dir: Optional[Path] = None) -> bool:
        """Computes SHA-256 of the local file and verifies against expected_sha256."""
        path = Path(self.local_path)
        if not path.is_absolute():
            # If not absolute, resolve against base_dir or project root (parent of backend)
            if base_dir:
                path = base_dir / path
            else:
                current = Path.cwd()
                if (current / path).is_file():
                    path = current / path
                elif (current.parent / path).is_file():
                    path = current.parent / path
        if not path.is_file():
            return False
        hasher = hashlib.sha256()
        with open(path, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        computed = hasher.hexdigest().upper()
        return computed == self.expected_sha256.upper()


# Authoritative manifest registry for Phase 1.0 approved artifacts
OFFICIAL_MANIFESTS = {
    "PSI98-ART-002": ArtifactManifest(
        artifact_id="PSI98-ART-002",
        investigation_id="PSI-98",
        original_filename="PSI-98 Experimental Table",
        source_url="https://psi.nasa.gov/physci/repo/data/investigations/PSI-98",
        doi_or_persistent_id="10.60555/0t15-1243",
        expected_sha256="321C27AB0733E75EA0435CFC6AE61472AAA34BA854A0DDA9B756464E7C001BFB",
        local_path="data/raw/psi/saffire_i/PSI98-ART-002_experimental_table.csv",
        expected_columns=[
            "Sample Number",
            "Material",
            "Sample Thickness (cm)",
            "Sample Length (cm)",
            "Sample Width (cm)",
            "Air Flow (cm/s)",
            "Percent O2",
            "Ignition Power (W)",
        ],
        associated_claim_ids=["SAFFIRE-001", "SAFFIRE-003"],
    ),
    "PSI25-ART-002": ArtifactManifest(
        artifact_id="PSI25-ART-002",
        investigation_id="PSI-25",
        original_filename="PSI-25 Experimental Table (Thin-Film Series)",
        source_url="https://psi.nasa.gov/physci/repo/data/investigations/PSI-25",
        doi_or_persistent_id="10.60555/4qc4-de67",
        expected_sha256="641A064B9A209B8888067502C5CE13710EE33139FFC5EC58DCDBB2582DDDD2CF",
        local_path="data/raw/psi/bass_ii/PSI25-ART-002_experimental_table.csv",
        expected_columns=[
            "PI",
            "Test #",
            "Date",
            "GMT",
            "Sample #",
            "Fuel Sample Material",
            "Flow restrictor",
            "Fan display",
        ],
        associated_claim_ids=["BASS-001", "BASS-002"],
    ),
}
