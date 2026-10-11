# Scientific Data Ingestion Test Case Catalog
**Phase**: 0.96 — Scientific Data Ingestion Test Specification  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Test Engineering Lead  
**Date**: October 11, 2026  
**Status**: Authoritative Test Catalog (*Pre-event documentation only — specification of future behavior, not implemented code*)  

---

## 1. Catalog Overview & Invariant Conventions

This catalog defines deterministic test cases across all nine test families established in [`docs/phase096_ingestion_test_specification.md`](phase096_ingestion_test_specification.md).

### Mandatory Conventions:
1. **Explicit Synthetic Labeling**: All input blocks are explicitly marked:  
   `/* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */`  
   No synthetic input may be presented as genuine flight data.
2. **Deterministic Outcomes**: Each test case specifies an exact expected disposition (`ACCEPT`, `REJECT`, `QUARANTINE`, `REQUIRE_REVIEW`), an explicit failure severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), and the corresponding system action.
3. **Open Design Decisions**: Where an outcome depends on an unfinalized schema decision (e.g. proposed `ScientificValue<T>` nullability), it is explicitly marked `OPEN — SCHEMA DECISION REQUIRED`.

---

## 2. Test Family A: Provenance and Source Identity

### `TEST-A01`: Valid Source Identity & Location Linkage
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Incoming measurement record references an authoritative investigation, a valid DOI, a specific flight run ID, and an exact table row.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-98",
    "doi": "10.1016/j.combustflame.2018.10.012",
    "source_artifact": "Urban_et_al_2019_Table_1",
    "source_location": "Row_1_Sample_S1",
    "run_id": "PSI98-RUN-S1",
    "parameter": "concurrent_air_flow_velocity",
    "raw_value": 20.0,
    "raw_unit": "cm/s"
  }
  ```
* **Preconditions**: Investigation `PSI-98` exists in Master Source Register; DOI resolves to verified paper; table and row coordinates are identified.
* **Expected Outcome**: Record passes Gate 1 (Source Verification) and Gate 6 (Provenance Completeness). Ingestion engine persists record and assigns `verification_level: VERIFIED_EMPIRICAL`.
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `CRITICAL` (if rejected improperly)
* **Rationale**: Validated empirical literature records must successfully enter the system without data loss.
* **Related Entity**: `AuditProvenance`, `MeasurementRecord`
* **Related Source / Claim**: Urban et al. (2019); `SAFFIRE-003`; `SAFFIRE-PARAM-03`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A02`: Missing Source Provenance Rejection
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Incoming measurement contains a plausible numerical value but lacks an investigation identifier, DOI, and archive reference.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": null,
    "doi": null,
    "parameter": "flame_spread_rate",
    "raw_value": 2.45,
    "raw_unit": "mm/s"
  }
  ```
* **Preconditions**: Ingestion pipeline validation gate active.
* **Expected Outcome**: Gate 1 fails. Record is blocked from database write; error logged: `ERR_PROVENANCE_MISSING: Record lacks traceable source origin`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Groundless values destroy scientific auditability. No orphaned numbers may enter FIRELINE.
* **Related Entity**: `AuditProvenance`
* **Related Source / Claim**: General Ingestion Rule Gate 1
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A03`: Repository Landing Page Mistaken for Raw Measurement
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Record cites only the top-level NASA PSI URL (`https://psi.nasa.gov/...`) while claiming the measurement represents an inspected raw sensor stream.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-69",
    "source_url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
    "source_location": "Landing_Page_Overview",
    "claimed_inspection_level": "Contents Inspected",
    "parameter": "raw_radiometer_voltage",
    "raw_value": 4.12,
    "raw_unit": "V"
  }
  ```
* **Preconditions**: Portal inspection audit establishes that landing page displays metadata only, not sensor channels.
* **Expected Outcome**: Pipeline detects inspection level mismatch. Reclassifies status to `Metadata Inspected Only` and assigns disposition `QUARANTINE`.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: An investigation landing page does not contain raw transducer streams.
* **Related Entity**: `AuditProvenance`, `MeasurementRecord`
* **Related Source / Claim**: `PSI69-ART-001`; Phase 0.95 Source Inspection
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A04`: Publication-to-Dataset Fuel Mismatch Isolation
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Pipeline attempts to bind an $n$-heptane burning rate constant from Dietrich (2017) to a Methanol flight run from the PSI-69 table (`20CAL08`).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "flight_table_run_id": "PSI69-20CAL08",
    "flight_table_fuel": "Methanol",
    "paper_doi": "10.1016/j.combustflame.2017.04.050",
    "paper_fuel": "n-heptane",
    "parameter": "burning_rate_constant_K",
    "raw_value": 0.74,
    "raw_unit": "mm^2/s"
  }
  ```
* **Preconditions**: Ingestion engine cross-references chemical fuel identity between source table and paper table.
* **Expected Outcome**: Fuel mismatch detected (`Methanol` $\ne$ `n-heptane`). Automatic binding is halted; record flagged: `ERR_FUEL_MISMATCH_PROVENANCE`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents cross-fuel kinetic conflation within multi-run investigations.
* **Related Entity**: `ExperimentalRun`, `FuelSpec`, `MeasurementRecord`
* **Related Source / Claim**: Dietrich et al. (2017); `PSI69-ART-002`; `FLEX-PARAM-03`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A05`: Duplicate Record Ingestion Protection
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: The exact same flight run record is ingested twice via different batch files.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "run_id": "PSI98-RUN-S1",
    "doi": "10.1016/j.combustflame.2018.10.012",
    "parameter": "sample_length",
    "raw_value": 40.6,
    "raw_unit": "cm"
  }
  ```
* **Preconditions**: Record with matching `(run_id, parameter)` already exists in staging store.
* **Expected Outcome**: Idempotent deduplication triggered. Ingestion engine updates audit timestamp without creating duplicate rows or altering record count.
* **Expected Disposition**: `ACCEPT` (with duplicate warning logged)
* **Failure Severity**: `MEDIUM`
* **Rationale**: Re-running ingestion jobs must not artificially duplicate empirical evidence counts.
* **Related Entity**: `AuditProvenance`, `ExperimentalRun`
* **Related Source / Claim**: General Ingestion Rule Gate 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A06`: Broken Table Coordinate Lineage
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Record references a table row (`Row 10`) in a 5-row table (e.g. Saffire-I PSI-98).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-98",
    "source_artifact": "PSI-98_Experimental_Table",
    "source_location": "Row_10",
    "parameter": "oxygen_percentage",
    "raw_value": 21.5
  }
  ```
* **Preconditions**: Target table has verified size of 5 records.
* **Expected Outcome**: Coordinate boundary violation trapped. Ingestion engine flags: `ERR_COORDINATE_OUT_OF_BOUNDS: Row 10 does not exist in 5-row table`.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: Protects against stale or corrupt table extraction mappings.
* **Related Entity**: `AuditProvenance`
* **Related Source / Claim**: `PSI98-ART-002`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-A07`: Unverified Paper Citation Isolation
* **Category**: Family A — Provenance and Source Identity
* **Scenario**: Record cites an unindexed conference abstract or informal slide presentation.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-104",
    "citation": "Informal Slide Presentation 2021",
    "doi": null,
    "parameter": "critical_heat_flux",
    "raw_value": 15.0,
    "raw_unit": "kW/m^2"
  }
  ```
* **Preconditions**: Citation is unverified in Master Source Register.
* **Expected Outcome**: Record is flagged `UNVERIFIED_SOURCE`. Barred from production evidence search; retained in staging for research tracking only.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: Prevents grey literature and informal presentations from masquerading as peer-reviewed flight evidence.
* **Related Entity**: `AuditProvenance`, `EmpiricalFinding`
* **Related Source / Claim**: `PSI-104` SoFIE-MIST Task Book status
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 3. Test Family B: Missingness and Nullability

### `TEST-B01`: Genuinely Missing Sensor Measurement
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Flight run log records pressure and temperature but radiometer sensor channel was offline or unmeasured.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "run_id": "SYNTH-RUN-01",
    "pressure_kpa": 101.3,
    "radiometer_flux_kw_m2": null
  }
  ```
* **Preconditions**: Proposed schema permits nullable measurement fields.
* **Expected Outcome**: Ingestion engine persists `radiometer_flux_kw_m2: null`. **Zero is never substituted.**
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `CRITICAL` (if zero is substituted)
* **Rationale**: Imputing zero for unmeasured radiative flux falsely claims zero heat loss, invalidating extinction physics.
* **Related Entity**: `MeasurementRecord`, `ScientificValue<T>`
* **Related Source / Claim**: Mapping Principle 3 (Missingness Integrity)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B02`: Empty Table Cell Parsed as Explicit Null
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Flow visualization row in Saffire-I experimental table contains empty string `""` for numerical fields.
* **Synthetic Input**:
  ```csv
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Sample Number,Material,Sample Thickness (cm),Air Flow (cm/s),Percent O2
  F1C1/F1C2,Pre-test flow visulation data for sample 1,,,
  ```
* **Preconditions**: CSV parser ingests row with blank delimiters `,,`.
* **Expected Outcome**: Parser converts empty strings to explicit `null`. Fields are stored as `null`, not `0.0`, not `NaN`, and not string `""`.
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `HIGH`
* **Rationale**: Empty table cells represent missing or inapplicable telemetry, never zero airflow or zero oxygen.
* **Related Entity**: `EnvironmentalConditions`, `FuelSpec`
* **Related Source / Claim**: `PSI98-ART-002` (Records 3 & 4)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B03`: Quiescent Flow Nullability Acceptance
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Ingesting a microgravity quiescent droplet experiment (FLEX) where forced flow velocity is physically inapplicable.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-69",
    "run_id": "PSI69-20CAL08",
    "transport_regime": "quiescent_diffusion",
    "flow_velocity_cm_s": null
  }
  ```
* **Preconditions**: Schema supports nullable flow velocity for quiescent regimes.
* **Expected Outcome**: Ingestion accepts record with `flow_velocity_cm_s: null`. Note: Canonical schema currently defines `flow_velocity_cm_s: number` (non-nullable), so this test validates the proposed schema extension.
* **Expected Disposition**: `ACCEPT` (under proposed schema) / `OPEN — SCHEMA DECISION REQUIRED` (canonical)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Quiescent droplet burning has no forced convection; forcing a number causes pipeline corruption.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: `GAP-05`; `FLEX-PARAM-04`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B04`: Zero-Like Sentinel Value Trap
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Legacy tabular feed uses `-999.0` or `"N/A"` to designate missing transducer values.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "run_id": "SYNTH-RUN-02",
    "chamber_pressure": -999.0,
    "temperature": "N/A"
  }
  ```
* **Preconditions**: Ingestion sanitizer rules configured.
* **Expected Outcome**: Ingestion pre-processor intercepts `-999.0` and `"N/A"`, converting both to `null` while emitting a sanitizer warning: `WARN_SENTINEL_TRAPPED`.
* **Expected Disposition**: `ACCEPT` (with sanitized fields)
* **Failure Severity**: `HIGH`
* **Rationale**: Untrapped sentinel values corrupt distance metrics and produce physically impossible negative pressures.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Ingestion Gate 8 (Missingness Integrity)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B05`: Missing Mandatory Environmental Condition
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Incoming solid flammability record lacks ambient oxygen concentration ($X_{O_2}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-25",
    "run_id": "SYNTH-BASS-01",
    "pressure_kpa": 101.3,
    "oxygen_concentration_pct": null,
    "flame_spread_rate_mm_s": 0.45
  }
  ```
* **Preconditions**: Flammability boundary classifier requires pressure and oxygen.
* **Expected Outcome**: Ingestion engine admits record for basic storage but marks it `STATUS_INCOMPLETE_CONDITIONS` and bars it from flammability boundary indexing.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: Flame spread cannot be evaluated without knowing if the atmosphere was air ($21\%$) or suppressed ($15\%$).
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: Gate 5 (Scientific Context)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B06`: Unreported Measurement Uncertainty
* **Category**: Family B — Missingness and Nullability
* **Scenario**: Paper reports burning rate constant $K = 0.74\text{ mm}^2\text{/s}$ without providing standard deviation or error bounds.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "parameter": "burning_rate_constant_K",
    "raw_value": 0.74,
    "raw_unit": "mm^2/s",
    "uncertainty": null
  }
  ```
* **Preconditions**: Schema `ScientificValue<T>` supports optional uncertainty.
* **Expected Outcome**: Ingestion sets `uncertainty: null`. **Pipeline does not invent a default $\pm 5\%$ or assume zero error.**
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `MEDIUM`
* **Rationale**: Inventing uncertainty bounds misleads decision support systems about experimental precision.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Dietrich et al. (2017); `GAP-03`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-B07`: Unacquired Raw File Invariant
* **Category**: Family B — Missingness and Nullability
* **Scenario**: System metadata lists 860 GB FLEX archive, but local file storage has not downloaded the bundle.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "artifact_id": "PSI69-ART-003",
    "local_path": "data/raw/psi/flex/droplet_videos_run1.zip",
    "download_status": "NOT_DOWNLOADED"
  }
  ```
* **Preconditions**: Staging directory contains `README.md` only.
* **Expected Outcome**: Ingestion parser refuses to execute file read; marks asset `BLOCKED_AWAITING_ACQUISITION`. Does not create empty mock records.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Unacquired data must remain explicitly missing; cannot be simulated.
* **Related Entity**: `AuditProvenance`
* **Related Source / Claim**: `data/raw/psi/flex/README.md`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 4. Test Family C: Units and Scientific Value Integrity

### `TEST-C01`: Valid Dual-Unit Representation (mmHg to kPa)
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: PSI-69 experimental table reports ambient pressure in `mmHg`. Pipeline normalizes to SI `kPa` while preserving original unit.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_value": 760.0,
    "raw_unit": "mmHg"
  }
  ```
* **Preconditions**: Conversion factor defined: $1\text{ mmHg} = 0.1333223684\text{ kPa}$.
* **Expected Outcome**: Record stored with:
  `raw_value: 760.0`, `raw_unit: "mmHg"`, `normalized_value: 101.325`, `normalized_unit: "kPa"`.
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Dual-unit preservation ensures both original source auditing and standardized cross-investigation queries.
* **Related Entity**: `ScientificValue<number>`, `EnvironmentalConditions`
* **Related Source / Claim**: `PSI69-ART-002`; Mapping Principle 2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C02`: Unit-Label Conflict Trapping
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Incoming data file supplies pressure value of `14.7` (clearly $psia$) under a column header labeled `kPa`.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "column_header": "pressure_kpa",
    "raw_value": 14.7,
    "metadata_context": "nominal spacecraft atmospheric cabin pressure"
  }
  ```
* **Preconditions**: Physical range validator active ($14.7\text{ kPa}$ would be deep hypobaric near-vacuum, incompatible with nominal cabin).
* **Expected Outcome**: Physical range validator triggers conflict warning: `ERR_UNIT_LABEL_CONFLICT: Value 14.7 kPa is physically inconsistent with nominal cabin pressure`. Ingestion halts automatic normalization; assigns `REQUIRE_REVIEW`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents catastrophically erroneous pressure inputs from entering flammability limits.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: Phase 0.5 Saffire pressure review ($70.3$ vs $101.3$)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C03`: Unsupported Unit Conversion Handling
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Table provides an uncalibrated instrument index, such as BASS-II `Fan display: 62`.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "parameter": "fan_blower_setting",
    "raw_value": 62,
    "raw_unit": "display_units_uncalibrated"
  }
  ```
* **Preconditions**: Calibration curve from fan display to $\text{cm/s}$ is not yet staged in the local repository.
* **Expected Outcome**: Ingestion stores `raw_value: 62`, `raw_unit: "display_units_uncalibrated"`, `normalized_value: null`, `normalized_unit: null`. Flagged: `WARN_NORMALIZATION_BLOCKED_AWAITING_CALIBRATION`.
* **Expected Disposition**: `ACCEPT` (for raw storage) / `QUARANTINE` (for velocity queries)
* **Failure Severity**: `HIGH`
* **Rationale**: Forbids inventing an arbitrary conversion factor ($62 \rightarrow 6.2\text{ cm/s}$) without physical calibration curves.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: `PSI25-ART-002`; `BLK-05`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C04`: Naked Number Lacking Unit
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Incoming measurement has a numerical value but source field and header lack any unit specification.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "parameter": "extinction_diameter",
    "raw_value": 0.85,
    "raw_unit": null
  }
  ```
* **Preconditions**: Unit preservation validator active.
* **Expected Outcome**: Ingestion rejects record from empirical evidence engine: `ERR_MISSING_UNIT: Numerical measurement lacks physical unit`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: A number without a unit is not a scientific measurement. It cannot be converted to SI or compared safely.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Mapping Principle 2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C05`: Precision Inflation Guard
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Saffire-I paper reports concurrent flame spread rate as approximately `2.4 mm/s`. An overzealous serializer stores it as `2.40000000000 m/s`.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "source_text": "~ 2.4 mm/s",
    "raw_value": 2.4,
    "raw_unit": "mm/s",
    "is_approximate": true
  }
  ```
* **Preconditions**: Scientific value contract records precision and approximation metadata.
* **Expected Outcome**: Record preserves `is_approximate: true`, `significant_digits: 2`. Serializer prevents displaying trailing zeroes beyond source measurement precision.
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `MEDIUM`
* **Rationale**: Artificially inflating decimal precision falsely claims optical measurement accuracy that flight cameras did not achieve.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Urban et al. (2019); `SAFFIRE-PARAM-04`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C06`: Ambiguous Uncertainty Convention
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: A table provides an uncertainty figure `± 0.15` without documenting whether it represents standard deviation ($1\sigma$), 95% confidence interval ($2\sigma$), or instrument tolerance.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_value": 2.4,
    "raw_unit": "mm/s",
    "uncertainty": 0.15,
    "uncertainty_type": null
  }
  ```
* **Preconditions**: Ingestion engine checks uncertainty specification.
* **Expected Outcome**: Record is ingested with `uncertainty: 0.15`, but `uncertainty_type: "unspecified"`. Warning emitted: `WARN_UNCERTAINTY_TYPE_AMBIGUOUS`.
* **Expected Disposition**: `ACCEPT` (with warning)
* **Failure Severity**: `LOW`
* **Rationale**: Captures reported uncertainty while flagging the need for methodological clarification in research notes.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Phase 0.9 Contract Proposal Section 4.1
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C07`: Normalization Math Tampering Trapping
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: An incoming record provides `raw_value: 10.0`, `raw_unit: "cm/s"`, but someone manually set `normalized_value: 0.25` instead of `0.10` ($m/s$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_value": 10.0,
    "raw_unit": "cm/s",
    "normalized_value": 0.25,
    "normalized_unit": "m/s"
  }
  ```
* **Preconditions**: Automated unit conversion validation active.
* **Expected Outcome**: Math check fails ($10.0\text{ cm/s} \ne 0.25\text{ m/s}$). Ingestion rejects record: `ERR_NORMALIZATION_MATH_INCONSISTENT: Expected 0.10 m/s, received 0.25 m/s`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Protects database against corrupted or manually tampered normalized columns.
* **Related Entity**: `ScientificValue<T>`
* **Related Source / Claim**: Mapping Principle 2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C08`: Oxygen Basis Ambiguity Guard
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Source table reports oxygen concentration as `"21.5 - 21.7"` without specifying whether it is mole fraction percentage or mass fraction percentage.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_string": "21.5 - 21.7",
    "column_header": "Percent O2"
  }
  ```
* **Preconditions**: Ingestion parser evaluates atmospheric composition fields.
* **Expected Outcome**: Ingestion retains raw string `"21.5 - 21.7"` in `raw_value`. Normalized value is marked `basis: "volume_mole_percent_assumed_review_required"`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `MEDIUM`
* **Rationale**: In spacecraft life support and fire safety, mole fraction and mass fraction differ slightly ($O_2$ MW $32$ vs. $N_2$ MW $28$). Basis must be established before chemical equilibrium modeling.
* **Related Entity**: `EnvironmentalConditions`, `ScientificValue<T>`
* **Related Source / Claim**: `PSI98-ART-002`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-C09`: Gauge vs. Absolute Pressure Indeterminacy
* **Category**: Family C — Units and Scientific Value Integrity
* **Scenario**: Source reports `pressure: 14.7` with unit `"psi"`, without stating whether it is absolute ($psia$) or gauge ($psig$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_value": 14.7,
    "raw_unit": "psi"
  }
  ```
* **Preconditions**: Barometric reference validator active.
* **Expected Outcome**: Ingestion flags pressure reference indeterminacy: `WARN_PRESSURE_REFERENCE_UNSPECIFIED`. Halts automated normalization until barometric context is confirmed.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `HIGH`
* **Rationale**: Treating $14.7\text{ psig}$ as $14.7\text{ psia}$ would produce a $2\times$ pressure error ($202\text{ kPa}$ vs. $101\text{ kPa}$).
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: Mapping Principle 2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 5. Test Family D: Experimental Conditions and Record Identity

### `TEST-D01`: Flow Direction Transport Partitioning
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: System queries flammability for concurrent flow ($+10\text{ cm/s}$), but ingestion engine attempts to return an opposed-flow record ($-10\text{ cm/s}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_flow_direction": "concurrent",
    "candidate_record_flow_direction": "opposed",
    "velocity_magnitude_cm_s": 10.0
  }
  ```
* **Preconditions**: Evidence retrieval filter evaluates flow direction.
* **Expected Outcome**: Ingestion classifier rejects equivalence. Opposed flow cannot satisfy concurrent query: `ERR_FLOW_DIRECTION_MISMATCH`.
* **Expected Disposition**: `REJECT` (for direct match) / `EVIDENCE_GAP` (if no concurrent data exists)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Concurrent flames spread downstream with boundary layer heating; opposed flames spread upstream against flow. Physics and spread rates differ by orders of magnitude.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: `Cross-Investigation-Analysis.md` Section 3.2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-D02`: Gravity Regime Partitioning
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: Terrestrial normal-gravity burn data ($1g$) is presented as microgravity flight evidence ($\mu g$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "gravity_level_g": 1.0,
    "claimed_environment": "microgravity"
  }
  ```
* **Preconditions**: Gravity level validation active.
* **Expected Outcome**: Ingestion traps gravity contradiction ($1.0g \ne 10^{-6}g$): `ERR_GRAVITY_LEVEL_CONTRADICTION`. Rejects record from microgravity evidence index.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Terrestrial flames exhibit buoyant convection ($Gr \gg 1$), completely masking low-speed microgravity extinction limits.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: Phase 0.8 Claim `CROSS-001`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-D03`: Atmospheric Pressure Regime Partitioning
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: Standard cabin atmosphere ($101.3\text{ kPa}$, $21\%\ O_2$) data is queried for an Exploration Atmosphere mission profile ($56\text{ kPa}$, $34\%\ O_2$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "mission_profile_pressure_kpa": 56.0,
    "mission_profile_oxygen_pct": 34.0,
    "candidate_record_pressure_kpa": 101.3,
    "candidate_record_oxygen_pct": 21.0
  }
  ```
* **Preconditions**: 4-tier Gated Rule Classifier evaluates environmental boundary conditions.
* **Expected Outcome**: Classifier blocks `SUPPORTED` classification. Flags pressure/oxygen boundary mismatch; outputs `EVIDENCE_GAP` or `INFERRED` with scaling caveat.
* **Expected Disposition**: `ACCEPT` (with `EVIDENCE_GAP` classification)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents treating standard atmosphere ground rules as validated exploration atmosphere evidence.
* **Related Entity**: `EnvironmentalConditions`, `EvidenceChain`
* **Related Source / Claim**: Phase 0.8 Claim `CROSS-005`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-D04`: Cylindrical Fuel Radius Dimension Mismatch
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: An experimental record for a $6.35\text{ mm}$ PMMA rod is queried to validate flammability of a $12.7\text{ mm}$ rod.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_rod_radius_mm": 12.7,
    "candidate_rod_radius_mm": 6.35
  }
  ```
* **Preconditions**: Fuel geometry validator active.
* **Expected Outcome**: Ingestion engine prevents direct numerical equivalence without a thermal Biot scaling correction: `WARN_SPECIMEN_DIMENSION_MISMATCH`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `HIGH`
* **Rationale**: Doubling solid fuel radius alters regression rate and surface heat loss balances.
* **Related Entity**: `FuelSpec`
* **Related Source / Claim**: Olson & Ferkul (2017); `BASS-PARAM-01`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-D05`: Missing Critical Transport Boundary Condition
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: Record reports a burning rate but completely omits ambient pressure and ambient temperature.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "run_id": "SYNTH-RUN-03",
    "burning_rate": 0.82,
    "pressure_kpa": null,
    "ambient_temp_k": null
  }
  ```
* **Preconditions**: Ingestion Gate 5 (Scientific Context) active.
* **Expected Outcome**: Ingestion quarantines record from classifier index: `ERR_INCOMPLETE_BOUNDARY_CONDITIONS`.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: Burning kinetics cannot be physically interpreted without knowing ambient pressure and temperature.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: Ingestion Gate 5
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-D06`: Apparatus Confinement Artifact Flagging
* **Category**: Family D — Experimental Conditions and Record Identity
* **Scenario**: Solid fuel sample burns with flame touching duct glass walls.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "sample_width_cm": 2.0,
    "duct_width_cm": 2.5,
    "wall_interaction_noted": true
  }
  ```
* **Preconditions**: Ingestion metadata records boundary interaction flags.
* **Expected Outcome**: Ingestion flags record with `CONFINED_FLOW_ARTIFACT`. Prevents treating flammability boundary as an unconfined open-space property.
* **Expected Disposition**: `ACCEPT` (with boundary caveat flag)
* **Failure Severity**: `MEDIUM`
* **Rationale**: Wall quenching and boundary layer velocity profiles alter apparent flammability limits.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: `BASS-II-Research-Notes.md` Section 3
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 6. Test Family E: Investigation-Specific Safeguards

### `TEST-E01`: FLEX Summary Table vs. Droplet Time-Series Isolation
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: Ingestion script attempts to parse row 1 of the 275-row PSI-69 operational table as a time-series array of droplet diameter measurements ($d^2(t)$).
* **Synthetic Input**:
  ```csv
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  FLEX Test #,FLEX Identifier,Test Date,Test GMT,Fuel,Ambient pressure; mmHg
  1,20CAL08,3/5/2009,17:22:03,Methanol,757.7
  ```
* **Preconditions**: Ingestion schema validates data structure types (scalar run summary vs. multi-point time series).
* **Expected Outcome**: Ingestion rejects mapping summary table row to `droplet_diameter_time_series`: `ERR_SCHEMA_TYPE_MISMATCH: Scalar operational table row cannot populate time-series array`.
* **Expected Disposition**: `REJECT` (for time-series entity) / `ACCEPT` (for `ExperimentalRun` entity)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents confusing a single test metadata summary with a 500-point camera measurement time-series.
* **Related Entity**: `MeasurementRecord`, `ExperimentalRun`
* **Related Source / Claim**: `PSI69-ART-002`; `FLEX-PARAM-02`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-E02`: FLEX Droplet Multi-Fuel Kinetic Segregation
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: An extinction diameter finding derived from $n$-heptane droplets is queried for a Methanol fire safety assessment.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_fuel": "Methanol",
    "empirical_finding_fuel": "n-heptane",
    "extinction_diameter_mm": 0.8
  }
  ```
* **Preconditions**: Master fuel dictionary active.
* **Expected Outcome**: Classifier blocks direct equivalence: `ERR_FUEL_SUBSTITUTION_FORBIDDEN: Methanol burning kinetics differ fundamentally from n-heptane (water absorption vs. pure alkane)`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Methanol droplets absorb ambient water vapor during combustion, altering extinction kinetics completely compared to pure alkanes.
* **Related Entity**: `FuelSpec`, `EmpiricalFinding`
* **Related Source / Claim**: Hicks et al. (2011); `FLEX-PARAM-01`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-E03`: BASS-II Thin Film vs. Thick Rod Segregation
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: Bhattacharjee thin PMMA film test record (`Test B1`, $100\ \mu\text{m}$) is submitted to fulfill an Olson & Ferkul PMMA cylindrical rod flammability contract.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "source_table_pi": "Bhattacharjee",
    "sample_material_raw": "100 micron PMMA film 2 cm wide",
    "target_entity": "BASS_II_PMMA_Rod_Flammability"
  }
  ```
* **Preconditions**: Geometry classifier active.
* **Expected Outcome**: Geometry mismatch trapped (`thermally_thin_film` $\ne$ `thermally_thick_cylinder`). Pipeline assigns `REJECT`: `ERR_GEOMETRY_CONFLATION: Thin film data cannot satisfy thick rod flammability contract`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents fatal physical geometry conflation identified in Phase 0.95 audit.
* **Related Entity**: `FuelSpec`, `FuelGeometry`
* **Related Source / Claim**: `PSI25-ART-002`; Olson & Ferkul (2017)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-E04`: BASS-II Fan Display Calibration Guard
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: Ingestion script automatically divides `Fan display: 62` by 10 and stores `flow_velocity_cm_s: 6.2`.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "raw_fan_display": 62,
    "automated_velocity_proposal": 6.2
  }
  ```
* **Preconditions**: Calibration enforcement active; no approved calibration curve present.
* **Expected Outcome**: Uncalibrated conversion trapped: `ERR_UNGROUNDED_NORMALIZATION: Fan display index requires verified calibration curve to yield velocity in cm/s`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `HIGH`
* **Rationale**: Fan display is a nonlinear instrument setting, not a direct velocity sensor reading.
* **Related Entity**: `EnvironmentalConditions`
* **Related Source / Claim**: `BLK-05`; `BASS-PARAM-02`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-E05`: Saffire-I Specimen Thickness Reconciliation Guard
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: Incoming Saffire-I record contains `Sample Thickness (cm): 0.37` from the PSI-98 table, while system expects $0.4\text{ mm}$ ($0.04\text{ cm}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "investigation_code": "PSI-98",
    "table_thickness_raw": 0.37,
    "table_thickness_unit": "cm",
    "literature_thickness_ref": 0.04,
    "literature_thickness_unit": "cm"
  }
  ```
* **Preconditions**: Critical source ambiguity reconciliation rule active.
* **Expected Outcome**: Pipeline flags specimen thickness conflict ($0.37\text{ cm}$ vs. $0.04\text{ cm}$). **Pipeline does NOT perform an unreviewed division by 10.** Record is assigned `REQUIRE_REVIEW` with `STATUS_DISCREPANCY_FLAG`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents silently resolving a near $10\times$ thickness discrepancy without primary source evidence.
* **Related Entity**: `FuelSpec`
* **Related Source / Claim**: `PSI98-ART-002`; Section 2.1 of Specification
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-E06`: Saffire-I Initial Conditions vs. Dynamic Spread Rate
* **Category**: Family E — Investigation-Specific Safeguards
* **Scenario**: Ingestion attempts to populate measured flame spread rate ($2.4\text{ mm/s}$) exclusively from the 5-row Saffire-I table (`PSI98-ART-002`).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "source_artifact": "PSI98-ART-002",
    "target_field": "MeasurementRecord.flame_spread_rate_mm_s"
  }
  ```
* **Preconditions**: Schema validates that `PSI98-ART-002` contains only initial conditions (`Air Flow`, `Thickness`, `Ignition Power`).
* **Expected Outcome**: Ingestion halts: `ERR_FIELD_NOT_IN_SOURCE: Dynamic flame spread rate is not present in PSI98-ART-002 table`. Directs pipeline to ingest from Urban et al. (2019) with literature provenance.
* **Expected Disposition**: `REJECT` (for table source) / `ACCEPT` (with literature source)
* **Failure Severity**: `HIGH`
* **Rationale**: Maintains strict boundary between initial operational conditions and measured flame spread rates.
* **Related Entity**: `MeasurementRecord`, `EmpiricalFinding`
* **Related Source / Claim**: `PSI98-ART-002`; Urban et al. (2019)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 7. Test Family F: Measured, Derived, and Interpreted Values

### `TEST-F01`: Derived Surface Radiative Flux Formula Transparency
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Ingestion record provides surface radiative heat flux derived from an energy balance equation.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "parameter": "surface_radiative_heat_flux",
    "value": 1.25,
    "unit": "W/cm^2",
    "is_derived_estimate": true,
    "derivation_formula": "q_rad = epsilon * sigma * (T_flame^4 - T_surface^4)",
    "input_channels": ["TC_01", "TC_04"]
  }
  ```
* **Preconditions**: Derived quantity contract requires formula and input channels.
* **Expected Outcome**: Record passes derivation validation: `is_derived_estimate: true` is preserved; stored with mathematical formula metadata.
* **Expected Disposition**: `ACCEPT`
* **Failure Severity**: `HIGH`
* **Rationale**: Derived calculations must be fully reproducible and distinguished from raw sensor telemetry.
* **Related Entity**: `MeasurementRecord`, `ScientificValue<T>`
* **Related Source / Claim**: Olson & Ferkul (2017); `BASS-PARAM-04`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-F02`: Saffire-I Cabin Pressure Rise Derived Estimate Tagging
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Record ingests Saffire-I cabin pressure rise ($\Delta P = 0.5\text{ kPa}$) claiming it is a raw pressure sensor log.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "parameter": "cabin_pressure_rise_delta_P",
    "value": 0.5,
    "unit": "kPa",
    "is_derived_estimate": false,
    "source_type": "sensor_telemetry"
  }
  ```
* **Preconditions**: Audit register classifies Saffire-I pressure rise as `DERIVED_ESTIMATE` (ideal gas thermal expansion estimate).
* **Expected Outcome**: Ingestion traps misclassification: `ERR_DERIVED_LABEL_REQUIRED: Pressure rise is a calculated thermal estimate, not raw telemetry`. Updates flag to `is_derived_estimate: true`.
* **Expected Disposition**: `ACCEPT` (with forced derived estimate flag)
* **Failure Severity**: `HIGH`
* **Rationale**: Prevents treating theoretical bulk heating calculations as verified empirical transducer channels.
* **Related Entity**: `MeasurementRecord`
* **Related Source / Claim**: Phase 0.8 Claim `SAFFIRE-006`; `SAFFIRE-PARAM-06`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-F03`: Theoretical Simulation Extrapolation Guard
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Record from numerical simulation paper (Li et al., 2018) is ingested as a microgravity flight measurement.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "doi": "10.1016/j.proci.2018.05.168",
    "methodology": "computational_fluid_dynamics_simulation",
    "parameter": "predicted_spread_rate",
    "claimed_type": "empirical_flight_measurement"
  }
  ```
* **Preconditions**: Ingestion engine validates experimental vs. computational methodology.
* **Expected Outcome**: Ingestion rejects empirical classification: `ERR_SIMULATION_DATA_CANNOT_BE_EMPIRICAL`. Assigns `NUMERICAL_SIMULATION` metadata tag.
* **Expected Disposition**: `REJECT` (from empirical index) / `ACCEPT` (as model benchmark)
* **Failure Severity**: `CRITICAL`
* **Rationale**: CFD predictions must never be presented as empirical ground truth in a scientific evidence engine.
* **Related Entity**: `EmpiricalFinding`
* **Related Source / Claim**: Li et al. (2018)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-F04`: Missing Input Channels in Derived Calculation
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Record claims to be a derived energy balance quantity but lists no primary input channels or source measurements.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "is_derived_estimate": true,
    "parameter": "conductive_heat_flux",
    "value": 0.85,
    "input_channels": []
  }
  ```
* **Preconditions**: Derived integrity check active.
* **Expected Outcome**: Ingestion flags broken lineage: `ERR_DERIVATION_INPUTS_MISSING`. Quarantines record pending input channel specification.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `HIGH`
* **Rationale**: An ungrounded calculation without documented inputs cannot be scientifically verified.
* **Related Entity**: `MeasurementRecord`
* **Related Source / Claim**: Mapping Principle 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-F05`: Research Proposal Hypothesis Isolation
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Text from the NASA PSI "Hypothesis" section is parsed into the `EmpiricalFinding` table.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "source_section": "Hypothesis",
    "text": "Microgravity conditions fundamentally alter combustion limits...",
    "target_entity": "EmpiricalFinding"
  }
  ```
* **Preconditions**: Entity classifier active.
* **Expected Outcome**: Ingestion traps entity misclassification: `ERR_HYPOTHESIS_CANNOT_BE_FINDING`. Re-routes text to `Investigation.hypothesis_text`.
* **Expected Disposition**: `REJECT` (for `EmpiricalFinding`) / `ACCEPT` (for `Investigation`)
* **Failure Severity**: `HIGH`
* **Rationale**: Hypotheses express unverified propositions, not verified post-flight empirical findings.
* **Related Entity**: `Investigation`, `EmpiricalFinding`
* **Related Source / Claim**: PSI-69 & PSI-25 Proposal Metadata
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-F06`: Irreproducible Derived Calculation Detection
* **Category**: Family F — Measured, Derived, and Interpreted Values
* **Scenario**: Reported burning rate constant $K$ contradicts the reported initial and extinction diameters by $> 25\%$ under standard $d^2$-law math.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "d0_mm": 2.0,
    "d_ext_mm": 0.5,
    "burn_time_s": 5.0,
    "reported_K_mm2_s": 2.5
  }
  ```
* **Preconditions**: Physical consistency validator calculates expected $K_{expected} = (d_0^2 - d_{ext}^2) / t_b = (4.0 - 0.25) / 5.0 = 0.75\text{ mm}^2\text{/s}$.
* **Expected Outcome**: Discrepancy detected ($2.5 \ne 0.75$). Record is assigned `REQUIRE_REVIEW`: `WARN_CALCULATION_DISCREPANCY: Reported K differs from d2-law derivation by 233%`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `HIGH`
* **Rationale**: Traps transcription errors in published or parsed derived values.
* **Related Entity**: `MeasurementRecord`, `EmpiricalFinding`
* **Related Source / Claim**: Dietrich et al. (2017)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 8. Test Family G: Verification and Synthetic-Data Isolation

### `TEST-G01`: Synthetic Fixture Production Leakage Guard
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: A synthetic test fixture (`SYNTH-FIXTURE-01`) is submitted during database migration or evidence search indexing.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "finding_id": "SYNTH-FINDING-01",
    "verification_level": "SYNTHETIC_ILLUSTRATIVE",
    "material": "Cast PMMA",
    "flame_spread_rate": 0.35
  }
  ```
* **Preconditions**: Production search engine filter active.
* **Expected Outcome**: Production indexing pipeline intercepts `SYNTHETIC_ILLUSTRATIVE` tag. Record is completely excluded from search indices and mission decision support APIs.
* **Expected Disposition**: `QUARANTINE` (from production search) / `ACCEPT` (in test fixture DB)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Mock test data must never influence an astronautical fire safety assessment.
* **Related Entity**: `EmpiricalFinding`, `EvidenceChain`
* **Related Source / Claim**: Knowledge Integrity Protocol Rule 1
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-G02`: Structural Validity vs. Empirical Verification Guard
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: A newly parsed JSON record matches all TypeScript interface types, but its literature source has not been audited.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "is_valid_json": true,
    "schema_validation": "PASSED",
    "literature_audit_status": null
  }
  ```
* **Preconditions**: Verification level assigner active.
* **Expected Outcome**: Ingestion assigns `verification_level: PRELIMINARY_UNAUDITED`. **Pipeline does not assign `VERIFIED_EMPIRICAL` based solely on clean schema syntax.**
* **Expected Disposition**: `ACCEPT` (as unaudited)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Syntactic correctness does not establish empirical truth.
* **Related Entity**: `EmpiricalFinding`
* **Related Source / Claim**: Ingestion Rule (Verification Separation)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-G03`: Verified Paper Secondary Claim Isolation
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: Paper Urban et al. (2019) is verified for SIBAL fabric, but a secondary side-mention of a silicone sample in the discussion section is claimed as verified flight data.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "doi": "10.1016/j.combustflame.2018.10.012",
    "material": "Silicone elastomer",
    "claimed_verification": "VERIFIED_EMPIRICAL"
  }
  ```
* **Preconditions**: Claim-level audit register active.
* **Expected Outcome**: Pipeline checks specific audited claims. Silicone was not verified in Saffire-I flight data (`SAFFIRE-001` covers SIBAL). Downgrades status to `PRELIMINARY_UNAUDITED`.
* **Expected Disposition**: `ACCEPT` (with downgraded status)
* **Failure Severity**: `HIGH`
* **Rationale**: A verified paper does not verify every incidental mention in its discussion text.
* **Related Entity**: `EmpiricalFinding`
* **Related Source / Claim**: Phase 0.8 Claim `SAFFIRE-001`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-G04`: Stripped Synthetic Header Rejection
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: A synthetic file from `tests/fixtures/synthetic/` has its header comment stripped in an attempt to ingest it as real NASA data.
* **Synthetic Input**:
  ```json
  {
    "file_origin": "tests/fixtures/synthetic/mock_saffire.json",
    "header_comment_present": false
  }
  ```
* **Preconditions**: File path origin security validator active.
* **Expected Outcome**: Ingestion security check flags path origin: `ERR_SYNTHETIC_ORIGIN_TAMPERING: Files originating in tests/fixtures cannot be ingested as empirical evidence`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents accidental ingestion of mock fixtures when file metadata has been stripped.
* **Related Entity**: `AuditProvenance`
* **Related Source / Claim**: `data/raw/psi/README.md`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-G05`: Contradicted Scientific Claim Quarantine
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: Ingesting a claim that microgravity increases the Limiting Oxygen Index (LOI) of PMMA.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "claim_id": "BASS-004",
    "statement": "Microgravity increases PMMA LOI flammability threshold"
  }
  ```
* **Preconditions**: Phase 0.8 Evidence Audit register active.
* **Expected Outcome**: Ingestion cross-references Claim `BASS-004`, which was audited as `CONTRADICTED` (flammability boundaries expand, lowering required oxygen). Pipeline tags record `STATUS_CONTRADICTED` and prevents it from relaxing spacecraft flammability standards.
* **Expected Disposition**: `QUARANTINE`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Contradicted physical claims must never be used to establish spacecraft crew safety margins.
* **Related Entity**: `EmpiricalFinding`
* **Related Source / Claim**: Phase 0.8 Claim `BASS-004`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-G06`: Physical Evidence Gap Query Preservation
* **Category**: Family G — Verification and Synthetic-Data Isolation
* **Scenario**: Mission planner queries flammability boundaries for solid PMMA in Lunar partial gravity ($0.16g$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "target_gravity_g": 0.16,
    "fuel": "Cast PMMA"
  }
  ```
* **Preconditions**: Master repository contains microgravity ($10^{-6}g$) and terrestrial ($1g$) data only.
* **Expected Outcome**: Engine detects absence of flight data: outputs explicit `EVIDENCE_GAP: No verified NASA flight data exists for solid flammability under partial lunar gravity`. **Does not output an unflagged linear interpolation.**
* **Expected Disposition**: `ACCEPT` (with `EVIDENCE_GAP` response)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Honest scientific software must highlight physical evidence gaps rather than inventing smooth interpolations across unmeasured gravity regimes.
* **Related Entity**: `EvidenceChain`
* **Related Source / Claim**: Phase 0.8 Claim `CROSS-004`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 9. Test Family H: Parsing and Structural Integrity

### `TEST-H01`: Delimiter Shift & Malformed Header Trap
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: A corrupted CSV export contains an extra comma in row 2, shifting numerical columns into text fields.
* **Synthetic Input**:
  ```csv
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Test_ID,Pressure_mmHg,Oxygen_mole_fraction
  1,760.0,0.21
  2,762.0,,0.21
  ```
* **Preconditions**: CSV parser validates row column counts against header.
* **Expected Outcome**: Parser traps row length mismatch on line 4: `ERR_ROW_COLUMN_COUNT_MISMATCH: Expected 3 fields, found 4`. Row 2 is rejected; line number logged.
* **Expected Disposition**: `REJECT` (for row 2)
* **Failure Severity**: `HIGH`
* **Rationale**: Protects against column-shifted data values silently corrupting numerical columns.
* **Related Entity**: Parser Core
* **Related Source / Claim**: Ingestion Gate 4 (Structural Validity)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-H02`: Non-Numeric String in Floating Point Column
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: Numerical pressure column contains text string `"corrupted_sensor_read"`.
* **Synthetic Input**:
  ```csv
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Test_ID,Pressure_mmHg
  3,corrupted_sensor_read
  ```
* **Preconditions**: Type coercion validator active.
* **Expected Outcome**: Parser refuses to coerce `"corrupted_sensor_read"` to float `NaN` or `0.0`. Drops row with typed error: `ERR_INVALID_NUMERIC_LITERAL`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `HIGH`
* **Rationale**: Avoids polluting float columns with coerced nulls or crashing database migration scripts.
* **Related Entity**: Parser Core
* **Related Source / Claim**: Ingestion Gate 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-H03`: Non-UTF-8 Encoding Anomaly Handling
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: Legacy data file contains Windows-1252 degree symbol (`\xb0C`) causing UTF-8 decode failure.
* **Synthetic Input**:
  ```
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Raw byte stream: "Ambient_Temp_\xb0C,298.15"
  ```
* **Preconditions**: File stream decoder active.
* **Expected Outcome**: Decoder traps non-UTF-8 character; invokes encoding fallback handler (`ISO-8859-1` / `Windows-1252`), sanitizes header to `Ambient_Temp_C`, and logs encoding warning.
* **Expected Disposition**: `ACCEPT` (with sanitized header)
* **Failure Severity**: `MEDIUM`
* **Rationale**: Ensures historical NASA engineering CSVs containing non-ASCII symbols do not crash the pipeline.
* **Related Entity**: Parser Core
* **Related Source / Claim**: Ingestion Gate 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-H04`: Duplicate Flight Run Primary Key Conflict
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: Batch input contains two distinct records with identical `run_id: "PSI69-20CAL08"`.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  [
    {"run_id": "PSI69-20CAL08", "fuel": "Methanol"},
    {"run_id": "PSI69-20CAL08", "fuel": "n-heptane"}
  ]
  ```
* **Preconditions**: Primary key uniqueness validator active.
* **Expected Outcome**: Ingestion halts on second record: `ERR_DUPLICATE_PRIMARY_KEY: run_id 'PSI69-20CAL08' already exists with conflicting attributes`. Prevents silent overwrite.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Prevents data corruption where later records silently clobber earlier flight runs.
* **Related Entity**: `ExperimentalRun`
* **Related Source / Claim**: Ingestion Gate 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-H05`: Unexpected Extra Column Handling
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: A newer version of a NASA experimental table adds an unmapped column `Radiometer_Channel_5`.
* **Synthetic Input**:
  ```csv
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  FLEX Test #,FLEX Identifier,Ambient pressure; mmHg,Radiometer_Channel_5
  1,20CAL08,757.7,1.42
  ```
* **Preconditions**: Schema strictness policy configured to quarantine unmapped columns.
* **Expected Outcome**: Parser extracts known columns into canonical entities; places unmapped column `Radiometer_Channel_5` into `metadata.unmapped_fields` JSON container. Emits `WARN_UNMAPPED_COLUMN`.
* **Expected Disposition**: `ACCEPT` (with unmapped fields container)
* **Failure Severity**: `LOW`
* **Rationale**: Preserves core ingestion while capturing newly exposed scientific channels without breaking schema contracts.
* **Related Entity**: Parser Core, `MeasurementRecord`
* **Related Source / Claim**: Ingestion Gate 4
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-H06`: Zero-Byte Empty File Handling
* **Category**: Family H — Parsing and Structural Integrity
* **Scenario**: Download script creates an empty `0-byte` CSV file due to a network timeout.
* **Synthetic Input**:
  ```
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  Empty file: data/raw/psi/flex/empty_run.csv (0 bytes)
  ```
* **Preconditions**: File reader preflight check active.
* **Expected Outcome**: Parser traps empty file size: `ERR_EMPTY_FILE_REJECTED: File contains 0 bytes`. Pipeline halts cleanly without null pointer exceptions.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `HIGH`
* **Rationale**: Protects ingestion runners from hanging or failing on aborted network downloads.
* **Related Entity**: Parser Core
* **Related Source / Claim**: `data/raw/psi/README.md`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

## 10. Test Family I: Cross-Investigation Comparability

### `TEST-I01`: Fuel Phase Incompatibility Guard (Liquid vs. Solid)
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: Query attempts to directly rank liquid droplet burning rate constant ($K$ in $\text{mm}^2\text{/s}$) against solid fabric concurrent spread rate ($V_f$ in $\text{mm/s}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "metric_A": {"fuel": "n-heptane droplet", "parameter": "K", "unit": "mm^2/s", "value": 0.74},
    "metric_B": {"fuel": "SIBAL fabric", "parameter": "spread_rate", "unit": "mm/s", "value": 2.4}
  }
  ```
* **Preconditions**: Evidence comparator active.
* **Expected Outcome**: Comparator blocks direct numerical comparison: `ERR_INCOMPATIBLE_FUEL_PHASES: Liquid droplet d2-law burning rate cannot be compared numerically with solid flame spread rate`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Droplet combustion is governed by spherical diffusion kinetics ($\text{mm}^2\text{/s}$); solid fabric spread is governed by surface thermal conduction and boundary layer flow ($\text{mm/s}$).
* **Related Entity**: `EvidenceChain`
* **Related Source / Claim**: `Cross-Investigation-Analysis.md` Section 2.1
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-I02`: Solid Fuel Geometry Incompatibility Guard (Film vs. Rod)
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: Query uses thin PMMA film flammability boundary to predict blowoff extinction of a thick PMMA rod.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_geometry": "thick_cylindrical_rod",
    "evidence_geometry": "thin_film",
    "material": "PMMA"
  }
  ```
* **Preconditions**: Solid combustion transport regime evaluator active.
* **Expected Outcome**: Comparator rejects equivalence: `ERR_INCOMPATIBLE_SOLID_GEOMETRY: Thermally thin film extinction boundary does not apply to thermally thick cylinders`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Thick rods suffer massive internal conductive heat sinking into the solid core; thin films burn symmetrically without internal heat sink.
* **Related Entity**: `FuelSpec`, `FuelGeometry`
* **Related Source / Claim**: Phase 0.8 Claim `BASS-001` vs. `BASS-002`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-I03`: Transport Regime Incompatibility Guard (Quiescent vs. Convective)
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: Quiescent droplet extinction diameter ($d_{ext}$) is used to predict extinction in a high-speed forced convective duct ($u_\infty = 25\text{ cm/s}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_flow_speed_cm_s": 25.0,
    "evidence_transport_regime": "quiescent_pure_diffusion"
  }
  ```
* **Preconditions**: Transport regime matching logic active.
* **Expected Outcome**: Comparator flags transport incompatibility: `ERR_TRANSPORT_REGIME_MISMATCH: Pure diffusion radiative extinction data cannot predict forced convective blowoff extinction`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Radiative extinction dominates at $Pe \ll 1$; convective blowoff dominates at $Pe \gg 1$.
* **Related Entity**: `EnvironmentalConditions`, `EvidenceChain`
* **Related Source / Claim**: `Cross-Investigation-Analysis.md` Section 3.1
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-I04`: Sample Scale Disparity Guard (Card vs. Vehicle Scale)
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: Flammability data from a $10\text{ cm}$ BASS-II sample card is extrapolated to declare a $100\text{ cm}$ vehicle burn (Saffire) non-flammable.
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "sample_scale_cm": 10.0,
    "extrapolated_scale_cm": 100.0,
    "claimed_equivalence": true
  }
  ```
* **Preconditions**: Scale-effect flammability evaluator active.
* **Expected Outcome**: Comparator blocks direct equivalence: `WARN_SCALE_DISPARITY: Small-scale sample cards suffer edge heat losses and cannot rule out large-scale fire propagation without boundary layer scaling models`.
* **Expected Disposition**: `REQUIRE_REVIEW`
* **Failure Severity**: `CRITICAL`
* **Rationale**: Saffire experiments demonstrated that materials passing small-scale flammability tests burn vigorously at macro scale.
* **Related Entity**: `FuelSpec`, `EvidenceChain`
* **Related Source / Claim**: Phase 0.8 Claim `SAFFIRE-001`; Urban et al. (2019)
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-I05`: Fuel Pyrolysis Chemistry Incompatibility Guard
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: Query uses cotton fabric flame spread rates to predict PMMA thermoplastic spread rates based on matching sample thickness ($0.4\text{ mm}$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "thickness_mm": 0.4,
    "material_A": "Cotton fabric (cellulosic)",
    "material_B": "PMMA (thermoplastic)"
  }
  ```
* **Preconditions**: Material pyrolysis classifier active.
* **Expected Outcome**: Comparator blocks substitution: `ERR_PYROLYSIS_CHEMISTRY_MISMATCH: Cellulosic charring pyrolysis cannot be equated with thermoplastic melting/vaporization`.
* **Expected Disposition**: `REJECT`
* **Failure Severity**: `HIGH`
* **Rationale**: PMMA depolymerizes to liquid monomer vapor; cotton pyrolyzes to char and combustible volatiles with smoldering potential.
* **Related Entity**: `FuelSpec`
* **Related Source / Claim**: `Cross-Investigation-Analysis.md` Section 2.2
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`

---

### `TEST-I06`: Atmospheric Pressure Extrapolation Guard
* **Category**: Family I — Cross-Investigation Comparability
* **Scenario**: System attempts to declare an Exploration Atmosphere ($56\text{ kPa}$, $34\%\ O_2$) safe based on standard cabin empirical data ($101.3\text{ kPa}$, $21\%\ O_2$).
* **Synthetic Input**:
  ```json
  /* SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS */
  {
    "query_pressure_kpa": 56.0,
    "query_oxygen_pct": 34.0,
    "evidence_pressure_kpa": 101.3,
    "evidence_oxygen_pct": 21.0
  }
  ```
* **Preconditions**: Space exploration atmospheric boundary evaluator active.
* **Expected Outcome**: Comparator outputs `INFERRED_WITH_CAVEATS` or `EVIDENCE_GAP`: `WARN_EXPLORATION_ATMOSPHERE_EXTRAPOLATION: Elevated oxygen (34%) increases flammability despite reduced pressure; requires empirical validation`.
* **Expected Disposition**: `ACCEPT` (with explicit caveat tag)
* **Failure Severity**: `CRITICAL`
* **Rationale**: Exploration Atmospheres exhibit complex flammability shifts governed by opposing pressure and oxygen kinetics.
* **Related Entity**: `EvidenceChain`
* **Related Source / Claim**: Phase 0.8 Claim `CROSS-005`
* **Implementation Status**: `SPECIFICATION ONLY — NOT IMPLEMENTED`
