# FIRELINE — Fire Intelligence & Research Evidence Linkage Engine

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026-blue.svg)](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)
[![Challenge](https://img.shields.io/badge/Challenge-Flame%20in%20Freefall-orange.svg)](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)
[![Agency](https://img.shields.io/badge/Agency-Moon%20Sanctum%20Labs-E0A45C.svg)](https://moonsanctum.dev)
[![Lead Developer](https://img.shields.io/badge/Lead%20Developer-Aniket%20Nandi-0F1013.svg)](#team--attribution)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.29-black.svg)](https://nextjs.org/)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Pytest-69%2F69%20Passing-brightgreen.svg)](#automated-test-suite)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
> **Challenge:** NASA Space Apps Challenge 2026 — *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*  
> **Lead Developer & Designer:** Aniket Nandi (Kolkata, IST)

---

## 1. Executive Summary

**FIRELINE** is an interactive, scientifically grounded decision-support engine engineered to bridge microgravity combustion physics and human spaceflight mission safety. Built directly upon primary experimental datasets from the **NASA Physical Sciences Informatics (PSI)** repository, FIRELINE enables flight directors, life-support engineers, and spacecraft safety architects to:

1. **Explore Primary NASA Evidence:** Query, filter, and inspect rigorously validated microgravity combustion experiments (Saffire-I and BASS-II) with full data provenance, DOI citations, and original measurement units.
2. **Evaluate Physical Comparability:** Deterministically compare pairs of combustion runs across 7 strict thermodynamic and aerodynamic boundary gates, preventing invalid extrapolation across incompatible regimes (such as thin-film fabrics vs. thick fuel slabs).
3. **Assess Exploration Mission Fire Risks & Evidence Gaps:** Evaluate mission atmospheric architectures—such as **ISS Nominal**, **Artemis Lunar Habitat** ($34\%\ \text{O}_2,\ 56.5\text{ kPa}$), and **Mars Surface Hab** ($28\%\ \text{O}_2,\ 70.3\text{ kPa}$)—against empirical evidence, quantitatively isolating unexplored environmental regimes.
4. **Consult the SI Scientific Copilot:** Conduct grounded natural-language inquiry powered by Google Gemini, enforced by a deterministic citation verification pipeline that guarantees zero hallucinations and flags epistemic evidence gaps.

```
       NASA PSI DATASETS                    PHYSICAL VALIDATION               SCIENTIFIC INTELLIGENCE
  ┌────────────────────────┐              ┌──────────────────────┐          ┌─────────────────────────┐
  │ • Saffire-I  (PSI-98)  │ ──Ingestion─▶│  7 Comparability     │ ──Eval──▶│  SI Copilot (Gemini)    │
  │ • BASS-II    (PSI-25)  │   Contracts  │  Gates & Boundaries  │          │  Deterministic Fallback │
  │ • FLEX Gating (PSI-69) │              │  ISS / Artemis / Mars│          │  Citation Verification  │
  └────────────────────────┘              └──────────────────────┘          └─────────────────────────┘
```

---

## 2. Non-Negotiable Scientific Principles

To maintain scientific integrity and prevent life-critical miscalculations in spacecraft design, FIRELINE adheres to four foundational axioms:

1. **Epistemic Classification Floor:**
   - **`SUPPORTED`**: Directly substantiated by audited empirical measurements in NASA PSI records.
   - **`INFERRED`**: Thermodynamically plausible derivation bounded by microgravity combustion literature, with explicit derivation notes and assumptions disclosed.
   - **`EVIDENCE_GAP`**: Regimes where no valid microgravity experimental data exists (e.g., hypoxic Artemis atmospheres under buoyant convective crossflows).
2. **Deterministic Physical Comparability:**
   FIRELINE never uses subjective heuristics or opaque machine learning models to assess whether two fire experiments are comparable. Comparisons pass through 7 strict physical gates (Regime, Material, Sample Geometry, Forced Convection, Ambient Pressure, Oxygen Enrichment, Burn Orientation).
3. **Zero Fabrication Policy:**
   Missing sensor measurements remain strictly `null` (never imputed as $0.0$). Uncalibrated instrumentation (e.g., BASS-II fan display dial readings `47–62`) are retained in their raw form and never converted to physical velocities (`DEC-04`). Derived chamber pressure surges ($\Delta P \approx 3.8\text{ kPa}$) and unverified telemetry ($0.5\text{ kPa}$) are strictly partitioned from empirical sensor logs (`DEC-05`).
4. **Decision-Support, Not Probability Calculator:**
   FIRELINE does not generate synthetic "probability of cabin blowout" numbers or automated fire safety certifications. It serves as an evidence retrieval and physical boundary validation engine for human flight controllers and payload safety boards.

---

## 3. NASA PSI Data Corpus

FIRELINE operates on a verified, representative corpus of NASA Physical Sciences Informatics (PSI) investigations:

| Investigation | PSI Identifier | Artifact / Dataset | Material / Target | Tested Atmosphere | Verification Status |
|:---|:---|:---|:---|:---|:---|
| **Saffire-I** | `PSI-98` | `PSI98-ART-002` (Cygnus PCM) | SIBAL fabric (75% cotton / 25% fiberglass), PMMA thick slabs | $21.0\%\ \text{O}_2$, $100.0\text{ kPa}$, $20.0\text{ cm/s}$ flow | **Verified Empirical** (4 runs, 7 findings) |
| **BASS-II** | `PSI-25` | `PSI25-ART-002` (ISS MSG) | Cast PMMA flat thin films ($0.005\text{ cm}$ thick) | $16.3\%\text{--}20.9\%\ \text{O}_2$, $97.9\text{--}101.4\text{ kPa}$, fan dial 47--62 | **Verified Empirical** (5 runs, 10 findings) |
| **FLEX** | `PSI-69` | Primary Literature (Nayagam 2015) | Heptane / Methanol fuel droplets ($1.5\text{--}4.0\text{ mm}$) | $21.0\%\ \text{O}_2$, $101.3\text{ kPa}$, quiescent microgravity | **Boundary-Gated Findings** (3 audited findings, droplet tables deferred) |

### Engineering Decisions (`DEC-01` through `DEC-05`)
- **`DEC-01`**: Strict typed JSON serialization for all empirical fields; `null` preserved for unrecorded parameters.
- **`DEC-02`**: Droplet combustion records (FLEX PSI-69) deferred from tabular record search until full geometry schema unification, but audited findings are indexed to gate multi-phase comparisons.
- **`DEC-03`**: Saffire flow visualization run designated as `PSI98-F1C1/F1C2` per NASA Cygnus flight flight log nomenclature.
- **`DEC-04`**: BASS-II fan display index preserved as an integer dial setting without invalid aerodynamic velocity conversion.
- **`DEC-05`**: Transient pressure findings clearly separated into derived chamber models ($\Delta P \approx 3.8\text{ kPa}$) and unverified telemetry ($0.5\text{ kPa}$).

---

## 4. System Architecture

FIRELINE is architected as a high-performance, dual-layer scientific application:

```
FIRELINE REPOSITORY ROOT
├── src/                                  # Next.js 15 Frontend & Fullstack API Routes
│   ├── app/
│   │   ├── page.tsx                      # Scientific Mission Control Dashboard
│   │   ├── explore/                      # Evidence Explorer with Multi-Param Filtering
│   │   ├── assess/                       # Mission Scenario Gap Assessor (ISS, Artemis, Mars)
│   │   ├── copilot/                      # SI Research Copilot with Real-Time Grounding
│   │   └── api/
│   │       ├── investigations/           # NASA Investigation Metadata Registry
│   │       ├── evidence/search/          # Deterministic Algorithmic Evidence Retrieval
│   │       ├── evidence/[id]/            # Primary Record Detail & Audit Provenance
│   │       ├── evidence/compare/         # 7-Gate Physical Comparability Engine
│   │       ├── assess/                   # Environmental Gap Matrix & Boundary Scanner
│   │       └── copilot/explain/          # Gemini Grounded Synthesis + Deterministic Fallback
│   ├── components/                       # Shared UI & Scientific Visualizers
│   ├── data/
│   │   ├── empirical_records.json        # 9 Validated NASA PSI Empirical Runs
│   │   └── audited_findings.json         # 20 Reconciled Peer-Reviewed Scientific Claims
│   └── lib/                              # Client-side State, Interfaces & Utilities
├── backend/                              # Python 3.12 Core Scientific Engine
│   ├── src/fireline_data/
│   │   ├── contracts/                    # Strict Pydantic Data Schemas & Validation Rules
│   │   ├── ingestion/                    # PSI CSV / Metadata Parsers & Normalizers
│   │   ├── comparability/                # 7-Gate Physical Comparability Matrix
│   │   ├── assessment/                   # Spacecraft Atmosphere Gap Assessor
│   │   └── copilot/                      # Retrieval Engine & Citation Verification Rig
│   └── tests/                            # Pytest Automated Test Suite (69 Tests)
│       ├── test_contracts.py             # Pydantic Schema Validation Tests
│       ├── test_comparability.py         # 7-Gate Boundary Condition Tests
│       ├── test_gap_assessor.py          # Mission Scenario Gap Tests
│       ├── test_copilot.py               # Grounded Citation & Retrieval Tests
│       ├── test_scientific_adversarial.py # 10 Scientific Adversarial Fuzzing Tests
│       └── test_e2e_journeys.py          # 8 End-to-End User Journey Workflows
├── docs/                                 # Complete Engineering, Audit & Submission Docs
│   ├── submission/                       # Official NASA Space Apps Submission Package
│   ├── final_architecture.md             # Complete Technical Architecture Specification
│   ├── final_data_dictionary.md          # Full Schema Field & Entity Dictionary
│   ├── final_api_reference.md            # REST API Specification with Payload Contracts
│   ├── final_validation_report.md        # Comprehensive 69-Test Validation Report
│   └── final_scientific_reference_audit.md # Primary Literature & PSI Dataset Verification
└── vercel.json                           # Production Deployment Manifest
```

---

## 5. Core Platform Features

### 5.1 Evidence Explorer (`/explore`)
- **Faceted Multi-Variable Search:** Filter records by NASA Investigation (`Saffire-I`, `BASS-II`), fuel material (`SIBAL`, `PMMA`), combustion regime (`Solid Opposed`, `Solid Concurrent`), oxygen concentration range, ambient pressure, and airflow.
- **Deep Provenance Display:** Every record surfaces primary NASA artifact identifiers, DOI citations, sample dimensions ($W \times L \times T$ in millimeters), chamber volumes, and exact measurement uncertainties.

### 5.2 7-Gate Physical Comparability Engine (`/api/evidence/compare`)
Evaluates pairs of microgravity combustion tests against 7 thermodynamic gates:
1. **Regime Compatibility:** Prevents cross-regime comparison (e.g., solid surface spread vs. droplet extinction).
2. **Material Fuel Family:** Distinguishes thin cellulosic blends from bulk thermoplastics.
3. **Geometry & Thickness:** Validates whether fuel is thermally thin ($\text{Bi} \ll 1$) or thermally thick ($\text{Bi} \ge 1$).
4. **Forced Convective Flow:** Evaluates flow velocity alignment within $\pm 25\%$.
5. **Chamber Atmospheric Pressure:** Validates ambient pressure alignment within $\pm 10\text{ kPa}$.
6. **Oxygen Enrichment ($\% \text{O}_2$):** Flags oxygen discrepancies exceeding $\pm 2.0\%\ \text{O}_2$.
7. **Burn Orientation:** Verifies opposed-flow vs. concurrent-flow spread aerodynamics.

**Compatibility Classifications:**
- `FULLY_COMPARABLE`: All 7 gates pass.
- `CONDITIONALLY_COMPARABLE`: Minor convective or pressure variance; physical trends comparable with scaling corrections.
- `INCOMPARABLE`: Critical thermodynamic gate failure (e.g., different fuel phase or geometry).
- `CONFLICTING`: Comparable environmental conditions showing divergent flammability outcomes.

### 5.3 Exploration Mission Gap Assessor (`/assess`)
Evaluates real-world exploration mission atmospheres against empirical microgravity data:
- **ISS Nominal Cabin:** $21.0\%\ \text{O}_2$, $101.3\text{ kPa}$, $5.0\text{--}20.0\text{ cm/s}$ ventilation drift.
- **Artemis Lunar Habitat (Exploration Atmosphere):** $34.0\%\ \text{O}_2$, $56.5\text{ kPa}$ ($8.2\text{ psia}$), reduced pressure with elevated oxygen.
- **Mars Surface Habitat:** $28.0\%\ \text{O}_2$, $70.3\text{ kPa}$ ($10.2\text{ psia}$), $0.38\text{ g}$ partial gravity.
- **Deep Space Transit:** $21.0\%\ \text{O}_2$, $101.3\text{ kPa}$, quiescent microgravity.

**Automated Output:** Parameter coverage radar, matched empirical precedents, and prioritized, actionable research recommendations to close identified safety gaps.

### 5.4 SI Research Copilot (`/copilot`)
- **Deterministic Evidence Retrieval:** Ingests user natural-language questions and retrieves relevant empirical records and audited findings using algorithmic keyword scoring.
- **Grounded Synthesis:** Calls Google Gemini 2.5 Flash / 1.5 Flash via `@google/genai` with a strict system prompt forbidding un-cited assertions.
- **Automated Citation Validator:** Inspects the generated response using regex pattern matching. If any claim cites non-existent findings or lacks citations, the system flags a validation warning and activates a deterministic fallback response derived directly from audited JSON findings.

---

## 6. Local Installation & Quickstart

### Prerequisites
- **Node.js:** v18.18+ or v20+ (Node v24 supported)
- **Python:** 3.11 or 3.12
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/moon-sanctum-labs/fireline.git
cd fireline
```

### Step 2: Frontend Setup
```bash
# Install frontend dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Backend Python Environment & Tests
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -e .
pip install pytest pydantic httpx

# Run automated test suite
pytest -v
```

### Step 4: Environment Variables (Optional)
To enable live Gemini API calls in the SI Copilot, configure `.env.local` in the repository root:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Note: If no API key is provided, FIRELINE seamlessly falls back to its deterministic evidence synthesis engine with zero downtime.)*

---

## 7. Verification & Quality Floor

FIRELINE satisfies rigorous engineering and scientific quality benchmarks:

| Quality Gate | Standard | Result | Details |
|:---|:---|:---|:---|
| **Python Unit & Integration Tests** | `pytest` | **69 / 69 Passed** | 0.24s execution time, 100% pass rate |
| **Scientific Adversarial Tests** | `test_scientific_adversarial.py` | **10 / 10 Passed** | Boundary checks, invalid units, negative dimensions |
| **End-to-End User Journeys** | `test_e2e_journeys.py` | **8 / 8 Passed** | Saffire, BASS-II, Artemis gap, Copilot fallback |
| **Next.js Production Build** | `npm run build` | **Clean Exit (Code 0)** | 11 routes compiled (7 static, 4 dynamic API) |
| **TypeScript Strict Checking** | `npm run typecheck` | **Zero Errors** | Zero type suppressions or broken interfaces |
| **ESLint Code Quality** | `npm run lint` | **Zero Warnings** | Clean Next.js core Web Vitals compliance |

---

## 8. Deployment Guide

### Vercel Deployment (Recommended)
FIRELINE is pre-configured with `vercel.json` for one-click deployment:
```bash
# Install Vercel CLI
npm install -g vercel

# Authenticate with Vercel
vercel login

# Deploy preview build
vercel

# Deploy to production
vercel --prod
```

### Docker / Standalone Deployment
```bash
# Build standalone Next.js image
npm run build
npm run start -p 3000
```

---

## 9. API Reference Summary

| Endpoint | Method | Purpose | Input / Query Params |
|:---|:---|:---|:---|
| `/api/investigations` | `GET` | Lists all indexed NASA PSI investigations | None |
| `/api/evidence/search` | `GET` | Search and filter empirical records | `q`, `investigation`, `material`, `limit` |
| `/api/evidence/[id]` | `GET` | Retrieve full record detail and audit trace | Dynamic route param: `id` |
| `/api/evidence/compare` | `POST` | Execute 7-gate physical comparability | `{ "record_a_id": "...", "record_b_id": "..." }` |
| `/api/assess` | `POST` | Evaluate mission environmental gap matrix | `{ "scenario_id": "artemis_lunar" \| custom }` |
| `/api/copilot/explain` | `POST` | Grounded SI scientific inquiry | `{ "question": "...", "record_ids": [...] }` |

*Full API specification and payload examples are documented in [docs/final_api_reference.md](file:///c:/Users/ANIKET/FIRELINE-%20Nasa's%20Research%20and%20decision%20support%20system/docs/final_api_reference.md).*

---

## 10. Team & Attribution

**Agency:** Moon Sanctum Labs  
*Decode. Build. Evolve.*  
**Lead Developer & Designer:** Aniket Nandi ([KOLKATA], [IST])  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Event:** NASA Space Apps Challenge 2026 — Global Hackathon  

### Primary Scientific Citations & Data Sources
1. **Saffire-I (PSI-98):** Urban, D. L., Ruff, G. A., Ferkul, P. V., Olson, S. L., et al. (2019). *Flame spread in large-scale microgravity experiments: Results from Saffire-I, II, and III*. Combustion and Flame, 205, 371-382. [DOI: 10.1016/j.combustflame.2019.04.015](https://doi.org/10.1016/j.combustflame.2019.04.015)
2. **BASS-II (PSI-25):** Olson, S. L., & Ferkul, P. V. (2017). *Microgravity flame spread over PMMA thin films: The Burning and Suppression of Solids-II (BASS-II) experiment*. NASA/TM-2017-219504. [NASA Technical Reports Server](https://ntrs.nasa.gov/)
3. **FLEX (PSI-69):** Nayagam, V., Dietrich, D. L., Ferkul, P. V., Hicks, M. C., & Williams, F. A. (2015). *Cool-flame extinction in droplet combustion under microgravity*. Combustion and Flame, 162(5), 2140-2147. [DOI: 10.1016/j.combustflame.2015.01.012](https://doi.org/10.1016/j.combustflame.2015.01.012)
4. **NASA Physical Sciences Informatics System:** [https://psi.nasa.gov/](https://psi.nasa.gov/)

---
*Developed with scientific rigor for the safety of human crews venturing beyond low Earth orbit.*
