# Phase 0.99 — Hackathon Handoff Brief

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency:** CIPHER — *Decode. Build. Evolve.*  
**Author / Lead:** Aniket Nandi (Kolkata, IST)  
**Target Event:** NASA Space Apps Challenge 2026 (November 14–15, 2026)  
**Handoff Date:** October 11, 2026 (Baseline Freeze)  
**Document Status:** Executive Handoff Blueprint  
**Mode:** Documentation-only, pre-event preparation  

---

## 1. Section A — Project Identity & Core Mission

* **Project Name:** **FIRELINE**
* **Full Expansion:** **Fire Intelligence & Research Evidence Linkage Engine**
* **Agency Identity:** **CIPHER** — *Decode. Build. Evolve.*
* **Core Pitch:**  
  > FIRELINE transforms decades of heterogeneous NASA microgravity combustion research into an evidence-linked scientific intelligence platform that helps spacecraft designers, safety engineers, and researchers discover relevant experimental data, compare physical combustion findings, and explicitly identify where available empirical evidence is insufficient to answer spacecraft fire-safety questions.

FIRELINE is not a generic chatbot or a synthetic data aggregator. It is an engineering-grade scientific research engine built directly on primary NASA Physical Sciences Informatics (PSI) records, preserving source provenance, environmental context, and physical boundary constraints at every layer.

---

## 2. Section B — The Scientific & Technical Problem

Spacecraft fire safety is governed by physical combustion phenomena that behave fundamentally differently in microgravity than on Earth:
1. **Absence of Natural Buoyancy:** Natural buoyant convection is absent in microgravity. Hot combustion products do not rise, causing flames to depend entirely on forced airflow patterns or slow molecular diffusion.
2. **Experimental Heterogeneity:** Across major NASA flight campaigns (e.g., Saffire on Cygnus vehicles, BASS-II and FLEX on the International Space Station), experiments were performed under wildly different configurations:
   * **Geometry:** Large fabric/PMMA sheets ($0.4\text{ m} \times 1.0\text{ m}$) in Saffire-I vs. small flat films ($1\text{ cm} \times 10\text{ cm}$) or solid rods in BASS-II vs. suspended liquid droplets in FLEX.
   * **Atmosphere:** Varying oxygen concentrations ($15\%\text{ to }30\%\text{ O}_2$) and ambient pressures ($0.5\text{ to }1.0\text{ atm}$).
   * **Flow Velocity:** Forced concurrent or countercurrent airflows ($1.0\text{ to }20.0\text{ cm/s}$) vs. completely quiescent chambers ($0\text{ cm/s}$).
3. **The Extrapolation Trap:** A common engineering failure in spacecraft material selection is extrapolating results from one experimental regime to another. For example, assuming that flame spread rates observed on small PMMA rods in narrow ducts apply to large fabric panels in cargo modules.
4. **The Provenance Disconnect:** Scientific publications frequently report synthesized conclusions or idealized models that obscure the raw experimental run numbers, individual run uncertainties, or uncalibrated instrument settings present in the primary research tables.

**FIRELINE solves this by structuring microgravity combustion evidence, enforcing physical comparability gates, and preventing scientifically invalid generalizations.**

---

## 3. Section C — Core Scientific Differentiation

FIRELINE distinguishes itself across five critical engineering pillars:

| Capability | Standard Search / Generic LLM | FIRELINE Scientific Architecture |
| :--- | :--- | :--- |
| **Data Foundation** | Web scrapes, unverified PDF abstracts, synthetic training data | Authoritative NASA PSI primary experimental tables, verified flight records, and DOI-linked publications. |
| **Data Integrity** | Missing values often hallucinated or treated as zero; units converted blindly | Raw reported values and original units ($psia$, $in$, $ft/min$) preserved alongside validated SI units; missingness remains `NULL`. |
| **Cross-Experiment Comparison** | Superficial text matching; conflates different physical regimes | **Gated physical comparability:** Warns or blocks comparison when flow geometries, thermal regimes, or flow velocities are incompatible. |
| **Evidence Reasoning** | Black-box generated summaries with hallucinated citations | Strict 3-tier epistemic classification (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`); every citation resolves to a verified flight run. |
| **Handling the Unknown** | Offers plausible-sounding answers when data does not exist | **Explicit Evidence Gaps:** Transparently displays when no NASA flight data exists for a queried material or environmental regime. |

---

## 4. Section D — Target End-to-End User Journey

FIRELINE delivers a clean, coherent research workflow designed for spacecraft safety engineers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. RESEARCH QUERY                                                      │
│ User enters query: "Flame spread rate of PMMA under low concurrent flow"│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. RETRIEVE EVIDENCE RECORDS                                           │
│ System queries structured PSI records; filters by material and flow    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. INSPECT EXPERIMENTAL CONTEXT                                        │
│ User opens BASS-II run record; inspects flow velocity, O2, dimensions  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. COMPARE FINDINGS (PHYSICAL GATING)                                  │
│ Side-by-side comparison with Saffire-I; system flags geometry difference│
│ (Thin film vs. thick panel: "WARNING: Geometry regime differs")        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. IDENTIFY EVIDENCE GAPS                                              │
│ System reports: "No flight data exists for PMMA below 0.5 cm/s flow"   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. TRACE SOURCE & CITATION                                             │
│ Direct link to NASA PSI repository table (PSI-25, Run 12) & Glenn DOI  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Section E — Pragmatic Implementation Architecture

To ensure flawless delivery within the 48-hour hackathon window, FIRELINE uses a lightweight, resilient stack with no unnecessary dependencies:

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND PRESENTATION LAYER (Next.js 14+ App Router, TypeScript, Tailwind)│
│ • Research Query & Explorer Interface                                  │
│ • Evidence Detail & Boundary Conditions Panel                          │
│ • Side-by-Side Experimental Comparison View with Compatibility Badges  │
│ • Evidence Gap Alert Cards & NASA Source Provenance Links              │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │ HTTPS / REST
┌──────────────────────────────────┴─────────────────────────────────────┐
│ DATA & APPLICATION SERVICES (PostgreSQL via Supabase)                   │
│ • Relational Evidence Schema (`investigations`, `runs`, `measurements`)│
│ • Full-Text Search Indexing over materials, fuels, and flight campaigns│
│ • Epistemic Classification Engine (Deterministic Rule Gates)           │
│ • Optional Grounded Explanations (Gemini API with Citation Guardrails) │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │ Python Ingestion Pipeline
┌──────────────────────────────────┴─────────────────────────────────────┐
│ SCIENTIFIC PRE-FLIGHT INGESTION (Python 3.12, Pandas, Pydantic)        │
│ • Verified NASA PSI Tables (`PSI98-ART-002`, `PSI25-ART-002`)          │
│ • Deterministic Pre-Ingestion Validator & Quarantine Isolation         │
│ • Unit Normalization Pipeline ($in \to mm$, $psia \to kPa$, $ft/min \to cm/s$)│
└────────────────────────────────────────────────────────────────────────┘
```

### Component Status & Delivery Priority:
1. **Core Relational Schema & Full-Text Search (P0):** PostgreSQL via Supabase. Required for the initial vertical slice.
2. **Deterministic Ingestion & Validation Script (P0):** Python CLI script ingesting verified CSV tables.
3. **Frontend Explorer & Comparison UI (P1):** Next.js App Router with TypeScript and Tailwind CSS.
4. **AI Research Grounding (P2, Conditional):** Gemini API calling structured Supabase records, enforcing strict citation resolution. If credentials or rate limits fail, the system falls back seamlessly to deterministic search.
5. **Deferred Bloat (Strictly Excluded):** No external Neo4j graph database, no unverified vector database migrations, no complex 3D simulation engines.

---

## 6. Section F — Data Strategy & Initial Ingestion Path

The initial Day 1 implementation scope ingests two verified NASA PSI primary source artifacts:

1. **Saffire-I (`PSI98-ART-002`):**
   * **Source:** NASA PSI Investigation PSI-98 (Spacecraft Fire Safety Experiment I, flown on Cygnus OA-6).
   * **Artifact:** Pre-test specimen dimension table.
   * **Fuel / Material:** SIBAL fabric (75% cotton, 25% fiberglass) and PMMA sheets.
   * **Conditions:** Concurrent flow ($20\text{ cm/s}$), normal atmospheric pressure ($\approx 101.3\text{ kPa}$), standard air ($21\%\text{ O}_2$).
   * **Preservation Rule:** Store verbatim sample dimensions ($L=100\text{ cm}$, $W=40\text{ cm}$, reported thickness). Automated thickness normalization is excluded per `DEC-01`.
2. **BASS-II (`PSI25-ART-002`):**
   * **Source:** NASA PSI Investigation PSI-25 (Burning and Suppression of Solids — II, flown on ISS).
   * **Artifact:** Flat thin-film summary table.
   * **Fuel / Material:** Polymethyl methacrylate (PMMA) flat films ($1.0\text{ cm}$ width).
   * **Conditions:** Concurrent nitrogen/oxygen duct flow ($1.0\text{--}5.5\text{ cm/s}$), $21\%\text{ O}_2$.
   * **Preservation Rule:** Ingest only runs with reported airspeed; exclude uncalibrated fan index runs per `DEC-04`.

All candidate records must pass through the **9 Deterministic Ingestion Gates** formulated in Phase 0.98 before entering the database.

---

## 7. Section G — The Ten Scientific Integrity Mandates

These rules are non-negotiable across all code, database queries, and user interfaces:

1. **Missing Measurements Are Not Zero:** Unrecorded or missing sensor data must remain `NULL`. Never substitute zero for missing flame spread rates, temperatures, or airflow speeds.
2. **Unknown Units Are Never Inferred:** If a source column lacks explicit units, the record must be quarantined. Units must never be assumed.
3. **Original Reported Values Are Preserved:** The database must store both the verbatim reported value with its source unit and the calculated SI value.
4. **Synthetic Test Data Is Strictly Barred:** Fixture data marked `SYNTHETIC_ILLUSTRATIVE` must never be indexed or returned in empirical queries.
5. **Structural Validity $\ne$ Scientific Verification:** A CSV row that parses cleanly is not scientifically verified until its experimental boundary conditions and source provenance are validated.
6. **Measured Quantities Remain Distinct from Derived Quantities:** Directly observed sensor data must never be conflated with theoretical calculations, numerical models, or qualitative interpretations.
7. **Identical Units Do Not Imply Physical Comparability:** Two flame spread rates expressed in $mm/s$ cannot be compared directly if one occurred in a $1\text{ cm}$ duct and the other on a $1\text{ m}$ open panel.
8. **The AI Cannot Fabricate Citations:** Every scientific finding cited in an AI explanation must link directly to an existing database record with a valid NASA PSI run ID or DOI.
9. **Evidence Gaps Are First-Class Citizens:** When evidence is missing or inconclusive, the system must explicitly present an `EVIDENCE_GAP` badge rather than generating speculative answers.
10. **Relevance Scores Are Not Fire Probabilities:** Matching scores between a user scenario and NASA records indicate research relevance only, not physical fire risk or ignition likelihood.

---

## 8. Section H — System Boundaries & Disclaimers

* **Prototype Disclaimer:** FIRELINE is a scientific research and decision-support prototype created for the NASA Space Apps Challenge 2026. It is not an operational life-safety system, fire protection certification tool, or flight-readiness clearance mechanism.
* **Safety Boundary:** Spacecraft material selection and fire-safety compliance must adhere to official NASA technical standards (e.g., NASA-STD-6001B) and undergo physical qualification testing at NASA White Sands Test Facility or designated flight centers.

---

## 9. Section I — Primary Acceptance Criteria & Test Mapping

The Day 1 MVP implementation will be verified against the following core acceptance tests defined in Phase 0.96 and Phase 0.97:

* `TEST-A01` / `FIXTURE-PROV-001`: Valid NASA PSI source provenance resolves to genuine investigation ID.
* `TEST-A02` / `FIXTURE-PROV-002`: Missing source identifier triggers hard rejection.
* `TEST-B01` / `FIXTURE-MISS-001`: Incomplete mandatory boundary conditions reject record.
* `TEST-B02` / `FIXTURE-MISS-002`: Missing non-critical measurements remain `NULL` without defaulting to zero.
* `TEST-C01` / `FIXTURE-UNIT-001`: Dual original and normalized units stored accurately.
* `TEST-D01` / `FIXTURE-COND-001`: Standard atmospheric pressure and oxygen validated.
* `TEST-E01` / `FIXTURE-SAFE-001`: Negative or zero oxygen concentrations rejected.
* `TEST-G01` / `FIXTURE-SYNT-001`: Synthetic fixture tags barred from production search indices.
* `TEST-I01` / `FIXTURE-COMP-001`: Physical comparability check warns on incompatible flow geometries.

---

## 10. Section J — Three-Minute Hackathon Demo Narrative

The live final presentation will follow this exact, timed 3-minute script:

* **0:00 – 0:30 (The Problem):**  
  *"Designing fire-safe spacecraft requires understanding how flames spread in microgravity. But NASA's decades of combustion research are scattered across heterogeneous PSI tables with different fuels, airflows, and oxygen levels. Engineers risk extrapolating small-scale tests to cargo-scale vehicles—or missing critical evidence entirely."*
* **0:30 – 1:00 (Ask a Research Question):**  
  *"We ask FIRELINE: 'How does airflow velocity affect flame spread on PMMA in microgravity?' FIRELINE immediately retrieves structured flight runs from the BASS-II and Saffire-I campaigns."*
* **1:00 – 1:45 (Reveal the Evidence & Provenance):**  
  *"Opening BASS-II Run 12, we see the complete experimental context: $1.0\text{ cm}$ PMMA film, $21\%\text{ O}_2$, forced flow at $3.2\text{ cm/s}$, and a measured spread rate of $0.08\text{ mm/s}$. Notice that original units and raw flight run coordinates are preserved. Every single number traces back to NASA Glenn Research Center records."*
* **1:45 – 2:20 (Compare Evidence & Physical Gating):**  
  *"Now we compare BASS-II with Saffire-I. FIRELINE flags a critical physical boundary warning: BASS-II was a $1\text{ cm}$ narrow-channel sample, while Saffire-I was a $1\text{ m}$ panel. The system prevents invalid mathematical extrapolation while allowing researchers to observe concurrent flow trends."*
* **2:20 – 2:50 (Expose an Evidence Gap):**  
  *"What happens if an engineer asks about flame spread under low pressure ($0.5\text{ atm}$) and low flow? Instead of hallucinating, FIRELINE displays a clear `EVIDENCE_GAP` badge: NASA has not flown this specific regime. This immediately tells mission planners where new physical testing is required."*
* **2:50 – 3:00 (Closing):**  
  *"FIRELINE: Transforming NASA microgravity combustion research into traceable, physically grounded spacecraft fire intelligence. Decode. Build. Evolve."*
