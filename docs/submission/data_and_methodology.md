# Data & Methodology: Scientific Provenance & Formulation

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Author:** Moon Sanctum Labs (*Decode. Build. Evolve.*) | Aniket Nandi (Kolkata, IST)

---

## 1. Primary NASA Data Sources

FIRELINE directly ingests and synthesizes primary flight experiment data from the **NASA Physical Sciences Informatics (PSI)** repository ([https://psi.nasa.gov/](https://psi.nasa.gov/)):

| Investigation | PSI Identifier | Artifact File | Flight Platform & Mission | Tested Materials | Primary Reference |
|:---|:---|:---|:---|:---|:---|
| **Saffire-I** | `PSI-98` | `PSI98-ART-002` | Cygnus Pressurized Cargo Module (OA-6) | SIBAL fabric (75% cotton / 25% fiberglass), PMMA thick slabs ($10\text{ mm}$) | Urban et al. (2019), *Combustion and Flame* [DOI: 10.1016/j.combustflame.2019.04.015](https://doi.org/10.1016/j.combustflame.2019.04.015) |
| **BASS-II** | `PSI-25` | `PSI25-ART-002` | ISS Microgravity Science Glovebox (MSG) | Cast PMMA flat thin films ($0.05\text{ mm}$ thick) | Olson & Ferkul (2017), *NASA/TM-2017-219504* [NASA Technical Reports Server](https://ntrs.nasa.gov/) |
| **FLEX** | `PSI-69` | Primary Lit. Extract | ISS Combustion Integrated Rack (CIR) | Heptane & Methanol fuel droplets ($1.5\text{--}4.0\text{ mm}$) | Nayagam et al. (2015), *Combustion and Flame* [DOI: 10.1016/j.combustflame.2015.01.012](https://doi.org/10.1016/j.combustflame.2015.01.012) |

---

## 2. Ingestion Pipeline & Quality Control Methodology

To prevent data corruption, unit mismatches, or false assumptions from entering the system, the ingestion pipeline follows a strict five-stage verification pipeline:

```
[ NASA PSI RAW CSV ] 
         │
         ▼
[ Stage 1: Lexical Parsing & Encoding Normalization ]
         │
         ▼
[ Stage 2: Pydantic Contract Enforcement (Bounds & Unit Checks) ]
         │
         ▼
[ Stage 3: Engineering Decision Rules (DEC-01 to DEC-05) ]
         │
         ▼
[ Stage 4: Cryptographic SHA-256 Checksum Generation ]
         │
         ▼
[ Stage 5: Export to Verified Empirical Store & Findings Index ]
```

### Engineering Decisions Enforced During Ingestion
- **`DEC-01` (Null Value Preservation):**
  In raw experimental records, missing measurements (e.g., burn rate when a flame failed to ignite) are strictly preserved as `null` (Python `None`). Replacing missing values with `0.0` is prohibited, as $0.0\text{ mm/s}$ represents an extinguished flame rather than an uninstrumented run.
- **`DEC-02` (FLEX Droplet Gating):**
  FLEX droplet combustion data is retained at the audited finding level (`FLEX-001`, `FLEX-002`, `FLEX-003`) to gate multi-phase comparisons, while tabular solid-film search operates on Saffire and BASS-II until droplet geometry schemas are unified.
- **`DEC-03` (Canonical Flight Nomenclature):**
  Saffire multi-camera flow runs are designated as `PSI98-F1C1/F1C2` per official Cygnus flight mission logs.
- **`DEC-04` (Uncalibrated Fan Display Preservation):**
  BASS-II airflow was controlled via a discrete dial display (`47–62`). In the absence of an official published NASA aerodynamic calibration curve, FIRELINE stores this value strictly as `fan_display_index` and sets `flow_velocity_cms` to `null` to prevent fraudulent velocity calculations.
- **`DEC-05` (Chamber Pressure Disambiguation):**
  In Saffire-I, chamber pressure surges are segregated: $\Delta P \approx 3.8\text{ kPa}$ is tagged as a derived theoretical model estimate (`SAFFIRE-006`), whereas $0.5\text{ kPa}$ is preserved as unverified telemetry (`SAFFIRE-009`).

---

## 3. Physical Formulations & Mathematical Models

### 3.1 Thermal Biot Number & Fuel Thickness Gating
The heat transfer governing flame spread over a solid fuel depends critically on whether the fuel is thermally thin or thermally thick. This is governed by the Biot number:

$$\text{Bi} = \frac{h \cdot L_c}{k_s}$$

Where:
- $h$ is the convective heat transfer coefficient ($\text{W}/\text{m}^2\cdot\text{K}$)
- $L_c$ is the characteristic thermal half-thickness ($\text{m}$)
- $k_s$ is the solid thermal conductivity ($\text{W}/\text{m}\cdot\text{K}$)

**Classification Rules:**
- **Thermally Thin ($\text{Bi} \ll 1$, typically $\tau \le 0.1\text{ mm}$):**
  Internal conduction is fast relative to surface convection. The temperature across the fuel cross-section is approximately uniform. The flame spread rate $V_f$ scales inversely with thickness:
  $$V_f \propto \frac{1}{\tau}$$
- **Thermally Thick ($\text{Bi} \ge 1$, typically $\tau \ge 2.0\text{ mm}$):**
  Heat does not penetrate the full depth of the fuel. Spread rate is governed by internal solid conduction and is independent of sample thickness:
  $$V_f \propto \frac{k_g (T_f - T_{ig})^2}{\rho_s c_s k_s (T_{ig} - T_0)^2}$$

**Gating Decision:** Comparing a thermally thin fuel (BASS-II $0.05\text{ mm}$ PMMA) with a thermally thick slab (Saffire-I $10.0\text{ mm}$ PMMA) fails Gate 3 (`Geometry & Thermal Thickness`) and is immediately flagged as `INCOMPARABLE`.

---

### 3.2 Aerodynamic Convective Scaling (Damköhler Number)
In microgravity, in the absence of buoyant acceleration, the characteristic gas residence time $\tau_{\text{flow}}$ is determined entirely by the forced ventilation velocity $v_{\text{flow}}$:

$$\text{Da} = \frac{\tau_{\text{flow}}}{\tau_{\text{chem}}} = \frac{\delta_{\text{thermal}} / v_{\text{flow}}}{1 / k_{\text{reaction}}}$$

Where $\delta_{\text{thermal}}$ is the thermal boundary layer thickness.
- If $v_{\text{flow}}$ deviates by more than $\pm 25\%$, the local Damköhler number shifts, altering the flame's proximity to the extinction boundary.
- **Tolerance Applied:** $\left\|\frac{v_A - v_B}{v_A}\right\| \le 0.25$ for a passing grade on Gate 4.

---

### 3.3 Environmental Gap Assessment Scoring
When evaluating a proposed mission scenario (such as the Artemis Exploration Atmosphere), FIRELINE calculates the empirical coverage score $C_{\text{env}}$ across four primary atmospheric dimensions:

$$C_{\text{env}} = w_{\text{O}_2} \cdot S(\% \text{O}_2) + w_P \cdot S(P) + w_v \cdot S(v) + w_m \cdot S(\text{material})$$

Where weights satisfy $\sum w_i = 1.0$, and the individual dimensional scoring function $S(x)$ evaluates distance to empirical boundaries:

$$S(x) = \begin{cases} 
1.0 & \text{if } x_{\min}^{\text{empirical}} \le x \le x_{\max}^{\text{empirical}} \\
\max\left(0, 1.0 - \frac{|x - x_{\text{bound}}|}{\Delta x_{\text{threshold}}}\right) & \text{if outside empirical envelope}
\end{cases}$$

If $\% \text{O}_2 > 21.0\%$ (the upper limit of Saffire-I and BASS-II verified flight data), the oxygen coverage score drops sharply, triggering a `CRITICAL` empirical gap warning for Artemis ($34\%\ \text{O}_2$) and a `HIGH` warning for Mars ($28\%\ \text{O}_2$).

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
