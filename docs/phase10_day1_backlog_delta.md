# Phase 1.0 — Day 1 Backlog Delta & Refinement

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead Engineer:** Aniket Nandi (Kolkata, IST)  
**Checkpoint Date:** October 28, 2026 (Official Challenge Release Milestone)  
**Baseline Backlog:** `docs/phase099_day1_backlog.md`  
**Document Status:** Locked Backlog Refinement Delta  
**Mode:** Documentation-only, operational planning  

---

## 1. Overview & Refinement Principles

Following the official challenge release review and the **`GO WITH CHANGES`** scope authorization (`docs/phase10_scope_decision.md`), this document details the specific adjustments applied to the Day 1 implementation backlog.

Rather than rebuilding the proven backlog from scratch, this delta preserves the established structure (P0 Entry Gates, P1 Vertical Slice, P2 Intelligence, P3 Deferred Scope) and injects targeted refinements that align the tasks with NASA's official challenge prompt while maintaining strict physical integrity and execution safety.

---

## 2. Specific Task Deltas

### Delta for TASK-D1-04: Deterministic Pre-Ingestion Data Contract Models
* **Original Scope:** Formulate Pydantic models for CSV columns, enforcing non-null boundary conditions and unit conversions.
* **Refinement Added:**
  * Explicitly support verbatim Saffire-I thickness representation (`thickness_raw: str`, `is_approximated: bool = True`) to prevent automated mathematical conversion errors (`DEC-01`).
  * Explicitly represent BASS-II fan display settings as a discrete integer index (`fan_index: Optional[int]`) and flag records without true flow velocity ($m/s$) so they are excluded from physical flow velocity filtering (`DEC-04`).
* **Verification Update:** Unit tests must confirm that rows with uncalibrated fan index pass structural parsing but are tagged `FLOW_VELOCITY_UNAVAILABLE`.
* **Estimated Effort Impact:** Neutral (remains 1 hour).

---

### Delta for TASK-D1-05: Ingestion & Validation Pipeline for Approved PSI Datasets
* **Original Scope:** Parse, validate, normalize, and seed `PSI98-ART-002` (Saffire-I) and `PSI25-ART-002` (BASS-II).
* **Refinement Added:**
  * Re-affirm strict initial ingestion order: Ingest `PSI25-ART-002` (BASS-II flat PMMA thin films) first to prove end-to-end ingestion on a clean single-table schema, followed immediately by `PSI98-ART-002` (Saffire-I specimen table).
  * Quarantine records with zero or negative oxygen ($O_2 \le 0$) or zero ambient pressure ($P \le 0$) into local `quarantine_records.json` without failing the overall pipeline run.
* **Verification Update:** Verify database table `experimental_runs` contains at least 15 verified flight runs from BASS-II and Saffire-I combined.
* **Estimated Effort Impact:** Neutral (remains 2 hours).

---

### Delta for TASK-D1-07: Research Query & Evidence Explorer UI
* **Original Scope:** Interactive search bar, material/atmosphere filters, and responsive evidence card grid.
* **Refinement Added:**
  * Add **Exploration Scenario Quick-Filter Chips** at the top of the search view:
    * 🌕 **Artemis Lunar Habitat:** $34\%\text{ O}_2$ at $56.5\text{ kPa}$ ($8.2\text{ psia}$), low concurrent flow.
    * 🛰️ **ISS Cabin Standard:** $21\%\text{ O}_2$ at $101.3\text{ kPa}$ ($14.7\text{ psia}$), standard ventilation.
    * 🔬 **Micro-Duct Concurrent Spread:** Thin PMMA in narrow channel.
  * Clicking any chip instantly populates the filter parameters and queries matching NASA PSI runs.
* **Verification Update:** Verify clicking "Artemis Lunar Habitat" filters evidence to high-oxygen runs within 100ms.
* **Estimated Effort Impact:** +15 minutes (Total effort: 1 hour 45 minutes; absorbed within P1 buffer).

---

### Delta for TASK-D1-11: Grounded Scientific Explanations via Gemini API (Conditional)
* **Original Scope:** Route `/api/copilot/explain` prompting Gemini with retrieved Supabase records and returning cited summary.
* **Refinement Added:**
  * Mandate a strict 2-step verification pipeline:
    1. System prompt strictly limits Gemini context to retrieved flight runs and mandates citations in the format `[PSI-XX:RunYY]`.
    2. Route Handler executes regex scan on output; if any citation fails to match retrieved run IDs, the AI summary is suppressed and replaced with a pre-formatted **Deterministic Research Summary** showing verbatim NASA flight measurements.
  * If API key is missing or request takes $>3.5\text{ seconds}$, UI displays the deterministic findings card instantly.
* **Verification Update:** Test with invalid synthetic run ID; verify that ungrounded statements are automatically suppressed.
* **Estimated Effort Impact:** Neutral (remains 1.5 hours).

---

## 3. Re-Affirmed Day 1 Schedule & Execution Flow

The refined schedule for Saturday, November 14, 2026 is fully locked:

```
┌────────────────────────────────────────────────────────────────────────┐
│ DAY 1 EXECUTION TIMELINE (SATURDAY, NOV 14, 2026)                      │
├─────────────────┬─────────────┬────────────────────────────────────────┤
│ Time Window     │ Task ID     │ Target Milestone / Deliverable         │
├─────────────────┼─────────────┼────────────────────────────────────────┤
│ 09:00 – 09:30   │ TASK-D1-01  │ Official Challenge Portal Check & Reg. │
│ 09:30 – 10:15   │ TASK-D1-02  │ Next.js + Python Workspace Bootstrap   │
│ 10:15 – 11:00   │ TASK-D1-03  │ PostgreSQL Schema DDL Instantiation    │
│ 11:00 – 12:00   │ TASK-D1-04  │ Pydantic Contract Models with Approxs  │
├─────────────────┴─────────────┴────────────────────────────────────────┤
│ 🛑 12:00 — GATE P0 SIGN-OFF: Infrastructure, Schema & Models Verified  │
├─────────────────┬─────────────┬────────────────────────────────────────┤
│ 12:00 – 14:00   │ TASK-D1-05  │ Ingestion CLI: BASS-II & Saffire-I     │
│ 14:00 – 15:00   │ TASK-D1-06  │ Full-Text Search API Route Handler     │
│ 15:00 – 16:45   │ TASK-D1-07  │ Explorer UI with Mission Scenario Chips│
│ 16:45 – 17:30   │ TASK-D1-08  │ Evidence Detail & Provenance Inspector │
├─────────────────┴─────────────┴────────────────────────────────────────┤
│ 🛑 17:30 — GATE P1 SIGN-OFF: End-to-End Working Vertical Slice Live    │
├─────────────────┬─────────────┬────────────────────────────────────────┤
│ 17:30 – 19:00   │ TASK-D1-09  │ Side-by-Side Comparison & Compat. Gate │
│ 19:00 – 20:00   │ TASK-D1-10  │ Evidence-Gap Indicator & Envelope Alert│
│ 20:00 – 21:30   │ TASK-D1-11  │ Gemini API Explanations with Citations │
├─────────────────┴─────────────┴────────────────────────────────────────┤
│ 🛑 21:30 — GATE P2 SIGN-OFF: Core Feature Freeze & Day 1 Tagged        │
│ 21:30 – 22:00   │ Smoke Test, Backup HD Video Rehearsal, Git Commit    │
└────────────────────────────────────────────────────────────────────────┘
```

The refined backlog represents an actionable, battle-tested plan that maximizes scientific value, guarantees physical integrity, and ensures smooth delivery during the official competition window.
