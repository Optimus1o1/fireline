# Pre-Ingestion Data Contract Mapping & Scientific Data Readiness
**Phase**: 0.9 — Pre-Ingestion Data Architecture & Scientific Readiness  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Scientific Data Engineer  
**Date**: October 11, 2026  
**Status**: Authoritative Planning Blueprint (*Pre-event documentation only — no executable code*)  

---

## 1. Phase 0.8 Audit Reconciliation

Before establishing data ingestion contracts, this section formally audits and reconciles the apparent reporting discrepancies noted between the Phase 0.8 completion summary and the underlying claim register in [`docs/phase08_scientific_evidence_audit.md`](phase08_scientific_evidence_audit.md).

### 1.1 Claim Count and Inventory Verification
A programmatic line-by-line verification of the Section 4 Claim Register in [`docs/phase08_scientific_evidence_audit.md`](phase08_scientific_evidence_audit.md) confirms:
* **Total Unique Claim IDs**: Exactly **24** claims are inventoried and evaluated.
  * FLEX: 6 claims (`FLEX-001` through `FLEX-006`)
  * BASS-II: 6 claims (`BASS-001` through `BASS-006`)
  * Saffire-I: 7 claims (`SAFFIRE-001` through `SAFFIRE-007`)
  * Cross-Investigation: 5 claims (`CROSS-001` through `CROSS-005`)
* **Single-Disposition Invariant**: Every claim ID appears in exactly **one** disposition in the register. There are zero duplicate IDs and zero unclassified claims.

### 1.2 Disposition Count Reconciliation
In the chat completion report for Phase 0.8, Section 3 contained a typographical header error: it stated `* VERIFIED (12 claims):` while actually enumerating **14** distinct claim IDs in the bulleted list. The underlying register in [`docs/phase08_scientific_evidence_audit.md`](phase08_scientific_evidence_audit.md) correctly contains 14 verified claims.

The reconciled disposition census is:

| Audit Disposition | Register Count | Specific Claim IDs |
| :--- | :--- | :--- |
| **`VERIFIED`** | **14** | `FLEX-002`, `FLEX-003`, `FLEX-004`, `FLEX-006`, `BASS-002`, `BASS-003`, `BASS-006`, `SAFFIRE-001`, `SAFFIRE-002`, `SAFFIRE-003`, `SAFFIRE-004`, `SAFFIRE-007`, `CROSS-001`, `CROSS-002` |
| **`PARTIALLY_VERIFIED`** | **3** | `FLEX-001`, `BASS-001`, `CROSS-003` |
| **`CONTRADICTED`** | **3** | `FLEX-005`, `BASS-004`, `SAFFIRE-005` |
| **`UNVERIFIED`** | **1** | `BASS-005` |
| **`DERIVED_ESTIMATE`** | **1** | `SAFFIRE-006` |
| **`EVIDENCE_GAP`** | **2** | `CROSS-004`, `CROSS-005` |
| **Total Inventory** | **24** | **100% Partitioned (No overlaps or omissions)** |

### 1.3 Resolution of Disposition Categories (Five vs. Six)
The Phase 0.8 prompt originally specified five standard empirical dispositions: `VERIFIED`, `PARTIALLY_VERIFIED`, `UNVERIFIED`, `CONTRADICTED`, and `DERIVED_ESTIMATE`. During the execution of the cross-investigation audit, two claims concerning partial gravity (`CROSS-004`) and Exploration Atmospheres (`CROSS-005`) addressed physical voids where flight data is entirely absent in the current repository. These were assigned the explicit label `EVIDENCE_GAP` to align directly with FIRELINE's 3-tier classification taxonomy (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`).

Thus, the audit register utilized **six** distinct labels.

### 1.4 Audit Dispositions vs. Authoritative HCO Schema Statuses
A clear distinction is maintained between:
1. **Audit Documentation Dispositions** (`VERIFIED`, `PARTIALLY_VERIFIED`, `CONTRADICTED`, `UNVERIFIED`, `DERIVED_ESTIMATE`, `EVIDENCE_GAP`): Used strictly within documentation review reports to evaluate literature claims.
2. **Authoritative HCO Verification Statuses** (`VERIFIED_EMPIRICAL`, `PARTIALLY_VERIFIED`, `PRELIMINARY_UNAUDITED`, `SYNTHETIC_ILLUSTRATIVE`): Defined in [`docs/hco_schema_change_proposal.md`](hco_schema_change_proposal.md) to tag persistent runtime records in memory or database storage.

No scientific claim has been upgraded or downgraded to force mathematical totals; the register reflects the exact physical status of the evidence.

---

## 2. Data Contract Boundaries: Canonical vs. Proposed

FIRELINE strictly separates the **Canonical Specification** from **Proposed Schema Improvements**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CANONICAL HCO SPECIFICATION                          │
│                  (hco_schema_specification.md)                         │
│  • Investigation          • ExperimentalRun                            │
│  • EnvironmentalConditions • FuelSpec                                  │
│  • MeasurementRecord       • EmpiricalFinding                          │
│  • AuditProvenance         • EvidenceChain                             │
│  STATUS: Canonical baseline; strict immutable contract for pre-event.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Evaluated against real PSI data
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PROPOSED SCHEMA EXTENSIONS                         │
│                  (docs/hco_schema_change_proposal.md)                  │
│  • ScientificValue<T> dual-representation (raw + normalized SI)        │
│  • Explicit field nullability (quiescent flows, radiant heaters)       │
│  • Discriminated FuelGeometry unions (droplet, slab, rod)              │
│  • Explicit VerificationLevel tagging (isolation of synthetic data)   │
│  STATUS: PROPOSED ONLY; not approved as canonical schema decisions.    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Canonical Specification Boundaries
* The canonical schema in [`hco_schema_specification.md`](../hco_schema_specification.md) remains **completely untouched**.
* It defines flat numerical fields (`flow_velocity_cm_s: number`, `pressure_kpa: number`, `value: number`, `unit: string`).
* It does not mandate database cardinalities, foreign key cascades, or specific indexing strategies.

### 2.2 Proposed Schema Extension Boundaries
* The proposed extensions in [`docs/hco_schema_change_proposal.md`](hco_schema_change_proposal.md) address real-world vulnerabilities discovered during the Phase 0.5 and 0.8 audits.
* They introduce `ScientificValue<T>` to prevent the destruction of raw reported units and experimental uncertainties.
* **Important**: These proposed extensions are blueprints for future implementation. They must **never** be treated as already merged, compiled, or operational code.

---

## 3. The Mapping Manifesto

### 3.1 Core Mapping Principles

1. **Source Fidelity**: Ingestion pipelines must capture the exact reported value, text, and header from the NASA archive. The original representation must never be discarded.
2. **Unit Preservation**: Measurements reported in non-SI units ($in/s$, $psia$, $ft/min$, $torr$) must retain their original units alongside any harmonized SI conversions.
3. **Missingness Integrity**: A missing value remains `null`. Pipelines must **never** substitute zero (`0.0`), arbitrary defaults ($298.15\text{ K}$, $101.3\text{ kPa}$), or average figures for unreported parameters.
4. **Evidence Provenance**: Every quantitative data point must record its originating investigation code, flight run ID, table number, column header, and peer-reviewed DOI.
5. **Condition Awareness**: Environmental conditions ($g, P, X_{O_2}, u_\infty$) define the physical validity envelope. A parameter cannot be extracted or compared without preserving the exact conditions of its run.
6. **Verification Separation**: Syntactic parsing success (valid JSON/CSV parsing) must never be confused with scientific empirical verification.
7. **Synthetic-Data Isolation**: Test fixtures and mock records must carry the `SYNTHETIC_ILLUSTRATIVE` tag and remain barred from search indexing, vector retrieval, and ranking.
8. **No Unsupported Normalization**: Never apply unverified conversion factors, idealized gas laws, or theoretical approximations without explicitly tagging the resulting value as `DERIVED_ESTIMATE`.

---

### 3.2 Source Inventory and Ingestion Readiness

The following table assesses the genuine accessibility and readiness of the primary NASA PSI source packages.

| Investigation | PSI Identifier | Source Artifact | Artifact Accessibility | Content Inspected | Available Fields Supported by Evidence | Relevant Claims (Phase 0.8) | Evidence Status | Mapping Readiness | Outstanding Work / Blockers |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FLEX** | `PSI-69` | Nayagam et al. (2015), *Combust. Flame* 162:2140–2147 | **ACCESSIBLE** (Full Paper Inspected) | Text, Figures 2–5, Equations, Experimental Protocol | Fuel identity ($n$-heptane, octane, decane), initial diameter ($d_0$), hot extinction ($d_{ext}$), cool-flame burning rate ($K_{cool}$), cool extinction ($d_{ext,cool}$) | `FLEX-001` to `FLEX-004`, `FLEX-006` | `VERIFIED` (Paper) | **PARTIALLY READY** | Individual CIR flight run tables and raw shadowgraph CSV logs remain unextracted from PSI bundle. |
| **FLEX** | `PSI-69` | NASA PSI-69 Web Portal Archive | **ACCESSIBLE** (Web portal & Experimental Table inspected) | Metadata, 275-run experimental table preview (rows 1–5), column headers, units (`mmHg`, mole fractions) | `FLEX Test #`, `FLEX Identifier`, `Ambient pressure; mmHg`, `Fuel` (Methanol), $X_{O_2}, X_{N_2}$ | `FLEX-001`, `FLEX-004` | `VERIFIED` (Portal Table & Metadata) | **PARTIALLY READY** (Table ready; 860 GB raw bundle blocked) | Operational run table ready for Phase 1 extraction. Raw droplet diameter time-series ($d(t)$) in 860.39 GB archive remain undownloaded. |
| **BASS-II** | `PSI-25` | Olson & Ferkul (2017), *Combust. Flame* 180:217–229 | **ACCESSIBLE** (Full Paper Inspected) | Sections 2–4, Table 1, Figures 4, 6 | Rod diameter ($6.35\text{–}12.7\text{ mm}$), flow velocity ($0\text{–}55\text{ cm/s}$), $X_{O_2}$ ($13.6\%\text{–}22.2\%$), quenching limit ($1.0\text{–}1.5\text{ cm/s}$), blowoff limit | `BASS-001`, `BASS-002`, `BASS-003`, `BASS-006` | `VERIFIED` (Rods in stagnation flow) | **PARTIALLY READY** | Flat PMMA sheet spread rates belong to secondary papers (Zhao et al.) and require separate extraction. |
| **BASS-II** | `PSI-25` | NASA PSI-25 Web Portal Archive | **ACCESSIBLE** (Web portal & Experimental Table inspected) | Metadata, 130-run experimental table preview (rows 1–5), representative image | `PI` (Bhattacharjee), `Test #` (`B1`–`B5`), `Fuel Sample Material` ($100\text{–}300\ \mu\text{m}$ PMMA film), `Fan display`, `Flow restrictor` | `BASS-001`, `BASS-002` | `VERIFIED` (Portal Table & Metadata) | **PARTIALLY READY** (Film table ready; Rod runs blocked in archive) | Portal table represents Bhattacharjee thin PMMA films, NOT Olson thick rods. Thick rod runs in 257.77 GB bundle require targeted extraction. |
| **Saffire-I**| `PSI-98` | Urban et al. (2019), *Combust. Flame* 199:168–182 | **ACCESSIBLE** (Full Paper Inspected) | Sections 2–4, Figures 3–8 | Fabric blend (75/25 cotton/fiberglass), sample dimensions ($40.6 \times 94.0\text{ cm}$), nominal flow ($20\text{ cm/s}$), cabin pressure ($101.3\text{ kPa}$), spread rate ($2.0\text{–}2.5\text{ mm/s}$) | `SAFFIRE-001` to `SAFFIRE-004`, `SAFFIRE-007` | `VERIFIED` (Paper) | **READY FOR PAPER DATA** | Raw telemetry ZIP bundle (`saffire_i_environmental_telemetry`) was synthetic; real Cygnus logs uninspected. |
| **Saffire-I**| `PSI-98` | NASA PSI-98 Web Portal Archive | **ACCESSIBLE** (Web portal & Experimental Table fully inspected) | Metadata, complete 5-run experimental table (all 5 rows), Version 4 changelog files | `Sample Number` (`S1`, `S2`), `Sample Thickness (cm)` ($0.37\text{ cm}$), `Air Flow (cm/s)` ($20\text{ cm/s}$), `Percent O2` ($21.5\text{–}21.7\%$), `Ignition Power (W)` ($182\text{ W}$) | `SAFFIRE-001`, `SAFFIRE-003` | `VERIFIED` (Portal Table & Metadata) | **READY FOR INITIAL FIXTURES** | Table provides initial flight conditions only; dynamic spread rate ($2.4\text{ mm/s}$) resides in literature. 11.41 GB archive undownloaded. |
| **SoFIE-MIST**| `PSI-104`| NASA Task Book NNX10AE01G; Ferkul 2019 | **PARTIALLY ACCESSIBLE** (Abstract/Task Book only) | Summary abstracts, research objectives | Material (PMMA rods), heater flux range ($0\text{–}40\text{ kW/m}^2$), chamber (CIR) | `FINDING-SOFIE-MIST-031` | `PARTIALLY_VERIFIED` (Qualitative) | **BLOCKED** | Flight experimental run tables are not yet indexed in open public PSI; retained as `SYNTHETIC_ILLUSTRATIVE`. |

---

### 3.3 Canonical HCO Entity Mapping Matrix

The following matrix maps the eight canonical entities from [`hco_schema_specification.md`](../hco_schema_specification.md) to candidate source artifacts and proposed schema improvements.

| Entity Name | Scientific Purpose | Supporting Canonical HCO Definition | Potential Source Artifact | Mapping Prerequisites | Required Provenance | Missingness & Uncertainty Handling | Related Proposed Changes | Open Questions | Implementation Readiness |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`Investigation`** | Master metadata for NASA flight combustion research campaigns | Interface `Investigation` (`investigation_id`, `title`, `psi_code`, `platform`, `chamber_hardware`, `doi`) | NASA PSI Portal Metadata, Primary Publications | Verified PSI catalog code and peer-reviewed DOI | Official PSI URL, verified publication DOI | Non-nullable core identity; DOI must resolve to primary paper | Add `investigation_status`, `principal_investigator` | None for core fields | **READY** |
| **`ExperimentalRun`**| Specific flight test point with defined operational conditions | Interface `ExperimentalRun` (`run_id`, `investigation_id`, `conditions`, `fuel`) | PSI Flight Test Matrices, Operations Logs | Valid parent `Investigation`; verified flight run number | Flight operations log ID or PSI table row identifier | Environmental conditions must be complete enough to define transport regime | Link to `VerificationLevel` | Internal run ID naming conventions vary between CIR, MSG, Cygnus | **PARTIAL** (Awaiting run table extraction) |
| **`FuelSpec`** | Physical and chemical specification of the combustible fuel | Interface `FuelSpec` (`material_name`, `chemical_formula`, `phase`, `geometry_type`, `dimensions`, `thermally_thin`) | Inspected primary literature, Material Safety Data Sheets | Documented fuel material, phase, and measured sample dimensions | Specimen preparation logs, ASTM/NASA material standard | Unmeasured dimensions remain `null`; Biot number must determine `thermally_thin` | Discriminated union geometries (`DropletGeometry`, `FlatSampleGeometry`, `CylindricalGeometry`) | How to represent composite blends (e.g. 75% cotton / 25% fiberglass) in chemical formula | **READY** |
| **`EnvironmentalConditions`** | Atmospheric and fluid-dynamic boundary conditions of the test | Interface `EnvironmentalConditions` (`gravity_g`, `pressure_kpa`, `oxygen_mole_fraction`, `flow_velocity_cm_s`, `diluent`, `ambient_temp_k`) | Flight transducer telemetry, Chamber operations logs | Calibrated sensor readings or documented test matrix setpoints | Facility sensor channel names, instrument calibration logs | Quiescent flow must be `null` or `0.0`; unmeasured radiant flux or temperature must be `null` | Wrap fields in `ScientificValue<T>`; add explicit nullability for flow, radiant flux, and $T_\infty$ | Handling mixed diluents ($N_2 + CO_2 + He$) | **READY FOR BLUEPRINT** (Requires nullability) |
| **`MeasurementRecord`** | Quantitative sensor observation or tracked physical metric | Interface `MeasurementRecord` (`metric_name`, `metric_symbol`, `value`, `unit`, `uncertainty`, `measurement_method`) | Video analysis logs, thermocouple curves, radiometer traces | Calibrated instrumentation, documented engineering units | Sensor channel identifier, timestamp or time-window | Must preserve raw units; uncertainty must be `null` if not calculated in source | Replace with `ScientificValue<number>`; add `uncertainty_type` | Standardizing optical tracking method taxonomy across rigs | **READY FOR BLUEPRINT** |
| **`EmpiricalFinding`** | Discrete, verifiable scientific claim extracted from an experiment | Interface `EmpiricalFinding` (`finding_id`, `claim_statement`, `phenomenon`, `qualitative_trend`, `quantitative_measurements`) | Primary paper results section, PSI summary findings | Verified parent `ExperimentalRun` and supporting `MeasurementRecord` array | Full citation, figure/table location, flight run ID | Qualitative statements must have supporting measurements or be labeled qualitative | Add `verification_level: VerificationLevel` | Criteria for separating definitive flight findings from derived model inferences | **READY** |
| **`AuditProvenance`** | Cryptographic and bibliographic trace of evidence origin | Interface `AuditProvenance` (`psi_investigation_code`, `psi_run_id`, `raw_telemetry_file`, `peer_reviewed_doi`, `psi_direct_url`) | NASA repository bundle paths, DOI registries | Verified DOI resolution and verified archive file path | Direct URL, verified DOI, archive internal relative path | Missing raw CSV files must be marked `null` or `NOT_AVAILABLE`, never fabricated | Add SHA-256 archive checksums and table row pointers | Establishing persistent locators when PSI URLs are modified | **READY** |
| **`EvidenceChain`** | Auditable DAG tracing a query claim back to primary evidence | Interface `EvidenceChain` (`chain_id`, `query_id`, `target_question`, `claim_summary`, `steps`) | FIRELINE reasoning engine, Research notes synthesis | Verified `EmpiricalFinding` nodes with verified provenance | Step-by-step linkage from query to finding to source | Disconnected or unverified steps must break the chain (`EVIDENCE_GAP`) | Integration with 4-Tier Gated Physical Classifier | Graph traversal rules across multi-investigation comparative findings | **READY CONCEPTUALLY** |

---

### 3.4 Measurement-Level Field Mapping

The following tables define the mapping from specific source observations in the inspected literature to the proposed HCO fields.

#### A. FLEX (PSI-69) — Droplet Combustion Field Mapping
*Source: Nayagam et al., Combustion and Flame (2015) 162:2140–2147*

| Parameter ID | Investigation | Scientific Meaning | Source Artifact | Source Location | Original Label | Original Type | Original Value | Original Unit | Candidate HCO Entity | Candidate HCO Field | Normalization Rule | Uncertainty Handling | Conditions Required | Verification Disposition | Mapping Status | Outstanding Issue |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `FLEX-PARAM-01` | FLEX (PSI-69) | Fuel material name | Nayagam 2015 | Section 1, p. 2140 | "n-heptane" | string | "n-heptane" | none | `FuelSpec` | `material_name` | lowercase trim | none | Liquid alkane | `VERIFIED` | **READY** | None |
| `FLEX-PARAM-02` | FLEX (PSI-69) | Initial droplet diameter | Nayagam 2015 | Section 2, p. 2141 | "$d_0$" | float range | $1.5\text{--}5.0$ | $mm$ | `FuelSpec` (Droplet) | `dimensions.diameter_mm` | $d_0 \times 1.0$ ($mm$) | $\pm 0.02\text{ mm}$ (optical) | SiC fiber tether | `VERIFIED` | **READY** | Specific run $d_0$ requires CIR run table |
| `FLEX-PARAM-03` | FLEX (PSI-69) | Hot radiative extinction diameter | Nayagam 2015 | Section 3, Fig. 2 | "$d_{ext}$" | float | Finite ($>0$) | $mm$ | `MeasurementRecord` | `value` / `ScientificValue` | Direct $mm$ | Stated in figure curves | $0g$, air, quiescent | `VERIFIED` | **PARTIAL** | Exact numerical value varies per initial $d_0$ |
| `FLEX-PARAM-04` | FLEX (PSI-69) | Cool-flame burning rate constant | Nayagam 2015 | Section 3, p. 2143 | "$K_c$" | float | $\sim 0.2\text{--}0.3$ | $mm^2/s$ | `MeasurementRecord` | `value` / `ScientificValue` | Direct $mm^2/s$ | Slope regression error | Quiescent, cool-flame regime | `VERIFIED` | **READY** | Distinguish from hot-flame $K \approx 0.5\text{--}0.7$ |
| `FLEX-PARAM-05` | FLEX (PSI-69) | Chamber flow velocity | Nayagam 2015 | Section 2, p. 2141 | "quiescent" | string / float | 0.0 | $cm/s$ | `EnvironmentalConditions`| `flow_velocity_cm_s` | Explicit `0.0` or `null` | Pure diffusion ($u_\infty = 0$) | CIR sealed chamber | `VERIFIED` | **READY** | Schema nullability required |

#### B. BASS-II (PSI-25) — PMMA Rods in Stagnation Flow Field Mapping
*Source: Olson & Ferkul, Combustion and Flame (2017) 180:217–229*

| Parameter ID | Investigation | Scientific Meaning | Source Artifact | Source Location | Original Label | Original Type | Original Value | Original Unit | Candidate HCO Entity | Candidate HCO Field | Normalization Rule | Uncertainty Handling | Conditions Required | Verification Disposition | Mapping Status | Outstanding Issue |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `BASS-PARAM-01` | BASS-II (PSI-25) | Fuel specimen geometry | Olson 2017 | Section 2, p. 218 | "PMMA rods" | string | "PMMA" | none | `FuelSpec` | `geometry_type` | `'cylindrical_rod'` | none | Cast clear acrylic | `VERIFIED` | **READY** | None |
| `BASS-PARAM-02` | BASS-II (PSI-25) | Rod specimen diameter | Olson 2017 | Section 2, Table 1 | "rod diameter" | float array | 6.35, 9.5, 12.7 | $mm$ (1/4, 3/8, 1/2 in) | `FuelSpec` (Rod) | `dimensions.diameter_mm` | Direct $mm$ | Machined tolerance | Stagnation flow tip | `VERIFIED` | **READY** | None |
| `BASS-PARAM-03` | BASS-II (PSI-25) | Forced air velocity envelope | Olson 2017 | Section 2, Table 1 | "duct flow velocity"| float range | $0\text{--}55$ | $cm/s$ | `EnvironmentalConditions`| `flow_velocity_cm_s` | Direct $cm/s$ | $\pm 0.2\text{ cm/s}$ (anemometer)| Axial stagnation impingement | `VERIFIED` | **READY** | Map per individual test run |
| `BASS-PARAM-04` | BASS-II (PSI-25) | Low-speed quenching limit | Olson 2017 | Section 3.1, Fig. 4 | "$u_{ext,low}$" | float range | $1.0\text{--}1.5$ | $cm/s$ | `MeasurementRecord` | `value` / `ScientificValue` | Direct $cm/s$ | $\pm 0.3\text{ cm/s}$ | $0g$, radiatively cooled | `VERIFIED` | **READY** | Dependent on oxygen percentage |
| `BASS-PARAM-05` | BASS-II (PSI-25) | Ambient oxygen concentration| Olson 2017 | Section 2, Table 1 | "oxygen concentration"| float range | $13.6\text{--}22.2$ | $\% O_2$ | `EnvironmentalConditions`| `oxygen_mole_fraction` | Percentage $\div 100$ | $\pm 0.2\%\ O_2$ | MSG nitrogen dilution sweeps | `VERIFIED` | **READY** | None |

#### C. Saffire-I (PSI-98) — Macro-Scale Concurrent Flame Spread Field Mapping
*Source: Urban et al., Combustion and Flame (2019) 199:168–182*

| Parameter ID | Investigation | Scientific Meaning | Source Artifact | Source Location | Original Label | Original Type | Original Value | Original Unit | Candidate HCO Entity | Candidate HCO Field | Normalization Rule | Uncertainty Handling | Conditions Required | Verification Disposition | Mapping Status | Outstanding Issue |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SAFF-PARAM-01` | Saffire-I (PSI-98) | Material blend name | Urban 2019 | Section 2, p. 170 | "SIBAL" | string | "75% cotton / 25% fiberglass" | none | `FuelSpec` | `material_name` | Composite fabric name | none | Thermally thin fabric | `VERIFIED` | **READY** | None |
| `SAFF-PARAM-02` | Saffire-I (PSI-98) | Sample dimensions | Urban 2019 | Section 2, p. 170 | "sample dimensions" | floats | $40.6 \times 94.0 \times 0.04$ | $cm$ | `FuelSpec` (Flat) | `dimensions` ($W, L, t$) | Convert $cm \to mm$ | Manufacturing tolerance | Pre-flight installation | `VERIFIED` | **READY** | Width $406\text{ mm}$, length $940\text{ mm}$ |
| `SAFF-PARAM-03` | Saffire-I (PSI-98) | Cabin ambient pressure | Urban 2019 | Section 2, p. 170 | "cabin pressure" | float | $101.3$ ($14.7$) | $kPa$ ($psia$) | `EnvironmentalConditions`| `pressure_kpa` | Raw $psia$, norm $kPa$ | Transducer precision | Post-unberth nominal Cygnus | `VERIFIED` | **READY** | Retain raw $14.7\text{ psia}$ |
| `SAFF-PARAM-04` | Saffire-I (PSI-98) | Concurrent airflow velocity | Urban 2019 | Section 2, p. 170 | "flow velocity" | float | $20.0$ | $cm/s$ | `EnvironmentalConditions`| `flow_velocity_cm_s` | Direct $cm/s$ | $\pm 1.0\text{ cm/s}$ | Exhaust fan tunnel | `VERIFIED` | **READY** | None |
| `SAFF-PARAM-05` | Saffire-I (PSI-98) | Concurrent flame spread rate | Urban 2019 | Section 3, p. 173 | "flame spread rate" | float range | $2.0\text{--}2.5$ | $mm/s$ | `MeasurementRecord` | `value` / `ScientificValue` | Direct $mm/s$ ($0.0024\text{ m/s}$) | $\pm 0.15\text{ mm/s}$ (optical pyrometry)| Quasi-steady propagation | `VERIFIED` | **READY** | Ground tests were $34\text{ mm/s}$ (1g) |
| `SAFF-PARAM-06` | Saffire-I (PSI-98) | Cabin pressure rise $\Delta P$ | Notes / Spec | Phase 0.5 audit | "Delta P" | float | $3.8$ | $kPa$ | `MeasurementRecord` | `value` / `ScientificValue` | Direct $kPa$ | Not from flight transducer | Bulk thermal expansion | `DERIVED_ESTIMATE` | **QUALIFIED** | Must be flagged as derived estimate |

---

## 4. The Proposed `ScientificValue<T>` Contract Blueprint

### 4.1 Architectural Rationale
In real NASA microgravity datasets, quantitative data arrives in diverse units, varying precisions, and with incomplete telemetry. Enforcing standard numbers without metadata results in data corruption:
* Raw units ($psia, in, sccm$) are permanently lost when forced into SI.
* Zero is erroneously substituted for unmeasured quantities.
* Theoretical derivations are confused with empirical transducer readings.

The proposed `ScientificValue<T>` construct (from [`docs/hco_schema_change_proposal.md`](hco_schema_change_proposal.md)) provides a dual-state representation:

```typescript
// PROPOSED CONTRACT BLUEPRINT (docs/hco_schema_change_proposal.md)
// Note: This is an architectural proposal, NOT an implemented production class.
export interface ScientificValue<T = number> {
  // 1. Harmonized standard SI representation (for search, distance metrics, and scaling)
  normalized_value: T;
  normalized_unit: string;

  // 2. Exact raw reading parsed from the NASA archive
  raw_value: number | string | null;
  raw_unit: string | null;

  // 3. Measurement uncertainty
  uncertainty?: number | null;
  uncertainty_type?: 'standard_deviation' | 'confidence_interval_95' | 'instrument_tolerance' | 'estimated';

  // 4. Data provenance and lineage
  source_column_header?: string;
  is_derived_estimate?: boolean;
  derivation_formula?: string;

  // 5. Verification status
  verification_level: 'VERIFIED_EMPIRICAL' | 'PARTIALLY_VERIFIED' | 'PRELIMINARY_UNAUDITED' | 'SYNTHETIC_ILLUSTRATIVE';
}
```

### 4.2 Illustrative Synthetic Example (Marked as Non-Production)

```json
{
  "_comment": "SYNTHETIC_ILLUSTRATIVE_EXAMPLE: Conceptual demonstration of ScientificValue mapping for Saffire-I flame spread rate",
  "parameter_name": "concurrent_flame_spread_rate",
  "normalized_value": 0.0024,
  "normalized_unit": "m/s",
  "raw_value": 2.4,
  "raw_unit": "mm/s",
  "uncertainty": 0.15,
  "uncertainty_type": "instrument_tolerance",
  "source_column_header": "Table_3_SpreadRate_SIBAL_Run1",
  "is_derived_estimate": false,
  "verification_level": "VERIFIED_EMPIRICAL",
  "provenance": {
    "doi": "10.1016/j.combustflame.2018.10.012",
    "psi_code": "PSI-98",
    "location": "Urban et al. (2019), Section 3, Page 173"
  }
}
```

---

## 5. Empirical Eligibility and Ingestion Validation Rules

To prevent ungrounded claims and corrupted data from entering the scientific engine, every record must pass through eight sequential validation gates before being admitted into production storage.

```
       RAW NASA PSI RECORD / PAPER MEASUREMENT
                         │
                         ▼
             [Gate 1: Source Identity] ──────────► FAIL: REJECT_UNIDENTIFIED
                         │ PASS
                         ▼
             [Gate 2: Artifact Inspection] ──────► FAIL: BLOCKED_PENDING_INSPECTION
                         │ PASS
                         ▼
             [Gate 3: Scientific Context] ───────► FAIL: INCOMPLETE_CONDITIONS
                         │ PASS
                         ▼
             [Gate 4: Unit & Value Integrity] ───► FAIL: CORRUPTED_UNITS
                         │ PASS
                         ▼
             [Gate 5: Synthetic Segregation] ────► SYNTHETIC: TAG_ILLUSTRATIVE_ONLY
                         │ PASS (Empirical)
                         ▼
             [Gate 6: Claim Verification] ───────► PARTIAL: TAG_QUALIFIED_INFERENCE
                         │ PASS
                         ▼
             [Gate 7: Provenance Trace] ─────────► FAIL: MISSING_LINEAGE
                         │ PASS
                         ▼
             [Gate 8: Missingness Integrity] ────► FAIL: REJECT_ZERO_FILLED
                         │ PASS
                         ▼
            CERTIFIED EMPIRICAL RECORD
```

### 5.1 The Ingestion Decision Matrix

| Readiness Disposition | Criteria & Ingestion Prerequisites | Permissible Engine Use | Required Runtime Label |
| :--- | :--- | :--- | :--- |
| **Eligible for Empirical Evidence (Definitive)** | Source verified with DOI; raw artifact or table inspected; units preserved; conditions complete; verified against flight data. | Primary evidence retrieval; mission safety assessment; boundary definition. | `SUPPORTED` (Definitive) |
| **Eligible with Qualified Scaling (Inferred)** | Source verified; conditions partially differ from query; requires physical scaling laws (de Ris, Damköhler) with stated assumptions. | Extrapolation analysis; trend projection; research guidance. | `INFERRED` (Qualified) |
| **Blocked Pending Primary Artifact Inspection** | Investigation verified, but raw ZIP/CSV data bundle uninspected. Only high-level paper text available. | Research catalog listing only; barred from numerical search. | `BLOCKED_PENDING_INSPECTION` |
| **Research-Only / Unverified** | Claim reported in literature but unconfirmed against primary flight records or thermocouple logs. | Literature reference only; barred from mission risk scoring. | `UNVERIFIED_LITERATURE` |
| **Synthetic Illustrative Only** | Test fixtures, mock data, or illustrative examples (`FINDING-FLEX-082`, etc.). | Unit testing and UI layout testing only; **strictly barred** from production index. | `SYNTHETIC_ILLUSTRATIVE` |

---

## 6. Mapping Gap Register

The following gaps represent unresolved mapping and data accessibility challenges that must be addressed before or during Phase 1:

| Gap ID | Investigation / Entity | Unresolved Question | Why It Matters | Evidence / Schema Needed | Blocks Implementation? | Recommended Resolution Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | FLEX (`PSI-69`) | Individual CIR flight run IDs (e.g. Test Point numbers) and raw shadowgraph ASCII column headers are unindexed. | Pipeline cannot bind raw diameter time-series without knowing exact column names. | Download and uncompress PSI-69 raw data bundle. | **YES** (Blocks raw time-series ingestion) | Inspect uncompressed PSI-69 ASCII files in Phase 1 pre-ingestion task. | **OPEN** |
| **GAP-02** | BASS-II (`PSI-25`) | Thermocouple rake channel numbering (TC1 through TC8) and raw sampling rates are unmapped. | Ingestion parser cannot assign channel coordinates or radiation corrections to thermocouple logs. | BASS-II hardware operations manual and channel mapping sheet. | **NO** (Blocks raw thermal logs; does not block flammability boundary mapping) | Extract channel coordinate table from Olson & Ferkul (2017) appendix or PSI-25 docs. | **OPEN** |
| **GAP-03** | BASS-II (`PSI-25`) | Flat PMMA sheet spread rates belong to secondary BASS-II publications (Zhao et al.) rather than Olson & Ferkul (2017). | Attributing flat sheet spread to Olson 2017 causes citation and geometry conflicts. | Formal registration of Zhao et al. (*Proc. Combust. Inst.*, 2017) in Source Register. | **NO** | Add secondary BASS-II source register entry for flat PMMA fuel samples. | **OPEN** |
| **GAP-04** | Saffire-I (`PSI-98`) | Cabin pressure rise ($\Delta P \approx 3.8\text{ kPa}$) lacks verified raw telemetry channel identifier. | Claim is a derived theoretical estimate, not an empirical sensor log. | Cygnus OA-6 cabin environmental transducer CSV log. | **NO** | Label parameter as `DERIVED_ESTIMATE` with ideal gas thermal expansion formula. | **RESOLVED IN PRINCIPLE** |
| **GAP-05** | Schema (`EnvironmentalConditions`) | Canonical schema requires non-nullable `flow_velocity_cm_s`, `ambient_temp_k`, and `external_radiant_flux_kw_m2`. | Enforcing non-null numbers forces pipelines to invent dummy zeros for quiescent or non-heated rigs. | Approval of nullability extensions from `docs/hco_schema_change_proposal.md`. | **YES** (Blocks strict typed ingestion without data corruption) | Formalize schema update in Phase 1 before running Python parsers. | **OPEN** |
| **GAP-06** | Schema (`FuelSpec`) | Representation of woven composite blends (75% cotton / 25% fiberglass SIBAL) in chemical formula field. | SIBAL cannot be described by a single chemical formula; cotton pyrolyzes while fiberglass remains intact. | Multi-component blend representation in `FuelSpec`. | **NO** | Allow `chemical_formula: null` with structured `material_components` map. | **OPEN** |
| **GAP-07** | Pipeline Accessibility | NASA PSI repository does not provide a public REST API for automated data downloading. | Ingestion scripts cannot run automated `curl`/`fetch` loops to pull raw data. | Pre-downloaded and verified archive bundles in a structured local cache directory. | **YES** (Requires manual pre-download protocol) | Establish local `data/raw/psi/` archive caching workflow for Phase 1. | **OPEN** |

---

## 7. Next Phase Readiness & Navigation

### 7.1 Status of Pre-Event Preparation
With the completion of this mapping blueprint:
* **Phase 0 (Challenge Review)**: Fully audited requirements and competition rules.
* **Phase 0.5 (Ground-Truth Audit)**: Identified DOI collisions, corrected Saffire pressure to $101.3\text{ kPa}$, and proposed `ScientificValue<T>`.
* **Phase 0.7 (Knowledge Architecture)**: Established 3 Obsidian Canvas maps and 2 documentation templates.
* **Phase 0.8 (Scientific Evidence Audit)**: Built 24-point claim register and whitelisted verified empirical evidence.
* **Phase 0.9 (Pre-Ingestion Contract Mapping)**: Reconciled audit counts, established data contract boundaries, generated the Mapping Manifesto, and cataloged 7 concrete mapping gaps.

### 7.2 Boundary Notice
This document represents an architectural and scientific readiness specification. It does **not** signify that database implementation, Python ETL scripts, or API endpoints have been implemented. In compliance with NASA Space Apps rules, software implementation remains strictly on standby.
