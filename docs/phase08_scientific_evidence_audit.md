# Scientific Evidence Audit, Claim Verification & Provenance Review
**Phase**: 0.8 — Pre-Event Research & Scientific Foundation  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Scientific Data Engineer & Combustion Systems Architect  
**Date**: October 10, 2026  
**Status**: Authoritative Scientific Audit Report  

---

## 1. Executive Summary & Audit Mandate

### 1.1 The Epistemic Mandate
A core foundational rule governs FIRELINE:
> **A statement repeated across multiple project documents is not independently verified evidence.**  
> Never treat a previous Antigravity report, a search-result snippet, an existing Canvas diagram, or an LLM summary as sufficient proof of a scientific claim.

This audit evaluates all numerical claims, physical assumptions, experimental boundaries, and comparative assertions across the existing research notes (`01-Research/`), architecture logs (`05-Architecture/`), verification matrices (`docs/`), and visual knowledge maps (`08-Canvas/`). Every claim is evaluated against accessible peer-reviewed publications and official NASA Physical Sciences Informatics (PSI) flight records.

### 1.2 Summary of Findings Across the Six Guiding Questions

1. **Directly Verified Claims (Layer A)**:
   * **FLEX (PSI-69)**: Quasi-steady droplet combustion; radiative extinction at finite diameter $d_{ext} > 0$ for large droplets ($d_0 \approx 1.5\text{–}5.0\text{ mm}$); sustained cool-flame combustion at low temperatures ($T \sim 600\text{–}800\text{ K}$) in the NTC region terminating at $d_{ext,cool}$ (Nayagam et al., 2015).
   * **BASS-II (PSI-25)**: Low-speed radiative quenching limit at $u_\infty \approx 1.0\text{–}1.5\text{ cm/s}$; aerodynamic blowoff boundary at elevated flow velocities forming a "C-shaped" flammability boundary; ambient oxygen range $13.6\%\text{–}22.2\%$ across PMMA rods in axial stagnation flow (Olson & Ferkul, 2017).
   * **Saffire-I (PSI-98)**: SIBAL sample dimensions ($40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$); nominal Cygnus atmospheric pressure ($101.3\text{ kPa}$); concurrent forced ventilation velocity ($20.0\text{ cm/s}$); quasi-steady concurrent flame spread rate of $2.0\text{–}2.5\text{ mm/s}$ without runaway acceleration; absence of buoyant necking with a broad parabolic flame base (Urban et al., 2019).

2. **Partially or Indirectly Supported Claims**:
   * **FLEX burning rate constant ($K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$)**: Accurate for hot diffusion burning of $n$-heptane in microgravity air at $1\text{ atm}$, but Nayagam et al. (2015) specifically reports the *cool-flame* burning rate ($\sim 0.2\text{–}0.3\text{ mm}^2/\text{s}$). The hot-flame range represents classical literature baseline, not a single test point in Nayagam (2015).
   * **BASS-II flow velocities ($1.0\text{–}25.0\text{ cm/s}$)**: The duct fan in Olson & Ferkul (2017) actually operated over **$0\text{ to }55\text{ cm/s}$**; $1\text{–}25\text{ cm/s}$ was typical for flat sheets, but the primary rod paper mapped up to $55\text{ cm/s}$.

3. **Unverified Claims & Conflations Identified**:
   * **BASS-II Flat Sheet vs. Rod Conflation**: The research notes cited Olson & Ferkul (2017) for flat PMMA sheets ($10\text{ mm} \times 100\text{ mm} \times 1.2\text{ mm}$) and spread rate $V_f \approx 0.068\text{ mm/s}$. However, Olson & Ferkul (2017) strictly tested **PMMA cylindrical rods ($6.35\text{–}12.7\text{ mm}$)** in axial stagnation flow. Flat sheet data belongs to separate BASS-II papers (Zhao et al., Bhattacharjee et al.).
   * **Synthetic Sensor Filenames and Run IDs**: As identified in Phase 0.5, filenames like `droplet_diameter_series_42.csv` and run IDs like `BASS2_PMMA_FLAT_RUN18` remain synthetic test placeholders.
   * **Flame Temperature Readings**: Values like $T_{flame} = 1420\text{ K}$ for BASS-II remain unverified against specific PSI thermocouple logs.

4. **Misleading Claims Corrected (Units & Conditions)**:
   * **Saffire-I Spread Rate Unit Incoherence in Canvas C**: `08-Canvas/Evidence-Chain.canvas` previously listed raw flame spread as $0.68\text{–}0.75\text{ cm/s}$ ($6.8\text{–}7.5\text{ mm/s}$). This is roughly triple the verified flight spread rate ($2.0\text{–}2.5\text{ mm/s} = 0.20\text{–}0.25\text{ cm/s}$) due to confusing terrestrial upward baseline data ($3.4\text{ cm/s}$) or millimeter/centimeter conversions. Corrected to $2.0\text{–}2.5\text{ mm/s}$.
   * **Saffire-I Cabin Pressurization ($\Delta P \approx 3.8\text{ kPa}$)**: Does not appear in Urban et al. (2019) as a measured empirical transducer reading. It is a **derived theoretical estimate** based on ideal gas thermal expansion in a sealed Cygnus cabin volume ($V \approx 18.9\text{ m}^3, \Delta T \approx 11\text{ K}$). It must be classified as `DERIVED_ESTIMATE`, not verified empirical telemetry.

5. **Overgeneralized Physical Interpretations Corrected**:
   * **de Ris Thermal Thickness Scaling ($V_f \propto 1/\tau$)**: The classical de Ris relationship strictly applies to **opposed-flow** conduction across thin sheets. Applying it unconditionally to **concurrent-flow** flame spread (Saffire-I) is invalid because concurrent spread is governed by downstream boundary-layer convection and radiant flame plume preheating.
   * **Partial Gravity ($0.16g, 0.38g$) Extrapolations**: Microgravity ($0g$) extinction cannot be applied to Lunar/Martian habitats without accounting for buoyant plume re-emergence ($Gr/Re^2 > 1$). This remains an `EVIDENCE_GAP`.

6. **Permissible Evidence for FIRELINE Implementation**:
   * Ground truth must be restricted to verified flight parameters, documented qualitative boundaries, and explicitly qualified scaling laws. No synthetic or unconfirmed numbers may enter the evidence retrieval or ranking pipeline.

---

## 2. Source Identification & Accessibility Audit

| Investigation | Primary Inspected Source | DOI / Identifier | Bibliographic Integrity | Full Text & Figures Inspected | Downloadable PSI Archive Status | Audit Accessibility Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FLEX (PSI-69)** | Nayagam, Dietrich, Hicks, Williams (2015), *Combust. Flame*, 162(5), 2140–2147 | `10.1016/j.combustflame.2015.01.012` | **VERIFIED** | **INSPECTED** (Sections 1–4, cool-flame extinction mechanics, NTC kinetics, $d_{ext}$ plots) | URL verified; public web portal lacks programmatic REST API. Datasets uncompressed only via web UI. | Paper findings verified. Specific individual flight run numbers remain pending PSI tabular extraction. |
| **BASS-II (PSI-25)**| Olson & Ferkul (2017), *Combust. Flame*, 180, 217–229 | `10.1016/j.combustflame.2017.03.001` | **VERIFIED** | **INSPECTED** (PMMA rod stagnation flow, low-flow quenching, blowoff boundaries, energy balance) | URL verified; web portal accessible. Run-by-run thermocouple time-series unindexed locally. | Paper findings verified for **rods**. Flat sheet data must cite separate literature (Zhao et al.). |
| **Saffire-I (PSI-98)**| Urban et al. (2019), *Combust. Flame*, 199, 168–182 | `10.1016/j.combustflame.2018.10.012` | **VERIFIED** | **INSPECTED** (Macro-scale SIBAL fabric, $20\text{ cm/s}$ flow, steady spread rate, parabolic flame base) | URL verified; flight telemetry bundles require manual archive unpacking. | Core flight spread parameters verified. Cabin pressure rise $\Delta P$ identified as derived calculation. |
| **SoFIE-MIST (PSI-104)**| Ferkul et al. (2019), ASGSR; NASA Task Book NNX10AE01G | Internal NASA Task Book | **PARTIALLY_VERIFIED** | NASA project summary reviewed; flight tables pending publication in open PSI | Web landing page verified. Full tabular data not yet indexed. | Retained strictly as `SYNTHETIC_ILLUSTRATIVE`; barred from production retrieval. |

---

## 3. High-Risk Claim Deep-Dives

### 3.1 Deep Dive 1: FLEX Burning Rate, $d^2$-Law, and Extinction Limits
* **Claim**: $n$-Heptane droplets burn according to the $d^2$-law with burning rate constant $K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$ at $1\text{ atm}$ in air.
* **Audit Finding**: In classical microgravity droplet experiments, $n$-heptane hot flames exhibit $K \approx 0.5\text{–}0.8\text{ mm}^2/\text{s}$. However, Nayagam et al. (2015) documents that after radiative extinction of the hot flame, droplets transition to low-temperature cool flames where the burning rate is substantially lower ($K_{cool} \approx 0.2\text{–}0.3\text{ mm}^2/\text{s}$). The research notes must not conflate hot diffusion burning rates with cool-flame burning rates.
* **Disposition**: `PARTIALLY_VERIFIED`. Qualified to distinguish hot-flame $K$ from cool-flame $K$.

### 3.2 Deep Dive 2: BASS-II Stagnation Flow Rods vs. Flat Sheet Conflation
* **Claim**: Olson & Ferkul (2017) documents flat PMMA sheet flammability ($10\text{ mm} \times 100\text{ mm} \times 1.2\text{ mm}$) with spread rate $V_f \approx 0.068\text{ mm/s}$ in $1\text{–}25\text{ cm/s}$ airflow.
* **Audit Finding**: Olson & Ferkul (2017) is explicitly entitled *"Microgravity flammability boundary for PMMA rods in axial stagnation flow"*. It investigates hemispherical-tipped PMMA rods ($6.35\text{ mm}, 9.5\text{ mm}, 12.7\text{ mm}$ diameter) in axial stagnation flow over velocities from **$0\text{ to }55\text{ cm/s}$**. The paper confirms low-speed radiative quenching ($1.0\text{–}1.5\text{ cm/s}$) and aerodynamic blowoff, but does **not** test flat PMMA sheets. Flat sheet tests in BASS-II were reported by other investigators (e.g., Zhao, Fernandez-Pello). Citing Olson & Ferkul (2017) for flat sheet spread rates is an erroneous attribution.
* **Disposition**: `CONTRADICTED` (attribution error). The rod flammability limits are verified; the flat sheet attribution must be corrected.

### 3.3 Deep Dive 3: Saffire-I Spread Rate & Cabin Pressurization
* **Claim A**: Steady concurrent flame spread rate on SIBAL is $2.0\text{–}2.5\text{ mm/s}$.
* **Audit Finding**: Urban et al. (2019) and Saffire comparative publications verify that concurrent flame spread reaches steady state at $\sim 2.0\text{–}2.5\text{ mm/s}$ (with specific comparative tests citing $2.03\text{ mm/s}$). This claim is fully verified.
* **Claim B**: Raw flame spread rate listed as $0.68\text{–}0.75\text{ cm/s}$ in Canvas C (`08-Canvas/Evidence-Chain.canvas`).
* **Audit Finding**: $0.68\text{–}0.75\text{ cm/s}$ ($6.8\text{–}7.5\text{ mm/s}$) is an accidental unit error or confusion with 1g terrestrial baseline tests ($3.4\text{ cm/s}$). It contradicts the flight observation ($2.0\text{–}2.5\text{ mm/s}$).
* **Disposition**: `CONTRADICTED`. Canvas C must be corrected.
* **Claim C**: Cabin pressure rise $\Delta P \approx 3.8\text{ kPa}$ ($\pm 0.2$).
* **Audit Finding**: The $3.8\text{ kPa}$ figure does not appear in Urban et al. (2019) as a measured telemetry data point. It represents an ideal gas derivation ($\Delta P = P \frac{\Delta T}{T}$) for Cygnus free volume ($18.9\text{ m}^3$) under a bulk temperature increase of $\Delta T \approx 11\text{ K}$. It is a plausible theoretical estimate, but not a verified empirical sensor reading.
* **Disposition**: `DERIVED_ESTIMATE`. Must be flagged as a theoretical calculation.

### 3.4 Deep Dive 4: Cross-Investigation Physics & Dimensionless Scaling
* **Claim**: Thermal thickness normalization scales as $V_f \propto 1/\tau$ for thin fuels ($Bi \ll 0.1$) and $V_f \propto 1/\tau^0$ for thick fuels ($Bi > 1$).
* **Audit Finding**: de Ris (1969) established $V_f \propto 1/\tau$ for **opposed-flow** flame spread across thin fuels where gas-phase conduction ahead of the flame dominates. In **concurrent flow** (Saffire-I), flame spread is governed by boundary-layer convection and radiant plume preheating over a growing pyrolysis length $L_p$. The spread rate does not follow a simple $1/\tau$ proportionality.
* **Disposition**: `PARTIALLY_VERIFIED` / Overgeneralized. Must be qualified to apply strictly to opposed-flow conduction.

---

## 4. Comprehensive Claim-Level Evidence Register

The following register audits all 24 technical claims across the FIRELINE knowledge base.

| Claim ID | Investigation | Claim Statement | Original Source | Evidence Location | Reported Value | Original Units | Experimental Conditions | Uncertainty | Audit Disposition | Audit Rationale | Required Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FLEX-001** | FLEX (PSI-69) | Droplet burns via quasi-steady $d^2$-law with hot burning rate $K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$ | Nayagam et al. (2015); Mikami et al. | Sections 1–2; general droplet literature | $0.5\text{–}0.7$ (hot); $0.2\text{–}0.3$ (cool) | $mm^2/s$ | $n$-Heptane, $101.3\text{ kPa}$, air ($21\% O_2$), $0g$, quiescent | Not located for single test point | `PARTIALLY_VERIFIED` | Hot-flame range is classical literature figure; Nayagam 2015 focuses on cool-flame rates ($0.2\text{–}0.3\text{ mm}^2/\text{s}$). | Qualify difference between hot and cool burning rates. |
| **FLEX-002** | FLEX (PSI-69) | Initial droplet diameters range $d_0 \approx 1.5\text{–}5.0\text{ mm}$ on SiC fibers | Nayagam et al. (2015) | Section 2 (Experimental Setup) | $1.5\text{–}5.0$ | $mm$ | $n$-Heptane, octane, decane, $14\ \mu\text{m}$ SiC tether | $\pm 0.02\text{ mm}$ | `VERIFIED` | Directly documented in Nayagam 2015 experimental procedure. | Retain as verified baseline. |
| **FLEX-003** | FLEX (PSI-69) | Radiative extinction occurs at finite diameter $d_{ext} > 0$ for large droplets | Nayagam et al. (2015) | Section 3, Fig. 2–3 | $d_{ext} > 0$ (finite) | $mm$ | Isolated droplets in $0g$; radiative heat loss from soot/gas | Visual tracking uncertainty | `VERIFIED` | Fundamental microgravity droplet phenomenon verified by experimental data. | Retain as verified finding. |
| **FLEX-004** | FLEX (PSI-69) | Cool-flame combustion persists at $T \sim 600\text{–}800\text{ K}$ in NTC region terminating at $d_{ext,cool}$ | Nayagam et al. (2015) | Section 3–4, Figs. 4–5 | $600\text{–}800$ | $K$ | $n$-Alkanes in air and inert dilution; NTC kinetics | Chemical kinetic models | `VERIFIED` | Confirmed by OH* chemiluminescence and shadowgraph diameter slope change. | Retain as verified finding. |
| **FLEX-005** | FLEX (PSI-69) | Specific test point: $d_{ext} = 1.42\text{ mm}$ ($\pm 0.04$), $K = 0.58\text{ mm}^2/\text{s}$ for run `FLEX_ISS_CIR_HEP_042` | `hco_schema_specification.md` | Record `FINDING-FLEX-082` | $1.42$, $0.58$ | $mm$, $mm^2/s$ | Synthetic run convention | $\pm 0.04$, $\pm 0.02$ | `CONTRADICTED` | Phase 0.5 audit proved run ID and filename are synthetic mock fixtures. | Retain as `SYNTHETIC_ILLUSTRATIVE`; bar from production engine. |
| **FLEX-006** | FLEX (PSI-69) | SiC fiber tether ($14\text{–}15\ \mu\text{m}$) causes conductive heat loss perturbing extinction | Nayagam et al. (2015); Dietrich et al. | Section 2 (Apparatus Limitations) | $14\text{–}15$ | $\mu m$ | Tethered vs free-floating comparative runs | Not quantified | `VERIFIED` | Documented apparatus effect; free droplets confirmed minimal perturbation. | Retain in apparatus limitations. |
| **BASS-001** | BASS-II (PSI-25) | Forced flow velocity test envelope spans $1.0\text{–}25.0\text{ cm/s}$ (and up to $55\text{ cm/s}$ for rods) | Olson & Ferkul (2017) | Section 2, Table 1 | $0\text{–}55$ | $cm/s$ | MSG duct fan speed, subsonic air | $\pm 0.2\text{ cm/s}$ | `PARTIALLY_VERIFIED` | Olson & Ferkul 2017 explicitly tested $0\text{–}55\text{ cm/s}$ for rods. $1\text{–}25\text{ cm/s}$ applies to flat sheets. | Update velocity range to $0\text{–}55\text{ cm/s}$ (rods) and $1\text{–}25\text{ cm/s}$ (slabs). |
| **BASS-002** | BASS-II (PSI-25) | Low-speed radiative quenching boundary occurs at $u_{ext,low} \approx 1.0\text{–}1.5\text{ cm/s}$ | Olson & Ferkul (2017) | Section 3.1, Fig. 4 | $1.0\text{–}1.5$ | $cm/s$ | PMMA rods in stagnation flow, microgravity | $\pm 0.3\text{ cm/s}$ | `VERIFIED` | Confirmed by video flame shrinkage and extinction oscillations. | Retain as verified finding. |
| **BASS-003** | BASS-II (PSI-25) | Aerodynamic blowoff limit occurs at elevated velocities ($15\text{–}50\text{ cm/s}$ depending on $X_{O_2}$), forming a "C-shaped" curve | Olson & Ferkul (2017) | Section 3.2, Fig. 6 | $15\text{–}50$ | $cm/s$ | PMMA rods, varying $X_{O_2}$ ($13.6\%\text{–}22.2\%$) | Linear regression fit | `VERIFIED` | Explicitly demonstrated as flame-hole formation in stagnation region. | Retain as verified finding. |
| **BASS-004** | BASS-II (PSI-25) | Flat PMMA sheet ($1.2\text{ mm} \times 10\text{ mm} \times 100\text{ mm}$) spread rate $V_f \approx 0.068\text{ mm/s}$ attributed to Olson & Ferkul (2017) | `01-Research/BASS-II-Research-Notes.md` | Cited Olson & Ferkul (2017) | $0.068$ | $mm/s$ | Opposed flow, $2.2\text{ cm/s}$, $101.3\text{ kPa}$ | $\pm 0.005\text{ mm/s}$ | `CONTRADICTED` | Attribution error: Olson & Ferkul 2017 tested rods, not flat sheets. Numerical value was synthetic fixture. | Correct paper scope to rods; reclassify $0.068\text{ mm/s}$ as synthetic. |
| **BASS-005** | BASS-II (PSI-25) | Gas flame temperature $T_{flame} = 1420\text{ K}$ ($\pm 25\text{ K}$) for run `BASS2_PMMA_FLAT_RUN18` | `docs/source_verification_matrix.md` | Record `FINDING-BASS2-114` | $1420.0$ | $K$ | Thermocouple rake reading | $\pm 25\text{ K}$ | `UNVERIFIED` | Specific run temperature not linked to a verified flight thermocouple log. | Mark `UNVERIFIED` until PSI-25 log extraction. |
| **BASS-006** | BASS-II (PSI-25) | Ambient oxygen test range spanned $13.6\%\text{ to }22.2\% O_2$ in nitrogen diluent | Olson & Ferkul (2017) | Section 2, Table 1 | $13.6\text{–}22.2$ | $\% O_2$ | MSG sealed volume with nitrogen dilution sweeps | $\pm 0.2\%$ | `VERIFIED` | Directly documented in Olson & Ferkul 2017 test matrix. | Retain as verified condition. |
| **SAFFIRE-001**| Saffire-I (PSI-98)| SIBAL sample dimensions: $40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$ ($75\%$ cotton / $25\%$ fiberglass) | Urban et al. (2019) | Section 2 (Experimental Setup) | $40.6 \times 94.0 \times 0.04$ | $cm$ | SIBAL fabric, Cygnus flow duct | Fabric manufacturing spec | `VERIFIED` | Documented in Urban et al. 2019 and NASA mission requirements. | Retain as verified geometry. |
| **SAFFIRE-002**| Saffire-I (PSI-98)| Nominal Cygnus cabin pressure during Saffire-I burn was $101.3\text{ kPa}$ ($14.7\text{ psia}$) | Urban et al. (2019); Cygnus OA-6 flight logs | Section 2; Phase 0.5 audit | $101.3$ | $kPa$ | Post-ISS unberth free flight, standard air | $\pm 0.5\text{ kPa}$ | `VERIFIED` | Confirmed atmospheric pressure. Earlier draft claim of $70.3\text{ kPa}$ was corrected. | Retain $101.3\text{ kPa}$. |
| **SAFFIRE-003**| Saffire-I (PSI-98)| Forced concurrent airflow maintained at $20.0\text{ cm/s}$ ($20\text{–}25\text{ cm/s}$) | Urban et al. (2019) | Section 2, flow tunnel specs | $20.0$ | $cm/s$ | Fan-driven flow tunnel ($0.5\text{ m} \times 0.5\text{ m}$) | $\pm 1.0\text{ cm/s}$ | `VERIFIED` | Confirmed nominal airflow velocity across fabric. | Retain as verified velocity. |
| **SAFFIRE-004**| Saffire-I (PSI-98)| Quasi-steady concurrent flame spread rate on SIBAL is $2.0\text{–}2.5\text{ mm/s}$ without runaway acceleration | Urban et al. (2019) | Section 3–4, flame spread analysis | $2.0\text{–}2.5$ ($2.03$ in comparative runs) | $mm/s$ | $0g$, concurrent flow, air, $101.3\text{ kPa}$ | $\pm 0.15\text{ mm/s}$ | `VERIFIED` | Confirmed by video pyrolysis tracking. Limits to steady state. | Retain as verified spread rate. |
| **SAFFIRE-005**| Saffire-I (PSI-98)| Flame spread rate stated as $0.68\text{–}0.75\text{ cm/s}$ in Canvas C node `node-raw-observation` | `08-Canvas/Evidence-Chain.canvas` | Node `node-raw-observation` | $0.68\text{–}0.75$ | $cm/s$ | Accidental transcription in Canvas C | Stated as $\pm 0.05\text{ cm/s}$ | `CONTRADICTED` | Unit/transcription error: $0.68\text{–}0.75\text{ cm/s} = 6.8\text{–}7.5\text{ mm/s}$, triple the flight rate of $2.0\text{–}2.5\text{ mm/s}$. | Correct Canvas C to $2.0\text{–}2.5\text{ mm/s}$ ($0.20\text{–}0.25\text{ cm/s}$). |
| **SAFFIRE-006**| Saffire-I (PSI-98)| Vehicle cabin pressure rise of $\Delta P \approx 3.8\text{ kPa}$ reported as empirical transducer reading | `hco_schema_specification.md`; notes | Record `FINDING-SAFFIRE1-004` | $3.8$ | $kPa$ | Cygnus closed volume ($18.9\text{ m}^3$) | Stated as $\pm 0.2\text{ kPa}$ | `DERIVED_ESTIMATE` | Value does not appear in Urban et al. 2019 as a measured telemetry point. Represents ideal gas thermal expansion calculation. | Reclassify as `DERIVED_ESTIMATE`; do not cite as empirical sensor reading. |
| **SAFFIRE-007**| Saffire-I (PSI-98)| Absence of buoyant necking; formation of broad parabolic flame base spanning fabric | Urban et al. (2019) | Section 3 (Flame Morphology) | Qualitative observation | Dimensionless | Video pyrometry images | Visual observation | `VERIFIED` | Confirmed by optical video logs; contrasted with 1g necking. | Retain as verified finding. |
| **CROSS-001** | Cross-Investigation | FLEX liquid droplet extinction data must not be cited as direct empirical support for solid flammability | Physical phase mechanics; `01-Research/Cross-Investigation-Analysis.md` | Section 3, Rule 1 | Boundary rule | Dimensionless | Phase transition ($h_{fg}$) vs chemical pyrolysis | Analytical certainty | `VERIFIED` | Fundamental thermodynamics: liquid evaporation lacks solid charring, melting, or composite scaffolds. | Enforce as hard engine gate (`PHASE_INCOMPATIBLE`). |
| **CROSS-002** | Cross-Investigation | Opposed-flow spread (BASS-II) and concurrent spread (Saffire-I) are physically distinct regimes | Boundary layer combustion theory; `01-Research/Cross-Investigation-Analysis.md` | Section 3, Rule 2 | Boundary rule | Dimensionless | Upstream conduction vs downstream convective/radiant preheating | Analytical certainty | `VERIFIED` | Flame mechanisms differ fundamentally; spread rates differ by an order of magnitude ($0.1\text{ mm/s}$ vs $2.4\text{ mm/s}$). | Enforce as hard engine gate (`FLOW_DIR_MISMATCH`). |
| **CROSS-003** | Cross-Investigation | Universal thermal thickness scaling claim: $V_f \propto 1/\tau$ for thin fuels across all regimes | `01-Research/Cross-Investigation-Analysis.md` | Section 3, Rule 3 | $V_f \propto 1/\tau$ | Dimensionless | Classical de Ris (1969) opposed spread | Theoretical formulation | `PARTIALLY_VERIFIED` | de Ris $1/\tau$ scaling strictly applies to **opposed flow**; concurrent spread depends on flame length and preheat geometry. | Qualify Rule 3 to apply strictly to opposed-flow conduction. |
| **CROSS-004** | Cross-Investigation | Extrapolation of $0g$ microgravity flammability to Lunar ($0.16g$) and Martian ($0.38g$) habitats | `01-Research/Scientific-Questions.md` | SQ-01 | $Ri = Gr/Re^2$ scaling | Dimensionless | Partial gravity buoyancy re-emergence | No flight test data | `EVIDENCE_GAP` | No flight combustion data exists for Lunar/Martian gravity in PSI. Applying $0g$ data directly is unsafe. | Enforce `EVIDENCE_GAP (GRAVITY_REGIME_DISCREPANCY)`. |
| **CROSS-005** | Cross-Investigation | Extrapolation of Saffire-I $101.3\text{ kPa}, 21\% O_2$ to Exploration Atmospheres ($56.5\text{ kPa}, 34\% O_2$) | `01-Research/Scientific-Questions.md` | SQ-02 | Low-pressure flammability | Dimensionless | Saffire-IV/V/VI test domain | Unindexed in current repo | `EVIDENCE_GAP` | Saffire-I tested only standard atmosphere. Exploration atmosphere data from later flights is not yet ingested. | Enforce `EVIDENCE_GAP (ATMOSPHERE_DISCREPANCY)`. |

---

## 5. Separate Evidence from Interpretation

To ensure epistemic hygiene in FIRELINE, all statements must be partitioned into three distinct layers:

### Layer A — Directly Reported Evidence (Empirical Ground Truth)
* Must be backed by an accessible primary paper section, figure, table, or NASA flight log.
* Units, test geometry, flow speed, and reported uncertainties must be preserved without alteration.
* **Permissible Examples in FIRELINE**:
  * Saffire-I SIBAL sample dimensions: $40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$ (Urban et al., 2019).
  * Saffire-I concurrent flame spread rate: $2.0\text{–}2.5\text{ mm/s}$ under $20\text{ cm/s}$ flow at $101.3\text{ kPa}$ (Urban et al., 2019).
  * BASS-II low-speed radiative quenching limit: $u_\infty \approx 1.0\text{–}1.5\text{ cm/s}$ for PMMA rods in axial stagnation flow (Olson & Ferkul, 2017).
  * FLEX radiative extinction of $n$-heptane droplets at finite diameter $d_{ext} > 0$ (Nayagam et al., 2015).

### Layer B — Interpretation & Physical Scaling (Qualified Inferences)
* Conclusions or projections requiring physical reasoning, dimensionless scaling, or analytical models beyond the raw observation.
* Must explicitly state all governing assumptions and boundary limitations.
* **Requirements in FIRELINE**:
  * Opposed vs. concurrent comparison: Must state that opposed flame spread is conduction-limited, while concurrent spread is preheat-assisted.
  * Thermal thickness: de Ris $V_f \propto 1/\tau$ must be explicitly restricted to 2D opposed-flow conduction.
  * Vehicle pressurization: $\Delta P \approx 3.8\text{ kPa}$ must be labeled as an ideal gas thermal expansion calculation for Cygnus volume, not an empirical sensor log.

### Layer C — Unresolved Questions & Evidence Gaps (Scientific Voids)
* Situations where empirical flight evidence is absent, contradictory, or inaccessible.
* Must immediately trigger an `EVIDENCE_GAP` classification to prevent LLM or algorithmic hallucination.
* **Permissible Examples in FIRELINE**:
  * Lunar ($0.16g$) and Martian ($0.38g$) combustion flammability thresholds.
  * Exploration atmosphere flammability ($56.5\text{ kPa}, 34\% O_2$) on large fabrics until Saffire-IV/V data is ingested.
  * Cool-flame secondary deflagration transition limits on structural spacecraft plastics.

---

## 6. What Evidence FIRELINE May Actually Use

When application implementation begins in Phase 1 and beyond, the following rules govern data ingestion and retrieval:

1. **Production Whitelist**:
   * Only claims marked `VERIFIED` in Section 4 may be ingested as canonical `EmpiricalFinding` records with `evidence_strength: "definitive"`.
   * Numerical values must match the primary source exactly (e.g. Saffire-I $V_f = 2.0\text{–}2.5\text{ mm/s}$, BASS-II quenching $1.0\text{–}1.5\text{ cm/s}$).
2. **Synthetic Segregation**:
   * Records `FINDING-FLEX-082`, `FINDING-BASS2-114`, `FINDING-SAFFIRE1-004`, and `FINDING-SOFIE-MIST-031` in `hco_schema_specification.md` must retain the `SYNTHETIC_ILLUSTRATIVE` tag and remain barred from search index ranking.
3. **Derived Value Tagging**:
   * Any calculated quantity (such as $\Delta P = 3.8\text{ kPa}$) must carry the `DERIVED_ESTIMATE` flag and include its derivation formula, volume, and temperature assumptions.
4. **Hard Epistemic Gate**:
   * The retrieval and ranking engine must never output `SUPPORTED` for an exploration atmosphere or partial-gravity query until genuine flight test points for those regimes are ingested.

---

## 7. Action Plan & Knowledge Base Updates

Based on this audit, the following immediate corrective actions are executed:

1. **`08-Canvas/Evidence-Chain.canvas`**:
   * Update node `node-raw-observation`: Correct erroneous spread rate from $0.68\text{–}0.75\text{ cm/s}$ to verified flight value $2.0\text{–}2.5\text{ mm/s}$ ($0.20\text{–}0.25\text{ cm/s}$).
   * Update node `node-dual-state-preservation`: Correct `raw_value` to `"2.03 mm/s"` or `"2.4 mm/s"` ($0.0024\text{ m/s}$).
2. **`01-Research/BASS-II-Research-Notes.md`**:
   * Clarify that Olson & Ferkul (2017) investigated **PMMA cylindrical rods in axial stagnation flow ($0\text{–}55\text{ cm/s}$)**, not flat PMMA sheets.
   * Document flat sheet references as distinct secondary studies.
3. **`01-Research/Saffire-I-Research-Notes.md`**:
   * Explicitly annotate vehicle cabin pressure rise ($\Delta P \approx 3.8\text{ kPa}$) as a derived theoretical calculation from bulk thermal expansion, not a verified flight transducer log.
4. **`01-Research/Cross-Investigation-Analysis.md`**:
   * Qualify Rule 3 (Thermal Thickness): State that de Ris $V_f \propto 1/\tau$ strictly applies to opposed-flow conduction; concurrent spread scaling depends on flame length and radiation feedback.
5. **`FIRELINE-Home.md`**:
   * Add a direct navigation link to `docs/phase08_scientific_evidence_audit.md`.
