# Research Notes — FLEX (Flame Extinguishment Experiment)
**Investigation Code**: NASA PSI-69  
**Platform**: International Space Station (ISS) — Combustion Integrated Rack (CIR) / MDCA  
**Primary Discipline**: Microgravity Droplet Combustion & Low-Temperature Kinetics  
**Status**: `PARTIALLY_VERIFIED` (Primary paper verified; run table extraction pending)  
**Author**: Lead Scientific Data Engineer & Combustion Researcher (CIPHER)  
**Date**: October 10, 2026

---

## 1. Research Objectives & Core Questions

The Flame Extinguishment Experiment (FLEX) investigates the burning behavior, flammability limits, and extinction dynamics of spherical liquid hydrocarbon droplets in a quiescent microgravity environment.

### Central Research Questions:
1. What governs the radiative extinction diameter of hydrocarbon droplets when buoyant convective heat loss is eliminated ($g \approx 0$)?
2. How effective are gaseous suppressants ($CO_2, N_2, He$) in suppressing liquid droplet combustion in microgravity compared to terrestrial buoyant environments?
3. What causes the transition from hot diffusion flames to low-temperature "cool-flame" combustion, and what are the extinction limits of this cool-flame regime?

---

## 2. Experimental Apparatus & Methodology

* **Chamber / Hardware**: Multi-user Droplet Combustion Apparatus (MDCA) mounted inside the sealed $100\text{-liter}$ Combustion Integrated Rack (CIR) chamber on the ISS.
* **Droplet Deployment**: Fuel is dispensed through opposing needle tips onto two crossed silicon carbide (SiC) fibers ($14\text{–}15\ \mu\text{m}$ diameter) or deployed as free-floating droplets.
* **Ignition Mechanism**: Dual spark igniters ignite the droplet and immediately retract to eliminate thermal and aerodynamic interference.
* **Environment**: Quiescent chamber atmosphere ($u_\infty = 0\text{ cm/s}$); gas composition is controlled by pre-filling the chamber with test mixtures.
* **Optical Tracking**: Backlit high-speed digital camera for shadowgraph droplet diameter tracking, color video camera for visible flame visualization, and intensified camera (OH* and CH* chemiluminescence) for flame boundary tracking.

---

## 3. Fuel & Materials Studied

* **Primary Fuels**:
  * Pure $n$-alkanes: $n$-Heptane ($C_7H_{16}$), $n$-Octane ($C_8H_{18}$), $n$-Decane ($C_{10}H_{22}$).
  * Alcohols: Methanol ($CH_3OH$) and ethanol blends.
  * Surrogate fuel mixtures: Heptane/iso-octane mixtures.
* **Initial Geometry**:
  * Spherical droplet, initial diameter $d_0 \approx 1.5\text{ to }5.0\text{ mm}$ (significantly larger than standard terrestrial droplets, which are limited by gravity-induced sagging to $< 1\text{ mm}$).

---

## 4. Environmental Conditions

* **Gravity ($g$)**: Microgravity ($\sim 10^{-6}\ g_0$ aboard ISS).
* **Pressure ($P_\infty$)**: Nominal atmospheric ($101.3\text{ kPa} \approx 1.0\text{ atm}$) and sub-atmospheric inert dilution runs ($50\text{–}101\text{ kPa}$).
* **Oxygen Concentration ($X_{O_2}$)**: Varied from atmospheric air ($21\% O_2$) down to near-limiting oxygen index ($\sim 14\%\text{–}18\%$) and enriched mixtures ($30\% O_2$).
* **Diluents**: Nitrogen ($N_2$), Carbon Dioxide ($CO_2$), Helium ($He$).
* **Convective Flow ($u_\infty$)**: Quiescent ($0.0\text{ cm/s}$); mass and heat transport are purely spherical-diffusion controlled.

---

## 5. Variables Measured & Reporting Units

| Variable | Symbol | Typical Units | Measurement Method | Uncertainty (Documented) |
| :--- | :--- | :--- | :--- | :--- |
| **Initial Droplet Diameter** | $d_0$ | $mm$ | Shadowgraph camera | $\pm 0.02\text{ mm}$ |
| **Instantaneous Droplet Diameter** | $d(t)$ | $mm$ | Shadowgraph edge tracking | $\pm 0.03\text{ mm}$ |
| **Burning Rate Constant** | $K$ | $mm^2/s$ | Slope of $d^2$ vs. $t$ ($d^2\text{-law}$) | $\pm 0.02\text{ mm}^2/\text{s}$ |
| **Hot-Flame Extinction Diameter** | $d_{ext,hot}$ | $mm$ | Optical & radiometer drops | $\pm 0.04\text{ mm}$ |
| **Cool-Flame Extinction Diameter** | $d_{ext,cool}$ | $mm$ | OH* emission & $d^2$ slope change | $\pm 0.05\text{ mm}$ |
| **Radiative Heat Release** | $\dot{Q}_{rad}$ | $W$ | Broad-band radiometers | $\pm 5\%\text{ of reading}$ |

---

## 6. Directly Reported Findings vs. Interpretations

### 6.1 Directly Reported Findings (Verified)
1. **Classical $d^2$-Law Burning**: In microgravity, droplets follow quasi-steady $d^2$-law burning ($d^2(t) = d_0^2 - K t$), with burning rate constant $K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$ for $n$-heptane in air at $1\text{ atm}$.
2. **Radiative Extinction at Finite Diameter**: Large droplets extinguish radiatively while a substantial liquid core remains ($d_{ext} > 0$), in contrast to 1g where buoyant flames burn nearly to completion ($d \to 0$).
3. **Cool-Flame Sustained Burning**: Following the radiative extinction of the hot, luminous flame ($T_{flame} \sim 1500\text{–}2000\text{ K}$), $n$-heptane droplets continue burning in a second quasi-steady regime supported by low-temperature chemical kinetics ($T \sim 600\text{–}800\text{ K}$) within the Negative Temperature Coefficient (NTC) region, terminating at a distinct cool-flame extinction diameter $d_{ext,cool}$.

### 6.2 Interpretations & Extrapolations (Caution Required)
* *Interpretation*: Cool flames are often assumed to be incapable of re-igniting structural spacecraft components. *Reality*: Unburned vapor accumulation during cool-flame burning poses a deflagration risk if ventilation is suddenly reintroduced.
* *Extrapolation Boundary*: Droplet extinction kinetics cannot be directly applied to solid fuels or high-speed convective duct flows without scaling corrections.

---

## 7. Experimental Limitations & Knowledge Voids

1. **Fiber Tether Effects**: For droplets supported on SiC fibers, heat conduction along the fiber can artificially extend droplet lifetime or distort droplet sphericity near extinction.
2. **Quiescent Limitation**: Zero forced convection means FLEX cannot characterize convective blowoff extinction boundaries.
3. **Condensed Phase Difference**: Liquid droplets have no internal solid pyrolysis charring, melting viscosity dynamics, or thermal degradation kinetics seen in spacecraft plastics.

---

## 8. Relevance to Spacecraft Fire Safety

* **Suppression Strategy**: Confirms that inert gas suppression ($CO_2$) must account for cooler, slower kinetics in $0g$ where buoyant heat loss does not assist in extinguishing the flame.
* **Invisible Fire Hazard**: Proves that the absence of a visible flame in microgravity does **not** guarantee that combustion has ceased. Thermal imaging and gas detection are necessary to detect cool-flame combustion.

---

## 9. Primary Sources & Citations

1. **Primary Verified Publication**:
   * *Title*: "Cool-flame extinction during n-alkane droplet combustion in microgravity"
   * *Authors*: Vedha Nayagam, Daniel L. Dietrich, Michael C. Hicks, Forman A. Williams
   * *Journal*: *Combustion and Flame*, Vol. 162, Issue 5, pp. 2140–2147 (May 2015)
   * *DOI*: `10.1016/j.combustflame.2015.01.012` [VERIFIED MATCH]
2. **NASA PSI Repository**:
   * *URL*: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-69`
   * *Investigation Code*: `PSI-69` [VERIFIED]
