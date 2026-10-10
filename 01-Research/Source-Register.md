# NASA PSI Source Register & Investigation Catalog
**Workspace**: `01-Research`  
**Purpose**: Authoritative registry of NASA Physical Sciences Informatics (PSI) combustion flight investigations, official dataset locators, verification levels, and empirical status.  
**Last Reviewed**: October 10, 2026

---

## 1. Registry Status Legend

* `VERIFIED`: The specific claim, conditions, and measurements are grounded in inspected primary literature or official PSI data tables.
* `PARTIALLY_VERIFIED`: Investigation identity, test rig, and qualitative trends are verified, but specific flight run numbers or raw files require table binding.
* `UNVERIFIED`: Data or claims require primary source verification.
* `SYNTHETIC_ILLUSTRATIVE`: Illustrative/mock record; excluded from production evidence engines.
* `APPROVED_FOR_PRODUCTION`: Record passed Phase 0.5 audit gate and is certified for ingestion.

---

## 2. Master Investigation Table

| Investigation ID | Code Name | Platform & Chamber | Research Focus | Official NASA PSI URL | Verified Primary Paper / DOI | Investigation Status | Production Readiness |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PSI-69** | **FLEX** | ISS CIR / MDCA | Droplet combustion, burning rates, radiative & cool flame extinction | [NASA PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) | Nayagam et al., *Combustion and Flame* (2015)<br>`10.1016/j.combustflame.2015.01.012` | `PARTIALLY_VERIFIED` | 🟡 Pending run table extraction |
| **PSI-25** | **BASS-II** | ISS MSG (Glovebox) Flow Duct | Solid fuels (PMMA, cotton), opposed & concurrent flame spread, low-speed extinction | [NASA PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25) | Olson & Ferkul, *Combustion and Flame* (2017)<br>`10.1016/j.combustflame.2017.03.001` | `PARTIALLY_VERIFIED` | 🟡 Pending run table extraction |
| **PSI-98** | **Saffire-I** | Cygnus Cargo Vehicle (OA-6) | Macro-scale fabric burns ($0.4\text{ m} \times 1.0\text{ m}$ SIBAL), vehicle cabin pressure | [NASA PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | Urban et al., *Combustion and Flame* (2019)<br>`10.1016/j.combustflame.2018.10.012` | `PARTIALLY_VERIFIED` | 🟡 Pending table extraction (Press: $101.3\text{ kPa}$) |
| **PSI-104** | **SoFIE-MIST**| ISS CIR Flow Duct with Heaters | Solid PMMA cylinders, external radiant heating, flammability limits in Exploration Atmospheres | [NASA PSI-104](https://psi.nasa.gov/physci/repo/data/investigations/PSI-104) | Ferkul et al. (ASGSR 2019); NASA Task Book NNX10AE01G | `UNVERIFIED` (Flight tables) | 🔴 Retained as `SYNTHETIC_ILLUSTRATIVE` |

---

## 3. Investigation Profiles & Source Details

### 3.1 FLEX — Flame Extinguishment Experiment (PSI-69)
* **Objective**: Determine the effectiveness of gaseous suppressants and quantify the burning rate and extinction diameter of spherical liquid fuel droplets in microgravity.
* **Environmental Domain**:
  * Gravity: Microgravity ($\sim 10^{-6} g$) in ISS Combustion Integrated Rack (CIR).
  * Pressure: Nominal atmospheric ($\sim 101.3\text{ kPa}$) and sub-atmospheric inert dilution.
  * Flow: Quiescent ($u_\infty = 0\text{ cm/s}$); transport is purely diffusion-dominated.
  * Fuel: $n$-Heptane, $n$-Octane, Methanol droplets ($1.5\text{–}5.0\text{ mm}$ initial diameter).
* **Available Archive Files**:
  * Optical camera video sequences (color and intensified UV).
  * Droplet diameter time-series logs ($d^2(t)$ curves).
  * Radiometer heat release logs.
* **Verified Observations**:
  * Radiative extinction occurs at a finite diameter ($d_{ext}$) larger than terrestrial buoyant flames due to suppression of convective heat loss.
  * Observation of persistent, non-luminous "cool-flame" burning following hot-flame radiative extinction.
* **Unresolved / Open Questions**:
  * Mapping internal test point IDs in the PSI data table to specific chemical dilution runs ($N_2$ vs. $CO_2$ vs. $He$).

---

### 3.2 BASS-II — Burning and Suppression of Solids - II (PSI-25)
* **Objective**: Investigate the ignition, flame growth, spread rate, and extinction limits of solid fuels in low-velocity forced flows.
* **Environmental Domain**:
  * Gravity: Microgravity in ISS Microgravity Science Glovebox (MSG).
  * Pressure: Ambient ISS cabin ($\sim 101.3\text{ kPa}$).
  * Flow: Controlled subsonic forced convective flow ($1.0\text{–}25.0\text{ cm/s}$).
  * Fuel: Clear cast PMMA flat slabs ($10\text{ mm} \times 100\text{ mm}$), PMMA cylindrical rods ($6.35\text{–}12.7\text{ mm}$), and cotton fabric strips.
* **Available Archive Files**:
  * High-speed video of opposed and concurrent flame spread.
  * Multi-channel thermocouple rake logs.
  * Flow duct anemometer speed logs.
* **Verified Observations**:
  * Flame spread rate over flat PMMA displays a non-monotonic response to ventilation velocity.
  * Radiative cooling causes low-speed quenching extinction when ventilation drops below $\sim 1.0\text{–}1.5\text{ cm/s}$.
* **Unresolved / Open Questions**:
  * Exact indexing of individual test numbers (Test 1 through Test 45) in the PSI repository to sample thickness and geometry.

---

### 3.3 Saffire-I — Spacecraft Fire Safety Experiment (PSI-98)
* **Objective**: Measure large-scale fire growth and material flammability inside a pressurized spacecraft cabin in microgravity, eliminating small-scale sample holder edge effects.
* **Environmental Domain**:
  * Platform: Orbital ATK Cygnus cargo vehicle (OA-6) after ISS unberthing.
  * Gravity: Microgravity free-flight.
  * Pressure: Standard nominal cabin pressure: **$101.3\text{ kPa}$** ($14.7\text{ psia}$).
  * Flow: Fan-driven forced ventilation at $20\text{ cm/s}$.
  * Fuel: Large SIBAL fabric sheet ($40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$, $75\%$ cotton / $25\%$ fiberglass blend).
* **Available Archive Files**:
  * Wide-angle and calibrated video camera records.
  * Environmental sensor telemetry ($P, T, O_2, CO_2$ cabin concentrations).
  * Radiometer heat release curves.
* **Verified Observations**:
  * Flames reach steady-state propagation without buoyant necking.
  * Concurrent flame spread rate on large SIBAL sheets is approximately $2.0\text{–}2.5\text{ mm/s}$.
* **Correction Note from Phase 0.5**:
  * Early draft listed $70.3\text{ kPa}$. Saffire-I flew at $101.3\text{ kPa}$. Sub-atmospheric exploration atmospheres ($56\text{–}70\text{ kPa}$) were explored in later Saffire flights (Saffire-IV, V, VI).

---

### 3.4 SoFIE-MIST — Material Ignition and Suppression Test (PSI-104)
* **Objective**: Determine ignition and extinction thresholds of solid fuels subjected to external radiant heating in Space Exploration Atmospheres (low pressure, elevated oxygen).
* **Environmental Domain**:
  * Platform: ISS CIR flow duct.
  * Pressure: Sub-atmospheric and standard cabin ($50\text{–}101\text{ kPa}$).
  * Oxygen: Variable $X_{O_2} = 15\%\text{–}30\%$.
  * Heating: Calibrated external radiant heat flux array ($0\text{–}40\text{ kW/m}^2$).
  * Fuel: Cast PMMA cylindrical rods ($6.35\text{ mm}$ diameter $\times 50\text{ mm}$).
* **Current Status**:
  * Flight campaign executed on ISS. Public experimental tables are currently pending full indexing in the open PSI repository.
  * **Disposition**: Retained as `SYNTHETIC_ILLUSTRATIVE` in test fixtures; barred from production evidence retrieval until flight tables are ingested.

---

## 4. Cross-Reference to Project Documentation
* Detailed verification audits: [[docs/source_verification_matrix|docs/source_verification_matrix.md]]
* Data contract updates: [[docs/hco_schema_change_proposal|docs/hco_schema_change_proposal.md]]
* Engine classification rules: [[docs/evidence_classifier_review|docs/evidence_classifier_review.md]]
