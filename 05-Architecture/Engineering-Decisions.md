# Engineering Decision Log (ADRs)
**Workspace**: `05-Architecture`  
**Standard**: CIPHER Architectural Decision Framework (*Decode. Build. Evolve.*)  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Last Updated**: October 10, 2026

---

## Index of Architectural Decisions

* **ADR-001**: Role Separation — Obsidian for Knowledge Management vs. PostgreSQL for Runtime Operations
* **ADR-002**: Dual Value Representation (`ScientificValue<T>`) and Retention of Original Units
* **ADR-003**: Explicit Nullability and Prohibition of Zero-Filling for Unmeasured Variables
* **ADR-004**: Data Verification Gating and Exclusion of Synthetic Data from Production Retrieval
* **ADR-005**: Replacement of 4D Geometric Triangulation with a Deterministic 4-Tier Gated Rule Classifier
* **ADR-006**: Mandatory Cryptographic / CrossRef Citation Verification for Evidence Claims
* **ADR-007**: Core Technology Stack Selection for Production Solution

---

### ADR-001: Role Separation — Obsidian for Knowledge Management vs. PostgreSQL for Runtime Operations
* **Status**: **APPROVED**
* **Context**: FIRELINE requires managing heterogeneous scientific papers, qualitative reasoning, engineering trade-offs, and experimental datasets. A single tool cannot serve as both researcher notebook and high-throughput application backend.
* **Decision**: Adopt Obsidian exclusively as the **Scientific Knowledge Management and Engineering Documentation Layer**. PostgreSQL (with `pgvector`) will serve as the runtime operational database during hackathon deployment.
* **Alternatives Considered**:
  1. *Using Obsidian/Markdown as the runtime query engine*: Rejected due to lack of ACID transactions, slow relational joins across tens of thousands of telemetry rows, and difficulty indexing multi-parameter ranges.
  2. *Storing all research notes in PostgreSQL text columns*: Rejected because it eliminates human-readable version control, visual Canvas mapping, and researcher ergonomics during prep.
* **Rationale**: Decouples research synthesis from application runtime performance. Notes remain portable Markdown files in Git.
* **Consequences**: Changes in Obsidian notes do not automatically update runtime database tables; an explicit ingestion/migration step is required.
* **Related Documents**: [[FIRELINE-Home]], [[01-Research/Source-Register]]

---

### ADR-002: Dual Value Representation (`ScientificValue<T>`) and Retention of Original Units
* **Status**: **APPROVED**
* **Context**: Real NASA test rigs report data in diverse engineering units (e.g., pressure in $psia$, velocity in $ft/min$, dimensions in inches). Converting values directly to SI units in-place destroys traceability back to the original flight log.
* **Decision**: All quantitative measurements and environmental parameters must use the `ScientificValue<T>` construct, storing `raw_value`, `raw_unit`, and `source_column_header` alongside `normalized_value` and `normalized_unit`.
* **Alternatives Considered**:
  1. *Store only normalized SI values*: Rejected. Inability to trace a number back to its source table cell undermines auditability during scientific judging.
  2. *Store only raw values and compute conversions dynamically*: Rejected. Runtime distance queries and scaling calculations would require repeated, computationally wasteful unit conversions.
* **Rationale**: Guarantees complete bidirectional auditability: researchers can inspect the exact raw measurement while the search engine operates on unified SI metrics.
* **Related Documents**: [[docs/hco_schema_change_proposal|docs/hco_schema_change_proposal.md]]

---

### ADR-003: Explicit Nullability and Prohibition of Zero-Filling for Unmeasured Variables
* **Status**: **APPROVED**
* **Context**: NASA combustion rigs vary in instrumentation. For example, quiescent droplet chambers have no flow velocity ($u = \text{null}$); standard solid fuel glovebox runs do not feature external radiant heating ($\dot{q}''_{ext} = \text{null}$).
* **Decision**: All unmeasured or uncalibrated variables must be modeled as strictly nullable (`ScientificValue<T> | null`). Ingestion pipelines are forbidden from substituting `0` or default constants for missing parameters.
* **Alternatives Considered**:
  1. *Zero-filling missing variables*: Rejected. Setting missing flow velocity to `0.0 cm/s` falsely asserts a quiescent stagnation condition; setting missing radiant flux to `0.0 kW/m²` masks the fact that radiant heating was never evaluated.
* **Rationale**: Preserves scientific honesty. A condition is either experimentally characterized or unknown.
* **Consequences**: The evidence classifier must explicitly check for `null` before computing scaling metrics.
* **Related Documents**: [[docs/hco_schema_change_proposal|docs/hco_schema_change_proposal.md]]

---

### ADR-004: Data Verification Gating and Exclusion of Synthetic Data from Production Retrieval
* **Status**: **APPROVED**
* **Context**: Phase 0.5 audit proved that mock or illustrative test fixtures easily look identical to empirical findings unless strict metadata barriers exist.
* **Decision**: Introduce a mandatory `verification_status` enumeration on every record:
  * `VERIFIED_EMPIRICAL`
  * `PARTIALLY_VERIFIED`
  * `PRELIMINARY_UNAUDITED`
  * `SYNTHETIC_ILLUSTRATIVE`
  Production search, ranking, evidence-gap calculation, and AI explanation layers must filter out `SYNTHETIC_ILLUSTRATIVE` records via database query constraints.
* **Alternatives Considered**:
  1. *Relying on developer discipline to avoid committing mock data*: Rejected. Unreliable during high-speed hackathons.
* **Rationale**: Guarantees that synthetic test fixtures never compromise scientific credibility.
* **Related Documents**: [[docs/source_verification_matrix|docs/source_verification_matrix.md]], [[docs/phase05_exit_report|docs/phase05_exit_report.md]]

---

### ADR-005: Replacement of 4D Geometric Triangulation with a Deterministic 4-Tier Gated Rule Classifier
* **Status**: **APPROVED**
* **Context**: The proposed 4D Delaunay triangulation failed on multiple mathematical grounds: sample underflow ($N < 5$), subspace collapse on $g = 0$, singular covariance matrices on constant variables, and physical blindness to fuel phase and combustion phenomena.
* **Decision**: Replace geometric convex-hull calculation with a **Deterministic 4-Tier Gated Rule Classifier**:
  1. *Tier 1: Phenomenon Match* (Strict binary)
  2. *Tier 2: Fuel Phase & Chemistry Compatibility* (Solid vs. Liquid vs. Gas; material analogues)
  3. *Tier 3: Geometry & Thermal Regime* (Thermally thin $Bi < 0.1$ vs. thermally thick $Bi > 1.0$)
  4. *Tier 4: Environmental Parameter Windows* (Physical scaling tolerance bands)
  Outputs strictly return `SUPPORTED`, `INFERRED`, or `EVIDENCE_GAP` alongside auditable reason codes.
* **Alternatives Considered**:
  1. *Projecting to a 3D Delaunay hull (dropping g)*: Rejected. Still fails to address fuel phase, geometry, and non-linear chemical extinction cliffs.
  2. *Training a machine learning classifier (e.g. Random Forest / SVM)*: Rejected due to severe data sparsity and lack of negative flammability boundary labels across heterogeneous rigs.
* **Rationale**: Transparent, deterministic, and physically defensible.
* **Related Documents**: [[docs/evidence_classifier_review|docs/evidence_classifier_review.md]]

---

### ADR-006: Mandatory DOI & Source Table Verification for Evidence Claims
* **Status**: **APPROVED**
* **Context**: Phase 0.5 audit discovered that 100% of preliminary example DOIs were hallucinated or misattributed to unrelated chemistry literature.
* **Decision**: All DOIs attached to empirical findings must be verified against CrossRef / ScienceDirect before indexing. Ingestion pipelines must validate DOI resolution and paper title match.
* **Alternatives Considered**:
  1. *Allowing manual entry without automated verification*: Rejected. Proven to produce catastrophic attribution errors.
* **Rationale**: Guarantees scientific auditability during NASA Space Apps judging.
* **Related Documents**: [[docs/source_verification_matrix|docs/source_verification_matrix.md]]

---

### ADR-007: Core Technology Stack Selection for Production Solution
* **Status**: **APPROVED**
* **Context**: System architecture must balance rapid hackathon iteration, high-performance visual storytelling, rigorous scientific data modeling, and auditable LLM reasoning.
* **Decision**: Lock the following technology stack for implementation:
  * **Frontend**: Next.js (App Router) + TypeScript + Vanilla CSS / Tailwind CSS + Framer Motion.
  * **Data & Storage**: Supabase PostgreSQL (relational tables for investigations, runs, and findings) + `pgvector` (for hybrid parametric & semantic retrieval).
  * **Scientific Ingestion**: Python (Pandas / NumPy) for parsing NASA ASCII, CSV, and tabular data into validated JSON/PostgreSQL schemas.
  * **Reasoning Layer**: Google Gemini API via official SDK for structured evidence synthesis grounded exclusively in verified retrieved finding IDs.
  * **Design Tokens**: CIPHER agency brand palette (`#0F1013` Ink, `#F2EFE8` Bone, `#E0A45C` Copper, `#10B981` Emerald, `#F59E0B` Amber) with Space Grotesk / Manrope typography.
* **Rationale**: Fits agency core competencies and provides robust scientific data handling.
* **Related Documents**: [[FIRELINE-Home]]
