# Phase 0.99 — Day 1 Implementation Backlog

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead Engineer:** Aniket Nandi (Kolkata, IST)  
**Scheduled Execution Window:** Saturday, November 14, 2026, 9:00 AM – 10:00 PM IST (Day 1 of Hackathon)  
**Document Status:** Locked Operational Backlog  
**Development Boundary:** Pre-event preparation artifact only; execution begins strictly upon official competition window opening.  

---

## 1. Backlog Strategy & Execution Philosophy

The goal of Day 1 is not to build a bloated suite of incomplete microservices or premature AI agents. The primary mission is to establish a **rock-solid, end-to-end vertical slice**:
$$\text{Verified NASA Source} \longrightarrow \text{Deterministic Ingestion} \longrightarrow \text{Structured Database} \longrightarrow \text{Search \& Evidence Explorer UI}$$

By the end of Day 1, FIRELINE must have a working, verifiable web application that allows a user to query genuine NASA flight combustion records, inspect their physical experimental context, view source provenance, and observe active physical comparability gating.

### Priority Structure:
* **P0 — Entry Gates & Essential Integrity (0–3 hrs):** Verify final challenge requirements, lock development environment, and configure database schema.
* **P1 — Minimum Working Vertical Slice (3–8 hrs):** Implement Python ingestion script for verified artifacts (`PSI98-ART-002`, `PSI25-ART-002`), run validation pipeline, seed database, and build Next.js Explorer UI.
* **P2 — Evidence Intelligence & Physical Gating (8–12 hrs):** Implement multi-condition relevance ranking, side-by-side comparison with compatibility warnings, and evidence-gap indicators.
* **P3 — Deferred or Contingency Scope:** Advanced capabilities held in reserve and deployed only if P0–P2 finish ahead of schedule.

---

## 2. P0 — Entry Gates & Essential Integrity (Hours 0–3)

### TASK-D1-01: Final Challenge Statement & Submission Portal Verification
* **Priority:** P0 (Blocking Entry Gate)
* **Objective:** Review the final official challenge statements, dataset attachments, and submission portal guidelines released by NASA.
* **Preconditions:** Hackathon kickoff window open (November 14, 2026, 9:00 AM local time).
* **Expected Deliverable:** A 1-page alignment verification log confirming zero unaddressed challenge scope changes.
* **Dependencies:** None.
* **Applicable Requirements:** All (`REQ-INGEST-01` through `REQ-INGEST-42`).
* **Applicable Test IDs:** None (Organizational Gate).
* **Verification Method:** Direct comparison between `docs/phase099_preflight_readiness_review.md` and live Space Apps portal challenge brief.
* **Definition of Done:** Challenge requirements confirmed aligned; team submission registered on team portal.
* **Estimated Effort:** 30 minutes (Planning estimate).
* **Fallback if Exceeded:** If challenge details require minor pivots, immediately apply the contingency runbook in `docs/phase099_risk_and_contingency_register.md`.

---

### TASK-D1-02: Clean Implementation Workspace & Environment Setup
* **Priority:** P0 (Foundational)
* **Objective:** Initialize clean Next.js App Router project and Python virtual environment with exact dependencies.
* **Preconditions:** `TASK-D1-01` signed off.
* **Expected Deliverable:** Runnable Next.js frontend repository with TypeScript and Tailwind CSS, plus Python 3.12 virtual environment (`pandas`, `pydantic`, `pytest`).
* **Dependencies:** `TASK-D1-01`.
* **Applicable Requirements:** General infrastructure.
* **Applicable Test IDs:** `TEST-H01`.
* **Verification Method:** Execute `npm run dev` (local port 3000) and `pytest` smoke test.
* **Definition of Done:** Clean build with zero TypeScript or lint errors; `.env.local` configured with local secrets.
* **Estimated Effort:** 45 minutes (Planning estimate).
* **Fallback if Exceeded:** Drop custom Tailwind plugins; use vanilla CSS tokens and default Next.js starter.

---

### TASK-D1-03: Relational Schema Instantiation (Supabase / PostgreSQL)
* **Priority:** P0 (Core Architecture)
* **Objective:** Execute PostgreSQL DDL migration to create core HCO tables based strictly on the canonical schema (`hco_schema_specification.md`) and approved non-breaking extensions.
* **Preconditions:** `TASK-D1-02` complete.
* **Expected Deliverable:** PostgreSQL tables (`investigations`, `experimental_runs`, `material_samples`, `environmental_conditions`, `measurement_series`, `scientific_findings`).
* **Dependencies:** `TASK-D1-02`.
* **Applicable Requirements:** `REQ-INGEST-01`, `02`, `10`, `11`, `12`, `13`, `20`, `26`, `34`.
* **Applicable Test IDs:** `TEST-A01`, `TEST-B01`, `TEST-C01`, `TEST-D01`.
* **Verification Method:** Inspect tables and foreign key constraints via Supabase dashboard / SQL query.
* **Definition of Done:** All 6 canonical entities created with strict foreign key constraints and `CHECK` constraints on positive pressure/oxygen.
* **Estimated Effort:** 45 minutes (Planning estimate).
* **Fallback if Exceeded:** Use local SQLite file database for immediate development; migrate to Supabase in P2.

---

### TASK-D1-04: Deterministic Pre-Ingestion Data Contract Lock
* **Priority:** P0 (Data Contract Gate)
* **Objective:** Lock the CSV ingestion column schemas and validation rules for `PSI98-ART-002` (Saffire-I) and `PSI25-ART-002` (BASS-II) into Pydantic models.
* **Preconditions:** `TASK-D1-03` complete.
* **Expected Deliverable:** `ingestion/models.py` defining source schemas, unit conversion tables, and validation invariants.
* **Dependencies:** `TASK-D1-03`.
* **Applicable Requirements:** `REQ-INGEST-03`, `04`, `05`, `14`, `15`, `21`, `22`, `27`, `28`, `35`, `36`.
* **Applicable Test IDs:** `TEST-A02`, `TEST-B02`, `TEST-C02`, `TEST-D02`, `TEST-E01`.
* **Verification Method:** Run unit test suite passing valid and invalid synthetic records through Pydantic models.
* **Definition of Done:** Models enforce non-null boundary conditions, dual original/normalized units, and reject negative oxygen.
* **Estimated Effort:** 1 hour (Planning estimate).
* **Fallback if Exceeded:** Simplify Pydantic schema to essential flight conditions only (fuel, O2, pressure, flow velocity).

---

### 🛑 Gate P0 Exit Criteria:
1. Challenge alignment confirmed with zero unaddressed scope changes.
2. Next.js app builds cleanly on `localhost:3000`.
3. PostgreSQL schema live with all 6 core entities.
4. Pydantic ingestion models passing initial unit tests.

---

## 3. P1 — Minimum Working Vertical Slice (Hours 3–8)

### TASK-D1-05: Ingestion & Validation Pipeline for Approved PSI Datasets
* **Priority:** P1 (Essential Core)
* **Objective:** Implement Python ingestion CLI (`ingestion/ingest.py`) to parse, validate, normalize, and seed `PSI98-ART-002` (Saffire-I) and `PSI25-ART-002` (BASS-II) CSV records.
* **Preconditions:** Gate P0 passed.
* **Expected Deliverable:** Executable ingestion script that reads raw CSV files, enforces 9 deterministic validation gates, and inserts records into PostgreSQL.
* **Dependencies:** `TASK-D1-03`, `TASK-D1-04`.
* **Applicable Requirements:** `REQ-INGEST-01` to `REQ-INGEST-17`, `REQ-INGEST-20` to `23`.
* **Applicable Test IDs:** `TEST-A01`, `A02`, `B01`, `B02`, `C01`, `C02`, `D01`, `E01`, `F01`, `H01`.
* **Verification Method:** Run `python ingestion/ingest.py` and query database count of inserted runs.
* **Definition of Done:** Saffire-I pre-test specimen records and BASS-II flat PMMA runs seeded; malformed test rows quarantined; original units preserved verbatim.
* **Estimated Effort:** 2 hours (Planning estimate).
* **Fallback if Exceeded:** Ingest BASS-II flat PMMA runs first (simpler single-table structure); append Saffire-I subsequently.

---

### TASK-D1-06: Database Full-Text Search & REST API Route
* **Priority:** P1 (Backend Service)
* **Objective:** Implement Next.js Route Handler (`/api/evidence/search`) querying Supabase PostgreSQL full-text search over materials, fuels, and conditions.
* **Preconditions:** `TASK-D1-05` complete (database seeded).
* **Expected Deliverable:** Tested API endpoint returning structured evidence cards with provenance, experimental boundary conditions, and measured values.
* **Dependencies:** `TASK-D1-05`.
* **Applicable Requirements:** `REQ-INGEST-26`, `27`, `28`, `29`.
* **Applicable Test IDs:** `TEST-A01`, `TEST-F01`.
* **Verification Method:** Execute API request with query `PMMA concurrent flow` and verify JSON response.
* **Definition of Done:** Endpoint returns matching runs within 150ms with complete experimental context and valid NASA PSI run IDs.
* **Estimated Effort:** 1 hour (Planning estimate).
* **Fallback if Exceeded:** Use standard SQL `ILIKE` query filtering instead of PostgreSQL full-text search index.

---

### TASK-D1-07: Research Query & Evidence Explorer UI
* **Priority:** P1 (Frontend Core)
* **Objective:** Build the interactive Explorer interface featuring search bar, material/atmosphere filters, and responsive evidence card grid.
* **Preconditions:** `TASK-D1-06` complete.
* **Expected Deliverable:** Next.js page (`/explorer`) displaying real-time filtered NASA combustion evidence cards.
* **Dependencies:** `TASK-D1-06`.
* **Applicable Requirements:** `REQ-INGEST-26`, `27`.
* **Applicable Test IDs:** `TEST-A01`, `TEST-C01`.
* **Verification Method:** Manual user interaction testing on desktop and mobile viewports.
* **Definition of Done:** Filtering by material (PMMA, SIBAL) and oxygen level updates evidence list without page reload; zero layout shifts.
* **Estimated Effort:** 1.5 hours (Planning estimate).
* **Fallback if Exceeded:** Restrict filters to material dropdown and search text input.

---

### TASK-D1-08: Evidence Detail & Provenance Inspector View
* **Priority:** P1 (Frontend Core)
* **Objective:** Build the detail modal/drawer (`/evidence/[runId]`) displaying full experimental boundary conditions, dual unit tables, and direct NASA PSI source links.
* **Preconditions:** `TASK-D1-07` complete.
* **Expected Deliverable:** Next.js component rendering flight campaign details, chamber pressure, flow velocity, fuel dimensions, and publication citations.
* **Dependencies:** `TASK-D1-07`.
* **Applicable Requirements:** `REQ-INGEST-01`, `02`, `10`, `11`, `12`, `13`, `34`.
* **Applicable Test IDs:** `TEST-A01`, `TEST-B02`, `TEST-C01`, `TEST-D01`.
* **Verification Method:** Click BASS-II Run 12 card and inspect displayed values against raw PSI table.
* **Definition of Done:** Verbatim reported values, converted SI values, and active NASA repository links displayed correctly.
* **Estimated Effort:** 1 hour (Planning estimate).
* **Fallback if Exceeded:** Display detail view as an inline expandable accordion within the card.

---

### 🛑 Gate P1 Exit Criteria:
1. Verified NASA records (`PSI98-ART-002`, `PSI25-ART-002`) successfully ingested into PostgreSQL.
2. Full-text search endpoint functioning and returning structured JSON.
3. User can search, filter, and open an Evidence Detail card showing flight conditions and source links.
4. End-to-end vertical slice functioning on `localhost:3000`.

---

## 4. P2 — Evidence Intelligence & Physical Gating (Hours 8–12)

### TASK-D1-09: Side-by-Side Experimental Comparison & Compatibility Gating
* **Priority:** P2 (Scientific Differentiator)
* **Objective:** Build comparison drawer allowing users to select two runs (e.g., BASS-II thin film vs. Saffire-I panel) and receive deterministic physical compatibility warnings.
* **Preconditions:** Gate P1 passed.
* **Expected Deliverable:** Comparison UI component (`/compare`) that evaluates flow velocity, oxygen level, and specimen geometry differences.
* **Dependencies:** `TASK-D1-08`.
* **Applicable Requirements:** `REQ-INGEST-30`, `31`, `32`, `33`.
* **Applicable Test IDs:** `TEST-I01`, `TEST-I02`, `TEST-I03`.
* **Verification Method:** Compare BASS-II Run 12 with Saffire-I sample; verify warning banner: *"Warning: Specimen geometry differs (1 cm film vs. 100 cm panel). Extrapolation invalid."*
* **Definition of Done:** Deterministic rule engine triggers compatibility warning when sample aspect ratio or flow regime differs by $>5\times$.
* **Estimated Effort:** 1.5 hours (Planning estimate).
* **Fallback if Exceeded:** Display simple static comparison table without automated compatibility warning banner.

---

### TASK-D1-10: Evidence-Gap Indicator & Boundary Range Check
* **Priority:** P2 (Scientific Integrity)
* **Objective:** Implement parameter boundary checker that evaluates user query conditions against NASA flight ranges and explicitly flags untested regimes.
* **Preconditions:** `TASK-D1-06`, `TASK-D1-07`.
* **Expected Deliverable:** UI banner displaying `EVIDENCE_GAP` when queried flow velocity is $<1.0\text{ cm/s}$ or pressure is $<0.5\text{ atm}$.
* **Dependencies:** `TASK-D1-07`.
* **Applicable Requirements:** `REQ-INGEST-37`, `38`.
* **Applicable Test IDs:** `TEST-F02`, `TEST-F03`.
* **Verification Method:** Enter query with $0.2\text{ cm/s}$ flow; verify that system displays evidence gap notification rather than zero results or hallucinated data.
* **Definition of Done:** Clear amber warning badge with explanation of NASA experimental envelope limits.
* **Estimated Effort:** 1 hour (Planning estimate).
* **Fallback if Exceeded:** Display generic *"No flight runs match this exact condition"* message.

---

### TASK-D1-11: Grounded Scientific Explanations via Gemini API (Conditional)
* **Priority:** P2 (AI Copilot Layer)
* **Objective:** Integrate Gemini API to synthesize plain-English research summaries grounded strictly in retrieved Supabase run records, with enforced citation verification.
* **Preconditions:** `TASK-D1-06` complete; Gemini API key configured.
* **Expected Deliverable:** Route `/api/copilot/explain` taking evidence IDs, prompting Gemini with strict citation constraints, and returning cited summary.
* **Dependencies:** `TASK-D1-06`.
* **Applicable Requirements:** `REQ-INGEST-28`, `29`, `41`.
* **Applicable Test IDs:** `TEST-A01`, `TEST-G01`.
* **Verification Method:** Inspect returned summary; verify that every bracketed citation `[PSI-25:Run12]` exists in the retrieved context.
* **Definition of Done:** Zero fabricated citations; automated fallback to deterministic template summary if Gemini API call times out or fails.
* **Estimated Effort:** 1.5 hours (Planning estimate).
* **Fallback if Exceeded:** Immediately deactivate AI endpoint; fall back completely to deterministic evidence cards.

---

### 🛑 Gate P2 Exit Criteria:
1. Side-by-side comparison view operational with active physical compatibility alerts.
2. Evidence-gap indicators active for queries exceeding empirical flight boundaries.
3. Grounded explanations functioning with 100% resolvable citations (or cleanly bypassed).

---

## 5. P3 — Deferred or Contingency Scope (Day 2 / Extended)

These items are explicitly deferred to ensure the Day 1 baseline is complete and battle-tested:

| Task ID | Title | Reason for Deferral | Potential Reintroduction Trigger |
| :--- | :--- | :--- | :--- |
| **TASK-D1-12** | Interactive SVG Knowledge Graph | Visual enhancement only; adds zero empirical evidence value over cards. | P0–P2 completed before 8:00 PM on Day 1. |
| **TASK-D1-13** | Ingestion of Quiescent Droplets (FLEX) | Blocked by `DEC-02` schema nullability and spherical geometry model gaps. | Official challenge specifically demands liquid droplet combustion. |
| **TASK-D1-14** | Automated Flame Video Extraction | High computational and storage overhead; requires video hosting. | Core comparison workflow fully polished and rehearsed. |

---

## 6. Day 1 Milestone Schedule (Target Execution Plan)

```
09:00 - 09:30  TASK-D1-01  Official Challenge Review & Team Registration Gate
09:30 - 10:15  TASK-D1-02  Next.js + Python Workspace Bootstrap
10:15 - 11:00  TASK-D1-03  PostgreSQL DDL Migration & Table Instantiation
11:00 - 12:00  TASK-D1-04  Pydantic Ingestion Contract Models & Test Suite
──────────────────────────────────────────────────────────────────────────
12:00          🛑 GATE P0 SIGN-OFF: Infrastructure & Schema Live
──────────────────────────────────────────────────────────────────────────
12:00 - 14:00  TASK-D1-05  Python Ingestion Script (Saffire-I & BASS-II)
14:00 - 15:00  TASK-D1-06  Full-Text Search REST Route & API Tests
15:00 - 16:30  TASK-D1-07  Next.js Research Query & Explorer Grid UI
16:30 - 17:30  TASK-D1-08  Evidence Detail & Provenance Inspector Drawer
──────────────────────────────────────────────────────────────────────────
17:30          🛑 GATE P1 SIGN-OFF: Working End-to-End Vertical Slice
──────────────────────────────────────────────────────────────────────────
17:30 - 19:00  TASK-D1-09  Side-by-Side Comparison & Compatibility Warning
19:00 - 20:00  TASK-D1-10  Evidence-Gap Indicator & Boundary Range Alert
20:00 - 21:30  TASK-D1-11  Gemini Grounded Explanations with Citation Guards
──────────────────────────────────────────────────────────────────────────
21:30          🛑 GATE P2 SIGN-OFF: Core System Feature Freeze
21:30 - 22:00  Day 1 Smoke Test, Video Recording Rehearsal, Git Tag `v0.99-day1`
```
