# Phase 1.0 — Official Challenge Requirement Traceability

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead:** Aniket Nandi (Kolkata, IST)  
**Checkpoint Date:** October 28, 2026 (Official Challenge Release Milestone)  
**Preparation Baseline:** Commit `832a9ba` (Phase 0.99 Pre-Flight Handoff)  
**Target Event:** NASA Space Apps Challenge 2026 (November 14–15, 2026)  
**Document Status:** Complete & Verified Baseline  
**Mode:** Official challenge verification and scope review (Documentation-only)  

---

## 1. Executive Summary & Challenge Baseline

This document performs the authoritative requirements audit for project **FIRELINE** against the complete, officially published NASA Space Apps Challenge 2026 challenge specification:

* **Official Challenge Title:** **“Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data”**
* **Host Organization:** NASA Biological and Physical Sciences (BPS) Division in partnership with NASA International Space Apps Challenge 2026
* **Official Challenge URLs:**
  * Portal: `https://www.spaceappschallenge.org/2026/`
  * Directory: `https://www.spaceappschallenge.org/2026/challenges/`
  * Repository References: NASA Physical Sciences Informatics (`https://psi.nasa.gov/`), NASA Technical Reports Server (`https://ntrs.nasa.gov/`)
* **Core Scientific Problem:** On Earth, gravity drives buoyancy-induced convection, producing teardrop flames and rapid exhaust removal. In microgravity, flames become rounded or spherical, soot transport is radically altered, extinction limits shift, and materials can smolder or spread unexpectedly under low forced airflows. While decades of microgravity combustion data exist (drop towers, parabolic flights, ISS CIR experiments, BASS/BASS-II, FLEX, Saffire), they are fragmented across isolated archives, heterogeneous tables, and technical PDFs.
* **Core Engineering Objective:** Build an interactive, AI-powered research platform and decision-support system that compiles, structures, interprets, compares, and visualizes NASA microgravity combustion data to deliver actionable spacecraft fire-safety insights for future exploration (Artemis, lunar habitats, and Mars transit).

---

## 2. Official Requirement Traceability Matrix

The table below translates the official challenge expectations into explicit, testable engineering statements, evaluating FIRELINE's planned coverage:

| Requirement ID | Official Requirement Statement | Source Reference | Requirement Type | FIRELINE Coverage | Coverage Status | Priority | Required Action | Evidence Needed | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| **NASA-REQ-001** | Ingest and structure heterogeneous microgravity combustion data from NASA flight campaigns (e.g., BASS/BASS-II, Saffire, FLEX). | Official Challenge Statement § Background & Data Sources | Data Ingestion | Canonical HCO schema; Pre-Ingestion Data Contract (`docs/phase09_pre_ingestion_contract_mapping.md`); Day 1 Backlog `TASK-D1-05` | **Satisfied by Plan** | Critical | Ingest BASS-II (`PSI25-ART-002`) and Saffire-I (`PSI98-ART-002`) in initial slice; defer uncalibrated/droplet runs. | Verified database rows in PostgreSQL with source run IDs. | **Retain** |
| **NASA-REQ-002** | Preserve critical physical boundary conditions: material/fuel, oxygen concentration, flow velocity, ambient pressure, and specimen geometry. | Official Challenge Statement § Objectives | Scientific / Physical Data | Canonical HCO `EnvironmentalCondition`, `MaterialSample`; Pydantic models (`TASK-D1-04`); `REQ-INGEST-10` to `15` | **Satisfied by Plan** | Critical | Enforce strict non-null boundary validation; reject non-physical conditions ($O_2 \le 0$, $P \le 0$). | Acceptance tests `TEST-D01`, `TEST-E01`; database `CHECK` constraints. | **Retain** |
| **NASA-REQ-003** | Provide an interactive, searchable dashboard or research platform allowing users to explore and query microgravity combustion behavior. | Official Challenge Statement § Expected Deliverables | Functional / Usability | Next.js Evidence Explorer UI (`/explorer`, `TASK-D1-07`); PostgreSQL full-text search API (`/api/evidence/search`, `TASK-D1-06`) | **Satisfied by Plan** | Critical | Build responsive research query interface with material, oxygen, and airflow filters. | Functional UI running on `localhost:3000` with instant filter updates. | **Retain** |
| **NASA-REQ-004** | Enable cross-experiment comparison of flame spread rates, extinction limits, and combustion outcomes across distinct test conditions. | Official Challenge Statement § Core Objectives | Scientific / Analytical | Side-by-Side Comparison Drawer (`/compare`, `TASK-D1-09`); `REQ-INGEST-30` to `33` | **Satisfied by Plan** | High | Implement deterministic comparison view with physical compatibility checks on specimen aspect ratio and chamber duct scale. | Acceptance tests `TEST-I01` to `TEST-I03`; UI comparison table. | **Retain** |
| **NASA-REQ-005** | Synthesize actionable fire-safety insights for spacecraft design and deep-space missions (e.g., Artemis, lunar habitats, Mars transit). | Official Challenge Statement § Impact & Relevance | Scientific / Decision Support | Mission Assessor & Evidence Summary Cards (`TASK-D1-08`); Grounded Explanations (`TASK-D1-11`) | **Satisfied by Plan** | High | Add mission scenario query presets (e.g., *"Exploration Atmosphere: 34% O2 at 8.2 psia"* vs. *"Standard Sea Level"*). | Presets returning relevant Saffire/BASS runs with fire safety implications. | **Retain** |
| **NASA-REQ-006** | Integrate AI/ML to interpret, summarize, or rank microgravity combustion research findings grounded in authoritative data. | Official Challenge Statement § AI Tooling & Methods | AI / Retrieval | Gemini API Grounded Explanations (`/api/copilot/explain`, `TASK-D1-11`); Deterministic Relevance Classifier (`REQ-INGEST-28`, `29`) | **Satisfied by Plan** | High | Enforce strict citation resolution guardrails: every generated statement must cite an exact flight run ID; fallback cleanly if API unavailable. | Test `TEST-G01`; verified JSON with 100% resolvable citations. | **Retain** |
| **NASA-REQ-007** | Explicitly identify evidence gaps, research limitations, and untested experimental regimes where microgravity data is missing. | Official Challenge Statement § Scientific Integrity & Gaps | Scientific Integrity | Evidence-Gap Indicator & Boundary Range Checker (`TASK-D1-10`); `REQ-INGEST-37`, `38` | **Satisfied by Plan** | High | Display explicit `EVIDENCE_GAP` badge when queried conditions exceed NASA flight envelopes (e.g., airflow $<1.0\text{ cm/s}$ or pressure $<0.5\text{ atm}$). | Acceptance tests `TEST-F02`, `TEST-F03`; amber UI warning badge. | **Retain** |
| **NASA-REQ-008** | Preserve full source provenance, original units, and direct linkage to NASA Technical Reports (NTRS) and PSI repository records. | Official Challenge Statement § Data Policy & Attribution | Provenance / Attribution | Source Location Schema; Dual Original/Normalized Units (`REQ-INGEST-01`, `02`, `20` to `23`); Acceptance Test Family A | **Satisfied by Plan** | Critical | Preserve reported values and engineering units ($psia$, $in$, $ft/min$) alongside SI units; link every card to NASA PSI/DOI URLs. | Detail Inspector view (`/evidence/[runId]`) displaying active external links. | **Retain** |
| **NASA-REQ-009** | Prevent scientifically invalid mathematical extrapolation or conflation between fundamentally incompatible experimental regimes. | Official Challenge Statement § Scientific Rigor & Physics | Physical Safeguards | Physical Comparability Gating (`REQ-INGEST-30` to `33`); Acceptance Test Family I; `DEC-01`, `DEC-04` | **Satisfied by Plan** | Critical | Enforce automated comparability warning when comparing narrow-duct samples ($1\text{ cm}$) to large cargo panels ($100\text{ cm}$). | Test `TEST-I01`; amber compatibility warning banner in comparison view. | **Retain** |
| **NASA-REQ-010** | Meet official Space Apps submission criteria: public code repository, English project description, demo video, and clear solution demonstration. | Official Challenge Statement § Submission Requirements | Submission & Compliance | Public GitHub repository; 3-minute hackathon demo script (`docs/phase099_hackathon_handoff_brief.md` § 10) | **Satisfied by Plan** | Critical | Rehearse timed presentation narrative; maintain clean Git repository without credentials; record backup HD video. | Active GitHub repository URL and 240-second pitch video. | **Retain** |

---

## 3. Analysis of Challenge Scope & Candidate Investigations

The official challenge explicitly highlights microgravity combustion campaigns conducted aboard the ISS, drop towers, and Cygnus vehicles. Below is the alignment review for each candidate investigation:

```
┌────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE INVESTIGATION ALIGNMENT AUDIT                                │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Investigation     │ Challenge Relevance│ Pre-Flight Ingestion Status    │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ BASS / BASS-II    │ EXPLICITLY CITED  │ APPROVED FOR DAY 1 SLICE       │
│ (ISS PSI-25)      │ Primary solid fuel│ Thin-film PMMA runs verified.  │
│                   │ narrow duct flow  │ Fan index runs quarantined.    │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Saffire-I         │ HIGH RELEVANCE    │ APPROVED FOR DAY 1 SLICE       │
│ (Cygnus PSI-98)   │ Large-scale cargo │ Sample pre-test dims verified. │
│                   │ vehicle panel fire│ Raw thickness preserved.       │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ FLEX / FLEX-2     │ CITED (LIQUIDS)   │ DEFERRED FROM INITIAL SLICE    │
│ (ISS PSI-69)      │ Droplet extinction│ Blocked by DEC-02 nullability; │
│                   │ and spherical fire│ reserved for Phase 2/P3.       │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ SoFIE / MIST      │ CITED (FUTURE)    │ DEFERRED FROM INITIAL SLICE    │
│ (ISS PSI-104)     │ Narrow channel    │ Insufficient pre-flight table  │
│                   │ material ignition │ inspection; reserved for P3.   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 1. BASS & BASS-II (PSI-25) — Primary Solid Fuel Anchor
* **Challenge Context:** Specifically mentioned in challenge background materials as a foundational NASA study of solid material flammability and suppression under low concurrent flow in microgravity.
* **FIRELINE Role:** Core Day 1 empirical foundation. Ingest verified flat PMMA thin-film summary table (`PSI25-ART-002`). Uncalibrated fan index runs remain quarantined per `DEC-04`.

### 2. Saffire-I (PSI-98) — Large-Scale Spacecraft Safety Anchor
* **Challenge Context:** Direct spacecraft fire-safety relevance: testing real vehicle materials (SIBAL cotton/fiberglass composite fabric, thick PMMA) in an actual uncrewed Cygnus cargo capsule under controlled airflow ($20\text{ cm/s}$).
* **FIRELINE Role:** Essential comparator for scale effects. Ingest flat pre-test specimen records (`PSI98-ART-002`). Store verbatim reported dimensions; automated thickness normalization remains blocked per `DEC-01`.

### 3. FLEX & FLEX-2 (PSI-69) — Quiescent Droplet Combustion
* **Challenge Context:** Studies spherical droplet combustion and radiative extinction limits in the Combustion Integrated Rack (CIR).
* **FIRELINE Role:** Although scientifically valuable for droplet physics, FLEX remains **deferred from the Day 1 vertical slice** due to `DEC-02` (canonical HCO non-nullable flow fields) and chamber geometry differences. Planned for Phase 2 / Day 2 expansion.

### 4. SoFIE (Solid Fuel Ignition and Extinction, PSI-104)
* **Challenge Context:** Modern ISS combustion insert studying material ignition in low flow.
* **FIRELINE Role:** Uninspected raw tables pre-flight. Deferred from initial MVP to preserve execution focus.

---

## 4. Key Traceability Findings

1. **100% Requirement Alignment:** Every official challenge requirement (`NASA-REQ-001` through `NASA-REQ-010`) is directly mapped to FIRELINE's planned capabilities, acceptance tests, and architecture.
2. **No Fundamental Architectural Incompatibility:** The official challenge demands structured access, cross-comparison, physical boundary retention, and explainable AI insights—which matches FIRELINE's 6-level authority hierarchy and evidence-first design.
3. **Validation of Physical Gating:** The challenge emphasizes the danger of invalid assumptions across differing microgravity regimes. This directly validates FIRELINE's **Physical Comparability Gating** (`TEST-I01` to `TEST-I03`) as a primary scientific differentiator.
4. **Validation of Evidence Gaps:** The official challenge highlights that mission planners frequently need to know what has *not* been tested before designing new missions. This directly confirms FIRELINE's **Evidence-Gap Indicator** (`TASK-D1-10`) as an essential feature.
