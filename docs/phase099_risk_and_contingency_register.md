# Phase 0.99 — Risk and Contingency Register

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead Engineer:** Aniket Nandi (Kolkata, IST)  
**Date of Assessment:** October 11, 2026  
**Document Status:** Comprehensive Pre-Flight Risk Matrix & Executable Contingency Plans  
**Mode:** Documentation-only, pre-event preparation  

---

## 1. Risk Management Framework

Building a scientific decision-support system in a 48-hour competitive hackathon requires strict risk containment. Uncontrolled architectural complexity, unresolved data discrepancies, or external API failures can derail an otherwise sound project.

FIRELINE applies an **Active Contingency Protocol**:
Every identified risk has an explicit detection trigger, an immediate mitigation strategy, and a **pre-approved fallback path** that preserves the working end-to-end user experience without sacrificing scientific truth.

### Risk Evaluation Scale:
* **Severity:** **High** (System unusable, scientific data corrupted, disqualification risk), **Medium** (Feature degraded, manual intervention needed), **Low** (Minor cosmetic or non-critical latency issue).
* **Likelihood:** **High** ($>50\%$ probability during event), **Medium** ($20\text{--}50\%$), **Low** ($<20\%$).

---

## 2. Audited Risk Matrix

| Risk ID | Category | Description & Trigger | Severity | Likelihood | Affected Scope | Prevention Strategy | Immediate Response | Approved Fallback Plan | Status |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| **RISK-DATA-01** | Scientific Data | **Primary Source Discrepancy & Unresolved Values:** Saffire-I thickness conflict (0.37 cm table vs ~0.4 mm paper) or BASS-II uncalibrated fan index triggers automated ingestion error. | **High** | **Medium** | Ingestion Pipeline (`TASK-D1-05`), Saffire/BASS Ingestion | Isolate open decisions (`DEC-01`, `DEC-04`); enforce verbatim raw storage rule without automated normalization. | Quarantine affected rows or store verbatim with `APPROXIMATED` flag; do not attempt automated unit conversion. | **Fallback:** Ingest BASS-II flat PMMA runs first (`PSI25-ART-002`); treat Saffire-I thickness as a verbatim descriptive string rather than a numerical constraint. | **Active & Mitigated** |
| **RISK-DATA-02** | Scientific Data | **Missing Critical Boundary Conditions:** Ingested runs lack ambient pressure, oxygen concentration, or flow velocity. | **High** | **Medium** | Evidence Filtering & Gating (`TASK-D1-05`, `09`) | Validate incoming rows against Pydantic model requiring $P > 0$ and $O_2 > 0$. | Flag row with `MISSING_BOUNDARY_CONDITION`; route row to quarantine. | **Fallback:** Exclude row from empirical search indices; display row in diagnostic audit view only. | **Active & Mitigated** |
| **RISK-DATA-03** | Scientific Data | **Incompatible Regime Conflation:** User attempts to extrapolate narrow-duct BASS-II flame spread to large-scale Saffire-I cargo panels. | **High** | **High** | Comparison View (`TASK-D1-09`) | Enforce physical comparability gate based on specimen width aspect ratio and chamber geometry. | Trigger amber warning banner in UI: *"Warning: Experimental regimes are physically incompatible."* | **Fallback:** Disable quantitative spread rate difference calculation; present qualitative side-by-side notes. | **Active & Mitigated** |
| **RISK-DATA-04** | Scientific Data | **Unit Ambiguity in Raw Source Columns:** Source CSV column lacks explicit unit header (e.g., bare numbers in column `velocity`). | **Medium** | **Low** | Data Normalization (`TASK-D1-04`, `05`) | Inspect raw tables pre-flight; lock column mapping dictionary before running ingestion script. | Abort import of ambiguous column; log warning in ingestion telemetry. | **Fallback:** Preserve column as un-normalized source string; do not convert to SI units. | **Active & Mitigated** |
| **RISK-ARCH-01** | Schema & Architecture | **Canonical HCO Schema Mismatch:** Droplet burning (FLEX) or composite fuel (SIBAL) violates canonical schema constraints (`DEC-02`, `DEC-05`). | **High** | **High** | Investigation Ingestion (`TASK-D1-03`, `05`) | Strictly scope initial Day 1 MVP to forced-flow solid combustion (`PSI98-ART-002`, `PSI25-ART-002`). | Defer FLEX droplet ingestion entirely; maintain canonical schema byte-integrity. | **Fallback:** Exclude droplet combustion from MVP; document as Phase 2 extension in submission brief. | **Active & Mitigated** |
| **RISK-ARCH-02** | Schema & Architecture | **Synthetic Test Data Leakage:** Fixtures marked `SYNTHETIC_ILLUSTRATIVE` appear in empirical search results or evidence cards. | **High** | **Low** | Search API (`TASK-D1-06`, `07`) | Add mandatory `WHERE is_synthetic = FALSE` filter to all public search queries; enforce `TEST-G01`. | Immediately rerun database purge script for records tagged `SYNTHETIC_ILLUSTRATIVE`. | **Fallback:** Store synthetic test fixtures in isolated SQLite test database, never in production Supabase tables. | **Active & Mitigated** |
| **RISK-ARCH-03** | Schema & Architecture | **Quarantine Storage Architecture Deadlock:** Lack of approved quarantine database table (`DEC-03`) delays pipeline execution. | **Medium** | **Medium** | Ingestion Script (`TASK-D1-05`) | Implement quarantine in-memory / local JSON logging rather than blocking on database migrations. | Route rejected rows to `quarantine_records.json` on local filesystem; proceed with valid rows. | **Fallback:** Log quarantined records to standard output; write only valid records to PostgreSQL. | **Active & Mitigated** |
| **RISK-ARCH-04** | Schema & Architecture | **Tech Stack Over-Engineering & Time Sinks:** Attempting to configure Neo4j, pgvector, or GraphQL consumes excessive Day 1 hours. | **High** | **Medium** | Backend Services (`TASK-D1-03`, `06`) | Mandate minimal pragmatic stack: Next.js App Router, PostgreSQL via Supabase, REST Route Handlers. | Stop configuration work if setup exceeds 45 minutes; switch to direct PostgreSQL queries. | **Fallback:** Use PostgreSQL relational queries and full-text search (`to_tsvector`); eliminate graph and vector layers entirely. | **Active & Mitigated** |
| **RISK-AI-01** | AI & Retrieval | **Gemini API Credentials Unavailable or Rate Limited:** Network interruption, quota exhaustion, or API key errors block copilot responses. | **Medium** | **High** | AI Copilot (`TASK-D1-11`) | Architect AI copilot as an optional enhancement layer, decoupled from core search and comparison. | Catch API error; display deterministic rule-based summary template with raw source citations. | **Fallback:** Disable `/api/copilot/explain` route; rely 100% on deterministic Evidence Explorer and Comparison Drawer. | **Active & Mitigated** |
| **RISK-AI-02** | AI & Retrieval | **Hallucinated Scientific Citations:** LLM generates non-existent NASA run numbers, paper titles, or numerical flame velocities. | **High** | **Medium** | AI Copilot (`TASK-D1-11`) | Prompt Gemini with strict JSON schema and retrieved context only; enforce post-generation citation validation. | Invalidate AI response if cited run ID does not match input context; substitute deterministic summary. | **Fallback:** Display retrieved NASA PSI raw table excerpt directly without AI synthesis. | **Active & Mitigated** |
| **RISK-AI-03** | AI & Retrieval | **Relevance Score Misinterpreted as Fire Probability:** Users or judges assume 92% match score represents 92% ignition risk. | **High** | **Medium** | Explorer UI (`TASK-D1-07`, `08`) | Explicitly label all matching metrics as *"Experimental Condition Match"* or *"Research Relevance Index"*. | Add persistent UI disclaimer: *"Scores reflect parameter similarity, not physical fire or ignition probability."* | **Fallback:** Remove percentage score; replace with discrete match categories (`EXACT_MATCH`, `PARTIAL_MATCH`). | **Active & Mitigated** |
| **RISK-DEL-01** | Delivery & Competition | **Official Challenge Statement Drift (Oct 28 Milestone):** Full challenge statement released on October 28 alters preferred problem focus. | **High** | **Medium** | Day 1 Backlog Scope (`TASK-D1-01`) | Review materials immediately on Oct 28 at mandatory checkpoint; adjust backlog prioritization before kickoff. | Reclassify feature priorities (P0/P1/P2) during Day 0 review window; keep core data engine intact. | **Fallback:** Adapt research query presets to align with new challenge themes; keep underlying PSI data engine. | **Active & Mitigated** |
| **RISK-DEL-02** | Delivery & Competition | **Deployment Failure on Vercel Near Deadline:** Build errors, environment variable mismatches, or SSR timeouts prevent live URL deployment. | **High** | **Medium** | Production Release | Execute continuous staging deployments from Hour 4 onwards; run `npm run build` after every task. | Roll back to previous verified Vercel preview deployment commit. | **Fallback:** Present live demonstration from verified local environment (`localhost:3000`) and record backup HD demo video. | **Active & Mitigated** |
| **RISK-DEL-03** | Delivery & Competition | **Premature UI Polishing at Expense of Data Pipeline:** Spending hours on custom CSS animations before data ingestion is proven. | **Medium** | **High** | All Tasks | Strictly enforce Backlog Gates (Gate P0 $\to$ Gate P1 $\to$ Gate P2); no UI animation work permitted before Gate P1 sign-off. | Intervene immediately; reassign focus to database query and data display. | **Fallback:** Use clean, unstyled Tailwind system components; prioritize data clarity over visual flair. | **Active & Mitigated** |
| **RISK-DEL-04** | Delivery & Competition | **Live Demo Technical Glitch During Presentation:** Internet failure, slow database query, or broken UI interaction during 3-minute pitch. | **High** | **Low** | Hackathon Judging & Demo | Rehearse demo narrative multiple times; pre-record unedited high-definition screen capture backup video. | Instantly switch to local backup video or offline static demo build if live connection hiccups. | **Fallback:** Play pre-recorded walkthrough video with live vocal presentation. | **Active & Mitigated** |

---

## 3. Concrete Contingency Execution Runbooks

### Runbook 1: Ingestion Blocked by Source Table Formatting
* **Trigger:** Parsing `PSI98-ART-002` fails due to unexpected multiline headers or encoding errors.
* **Immediate Action:** Stop debugging parser after 20 minutes.
* **Execution:**
  1. Switch immediately to `PSI25-ART-002` (BASS-II flat PMMA film summary).
  2. BASS-II table is a clean single-line header CSV with 15 verified flight runs.
  3. Seed database with BASS-II records to unblock frontend search and detail views.
  4. Revisit Saffire-I parsing in P2 only after the vertical slice is operational.

### Runbook 2: Gemini API Outage or Latency Spike
* **Trigger:** Route `/api/copilot/explain` returns 500, 429, or takes $>4.0\text{ seconds}$.
* **Immediate Action:** Set `FEATURE_AI_COPILOT=false` in application environment configuration.
* **Execution:**
  1. The UI automatically switches from the AI summary card to the **Deterministic Findings Card**.
  2. The findings card displays the verbatim reported measurements, experimental flow velocity, and DOI links directly from PostgreSQL.
  3. The core research workflow remains 100% functional, scientifically authentic, and fast.

### Runbook 3: PostgreSQL / Supabase Connection Degradation
* **Trigger:** Supabase network connection drops or database migrations fail during setup.
* **Immediate Action:** Switch backend adapter to local SQLite / JSON static provider.
* **Execution:**
  1. Next.js Route Handlers import local static JSON file `data/processed/psi_seed_evidence.json`.
  2. Execute search using in-memory JavaScript filtering.
  3. UI renders identical evidence cards and detail views without network latency.

### Runbook 4: Scope Adjustment Following October 28 Challenge Release
* **Trigger:** The complete challenge statement released on October 28 emphasizes a specific combustion theme (e.g., electrical wire insulation or spacecraft fabric flammability).
* **Immediate Action:** Convene 30-minute Day 0 Alignment Review.
* **Execution:**
  1. If fabric flammability is emphasized: prioritize Saffire-I SIBAL fabric records.
  2. If solid plastics are emphasized: prioritize BASS-II PMMA records.
  3. Adapt query presets and UI case study highlights to directly reflect NASA's challenge prompt.
  4. Do not alter underlying schema contracts or data validation invariants.

---

## 4. Phase 1.0 Milestone Execution Log (October 28, 2026)

* **Execution Status:** **EXECUTED & VERIFIED**
* **Trigger Event:** Official release of NASA Space Apps Challenge 2026 challenge statement for *"Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data"*.
* **Actions Completed:**
  1. Full requirements traceability conducted (`docs/phase10_official_challenge_traceability.md`).
  2. Scope Go/No-Go decision rendered as `GO WITH CHANGES` (`docs/phase10_scope_decision.md`).
  3. Day 1 Backlog Delta documented (`docs/phase10_day1_backlog_delta.md`), adding Artemis Lunar Habitat and ISS Exploration Atmosphere preset filters to `TASK-D1-07`.
  4. Re-affirmed BASS-II + Saffire-I solid combustion boundary; deferred FLEX droplet combustion per `DEC-02`.
* **Updated Risk Posture:** All 15 risks in the register remain **Active & Mitigated**. Zero blocking unmitigated risks identified. Implementation remains frozen until November 14, 2026 at 9:00 AM local time.
