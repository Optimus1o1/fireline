# Scientific Validation & Limitations Specification

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Author:** Moon Sanctum Labs (*Decode. Build. Evolve.*) | Aniket Nandi (Kolkata, IST)

---

## 1. The Epistemic Philosophy: Truth Over Extrapolation

In early space exploration, catastrophic accidents—such as the Apollo 1 command module fire (1967) and the Mir space station Kvant-1 oxygen generator fire (1997)—demonstrated that fire safety cannot tolerate assumptions or vague generalizations.

FIRELINE establishes a rigorous **Epistemic Classification System** that explicitly labels every claim, output, and recommendation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EPISTEMIC TAXONOMY                              │
├─────────────────┬──────────────────────────────────────────────────────┤
│ SUPPORTED       │ Directly substantiated by audited empirical          │
│                 │ measurements recorded during NASA orbital flights.   │
├─────────────────┼──────────────────────────────────────────────────────┤
│ INFERRED        │ Derived from physical laws (e.g., combustion energy   │
│                 │ balance or transient chamber pressure models) with   │
│                 │ explicitly stated thermodynamic assumptions.         │
├─────────────────┼──────────────────────────────────────────────────────┤
│ EVIDENCE_GAP    │ Environmental or material regimes where zero valid    │
│                 │ microgravity flight data exists. Extrapolation is    │
│                 │ flagged as physically ungrounded and hazardous.      │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

## 2. Quantitative System Verification

FIRELINE was subjected to a comprehensive verification protocol covering unit contracts, integration pipelines, physical boundary conditions, and adversarial edge cases:

### 2.1 Automated Test Suite Results
- **Framework:** Pytest 9.1.1 on Python 3.12.10
- **Total Tests Executed:** 69
- **Passed:** 69 (100%)
- **Failed:** 0
- **Warnings:** 0
- **Execution Speed:** 0.24 seconds

### 2.2 Adversarial Robustness Testing (`test_scientific_adversarial.py`)
Ten targeted adversarial scenarios were injected into the system to verify failure modes:
1. *Negative Ambient Pressure ($-10.0\text{ kPa}$):* Rejected immediately by Pydantic bounds contract.
2. *Super-Oxygenated Atmosphere ($> 100\%\ \text{O}_2$):* Rejected at API schema level.
3. *Zero-Thickness Fuel ($0.0\text{ mm}$):* Rejected as physical impossibility.
4. *Transposed Aspect Ratios ($L \ll W$):* Flagged with specimen geometry warning.
5. *Cross-Phase Comparison (Droplet vs Fabric):* Intercepted by Gate 1 (`Regime`); immediately marked `INCOMPARABLE`.
6. *Thermally Thin vs Thick ($0.05\text{ mm}$ vs $10.0\text{ mm}$ PMMA):* Intercepted by Gate 3 (`Geometry & Biot Number`); marked `INCOMPARABLE`.
7. *Distinction of Zero Flow vs Missing Flow:* Zero flow ($0.0\text{ cm/s}$) treated as quiescent diffusion; `null` flow preserved as unmeasured sensor.
8. *Adversarial Prompt Injection in SI Copilot:* System prompt isolation and regex citation guard prevent system instruction override.
9. *Malformed DOI Citation Links:* Caught by regex URL validator during ingestion.
10. *Extreme Hypobaric Extrapolation ($5\text{ kPa}$):* Assessor assigns 0% coverage and flags `CRITICAL` empirical gap.

---

## 3. Explicit Scientific Limitations & Boundaries

To preserve complete transparency with NASA evaluators and spaceflight engineers, FIRELINE explicitly discloses its operational boundaries:

### 1. Decision-Support, Not an Automated Safety Certifier
FIRELINE is an evidence linkage engine and research decision-support tool. It **does NOT** compute synthetic "probability of spacecraft destruction" percentages, nor does it replace NASA Payload Safety Review Panels or certified material flammability tests required under NASA-STD-6001.

### 2. Corpus Scope & Representativeness
The empirical corpus currently indexed consists of **9 fully validated NASA PSI flight runs** (4 from Saffire-I `PSI-98` / `PSI98-ART-002`, 5 from BASS-II `PSI-25` / `PSI25-ART-002`) and **20 peer-reviewed audited findings**.
- This dataset serves as a verified, high-fidelity proof-of-concept demonstrating the platform's architecture.
- Full expansion to Saffire-II through VI, CIR-FLEX droplet libraries, and BASS-I is architecturally supported via the Pydantic ingestion pipeline.

### 3. Droplet Combustion Table Deferral (`DEC-02`)
Liquid droplet combustion data from the FLEX investigation (`PSI-69`) is currently represented via 3 audited peer-reviewed findings (`FLEX-001`, `FLEX-002`, `FLEX-003`) to gate multi-phase comparisons. Droplet tabular records are held in reserve until spherical droplet geometry schemas are unified with solid flat plates.

### 4. Raw Fan Display Preservation (`DEC-04`)
In BASS-II, airflow was controlled via an uncalibrated digital display index (`47–62`). In the absence of an officially published NASA wind-tunnel calibration curve for the ISS Microgravity Science Glovebox duct, FIRELINE stores these readings strictly as `fan_display_index` and sets `flow_velocity_cms` to `null`. Converting these indices to meters-per-second without calibration data would introduce fraudulent aerodynamic values.

### 5. Chamber Pressure Surge Disambiguation (`DEC-05`)
During the Saffire-I large-scale fire, the pressure increase within the Cygnus vehicle is documented in two distinct forms:
- $\Delta P \approx 3.8\text{ kPa}$: A derived theoretical combustion estimate based on total heat release rate models (`SAFFIRE-006`, Epistemic status: `INFERRED`).
- $0.5\text{ kPa}$: Unverified preliminary vehicle telemetry (`SAFFIRE-009`, Epistemic status: `INFERRED`).
FIRELINE strictly isolates these values from primary empirical sensor logs.

### 6. Partial Gravity (Moon & Mars) Extrapolation Limits
Microgravity experiments ($0\text{ g}$) eliminate buoyancy. However, the Moon ($0.166\text{ g}$) and Mars ($0.38\text{ g}$) introduce partial gravity, where weak buoyant plumes interact with forced cabin ventilation. Microgravity data provides the critical bounding baseline for quiescent diffusion, but cannot fully replace dedicated partial-gravity parabolic flight or centrifuge experiments. FIRELINE explicitly flags this as an active research frontier.

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
