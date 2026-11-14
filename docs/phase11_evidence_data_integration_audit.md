# Phase 1.1 — Scientific Data Integration & Record Accounting Audit

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Author:** Aniket Nandi (Lead Full-Stack Developer & Systems Architect)  
**Milestone:** TASK-D1-08 (Prerequisite Audit to TASK-D1-09)  
**Date:** November 14, 2026  
**Status:** COMPLETE & VERIFIED  

---

## 1. Executive Summary & Audit Mandate

Prior to implementing the Side-by-Side Evidence Comparison Engine (`TASK-D1-09`), this audit formally inspects, reconciles, and reports:
1. **The Actual Runtime Data Path:** Tracing data from raw NASA CSV artifacts to the user interface.
2. **Reconciliation of Record Counts:** Clarifying the physical distinction between parsed source rows, specimen metadata records, diagnostic/flow-visualization records, and dynamic empirical measurements.
3. **Scientific Terminology & Verification Statuses:** Tightening the distinction between source linkage, structural validation, and peer-reviewed empirical verification.
4. **Database vs. File-Backed Persistence Status:** Accurately reporting the current architectural state.

---

## 2. Actual Runtime Data Path Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. OFFICIAL NASA PSI REPOSITORY EXPERIMENTAL TABLES                    │
│    • Saffire-I: data/raw/psi/saffire_i/PSI98-ART-002_table.csv (5 rows)│
│    • BASS-II:   data/raw/psi/bass_ii/PSI25-ART-002_table.csv (5 rows)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. PYTHON PYDANTIC VALIDATION PIPELINE (TASK-D1-04 / D1-05)            │
│    • SHA-256 Checksum Verification                                     │
│    • Non-Null Preservation, Physical Boundary Gating (O2 > 0, P > 0)   │
│    • Verbatim Safeguards (DEC-01: 0.37 cm approx; DEC-04: Fan Index)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. VALIDATED EXPORTED SNAPSHOT                                         │
│    • src/data/empirical_records.json (9 validated records)             │
│    • Pure JSON file-backed cache (Preserves zero-fabrication invariant)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. SERVER-SIDE DATA ACCESS LAYER & REST API (TASK-D1-06)               │
│    • src/lib/evidenceRepository.ts (EvidenceRepository)                │
│    • /api/investigations, /api/evidence/search, /api/evidence/[id]     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. SCIENTIFIC EVIDENCE EXPLORER & DASHBOARD (TASK-D1-07)               │
│    • Next.js App Router (localhost:3000 / localhost:3000/explore)      │
└────────────────────────────────────────────────────────────────────────┘
```

### Architectural Finding on Persistence:
* **Current State:** **File-Backed / Exported Ingestion Snapshot**.
* The PostgreSQL/Supabase migration (`supabase/migrations/20261114000001_initial_hco_schema.sql`) and Python database candidate mapper (`DatabaseWriter`) are fully implemented and verified by unit tests.
* However, in strict accordance with the Day 1 Backlog rules (`docs/phase099_day1_backlog.md` § TASK-D1-05), the ingestion pipeline defaulted to dry-run mode (`rows_persisted: 0`). 
* The Evidence Explorer server routes currently query the validated dataset snapshot (`src/data/empirical_records.json`).
* **Governance Invariant:** FIRELINE is transparently documented as a file-backed prototype pending live database connection authorization.

---

## 3. Authoritative Reconciled Record Census

A line-by-line audit across raw CSV source files, Pydantic ingestion transforms, and the frontend data layer establishes the exact census:

| Accounting Category | Saffire-I (`PSI-98`) | BASS-II (`PSI-25`) | FLEX (`PSI-69`) | Total FIRELINE Census | Technical Justification |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Total Raw Source Rows** | 5 | 5 | 0 | **10** | Verbatim rows present in staged CSV files. |
| **Blank / Delimiter Rows** | 1 | 0 | 0 | **1** | Trailing delimiter row in Saffire-I table (`Row 5`). |
| **Successfully Parsed Rows** | 4 | 5 | 0 | **9** | Non-blank rows processed by Pydantic models. |
| **Accepted Specimen Records** | 2 | 5 | 0 | **7** | Real combustible solid specimens (`S1`, `S2`, `B1`–`B5`). |
| **Diagnostic / Flow Vis Records** | 2 | 0 | 0 | **2** | Saffire `F1C1/F1C2` & `F2C1/F2C2` (No solid fuel, zero burn). |
| **Records Requiring Review** | 2 | 0 | 0 | **2** | Flow-visualization runs segregated from combustion data. |
| **Quarantined Records** | 0 | 0 | 0 | **0** | Zero corrupt or non-physical records in staged files. |
| **Dynamic Empirical Spread Measurements** | 0 | 0 | 0 | **0** | Flame spread rates ($2.4\text{ mm/s}$) reside in papers, not in PSI tables. |
| **Persisted Database Rows** | 0 | 0 | 0 | **0** | Dry-run ingestion baseline. |

### Key Clarifications:
1. **Specimen Metadata vs. Empirical Measurements:**
   - The 7 accepted specimen records represent initial flight hardware configurations (sample dimensions, flow duct settings, oxygen concentrations).
   - They do **not** contain dynamic time-series sensor measurements (such as flame spread rate $V_f$ or heat release rates $\dot{q}$), which were published in peer-reviewed literature (Urban et al. 2019, Olson & Ferkul 2017) or stored in multi-gigabyte telemetry archives.
2. **Flow Visualization Records:**
   - Rows `F1C1/F1C2` and `F2C1/F2C2` are aerodynamic duct diagnostics, not flammability experiments. They must never be counted as combustion measurements.

---

## 4. Scientific Terminology & Verification Hierarchy

To prevent over-claiming, FIRELINE enforces a strict 4-level runtime verification hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: SOURCE_LINKED                                                 │
│ Cryptographically verified link to NASA PSI repository artifact.       │
├────────────────────────────────────────────────────────────────────────┤
│ LEVEL 2: STRUCTURALLY_VALIDATED                                        │
│ Non-null boundary checks, Pydantic type validation, dual unit mapping. │
├────────────────────────────────────────────────────────────────────────┤
│ LEVEL 3: PRELIMINARY_UNAUDITED (Current Active Status for All Records) │
│ Ingested from official table preview; awaits expert peer-review audit. │
├────────────────────────────────────────────────────────────────────────┤
│ LEVEL 4: SCIENTIFICALLY_VERIFIED                                       │
│ Audited against peer-reviewed paper + DOI + verified calibration curve.│
└────────────────────────────────────────────────────────────────────────┘
```

* **Current Status:** All 9 active records in FIRELINE carry the runtime tag **`PRELIMINARY_UNAUDITED`**.
* No record is represented as `SCIENTIFICALLY_VERIFIED` merely because it was successfully parsed.

---

## 5. Audit Authorization

The data integration path and accounting census are fully reconciled. The project is cleared to proceed immediately to **`TASK-D1-09` (Scientific Evidence Comparison Engine & Physical Comparability Gating)**.
