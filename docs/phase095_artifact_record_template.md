# Standardized Artifact Record Template
**Workspace**: `Templates` / `docs`  
**Purpose**: Standardized template for registering, verifying, and tracking raw NASA Physical Sciences Informatics (PSI) research artifacts in FIRELINE's pre-flight staging area.  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Standard**: Version 1.0 (Phase 0.95)

---

## Instructions for Authors and Ingestion Engineers

1. Create a copy of this template whenever a new raw file, experimental table, or archive is retrieved from NASA PSI or primary research repositories.
2. Store completed records in `docs/artifacts/` or alongside the raw artifact in `data/raw/psi/{investigation}/`.
3. Use explicit placeholders (`[TBC – Not yet retrieved]`, `[UNKNOWN]`, `[NOT APPLICABLE]`) for information that has not yet been verified.
4. **Never fabricate checksums, download dates, file paths, or table schemas for uninspected or undownloaded files.**
5. Preserve raw file names and original units.

---

```markdown
# Artifact Record: [ARTIFACT_ID] — [ORIGINAL_ARTIFACT_NAME]

## 1. Core Identification & Provenance
* **Artifact ID**: [e.g., PSI69-ART-002 / PSI25-ART-002 / PSI98-ART-002]
* **Investigation ID**: [e.g., PSI-69 / PSI-25 / PSI-98]
* **Investigation Title**: [e.g., Flame Extinguishment Experiment (FLEX)]
* **Original Artifact Name**: [Exact title or filename displayed on NASA PSI portal]
* **Official Source URL**: [e.g., https://psi.nasa.gov/physci/repo/data/investigations/PSI-69]
* **Persistent Identifier (DOI / Handle)**: [e.g., 10.60555/mbq8-0451]
* **Repository Category**: [Investigation Record | Experimental Table | Raw Data Archive | Science Document | Reference Data | Engineering Document | Calibration Record | Report]
* **File Type**: [Web Record | Tabular Grid | CSV | TSV | NetCDF | HDF5 | ZIP | TAR.GZ | PDF | MP4 | JPEG]
* **License / Access Conditions**: [e.g., CC0-1.0 (Public Domain) | NASA Open Access | Restricted]
* **Repository Version**: [e.g., Version 4 / Version 5]
* **Repository Release Date**: [e.g., 31-Jul-2016 / 18-Sep-2024]
* **Retrieval Date**: [YYYY-MM-DD or "[TBC – Not yet downloaded]"]
* **Local Staging Path**: [e.g., data/raw/psi/flex/[filename] or "[TBC – Staged in Phase 1]"]
* **Original Checksum (SHA-256)**: [64-character hex hash or "[PENDING_DOWNLOAD_VERIFICATION]"]

---

## 2. Inspection & Verification Status
* **Inspection Level**: 
  - [ ] Listed in Repository Only
  - [ ] Metadata Inspected (DOI, dates, file size, license confirmed)
  - [ ] Contents Partially Inspected (Preview rows or document abstract read)
  - [ ] Contents Fully Inspected (All table rows or complete document reviewed)
  - [ ] Parsed & Validated (Field headers and data types bound to schema)
* **Contents Actually Inspected**: [Explicitly describe which sections, rows, or tables were opened]
* **Contents NOT Inspected**: [Explicitly describe what portions remain uninspected]
* **Dataset / Table Coverage**:
  - Fuel Materials: [e.g., Methanol / PMMA rod / SIBAL fabric]
  - Number of Records: [e.g., 275 rows / 5 rows / Unknown]
  - Spatial / Temporal Extent: [e.g., Flight runs between 2009-03-05 and 2011-04-12]
  - Physical Regimes: [e.g., Quiescent microgravity / Low-speed opposed flow]

---

## 3. Known Schema, Column Headers & Units
*List observed fields exactly as displayed by the source. Do not infer undocumented units.*

| Column Name in Source | Observed Unit | Data Type | Nullable? | Description / Scientific Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `[e.g., Ambient pressure; mmHg]` | `mmHg` | Float | No | Ambient chamber pressure |
| `[e.g., Fuel]` | None (Text) | String | No | Chemical name of fuel |
| `[e.g., Air Flow (cm/s)]` | `cm/s` | Float | Yes | Forced air ventilation velocity |

* **Missing Value Representation**: [e.g., Empty cell ("") | null | NaN | -999.0 | Other]
* **Ambiguous or Uncalibrated Fields**: [e.g., "Fan display" requires external calibration to convert to cm/s]

---

## 4. Evidence Linkage & Mapping Relationships
* **Related Audited Claims (Phase 0.8)**: [e.g., FLEX-001, FLEX-004, SAFFIRE-001]
* **Target HCO Entities**: [Investigation | ExperimentalRun | FuelSpec | EnvironmentalConditions | MeasurementRecord | EmpiricalFinding | AuditProvenance]
* **Candidate Mapping Parameters (Phase 0.9)**: [e.g., FLEX-PARAM-01, SAFFIRE-PARAM-03]
* **Relationship to Primary Publications**:
  - Primary Peer-Reviewed Paper: [e.g., Urban et al., Combustion and Flame (2019), 10.1016/j.combustflame.2018.10.012]
  - Relationship Type: [Directly Contains Paper Measurements | Initial Conditions Only | Decoupled Test Series | Different Fuel Geometry]
  - Notes on Decoupling: [Explain differences in specimen, conditions, or derived vs. raw nature]

---

## 5. Limitations & Ingestion Blockers
* **Known Limitations**: [e.g., Table omits dynamic flame spread rate; raw file is 860 GB]
* **Unresolved Questions**: [e.g., Mapping run code "20CAL08" to specific gas dilution test point]
* **Phase 1 Ingestion Readiness**: [READY FOR FIXTURE INGESTION | PARTIALLY READY | BLOCKED PENDING ARCHIVE DOWNLOAD | RESEARCH ONLY]
* **Required Resolution Action**: [Specific step needed prior to or during hackathon implementation]

---

## 6. Review & Revision History
| Date | Author / Role | Action Taken | Status |
| :--- | :--- | :--- | :--- |
| [YYYY-MM-DD] | [Engineer Name] | Initial artifact record created from portal metadata | DRAFT |
```
