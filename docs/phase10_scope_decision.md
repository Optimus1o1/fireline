# Phase 1.0 — Scope Authorization & Go/No-Go Decision

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Lead Engineer:** Aniket Nandi (Kolkata, IST)  
**Checkpoint Date:** October 28, 2026 (Official Challenge Release Milestone)  
**Preparation Baseline:** Commit `832a9ba` (Phase 0.99 Pre-Flight Handoff)  
**Target Event:** NASA Space Apps Challenge 2026 (November 14–15, 2026)  
**Document Status:** Formal Executive Scope Decision  
**Mode:** Official challenge verification and scope authorization (Documentation-only)  

---

## 1. Formal Decision Statement

Following an exhaustive audit of the complete, officially published NASA Space Apps Challenge 2026 specification for **“Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data”**, project **FIRELINE** is hereby authorized with the following classification:

$$\mathbf{GO\ WITH\ CHANGES}$$

### Decision Justification:
1. **Core Viability Confirmed:** The fundamental architecture, scientific data model (Harmonized Combustion Ontology), and evidence-first methodology of FIRELINE are in complete alignment with the official challenge's primary mission: transforming scattered, heterogeneous NASA microgravity combustion research into an actionable, traceable, and physically grounded spacecraft fire-safety intelligence platform.
2. **Key Differentiators Validated:** The challenge statement specifically emphasizes the hazards of invalid assumptions across microgravity regimes and the critical need to identify what has *not* been tested. This directly validates FIRELINE's **Physical Comparability Gating** (`TEST-I01` to `TEST-I03`) and **Evidence-Gap Indicator** (`TASK-D1-10`) as primary competitive strengths.
3. **Targeted Modifications Required:** While the core technical direction is validated, four specific operational and data adjustments are mandated to align the Day 1 implementation backlog with the published challenge themes while maintaining strict execution safety.

---

## 2. Confirmed Assumptions & Technical Invariants

The implementation phase will operate under the following verified technical invariants:

* **Invariant 1 (Canonical Schema Byte-Integrity):** The canonical Harmonized Combustion Ontology (`hco_schema_specification.md`, SHA-256 `980AD11C...`) remains the Level 1 data contract. No fields will be added, altered, or deleted during Day 1 implementation. Proposed extensions (`ScientificValue<T>`, `SourceLocation`) remain application-level adapter models.
* **Invariant 2 (Empirical Boundary Integrity):** Missing sensor measurements remain `NULL` (never zero). Non-physical values ($O_2 \le 0$, $P \le 0$) trigger hard record rejection. Original reported values and source units ($psia$, $in$, $ft/min$) are permanently retained alongside converted SI units.
* **Invariant 3 (Synthetic Data Isolation):** All synthetic test fixtures carrying the `SYNTHETIC_ILLUSTRATIVE` tag remain strictly quarantined and barred from empirical database tables and public search indices.
* **Invariant 4 (Competition Temporal Window):** Implementation code, database migrations, and production services remain frozen until the official hackathon development window opens on **Saturday, November 14, 2026, at 9:00 AM local time**.

---

## 3. Mandated Scope Modifications

The following four changes are approved and incorporated into the project baseline:

### Modification 1: Deep-Space Exploration Mission Presets in UI
* **Context:** The official challenge specifically highlights spacecraft fire safety for future deep-space exploration, including Artemis lunar surface habitats and crewed Mars transit vehicles.
* **Modification:** In `TASK-D1-07` (Evidence Explorer UI), incorporate dedicated **Exploration Scenario Presets** in addition to keyword search:
  1. *Artemis Exploration Atmosphere:* $34\%\text{ O}_2$ at $56.5\text{ kPa}$ ($8.2\text{ psia}$), low forced flow ($1\text{--}5\text{ cm/s}$).
  2. *Standard ISS Orbit Atmosphere:* $21\%\text{ O}_2$ at $101.3\text{ kPa}$ ($14.7\text{ psia}$), cabin ventilation ($10\text{--}20\text{ cm/s}$).
  3. *Depressurized Extinction Boundary:* High oxygen, reduced pressure ($0.5\text{ atm}$).
* **Impact on Backlog:** Enhances `TASK-D1-07` with preset filter buttons; zero backend schema changes required.

### Modification 2: Bounded Initial Solid Fuel Ingestion Focus
* **Context:** The official challenge mentions both solid fuel flammability (BASS, Saffire) and liquid droplet combustion (FLEX). However, droplet burning runs feature zero forced flow ($v=0$) and spherical geometry, which conflicts with canonical HCO non-nullable forced flow velocity (`DEC-02`).
* **Modification:** Formally re-affirm that the Day 1 initial vertical slice (P1) is bounded strictly to solid fuels:
  * Ingest BASS-II flat PMMA thin-film summaries (`PSI25-ART-002`).
  * Ingest Saffire-I specimen initial dimensions (`PSI98-ART-002`).
  * FLEX droplet burning records are explicitly cataloged as literature reference links and deferred to Phase 2 / P3.
* **Impact on Backlog:** Protects `TASK-D1-05` from parsing delays; guarantees 100% schema compliance.

### Modification 3: Grounded AI Citation Guardrails & Deterministic Fallback
* **Context:** The challenge encourages AI-powered interpretation, but NASA judges strictly penalize hallucinated numbers or fake scientific citations.
* **Modification:** In `TASK-D1-11` (Grounded Explanations via Gemini API), mandate that:
  1. Prompts supply only retrieved database run records and forbid external ungrounded assertions.
  2. An automated post-generation regex validator verifies that every cited `[PSI-XX:RunYY]` exists in the retrieved context.
  3. If Gemini API times out, returns an error, or produces an unverified citation, the UI immediately displays the deterministic tabular findings card without error dialogs.
* **Impact on Backlog:** Refines `TASK-D1-11` with strict fallback handling; prevents live demo failure.

### Modification 4: Preserving Unresolved Scientific Discrepancies
* **Context:** The Saffire-I thickness conflict (`DEC-01`: 0.37 cm table vs ~0.4 mm paper) and BASS-II fan index (`DEC-04`: 0–100 display setting vs $m/s$) remain open without official CAD drawings or duct calibration curves.
* **Modification:** Prohibit any automated normalization or averaging of Saffire-I thickness. Store verbatim raw reported values with an `APPROXIMATED` tag. Retain BASS-II fan display setting as an un-indexed integer.
* **Impact on Backlog:** Prevents corrupting physical evidence in `TASK-D1-04` and `TASK-D1-05`.

---

## 4. Affected Backlog Tasks & Delta Summary

| Task ID | Original Day 1 Task Scope | Mandated Scope Modification | Implementation Impact |
| :--- | :--- | :--- | :--- |
| **TASK-D1-01** | General challenge statement review | Verify that newly added Exploration Scenario Presets directly address official SME prompt. | 15 min review during Day 1 kickoff. |
| **TASK-D1-04** | Pydantic data contract models | Ensure models accommodate verbatim Saffire-I thickness strings and BASS-II fan display integers. | Add `is_approximated` flag to Pydantic models. |
| **TASK-D1-05** | Ingestion pipeline for PSI datasets | Enforce strict solid-combustion boundary: ingest BASS-II flat PMMA and Saffire-I sample tables; quarantine fan-only runs. | High reliability: 2 clean CSV tables ingested into PostgreSQL. |
| **TASK-D1-07** | Explorer grid UI | Add "Artemis Habitat" ($34\%\text{ O}_2$) and "ISS Standard" ($21\%\text{ O}_2$) quick scenario filter buttons. | Frontend UI enhancement; 30 min effort. |
| **TASK-D1-11** | Gemini API grounded explanations | Integrate strict post-generation citation check with automatic deterministic fallback. | Bulletproof AI reliability; zero hallucination risk. |

---

## 5. Summary of Authorized Scope Boundaries

```
┌────────────────────────────────────────────────────────────────────────┐
│ AUTHORIZED IMPLEMENTATION BOUNDARY (DAY 1)                             │
├───────────────────────────────────┬────────────────────────────────────┤
│ INCLUDED (P0 / P1 / P2)           │ EXCLUDED / DEFERRED (P3)           │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Verified Saffire-I flat samples │ • Quiescent droplet burning (FLEX) │
│ • Verified BASS-II flat PMMA runs │ • Uncalibrated BASS-II fan runs    │
│ • Canonical HCO PostgreSQL tables │ • Automated Saffire thickness norm │
│ • Full-text search & Explorer UI  │ • SoFIE-MIST raw table ingestion   │
│ • Side-by-side comparison drawer  │ • Predictive ML fire-spread models │
│ • Physical comparability warning  │ • External Neo4j graph database    │
│ • Evidence-gap indicator badge    │ • 3D flame simulation engines      │
│ • Grounded Gemini explanations    │ • Code before Nov 14, 9:00 AM      │
└───────────────────────────────────┴────────────────────────────────────┘
```

The engineering roadmap for Day 1 is now formally authorized, de-risked, and locked.
