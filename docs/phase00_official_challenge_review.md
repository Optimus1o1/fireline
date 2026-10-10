# Phase 0: Official Challenge Review & Requirements Traceability
**Project**: FIRELINE (Fire Intelligence & Research Evidence Linkage Engine)  
**Challenge**: NASA Space Apps Challenge 2026 — *Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data*  
**Milestone**: Phase 0 — Official Challenge Review  
**Status**: COMPLETE — AUDITED & TRACEABLE  
**Author**: Lead Systems Engineer & Verification Team (CIPHER)  
**Date**: October 10, 2026

---

## 1. Executive Summary

Phase 0 establishes the authoritative baseline for FIRELINE by auditing the official NASA Space Apps Challenge 2026 challenge statement, resource guidelines, submission deliverables, judging rubrics, and development rules. 

The challenge—**"Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data"**—tasks teams with transforming decades of heterogeneous, fragmented microgravity combustion research into an interactive, AI-powered decision support system that summarizes, ranks, and interprets experimental data to inform spacecraft fire safety protocols for lunar and Martian missions.

This review confirms that the redesigned FIRELINE architecture (centering on **Finding Ranking**, the **Evidence Chain**, **Tri-Classification**, and **Evidence Gap Quantification**) aligns directly with NASA's problem statement. Crucially, it eliminates the scientific invalidity of speculative "fire risk calculators," satisfying the core judging criteria of **Validity**, **Impact**, **Creativity**, and **Best Use of Data**.

---

## 2. Official Challenge Requirements & Source References

### 2.1 Challenge Statement & Scope
* **Challenge Title**: *Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data*
* **Sponsoring Agency**: National Aeronautics and Space Administration (NASA)
* **Access Date**: October 10, 2026
* **Source URL**: `https://www.spaceappschallenge.org/`
* **Official Problem Statement**:
  > As humanity prepares for long-duration missions to the Moon and Mars, understanding fire behavior in reduced gravity and non-terrestrial spacecraft atmospheres is critical. Decades of NASA microgravity combustion experiments (spanning droplets, solid fuels, and full-scale vehicle tests) exist across technical reports, raw tabular data, and publications. However, this valuable evidence is fragmented, making it difficult for mission planners and safety engineers to synthesize. Participants must develop an interactive, AI-powered system to summarize, rank, and interpret this microgravity combustion data to deliver actionable fire safety intelligence.

### 2.2 Expected Users & Intended Impact
* **Target Users**: Spacecraft systems engineers, mission architecture planners (Artemis Lunar Gateway, Mars Transit Habitats), fire safety researchers, and materials science flight investigators.
* **Intended Impact**:
  1. Accelerate synthesis of historical microgravity combustion research.
  2. Ground material flammability assessments in verified NASA experimental data rather than ungrounded terrestrial approximations.
  3. Identify untested environmental regimes (Exploration Atmospheres: low pressure, elevated $O_2$, partial gravity) to guide future research payloads.

### 2.3 Official Resources & Datasets
* **Primary Repository**: NASA Physical Sciences Informatics (PSI) system (`https://psi.nasa.gov`).
  * Target Investigations: FLEX (PSI-69), BASS-II (PSI-25), Saffire-I through VI (PSI-98), SoFIE-MIST (PSI-104), SPICE (PSI-107).
* **Ancillary Repositories**: NASA Technical Reports Server (NTRS), NASA Task Book (`https://taskbook.nasaprs.com/`), and peer-reviewed flight publications (*Combustion and Flame*, *Proceedings of the Combustion Institute*).

---

## 3. Requirements Traceability Matrix (RTM)

| Req ID | Official Requirement / Problem Statement | Official Source | FIRELINE Architectural Capability | Planned Phase | Acceptance Criterion | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | **Summarize Microgravity Research**: Aggregate heterogeneous combustion experiments into a unified, accessible structure. | NASA Challenge Brief ("Flame in Freefall") | Harmonized Combustion Ontology (HCO) with normalized SI parameters alongside raw telemetry. | Phase 1 (Ingestion) & Phase 3 (Explore UI) | 100% of indexed findings map to normalized boundary conditions ($g, P, X_{O_2}, u_\infty$, fuel) without zero-filling missing variables. | `CONFIRMED` |
| **REQ-02** | **Rank Experimental Evidence**: Surface and prioritize the most relevant empirical findings for a specific research or safety question. | NASA Challenge Brief ("Summarize, Rank, and Interpret") | Finding-Level Ranking Engine based on environmental proximity, phenomenon match, and measurement rigor. | Phase 2 (Classification & Ranking) | System ranks specific experimental *findings* (with condition deltas) rather than arbitrary aggregate project scores. | `CONFIRMED` |
| **REQ-03** | **Interpret Fire Behavior & Extinction Limits**: Explain physical mechanisms governing combustion under altered gravity and ventilation. | NASA Challenge Brief ("Deliver actionable insights") | Evidence Chain DAG linking claims to raw sensor logs, optical observations, and verified primary citations. | Phase 2 (Engine) & Phase 3 (UI / AI) | Every generated summary cites specific Run IDs and DOIs verified against CrossRef/NASA PSI. | `CONFIRMED` |
| **REQ-04** | **Support Exploration Mission Planning**: Evaluate fire safety implications for Moon/Mars exploration atmospheres ($56\text{–}70\text{ kPa}$, elevated $O_2$, partial gravity). | NASA Challenge Brief ("Lunar and Martian exploration") | Mission Assessor Mode (`ASSESS`) with Tri-Classification (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`). | Phase 2 & Phase 3 | Deterministic rule classifier prevents false claims of empirical support in untested partial-g/elevated-$O_2$ regimes. | `CONFIRMED` |
| **REQ-05** | **Identify Knowledge & Research Gaps**: Highlight where existing NASA evidence is insufficient to characterize fire behavior. | NASA Challenge Brief ("Actionable intelligence") & PSI Mission | Evidence Gap Engine with axis-by-axis dimensional deficit and Next Experiment protocol generator. | Phase 2 & Phase 3 | Displays exact parameter coverage deficits and outputs prioritized experimental matrices for missing regions. | `CONFIRMED` |
| **REQ-06** | **Open Data Compliance**: Solution must strictly utilize official NASA open data assets. | NASA Global Submission Guide | Ingestion pipeline targeting open NASA PSI investigations (PSI-69, PSI-25, PSI-98). | Phase 1 (Ingestion) | All data records include active PSI URLs and verifiable flight run references. | `CONFIRMED` |
| **REQ-07** | **Interactive Web Deliverable**: Solution must provide an interactive, intuitive dashboard for users. | NASA Challenge Brief ("Interactive dashboard") | Next.js (App Router) interactive web application with Explore, Connect, and Assess views. | Phase 3 (UI Implementation) | Deployed, responsive web application accessible to judges with zero console errors. | `CONFIRMED` |
| **REQ-08** | **Public Code & Provenance**: Public open-source code repository with complete documentation. | NASA Global Submission Guide | Public GitHub repository containing complete source code, documentation, and MIT/Apache license. | Phase 4 (Deployment) | Public GitHub link submitted on team project page before submission deadline. | `CONFIRMED` |

---

## 4. Submission & Judging Requirements

### 4.1 Judging Criteria Mapping

| Judging Criterion | Published Definition | FIRELINE Strategic Alignment | Scientific Defense / Evidence |
| :--- | :--- | :--- | :--- |
| **Validity** | Grounded in sound science, data, and logic; realistic and technically feasible. | **Core Differentiator**: Completely rejects uncalibrated "fire risk percentages." Implements auditable Evidence Chains from query down to sensor channel, with deterministic 4-tier physical gating. | Eliminates halluncinated claims; separates direct evidence from scaling inference; enforces CrossRef DOI validation. |
| **Impact** | Potential benefit and positive difference for human space exploration. | Accelerates material flammability analysis for Artemis Lunar Gateway and Mars habitats; directly identifies untested atmospheric risks. | Generates prioritized "Next Experiment" matrices to inform future NASA drop tower and ISS flight payloads. |
| **Creativity** | Originality and innovation of the approach; novel use of NASA open data. | Inverts standard document RAG into an **Evidence Map** and **Parametric Gap Discovery Engine**. | Transforms static PSI tables into an active, interconnected combustion knowledge graph. |
| **Relevance** | Direct alignment with the challenge statement and problem provided by NASA. | Directly operationalizes the three mandate verbs: **Summarize** (HCO), **Rank** (Finding Ranker), **Interpret** (Evidence Chain). | Specifically targets exploration atmospheres ($56\text{–}70\text{ kPa}$, elevated $O_2$, partial gravity). |
| **Presentation** | Clarity, user experience, quality of demo materials and storytelling. | High-fidelity CIPHER design system (`#0F1013` Ink, `#F2EFE8` Bone, `#E0A45C` Copper); clear 3-minute video narrative. | Clean three-mode UI (Explore, Connect, Assess); concise, jargon-free scientific communication. |

### 4.2 Mandatory Submission Deliverables
1. **Team Project Page** on `spaceappschallenge.org`:
   * Project Title: **FIRELINE** (Fire Intelligence & Research Evidence Linkage Engine).
   * Short Description: One-line compelling scientific summary.
   * Detailed Project Narrative: Addressing Problem, Approach, Data Usage, and Findings.
   * Direct citations for all NASA datasets and open-source packages.
2. **Public Code Repository**:
   * Hosted on GitHub with clean commit history, README, setup instructions, and architecture docs.
3. **Demo Video / Presentation**:
   * Publicly accessible video link (YouTube / Vimeo / Drive). Recommended length: 2 to 3 minutes.
   * Must demonstrate the core workflow: *Ask Research Question $\to$ Inspect Evidence Chain $\to$ Evaluate Mission Scenario $\to$ Discover Evidence Gap*.

---

## 5. Development-Rule Constraints & Competition Boundaries

1. **Start of Development Restriction**:
   * *Rule*: Teams must not begin developing the actual competition solution (codebase, ingestion pipelines, database migrations, frontend UI) prior to the official hackathon start date (November 14, 2026).
   * *Compliance*: All current activities are strictly restricted to Phase 0 and Phase 0.5 (literature review, schema specification, source auditing, and architectural decision records). No application or pipeline code has been written.
2. **External Tools & AI APIs**:
   * *Rule*: External APIs, open-source libraries, and AI foundation models are permitted provided they are publicly documented, open-access or standard APIs, and properly cited in the final submission.
   * *Compliance*: Google Gemini API, Supabase PostgreSQL, and Next.js are open and standard technologies. All prompts and reasoning pipelines will be documented in the repository.
3. **Intellectual Property & Licensing**:
   * *Rule*: Submissions must be released under an open-source license.
   * *Compliance*: FIRELINE will be licensed under the MIT License.

---

## 6. Review of the Proposed MVP Architecture

### 6.1 Core MVP Capabilities
1. **EXPLORE Mode (Finding Search & Ranking)**:
   * Query across standardized combustion parameters ($g, P, X_{O_2}, u_\infty$, material).
   * Surfacing ranked empirical findings with condition deltas.
2. **CONNECT Mode (Interactive Evidence Graph)**:
   * Multi-layer bipartite visualization linking parameters to phenomena across independent investigations.
3. **ASSESS Mode ("Mission Question" Scenario Analyzer)**:
   * Input mission parameters (e.g., Exploration Atmosphere: $0.38g$, $70\text{ kPa}$, $32\% O_2$, PMMA).
   * Real-time Coverage Index and Tri-Classification (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`).
   * Axis-by-axis dimensional deficit breakdown and Next Experiment generator.
4. **Auditable Evidence Chain Drawer**:
   * Clickable step-by-step provenance: *Claim $\to$ Investigation $\to$ Run ID $\to$ Physical Sensor Reading $\to$ Peer-Reviewed DOI*.

### 6.2 Scope Hygiene: What Was Removed
* **Removed**: Uncalibrated "Fire Risk Percentage" (e.g., "Mars Fire Risk = 82%"). Replaced with scientifically defensible **Evidence Coverage %** and **Experimental Similarity**.
* **Removed**: Speculative predictive regression models (e.g., training XGBoost on sparse flight runs). Replaced with parametric similarity retrieval and physical scaling bounding.
* **Deprioritized**: Heavy 3D WebGL simulations. Prioritized clean 2D Canvas diagrams and sensor telemetry plots.

---

## 7. Scientific-Data Readiness Assessment

| Candidate Investigation | PSI Code | Identified? | Existence Confirmed? | Raw Dataset Inspected? | Measurements Verified? | Production Readiness Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FLEX** | `PSI-69` | ✅ YES | ✅ YES | 🟡 Archive structure inspected | 🟡 Partially verified (Nayagam 2015 paper confirmed; run table extraction pending) | **READY FOR INGESTION IN PHASE 1** |
| **BASS-II** | `PSI-25` | ✅ YES | ✅ YES | 🟡 Archive structure inspected | 🟡 Partially verified (Olson 2017 paper confirmed; run table extraction pending) | **READY FOR INGESTION IN PHASE 1** |
| **Saffire-I** | `PSI-98` | ✅ YES | ✅ YES | 🟡 Archive structure inspected | 🟡 Partially verified (Urban 2019 paper confirmed; pressure corrected to $101.3\text{ kPa}$) | **READY FOR INGESTION IN PHASE 1** |
| **SoFIE-MIST** | `PSI-104` | ✅ YES | ✅ YES | 🔴 Flight tables unindexed in open PSI | 🔴 Unverified (Flight tables pending) | **RETAIN AS SYNTHETIC / TEST FIXTURE ONLY** |

*Key Finding*: Three investigations (`FLEX`, `BASS-II`, `Saffire-I`) have verified primary literature and confirmed archive structures in PSI. They form the verified foundation for Phase 1 ingestion. `SoFIE-MIST` must remain tagged as `SYNTHETIC_ILLUSTRATIVE` to prevent unverified flight claims.

---

## 8. Conflicts Between Official Requirements & Current Plan

1. **Predictive Risk Modeling Expectation vs. Scientific Rigor**:
   * *Conflict*: Some casual interpretations of hackathon "AI fire safety" assume a predictive fire-spread simulator.
   * *Resolution*: FIRELINE explicitly demonstrates why microgravity non-linearities make blind extrapolation invalid, repositioning the system as an **Evidence-Supported Assessment & Gap Engine**. This directly elevates the project on the **Validity** rubric.
2. **Flight Telemetry Heterogeneity vs. Ingestion Timeline**:
   * *Conflict*: Real NASA PSI archives contain hundreds of megabytes of raw video files and bespoke CSVs with differing column headers. Attempting to parse raw videos during a 48-hour event is a high-risk trap.
   * *Resolution*: Scope Phase 1 ingestion strictly to **experimental run summary tables** and **calibrated sensor series** (thermocouples, radiometers, pressure transducers). Optical video frames are referenced by timestamp rather than processed with heavy computer vision models.

---

## 9. Unresolved Questions & Technical Risks

1. **PSI Ingestion Format**: Will the official challenge resources release a consolidated CSV export of the combustion tables, or will the team parse individual PSI package tables?
   * *Mitigation*: Develop modular Python parsers capable of handling individual PSI table formats.
2. **Partial Gravity Scaling Bounds**: Where does the boundary between `INFERRED` and `EVIDENCE_GAP` sit when scaling from $0g$ flight data to Lunar ($0.16g$) and Martian ($0.38g$)?
   * *Mitigation*: Any partial-gravity query evaluated against $0g$ data is classified as `INFERRED` with reason code `GRAVITY_REGIME_DISCREPANCY` (if within low-speed buoyant transition) or `EVIDENCE_GAP`.

---

## 10. Recommended Adjustments

1. **Formally Merge Schema Proposal**: Update the proposed TypeScript definitions in `docs/hco_schema_change_proposal.md` into the formal project schema before Phase 1 begins.
2. **Isolate Test Fixtures**: Move all synthetic examples (`FINDING-SOFIE-MIST-031`, etc.) into a dedicated `tests/fixtures/` directory, completely separating them from the production ingestion pipeline.
3. **Plan 3-Minute Video Script Early**: Design the demo flow around the 5-scene narrative (The Problem $\to$ Research Query $\to$ Evidence Chain $\to$ Mission Question $\to$ Next Experiment Discovery).

---

## 11. Explicit Phase 0 Exit Criteria

| Criterion ID | Description | Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **EXIT-01** | Exact challenge title, problem statement, and scope officially identified and documented. | ✅ **PASSED** | Documented in Section 2.1 (NASA Space Apps "Flame in Freefall"). |
| **EXIT-02** | Complete Requirements Traceability Matrix (RTM) created linking official requirements to FIRELINE capabilities. | ✅ **PASSED** | Documented in Section 3 (REQ-01 through REQ-08). |
| **EXIT-03** | Judging criteria mapped with documented scientific defense strategies. | ✅ **PASSED** | Documented in Section 4.1 (Validity, Impact, Creativity, Relevance, Presentation). |
| **EXIT-04** | Competition development rules audited and pre-competition compliance verified. | ✅ **PASSED** | Documented in Section 5 (Strict research/documentation boundary maintained). |
| **EXIT-05** | Scientific-data readiness assessed across all four target investigations. | ✅ **PASSED** | Documented in Section 7 (FLEX, BASS-II, Saffire-I cleared; SoFIE gated). |
| **EXIT-06** | All existing workspace documents inspected and preserved without deletion or overwrite. | ✅ **PASSED** | Verified via Git working-tree inspection. |

---

## 12. Recommendation on Proceeding to Phase 1

**VERDICT: READY FOR PHASE 1 STANDBY.**

Phase 0 requirements review is fully satisfied. The scientific thesis, requirements traceability, and judging strategies are formally locked. 

Per NASA competition rules, the team must **NOT** begin coding Phase 1 (data ingestion pipeline, database schemas, or frontend UI) until the official hackathon development window opens on **November 14, 2026**.

During the remaining preparation window, team efforts should focus exclusively on:
1. Deep-reading primary verified papers (Nayagam 2015, Olson 2017, Urban 2019).
2. Polishing Obsidian research notes in `01-Research/`.
3. Refining wireframes and the 3-minute presentation script.
