# BASS-II Raw Data Staging Directory
**Investigation**: Burning and Suppression of Solids - II (BASS-II)  
**PSI Code**: `PSI-25` (Related: `PSI-26`)  
**Persistent Identifier**: DOI `10.60555/4qc4-de67`  
**License**: CC0-1.0 (Public Domain Dedication)  
**Platform**: ISS / Microgravity Science Glovebox (MSG)  
**Directory**: `data/raw/psi/bass_ii/`  

---

## 1. Expected Staged Artifacts

This directory is designated to receive raw and primary research assets for BASS-II:

1. **Experimental Summary Table (`PSI25-ART-002`)**:
   * Curated 130-record flight run log from the PSI portal representing Subrata Bhattacharjee's test campaign.
   * Columns: `PI` (`Bhattacharjee`), `Test #` (`B1`–`B5...`), `Date`, `GMT`, `Sample #`, `Fuel Sample Material` (`100–300 micron PMMA film 2 cm wide`), `Flow restrictor`, `Fan display`.
   * **Crucial Ingestion Constraint**: This table represents **thin PMMA film tests** ($100\text{–}300\ \mu\text{m}$). It does **not** represent the thick PMMA rod experiments.

2. **Thick PMMA Rod Experimental Runs (`PSI25-ART-003`)**:
   * Target data logs for Sandra Olson & Paul Ferkul's rod test series ($R = 6.35\text{–}12.7\text{ mm}$ cylindrical rods in axial stagnation flow).
   * Extracted from the `PSI-25/Raw Data/` sub-tree of the **257.77 GB** archive.
   * Opposed-flow velocity logs, ambient oxygen dilution mole fractions, thermocouple rake logs, and extinction observations supporting claims `BASS-001` through `BASS-006`.

3. **Engineering Calibration Files**:
   * Flow duct anemometer calibration curves translating dimensionless `Fan display` and `Flow restrictor` indices into physical air ventilation speeds ($u_\infty$ in $\text{cm/s}$).

---

## 2. Source Readiness Status

* **Landing Page & Metadata**: `VERIFIED & ACCESSIBLE` (Version 4, Released 31-Dec-2022).
* **Experimental Summary Table**: `ACCESSIBLE IN PORTAL` (130 rows of thin film tests confirmed).
* **Thick Rod Datasets**: `UNEXTRACTED IN ARCHIVE` (Requires isolating specific sub-directory within the 257 GB bundle).
* **Implementation Readiness**: `PARTIALLY READY`. Thin film runs are ready for immediate table export. Thick rod ingestion is blocked pending extraction of Olson & Ferkul's run logs.

---

## 3. Staging Rules & Invariants

* **Physical Geometry Isolation**: Thin film data and thick rod data must be stored in distinct sub-folders (`films/` vs. `rods/`) to prevent mixing thermally thin and thermally thick combustion physics.
* **Preserve Uncalibrated Readings**: Retain raw integer `Fan display` settings in `raw_value`. Never populate `flow_velocity_cm_s` with arbitrary or uncalibrated conversions.
* **No Dummy Placeholders**: Do not create empty CSV or mock video files. This directory remains populated solely by this README until official Phase 1 execution.
