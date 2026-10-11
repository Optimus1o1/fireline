# Open Test Design Decisions Register
**Phase**: 0.96 — Scientific Data Ingestion Test Specification  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Scientific Data Engineer  
**Date**: October 11, 2026  
**Status**: Authoritative Decision Register (*Pre-event documentation only — design options for future implementation*)  

---

## 1. Purpose & Decision Invariants

This document records the architectural and scientific ambiguities that currently prevent certain ingestion test outcomes from being closed as finalized canonical rules.

### Invariant Principles:
1. **No Premature Finalization**: When a schema constraint, unit convention, or quarantine policy remains unresolved, it is logged here as an open decision rather than being prematurely frozen.
2. **Recommendations Are Not Decisions**: Recommended resolution methods represent engineering proposals for evaluation during Phase 1 (hackathon implementation), not approved architectural decisions.
3. **Canonical Specification Preservation**: Canonical `hco_schema_specification.md` remains strictly unchanged until formal ADR approval.

---

## 2. Register of Open Test Design Decisions

### `DEC-01`: Saffire-I Specimen Thickness Resolution Policy
* **Decision Identifier**: `DEC-01`
* **Core Question**: How should the ingestion engine adjudicate the conflict between the NASA PSI-98 table reporting `Sample Thickness (cm) = 0.37` ($3.7\text{ mm}$) and peer-reviewed literature reporting SIBAL fabric thickness as $0.4\text{ mm}$ ($0.04\text{ cm}$)?
* **Why It Matters**:
  * Solid fuel thickness directly determines the thermal Biot number ($Bi = h \cdot L / k_s$).
  * If thickness is $0.4\text{ mm}$, SIBAL behaves as thermally thin ($Bi < 0.1$), where flame spread rate is inversely proportional to thickness ($V_f \propto 1 / \tau$).
  * If thickness is $3.7\text{ mm}$, the sample enters the thermally thick regime ($Bi > 1$), altering the governing spread equations.
  * Ingesting the wrong value without human review corrupts physical scaling predictions by nearly an order of magnitude.
* **Available Options**:
  * **Option A**: Treat the table value as a typographical unit error (entered as $0.37$ intending millimeters) and automatically convert to $0.37\text{ mm}$.
  * **Option B**: Treat the table value as the total sample holder assembly / card mounting thickness and store it in a distinct field (`FuelSpec.assembly_thickness_mm = 3.7`) while storing bare fabric thickness as $0.4\text{ mm}$.
  * **Option C**: Maintain strict quarantine (`REQUIRE_REVIEW`) on any record with this conflict until primary Cygnus OA-6 engineering drawings are inspected.
* **Evidence Needed**: Direct inspection of the uncompressed Saffire-I engineering documentation bundle (`PSI-98_metadata_PSI-166_SAFFIRE-I.zip`) and Cygnus sample card manufacturing drawings.
* **Blocks Future Implementation?**: **YES** (Blocks automated Saffire-I specimen dimension ingestion; does not block manual test fixture staging).
* **Recommended Resolution Method**: Adopt **Option C** during test execution (`TEST-E05`). Flag the record with `STATUS_DISCREPANCY_FLAG` and require manual engineering sign-off before admitting into production flammability models.

---

### `DEC-02`: Canonical vs. Proposed Field Nullability Enforcement
* **Decision Identifier**: `DEC-02`
* **Core Question**: Should the ingestion test suite enforce canonical non-nullable fields (`flow_velocity_cm_s: number`, `external_radiant_flux_kw_m2: number`) or allow explicit `null` under proposed schema extensions?
* **Why It Matters**:
  * The canonical schema in `hco_schema_specification.md` defines `flow_velocity_cm_s: number` without nullability.
  * Quiescent droplet burning (FLEX) has no forced flow. Enforcing a number forces parsers to substitute `0.0`.
  * Substituting `0.0` conflates an unmeasured or inapplicable velocity with a verified measurement of zero air motion, and violates Mapping Principle 3.
* **Available Options**:
  * **Option A**: Enforce strict canonical contract. Reject records with `null` flow velocity, forcing tests to fail until canonical schema is formally modified.
  * **Option B**: Introduce an intermediate adapter layer that validates against proposed nullable interfaces (`ScientificValue<T>`) while generating a deprecation warning for canonical consumers.
  * **Option C**: Allow `0.0` in canonical flat columns while requiring the companion `ScientificValue<T>` field to preserve `raw_value: null`.
* **Evidence Needed**: Formal Architectural Decision Record (ADR) approving the `docs/hco_schema_change_proposal.md` amendments.
* **Blocks Future Implementation?**: **YES** (Blocks strict typed ingestion of quiescent and unheated tests).
* **Recommended Resolution Method**: Adopt **Option B** for Phase 1 pipeline development. Execute ADR approval during Phase 1 kickoff to formalize schema nullability.

---

### `DEC-03`: Quarantine vs. Immediate Rejection Thresholds
* **Decision Identifier**: `DEC-03`
* **Core Question**: What is the definitive boundary between assigning `REJECT` (drop record immediately) versus `QUARANTINE` (store in an isolated staging table for human review)?
* **Why It Matters**:
  * Dropping records permanently (`REJECT`) prevents database clutter but risks losing valuable experimental records with minor formatting defects.
  * Storing too many records in quarantine creates operational triage debt and could permit unsafe records to be accidentally exposed if isolation queries fail.
* **Available Options**:
  * **Option A**: Reject all records that fail any validation gate; require data providers or engineers to fix the input file and re-ingest.
  * **Option B**: Reject only fatal structural failures (non-numeric strings in floats, empty files, missing provenance); quarantine physical ambiguities, uncalibrated units, and missing conditions.
  * **Option C**: Quarantine everything except malicious tampering; maintain an interactive human-in-the-loop triage UI.
* **Evidence Needed**: Benchmarking data error rates from genuine NASA PSI archive extracts during Phase 1.
* **Blocks Future Implementation?**: **NO** (Test catalog explicitly defines expected disposition per test case).
* **Recommended Resolution Method**: Adopt **Option B**. Reserve `REJECT` for unrecoverable structural syntax errors (`ERR_PROVENANCE_MISSING`, `ERR_ROW_COLUMN_COUNT_MISMATCH`); use `QUARANTINE` for physically ambiguous or uncalibrated records (`TEST-C03`, `TEST-B05`).

---

### `DEC-04`: Representation of Dimensionless Instrument Settings (Fan Display)
* **Decision Identifier**: `DEC-04`
* **Core Question**: How should uncalibrated instrument indices (such as BASS-II `Fan display: 62` and `Flow restrictor: 2`) be stored prior to acquiring flow duct calibration curves?
* **Why It Matters**:
  * If stored as a flow velocity, the system falsely treats an arbitrary display number as a calibrated physical velocity in $\text{cm/s}$.
  * If discarded, the operational context of the BASS-II run is permanently lost.
* **Available Options**:
  * **Option A**: Do not store the fan display setting; leave `flow_velocity_cm_s` as `null`.
  * **Option B**: Store in `ScientificValue<number>` with `raw_value: 62`, `raw_unit: "display_index"`, and `normalized_value: null`.
  * **Option C**: Apply an approximate linear calibration ($u_\infty \approx 0.1 \times \text{display}$) with an `APPROXIMATE_DERIVATION` caveat flag.
* **Evidence Needed**: BASS-II hardware operations manual or anemometer calibration table from the Glenn Research Center.
* **Blocks Future Implementation?**: **NO** (Architecture supports uncalibrated raw values).
* **Recommended Resolution Method**: Adopt **Option B** (`TEST-C03`, `TEST-E04`). Forbid automated normalization until the verified calibration curve is staged in `data/raw/psi/bass_ii/`.

---

### `DEC-05`: Chemical Formula Representation for Composite Woven Blends (SIBAL)
* **Decision Identifier**: `DEC-05`
* **Core Question**: How should `FuelSpec.chemical_formula` represent composite fabric blends such as SIBAL ($75\%$ cotton / $25\%$ fiberglass)?
* **Why It Matters**:
  * Canonical `FuelSpec` defines `chemical_formula: string`.
  * Cotton is primarily cellulose ($(C_6H_{10}O_5)_n$), an organic polymer that pyrolyzes to combustible volatiles.
  * Fiberglass is an amorphous inorganic silicate ($SiO_2$ with metal oxides) that acts as an inert structural heat sink and does not burn.
  * Combining them into a single pseudo-chemical formula (e.g. $(C_6H_{10}O_5)_{0.75}(SiO_2)_{0.25}$) is chemically ungrounded and breaks stoichiometry parsers.
* **Available Options**:
  * **Option A**: Store cellulose formula `"(C6H10O5)n"` and describe fiberglass in the material description text.
  * **Option B**: Allow `chemical_formula: null` for composite fabrics, adding a structured `material_components` map (`[{"material": "cotton", "mass_fraction": 0.75}, {"material": "fiberglass", "mass_fraction": 0.25}]`).
  * **Option C**: Define a composite fuel flag: `is_composite: true`.
* **Evidence Needed**: Consensus on multi-component fuel modeling in Phase 1 ontology finalization.
* **Blocks Future Implementation?**: **NO** (Can be staged with `chemical_formula: null`).
* **Recommended Resolution Method**: Adopt **Option B** under the proposed schema amendments.

---

### `DEC-06`: Ingestion Key Strategy for Unindexed NASA Flight Runs
* **Decision Identifier**: `DEC-06`
* **Core Question**: What primary key scheme should the ingestion pipeline generate when ingesting experimental rows that lack explicit NASA run numbers?
* **Why It Matters**:
  * Paper tables frequently list runs simply as `Row 1`, `Sample S1`, or `Test 1` without unique global NASA identifiers.
  * Ingesting rows with unstable surrogate keys risks collision when merging multiple papers or archive tables.
* **Available Options**:
  * **Option A**: Require an official NASA run code; reject records lacking one.
  * **Option B**: Generate deterministic composite surrogate keys:  
    `{INVESTIGATION_ID}-{DOI_HASH}-{SOURCE_TABLE}-{ROW_INDEX}` (e.g. `PSI98-10.1016-TAB1-S1`).
  * **Option C**: Use random UUIDs for internal primary keys and store source identifiers as metadata.
* **Evidence Needed**: Structure of raw test matrix files inside uncompressed NASA ZIP archives.
* **Blocks Future Implementation?**: **NO** (Composite surrogate key generation is mathematically deterministic).
* **Recommended Resolution Method**: Adopt **Option B**. Ensures 100% deterministic, idempotent re-ingestion while guaranteeing global uniqueness across papers.
