# Solution & Innovation: The FIRELINE Architecture

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Author:** Moon Sanctum Labs (*Decode. Build. Evolve.*) | Aniket Nandi (Kolkata, IST)

---

## 1. Innovation Philosophy: Evidence-First Scientific Intelligence

Most modern artificial intelligence applications approach technical questions through generative extrapolation—prompting a large language model to guess answers based on broad statistical correlations across web text. In human spaceflight life support and fire safety, this approach is unacceptably dangerous. Combustion in microgravity is governed by stiff differential equations of fluid mechanics, radiation transfer, and chemical kinetics; an ungrounded LLM hallucination could lead to catastrophic miscalculations in vehicle atmospheric design.

FIRELINE introduces an **Evidence-First Scientific Intelligence (SI) Architecture**. Rather than allowing the AI model to generate unconstrained text, FIRELINE sandwiches generative intelligence between two deterministic, mathematically validated scientific layers:

```
[ INPUT: Spaceflight Research Query or Habitat Atmosphere ]
                        │
                        ▼
      ┌───────────────────────────────────┐
      │  LAYER 1: DETERMINISTIC EVIDENCE  │
      │  Pydantic Contracts & PSI Audits  │
      │  (DEC-01 to DEC-05 Null Preserved)│
      └───────────────────────────────────┘
                        │
                        ▼
      ┌───────────────────────────────────┐
      │  LAYER 2: PHYSICAL BOUNDARY GATES │
      │  7 Thermodynamic & Aerodynamic    │
      │  Comparability Gates              │
      └───────────────────────────────────┘
                        │
                        ▼
      ┌───────────────────────────────────┐
      │  LAYER 3: SI RESEARCH COPILOT     │
      │  Google Gemini 2.5 Flash          │
      │  + Automated Citation Validator   │
      │  + Zero-Downtime Fallback Engine  │
      └───────────────────────────────────┘
                        │
                        ▼
[ OUTPUT: Grounded, Epistemically Labeled Mission Intelligence ]
```

---

## 2. Key System Innovations

### Innovation 1: The 7-Gate Physical Comparability Matrix
Spacecraft materials engineers frequently look for data on one material and attempt to apply lessons from another. On Earth, this is often done using empirical thumb-rules. In microgravity, this causes dangerous errors because heat transfer mechanisms shift dramatically between regimes.

FIRELINE's **Physical Comparability Engine** deterministically validates any two combustion runs against 7 physical gates:

1. **Combustion Regime Gate:** Ensures tests share identical physical phases (rejects comparisons between solid surface flame spread and droplet combustion).
2. **Fuel Material Family Gate:** Differentiates charring cellulosic fabrics (SIBAL: 75% cotton / 25% fiberglass) from depolymerizing thermoplastics (cast PMMA acrylic).
3. **Geometry & Thermal Thickness Gate:** Checks sample dimensions and computes whether fuel is thermally thin ($\text{Bi} = \frac{h \cdot L_c}{k} \ll 1$, where temperature is uniform across thickness) or thermally thick ($\text{Bi} \ge 1$, where internal heat conduction limits spread rate).
4. **Forced Convective Flow Velocity Gate:** Verifies aerodynamic ventilation match within $\pm 25\%$, accounting for Damköhler number ($Da$) scaling.
5. **Ambient Pressure Gate:** Limits ambient pressure variance to $\pm 10.0\text{ kPa}$, accounting for gas-phase reaction timescales.
6. **Oxygen Concentration Gate:** Restricts oxidizer variance to $\pm 2.0\%\ \text{O}_2$, maintaining adiabatic flame temperature parity.
7. **Burn Orientation Gate:** Confirms aerodynamic alignment—opposed-flow flame spread (flame moves against the gas stream) vs concurrent-flow spread (flame moves with the gas stream).

**Result:** An explainable, four-tier classification (`FULLY_COMPARABLE`, `CONDITIONALLY_COMPARABLE`, `INCOMPARABLE`, `CONFLICTING`) that protects engineers from invalid physical scaling.

---

### Innovation 2: Exploration Mission Environmental Gap Assessor
NASA's upcoming Moon and Mars architectures diverge sharply from standard terrestrial air. The FIRELINE **Exploration Gap Assessor** allows mission planners to select or customize habitat atmospheres:
- **ISS Baseline:** $21.0\%\ \text{O}_2,\ 101.3\text{ kPa},\ 10.0\text{ cm/s}$
- **Artemis Lunar Gateway / Surface Hab:** $34.0\%\ \text{O}_2,\ 56.5\text{ kPa}\ (8.2\text{ psia}),\ 15.0\text{ cm/s}$
- **Mars Surface Hab:** $28.0\%\ \text{O}_2,\ 70.3\text{ kPa}\ (10.2\text{ psia}),\ 0.38\text{ g}$
- **Deep Space Transit Quiescent:** $21.0\%\ \text{O}_2,\ 101.3\text{ kPa},\ 0.0\text{ cm/s}$

The engine runs an environmental boundary intersection scan against all NASA PSI empirical records:
1. Calculates **Parameter Coverage Percentage** across Oxygen, Pressure, Flow, and Materials.
2. Formally isolates **Critical Empirical Gaps** (e.g., highlighting that no microgravity combustion tests have ever been conducted at $34\%\ \text{O}_2$ under $56.5\text{ kPa}$).
3. Generates **Prioritized Mission Recommendations** (e.g., recommending specific test matrices for upcoming Saffire-IV/V/VI flights).

---

### Innovation 3: Super Intelligence (SI) Copilot with Automated Citation Guard
To fulfill the NASA challenge's requirement for a Super Intelligence-powered research assistant, FIRELINE incorporates Google Gemini 2.5 Flash / 1.5 Flash via `@google/genai`, reinforced with a proprietary **Automated Citation Validator**:

1. **Algorithmic Evidence Retrieval:** Ingests user natural language queries and extracts the most relevant empirical records and audited findings using deterministic keyword and metadata scoring.
2. **Grounded Synthesis:** Gemini receives the retrieved NASA findings in its system prompt with a strict rule: *Every assertion must cite a canonical Finding ID (e.g., `[SAFFIRE-001]`) or Run ID (e.g., `[PSI98-F1C1/F1C2]`). No uncited claims are permitted.*
3. **Regex Citation Guard:** The API route inspects the model's output before returning it to the user. If the response contains uncited claims, cites fabricated Finding IDs, or fails syntax verification:
   - The system flags a validation failure.
   - It automatically drops back to a **Deterministic Fallback Engine** that synthesizes the exact, peer-reviewed audited findings with 100% verified citations.
4. **Zero-Downtime Offline Capability:** Even if the network drops or API keys are unavailable, the Copilot functions seamlessly via its deterministic audited evidence generator.

---

### Innovation 4: Epistemic Labeling & Scientific Integrity Safeguards
FIRELINE rejects the concept of treating AI guesses as scientific truth. Every output is stamped with an epistemic confidence classification:
- **`SUPPORTED`**: Directly verified by audited empirical data from NASA PSI flight artifacts.
- **`INFERRED`**: Physically derived or modeled values (such as chamber pressure rise models), with explicit modeling assumptions disclosed.
- **`EVIDENCE_GAP`**: Unexplored environmental zones where empirical microgravity data does not exist and extrapolation is physically hazardous.

Furthermore, FIRELINE enforces five foundational engineering decisions:
- **`DEC-01`**: Strict preservation of `null` over `0.0` for missing sensors.
- **`DEC-02`**: Droplet combustion records (FLEX) deferred from tabular record search; findings indexed for boundary gating.
- **`DEC-03`**: Canonical NASA flight run designation (`PSI98-F1C1/F1C2`).
- **`DEC-04`**: BASS-II fan display index preserved as a raw integer dial setting (`47–62`) without uncalibrated aerodynamic conversions.
- **`DEC-05`**: Strict demarcation between derived chamber pressure models ($\Delta P \approx 3.8\text{ kPa}$) and unverified telemetry ($0.5\text{ kPa}$).

---

## 3. Measurable Impact for NASA & Human Spaceflight

1. **Prevents Extrapolation Disasters:** By enforcing Biot number and regime gates, FIRELINE stops engineers from applying thin-film extinction data to thick structural walls.
2. **Accelerates Mission Planning:** Reduces the time required to evaluate candidate spacecraft atmospheres from weeks of manual literature search to seconds of deterministic scanning.
3. **Directs NASA Flight Research Dollars:** By pinpointing exact empirical voids (e.g., the Artemis $34\%\ \text{O}_2$ gap), FIRELINE helps NASA mission planners prioritize payload test matrices for future Saffire, Cygnus, and Gateway experiments.

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
