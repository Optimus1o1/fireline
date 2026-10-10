# Cross-Investigation Analysis — FLEX vs. BASS-II vs. Saffire-I
**Workspace**: `01-Research`  
**Purpose**: Rigorous comparative analysis of the three foundational NASA PSI investigations to establish physical comparability limits, parameter boundaries, and cross-investigation linkage rules.  
**Author**: Lead Scientific Data Engineer & Combustion Researcher (CIPHER)  
**Date**: October 10, 2026

---

## 1. Comparative Matrix

| Analysis Dimension | FLEX (PSI-69) | BASS-II (PSI-25) | Saffire-I (PSI-98) |
| :--- | :--- | :--- | :--- |
| **Research Objective** | Droplet burning rates, spherical diffusion, and cool-flame extinction boundaries. | Solid fuel ignition, opposed/concurrent flame spread, and low-speed flow flammability limits. | Macro-scale concurrent flame spread, real cabin geometry, and spacecraft pressurization. |
| **Fuel Phase** | **Liquid** ($n$-alkanes: heptane, octane, decane, methanol). | **Solid** (Clear cast PMMA sheets/rods; Nomex/cotton blends). | **Solid** (SIBAL composite fabric: 75% cotton / 25% fiberglass). |
| **Fuel Geometry** | Isolated spherical droplet ($d_0 \approx 1.5\text{–}5.0\text{ mm}$); fiber-tethered or free. | Flat strip ($1.2\text{ mm} \times 10\text{ mm} \times 100\text{ mm}$) or cylindrical rod ($6.35\text{–}12.7\text{ mm}$ dia). | Full-scale flat sheet ($40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$). |
| **Thermal Regime** | Condensed liquid sphere; no charring; surface evaporation governed by Clausius-Clapeyron. | **Thermally thick** (rods, $Bi > 1$) and **intermediate** (slabs, $1.2\text{ mm}$); thermal pyrolysis. | **Thermally thin** ($Bi \ll 0.1$, uniform through-thickness temperature). |
| **Gravity Regime** | Microgravity ($\sim 10^{-6}\ g_0$, ISS CIR). | Microgravity ($\sim 10^{-6}\ g_0$, ISS MSG). | Microgravity ($\sim 10^{-6}\ g_0$, Cygnus free flight). |
| **Chamber Pressure** | $101.3\text{ kPa}$ (nominal); sub-atmospheric dilution runs ($50\text{–}101\text{ kPa}$). | $101.3\text{ kPa}$ (ambient ISS cabin pressure). | $101.3\text{ kPa}$ ($14.7\text{ psia}$, nominal Cygnus cabin pressure). |
| **Oxygen Mole Fraction** | $X_{O_2} = 0.14\text{ to }0.30$ (inert gas dilution sweeps). | $X_{O_2} = 0.15\text{ to }0.21$ (atmospheric and nitrogen-diluted). | $X_{O_2} \approx 0.21$ (standard spacecraft cabin air). |
| **Forced Flow Velocity** | **Quiescent** ($u_\infty = 0.0\text{ cm/s}$); purely diffusion-dominated transport. | **Low-speed forced flow** ($u_\infty = 1.0\text{–}25.0\text{ cm/s}$); opposed and concurrent. | **Forced flow** ($u_\infty = 20.0\text{ cm/s}$); concurrent only. |
| **Primary Phenomena** | Spherical $d^2$-law burning, radiative hot-flame extinction, cool-flame NTC burning. | Opposed-flow spread rate, stagnation tip regression, low-speed radiative quenching limit. | Steady macro-scale concurrent flame spread, broad parabolic flame base, cabin $\Delta P$ rise. |
| **Measurement Metrics** | Droplet diameter $d(t)$ ($mm$), $K$ ($mm^2/s$), $d_{ext}$ ($mm$), radiometer flux. | Flame spread rate $V_f$ ($mm/s$), rod regression $r$ ($\mu m/s$), $T_{flame}$ ($K$), LOI ($\% O_2$). | Concurrent spread rate $V_f$ ($mm/s$), vehicle pressure rise $\Delta P$ ($kPa$), $d(X_{O_2})/dt$. |
| **Archive Structure** | Optical video sequences, tabular $d(t)$ ASCII logs, radiometer time-series. | High-speed video, thermocouple rake time-series, anemometer logs. | Multi-camera video, cabin transducer engineering telemetry, radiometer curves. |
| **Primary Citation** | Nayagam et al., *Combust. Flame* (2015)<br>`10.1016/j.combustflame.2015.01.012` | Olson & Ferkul, *Combust. Flame* (2017)<br>`10.1016/j.combustflame.2017.03.001` | Urban et al., *Combust. Flame* (2019)<br>`10.1016/j.combustflame.2018.10.012` |

---

## 2. Deep Comparative Dimensions

### 2.1 Convective Transport vs. Pure Diffusion
* **FLEX** operates at the absolute diffusion limit ($u_\infty = 0$). In this regime, the absence of flow produces thick, spherical flame structures where radiative heat loss to the ambient gas accumulates spherically, causing hot flames to extinguish radiatively at large diameters.
* **BASS-II** introduces controlled, low-speed forced convection ($1\text{–}25\text{ cm/s}$). It maps the transition from diffusion-dominated quenching (below $1.5\text{ cm/s}$) to momentum-driven convection.
* **Saffire-I** tests a single forced convective velocity ($20\text{ cm/s}$) in the concurrent regime, representing standard spacecraft environmental control and life support system (ECLSS) ventilation speeds.

### 2.2 Scale Effects: Glovebox Samples ($10\text{ cm}$) vs. Vehicle Scale ($100\text{ cm}$)
* In **BASS-II**, flame spread over a $10\text{-cm}$ sample is heavily constrained by duct walls and sample holder boundaries. Heat conduction into metal rails can artificially accelerate or quench the flame.
* In **Saffire-I**, the $94\text{-cm}$ length and $40.6\text{-cm}$ width allow the flame to escape edge effects, establishing an unobstructed, parabolic flame base.
* *Scientific Takeaway*: Concurrent spread rates from small-scale tests ($V_f \approx 0.05\text{–}0.1\text{ mm/s}$ in BASS-II opposed flow) cannot be compared directly with macro-scale concurrent spread rates ($V_f \approx 2.0\text{–}2.5\text{ mm/s}$ in Saffire-I) without correcting for flow direction (opposed vs. concurrent) and scale-dependent radiative preheating.

### 2.3 Fuel Phase & Degradation Mechanics
* **FLEX (Liquid $n$-alkanes)**: Fuel gasification is purely physical phase change (evaporation) governed by the latent heat of vaporization ($h_{fg}$) and the Clausius-Clapeyron equation. There is no charring, no thermal degradation, and no solid matrix.
* **BASS-II (Cast PMMA)**: Solid thermoplastic that undergoes endothermic chemical pyrolysis to form methyl methacrylate monomer vapor without leaving a solid char layer (non-charring polymer). Melting and bubbling occur at the surface.
* **Saffire-I (SIBAL Fabric)**: A composite woven material. The organic cotton component ($75\%$) pyrolyzes and leaves a carbonaceous char, while the non-combustible fiberglass scaffold ($25\%$) remains physically intact, preserving the aerodynamic boundary layer.

---

## 3. Physical Comparability Rules for the Evidence Engine

FIRELINE's retrieval and ranking engine must enforce strict physical boundaries when determining whether two findings are comparable:

```
                            CROSS-INVESTIGATION COMPATIBILITY GATES
                                               │
                                               ▼
                              ┌──────────────────────────────────┐
                              │     Gate 1: Fuel Phase Match     │
                              └────────────────┬─────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
               [Liquid vs. Solid]                              [Solid vs. Solid]
           (FLEX vs. BASS-II/Saffire)                      (BASS-II vs. Saffire-I)
                       │                                               │
                       ▼                                               ▼
             STRICTLY INCOMPARABLE                        Check Thermal Regime & Flow
          (Reason: PHASE_INCOMPATIBLE)                                 │
                                                                       ▼
                                                     ┌─────────────────────────────────┐
                                                     │ Gate 2: Flow Direction & Regime │
                                                     └────────────────┬────────────────┘
                                                                      │
                                                ┌─────────────────────┴─────────────────────┐
                                                ▼                                           ▼
                                    [Opposed vs. Concurrent]                    [Scale Mismatch (10cm vs 1m)]
                                                │                                           │
                                                ▼                                           ▼
                                       INFERRED (Scaling Only)                     INFERRED (Qualitative Only)
                                       (Reason: FLOW_DIR_MISMATCH)                 (Reason: SCALE_EXTRAPOLATION)
```

1. **Rule 1 — Absolute Phase Separation**:  
   Droplet extinction data from FLEX (PSI-69) **must never** be cited as direct empirical support for solid material flammability (PMMA or SIBAL). It may only be cited for fundamental kinetic phenomena (e.g., cool-flame gas-phase chemical reaction mechanisms).
2. **Rule 2 — Opposed vs. Concurrent Spread Separation**:  
   Opposed flame spread (where the flame propagates against the airflow, as tested in BASS-II) is governed by forward gas conduction through the flame boundary layer. Concurrent flame spread (where the flame propagates with the airflow, as tested in Saffire-I) is governed by radiative and convective preheating from the downstream flame plume. They represent distinct physical mechanisms; findings from one cannot directly substitute for the other.
3. **Rule 3 — Thermal Thickness Normalization & Flow Regime Coupling**:
   In **opposed-flow conduction**, thermally thin materials ($Bi \ll 0.1$, SIBAL cloth) exhibit a spread rate that scales inversely with fuel half-thickness ($V_f \propto 1/\tau$, de Ris 1969), whereas thermally thick fuels ($Bi > 1.0$, PMMA rods) have a conduction-controlled spread rate that is independent of overall thickness ($V_f \propto 1/\tau^0$). However, in **concurrent flow** (Saffire-I), flame spread is governed by boundary-layer convection and radiant preheating over the expanding pyrolysis length $L_p$; the spread rate does not follow a simple $1/\tau$ scaling. The engine must classify comparisons across different thickness regimes as `INFERRED (QUALIFIED_SCALING)` and never apply opposed $1/\tau$ laws to concurrent flame fronts.
