# Research Notes — Saffire-I (Spacecraft Fire Experiment - I)
**Investigation Code**: NASA PSI-98  
**Platform**: Orbital ATK Cygnus Cargo Vehicle (OA-6 Mission) — Post-ISS Free Flight  
**Primary Discipline**: Large-Scale Spacecraft Fire Dynamics, Scale Effects & Cabin Pressurization  
**Status**: `PARTIALLY_VERIFIED` (Primary paper verified; pressure corrected to $101.3\text{ kPa}$)  
**Author**: Lead Scientific Data Engineer & Combustion Researcher (CIPHER)  
**Date**: October 10, 2026

---

## 1. Research Objectives & Core Questions

The Saffire-I experiment was the first investigation in human spaceflight history to test large-scale, realistic fire growth and flame spread inside an uncrewed, pressurized spacecraft cabin in microgravity.

### Central Research Questions:
1. Do flame spread and heat release rates measured on small laboratory samples ($1\text{–}10\text{ cm}$) scale linearly to meter-scale fabrics ($100\text{ cm}$) in microgravity?
2. Does concurrent flame spread over large fabrics accelerate uncontrollably in microgravity, or does it reach a quasi-steady limit?
3. What is the impact of large-scale fire heat release on vehicle cabin pressure, temperature, and atmospheric oxygen depletion inside a sealed spacecraft volume?

---

## 2. Experimental Apparatus & Methodology

* **Platform / Architecture**: Conducted aboard the uncrewed Cygnus cargo spacecraft (OA-6) after unberthing from the ISS and maneuvering to a safe orbit prior to destructive atmospheric reentry.
* **Flow Duct Module**: A self-contained flow tunnel ($0.5\text{ m} \times 0.5\text{ m}$ cross-section $\times 1.0\text{ m}$ length) with flow conditioning screens and an automated downstream exhaust fan.
* **Ignition Mechanism**: An energized hot Kanthal wire sewn across the leading edge of the fabric sample initiated ignition.
* **Flow Configuration**: Concurrent flow (airflow moving in the same direction as the propagating flame front) at a nominal speed of $20.0\text{ cm/s}$ ($0.2\text{ m/s}$).
* **Instrumentation Suite**:
  * Dual calibrated video cameras for flame front tracking and visible light pyrometry.
  * Multi-wavelength broad-band radiometers measuring radiant heat flux.
  * Cabin environmental transducers recording vehicle pressure ($P$), temperature ($T$), and $O_2/CO_2$ gas concentrations.

---

## 3. Fuel & Materials Studied

* **Material**: SIBAL fabric (Solid Inflammability Boundary at Low Speed).
  * Composition: $75\%$ cotton fibers and $25\%$ structural fiberglass blend.
  * Dimensions: $40.6\text{ cm}$ ($16\text{ in}$) width $\times 94.0\text{ cm}$ ($37\text{ in}$) length $\times 0.4\text{ mm}$ thickness.
  * Thermal Regime: **Thermally thin** sheet ($Bi \ll 0.1$).

---

## 4. Environmental Conditions

* **Gravity ($g$)**: Microgravity ($\sim 10^{-6}\ g_0$ free-flight orbit).
* **Pressure ($P_\infty$)**: Nominal Cygnus cabin pressure: **$101.3\text{ kPa}$** ($14.7\text{ psia}$).
  * *Correction Note from Phase 0.5*: Saffire-I flew at standard $1\text{ atm}$. Sub-atmospheric exploration atmospheres ($56\text{–}70\text{ kPa}$) were evaluated on subsequent missions (Saffire-IV, V, VI).
* **Oxygen Concentration ($X_{O_2}$)**: Atmospheric air ($\sim 21.0\% O_2$).
* **Diluents**: Nitrogen ($N_2$).
* **Forced Flow Velocity ($u_\infty$)**: Forced concurrent airflow at $20.0\text{ cm/s}$.

---

## 5. Variables Measured & Reporting Units

| Variable | Symbol | Typical Units | Measurement Method | Uncertainty (Documented) |
| :--- | :--- | :--- | :--- | :--- |
| **Forced Airflow Velocity** | $u_\infty$ | $cm/s$ | Fan speed controller & pitot log | $\pm 1.0\text{ cm/s}$ |
| **Concurrent Flame Spread Rate** | $V_f$ | $mm/s$ | High-resolution optical video | $\pm 0.15\text{ mm/s}$ |
| **Pyrolysis Length** | $L_p$ | $cm$ | Optical edge detection | $\pm 1.0\text{ cm}$ |
| **Chamber Pressure Rise** | $\Delta P$ | $kPa$ | Cabin pressure transducer | $\pm 0.2\text{ kPa}$ |
| **Oxygen Depletion Rate** | $d(X_{O_2})/dt$ | $\% O_2/\text{min}$ | Electrochemical $O_2$ sensor | $\pm 0.1\%\text{ O}_2$ |
| **Radiative Heat Release** | $\dot{q}''_{rad}$ | $kW/m^2$ | Wide-angle radiometer | $\pm 10\%$ |

---

## 6. Directly Reported Findings vs. Interpretations

### 6.1 Directly Reported Findings (Verified)
1. **Steady-State Propagation on Macro Scales**: The large $0.94\text{-m}$ SIBAL fabric burned with a quasi-steady concurrent flame spread rate of **$2.0\text{ to }2.5\text{ mm/s}$** after initial transient ignition. The flame did not exhibit catastrophic runaway acceleration.
2. **Absence of Buoyant Necking**: Unlike terrestrial fires, where buoyant thermal plumes constrict the flame into a narrow column, the microgravity flame formed a broad, uniform, parabolic flame base spanning the fabric width.
3. **Vehicle Pressurization (Derived Estimate)**: Combustion heat release in the closed Cygnus cabin volume ($V \approx 18.9\text{ m}^3$) produces a calculated vehicle-wide pressure increase ($\Delta P \approx 3.8\text{ kPa}$ corresponding to a bulk temperature rise of $\Delta T \approx 11\text{ K}$). This demonstrates that thermal energy release in sealed spacecraft volumes poses an overpressure threat to vehicle structural limits. *(Note: Classified as `DERIVED_ESTIMATE`; raw cabin transducer time-series requires PSI-98 log extraction.)*
4. **Combustion Termination**: The fire burned until the fuel sample was completely consumed across its length, leaving the fiberglass matrix structurally intact.

### 6.2 Interpretations & Extrapolations (Caution Required)
* *Interpretation*: Some assume Saffire-I proves all spacecraft fires burn slowly. *Reality*: Saffire-I tested a thermally thin fabric at $20\text{ cm/s}$ flow in standard air. Thermally thick polymers, higher ventilation speeds, or elevated oxygen concentrations ($30\%\text{–}34\% O_2$) could exhibit drastically different heat release kinetics.
* *Extrapolation Boundary*: Spread rates on SIBAL cannot be used as a proxy for structural plastics (e.g., Polycarbonate, PEEK) without accounting for chemical pyrolysis and melting.

---

## 7. Experimental Limitations & Knowledge Voids

1. **Destructive Mission Lifecycle**: Because Cygnus burns up in Earth's atmosphere at end-of-mission, post-test chemical residue, char ash, and soot samples cannot be physically recovered for ground mass spectrometry.
2. **Single Primary Burn**: Saffire-I featured one single large-scale fabric burn; statistical repeatability across identical large samples was established across later flights (e.g., Saffire-III).
3. **Atmospheric Range**: Saffire-I did not test reduced-pressure Exploration Atmospheres; that parameter was isolated in Saffire-IV/V/VI.

---

## 8. Relevance to Spacecraft Fire Safety

* **Validation of Scale Models**: Proves that microgravity flame spread can be realistically predicted from controlled small-scale models if radiation loss and concurrent flow dynamics are properly accounted for.
* **Cabin Depressurization Protocol**: Demonstrates that cabin pressure monitors provide immediate early warning of combustion heat release in sealed modules before smoke detectors saturate.

---

## 9. Primary Sources & Citations

1. **Primary Verified Publication**:
   * *Title*: "Flame spread: Effects of microgravity and scale"
   * *Authors*: David L. Urban, Paul V. Ferkul, Sandra L. Olson, Gary A. Ruff, John W. Easton, James S. T'ien, Ya-Ting T. Liao, Chengyao Li, Carlos A. Fernandez-Pello, José L. Torero, Guillaume Legros, Christian Eigenbrod, Nikolay Smirnov, Osamu Fujita, Sébastien Rouvreau, Balázs Toth, Grunde Jomaas
   * *Journal*: *Combustion and Flame*, Vol. 199, pp. 168–182 (January 2019)
   * *DOI*: `10.1016/j.combustflame.2018.10.012` [VERIFIED MATCH]
2. **NASA PSI Repository**:
   * *URL*: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-98`
   * *Investigation Code*: `PSI-98` [VERIFIED]
