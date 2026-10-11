# Scientific Ingestion Test Fixture Catalog

**Phase**: 0.97 — Scientific Fixture Design & Test Data Contract  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Scientific Data Engineer  
**Date**: October 11, 2026  
**Status**: Authoritative Test Fixture Catalog (*Pre-event documentation only — specification of synthetic test inputs; no executable test harness or pipeline code*)  
**Previous Phase**: Phase 0.96 — Scientific Data Ingestion Test Specification (`05c702e`)

---

## 1. Catalog Conventions & Invariant Rules

This catalog provides the complete, deterministic inventory of **60 synthetic test fixtures** designed to exercise FIRELINE's scientific data ingestion validation gates.

### Invariant Rules:
1. **Mandatory Synthetic Labeling**: Every fixture payload carries the explicit comment and metadata marker:  
   `/* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */`  
   No synthetic record may ever be represented or stored as genuine NASA flight telemetry.
2. **Synthetic Namespace Standard**: All entity identifiers use synthetic namespaces (`SYNTHETIC-INV-XXX`, `SYNTHETIC-RUN-XXX`, `urn:fireline:synthetic:...`) to mathematically guarantee zero collision with real Physical Sciences Informatics (PSI) assets.
3. **Controlled Mutation Lineage**: Controlled variation fixtures inherit from established base fixtures (`FIXTURE-PROV-001`, `FIXTURE-COND-001`) with exactly one mutated parameter per test case.
4. **Implementation Truth**: All implementation statuses are explicitly marked `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`.

---

## 2. Category 1: Provenance and Source Identity (`PROV`)

---

### `FIXTURE-PROV-001`: Baseline Valid Empirical Evidence Record
* **Fixture ID**: `FIXTURE-PROV-001`
* **Name**: Fully Traceable Empirical Measurement Baseline
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Serves as the primary positive control for the entire test suite. Demonstrates that a record with verified provenance, explicit table coordinates, dual units, and complete boundary conditions is accepted by Gate 1 and Gate 6.
* **Target Tests**: `TEST-A01`
* **Target Requirements**: `REQ-INGEST-01`, `REQ-INGEST-12`
* **Input Format**: JSON
* **Base Fixture**: None (Canonical Baseline)
* **Mutation Description**: None
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "doi": "10.0000/synthetic.combust.2026.001",
    "source_artifact_uri": "urn:fireline:synthetic:artifact:table:001",
    "source_location": "Table_1_Row_12",
    "run_id": "SYNTHETIC-RUN-012",
    "fuel": {
      "material_name": "Synthetic_Cellulose_Fabric",
      "chemical_formula": "(C6H10O5)n",
      "geometry_type": "flat_sheet",
      "thickness_mm": 0.38,
      "width_mm": 50.0,
      "length_mm": 100.0
    },
    "environment": {
      "gravity_level_g": 0.0,
      "total_pressure_kpa": 101.3,
      "oxygen_mole_fraction": 0.21,
      "flow_velocity_cm_s": 20.0,
      "flow_direction": "concurrent"
    },
    "measurement": {
      "parameter_name": "flame_spread_rate",
      "raw_value": 2.4,
      "raw_unit": "mm/s",
      "normalized_value": 0.24,
      "normalized_unit": "cm/s",
      "conversion_provenance": "raw_value * 0.1",
      "uncertainty_plus_minus": 0.2,
      "is_derived_estimate": false,
      "epistemic_status": "MEASURED_OBSERVATION"
    }
  }
  ```
* **Preconditions**: Investigation `SYNTHETIC-INV-001` registered in test harness mock registry; table URN resolves.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_PROVENANCE_VERIFIED`
* **Preservation Rules**: `raw_value: 2.4`, `raw_unit: "mm/s"`, and `source_location` must remain immutable.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-002`: Missing Source Attribution (Orphan Record)
* **Fixture ID**: `FIXTURE-PROV-002`
* **Name**: Unattributed Measurement Payload
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that Gate 1 immediately rejects incoming records lacking an investigation code, DOI, or repository artifact URI.
* **Target Tests**: `TEST-A02`
* **Target Requirements**: `REQ-INGEST-01`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Stripped `investigation_code`, `doi`, `source_artifact_uri`, and `source_location`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-012",
    "measurement": {
      "parameter_name": "flame_spread_rate",
      "raw_value": 2.4,
      "raw_unit": "mm/s"
    }
  }
  ```
* **Preconditions**: Default ingestion pipeline active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_PROVENANCE_MISSING_AUTHORITY`
* **Preservation Rules**: No database persistence permitted.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-003`: Landing Page Mistaken for Primary Data
* **Fixture ID**: `FIXTURE-PROV-003`
* **Name**: Web Portal Landing Page URL as Source
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that Gate 1 blocks records citing a high-level portal URL without an underlying data file or table row citation.
* **Target Tests**: `TEST-A03`
* **Target Requirements**: `REQ-INGEST-02`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `source_artifact_uri` to a generic portal landing page and omitted `source_location`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "source_artifact_uri": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98",
    "source_location": null,
    "measurement": {
      "parameter_name": "sample_thickness",
      "raw_value": 0.37,
      "raw_unit": "cm"
    }
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Expected Reason Code**: `ERR_LANDING_PAGE_NOT_DATA_ARTIFACT`
* **Preservation Rules**: Staged in quarantine review queue.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-004`: Publication-to-Dataset Run Mismatch
* **Fixture ID**: `FIXTURE-PROV-004`
* **Name**: Unverified Publication-to-Run Binding
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents associating paper findings with an experimental table run when chemical fuels or configurations conflict.
* **Target Tests**: `TEST-A04`, `TEST-E02`
* **Target Requirements**: `REQ-INGEST-03`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Attempting to bind a paper addressing synthetic droplet burning to a solid flat-sheet test run.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "doi": "10.0000/synthetic.droplet.paper.2017",
    "target_run_id": "SYNTHETIC-RUN-SOLID-001",
    "paper_fuel_tested": "n-heptane_droplet",
    "table_run_fuel": "synthetic_cellulose_fabric",
    "measurement": {
      "parameter_name": "extinction_diameter",
      "raw_value": 0.85,
      "raw_unit": "mm"
    }
  }
  ```
* **Preconditions**: Master Source Register loaded.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_CROSS_FUEL_RUN_BINDING_CONFLICT`
* **Preservation Rules**: Block automated linking.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-005`: Idempotent Duplicate Ingestion Record
* **Fixture ID**: `FIXTURE-PROV-005`
* **Name**: Re-ingested Identical Artifact Record
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that re-ingesting an identical record updates the ingestion timestamp without duplicating rows in the database.
* **Target Tests**: `TEST-A05`, `TEST-H04`
* **Target Requirements**: `REQ-INGEST-04`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Identical payload submitted with an updated batch timestamp.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "doi": "10.0000/synthetic.combust.2026.001",
    "source_artifact_uri": "urn:fireline:synthetic:artifact:table:001",
    "source_location": "Table_1_Row_12",
    "run_id": "SYNTHETIC-RUN-012",
    "batch_submission_timestamp": "2026-11-14T10:00:00Z"
  }
  ```
* **Preconditions**: `FIXTURE-PROV-001` already present in staging table.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_IDEMPOTENT_UPDATE`
* **Preservation Rules**: Database row count must not increase.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-06`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-006`: Nonexistent Table Coordinate / Broken Lineage
* **Fixture ID**: `FIXTURE-PROV-006`
* **Name**: Out-of-Bounds Table Coordinate
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Traps broken provenance links where the cited row or cell index exceeds the target table's dimensions.
* **Target Tests**: `TEST-A06`
* **Target Requirements**: `REQ-INGEST-05`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `source_location` to `Table_1_Row_999` in a 20-row table.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "source_artifact_uri": "urn:fireline:synthetic:artifact:table:001",
    "source_location": "Table_1_Row_999",
    "measurement": {
      "parameter_name": "flame_spread_rate",
      "raw_value": 2.4,
      "raw_unit": "mm/s"
    }
  }
  ```
* **Preconditions**: Artifact metadata reports `row_count: 20`.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SOURCE_COORDINATE_OUT_OF_BOUNDS`
* **Preservation Rules**: Reject from empirical staging.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PROV-007`: Unverified Bibliography / Non-Resolving DOI
* **Fixture ID**: `FIXTURE-PROV-007`
* **Name**: Unverified Preprint Citation
* **Category**: `PROVENANCE`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Preserves unverified status when a research note references an unregistered DOI or unpeer-reviewed manuscript.
* **Target Tests**: `TEST-A07`
* **Target Requirements**: `REQ-INGEST-01`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `doi` to `10.9999/unresolved.preprint.2026`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "investigation_code": "SYNTHETIC-INV-001",
    "doi": "10.9999/unresolved.preprint.2026",
    "source_artifact_uri": "urn:fireline:synthetic:artifact:manuscript:draft",
    "measurement": {
      "parameter_name": "flame_spread_rate",
      "raw_value": 3.1,
      "raw_unit": "mm/s"
    }
  }
  ```
* **Preconditions**: DOI resolution client active.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Expected Reason Code**: `WARN_BIBLIOGRAPHY_UNVERIFIED`
* **Preservation Rules**: Flag record with `STATUS_UNVERIFIED_CITATION`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 3. Category 2: Missingness and Nullability (`MISS`)

---

### `FIXTURE-MISS-001`: Explicit Null for Unmeasured Parameter
* **Fixture ID**: `FIXTURE-MISS-001`
* **Name**: Honest Null Representation
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that unmeasured parameters (e.g. radiant flux in unheated tests) remain explicit `null` and are never replaced with `0.0`.
* **Target Tests**: `TEST-B01`
* **Target Requirements**: `REQ-INGEST-06`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Explicit `null` for `external_radiant_flux_kw_m2`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-012",
    "environment": {
      "total_pressure_kpa": 101.3,
      "oxygen_mole_fraction": 0.21,
      "flow_velocity_cm_s": 20.0,
      "external_radiant_flux_kw_m2": null,
      "flux_missingness_reason": "NOT_MEASURED_IN_APPARATUS"
    }
  }
  ```
* **Preconditions**: Ingestion Gate 8 active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_HONEST_NULL_PRESERVED`
* **Preservation Rules**: `external_radiant_flux_kw_m2` must remain `null` in DB.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-02`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-002`: Missing Mandatory Ambient Pressure
* **Fixture ID**: `FIXTURE-MISS-002`
* **Name**: Ingestion Payload Lacking Pressure
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies rejection of records lacking ambient pressure ($P$), which is required for flammability boundary modeling.
* **Target Tests**: `TEST-B02`, `TEST-B05`
* **Target Requirements**: `REQ-INGEST-09`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `environment.total_pressure_kpa: null` without source explanation.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-012",
    "environment": {
      "total_pressure_kpa": null,
      "oxygen_mole_fraction": 0.21,
      "flow_velocity_cm_s": 20.0
    }
  }
  ```
* **Preconditions**: Classifier indexing gate active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_MANDATORY_CONDITION_PRESSURE_MISSING`
* **Preservation Rules**: Disallowed from classifier indexing.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-003`: Quiescent Regime Null Flow Velocity
* **Fixture ID**: `FIXTURE-MISS-003`
* **Name**: Quiescent Droplet Null Forced Velocity
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Exercises proposed nullable flow velocity in quiescent diffusion burning, where forced flow is physically non-existent.
* **Target Tests**: `TEST-B03`
* **Target Requirements**: `REQ-INGEST-07`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `flow_velocity_cm_s: null` and `regime: "quiescent_diffusion"`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-DROPLET-01",
    "environment": {
      "gravity_level_g": 0.0,
      "total_pressure_kpa": 101.3,
      "oxygen_mole_fraction": 0.21,
      "flow_velocity_cm_s": null,
      "transport_mode": "quiescent_diffusion"
    }
  }
  ```
* **Preconditions**: Ingestion schema supports proposed `ScientificValue<T>`.
* **Expected Disposition**: `ACCEPT` (Under proposed schema) / `OPEN` (Under canonical schema)
* **Expected Reason Code**: `INGEST_OK_QUIESCENT_NULL_VALID`
* **Preservation Rules**: No zero imputation permitted.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-02`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-004`: Legacy Sentinel Value Trapping (`-999.0`)
* **Fixture ID**: `FIXTURE-MISS-004`
* **Name**: Numeric Sentinel Value in Float Field
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that parser traps legacy sentinel `-999.0` and converts it to explicit `null` with a logged sanitizer warning.
* **Target Tests**: `TEST-B04`
* **Target Requirements**: `REQ-INGEST-08`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `external_radiant_flux_kw_m2: -999.0`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-012",
    "environment": {
      "external_radiant_flux_kw_m2": -999.0
    }
  }
  ```
* **Preconditions**: Input sanitizer active.
* **Expected Disposition**: `ACCEPT` (with Sanitizer Warning)
* **Expected Reason Code**: `WARN_SENTINEL_CONVERTED_TO_NULL`
* **Preservation Rules**: Normalized value must be `null`; raw value `-999.0` stored in audit log.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-005`: Unannotated Empty Cell in Required Column
* **Fixture ID**: `FIXTURE-MISS-005`
* **Name**: Blank Cell in Tabular Ingestion
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Ensures that an unannotated empty table cell in an essential parameter is quarantined, preventing silent zero injection.
* **Target Tests**: `TEST-B05`
* **Target Requirements**: `REQ-INGEST-06`
* **Input Format**: CSV Snippet
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Empty string between delimiters for oxygen mole fraction.
* **Synthetic Payload**:
  ```text
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Run_ID,Pressure_kPa,Oxygen_Fraction,Flow_cm_s
  SYNTHETIC-RUN-012,101.3,,20.0
  ```
* **Preconditions**: Tabular CSV parser active.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `ERR_EMPTY_CELL_REQUIRED_PARAMETER`
* **Preservation Rules**: Row written to quarantine staging table.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-03`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-006`: Omitted Measurement Uncertainty Preservation
* **Fixture ID**: `FIXTURE-MISS-006`
* **Name**: Unreported Measurement Uncertainty
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that omitted measurement uncertainty remains `null` rather than being fabricated as `0.0` or $\pm 5\%$.
* **Target Tests**: `TEST-B06`, `TEST-C06`
* **Target Requirements**: `REQ-INGEST-10`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `uncertainty_plus_minus: null`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "measurement": {
      "parameter_name": "flame_spread_rate",
      "raw_value": 2.4,
      "raw_unit": "mm/s",
      "uncertainty_plus_minus": null
    }
  }
  ```
* **Preconditions**: Ingestion Gate 8 active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_UNCERTAINTY_NULL_PRESERVED`
* **Preservation Rules**: Uncertainty field must remain `null` in DB.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-007`: Unacquired Raw Data Archive Reference
* **Fixture ID**: `FIXTURE-MISS-007`
* **Name**: Unacquired Archive Marked Inspected
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies rejection of records claiming inspection of a multi-gigabyte ZIP archive that has not been downloaded locally.
* **Target Tests**: `TEST-B07`, `TEST-H06`
* **Target Requirements**: `REQ-INGEST-11`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Reference unacquired archive file path.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "target_archive_path": "data/raw/psi/synthetic/unacquired_10gb_archive.zip",
    "inspection_claimed": true
  }
  ```
* **Preconditions**: Local filesystem check confirms file absence.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_RAW_ARCHIVE_FILE_NOT_ACQUIRED`
* **Preservation Rules**: Ingestion halted immediately.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-MISS-008`: Parser Empty Cell Imputation Trapping
* **Fixture ID**: `FIXTURE-MISS-008`
* **Name**: Parser-Substituted Zero in Blank Field
* **Category**: `MISSINGNESS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Traps faulty transformation code that silently converts empty strings `""` into numeric `0.0`.
* **Target Tests**: `TEST-B08`
* **Target Requirements**: `REQ-INGEST-06`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Pipeline receives empty cell but emits `0.0` with no zero evidence in raw record.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "raw_table_cell": "",
    "parser_emitted_value": 0.0,
    "parameter": "external_radiant_flux"
  }
  ```
* **Preconditions**: Ingestion audit validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SILENT_ZERO_IMPUTATION_DETECTED`
* **Preservation Rules**: Record dropped; parser bug logged.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 4. Category 3: Units and Scientific Value Integrity (`UNIT`)

---

### `FIXTURE-UNIT-001`: Valid Dual-Unit Normalization
* **Fixture ID**: `FIXTURE-UNIT-001`
* **Name**: Verified Pressure Unit Normalization ($psia \rightarrow kPa$)
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Tests that valid raw engineering units ($psia$) are preserved alongside mathematically exact SI normalizations ($kPa$).
* **Target Tests**: `TEST-C01`, `TEST-C07`
* **Target Requirements**: `REQ-INGEST-12`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Controlled imperial pressure unit input.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "raw_value": 14.696,
    "raw_unit": "psia",
    "normalized_value": 101.325,
    "normalized_unit": "kPa",
    "conversion_provenance": "raw_value * 6.894757"
  }
  ```
* **Preconditions**: Unit conversion matrix loaded.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_UNIT_NORMALIZED`
* **Preservation Rules**: Both `raw_value` and `normalized_value` preserved.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-002`: Unit-Label Conflict ($14.7\text{ kPa}$)
* **Fixture ID**: `FIXTURE-UNIT-002`
* **Name**: Mislabeled Atmospheric Pressure Unit
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that a record reporting standard atmospheric pressure as $14.7\text{ kPa}$ (instead of $14.7\text{ psia}$) is rejected, not silently corrected.
* **Target Tests**: `TEST-C02`
* **Target Requirements**: `REQ-INGEST-13`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set pressure to `14.7` with unit `kPa`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "chamber_pressure",
    "raw_value": 14.7,
    "raw_unit": "kPa",
    "context": "nominal_standard_sea_level_atmosphere"
  }
  ```
* **Preconditions**: Physical plausibility validator active ($14.7\text{ kPa} \approx 0.145\text{ atm}$, incompatible with nominal cabin).
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_UNIT_LABEL_PHYSICAL_CONFLICT`
* **Preservation Rules**: Record rejected; no silent multiplication by 6.89.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-003`: Uncalibrated Instrument Display Index
* **Fixture ID**: `FIXTURE-UNIT-003`
* **Name**: BASS-II Fan Display Setting
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Ensures that uncalibrated instrument settings (e.g. `Fan display: 62`) are quarantined and not converted into SI velocity ($\text{cm/s}$) without verified calibration curves.
* **Target Tests**: `TEST-C03`, `TEST-E04`
* **Target Requirements**: `REQ-INGEST-14`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Instrument index setting without physical calibration curve.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "fan_speed_setting",
    "raw_value": 62,
    "raw_unit": "display_index",
    "normalized_value": null,
    "normalized_unit": null,
    "calibration_status": "CALIBRATION_CURVE_PENDING"
  }
  ```
* **Preconditions**: Flow duct calibration curve absent.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `WARN_UNCALIBRATED_INSTRUMENT_INDEX`
* **Preservation Rules**: Raw index 62 preserved; `flow_velocity_cm_s` remains `null`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-04`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-004`: Naked Numerical Value (Missing Unit)
* **Fixture ID**: `FIXTURE-UNIT-004`
* **Name**: Numerical Value Lacking Physical Unit
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that raw numbers lacking an explicit unit in source table or column metadata are immediately rejected.
* **Target Tests**: `TEST-C04`
* **Target Requirements**: `REQ-INGEST-15`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `raw_unit: null`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "flame_spread_rate",
    "raw_value": 2.4,
    "raw_unit": null
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_MEASUREMENT_UNIT_MISSING`
* **Preservation Rules**: Record dropped; no SI inference permitted.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-005`: Precision Inflation Prevention
* **Fixture ID**: `FIXTURE-UNIT-005`
* **Name**: Approximate Value Precision Preservation
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that approximately reported values ($\approx 2.4\text{ mm/s}$) preserve their approximate qualifier and significant figures without floating-point precision inflation ($2.40000000$).
* **Target Tests**: `TEST-C05`
* **Target Requirements**: `REQ-INGEST-16`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Approximate measurement with explicit qualifier.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "raw_value": 2.4,
    "raw_unit": "mm/s",
    "is_approximate": true,
    "reported_precision_digits": 2
  }
  ```
* **Preconditions**: Decimal precision validator active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_PRECISION_PRESERVED`
* **Preservation Rules**: `is_approximate: true` preserved; no trailing zeroes added.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-006`: Fabricated Uncertainty Bounds Trapping
* **Fixture ID**: `FIXTURE-UNIT-006`
* **Name**: Fabricated Zero Uncertainty
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Traps pipeline bugs that inject $\pm 0.0$ when the source omitted uncertainty bounds.
* **Target Tests**: `TEST-C06`
* **Target Requirements**: `REQ-INGEST-10`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Injected `uncertainty_plus_minus: 0.0` on an uncalibrated optical reading.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "flame_spread_rate",
    "raw_value": 2.4,
    "raw_unit": "mm/s",
    "uncertainty_plus_minus": 0.0,
    "source_uncertainty_reported": false
  }
  ```
* **Preconditions**: Uncertainty truthfulness validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_FABRICATED_ZERO_UNCERTAINTY`
* **Preservation Rules**: Disallowed from empirical evidence.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-007`: Non-Reproducible Normalization Calculation
* **Fixture ID**: `FIXTURE-UNIT-007`
* **Name**: Corrupted Unit Conversion Formula
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records where the normalized value mathematically contradicts the raw value and documented conversion formula.
* **Target Tests**: `TEST-C07`
* **Target Requirements**: `REQ-INGEST-12`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `raw_value: 10.0` ($\text{cm/s}$) and `normalized_value: 0.5` ($\text{m/s}$), contradicting factor $0.01$.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "raw_value": 10.0,
    "raw_unit": "cm/s",
    "normalized_value": 0.5,
    "normalized_unit": "m/s",
    "conversion_provenance": "raw_value * 0.01"
  }
  ```
* **Preconditions**: Normalization reproducibility checker active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_NORMALIZATION_MATH_NON_REPRODUCIBLE`
* **Preservation Rules**: Record dropped; math discrepancy logged.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-008`: Ambiguous Atmospheric Concentration Basis
* **Fixture ID**: `FIXTURE-UNIT-008`
* **Name**: Oxygen Concentration Without Basis (Volume vs Mass)
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Quarantines records where oxygen is listed as `21.0` without specifying whether it represents volume percent (mole fraction) or mass percent.
* **Target Tests**: `TEST-C08`
* **Target Requirements**: `REQ-INGEST-17`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `oxygen_concentration: 21.0` with `basis: null`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "oxygen_concentration": 21.0,
    "basis": null
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `WARN_CONCENTRATION_BASIS_AMBIGUOUS`
* **Preservation Rules**: Record held in staging until basis resolved.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-UNIT-009`: Pressure Unit Ambiguity
* **Fixture ID**: `FIXTURE-UNIT-009`
* **Name**: Ambiguous Numeric Pressure
* **Category**: `UNITS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Quarantines records listing pressure as `100` where the column header fails to specify whether the unit is $\text{kPa}$, $\text{torr}$, or $\text{mbar}$.
* **Target Tests**: `TEST-C09`
* **Target Requirements**: `REQ-INGEST-13`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `raw_value: 100.0` and `raw_unit: "pressure_units"`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "ambient_pressure",
    "raw_value": 100.0,
    "raw_unit": "pressure_units"
  }
  ```
* **Preconditions**: Unit verification gate active.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `WARN_PRESSURE_UNIT_AMBIGUOUS`
* **Preservation Rules**: Block automated normalization.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 5. Category 4: Experimental Conditions and Record Identity (`COND`)

---

### `FIXTURE-COND-001`: Flow Direction Transport Inversion
* **Fixture ID**: `FIXTURE-COND-001`
* **Name**: Opposed Flow Mislabeled as Concurrent
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records attempting to store an opposed-flow burn under a concurrent-flow contract, preventing invalid heat transfer model bindings.
* **Target Tests**: `TEST-D01`
* **Target Requirements**: `REQ-INGEST-18`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Inverted flow direction relative to test configuration.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "test_configuration": "opposed_flame_spread",
    "flow_direction": "concurrent"
  }
  ```
* **Preconditions**: Physics validation gate active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_FLOW_DIRECTION_INCOMPATIBLE`
* **Preservation Rules**: No cross-binding permitted.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COND-002`: Terrestrial Gravity Conflation ($1g$ vs $\mu g$)
* **Fixture ID**: `FIXTURE-COND-002`
* **Name**: Terrestrial Normal-Gravity Record Claiming Microgravity
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Traps ground-based normal-gravity burns ($1g$) attempting to enter the microgravity flight evidence index.
* **Target Tests**: `TEST-D02`
* **Target Requirements**: `REQ-INGEST-19`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `gravity_level_g: 1.0` while tagging `target_regime: "microgravity"`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "gravity_level_g": 1.0,
    "target_regime": "microgravity_flight_database"
  }
  ```
* **Preconditions**: Gravity boundary validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_GRAVITY_REGIME_CONFLATION`
* **Preservation Rules**: Disallowed from flight evidence views.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COND-003`: Atmospheric Regime Conflation
* **Fixture ID**: `FIXTURE-COND-003`
* **Name**: Exploration Atmosphere Conflated with Standard Cabin
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents Exploration Atmosphere burns ($56\text{ kPa}, 34\%\ O_2$) from being merged with Standard Cabin burns ($101.3\text{ kPa}, 21\%\ O_2$).
* **Target Tests**: `TEST-D03`, `TEST-I06`
* **Target Requirements**: `REQ-INGEST-20`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Exploration atmosphere conditions submitted to standard cabin baseline contract.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "total_pressure_kpa": 56.0,
    "oxygen_mole_fraction": 0.34,
    "target_contract": "standard_sea_level_cabin"
  }
  ```
* **Preconditions**: Atmosphere regime separator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_ATMOSPHERE_REGIME_MISMATCH`
* **Preservation Rules**: Isolated into separate environmental regime partitions.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COND-004`: Specimen Dimension Incompatibility (Biot Scaling)
* **Fixture ID**: `FIXTURE-COND-004`
* **Name**: Cylindrical Rod Radius Discrepancy
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents merging flammability records for cylinders of differing radii ($6.35\text{ mm}$ vs $12.7\text{ mm}$) without thermal Biot scaling adjustments.
* **Target Tests**: `TEST-D04`
* **Target Requirements**: `REQ-INGEST-21`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Differing cylinder radii submitted under single flat-sheet run key.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "specimen_radius_mm": 6.35,
    "comparison_specimen_radius_mm": 12.7,
    "biot_scaling_applied": false
  }
  ```
* **Preconditions**: Solid flammability scaling module active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_CYLINDER_RADIUS_INCOMPATIBLE`
* **Preservation Rules**: Block automated record merging.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COND-005`: Incomplete Boundary Condition Set
* **Fixture ID**: `FIXTURE-COND-005`
* **Name**: Incomplete Environmental State
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records missing essential boundary conditions ($P, X_{O_2}, g$) required by the 4-tier Gated Rule Classifier.
* **Target Tests**: `TEST-D05`
* **Target Requirements**: `REQ-INGEST-09`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Omitted ambient pressure and oxygen mole fraction.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "total_pressure_kpa": null,
    "oxygen_mole_fraction": null,
    "flow_velocity_cm_s": 20.0
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_BOUNDARY_CONDITION_SET_INCOMPLETE`
* **Preservation Rules**: Disallowed from classifier indexing.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COND-006`: Apparatus Confinement Artifact Flagging
* **Fixture ID**: `FIXTURE-COND-006`
* **Name**: Wall Quenching Boundary Layer Artifact
* **Category**: `CONDITIONS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Tests that flammability records where flames interact with flow duct walls are accepted with an explicit confinement caveat flag.
* **Target Tests**: `TEST-D06`
* **Target Requirements**: `REQ-INGEST-22`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Flagged wall interaction.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "duct_height_mm": 50.0,
    "flame_standoff_distance_mm": 48.5,
    "wall_thermal_interaction": true
  }
  ```
* **Preconditions**: Boundary layer artifact analyzer active.
* **Expected Disposition**: `ACCEPT` (with Confinement Caveat)
* **Expected Reason Code**: `INGEST_OK_CONFINEMENT_CAVEAT_FLAGGED`
* **Preservation Rules**: Stored with `caveat: "APPARATUS_WALL_QUENCHING_RISK"`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 6. Category 5: Fuel and Specimen Geometry Safeguards (`FUEL`)

---

### `FIXTURE-FUEL-001`: FLEX Tabular Summary Misrepresented as Time-Series
* **Fixture ID**: `FIXTURE-FUEL-001`
* **Name**: Droplet Summary Row Masquerading as Optical Time Series
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects attempts to parse scalar summary table rows as time-series optical diameter curve data.
* **Target Tests**: `TEST-E01`
* **Target Requirements**: `REQ-INGEST-23`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Tabular scalar metadata submitted to time-series endpoint.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "target_data_type": "time_series_optical_diameter",
    "payload_structure": "scalar_table_summary_row",
    "initial_diameter_mm": 2.1,
    "burn_duration_s": 3.4
  }
  ```
* **Preconditions**: Time-series schema validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SCALAR_SUMMARY_NOT_TIME_SERIES`
* **Preservation Rules**: Reject from time-series storage.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-FUEL-002`: Cross-Fuel Kinetic Binding (Methanol vs Heptane)
* **Fixture ID**: `FIXTURE-FUEL-002`
* **Name**: Methanol Flight Run Bound to Alkane Kinetics
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents associating Methanol runs with $n$-heptane cool-flame kinetic findings.
* **Target Tests**: `TEST-E02`
* **Target Requirements**: `REQ-INGEST-03`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Methanol run attempting to import cool-flame alkane findings.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_fuel": "methanol",
    "claim_fuel": "n-heptane",
    "claim_phenomenon": "cool_flame_second_stage_combustion"
  }
  ```
* **Preconditions**: Fuel taxonomy mapper active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_CROSS_FUEL_KINETICS_CONFLICT`
* **Preservation Rules**: Block claim attachment.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-FUEL-003`: BASS-II Film vs Rod Conflation ($Bi \ll 1$ vs $Bi \gg 1$)
* **Fixture ID**: `FIXTURE-FUEL-003`
* **Name**: Thin PMMA Film Conflated with Thick Rod
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects treating thin PMMA films ($150\ \mu\text{m}$) as equivalent to thick PMMA rods ($R = 12.7\text{ mm}$).
* **Target Tests**: `TEST-E03`, `TEST-I02`
* **Target Requirements**: `REQ-INGEST-24`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Film geometry submitted to cylindrical rod contract.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "fuel_material": "PMMA",
    "geometry_type": "flat_sheet",
    "thickness_um": 150.0,
    "thermal_regime": "thermally_thin",
    "target_contract": "thick_cylindrical_rod"
  }
  ```
* **Preconditions**: Fuel geometry validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_GEOMETRY_BIOT_REGIME_CONFLICT`
* **Preservation Rules**: Block contract substitution.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-FUEL-004`: Uncalibrated Fan Display Flow Conversion
* **Fixture ID**: `FIXTURE-FUEL-004`
* **Name**: Direct Conversion of Raw Instrument Setting
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Quarantines attempts to derive physical flow velocities from arbitrary fan display indices without calibration curves.
* **Target Tests**: `TEST-E04`
* **Target Requirements**: `REQ-INGEST-14`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Uncalibrated fan index converted to SI flow.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "instrument_display_setting": 62,
    "attempted_si_conversion": 6.2,
    "calibration_curve_staged": false
  }
  ```
* **Preconditions**: Calibration curve database check fails.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `WARN_UNCALIBRATED_INSTRUMENT_SETTING`
* **Preservation Rules**: Disallow derived velocity storage.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-04`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-FUEL-005`: Saffire-I Thickness Discrepancy Lock
* **Fixture ID**: `FIXTURE-FUEL-005`
* **Name**: Conflicting Reported Thickness Trapping
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Tests that a record containing conflicting thickness figures ($0.37\text{ cm}$ vs. $0.4\text{ mm}$) is trapped in `REQUIRE_REVIEW` and not silently altered.
* **Target Tests**: `TEST-E05`
* **Target Requirements**: `REQ-INGEST-25`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Simulated thickness discrepancy payload.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "reported_table_thickness_cm": 0.37,
    "reported_literature_thickness_mm": 0.4,
    "attempted_silent_correction": false
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Expected Reason Code**: `STATUS_DISCREPANCY_FLAG_THICKNESS`
* **Preservation Rules**: Original reported numbers preserved; flagged for engineering review.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-01`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-FUEL-006`: Initial Flight Table Conditions Mistaken for Dynamic Spread
* **Fixture ID**: `FIXTURE-FUEL-006`
* **Name**: Sample Card Geometry Populating Flame Spread
* **Category**: `FUEL_GEOMETRY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents flight summary tables that contain only initial sample dimensions from populating dynamic flame spread fields.
* **Target Tests**: `TEST-E06`
* **Target Requirements**: `REQ-INGEST-26`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Static card dimensions mapped to flame spread field.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "source_column": "Sample_Length_cm",
    "target_field": "flame_spread_rate_cm_s",
    "mapping_valid": false
  }
  ```
* **Preconditions**: Schema field mapping contract active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_INITIAL_DIMENSION_NOT_SPREAD_RATE`
* **Preservation Rules**: Reject mapping script.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 7. Category 6: Measured, Derived, and Interpreted Epistemic Types (`EPIS`)

---

### `FIXTURE-EPIS-001`: Derived Quantity Labeled Direct Sensor Reading
* **Fixture ID**: `FIXTURE-EPIS-001`
* **Name**: Calculated Value Labeled Direct Observation
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records where an analytically derived quantity is mislabeled as an empirical transducer reading.
* **Target Tests**: `TEST-F01`
* **Target Requirements**: `REQ-INGEST-27`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Formula calculation labeled sensor observation.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "gas_phase_heat_flux",
    "raw_value": 15.2,
    "raw_unit": "kW/m2",
    "epistemic_status": "MEASURED_OBSERVATION",
    "is_derived_estimate": true,
    "derivation_formula": "k_g * (T_flame - T_surface) / standoff"
  }
  ```
* **Preconditions**: Epistemic status integrity validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_DERIVED_LABELED_DIRECT_MEASUREMENT`
* **Preservation Rules**: Enforce `epistemic_status: DERIVED_ESTIMATE`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-EPIS-002`: Saffire-I Derived Pressure Estimate Mislabeled Telemetry
* **Fixture ID**: `FIXTURE-EPIS-002`
* **Name**: Derived Cabin Pressure Rise Mislabeled Sensor
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Traps derived bulk gas heating pressure estimates ($\Delta P = 0.5\text{ kPa}$) attempting to masquerade as sensor telemetry.
* **Target Tests**: `TEST-F02`
* **Target Requirements**: `REQ-INGEST-28`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Saffire derived pressure rise labeled transducer channel.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "vehicle_pressure_rise",
    "value_kpa": 0.5,
    "channel_id": "CALCULATED_GAS_HEATING_MODEL",
    "claimed_type": "observed_pressure_transducer_telemetry"
  }
  ```
* **Preconditions**: Provenance channel audit active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_DERIVED_PRESSURE_NOT_TELEMETRY`
* **Preservation Rules**: Reject from empirical telemetry tables.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-EPIS-003`: Numerical Simulation Ingested as Empirical Flight Burn
* **Fixture ID**: `FIXTURE-EPIS-003`
* **Name**: CFD Model Output Submitted as Empirical Burn
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that numerical fluid dynamics predictions (e.g. Li et al. 2018) are segregated from empirical flight burn evidence.
* **Target Tests**: `TEST-F03`
* **Target Requirements**: `REQ-INGEST-29`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Simulation output claiming empirical status.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "model_name": "FDS_CFD_Simulation_v6",
    "predicted_spread_rate_mm_s": 2.8,
    "claimed_category": "empirical_flight_burn"
  }
  ```
* **Preconditions**: Empirical evidence gate active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SIMULATION_SUBMITTED_AS_EMPIRICAL`
* **Preservation Rules**: Isolate into simulation registry.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-EPIS-004`: Valid Derived Quantity with Transparent Provenance
* **Fixture ID**: `FIXTURE-EPIS-004`
* **Name**: Verified Burning Rate Constant Calculation
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Demonstrates acceptance of a derived quantity that provides an explicit formula, input references, and derivation flags.
* **Target Tests**: `TEST-F04`
* **Target Requirements**: `REQ-INGEST-27`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Complete derived quantity payload.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "parameter_name": "burning_rate_constant_K",
    "raw_value": 0.45,
    "raw_unit": "mm2/s",
    "is_derived_estimate": true,
    "epistemic_status": "DERIVED_ESTIMATE",
    "derivation_formula": "K = -d(D^2)/dt",
    "input_channels": ["optical_diameter_series_t"]
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_DERIVED_QUANTITY_TRANSPARENT`
* **Preservation Rules**: Formula and channel provenance preserved.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-EPIS-005`: Research Proposal Hypothesis Text Segregation
* **Fixture ID**: `FIXTURE-EPIS-005`
* **Name**: Proposal Hypothesis Ingested as Empirical Finding
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents proposal hypothesis statements from being ingested into empirical findings tables.
* **Target Tests**: `TEST-F05`
* **Target Requirements**: `REQ-INGEST-30`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Hypothesis text submitted to empirical findings endpoint.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "text": "Hypothesis: Flame spread in microgravity will be 2x faster than 1g.",
    "target_table": "empirical_findings"
  }
  ```
* **Preconditions**: Text classifier active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_HYPOTHESIS_TEXT_IN_EMPIRICAL_TABLE`
* **Preservation Rules**: Isolate into proposal metadata table.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-EPIS-006`: Contradictory Derived Calculation
* **Fixture ID**: `FIXTURE-EPIS-006`
* **Name**: Derived Burning Rate Contradicting Raw Diameter Data
* **Category**: `EPISTEMIC_STATUS`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Flags records where a reported derived value contradicts raw input data by $> 5\%$.
* **Target Tests**: `TEST-F06`
* **Target Requirements**: `REQ-INGEST-31`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Derived $K$ contradicts slope of $D^2(t)$.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "reported_K_mm2_s": 0.85,
    "calculated_slope_K_mm2_s": 0.45,
    "discrepancy_percentage": 88.8
  }
  ```
* **Preconditions**: Derivation auditor active.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Expected Reason Code**: `WARN_DERIVATION_CONTRADICTS_INPUTS`
* **Preservation Rules**: Staged with calculation caveat.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 8. Category 7: Verification and Synthetic-Data Isolation (`VERIF`)

---

### `FIXTURE-VERIF-001`: Synthetic Fixture Production Quarantine
* **Fixture ID**: `FIXTURE-VERIF-001`
* **Name**: Fully Formed Synthetic Test Fixture
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that complete, valid synthetic fixtures carrying `is_synthetic: true` are 100% excluded from production search indices and astronaut decision support views.
* **Target Tests**: `TEST-G01`, `TEST-G04`
* **Target Requirements**: `REQ-INGEST-32`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Explicit synthetic quarantine test.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "test_fixture_id": "FIXTURE-PROV-001"
  }
  ```
* **Preconditions**: Production search indexing query active.
* **Expected Disposition**: `ACCEPT` (into Test Staging) / `REJECT` (from Production Indices)
* **Expected Reason Code**: `INGEST_OK_SYNTHETIC_QUARANTINED`
* **Preservation Rules**: Zero presence in `v_verified_empirical_findings`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-VERIF-002`: Structural Validity Claiming Scientific Truth
* **Fixture ID**: `FIXTURE-VERIF-002`
* **Name**: Schema-Conforming Record Claiming Verified Truth
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records claiming empirical truth simply because they passed JSON schema validation checks.
* **Target Tests**: `TEST-G02`
* **Target Requirements**: `REQ-INGEST-33`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Structurally valid record asserting unearned verification status.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "schema_validation_passed": true,
    "asserted_verification_level": "VERIFIED_EMPIRICAL",
    "primary_literature_inspected": false
  }
  ```
* **Preconditions**: Verification level gate active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_STRUCTURAL_VALIDITY_NOT_SCIENTIFIC_TRUTH`
* **Preservation Rules**: Demote to `STATUS_UNVERIFIED_STAGING`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-VERIF-003`: Structurally Valid Unverified Record
* **Fixture ID**: `FIXTURE-VERIF-003`
* **Name**: Unverified Empirical Staging Record
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Demonstrates acceptance of a valid record into unverified staging with status `UNVERIFIED_RECORD` preserved.
* **Target Tests**: `TEST-G03`
* **Target Requirements**: `REQ-INGEST-33`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `verification_level: UNVERIFIED_RECORD`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "verification_level": "UNVERIFIED_RECORD"
  }
  ```
* **Preconditions**: Ingestion Gate 1 active.
* **Expected Disposition**: `ACCEPT` (into Unverified Staging)
* **Expected Reason Code**: `INGEST_OK_UNVERIFIED_STAGED`
* **Preservation Rules**: `verification_level: UNVERIFIED_RECORD` preserved.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-VERIF-004`: Synthetic Payload Submitted to Empirical API
* **Fixture ID**: `FIXTURE-VERIF-004`
* **Name**: Synthetic Fixture Submitted as Real Evidence
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that production empirical endpoints reject payloads carrying `is_synthetic: true` or synthetic URNs.
* **Target Tests**: `TEST-G04`
* **Target Requirements**: `REQ-INGEST-32`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Synthetic payload targeting production endpoint.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "target_endpoint": "/api/v1/empirical/submit"
  }
  ```
* **Preconditions**: Production API security filter active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SYNTHETIC_DATA_IN_PRODUCTION_ENDPOINT`
* **Preservation Rules**: Reject with 403 Forbidden.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-VERIF-005`: Ingestion of Contradicted Scientific Claim
* **Fixture ID**: `FIXTURE-VERIF-005`
* **Name**: Audit-Contradicted Claim
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Quarantines claims flagged as `CONTRADICTED` during evidence audit, preventing them from setting spacecraft flammability standards.
* **Target Tests**: `TEST-G05`
* **Target Requirements**: `REQ-INGEST-34`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Claim flagged `CONTRADICTED`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "claim_id": "SYNTHETIC-CLAIM-005",
    "audit_status": "CONTRADICTED",
    "target_safety_metric": "flammability_limit"
  }
  ```
* **Preconditions**: Safety standards indexing filter active.
* **Expected Disposition**: `QUARANTINE`
* **Expected Reason Code**: `WARN_CONTRADICTED_CLAIM_QUARANTINED`
* **Preservation Rules**: Barred from production safety calculations.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-VERIF-006`: Physical Evidence Gap Query
* **Fixture ID**: `FIXTURE-VERIF-006`
* **Name**: Query Touching Unmeasured Regime (Lunar Gravity)
* **Category**: `VERIFICATION`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Tests that queries touching unmeasured physical regimes (e.g. Lunar partial gravity) return explicit `EVIDENCE_GAP`, avoiding black-box interpolation.
* **Target Tests**: `TEST-G06`
* **Target Requirements**: `REQ-INGEST-35`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Query targeting unmeasured gravity regime.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "query_target": "flammability_boundary",
    "conditions": {
      "gravity_level_g": 0.166,
      "oxygen_mole_fraction": 0.28
    }
  }
  ```
* **Preconditions**: Classifier coverage map active.
* **Expected Disposition**: `ACCEPT` (with Evidence Gap Response)
* **Expected Reason Code**: `INGEST_OK_EVIDENCE_GAP_PRESERVED`
* **Preservation Rules**: Return `classification: "EVIDENCE_GAP"`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 9. Category 8: Parsing and Structural Integrity (`PARSE`)

---

### `FIXTURE-PARSE-001`: Malformed Delimiter / Shifted CSV Column
* **Fixture ID**: `FIXTURE-PARSE-001`
* **Name**: CSV Row with Shifted Delimiters
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that CSV rows with shifted commas or unexpected column counts are safely rejected with line-numbered error logs.
* **Target Tests**: `TEST-H01`
* **Target Requirements**: `REQ-INGEST-36`
* **Input Format**: CSV Snippet
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Injected extra comma shifting columns.
* **Synthetic Payload**:
  ```text
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Run_ID,Pressure_kPa,Oxygen_Fraction,Flow_cm_s
  SYNTHETIC-RUN-012,101.3,,0.21,20.0
  ```
* **Preconditions**: Ingestion Gate 4 CSV parser active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_CSV_COLUMN_COUNT_MISMATCH`
* **Preservation Rules**: Entire batch rejected or bad row dropped with line log.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PARSE-002`: Non-Numeric String in Floating-Point Field
* **Fixture ID**: `FIXTURE-PARSE-002`
* **Name**: Text Inside Numeric Oxygen Field
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects records containing non-numeric strings (e.g. `"pending"`, `"unmeasured"`) in float fields without sanitization.
* **Target Tests**: `TEST-H02`
* **Target Requirements**: `REQ-INGEST-36`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Set `oxygen_mole_fraction: "pending"`.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "oxygen_mole_fraction": "pending"
  }
  ```
* **Preconditions**: Type deserializer active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_TYPE_MISMATCH_STRING_IN_FLOAT`
* **Preservation Rules**: Ingestion halted for record.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PARSE-003`: Non-UTF-8 Legacy Character Stream
* **Fixture ID**: `FIXTURE-PARSE-003`
* **Name**: Windows-1252 Degree Symbol (`\xB0C`)
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Verifies that legacy NASA CSVs containing non-UTF-8 characters (e.g. `Windows-1252` degree symbol) invoke fallback decoders without crashing.
* **Target Tests**: `TEST-H03`
* **Target Requirements**: `REQ-INGEST-37`
* **Input Format**: Binary / Text Stream
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Non-UTF-8 encoded degree symbol in column header.
* **Synthetic Payload**:
  ```text
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Run_ID,Temperature_\xB0C,Pressure_kPa
  SYNTHETIC-RUN-012,25.4,101.3
  ```
* **Preconditions**: Encoding fallback detector active (`Windows-1252` fallback).
* **Expected Disposition**: `ACCEPT` (with Encoding Transcode)
* **Expected Reason Code**: `INGEST_OK_ENCODING_TRANSCODED`
* **Preservation Rules**: Column header transcoded to UTF-8 `Temperature_°C`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PARSE-004`: Idempotent Tabular Re-Ingestion
* **Fixture ID**: `FIXTURE-PARSE-004`
* **Name**: Duplicate Tabular Row
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Proves that re-submitting an identical CSV table does not insert duplicate database rows.
* **Target Tests**: `TEST-H04`
* **Target Requirements**: `REQ-INGEST-04`
* **Input Format**: CSV Snippet
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Re-submitting identical row payload.
* **Synthetic Payload**:
  ```text
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Run_ID,Pressure_kPa,Oxygen_Fraction,Flow_cm_s
  SYNTHETIC-RUN-012,101.3,0.21,20.0
  ```
* **Preconditions**: Ingestion Gate 4 active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_IDEMPOTENT_ROW_SKIPPED`
* **Preservation Rules**: Database row count invariant.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-06`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PARSE-005`: Extensible Unmapped Table Columns
* **Fixture ID**: `FIXTURE-PARSE-005`
* **Name**: Table with Unmapped Auxiliary Columns
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Tests that newly exposed columns in updated tables are safely preserved in an auxiliary `metadata_json` field without breaking core schema contracts.
* **Target Tests**: `TEST-H05`
* **Target Requirements**: `REQ-INGEST-38`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Added `auxiliary_ir_sensor_mv: 4.8` column.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "run_id": "SYNTHETIC-RUN-012",
    "auxiliary_ir_sensor_mv": 4.8
  }
  ```
* **Preconditions**: Schema open-content model active.
* **Expected Disposition**: `ACCEPT`
* **Expected Reason Code**: `INGEST_OK_UNMAPPED_COLUMN_PRESERVED`
* **Preservation Rules**: `auxiliary_ir_sensor_mv` stored in `metadata_json`.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-PARSE-006`: Missing Raw Data Archive File
* **Fixture ID**: `FIXTURE-PARSE-006`
* **Name**: Ingestion File Not Found
* **Category**: `PARSING`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Ensures graceful failure when an ingestion job points to a non-existent or corrupted raw archive file.
* **Target Tests**: `TEST-H06`
* **Target Requirements**: `REQ-INGEST-11`
* **Input Format**: CLI / Path Configuration
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Path pointing to non-existent file.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "file_path": "data/raw/psi/synthetic/non_existent_archive.zip"
  }
  ```
* **Preconditions**: File system check fails.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_FILE_NOT_FOUND`
* **Preservation Rules**: Ingestion job halted with error log.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 10. Category 9: Cross-Investigation Comparability Safeguards (`COMP`)

---

### `FIXTURE-COMP-001`: Liquid Droplet vs Solid Fabric Burning Incompatibility
* **Fixture ID**: `FIXTURE-COMP-001`
* **Name**: Cross-Phase Burning Rate Comparison
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Rejects queries attempting to compare liquid droplet burning rate constants ($\text{mm}^2\text{/s}$) with solid fabric flame spread rates ($\text{mm/s}$).
* **Target Tests**: `TEST-I01`
* **Target Requirements**: `REQ-INGEST-39`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Comparing liquid droplet kinetics with solid fabric spread.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "source_a": {"fuel_phase": "liquid_droplet", "metric": "burning_rate_constant_K_mm2_s"},
    "source_b": {"fuel_phase": "solid_fabric", "metric": "flame_spread_rate_mm_s"},
    "attempted_comparison": "equivalence"
  }
  ```
* **Preconditions**: Cross-investigation comparison engine active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_CROSS_PHASE_COMBUSTION_INCOMPARABLE`
* **Preservation Rules**: Comparison blocked; physics incompatibility explanation returned.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COMP-002`: Thin Film vs Thick Rod Regimes ($Bi \ll 1$ vs $Bi \gg 1$)
* **Fixture ID**: `FIXTURE-COMP-002`
* **Name**: Biot Number Regime Comparison
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Blocks unscaled comparisons between thermally thin PMMA films and thermally thick PMMA rods.
* **Target Tests**: `TEST-I02`
* **Target Requirements**: `REQ-INGEST-24`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Comparing thin film flammability limits with thick rod extinction.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "sample_a": {"material": "PMMA", "biot_number": 0.05, "geometry": "thin_film"},
    "sample_b": {"material": "PMMA", "biot_number": 4.2, "geometry": "thick_cylinder"},
    "attempted_comparison": "direct_extinction_boundary"
  }
  ```
* **Preconditions**: Solid combustion scaling engine active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_BIOT_REGIME_INCOMPARABLE`
* **Preservation Rules**: Comparison blocked.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COMP-003`: Quiescent Radiative vs Convective Blowoff Extinction
* **Fixture ID**: `FIXTURE-COMP-003`
* **Name**: Quiescent vs Forced Flow Extinction Comparison
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents quiescent droplet extinction boundaries ($Pe \ll 1$) from being used to predict convective blowoff extinction ($Pe \gg 1$).
* **Target Tests**: `TEST-I03`
* **Target Requirements**: `REQ-INGEST-40`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Comparing quiescent radiative extinction with convective blowoff.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "regime_a": "quiescent_radiative_quenching",
    "regime_b": "forced_convective_blowoff_extinction",
    "attempted_extrapolation": "predict_extinction_velocity"
  }
  ```
* **Preconditions**: Extinction mechanics validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_TRANSPORT_EXTINCTION_INCOMPARABLE`
* **Preservation Rules**: Extrapolation blocked.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COMP-004`: Sample Scale Extrapolation Disparity ($10\text{ cm}$ vs $100\text{ cm}$)
* **Fixture ID**: `FIXTURE-COMP-004`
* **Name**: Small Card to Vehicle Scale Extrapolation
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Blocks extrapolating small-scale flammability card results ($10\text{ cm}$) directly to vehicle-scale fires ($100\text{ cm}$) without macro scaling models.
* **Target Tests**: `TEST-I04`
* **Target Requirements**: `REQ-INGEST-41`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Linear extrapolation of card burn to macro scale.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "source_scale_cm": 10.0,
    "target_scale_cm": 100.0,
    "scaling_model_provided": false
  }
  ```
* **Preconditions**: Macro-scale scaling module active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_SCALE_EXTRAPOLATION_WITHOUT_MODEL`
* **Preservation Rules**: Direct extrapolation prohibited.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COMP-005`: Charring (Cotton) vs Depolymerizing (PMMA) Fuels
* **Fixture ID**: `FIXTURE-COMP-005`
* **Name**: Pyrolysis Chemistry Incompatibility
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents comparing cellulosic charring fuels (Cotton/SIBAL) directly with thermoplastic depolymerizing fuels (PMMA).
* **Target Tests**: `TEST-I05`
* **Target Requirements**: `REQ-INGEST-42`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Direct substitution of cotton flammability limits for PMMA.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "fuel_a": {"name": "cotton_cellulose", "pyrolysis_mode": "charring_and_smoldering"},
    "fuel_b": {"name": "PMMA", "pyrolysis_mode": "thermoplastic_depolymerization"},
    "attempted_substitution": "direct_loi_equivalence"
  }
  ```
* **Preconditions**: Pyrolysis chemistry validator active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_PYROLYSIS_CHEMISTRY_INCOMPATIBLE`
* **Preservation Rules**: Substitution blocked.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: `DEC-05`
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

### `FIXTURE-COMP-006`: Atmospheric Pressure Composition Conflation
* **Fixture ID**: `FIXTURE-COMP-006`
* **Name**: Exploration Atmosphere to Standard Cabin Normalization
* **Category**: `COMPARABILITY`
* **Synthetic Label**: `SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`
* **Purpose**: Prevents comparing Exploration Atmosphere flammability metrics with standard cabin metrics without ambient oxygen partial pressure normalization.
* **Target Tests**: `TEST-I06`
* **Target Requirements**: `REQ-INGEST-20`
* **Input Format**: JSON
* **Base Fixture**: `FIXTURE-PROV-001`
* **Mutation Description**: Comparing $56\text{ kPa}, 34\%$ directly with $101.3\text{ kPa}, 21\%$.
* **Synthetic Payload**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "synthetic_designation": "SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS",
    "is_synthetic": true,
    "empirical_eligibility": "NEVER_ELIGIBLE",
    "condition_a": {"P_kpa": 56.0, "O2_pct": 34.0, "P_O2_kpa": 19.04},
    "condition_b": {"P_kpa": 101.3, "O2_pct": 21.0, "P_O2_kpa": 21.27},
    "attempted_comparison": "direct_spread_rate_equivalence"
  }
  ```
* **Preconditions**: Partial pressure normalization module active.
* **Expected Disposition**: `REJECT`
* **Expected Reason Code**: `ERR_OXYGEN_PARTIAL_PRESSURE_INCOMPATIBLE`
* **Preservation Rules**: Comparison blocked.
* **Empirical Eligibility**: `NEVER_ELIGIBLE`
* **Open Decisions**: None
* **Implementation Status**: `DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED`

---

## 11. Fixture Inventory Summary

* **Total Designed Fixtures**: **60** deterministic synthetic fixtures.
* **Positive Controls & Progressions**: **15** fixtures (valid baseline payloads, sanitized sentinels, transcoded encodings, unverified staging, evidence gap responses).
* **Negative Rejections**: **35** fixtures (fatal structural, provenance, physical, cross-fuel, cross-regime, and synthetic-production rejection).
* **Quarantine Fixtures**: **6** fixtures (ambiguous units, uncalibrated instruments, unannotated cells, contradicted claims).
* **Review Required Fixtures**: **4** fixtures (unresolved citations, derivation calculation discrepancies, thickness conflict).
* **Empirical Eligibility**: **100% barred (`NEVER_ELIGIBLE`)** from production flight evidence indices.
