# Open Fixture Design Decisions Register

**Phase**: 0.97 — Scientific Fixture Design & Test Data Contract  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Scientific Data Engineer  
**Date**: October 11, 2026  
**Status**: Authoritative Decision Register (*Pre-event documentation only — design options for future testing; no executable test harness or pipeline code*)  
**Previous Phase**: Phase 0.96 — Scientific Data Ingestion Test Specification (`05c702e`)

---

## 1. Purpose & Decision Invariants

This document evaluates the architectural, scientific, and structural decisions that influence how synthetic test fixtures are structured, maintained, and evaluated by FIRELINE's future ingestion pipeline.

### Invariant Principles:
1. **Separation of Test Design from Scientific Truth**: A test fixture can be 100% specified to verify that the pipeline traps a discrepancy (e.g. `FIXTURE-FUEL-005` trapping conflicting thickness values) without prematurely resolving the real-world scientific conflict.
2. **Canonical Schema Preservation**: Recommendations recorded here do not modify `hco_schema_specification.md`. Canonical schema modifications require an approved Architectural Decision Record (ADR) during Phase 1.
3. **No Phantom Resolution**: An open decision remains marked `OPEN` or `PARTIALLY DEFINED` until authoritative physical evidence or formal ADR consensus is established.

---

## 2. Re-Evaluation of Phase 0.96 Open Decisions

---

### `DEC-01`: Saffire-I Specimen Thickness Resolution Policy
* **Decision Identifier**: `DEC-01`
* **Original Question**: How should the ingestion engine adjudicate the conflict between the NASA PSI-98 flight table reporting `Sample Thickness (cm) = 0.37` ($3.7\text{ mm}$) and peer-reviewed literature reporting SIBAL fabric thickness as $0.4\text{ mm}$ ($0.04\text{ cm}$)?
* **Relevant Fixture IDs**: `FIXTURE-FUEL-005`
* **Existing Evidence**:
  * NASA PSI-98 repository table lists `Sample Thickness (cm) = 0.37` for Sample S1.
  * Urban et al. (2019) explicitly reports SIBAL fuel blend fabric thickness as approximately $0.4\text{ mm}$.
  * The Biot number differs by nearly an order of magnitude: $Bi \approx 0.05$ (thermally thin) vs $Bi \approx 0.5\text{–}1.0$ (transition to thermally thick).
* **What Remains Unknown**: Whether the $0.37\text{ cm}$ figure in the flight table represents total sample card mount thickness, a data entry typo intended as $0.37\text{ mm}$, or a different specimen version.
* **Candidate Resolution Options**:
  * *Option A*: Automatically divide table value by 10 (treat as typo).
  * *Option B*: Store in two separate fields: `FuelSpec.assembly_thickness_mm = 3.7` and `FuelSpec.bare_fabric_thickness_mm = 0.4`.
  * *Option C*: Enforce strict quarantine (`REQUIRE_REVIEW`) on any record exhibiting this discrepancy until Cygnus OA-6 CAD drawings are inspected.
* **Recommended Investigation**: Inspect uncompressed flight engineering bundle (`PSI-98_metadata_PSI-166_SAFFIRE-I.zip`) during Phase 1.
* **Can Fixture Be Specified Independently?**: **YES**. `FIXTURE-FUEL-005` is completely specified to assert that the pipeline assigns `REQUIRE_REVIEW` with code `STATUS_DISCREPANCY_FLAG_THICKNESS` and blocks automated silent division by 10.
* **Does It Block Automated Testing?**: **NO**. The test passes if the pipeline halts automated normalization and flags the record for review.
* **Current Status**: **OPEN — SCIENTIFIC EVIDENCE RESOLUTION REQUIRED (Pre-event freeze)**

---

### `DEC-02`: Canonical vs. Proposed Field Nullability Enforcement
* **Decision Identifier**: `DEC-02`
* **Original Question**: Should the ingestion test suite enforce canonical non-nullable fields (`flow_velocity_cm_s: number`, `external_radiant_flux_kw_m2: number`) or allow explicit `null` under proposed schema extensions?
* **Relevant Fixture IDs**: `FIXTURE-MISS-001`, `FIXTURE-MISS-003`
* **Existing Evidence**:
  * Canonical `hco_schema_specification.md` defines `flow_velocity_cm_s: number` without nullable union.
  * Quiescent droplet burning (FLEX) has zero forced flow ($u_\infty \equiv \text{N/A}$).
  * Forcing a number compels parsers to inject `0.0`, conflating unmeasured parameters with measured zero velocity and violating Mapping Principle 3.
* **What Remains Unknown**: Exact timeline for formal ADR ratification of `docs/hco_schema_change_proposal.md`.
* **Candidate Resolution Options**:
  * *Option A*: Strict canonical enforcement (reject `null`, failing quiescent test fixtures).
  * *Option B*: Adapter layer supporting proposed `ScientificValue<T>` with nullable raw values.
  * *Option C*: Ingest `0.0` in canonical flat columns while maintaining raw `null` in auxiliary metadata.
* **Recommended Investigation**: Ratify Schema Change Proposal ADR on Day 1 of Hackathon implementation.
* **Can Fixture Be Specified Independently?**: **YES**. `FIXTURE-MISS-003` specifies expected behavior under the proposed schema contract while flagging `DEC-02`.
* **Does It Block Automated Testing?**: **YES (Partially)**. Automated tests enforcing canonical schema will fail until schema amendment is merged.
* **Current Status**: **OPEN — SCHEMA DECISION REQUIRED (Scheduled for Phase 1)**

---

### `DEC-03`: Quarantine vs. Immediate Rejection Storage Model
* **Decision Identifier**: `DEC-03`
* **Original Question**: What is the definitive database storage boundary between assigning `REJECT` (drop record immediately) versus `QUARANTINE` (persist in an isolated staging table)?
* **Relevant Fixture IDs**: `FIXTURE-MISS-005`, `FIXTURE-UNIT-003`, `FIXTURE-UNIT-008`, `FIXTURE-UNIT-009`, `FIXTURE-VERIF-005`
* **Existing Evidence**:
  * Dropping records permanently (`REJECT`) prevents database clutter but risks losing valuable experimental runs with repairable metadata defects.
  * Quarantining unparseable syntax errors creates operational database noise.
* **What Remains Unknown**: Supabase table schema for quarantine storage (`raw_quarantine_records` vs. dead-letter queues).
* **Candidate Resolution Options**:
  * *Option A*: Reject all failures immediately; require manual payload re-submission.
  * *Option B*: Reject fatal structural failures (non-numeric strings in floats, unparseable CSV rows); quarantine scientific ambiguities, uncalibrated units, and missing conditions.
  * *Option C*: Quarantine all non-conforming inputs into a single generic queue.
* **Recommended Investigation**: Adopt Option B. Formalize `ingest_quarantine` table in Phase 4 Supabase migrations.
* **Can Fixture Be Specified Independently?**: **YES**. Fixture expected outcomes explicitly distinguish `REJECT` from `QUARANTINE`.
* **Does It Block Automated Testing?**: **NO**. The test assertions verify the assigned disposition code.
* **Current Status**: **DEFINED IN SPECIFICATION — PENDING PHASE 4 DB IMPLEMENTATION**

---

### `DEC-04`: Representation of Dimensionless Instrument Settings (Fan Display)
* **Decision Identifier**: `DEC-04`
* **Original Question**: How should uncalibrated instrument indices (such as BASS-II `Fan display: 62` and `Flow restrictor: 2`) be stored prior to acquiring flow duct calibration curves?
* **Relevant Fixture IDs**: `FIXTURE-UNIT-003`, `FIXTURE-FUEL-004`
* **Existing Evidence**:
  * BASS-II raw summary tables report fan speed as dimensionless potentiometer display numbers (`62`).
  * Converting `62` directly to $6.2\text{ cm/s}$ without duct calibration curves produces ungrounded air velocities.
* **What Remains Unknown**: NASA Glenn Research Center anemometer calibration tables for the BASS-II flow duct.
* **Candidate Resolution Options**:
  * *Option A*: Leave `flow_velocity_cm_s` as `null` and discard fan display number.
  * *Option B*: Store in `ScientificValue<number>` with `raw_value: 62`, `raw_unit: "display_index"`, and `normalized_value: null`.
  * *Option C*: Apply linear estimate ($u_\infty \approx 0.1 \times \text{display}$) with caveat flag.
* **Recommended Investigation**: Adopt Option B. Staged in `FIXTURE-UNIT-003`.
* **Can Fixture Be Specified Independently?**: **YES**. Fixture asserts that `normalized_value` remains `null`.
* **Does It Block Automated Testing?**: **NO**.
* **Current Status**: **DEFINED (Option B adopted for fixture design)**

---

### `DEC-05`: Chemical Formula Representation for Composite Woven Blends (SIBAL)
* **Decision Identifier**: `DEC-05`
* **Original Question**: How should `FuelSpec.chemical_formula` represent composite fabric blends such as SIBAL ($75\%$ cotton / $25\%$ fiberglass)?
* **Relevant Fixture IDs**: `FIXTURE-COMP-005`
* **Existing Evidence**:
  * Canonical `FuelSpec` requires `chemical_formula: string`.
  * Cotton is organic cellulose ($(C_6H_{10}O_5)_n$); fiberglass is inorganic silicate ($SiO_2$ matrix).
  * Inventing a single pseudo-chemical formula is chemically ungrounded.
* **What Remains Unknown**: Support for multi-component composite fuel structures in canonical HCO.
* **Candidate Resolution Options**:
  * *Option A*: Store cellulose formula `"(C6H10O5)n"` and note fiberglass in material description.
  * *Option B*: Allow `chemical_formula: null` for composite fabrics, adding a structured `material_components` map (`[{"material": "cotton", "fraction": 0.75}, {"material": "fiberglass", "fraction": 0.25}]`).
  * *Option C*: Introduce composite boolean flag `is_composite_blend: true`.
* **Recommended Investigation**: Adopt Option B under proposed schema amendments.
* **Can Fixture Be Specified Independently?**: **YES**. `FIXTURE-COMP-005` tests pyrolysis chemistry incompatibility independently of single-string formula limitations.
* **Does It Block Automated Testing?**: **NO**.
* **Current Status**: **OPEN — SCHEMA EXTENSION REQUIRED (Scheduled for Phase 1)**

---

### `DEC-06`: Ingestion Key Strategy for Unindexed NASA Flight Runs
* **Decision Identifier**: `DEC-06`
* **Original Question**: What primary key scheme should the ingestion pipeline generate when ingesting experimental rows that lack explicit NASA global run numbers?
* **Relevant Fixture IDs**: `FIXTURE-PROV-005`, `FIXTURE-PARSE-004`
* **Existing Evidence**:
  * Publications frequently designate runs simply as `Sample S1` or `Test 12` without global PSI identifiers.
  * Random UUIDs break idempotent re-ingestion.
* **What Remains Unknown**: Raw test matrix conventions across all 15 planned PSI archive downloads.
* **Candidate Resolution Options**:
  * *Option A*: Reject rows lacking NASA global run numbers.
  * *Option B*: Generate deterministic composite surrogate keys:  
    `{INVESTIGATION_ID}-{DOI_HASH}-{SOURCE_TABLE}-{ROW_INDEX}`.
  * *Option C*: Assign sequential database auto-incrementing integers.
* **Recommended Investigation**: Adopt Option B. Mathematically deterministic and idempotent.
* **Can Fixture Be Specified Independently?**: **YES**. Fixtures `FIXTURE-PROV-005` and `FIXTURE-PARSE-004` test idempotent deduplication using deterministic hashing.
* **Does It Block Automated Testing?**: **NO**.
* **Current Status**: **DEFINED (Option B adopted for fixture design)**

---

## 3. New Decisions Exposed by Phase 0.97 Fixture Design

---

### `DEC-07`: Fixture Synthetic Namespace Serialization and Ingestion Quarantine Tagging
* **Decision Identifier**: `DEC-07`
* **Core Question**: How should the synthetic watermark (`SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS`, `is_synthetic: true`) be enforced at the database row level to guarantee that synthetic test fixtures never leak into production search views?
* **Why It Matters**:
  * If a synthetic fixture is inadvertently inserted into production tables without an enforcing database constraint, astronautical fire safety queries could retrieve fabricated test values.
  * Software-level filters (`WHERE is_synthetic = false`) can fail if an engineer forgets to append the clause in a complex JOIN query.
* **Available Options**:
  * *Option A*: Row-Level Security (RLS) and PostgreSQL Database Constraints (`CHECK (is_synthetic = false)` on production tables, routing synthetic records to an isolated `test_fixtures` schema).
  * *Option B*: Rely exclusively on application-level filtering in Next.js server actions.
  * *Option C*: Maintain completely isolated database instances for test execution vs production evidence.
* **Evidence Needed**: Supabase multi-schema architecture capabilities evaluated during Phase 4.
* **Can Fixture Be Specified Independently?**: **YES**. `FIXTURE-VERIF-001` and `FIXTURE-VERIF-004` define the required rejection and quarantine behavior.
* **Does It Block Automated Testing?**: **NO**.
* **Recommended Resolution Method**: Adopt **Option A**. Enforce database-level table segregation where production views (`v_verified_empirical_findings`) are physically partitioned or filtered with non-bypassable RLS policies.
* **Current Status**: **DEFINED IN SPECIFICATION — PENDING PHASE 4 DB IMPLEMENTATION**

---

### `DEC-08`: Tabular CSV vs Hierarchical JSON Representation Contract for Multimodal Ingestion Fixtures
* **Decision Identifier**: `DEC-08`
* **Core Question**: Should synthetic test fixtures be maintained primarily as hierarchical JSON objects or as dual-format flat CSV tables with companion metadata sidecar files?
* **Why It Matters**:
  * NASA PSI archives expose flat CSV/Excel tables for operational summaries (`Sample_Summary.csv`) but provide hierarchical metadata in separate documentation bundles.
  * Testing parsers requires flat CSV fixtures (to test delimiter shifts, non-UTF-8 encodings), whereas testing schema mappers requires rich nested JSON.
* **Available Options**:
  * *Option A*: JSON only (convert all CSV inputs to JSON mocks).
  * *Option B*: Dual-Format Canonical Model: Store tabular fixtures (`FIXTURE-MISS-005`, `FIXTURE-PARSE-001`, `FIXTURE-PARSE-003`, `FIXTURE-PARSE-004`) as raw `.csv` snippets, and store entity/mapping fixtures as `.json` payloads.
  * *Option C*: Flat CSV only, flattening all nested structures into compound column names.
* **Evidence Needed**: Review of parser interface design in Phase 1.
* **Can Fixture Be Specified Independently?**: **YES**. The Phase 0.97 fixture catalog explicitly specifies the `input_format` per fixture (`JSON`, `CSV`, or `BINARY/STREAM`).
* **Does It Block Automated Testing?**: **NO**.
* **Recommended Resolution Method**: Adopt **Option B**. Allows native testing of CSV parsing anomalies while preserving rich ontological nesting for schema gates.
* **Current Status**: **DEFINED (Option B adopted for fixture design)**

---

## 4. Summary of Decision Statuses

| Decision ID | Title | Impact on Fixture Design | Blocks Future Automated Testing? | Current Status |
| :--- | :--- | :--- | :--- | :--- |
| **`DEC-01`** | Saffire-I Thickness Source Reconciliation Policy | `FIXTURE-FUEL-005` asserts review lock; does not force unit division. | No (Test asserts `REQUIRE_REVIEW`) | Open (Evidence resolution required) |
| **`DEC-02`** | Canonical vs. Proposed Field Nullability | `FIXTURE-MISS-001`, `FIXTURE-MISS-003` test honest null flow velocity. | Yes (Partially, until ADR approval) | Open (ADR approval required) |
| **`DEC-03`** | Quarantine vs. Rejection Storage Model | Delineates `REJECT` vs `QUARANTINE` across 17 fixtures. | No | Defined in Specification |
| **`DEC-04`** | Uncalibrated Instrument Display Handling | `FIXTURE-UNIT-003`, `FIXTURE-FUEL-004` lock raw index without SI flow. | No | Defined (Option B adopted) |
| **`DEC-05`** | Chemical Formula for Composite Woven Blends | `FIXTURE-COMP-005` tests pyrolysis chemistry segregation. | No | Open (Schema extension required) |
| **`DEC-06`** | Ingestion Key Strategy for Unindexed Runs | `FIXTURE-PROV-005`, `FIXTURE-PARSE-004` verify deterministic deduplication. | No | Defined (Option B adopted) |
| **`DEC-07`** | Synthetic Namespace DB Quarantine Tagging | `FIXTURE-VERIF-001`, `FIXTURE-VERIF-004` enforce production quarantine. | No | Defined in Specification |
| **`DEC-08`** | Tabular CSV vs Hierarchical JSON Contract | Authorizes dual-format representation across the 60 fixtures. | No | Defined (Option B adopted) |
