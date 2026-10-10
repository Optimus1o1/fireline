# Unresolved Scientific Questions & Research Roadmap
**Workspace**: `01-Research`  
**Purpose**: Formal catalog of open scientific questions, physical scaling ambiguities, and data limitations that FIRELINE must address or explicitly bound before interpreting combustion evidence.  
**Author**: Lead Scientific Data Engineer & Combustion Researcher (CIPHER)  
**Date**: October 10, 2026

---

## 1. Scientific Questions Register

### SQ-01: Partial-Gravity Extrapolation (Lunar $0.16g$ & Martian $0.38g$)
* **The Question**: Under what flow conditions does buoyant natural convection re-emerge in partial gravity ($0.16g$ and $0.38g$), and can microgravity ($0g$) flight data from FLEX, BASS-II, and Saffire be scaled to Lunar/Martian exploration habitats?
* **Scientific Importance**: NASA's Artemis Lunar Gateway and Mars habitats operate under partial gravity. In $0g$, buoyant convection is zero ($Gr = 0$). In partial gravity ($0.16g\text{–}0.38g$), buoyant plumes re-emerge whenever the Grashof number exceeds forced convection ($Gr / Re^2 > 1$). Blindly applying $0g$ quiescent or low-flow extinction limits could dangerously underpredict fire spread in a Martian habitat.
* **Supporting Sources**:
  * NASA Exploration Atmosphere Technical Report (NASA/SP-2010-3407).
  * Olson & Ferkul (*Combustion and Flame*, 2017) regarding the Richardson/Grashof transition.
* **Information Required**:
  * Quantitative scaling bounds (Richardson number $Ri = Gr/Re^2$) to demarcate when $0g$ data is physically valid versus when it must trigger `EVIDENCE_GAP (GRAVITY_REGIME_DISCREPANCY)`.

---

### SQ-02: Exploration Atmosphere Flammability (Reduced Pressure + Elevated $O_2$)
* **The Question**: How does reduced ambient pressure ($56.5\text{ kPa} \approx 8.2\text{ psia}$ to $70.3\text{ kPa} \approx 10.2\text{ psia}$) combined with elevated oxygen ($32\%\text{–}34\% O_2$) alter the extinction boundary and flame spread rate compared to standard atmospheric tests ($101.3\text{ kPa}, 21\% O_2$)?
* **Scientific Importance**: Saffire-I and BASS-II were conducted at standard atmospheric pressure ($101.3\text{ kPa}$). Future exploration habitats use lower pressures with elevated oxygen to reduce pre-breathe times for EVAs. Lower pressure reduces gas-phase chemical reaction rates, but elevated oxygen increases flame temperature and burning velocity. The net flammability shift is non-monotonic.
* **Supporting Sources**:
  * Urban et al. (*Combustion and Flame*, 2019) on pressure dependence in Saffire-IV/V.
  * NASA-STD-6001B: Flammability, Odor, Offgassing, and Compatibility Requirements.
* **Information Required**:
  * Correlation data from later Saffire flights (Saffire-IV through VI) to map the low-pressure flammability boundary over solid polymers.

---

### SQ-03: Small-to-Large Scale Extrapolation (Glovebox $10\text{ cm}$ vs. Vehicle $100\text{ cm}$)
* **The Question**: Can opposed flame spread rates measured on small samples ($10\text{ cm}$) in BASS-II be quantitatively related to concurrent flame spread on large fabric sheets ($100\text{ cm}$) in Saffire-I?
* **Scientific Importance**: If a mission planner queries fire safety for a crew garment, BASS-II provides small-scale data while Saffire-I provides vehicle-scale data. In concurrent flow, the flame preheats fuel downstream over an expanding pyrolysis length ($L_p$), leading to higher spread rates than opposed flow.
* **Supporting Sources**:
  * Urban et al. (*Combustion and Flame*, 2019), Section 4 ("Scale Effects").
  * Zhao et al. (*Proc. Combust. Inst.*, 2017) on concurrent spread over fabrics in BASS-II.
* **Information Required**:
  * An analytical scaling model (e.g., de Ris / Fernandez-Pello concurrent spread formulation) to convert between opposed and concurrent geometries, or an explicit engine rule restricting comparison to qualitative trends.

---

### SQ-04: Cool-Flame Deflagration Hazards in Spacecraft Cabins
* **The Question**: Does the cool-flame combustion observed on droplets in FLEX pose an active ignition hazard for structural plastics or spacecraft electrical wiring?
* **Scientific Importance**: FLEX proved that $n$-alkanes sustain low-temperature cool flames ($T \sim 600\text{–}800\text{ K}$) that produce partial oxidation products (aldehydes, CO, peroxides) invisibly. If a liquid leak (e.g., coolant or propellant) experiences cool-flame burning, can it transition back to a hot flame or deflagrate if emergency ventilation is restored?
* **Supporting Sources**:
  * Nayagam et al. (*Combustion and Flame*, 2015).
  * Dryer et al. (*Progress in Energy and Combustion Science*, 2017).
* **Information Required**:
  * Multi-stage combustion transition thresholds determining the critical vapor concentration required for secondary autoignition.

---

### SQ-05: Standard Flammability Test Equivalence (NASA-STD-6001 Test 1 vs. Microgravity)
* **The Question**: Why do materials that pass standard terrestrial upward flammability screening (NASA-STD-6001 Test 1) occasionally burn or propagate flames in microgravity low-speed flows?
* **Scientific Importance**: NASA currently certifies materials for flight based on a terrestrial 1g upward flame test. However, terrestrial buoyant flow produces high stretch rates ($\sim 100\text{ s}^{-1}$) that can extinguish marginally flammable materials, whereas microgravity low-speed ventilation ($2\text{–}5\text{ cm/s}$) produces very low stretch rates ($\sim 1\text{–}5\text{ s}^{-1}$) where flames can survive.
* **Supporting Sources**:
  * Olson & Ferkul (*Combustion and Flame*, 2017).
  * NASA Glenn Spacecraft Fire Safety Research Plan.
* **Information Required**:
  * Stretch-rate mapping to explain discrepancies between NASA-STD-6001 test ratings and actual flight observations in BASS-II and Saffire.

---

### SQ-06: PSI Tabular Dataset Granularity & Raw File Mapping
* **The Question**: How are individual flight runs structured in the downloadable PSI archive bundles for PSI-69, PSI-25, and PSI-98, and can tabular summary CSVs be extracted without manual re-formatting?
* **Scientific Importance**: In Phase 1 (Ingestion), the Python pipeline must parse real NASA experimental tables. Ensuring the schema maps directly to CSV column headers avoids manual data transcription errors during the hackathon.
* **Supporting Sources**:
  * NASA PSI Open Data portal (`https://psi.nasa.gov`).
  * `docs/source_verification_matrix.md`.
* **Information Required**:
  * Direct inspection of the uncompressed archive schemas for PSI-69, PSI-25, and PSI-98 prior to writing ingestion parsers.
