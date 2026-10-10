# Research Notes — BASS-II (Burning and Suppression of Solids - II)
**Investigation Code**: NASA PSI-25  
**Platform**: International Space Station (ISS) — Microgravity Science Glovebox (MSG)  
**Primary Discipline**: Solid Fuel Combustion, Forced-Flow Flame Spread & Flammability Boundaries  
**Status**: `PARTIALLY_VERIFIED` (Primary paper verified; run table extraction pending)  
**Author**: Lead Scientific Data Engineer & Combustion Researcher (CIPHER)  
**Date**: October 10, 2026

---

## 1. Research Objectives & Core Questions

The Burning and Suppression of Solids - II (BASS-II) investigation examines the ignition, flame growth, flame spread, and extinction limits of solid fuels in low-velocity forced convective flows in microgravity.

### Central Research Questions:
1. How does low-velocity forced airflow ($1\text{–}25\text{ cm/s}$) affect the flame spread rate and flammability boundary of solid materials without natural buoyant convection?
2. What are the mechanisms governing the low-speed radiative quenching boundary (extinction at low flows) versus high-speed blowoff extinction?
3. How do fuel geometry (cylindrical rods vs. flat sheets) and fuel thickness (thermally thin vs. thermally thick) modify microgravity flammability limits?

---

## 2. Experimental Apparatus & Methodology

* **Chamber / Hardware**: Small flow duct ($7.6\text{ cm} \times 7.6\text{ cm}$ cross-section, $40\text{ cm}$ length) mounted inside the Microgravity Science Glovebox (MSG) working volume aboard the ISS.
* **Flow Control**: A variable-speed suction fan pulls ambient glovebox air through an inlet honeycomb flow straightener at velocities from $1.0\text{ to }25.0\text{ cm/s}$.
* **Sample Deployment**:
  * Flat fuel strips held along edges in steel sample holders.
  * Cylindrical rods mounted along the duct centerline with axial stagnation flow impingement on the hemispherical rod tip.
* **Ignition Mechanism**: Hot Kanthal wire igniter or pilot flame placed at the fuel surface.
* **Instrumentation**:
  * Color video camera recording at $30\text{ fps}$ for visual flame tracking.
  * Radiometer measuring radiative emissions.
  * Multi-junction fine-gauge thermocouple rakes ($25\ \mu\text{m}$ to $75\ \mu\text{m}$ bead diameter) measuring gas-phase and surface temperatures.

---

## 3. Fuel & Materials Studied

* **Primary Solid Fuels**:
  * Polymethyl Methacrylate (PMMA) — Cast acrylic:
    * Cylindrical rods (**Primary verified in Olson & Ferkul, 2017**): $6.35\text{ mm}$ ($1/4\text{ in}$), $9.5\text{ mm}$ ($3/8\text{ in}$), and $12.7\text{ mm}$ ($1/2\text{ in}$) diameter (thermally thick) in axial stagnation flow.
    * Flat sheets (Secondary BASS-II investigations; e.g., Zhao et al.): $10\text{ mm}$ width $\times 100\text{ mm}$ length $\times 1.2\text{ mm}$ thickness (thermally thin/intermediate).
  * Cotton fabric strips and Nomex blends (for comparison with spacecraft clothing materials).

---

## 4. Environmental Conditions

* **Gravity ($g$)**: Microgravity ($\sim 10^{-6}\ g_0$ in ISS MSG).
* **Pressure ($P_\infty$)**: Ambient ISS cabin pressure ($101.3\text{ kPa} \approx 1.0\text{ atm}$).
* **Oxygen Concentration ($X_{O_2}$)**: Ambient glovebox air ($\sim 20.8\%\text{–}21.0\% O_2$) and controlled nitrogen-diluted sweeps ($13.6\%\text{–}22.2\% O_2$ verified in Olson & Ferkul, 2017).
* **Diluents**: Nitrogen ($N_2$).
* **Forced Flow Velocity ($u_\infty$)**: Subsonic airflow spanning **$0.0\text{ to }55.0\text{ cm/s}$** for stagnation-flow rods (Olson & Ferkul, 2017); $1.0\text{–}25.0\text{ cm/s}$ typical for flat sheet tests.

---

## 5. Variables Measured & Reporting Units

| Variable | Symbol | Typical Units | Measurement Method | Uncertainty (Documented) |
| :--- | :--- | :--- | :--- | :--- |
| **Forced Flow Velocity** | $u_\infty$ | $cm/s$ | Anemometer / fan tachometer | $\pm 0.2\text{ cm/s}$ |
| **Flame Spread Rate** | $V_f$ | $mm/s$ | Video edge tracking | $\pm 0.005\text{ mm/s}$ |
| **Rod Regression Rate** | $r$ | $\mu m/s$ | Tip position vs. time | $\pm 2.0\ \mu\text{m/s}$ |
| **Low-Speed Extinction Limit** | $u_{ext,low}$ | $cm/s$ | Flow decrement to flame loss | $\pm 0.3\text{ cm/s}$ |
| **Gas Flame Temperature** | $T_{flame}$ | $K$ | Thermocouple rake | $\pm 25\text{ K}$ (radiation corrected) |
| **Limiting Oxygen Index** | $\text{LOI}$ | $\% O_2$ | Glovebox atmosphere sensor | $\pm 0.2\%$ |

---

## 6. Directly Reported Findings vs. Interpretations

### 6.1 Directly Reported Findings (Verified)
1. **Low-Speed Radiative Quenching Boundary (Rods)**: PMMA rods in axial stagnation flow extinguish when airflow is decreased below a critical threshold ($\sim 1.0\text{–}1.5\text{ cm/s}$, verified in Olson & Ferkul, 2017). At these slow speeds, convective oxygen transport into the flame zone is insufficient to overcome radiative heat loss from the flame and soot to ambient space.
2. **High-Speed Blowoff Limit (Rods)**: Increasing flow velocity above $\sim 15\text{–}50\text{ cm/s}$ (depending on $X_{O_2}$) causes aerodynamic strain-induced flame blowoff on thicker rod tips, mapping a complete "C-shaped" flammability boundary (Olson & Ferkul, 2017).
3. **Energy Balance Scaling (Rods)**: Flammability on PMMA rods in axial stagnation flow is dictated by the Damköhler number ($Da$) and the surface energy balance, where radiative heat loss dominates at low stretch rates (Olson & Ferkul, 2017).
4. **Non-Monotonic Spread Rate Response (Flat Sheets — Secondary Reference)**: Flame spread rate ($V_f$) over flat PMMA strips in opposed flow does not increase monotonically with airflow; at very low speeds ($u_\infty < 2\text{ cm/s}$), spread rate drops sharply toward zero (documented in secondary BASS-II flat fuel studies; e.g. Zhao et al., Bhattacharjee et al.).

### 6.2 Interpretations & Extrapolations (Caution Required)
* *Interpretation*: It is often assumed that shutting off ventilation instantly extinguishes all spacecraft fires. *Reality*: BASS-II shows that quiescent diffusion or slow recirculation eddies can sustain smoldering or low-temperature flamelets for extended periods before quenching.
* *Extrapolation Boundary*: Findings on small $10\text{-cm}$ samples inside a confined duct cannot be scaled linearly to large open-cabin fabric fires without accounting for geometric scale and radiation feedback.

---

## 7. Experimental Limitations & Knowledge Voids

1. **Duct Boundary Effects**: Sample dimensions are close to duct wall dimensions ($7.6\text{ cm}$), causing aerodynamic boundary-layer development and conductive heat loss to metal rails.
2. **Fixed Atmospheric Pressure**: BASS-II operated strictly at ambient ISS pressure ($101.3\text{ kPa}$); it does not provide data for reduced-pressure Exploration Atmospheres ($56\text{–}70\text{ kPa}$).
3. **Short Sample Run Duration**: Tests were limited to minutes per sample due to fuel depletion and glovebox oxygen drawdown.

---

## 8. Relevance to Spacecraft Fire Safety

* **Ventilation Control Strategy**: Validates the NASA flight rule that emergency crew response should include shutting down cabin ventilation to starve the flame of convective forced flow.
* **Low-Flow Survival Hazard**: Highlights that materials may continue to burn at very gentle airspeeds typical of human movement or air circulation vents ($2\text{–}5\text{ cm/s}$).

---

## 9. Primary Sources & Citations

1. **Primary Verified Publication**:
   * *Title*: "Microgravity flammability boundary for PMMA rods in axial stagnation flow: Experimental results and energy balance analyses"
   * *Authors*: Sandra L. Olson, Paul V. Ferkul
   * *Journal*: *Combustion and Flame*, Vol. 180, pp. 217–229 (June 2017)
   * *DOI*: `10.1016/j.combustflame.2017.03.001` [VERIFIED MATCH]
2. **NASA PSI Repository**:
   * *URL*: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-25`
   * *Investigation Code*: `PSI-25` [VERIFIED]
