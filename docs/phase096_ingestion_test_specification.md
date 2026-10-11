# Scientific Data Ingestion Test Specification
**Phase**: 0.96 — Scientific Data Ingestion Test Specification  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Test Engineering Lead  
**Date**: October 11, 2026  
**Status**: Authoritative Planning Specification (*Pre-event documentation only — no executable code or test harness*)  

---

## 1. Scope, Mission & Boundary Notice

### 1.1 Purpose
The purpose of this specification is to define how FIRELINE’s future scientific data ingestion engine will detect corrupted, conflated, ambiguous, or ungrounded data **before** it enters the ontology knowledge base or runtime databases.

The specification establishes deterministic acceptance criteria, failure severities, and validation gates across nine core test families. It ensures that the ingestion engine behaves as a rigorous scientific filter rather than an uncritical data converter.

### 1.2 Boundary Notice & Pre-Event Constraints
* **Specification Only**: This document defines intended future behaviour. It does **not** signify that ingestion software, automated parsers, Python test runners, or database tables have been implemented.
* **NASA Space Apps 2026 Rule Adherence**: In accordance with competition regulations, application implementation and automated pipeline code remain strictly on hold until the hackathon kickoff (November 14, 2026).
* **Synthetic Test Inputs**: All test inputs presented in this specification and its catalog are explicitly designated as **SYNTHETIC TEST DATA — NOT NASA MEASUREMENTS**. They serve purely to exercise validation logic and edge cases.
* **Canonical Schema Integrity**: The canonical Harmonized Combustion Ontology (`hco_schema_specification.md`) remains immutable. Proposed schema extensions from `docs/hco_schema_change_proposal.md` are evaluated as prospective contracts only.

---

## 2. First Priority — Critical Source Ambiguities & Reconciliation Safeguards

Before defining operational test cases, four critical scientific discrepancies and source ambiguities identified during Phases 0.8, 0.9, and 0.95 must be formally recorded. The ingestion pipeline must never silently resolve or paper over these ambiguities.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CRITICAL SOURCE AMBIGUITIES MATRIX                   │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Saffire-I Thickness: PSI-98 table says 0.37 cm vs. paper says 0.4 mm │
│ 2. FLEX Fuel Identity:  Table preview shows Methanol vs. papers cite C7│
│ 3. BASS-II Geometry:    Table preview is PMMA film vs. paper PMMA rods │
│ 4. Provenance Gaps:     Landing page listing ≠ verified flight record  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Saffire-I Specimen Thickness Discrepancy
* **The Conflict**:
  * The live NASA PSI-98 experimental table explicitly lists: `Sample Thickness (cm) = 0.37` (which equals $3.7\text{ mm}$).
  * Peer-reviewed literature (Urban et al., 2019) and Phase 0.8 audited claim `SAFFIRE-001` report the SIBAL fabric thickness as: $0.4\text{ mm}$ ($0.04\text{ cm}$).
  * The ratio between these two figures is nearly an order of magnitude ($3.7\text{ mm}$ vs. $0.4\text{ mm}$, a factor of $9.25\times$).
* **Candidate Explanations**:
  1. *Unit/Header Mislabeling*: The source table header was intended to be `Sample Thickness (mm)` rather than `(cm)`, making $0.37\text{ mm} \approx 0.4\text{ mm}$.
  2. *Transcription/Decimal Shift*: The value was intended to be $0.037\text{ cm}$ ($0.37\text{ mm}$) and lost a leading zero.
  3. *Structural Definition Difference*: $0.37\text{ cm}$ ($3.7\text{ mm}$) represents the total thickness of the mounting card / sample holder assembly or multi-layer pack, whereas $0.4\text{ mm}$ represents the bare SIBAL fabric weave.
  4. *Different Test Specimen*: `S1` and `S2` in the table refer to a distinct specimen variant.
* **Ingestion Safeguard Rule**: The pipeline must **never** perform an unreviewed unit conversion (e.g. dividing by 10) or silently overwrite the reported table value with the paper value. Incoming records exhibiting this conflict must be assigned disposition `REQUIRE_REVIEW` and quarantined.

### 2.2 FLEX Fuel & Experiment Identity Conflation
* **The Conflict**:
  * The live NASA PSI-69 experimental table preview displays 275 flight runs of **Methanol** droplets (`Fuel: Methanol`, `Ambient pressure; mmHg: ~760`).
  * Phase 0.8 verified claims (`FLEX-001` through `FLEX-004`) cite Dietrich et al. (2017) and Nayagam et al. (2015), which investigate **$n$-heptane, $n$-octane, and decane** droplets.
* **Ingestion Safeguard Rule**: The pipeline must enforce strict fuel-specific record isolation. A measurement or finding derived from $n$-heptane kinetics must never be linked to a Methanol flight run record (`20CAL08`, etc.) solely because both share the investigation code `PSI-69`.

### 2.3 BASS-II Fuel Geometry Conflation (Thin Films vs. Thick Rods)
* **The Conflict**:
  * The live NASA PSI-25 experimental table preview displays 130 flight runs conducted by Subrata Bhattacharjee on **thin PMMA films** ($100\text{–}300\ \mu\text{m}$ thick, $2\text{ cm}$ wide).
  * Phase 0.8 verified claims (`BASS-001` through `BASS-006`) cite Sandra Olson & Paul Ferkul (2017) studying **thick cast PMMA cylindrical rods** ($R = 6.35\text{–}12.7\text{ mm}$) in axial stagnation flow.
* **Scientific Reality**: Thin films burn under thermally thin conditions ($Bi \ll 1$), where conduction across the fuel is near-instantaneous. Thick rods burn under thermally thick conditions ($Bi \gg 1$), dominated by in-depth thermal conduction and surface regression.
* **Ingestion Safeguard Rule**: Ingestion parsers must validate `FuelGeometry` before admitting solid flammability data. Film records and rod records must be physically segregated. A shared investigation identifier (`PSI-25`) does not establish specimen equivalence.

### 2.4 Repository Availability vs. Scientific Verification
* **The Conflict**: An asset's presence on a NASA webpage is often conflated with scientific verification.
* **Lifecycle Separation Invariant**:
  $$\text{Listed in Repo} \not\Rightarrow \text{Metadata Inspected} \not\Rightarrow \text{Contents Opened} \not\Rightarrow \text{Record Mapped} \not\Rightarrow \text{Claim Verified}$$
* **Ingestion Safeguard Rule**: Passing structural schema validation (`isValid == true`) must never automatically upgrade a record's scientific status to `VERIFIED_EMPIRICAL`.

---

## 3. Test Architecture, Dispositions & Severity Classifications

### 3.1 Ingestion Dispositions
Every record evaluated by the ingestion engine must exit with exactly one of four mutually exclusive dispositions:

| Disposition | Operational Meaning | System Action |
| :--- | :--- | :--- |
| **`ACCEPT`** | Record passes all validation gates, maintains full provenance, preserves original units, and satisfies physical consistency checks. | Ingest into persistent storage; tag with appropriate `verification_level`. |
| **`REJECT`** | Record contains fatal structural errors, corrupted values, fabricated placeholders, or unidentifiable provenance. | Drop record immediately; log fatal validation error; do not persist. |
| **`QUARANTINE`** | Record contains data that cannot be validated automatically (e.g. uncalibrated indices, missing units, precision conflicts). | Persist in isolated quarantine staging table; block from search and retrieval. |
| **`REQUIRE_REVIEW`** | Record exhibits scientific ambiguity, conflicting literature values, or geometry mismatches (e.g. Saffire thickness conflict). | Persist with `STATUS_DISCREPANCY_FLAG`; alert research engineer for manual adjudication. |

### 3.2 Failure Severities
* **`CRITICAL`**: Fundamental scientific falsehood or corruption (e.g. dummy zero replacing missing measurement, synthetic mock data leaking into empirical storage, geometry conflation). Results in immediate rejection or quarantine.
* **`HIGH`**: Missing provenance, ungrounded unit conversion, or uncalibrated instrument reading treated as calibrated SI.
* **`MEDIUM`**: Precision inflation, unverified bibliographic cross-reference, or missing non-critical operating condition.
* **`LOW`**: Formatting inconsistency, whitespace discrepancy, or minor typographical variance in non-indexed metadata.

---

## 4. Test Family Specifications (Families A through I)

### 4.1 Family A — Provenance and Source Identity
Evaluates the integrity, uniqueness, and traceability of incoming research sources.

* **`TEST-A01` (Valid Source Traceability)**: Verifies that a record with a complete, verified DOI, valid flight run ID, and exact table location successfully passes Gate 1.
* **`TEST-A02` (Missing Source Identity)**: Verifies that a measurement lacking an originating investigation, DOI, or archive handle is assigned disposition `REJECT`.
* **`TEST-A03` (Landing Page Mistaken for Raw Data)**: Verifies that a record citing only `https://psi.nasa.gov/...` without table or file coordinates is prevented from claiming `Contents Inspected`.
* **`TEST-A04` (Publication-to-Dataset Mismatch)**: Verifies that attempting to link a paper table to an unrelated experimental dataset (e.g. Dietrich 2017 to Methanol run `20CAL08`) is flagged as `REQUIRE_REVIEW`.
* **`TEST-A05` (Duplicate Source Ingestion)**: Verifies that ingesting the same flight record twice updates existing provenance or flags duplication without creating ghost records or inflating sample counts.
* **`TEST-A06` (Broken Provenance Lineage)**: Verifies that a record citing a nonexistent table row or figure coordinate fails with `QUARANTINE`.
* **`TEST-A07` (Unverified Bibliographic Reference)**: Verifies that an unverified paper citation preserves `UNVERIFIED` status and does not inherit verified empirical ranking.

---

### 4.2 Family B — Missingness and Nullability
Evaluates the honest handling of absent, unmeasured, or inapplicable scientific data.

* **`TEST-B01` (Genuinely Missing Measurement)**: Verifies that an unrecorded sensor measurement remains `null` and is never populated with `0.0`.
* **`TEST-B02` (Empty Table Cell Preservation)**: Verifies that blank cells in tabular feeds (e.g. Saffire flow visualization rows) are parsed as explicit `null`, not string `"null"` or `0`.
* **`TEST-B03` (Inapplicable Condition Nullability)**: Verifies that quiescent tests ($u_\infty = 0$) and unheated tests ($q_{ext} = 0$) permit explicit `null` for forced flow and radiant heater fields under proposed schemas.
* **`TEST-B04` (Zero-Like Placeholder Rejection)**: Verifies that common parser filler tokens (`-999`, `-9999`, `999.0`, `"N/A"`, `"--"`) are trapped and converted to `null` with a placeholder warning.
* **`TEST-B05` (Missing Environmental Condition)**: Verifies that an experimental run lacking ambient oxygen concentration ($X_{O_2}$) is barred from flammability boundary modeling.
* **`TEST-B06` (Unreported Uncertainty Handling)**: Verifies that when a source omits uncertainty, `uncertainty` is set to `null` rather than assuming default $\pm 5\%$ or zero error.
* **`TEST-B07` (Unacquired Raw File Invariant)**: Verifies that an uninspected 860 GB archive file cannot be represented as an observed empty series.

---

### 4.3 Family C — Units and Scientific Value Integrity
Evaluates dual-unit representation, normalization correctness, precision, and physical boundaries.

* **`TEST-C01` (Valid Dual-Unit Normalization)**: Verifies that converting $760\text{ mmHg}$ to $101.325\text{ kPa}$ preserves `raw_value: 760`, `raw_unit: "mmHg"`, `normalized_value: 101.325`, `normalized_unit: "kPa"`.
* **`TEST-C02` (Unit-Label Conflict)**: Verifies that a source providing pressure in `psia` but marked with column header `kPa` triggers `REQUIRE_REVIEW`.
* **`TEST-C03` (Unsupported Unit Conversion)**: Verifies that an unknown or non-standard engineering unit (e.g. uncalibrated counts) is preserved in `raw_unit` while `normalized_value` remains `null`.
* **`TEST-C04` (Missing Measurement Unit)**: Verifies that a naked number lacking any documented unit is rejected from empirical classification.
* **`TEST-C05` (Precision Inflation Trap)**: Verifies that a value reported as $\approx 2.4\text{ mm/s}$ is not stored as $2.400000000\text{ mm/s}$ without preserving source precision metadata.
* **`TEST-C06` (Uncertainty Structure Integrity)**: Verifies that an uncertainty value lacking its type (standard deviation vs. 95% confidence interval) is flagged for provenance completion.
* **`TEST-C07` (Normalization Drift Detection)**: Verifies that an automated recalculation check validates $\text{normalized} \equiv f(\text{raw})$; flags any manual tampering with conversion math.
* **`TEST-C08` (Oxygen Concentration Basis Ambiguity)**: Verifies that an oxygen field reported as `21` without specifying `%` volume, mole fraction, or mass fraction is quarantined.
* **`TEST-C09` (Pressure Unit Indeterminacy)**: Verifies that an ambiguous pressure reading lacking barometric reference ($psia$ vs. $psig$) blocks automatic atmospheric normalization.

---

### 4.4 Family D — Experimental Conditions and Record Identity
Evaluates physical boundary envelopes, transport regime classification, and condition equivalence.

* **`TEST-D01` (Flow Direction Distinction)**: Verifies that opposed-flow forced ventilation ($u_\infty = -10\text{ cm/s}$) is strictly segregated from concurrent-flow ventilation ($u_\infty = +10\text{ cm/s}$).
* **`TEST-D02` (Gravity Level Transport Partitioning)**: Verifies that microgravity records ($g \approx 10^{-6}$) are barred from direct equivalence with terrestrial normal-gravity records ($1g$).
* **`TEST-D03` (Atmospheric Pressure Regime Partitioning)**: Verifies that Exploration Atmosphere records ($P \approx 56\text{ kPa}$) cannot be conflated with standard terrestrial cabin pressure ($101.3\text{ kPa}$).
* **`TEST-D04` (Fuel Dimension Mismatch)**: Verifies that PMMA cylinders of radius $R = 6.35\text{ mm}$ are not merged with rods of $R = 12.7\text{ mm}$.
* **`TEST-D05` (Missing Transport Boundary)**: Verifies that records lacking pressure or oxygen mole fraction cannot be mapped to the 4-tier Gated Rule Classifier.
* **`TEST-D06` (Apparatus-Specific Artifact Isolation)**: Verifies that chamber wall proximity or sample holder heat sinking flags prevent treating boundary data as unconfined material properties.

---

### 4.5 Family E — Investigation-Specific Safeguards
Evaluates empirical guardrails tailored to FLEX, BASS-II, and Saffire-I.

* **`TEST-E01` (FLEX Droplet Diameter Series Safeguard)**: Verifies that an operational table row summarizing run conditions cannot be parsed as a time-series droplet diameter record.
* **`TEST-E02` (FLEX Multi-Fuel Isolation)**: Verifies that $n$-heptane radiative extinction findings cannot be attributed to Methanol or Octane flight test points.
* **`TEST-E03` (BASS-II Film vs. Rod Segregation)**: Verifies that Bhattacharjee thin PMMA film test points cannot be assigned to Olson & Ferkul cylindrical rod contracts.
* **`TEST-E04` (BASS-II Fan Display Calibration Trap)**: Verifies that raw dimensionless `Fan display: 62` cannot be mapped directly to `flow_velocity_cm_s` without staging an approved calibration curve.
* **`TEST-E05` (Saffire-I Specimen Thickness Reconciliation Guard)**: Verifies that incoming Saffire-I records exhibiting the $0.37\text{ cm}$ vs. $0.4\text{ mm}$ discrepancy are assigned `REQUIRE_REVIEW` with an unresolved discrepancy flag.
* **`TEST-E06` (Saffire-I Initial Conditions vs. Dynamic Spread)**: Verifies that the 5-row flight table is restricted to populating `FuelSpec` and `EnvironmentalConditions`, preventing false claims that it contains measured spread rate time-series.

---

### 4.6 Family F — Measured, Derived, and Interpreted Values
Evaluates epistemic boundaries between direct transducer readings, mathematical derivations, and hypotheses.

* **`TEST-F01` (Derived Quantity Transparency)**: Verifies that calculated surface radiative flux ($q_{rad}''$) requires an explicit mathematical formula and input channel provenance.
* **`TEST-F02` (Derived Pressure Estimate Labeling)**: Verifies that Saffire-I cabin pressure rise ($\Delta P = 0.5\text{ kPa}$) is tagged `is_derived_estimate: true` and barred from raw sensor telemetry classification.
* **`TEST-F03` (Theoretical Extrapolation Guard)**: Verifies that flame spread rate models derived from numerical code (e.g. Li et al., 2018) are tagged as simulations, never empirical flight records.
* **`TEST-F04` (Missing Derivation Input Provenance)**: Verifies that a derived value whose primary input channels cannot be verified is assigned `QUARANTINE`.
* **`TEST-F05` (Hypothesis Statement Isolation)**: Verifies that research proposal hypothesis text is classified as metadata, never as an empirical finding.
* **`TEST-F06` (Irreproducible Calculation Flag)**: Verifies that when a derived estimate’s documented formula yields a value differing from the reported number by $> 5\%$, the record is flagged for discrepancy review.

---

### 4.7 Family G — Verification and Synthetic-Data Isolation
Evaluates the strict quarantine of illustrative fixtures and audit status integrity.

* **`TEST-G01` (Synthetic Fixture Leakage Prevention)**: Verifies that records carrying `SYNTHETIC_ILLUSTRATIVE` are completely excluded from production database indices and evidence retrieval queries.
* **`TEST-G02` (Structural Validity vs. Empirical Verification)**: Verifies that a record with 100% valid schema types but unverified literature provenance receives `PRELIMINARY_UNAUDITED`, never `VERIFIED_EMPIRICAL`.
* **`TEST-G03` (Verified Source vs. Unaudited Claim)**: Verifies that citing a verified publication (e.g. Urban 2019) does not verify an uninspected secondary claim in the same paper.
* **`TEST-G04` (Synthetic Marker Tampering Guard)**: Verifies that any record originating in `tests/fixtures/synthetic/` cannot be ingested if its synthetic header comment is stripped.
* **`TEST-G05` (Contradicted Claim Quarantine)**: Verifies that claims audited as `CONTRADICTED` in Phase 0.8 (e.g. Saffire LOI microgravity flammability increase) are barred from establishing spacecraft safety thresholds.
* **`TEST-G06` (Evidence Gap Status Enforcement)**: Verifies that queries touching physical voids (e.g. Lunar partial-g solid flammability) return explicit `EVIDENCE_GAP`, never an interpolated answer.

---

### 4.8 Family H — Parsing and Structural Integrity
Evaluates parser resilience against corrupt files, non-standard encodings, and malformed tables.

* **`TEST-H01` (Malformed Column Header Trap)**: Verifies that unexpected column headers (e.g. shifted delimiters) trigger immediate file rejection with line-numbered error logs.
* **`TEST-H02` (Non-Numeric String in Float Column)**: Verifies that parsing text strings (`"corrupted"`, `"error"`) inside numerical columns safely rejects the record without crashing the pipeline.
* **`TEST-H03` (Character Encoding Anomaly)**: Verifies that non-UTF-8 character streams (e.g. ISO-8859-1 degree symbols `°C`) are safely decoded or quarantined.
* **`TEST-H04` (Non-Unique Run Identifier Conflict)**: Verifies that two distinct rows sharing an identical primary key (`run_id`) in a single ingest file halts processing to prevent silent data clobbering.
* **`TEST-H05` (Unexpected Extra Column Ingestion)**: Verifies that unmapped extra columns in CSV feeds are either quarantined or stored in a generic metadata JSON field, preserving the core contract.
* **`TEST-H06` (Empty File Handling)**: Verifies that zero-byte files are rejected immediately without raising unhandled null reference exceptions.

---

### 4.9 Family I — Cross-Investigation Comparability
Evaluates physical compatibility rules, preventing scientifically illegitimate cross-comparisons.

* **`TEST-I01` (Fuel Phase Incompatibility Guard)**: Verifies that liquid droplet burning rate ($K$ in $\text{mm}^2\text{/s}$) cannot be numerically compared with solid flame spread rate ($V_f$ in $\text{mm/s}$).
* **`TEST-I02` (Geometry Incompatibility Guard)**: Verifies that PMMA thin-film flammability boundaries cannot be used to predict PMMA cylindrical rod extinction limits.
* **`TEST-I03` (Transport Regime Incompatibility Guard)**: Verifies that diffusion-dominated quiescent droplet burning data is flagged as incompatible when queried for high-speed convective duct flow.
* **`TEST-I04` (Scale Disparity Guard)**: Verifies that small-scale sample card tests ($10\text{ cm}$) are not treated as equivalent to macro-scale vehicle burns ($100\text{ cm}$ Saffire) without scale-correction models.
* **`TEST-I05` (Material Chemistry Equivalence Guard)**: Verifies that cellulosic fuel (cotton fabric) cannot be substituted for thermoplastic fuel (PMMA) based on identical sample thickness.
* **`TEST-I06` (Atmospheric Pressure Extrapolation Guard)**: Verifies that standard $101.3\text{ kPa}$ burning limits cannot be directly extrapolated to Exploration Atmosphere $56\text{ kPa}$ conditions without an explicit `INFERRED` tag.

---

## 5. Acceptance Criteria for Ingestion Pipeline Readiness

When pipeline development begins during the official hackathon period (November 14, 2026), the ingestion codebase must satisfy the following acceptance criteria before any NASA dataset is loaded into the production database:

1. **100% Deterministic Test Pass Rate**: All test cases specified in the companion Test Case Catalog must pass.
2. **Zero Synthetic Leakage**: Ingestion of all synthetic fixtures must result in 100% quarantine from the production evidence index.
3. **Discrepancy Flagging**: Every record touching the Saffire-I thickness ambiguity must be routed to `REQUIRE_REVIEW`.
4. **No Imputed Zeroes**: Zero instances of substituted zeros in place of missing sensor measurements across all ingested tables.
5. **Traceability Guarantee**: Every single stored `MeasurementRecord` must trace back to an identifiable DOI, table row, or sensor archive checksum.
