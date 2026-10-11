# FLEX Raw Data Staging Directory
**Investigation**: Flame Extinguishment Experiment (FLEX)  
**PSI Code**: `PSI-69`  
**Persistent Identifier**: DOI `10.60555/mbq8-0451`  
**License**: CC0-1.0 (Public Domain Dedication)  
**Platform**: ISS / Combustion Integrated Rack (CIR) / MDCA  
**Directory**: `data/raw/psi/flex/`  

---

## 1. Expected Staged Artifacts

This directory is designated to receive raw and primary research assets for FLEX:

1. **Experimental Summary Table (`PSI69-ART-002`)**:
   * Curated 275-record flight run log from the PSI portal.
   * Key columns: `FLEX Test #`, `FLEX Identifier` (`20CAL08`, etc.), `Test Date`, `Test GMT`, `Fuel` (`Methanol`), `Ambient pressure; mmHg`, `O initial ambient composition; mole fraction`, `N initial ambient composition; mole fraction`.
   * Target format: CSV / JSON export preserving original headers and `mmHg` pressure units.

2. **Targeted Run Archives (`PSI69-ART-003`)**:
   * Total PSI repository volume is **860.39 GB**. Bulk mirroring of the entire dataset is neither practical nor necessary for MVP evidence retrieval.
   * Targeted sub-folders containing $n$-heptane, $n$-octane, and Methanol droplet test runs matching the Dietrich et al. (2017) verification set (`FLEX-001` through `FLEX-004`).
   * Digitized droplet diameter time-series ($d^2(t)$) arrays and radiometer heat release channels.

---

## 2. Source Readiness Status

* **Landing Page & Metadata**: `VERIFIED & ACCESSIBLE` (Version 5, Released 31-Jul-2016).
* **Experimental Summary Table**: `ACCESSIBLE IN PORTAL` (275 rows confirmed in live inspection).
* **Raw Image & Data Bundle**: `LISTED IN REPOSITORY` (860.39 GB; undownloaded in pre-event phase).
* **Implementation Readiness**: `PARTIALLY READY`. The 275-run operational table is ready for immediate extraction during Phase 1. Deep sensor time-series requires selective run downloads.

---

## 3. Staging Rules & Invariants

* **Original Filename Retention**: Preserve NASA file designations byte-for-byte.
* **No Imputed Zeroes**: If radiative heat flux or burning rate constant is unmeasured in a specific run, the corresponding field must remain `null`. Never insert `0.0`.
* **Separate Normalized Data**: Any calculated burning rate constants ($K$) or normalized SI pressures ($kPa$) must reside in `data/processed/`, never in this raw folder.
* **No Placeholders**: Do not create empty dummy CSV or ZIP files. This directory remains populated solely by this README until official Phase 1 execution.
