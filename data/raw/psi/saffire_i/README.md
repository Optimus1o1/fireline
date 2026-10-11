# Saffire-I Raw Data Staging Directory
**Investigation**: Spacecraft Fire Safety Experiment-I (SAFFIRE-I)  
**PSI Code**: `PSI-98` (Related: `PSI-99`, `PSI-100`, `PSI-26`)  
**Persistent Identifier**: DOI `10.60555/0t15-1243`  
**License**: CC0-1.0 (Public Domain Dedication)  
**Platform**: Orbital ATK Cygnus (OA-6 post-unberth) / Saffire 1 enclosure  
**Directory**: `data/raw/psi/saffire_i/`  

---

## 1. Expected Staged Artifacts

This directory is designated to receive raw and primary research assets for Saffire-I:

1. **Experimental Summary Table (`PSI98-ART-002`)**:
   * Complete 5-record flight run log from the PSI portal.
   * Runs: `S1` (SIBAL card 1), `S2` (SIBAL card 2), `F1C1/F1C2` (flow vis card 1), `F2C1/F2C2` (flow vis card 2).
   * Verified initial conditions: Length $40.6\text{ cm}$, Width $94\text{ cm}$, Thickness $0.37\text{ cm}$, Air flow $20\text{ cm/s}$, Oxygen $21.5\text{–}21.7\%$, Igniter power $182\text{ W}$.

2. **Metadata Package (`PSI98-ART-005`)**:
   * Official NASA archive package: `PSI-98_metadata_PSI-166_SAFFIRE-I.zip`.
   * Contains sensor transducer channel mappings, run timetables, and telemetry manifests.

3. **Sensor Telemetry & Optical Data**:
   * Radiometer heat release time-series (broadband and $4.3\ \mu\text{m}\ CO_2$ band).
   * Flow duct anemometer speed logs and cabin pressure transducer logs ($\Delta P \approx 0.5\text{ kPa}$ transient rise).
   * High-resolution camera distortion grid calibration package: `PSI-98_Raw Data_SAFFIRE-1_F1C1_DistortionGrids_1280x920_originals.zip`.

---

## 2. Source Readiness Status

* **Landing Page & Metadata**: `VERIFIED & ACCESSIBLE` (Version 4, Released 18-Sep-2024; metadata updated June 2025).
* **Experimental Summary Table**: `ACCESSIBLE & FULLY INSPECTED` (All 5 rows inspected and verified).
* **Metadata & Calibration Archive**: `LISTED IN REPOSITORY` (11.41 GB total archive; high priority for Phase 1 download).
* **Implementation Readiness**: `READY FOR INITIAL FIXTURE GENERATION`. The 5-row table can immediately populate test fixtures. Ingestion of raw sensor logs will proceed in Phase 1 upon archive retrieval.

---

## 3. Staging Rules & Invariants

* **Pressure Normalization Protocol**: Saffire-I flew at standard nominal cabin pressure (**$101.3\text{ kPa}$** / $14.7\text{ psia}$). Never introduce erroneous draft figures ($70.3\text{ kPa}$).
* **Preserve Text Ranges**: The oxygen field is reported as a string range (`"21.5 - 21.7"` and `"~ 21.5"`). Preserve this string in `raw_value` rather than forcing an arbitrary midpoint float.
* **Separation of Derived Quantities**: The steady-state concurrent spread rate ($2.4\text{ mm/s}$ SIBAL) and flame length ($15\text{ cm}$) are derived from camera analysis in Urban et al. (2019). These must be staged as `EmpiricalFinding` records with literature provenance, distinct from the raw 5-row operational table.
* **No Dummy Placeholders**: Do not create empty dummy CSV or ZIP files. This directory remains populated solely by this README until official Phase 1 execution.
