# Phase 0.99 — Pre-Flight Readiness Review

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead:** Aniket Nandi (Kolkata, IST)  
**Date of Audit:** October 11, 2026  
**Target Event:** NASA Space Apps Challenge 2026 (November 14–15, 2026)  
**Document Status:** Complete & Verified Baseline  
**Mode:** Documentation-only, pre-event preparation (No competition implementation before November 14, 2026, 9:00 AM local time)  

---

## 1. Executive Summary & Purpose

Phase 0.99 represents the final pre-flight preparation and readiness audit for project **FIRELINE**. Over ten preparatory phases (Phases 0 through 0.98), the project established the scientific foundation for spacecraft fire-safety intelligence:
1. Audited official NASA Space Apps Challenge requirements and judging criteria.
2. Formulated the **Harmonized Combustion Ontology (HCO)** specification.
3. Conducted primary-source audits across three foundational microgravity combustion campaigns (FLEX, BASS-II, Saffire-I) in the NASA Physical Sciences Informatics (PSI) repository.
4. Defined deterministic pre-ingestion data contracts, acceptance test specifications (59 test cases), and synthetic fixture designs (60 fixtures).
5. Consolidated all contracts and audited existing discrepancies and open architectural decisions (`DEC-01` through `DEC-08`, `CONFLICT-098-001` through `CONFLICT-098-010`).

This document synthesizes the complete pre-flight state into an auditable, evidence-backed readiness review. It evaluates what is fully ready for implementation, what remains conditionally ready, what is strictly blocked, and establishes the precise operational and technical boundaries for Day 1 of the hackathon.

> **Crucial Operating Boundary:**  
> This phase is strictly documentation-only. In accordance with the NASA Space Apps Challenge timeline and team governance rules, no application code, database migrations, executable fixtures, or automated ingestion pipelines are implemented in this phase. The canonical schema `hco_schema_specification.md` remains 100% byte-identical and unmodified.

---

## 2. Section A — Repository State & Environmental Baseline

The underlying repository state was independently inspected and verified prior to compiling this review:

* **Repository Working Tree:** Clean. Untracked directory `.obsidian/` preserved and strictly excluded from version control.
* **Preflight HEAD Commit:** `c5168b3` (*docs: consolidate scientific ingestion contracts*, Phase 0.98 completion).
* **Canonical Schema Integrity:**
  * File: `hco_schema_specification.md`
  * Size: 15,404 bytes
  * SHA-256 Hash: `980AD11C634B7B0E6CAFBD3D3B883AEBA8CDE63A14E377AA3DD070C1D5F5AF52`
  * Status: **Byte-identical preservation verified**. No fields added, modified, or deleted.
* **Commit History Traceability:**
  * `c5168b3` — *docs: consolidate scientific ingestion contracts* (Phase 0.98)
  * `d3c905c` — *docs: design deterministic scientific test fixtures* (Phase 0.97)
  * `05c702e` — *docs: specify scientific ingestion acceptance tests* (Phase 0.96)
  * `9243268` — *docs: inventory NASA PSI artifacts and prepare staging layout* (Phase 0.95)
  * `4945f59` — *docs: define scientific data mapping contracts for ingestion readiness* (Phase 0.9)
  * `b119914` — *docs: audit scientific claims and document evidence provenance* (Phase 0.8)
  * `6a70143` — *docs: add FIRELINE knowledge maps and documentation templates* (Phase 0.7)
  * `fed9c78` — *docs(research): establish research notes, cross-investigation analysis, and scientific questions roadmap* (Research)
  * `be8df8e` — *docs(phase0): complete official challenge review and requirements traceability* (Phase 0)
  * `fe83e65` — *docs: establish Obsidian vault structure with dashboard, source register, and engineering decisions* (Foundation)

---

## 3. Section B — Complete Preparation History (Phases 0–0.98)

Every phase in the FIRELINE preparation lifecycle has served a dedicated scientific or architectural purpose. Below is the audited progression:

| Phase | Main Deliverables | Specified Scope | Actually Executed | Identified Gaps & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | `docs/phase00_official_challenge_review.md` | Challenge rules, judging criteria, NASA data policy review | Comprehensive traceability matrix for Space Apps 2026; confirmed Nov 14–15 development window | Challenge statements were preliminary; full challenge release set for Oct 28, 2026. |
| **Phase 0.5** | `docs/source_verification_matrix.md`, `docs/evidence_classifier_review.md`, `docs/hco_schema_change_proposal.md` | Initial empirical audit of 24 claims; mathematical evaluation of Delaunay classifier | Replaced Delaunay classifier with 4-Tier Gated Rule Classifier; verified 24 NASA PSI claims; proposed `ScientificValue<T>` | Canonical HCO untouched; schema proposals remained non-canonical pending Phase 1. |
| **Phase 0.7** | `02-Maps/*.canvas`, `04-Templates/*.md` | Visual Obsidian knowledge architecture and standardized notes | Built 4 visual canvas maps and 4 standardized templates; validated wiki-link graphs | Canvas layouts are documentation artifacts, not runtime frontend components. |
| **Phase 0.8** | `docs/phase08_scientific_evidence_audit.md` | Rigorous evidence verification, DOI validation, epistemic status categorization | Verified empirical bounds: FLEX droplet $d_0=1.5\text{--}4.1\text{ mm}$, BASS-II flow $v=1.0\text{--}5.5\text{ cm/s}$, Saffire-I $v=20\text{ cm/s}$ | Identified critical Saffire-I specimen thickness conflict (0.37 cm table vs ~0.4 mm paper). |
| **Phase 0.9** | `docs/phase09_pre_ingestion_contract_mapping.md` | Pre-ingestion data contract mapping across canonical vs. proposed HCO | Mapped 42 ingestion requirements (`REQ-INGEST-01` to `42`); established 9 empirical eligibility gates | Droplet burning nullability gap surfaced (`DEC-02`); Saffire-I thickness flagged (`DEC-01`). |
| **Phase 0.95** | `docs/phase095_psi_artifact_inventory.md`, `docs/phase095_artifact_record_template.md` | Live inspection of NASA PSI repository assets (FLEX, BASS-II, Saffire-I) | Documented 5 PSI assets; audited experimental table schemas; formulated local staging layout | Discovered BASS-II uncalibrated fan index (0–100); confirmed raw data files require authenticated NASA PSI access. |
| **Phase 0.96** | `docs/phase096_ingestion_test_specification.md`, `docs/phase096_test_case_catalog.md`, `docs/phase096_test_traceability_matrix.md`, `docs/phase096_open_test_design_decisions.md` | Implementation-agnostic acceptance test specification across 9 families | Designed 59 deterministic test cases (`TEST-A01` to `TEST-I06`); established bidirectional matrix to 42 requirements | `TEST-B08` header omitted from catalog text; reported priority breakdown differed from matrix. |
| **Phase 0.97** | `docs/phase097_fixture_design_specification.md`, `docs/phase097_fixture_catalog.md`, `docs/phase097_fixture_traceability_matrix.md`, `docs/phase097_open_fixture_design_decisions.md` | Synthetic test fixture data contract | Designed 60 synthetic fixtures (`FIXTURE-PROV-001` to `FIXTURE-COMP-006`); 15 positive, 35 negative, 6 quarantine, 4 review | Synthetic fixtures are test definitions only, not executable JSON/CSV files or database seeds. |
| **Phase 0.98** | `docs/phase098_ingestion_contract_consolidation.md`, `docs/phase098_implementation_readiness_checklist.md`, `docs/phase098_contract_conflict_register.md`, `docs/phase098_traceability_audit.md` | Contract consolidation, authority hierarchy, readiness audit, conflict logging | Established 6-level authority hierarchy; resolved count discrepancies (`CONFLICT-098-001`, `002`); audited 34 checklist items | Classified readiness as `READY_FOR_LIMITED_PHASE_1_SCOPE`; identified 5 hard blockers. |

---

## 4. Section C — Contract & Inventory Integrity Baseline

The consolidation and audit in Phase 0.98 established verified, mathematically consistent counts across all engineering assets. These figures constitute the authoritative pre-flight baseline:

### 4.1 Canonical Schema vs. Proposed Extensions
* **Canonical HCO (`hco_schema_specification.md`):** Level 1 Authority. Defines 6 core entities (`Investigation`, `ExperimentalRun`, `MaterialSample`, `EnvironmentalCondition`, `MeasurementSeries`, `ScientificFinding`) and 4 relationships (`HAS_RUN`, `TESTED_MATERIAL`, `SUBJECT_TO`, `PRODUCED_FINDING`).
* **Proposed Extensions (`docs/hco_schema_change_proposal.md`):** Level 4 Authority. Proposes `ScientificValue<T>` composite structure (`reported_value`, `reported_unit`, `normalized_value`, `normalized_unit`, `uncertainty`, `is_derived`, `is_approximated`), `SourceLocation`, `QuarantineDisposition`, and nullable relaxation for quiescent droplet conditions. **Remains strictly proposed** and must not be treated as canonical until an official Phase 1 Architecture Decision Record (ADR) is approved.

### 4.2 Ingestion Requirements Ground Truth (42 Total)
Audited distribution across the 42 requirements (`REQ-INGEST-01` through `REQ-INGEST-42`):
* **Critical Priority:** 23 requirements (`REQ-INGEST-01` to `07`, `10` to `15`, `20` to `22`, `26` to `29`, `34` to `36`)
* **High Priority:** 12 requirements (`REQ-INGEST-08`, `09`, `16`, `17`, `23`, `24`, `30`, `31`, `37`, `38`, `41`, `42`)
* **Medium Priority:** 6 requirements (`REQ-INGEST-18`, `19`, `25`, `32`, `33`, `39`)
* **Low Priority:** 1 requirement (`REQ-INGEST-40`)
*(Reconciled in Phase 0.98 `CONFLICT-098-002`, correcting historical narrative summary errors).*

### 4.3 Acceptance Test Inventory (59 Total)
Audited distribution across the 9 test families in `docs/phase096_test_case_catalog.md`:
* **Family A (Provenance & Source Identity):** 7 tests (`TEST-A01` to `TEST-A07`)
* **Family B (Missingness & Incomplete Records):** 7 tests in catalog (`TEST-B01` to `TEST-B07`), with `TEST-B08` referenced in decision registers and exercised by `FIXTURE-MISS-008`.
* **Family C (Unit Representation & Normalization):** 9 tests (`TEST-C01` to `TEST-C09`)
* **Family D (Experimental Condition Validity):** 6 tests (`TEST-D01` to `TEST-D06`)
* **Family E (Scientific Integrity Safeguards):** 6 tests (`TEST-E01` to `TEST-E06`)
* **Family F (Epistemic Type Distinctions):** 6 tests (`TEST-F01` to `TEST-F06`)
* **Family G (Synthetic Data Isolation):** 6 tests (`TEST-G01` to `TEST-G06`)
* **Family H (Source Parsing & Structure):** 6 tests (`TEST-H01` to `TEST-H06`)
* **Family I (Physical Comparability Gates):** 6 tests (`TEST-I01` to `TEST-I06`)
*(Reconciled in Phase 0.98 `CONFLICT-098-001`).*

### 4.4 Synthetic Fixture Inventory (60 Total)
Audited distribution across 9 categories in `docs/phase097_fixture_catalog.md`:
* Total Unique Fixture IDs: Exactly 60 (`FIXTURE-PROV-001` to `FIXTURE-COMP-006`).
* Dispositions: 15 Positive Progression, 35 Negative Rejection, 6 Quarantine, 4 Review Required.

### 4.5 Open Design Decisions (`DEC-01` to `DEC-08`)
All 8 decisions remain documented and open. None have been unilaterally resolved by assumptions:
1. `DEC-01`: Saffire-I specimen thickness conflict (0.37 cm table vs ~0.4 mm paper) — Open (blocks automated thickness normalization).
2. `DEC-02`: Canonical vs. proposed nullability for quiescent droplet runs — Open (blocks quiescent droplet ingestion into canonical schema).
3. `DEC-03`: Quarantine vs. rejection database storage model — Proposed (blocks persistent quarantine table design).
4. `DEC-04`: Uncalibrated BASS-II fan-display index handling — Open (blocks converting fan index to flow velocity $m/s$).
5. `DEC-05`: SIBAL composite-fuel representation in canonical schema — Proposed.
6. `DEC-06`: Surrogate experimental-run identifier hashing policy — Proposed.
7. `DEC-07`: Synthetic-data database isolation and RLS enforcement — Proposed.
8. `DEC-08`: CSV tabular vs. hierarchical JSON pre-ingestion staging contract — Proposed (dual-format ingestion supported).

---

## 5. Section D — Scientific Source Readiness Audit

A detailed audit of the four candidate NASA PSI microgravity combustion investigations was conducted:

| Investigation | PSI ID | Inspected Artifacts | Inspection Depth | Schema & Physics Compatibility | Initial Scope Classification | Status Justification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Saffire-I** | PSI-98 | `PSI98-ART-002` (Sample initial dimensions table) | Primary table inspected; columns, units, and values cataloged | Fully compatible with forced-flow solid combustion model ($v=20\text{ cm/s}$, complete boundary conditions) | **APPROVED FOR INITIAL SCOPE (PARTIAL)** | Flat pre-test dimensions are fully documented. Automated thickness normalization and run-table merging are strictly excluded until `DEC-01` resolution. |
| **BASS-II** | PSI-25 | `PSI25-ART-002` (Summary table for flat PMMA films) | Primary table inspected; run numbers, fuel, and flame dimensions cataloged | Fully compatible with forced-flow solid combustion model for flat PMMA samples with positive air flow ($1.0\text{--}5.5\text{ cm/s}$) | **APPROVED FOR INITIAL SCOPE (PARTIAL)** | Thin-film flat samples are ready. Thick rod burning and uncalibrated fan display index runs (0–100 index) are strictly excluded until `DEC-04` resolution. |
| **FLEX** | PSI-69 | PSI repository metadata, 25 raw filenames, publication DOIs | Landing page and publication abstracts inspected; raw .raw/.dat files unparsed | Incompatible with canonical forced-flow schema: droplet runs have zero forced flow ($v=0$), variable pressure/oxygen, and spherical geometry | **DEFERRED FROM INITIAL MVP** | Blocked by `DEC-02` (canonical schema non-nullable flow fields) and droplet geometry model gaps. Excluded to preserve Day 1 delivery focus. |
| **SoFIE-MIST**| PSI-104| Investigation overview, preliminary technical papers | Secondary literature only; no primary experimental table parsed | Narrow-channel forced flow solid combustion; geometry differs from Saffire and BASS ducts | **DEFERRED FROM INITIAL MVP** | Raw PSI tables uninspected. Ingestion value high for future phases, but insufficient pre-flight verification for Day 1. |

---

## 6. Section E — Outstanding Blockers & Resolution Gates

Before implementation can safely proceed, the exact blockers affecting specific capabilities must be isolated:

```
[NASA Source Ingestion Requirements]
        │
        ├──► Blocked by DEC-01 (Saffire-I Thickness CAD Evidence)
        │       └──► Impact: Automated thickness normalization disabled; preserve raw source value.
        │
        ├──► Blocked by DEC-02 (Canonical Nullability for Droplet Runs)
        │       └──► Impact: FLEX droplet ingestion deferred from Day 1 MVP.
        │
        ├──► Blocked by DEC-04 (BASS-II Fan Display Calibration Curve)
        │       └──► Impact: Uncalibrated fan index runs quarantined/excluded from velocity filtering.
        │
        └──► Blocked by Challenge Release Schedule (Oct 28 Milestone)
                └──► Impact: Final challenge alignment confirmed on Oct 28; Day 1 backlog locked.
```

1. **Source Evidence Blockers:**
   * `DEC-01` (Saffire-I thickness): Requires primary NASA CAD drawing or Glenn Research Center engineering telemetry to resolve 0.37 cm vs 0.4 mm. *Resolution Rule for Day 1:* Do not normalize or reconcile. Store verbatim reported source value with `APPROXIMATED` tag.
   * `DEC-04` (BASS-II fan index): Requires duct flow calibration curve relating fan setting (0–100) to actual airspeed ($m/s$). *Resolution Rule for Day 1:* Keep fan setting as dimensionless integer index; forbid velocity search indexing over fan index.
2. **Schema & Architecture Blockers:**
   * `DEC-02` (Quiescent droplet nullability): Canonical HCO defines forced flow velocity as non-nullable. Droplet combustion runs have no forced flow. *Resolution Rule for Day 1:* Exclude FLEX droplet runs from initial ingestion to avoid schema violation.
   * `DEC-03` / `DEC-07` (Quarantine and synthetic isolation architecture): Requires database schema migration. *Resolution Rule for Day 1:* Enforce quarantine at application ingestion validation layer (`status = 'QUARANTINED'`), prevent write to production evidence tables.
3. **Official Challenge Milestone:**
   * Complete challenge statements, SME guidelines, and official datasets release on **October 28, 2026**.
   * *Resolution Rule:* Mandatory Day 0 Review Checkpoint on October 28 to confirm challenge alignment before kickoff.

---

## 7. Section F — Readiness Classification & Scope Boundary

Based on the rigorous audit of documentation, schema contracts, and source artifacts:

### Technical Readiness Classification:
$$\mathbf{READY\_FOR\_LIMITED\_PHASE\_1\_SCOPE}$$

### Operational Hackathon Classification:
$$\mathbf{HANDOFF\_READY\_WITH\_CONDITIONS}$$

### Explicit Permitted Scope for Initial Implementation:
1. **Source Ingestion:** Ingestion of verified forced-flow solid combustion records from:
   * Saffire-I (`PSI98-ART-002` pre-test specimen dimension table).
   * BASS-II (`PSI25-ART-002` flat thin-film PMMA summary table with reported flow velocity).
2. **Data Integrity Contract:**
   * Strict preservation of reported source values and source units alongside normalized values.
   * Explicit representation of missing fields as `NULL` (never zero).
   * Rejection of malformed records or zero oxygen/pressure values.
   * Isolation of synthetic fixtures using the `SYNTHETIC_ILLUSTRATIVE` tag.
3. **Core Evidence Workflow:**
   * Search and retrieval over accepted empirical records.
   * Evidence detail view displaying experimental boundary conditions, fuel geometry, and source provenance.
   * Deterministic cross-experiment comparison with physical compatibility warnings.
   * Explicit evidence-gap indicator when search conditions fall outside tested microgravity regimes.

### Explicit Excluded Capabilities (Deferred from Initial Scope):
* Ingestion of quiescent droplet combustion (FLEX PSI-69).
* Ingestion of uncalibrated BASS-II fan display runs without flow velocity.
* Automated Saffire-I thickness normalization or cross-run table merging.
* Ingestion of SoFIE-MIST (PSI-104).
* Predictive machine learning fire-spread modeling or numerical extrapolation.
* Graph database clustering or complex 3D simulation.

---

## 8. Summary of Pre-Flight Readiness

FIRELINE has completed all pre-event research and architectural preparation without violating competition boundaries or compromising scientific data integrity. With 42 requirements mapped, 59 tests specified, 60 synthetic fixtures designed, and all conflicts documented, the engineering team possesses a precise, bounded blueprint for implementation starting on November 14, 2026 at 9:00 AM local time.
