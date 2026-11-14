# FIRELINE — Project Overview & Executive Summary

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project Title:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Team / Agency:** Moon Sanctum Labs (*Decode. Build. Evolve.*)  
**Lead Developer:** Aniket Nandi (Kolkata, IST)  
**Repository:** [https://github.com/moon-sanctum-labs/fireline](https://github.com/moon-sanctum-labs/fireline)  
**Official Challenge URL:** [https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)

---

## 1. The Core Vision: Flame in Freefall

When fire ignites in microgravity, everything humans know about combustion on Earth breaks down. 

On Earth, hot combustion gases rise due to natural buoyancy, drawing in fresh oxygen to feed the base of the flame. In the freefall of orbit—aboard the International Space Station or inside a deep-space exploration vehicle—buoyancy vanishes. Without buoyant convection, flames become hemispherical, soot agglomerates into dense clouds, chemical reaction zones widen, and fires behave in counter-intuitive, deadly ways. A fire that would self-extinguish on Earth can smolder indefinitely in microgravity, sustained by the gentle airflow of cabin life-support systems.

For decades, NASA and international researchers have conducted groundbreaking microgravity combustion experiments—such as **Saffire** (Spacecraft Fire Safety Demonstration Project) on uncrewed Cygnus cargo ships, **BASS-II** (Burning and Suppression of Solids) in the ISS Microgravity Science Glovebox, and **FLEX** (Flame Extinction Experiment) in the Combustion Integrated Rack.

However, this precious physical research is trapped in fragmented spreadsheets, raw image archives, and dense scientific papers across the **NASA Physical Sciences Informatics (PSI)** repository. Flight planners, habitat architects, and safety engineers currently lack a unified, scientifically grounded tool to cross-reference experimental evidence, evaluate physical comparability, and identify critical fire-safety voids for upcoming missions.

**FIRELINE solves this.**

---

## 2. What is FIRELINE?

**FIRELINE (Fire Intelligence & Research Evidence Linkage Engine)** is an interactive, Super Intelligence (SI)-powered decision-support engine engineered specifically to translate raw microgravity combustion research into actionable spaceflight fire safety intelligence.

Rather than relying on ungrounded AI text generators or speculative fire risk formulas, FIRELINE implements an **evidence-first, physically gated architecture**:

```
        NASA PSI REPOSITORY
  (Saffire-I, BASS-II, FLEX Data)
                 │
                 ▼
     PYDANTIC DATA CONTRACTS
  (Strict Units, Bounds & Decisions)
                 │
                 ▼
┌─────────────────────────────────┐
│        FIRELINE PLATFORM        │
├─────────────────────────────────┤
│ 1. Evidence Explorer            │ ── Search, inspect & verify primary NASA runs
│ 2. 7-Gate Comparability Engine  │ ── Deterministically compare runs without extrapolation
│ 3. Exploration Gap Assessor     │ ── Evaluate Artemis, ISS & Mars cabin atmospheres
│ 4. SI Scientific Copilot        │ ── Ask questions with verified citations & zero hallucinations
└─────────────────────────────────┘
```

---

## 3. Four Core Capabilities

### 1. Primary Evidence Explorer (`/explore`)
- Direct access to validated flight records from **Saffire-I (`PSI-98`)** and **BASS-II (`PSI-25`)**.
- Deep multi-variable filtering by fuel material (SIBAL fabric, PMMA acrylic), combustion regime, oxygen concentration ($16\%\text{--}21\%\ \text{O}_2$), ambient pressure, and forced airflow.
- Transparent provenance: every record displays original NASA artifact accession IDs, peer-reviewed DOIs, physical specimen dimensions ($W \times L \times T$), chamber volumes, and SHA-256 cryptographic hashes.

### 2. 7-Gate Physical Comparability Engine (`/api/evidence/compare`)
- Spacecraft fire safety cannot tolerate invalid physical extrapolation (e.g., comparing thin fabric films to thick structural acrylic slabs).
- FIRELINE subjects any two combustion tests to 7 deterministic thermodynamic gates:
  1. *Combustion Regime* (Solid surface vs Droplet)
  2. *Fuel Material Family* (Cellulosic blend vs Thermoplastic)
  3. *Sample Geometry & Biot Number* (Thermally thin vs Thermally thick)
  4. *Forced Convective Flow Velocity* ($\pm 25\%$ aerodynamic tolerance)
  5. *Ambient Atmospheric Pressure* ($\pm 10.0\text{ kPa}$ tolerance)
  6. *Oxygen Concentration* ($\pm 2.0\%\ \text{O}_2$ tolerance)
  7. *Burn Orientation* (Opposed vs Concurrent flow)
- Delivers an explainable compatibility rating (`FULLY_COMPARABLE`, `CONDITIONALLY_COMPARABLE`, `INCOMPARABLE`, `CONFLICTING`) with full physical derivation notes.

### 3. Spacecraft Exploration Gap Assessor (`/assess`)
- Evaluates operational mission cabin atmospheres against empirical microgravity data:
  - **ISS Nominal:** $21.0\%\ \text{O}_2,\ 101.3\text{ kPa}$ (High empirical coverage: $>80\%$).
  - **Artemis Lunar Habitat:** $34.0\%\ \text{O}_2,\ 56.5\text{ kPa}$ ($8.2\text{ psia}$ exploration atmosphere).
  - **Mars Surface Habitat:** $28.0\%\ \text{O}_2,\ 70.3\text{ kPa}$ with $0.38\text{ g}$ partial gravity.
  - **Deep Space Transit:** Quiescent low-flow environments.
- Automatically isolates empirical voids (e.g., highlighting that no microgravity combustion tests have been conducted at $34\%\ \text{O}_2$ and $56.5\text{ kPa}$), assigns severity ratings, and provides prioritized flight experiment recommendations for future Saffire missions.

### 4. Grounded SI Research Copilot (`/copilot`)
- Powered by Google Gemini with strict grounding in 20 peer-reviewed microgravity combustion findings.
- **Automated Citation Validator:** Inspects every AI response with regex pattern matching. If a response lacks explicit citations (e.g., `[SAFFIRE-001]`, `[PSI98-F1C1/F1C2]`) or cites non-existent findings, the system automatically intervenes and replaces the output with a deterministic, peer-reviewed audited summary.
- **Zero Downtime Fallback:** Fully operational even when offline or without an active API key.

---

## 4. Why FIRELINE is Different

| Feature | Conventional AI Chatbot | Empirical Data Portal | FIRELINE Engine |
|:---|:---:|:---:|:---:|
| **Understands Microgravity Physics** | ❌ Hallucinates 1-g rules | ❌ Raw un-interpreted data | ✅ **7-Gate Physical Gating** |
| **Prevents Invalid Extrapolation** | ❌ Confuses thin vs thick fuels | ❌ No comparability check | ✅ **Biot Number & Regime Gates** |
| **Mission Gap Analysis** | ❌ Superficial generalizations | ❌ No mission evaluation | ✅ **Artemis & Mars Atmosphere Scan** |
| **Citation Verification** | ❌ Fabricates paper links | ❌ Static PDF links | ✅ **Automated Citation Guard & Fallback** |
| **Scientific Integrity** | ❌ Guesses missing data | ❌ Unstandardized formats | ✅ **DEC-01 to DEC-05 Null Preservation** |

---

## 5. Agency & Team

- **Agency:** Moon Sanctum Labs  
  *Decode. Build. Evolve.*  
  *Web design and development agency engineering resilient, scientific digital products.*
- **Lead Developer & Designer:** Aniket Nandi (Kolkata, IST)
- **Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall

---
*Built with scientific rigor to safeguard human explorers venturing into deep space.*
