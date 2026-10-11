# NASA PSI Artifact Inventory, Source Readiness & Pre-Flight Packaging
**Phase**: 0.95 — NASA PSI Artifact Inventory & Staging Architecture  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Author**: Lead Systems Architect & Scientific Data Engineer  
**Date**: October 11, 2026  
**Status**: Authoritative Planning Inventory (*Pre-event research and documentation only — no executable code*)  

---

## 1. Executive Summary & Source Distinction Framework

To prepare FIRELINE for genuine NASA Physical Sciences Informatics (PSI) research data ingestion, this document establishes a verifiable, evidence-backed inventory of official repository artifacts. 

Direct inspection of the live NASA PSI web portal (`https://psi.nasa.gov/physci/repo/`) demonstrates that repository artifacts exist in multiple distinct categories with varying levels of availability, granularity, and scientific coverage. A fundamental finding of this phase is that:
1. **An official investigation page does not prove that every relevant experimental record is accessible or uncompressed.**
2. **A repository experimental summary table does not automatically contain the measurements reported in a specific peer-reviewed publication.**
3. **Published papers frequently analyze specific subsets, higher-order derived quantities, or distinct fuel geometries that differ from default repository table previews.**

### 1.1 The Seven-Tier Artifact Classification Taxonomy

Every data asset evaluated in FIRELINE must be classified into one of the following seven distinct tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│               NASA PSI SOURCE ARTIFACT TAXONOMY                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Investigation Landing Page (Metadata, description, hardware, dates) │
│ 2. Repository Experimental Table (Curated tabular flight summary)     │
│ 3. Downloadable Dataset / Archive (.zip/.tar.gz multi-GB bundle)       │
│ 4. Raw Sensor Measurements / Telemetry (Multi-Hz transducer streams)   │
│ 5. Published Scientific Results (Peer-reviewed literature tables/figs) │
│ 6. Reference & Engineering Documents (Calibration, CAD, test rigs)     │
│ 7. Uninspected / Inaccessible Artifacts (Listed but unopened files)     │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Inspection Stage Lifecycle Invariant

To ensure research integrity, FIRELINE prohibits the conflation of inspection stages. For every artifact, the system records its status across six sequential lifecycle stages:
* **Stage 1 — Listed in Repository**: Identified by name or path within the official portal listing or version manifest.
* **Stage 2 — Metadata Inspected**: Descriptive parameters (DOI, file size, release date, licensing, author) verified from UI.
* **Stage 3 — Contents Opened & Inspected**: Table cells, document sections, or data rows directly viewed and read.
* **Stage 4 — Downloaded Locally**: Retained byte-for-byte in the local staging area with recorded cryptographic checksum.
* **Stage 5 — Parsed / Schema Evaluated**: Field headers, missing values, and data types mapped against data contracts.
* **Stage 6 — Mapped to Scientific Claim**: Reliably linked to a specific Phase 0.8 audited empirical claim.

---

## 2. Reconciled Source-Readiness Assessment

In Phase 0.9, candidate field mappings were drafted based on verified peer-reviewed publications. Direct inspection of the live NASA PSI portal requires reconciling those assessments to distinguish between *literature verification* and *repository table accessibility*.

### 2.1 The Five Distinct Readiness Dimensions

Earlier project reports occasionally used terms like `READY` or `VERIFIED` without distinguishing the engineering layer. FIRELINE formally decouples these concepts:

| Readiness Dimension | Definition | Example in Target Investigations |
| :--- | :--- | :--- |
| **Dimension 1: Scientific Claim Verified** | The physical finding is confirmed in peer-reviewed literature with verified methodology. | FLEX $d_{ext}$ burning kinetics verified in Dietrich et al. (2017). |
| **Dimension 2: Candidate Mapping Documented** | An abstract mapping from a scientific concept to an HCO entity/field exists in the blueprint. | `FLEX-PARAM-02` mapped to proposed `ScientificValue<number>`. |
| **Dimension 3: Repository Artifact Accessible** | An artifact is exposed by NASA PSI and viewable or retrievable in the public portal. | PSI-69 Experimental Table (275 rows) is publicly viewable. |
| **Dimension 4: Source Record Inspected** | The specific rows, headers, and values of the raw artifact have been directly read. | Table column `Ambient pressure; mmHg` read in browser session. |
| **Dimension 5: Implementation-Ready Mapping** | Every field in the raw artifact has an approved, tested 1:1 binding to canonical storage. | **BLOCKED** pending raw file parsing and flight run ID binding. |

### 2.2 Investigation-Specific Reconciliation Findings

#### FLEX (`PSI-69`)
* **Prior Assumption**: Assumed the repository table would immediately supply $d_0$, $d_{ext}$, and $K$ parameters matching the 2017 Dietrich paper on $n$-heptane and $n$-octane droplets.
* **Live Inspection Finding**: The default 275-row experimental table preview on PSI-69 lists **Methanol** droplet runs (`Fuel: Methanol`, `Ambient pressure; mmHg: ~760`, $X_{O_2} = 0.21$, $X_{N_2} = 0.79$). The table captures environmental conditions and test timestamps (`FLEX Test #`, `FLEX Identifier`, `Test Date`, `Test GMT`), but does **not** include the droplet diameter time-series ($d(t)$) or measured burning rate constants ($K$). Those quantities reside inside the massive **860.39 GB** raw video and sensor archive bundles.

#### BASS-II (`PSI-25`)
* **Prior Assumption**: Assumed repository experimental records directly represent the thick PMMA cylindrical rod flammability boundaries ($R = 6.35\text{–}12.7\text{ mm}$) analyzed in Olson & Ferkul (2017).
* **Live Inspection Finding**: The default 130-row experimental table preview on PSI-25 represents Subrata Bhattacharjee's test series (`PI: Bhattacharjee`, `Test #: B1` through `B5...`), focusing strictly on **thin PMMA films** (`100 micron PMMA film 2 cm wide`, `200 micron`, `300 micron`) in flow ducts with flow restrictors and fan display settings. Conflating Bhattacharjee's thin film table with Olson's thick rod study would introduce severe physical geometry errors into FIRELINE. The thick rod test series resides in separate test logs within the **257.77 GB** archive.

#### Saffire-I (`PSI-98`)
* **Prior Assumption**: Assumed the experimental table would record the flight concurrent flame spread rates ($2.4\text{ mm/s}$ SIBAL, $0.18\text{ mm/s}$ PMMA) and pressure variations ($\Delta P$).
* **Live Inspection Finding**: The repository experimental table contains exactly **5 rows** (`S1`, `S2`, `F1C1/F1C2`, `F2C1/F2C2`). It provides initial sample dimensions ($40.6\text{ cm} \times 94\text{ cm}$, Thickness: $0.37\text{ cm}$), air flow ($20\text{ cm/s}$), oxygen ($21.5\text{–}21.7\%$), and ignition power ($182\text{ W}$). It does **not** contain the dynamic flame spread rates or cabin pressure time-series, which were derived and reported in Urban et al. (2019) or stored inside the **11.41 GB** raw archive.

---

## 3. Investigation-Level Source Summaries (Section A)

### 3.1 FLEX — Flame Extinguishment Experiment (`PSI-69`)

* **Investigation Identifier**: `PSI-69`
* **Investigation Title**: Flame Extinguishment Experiment (FLEX)
* **Official Repository URL**: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-69`
* **Persistent Identifier / DOI**: `10.60555/mbq8-0451`
* **Repository Version & Release Date**: Version 5 (Released 31-Jul-2016; Initial Release: 31-Jul-2016)
* **Dataset Total Size**: **860.39 GB**
* **Applicable License**: **CC0-1.0** (Public Domain Dedication, explicitly stated)
* **Research Area & Sub-Area**: Combustion Science / Spacecraft Fire Safety
* **Platform & Hardware**: International Space Station (ISS) / Combustion Integrated Rack (CIR) / Multi-user Droplet Combustion Apparatus (MDCA)
* **Principal Investigators & Contacts**: Forman A. Williams, Benjamin D. Shaw, Michael C. Hicks, Vedha Nayagam, Mun Y. Choi, Frederick L. Dryer, Daniel Dietrich
* **Scientific Publications Listed on Portal**:
  1. Nayagam et al., "Methanol Droplet Combustion in Oxygen-Inert Environments in Microgravity"
  2. Nayagam, "Methanol Droplet Extinction in Oxygen/Carbon-dioxide/Nitrogen Mixtures in Microgravity..."
  3. Farouk & Dryer, "A Numerical Study On The Extinction Characteristics Of Droplet Combustion..." (`10.2514/6.2012-1252`)
  4. Farouk & Dryer, "Tethered methanol droplet combustion in carbon-dioxide enriched environment..." (`10.1016/j.combustflame.2011.06.014`)
  5. Hickman et al., "FLEX: A Decisive Step Forward in NASA's Combustion Research Program"
  6. Hicks et al., "Dynamics of Water Absorption and Evaporation During Methanol Droplet Combustion in Microgravity"
  7. Nayagam, "Activation energy asymptotics for methanol droplet extinction in microgravity" (`10.1016/j.combustflame.2013.05.011`)
  8. Dietrich et al., "Experimental Study of Initial Diameter Effects on Convection-free Droplet Combustion..."
* **Experimental Table Availability**: Yes — Exactly 1 table with 275 records exposed in web preview.
* **Raw Data Availability**: Listed in repository data tree (860.39 GB); not downloadable via automated HTTP API.
* **Other Artifact Categories**: Modeling Table (None), Hardware (FCF/CIR/MDCA), Representative Images (None), Data files and documents (Tree view), Version History (V1–V5).
* **Source Content Actually Inspected**:
  * Investigation metadata, dates, DOIs, licensing.
  * Experimental table preview: first 5 rows and pagination controls (275 total rows).
  * Column headers, units (`mmHg`, mole fraction), and fuel specification (`Methanol`).
* **Source Content NOT Inspected**:
  * Raw video frame sequences (color/UV) in the 860.39 GB archive.
  * Individual droplet diameter time-series arrays ($d^2(t)$ curves).
  * Radiometer heat release voltage channels.
* **Access Limitations**: No public REST API; bulk archive download of 860 GB requires high-capacity storage and manual staging.
* **Immediate Next Step**: Define surrogate ingestion keys mapping the 275 `FLEX Identifier` runs (`20CAL08`, etc.) to published test conditions.

---

### 3.2 BASS-II — Burning and Suppression of Solids - II (`PSI-25`)

* **Investigation Identifier**: `PSI-25`
* **Investigation Title**: Burning and Suppression of Solids - II (BASS-II)
* **Official Repository URL**: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-25`
* **Persistent Identifier / DOI**: `10.60555/4qc4-de67`
* **Repository Version & Release Date**: Version 4 (Released 31-Dec-2022; Initial Release: 31-Dec-2022)
* **Dataset Total Size**: **257.77 GB**
* **Applicable License**: **CC0-1.0** (Public Domain Dedication, explicitly stated)
* **Related Investigation**: `PSI-26`
* **Research Area & Sub-Area**: Combustion Science / Spacecraft Fire Safety
* **Platform & Hardware**: International Space Station (ISS) / Microgravity Science Glovebox (MSG)
* **Principal Investigators & Contacts**: Paul Ferkul, Carlos Fernandez-Pello, Fletcher J. Miller, James S. T'ien, Subrata Bhattacharjee
* **Scientific Publications Listed on Portal**:
  1. Olson & Ferkul, "Microgravity flammability boundary for PMMA rods in axial stagnation flow: Experimental results and energy balance analyses" (`10.1016/j.combustflame.2017.03.001`)
  2. Bhattacharjee et al., "Temperature and CO2 fields of a downward spreading flame over thin cellulose..." (`10.1016/j.proci.2014.05.093`)
  3. Bhattacharjee et al., "Opposed-flow flame spread: A comparison of microgravity and normal gravity experiments to establish the thermal regime" (`10.1016/j.firesaf.2015.11.011`)
  4. Bhattacharjee et al., "The critical flow velocity for radiative extinction in opposed-flow flame spread..."
* **Experimental Table Availability**: Yes — Exactly 1 table with 130 records exposed in web preview.
* **Raw Data Availability**: Listed in repository data tree (257.77 GB); bulk multi-GB download required.
* **Other Artifact Categories**:
  * Representative Image: 1 photograph verified (`PSI-25_Representative Image(s)_BASS-II_flame testing.jpg`).
  * Data tree folders: `Investigation Metadata Files`, `Engineering Documents`, `Raw Data`, `Reference Data`, `Science Documents`, `Reports`.
* **Source Content Actually Inspected**:
  * Investigation metadata, DOIs, licensing.
  * Experimental table preview: first 5 rows and pagination controls (130 total rows).
  * Column headers, PIs (`Bhattacharjee`), fuel material string (`100 micron PMMA film 2 cm wide`), fan settings.
  * Representative flame photograph.
* **Source Content NOT Inspected**:
  * High-speed video archives of flame extinction.
  * Multi-channel thermocouple rake time-series logs.
  * Separate experimental logs for Olson & Ferkul PMMA rod experiments.
* **Access Limitations**: Multi-PI investigation where the default web table reflects thin film tests; thick rod datasets require navigating deep directory structures in the undownloaded 257 GB archive.
* **Immediate Next Step**: Isolate the specific directory path in `PSI-25/Raw Data/` containing Olson & Ferkul's rod test series before attempting Phase 1 ingestion.

---

### 3.3 Saffire-I — Spacecraft Fire Safety Experiment-I (`PSI-98`)

* **Investigation Identifier**: `PSI-98`
* **Investigation Title**: Spacecraft Fire Safety Experiment-I (SAFFIRE-I)
* **Official Repository URL**: `https://psi.nasa.gov/physci/repo/data/investigations/PSI-98`
* **Persistent Identifier / DOI**: `10.60555/0t15-1243`
* **Repository Version & Release Date**: Version 4 (Released 18-Sep-2024; Initial Release: 18-Sep-2024; Metadata updated June 2025)
* **Dataset Total Size**: **11.41 GB**
* **Applicable License**: **CC0-1.0** (Public Domain Dedication, explicitly stated)
* **Related Investigations**: `PSI-99`, `PSI-100`, `PSI-26`
* **Research Area & Sub-Area**: Combustion Science / Spacecraft Fire, Smoke Distribution
* **Platform & Hardware**: Orbital ATK Cygnus Cargo Vehicle (OA-6 post-unberth) / Saffire 1 enclosure in Cygnus
* **Principal Investigator & Contact**: David L. Urban
* **Scientific Publications Listed on Portal**:
  1. Schoren, Ruff, Urban, "The Spacecraft Fire Experiment (Saffire) - Objectives, Development and Status"
  2. Niehaus et al., "Buoyant Effects on the Flammability of Silicone Samples Planned for the Spacecraft Fire Experiment (Saffire)"
  3. Urban et al., "Flame spread: Effects of microgravity and scale" (`10.1016/j.combustflame.2018.10.012`)
  4. Li et al., "Transient flame growth and spread processes over a large solid fabric in concurrent low-speed flows in microgravity – Model versus experiment" (`10.1016/j.proci.2018.05.168`)
  5. Jomaas et al., "Fire safety in space – beyond flammability testing of small samples" (`10.1016/j.actaastro.2014.11.025`)
  6. Ruff & Urban, "Operation and Development Status of the Spacecraft Fire Experiments (Saffire)"
* **Experimental Table Availability**: Yes — Exactly 1 table with 5 records exposed in web preview.
* **Raw Data Availability**: Listed in repository data tree (11.41 GB total); manageable size for targeted staging.
* **Other Artifact Categories**:
  * Data tree folders: `Investigation Metadata Files`, `Engineering Documents`, `Raw Data`, `Science Documents`, `Experimental table`.
  * Version History Manifest: 74 added files, 85 removed files, 1 updated metadata package (`PSI-98_metadata_PSI-166_SAFFIRE-I.zip`).
* **Source Content Actually Inspected**:
  * Investigation metadata, DOIs, licensing.
  * Experimental table: all 5 rows inspected (`S1`, `S2`, `F1C1/F1C2`, `F2C1/F2C2`).
  * Exact file naming pattern in Version 4 changelog (`PSI-98_Engineering Documents_SAFFIRE Offgassing Testing Strategy.pdf`, `PSI-98_Raw Data_SAFFIRE-1_F1C1_DistortionGrids_1280x920_originals.zip`).
* **Source Content NOT Inspected**:
  * Raw photodiode/radiometer sensor voltage waveforms.
  * Full-resolution video frames inside the distortion grids zip archive.
  * Offgassing testing strategy PDF document contents.
* **Access Limitations**: Table provides flight configuration only; dynamic flame spread rate ($2.4\text{ mm/s}$) requires extracting derived data from Urban et al. (2019) or video analysis logs.
* **Immediate Next Step**: Download `PSI-98_metadata_PSI-166_SAFFIRE-I.zip` during the Phase 1 implementation window to map exact sensor channel names.

---

## 4. Artifact-Level Manifest (Section B)

The following manifest records the authoritative status of specific repository artifacts identified during the inspection. No filenames, sizes, or DOIs have been invented.

| Artifact ID | Investigation | Repository Category | Artifact Title / Filename | Persistent Identifier | Artifact Type | Availability | Metadata Inspected | Contents Inspected | Local Download Status | Relevant Claims | Candidate Mapping | Limitations & Ambiguities | Next Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PSI69-ART-001** | FLEX | Investigation Record | Flame Extinguishment Experiment (FLEX) Overview | `10.60555/mbq8-0451` | Web Record | Accessible | YES | YES | Not downloaded | `FLEX-001` to `006` | `Investigation` | High-level metadata only; no raw values. | Link to `Investigation` entity. |
| **PSI69-ART-002** | FLEX | Experimental Table | PSI-69 Experimental Table (275 runs) | `10.60555/mbq8-0451` | Tabular Grid | Accessible | YES | PARTIAL (Rows 1–5 inspected) | Not downloaded | `FLEX-001`, `FLEX-004` | `EnvironmentalConditions`, `ExperimentalRun` | Methanol fuel runs only in preview; no $d(t)$ curves or $d_{ext}$ values. | Parse complete 275-row table in Phase 1. |
| **PSI69-ART-003** | FLEX | Raw Data Archive | PSI-69 Complete Data Archive (860.39 GB) | `10.60555/mbq8-0451` | Binary Archive Bundle | Listed in Repo | YES (Size: 860.39 GB) | NO | Not downloaded | `FLEX-002`, `FLEX-003` | `MeasurementRecord` | Massive dataset; prohibitive for bulk pre-event transfer. | Isolate specific sub-directory for target runs. |
| **PSI25-ART-001** | BASS-II | Investigation Record | Burning and Suppression of Solids - II Overview | `10.60555/4qc4-de67` | Web Record | Accessible | YES | YES | Not downloaded | `BASS-001` to `006` | `Investigation` | High-level metadata only. | Link to `Investigation` entity. |
| **PSI25-ART-002** | BASS-II | Experimental Table | PSI-25 Experimental Table (130 runs) | `10.60555/4qc4-de67` | Tabular Grid | Accessible | YES | PARTIAL (Rows 1–5 inspected) | Not downloaded | `BASS-001`, `BASS-002` | `EnvironmentalConditions`, `FuelSpec` | Represents Bhattacharjee thin PMMA film tests; does not contain Olson rod data. | Inspect other tables in dropdown during Phase 1. |
| **PSI25-ART-003** | BASS-II | Raw Data Archive | PSI-25 Complete Data Archive (257.77 GB) | `10.60555/4qc4-de67` | Binary Archive Bundle | Listed in Repo | YES (Size: 257.77 GB) | NO | Not downloaded | `BASS-003`, `BASS-006` | `MeasurementRecord` | Large multi-PI archive; internal directory structure unverified. | Target Olson & Ferkul rod subfolders. |
| **PSI25-ART-004** | BASS-II | Representative Image | `PSI-25_Representative Image(s)_BASS-II_flame testing.jpg` | `10.60555/4qc4-de67` | JPEG Image | Accessible | YES | YES | Not downloaded | `BASS-001` | Contextual Asset | Visual documentation; qualitative flame shape only. | Cache thumbnail for UI evidence explorer. |
| **PSI98-ART-001** | Saffire-I | Investigation Record | Spacecraft Fire Safety Experiment-I Overview | `10.60555/0t15-1243` | Web Record | Accessible | YES | YES | Not downloaded | `SAFFIRE-001` to `007` | `Investigation` | High-level metadata only. | Link to `Investigation` entity. |
| **PSI98-ART-002** | Saffire-I | Experimental Table | PSI-98 Experimental Table (5 runs) | `10.60555/0t15-1243` | Tabular Grid | Accessible | YES | YES (All 5 rows inspected) | Not downloaded | `SAFFIRE-001`, `SAFFIRE-003` | `FuelSpec`, `EnvironmentalConditions` | Captures initial flight conditions; spread rate ($2.4\text{ mm/s}$) not in table. | Ingest 5 rows directly into test fixtures. |
| **PSI98-ART-003** | Saffire-I | Raw Data Archive | `PSI-98_Raw Data_SAFFIRE-1_F1C1_DistortionGrids_1280x920_originals.zip` | `10.60555/0t15-1243` | ZIP Archive | Listed in Changelog | YES | NO | Not downloaded | `SAFFIRE-001` | Calibration Data | Optical distortion grids; not a combustion measurement. | Retain as reference calibration asset. |
| **PSI98-ART-004** | Saffire-I | Engineering Document | `PSI-98_Engineering Documents_SAFFIRE Offgassing Testing Strategy.pdf` | `10.60555/0t15-1243` | PDF Document | Listed in Changelog | YES | NO | Not downloaded | None (Safety doc) | Engineering Reference | Offgassing qualification doc; pre-flight safety only. | Archive for safety provenance. |
| **PSI98-ART-005** | Saffire-I | Metadata Package | `PSI-98_metadata_PSI-166_SAFFIRE-I.zip` | `10.60555/0t15-1243` | ZIP Archive | Listed in Changelog | YES | NO | Not downloaded | `SAFFIRE-001` to `007` | `AuditProvenance` | Package manifest and schema metadata. | High-priority download for Phase 1. |

---

## 5. Experimental-Table Field Inspection (Section C)

Direct inspection of the three accessible web tables revealed exact column headers, displayed units, and structural formatting.

### 5.1 FLEX (`PSI-69`) Experimental Table

* **Table Record Count**: Exactly **275 records** (Pagination: 5 per page, 1–5 of 275).
* **Observed Column Headers & Displayed Units**:
  1. `FLEX Test #`: Integer test counter (e.g. `1`, `2`, `3`).
  2. `FLEX Identifier`: Alphanumeric flight test code (e.g. `20CAL08`, `20CAL10`, `30CAL02`).
  3. `Test Date`: Standard calendar date (e.g. `3/5/2009`, `3/31/2009`).
  4. `Test GMT`: Greenwich Mean Time stamp (e.g. `17:22:03`, `19:20:06`).
  5. `Fuel`: Chemical fuel name (e.g. `Methanol`).
  6. `Ambient pressure; mmHg`: Ambient chamber pressure with explicit unit `mmHg` (e.g. `757.7`, `762`, `764.2`, `760`).
  7. `O initial ambient composition; mole fraction`: Oxygen mole fraction with explicit unit `mole fraction` (e.g. `0.21`).
  8. `N initial ambient composition; mole fraction`: Nitrogen mole fraction with explicit unit `mole fraction` (e.g. `0.79`).
* **Representative Rows**:
  * Row 1: `1 | 20CAL08 | 3/5/2009 | 17:22:03 | Methanol | 757.7 | 0.21 | 0.79`
  * Row 2: `2 | 20CAL10 | 3/5/2009 | 19:20:06 | Methanol | 762 | 0.21 | 0.79`
* **Missing Value Representation**: Not observed in initial rows; all fields fully populated.
* **Supported Phase 0.9 Mappings**:
  * `FLEX Identifier` $\rightarrow$ `ExperimentalRun.run_id` (Ready).
  * `Ambient pressure; mmHg` $\rightarrow$ `EnvironmentalConditions.pressure_kpa` via `ScientificValue<number>` preserving raw `mmHg` (Ready).
  * `Fuel` $\rightarrow$ `FuelSpec.fuel_name` (Ready).
* **Unsupported Mappings in this Table**: Droplet initial diameter ($d_0$), extinction diameter ($d_{ext}$), burning rate ($K$).

---

### 5.2 BASS-II (`PSI-25`) Experimental Table

* **Table Record Count**: Exactly **130 records** (Pagination: 5 per page, 1–5 of 130).
* **Observed Column Headers & Displayed Units**:
  1. `PI`: Principal Investigator surname (e.g. `Bhattacharjee`).
  2. `Test #`: Test run identifier within PI campaign (e.g. `B1`, `B2`, `B3`, `B4`, `B5`).
  3. `Date`: Test execution date (e.g. `2/19/2014`).
  4. `GMT`: Integer timestamp / GMT day (e.g. `50`).
  5. `Sample #`: Hardware sample specimen slot (e.g. `147`, `155`, `148`, `159`, `156`).
  6. `Fuel Sample Material`: Descriptive string embedding material, thickness, and width (e.g. `100 micron PMMA film 2 cm wide`, `200 micron PMMA film 2 cm wide`). Units (`micron`, `cm`) are embedded in free text.
  7. `Flow restrictor`: Integer setting for glovebox duct orifice (e.g. `2`). Unit is dimensionless index.
  8. `Fan display`: Integer setting for duct ventilation blower (e.g. `62`, `47`, `61`, `59`). Unit is arbitrary display units, requiring calibration curve to convert to $\text{cm/s}$.
* **Representative Rows**:
  * Row 1: `Bhattacharjee | B1 | 2/19/2014 | 50 | 147 | 100 micron PMMA film 2 cm wide | 2 | 62`
  * Row 2: `Bhattacharjee | B2 | 2/19/2014 | 50 | 155 | 200 micron PMMA film 2 cm wide | 2 | 62`
* **Missing Value Representation**: String fields populated; no explicit null tokens observed in rows 1–5.
* **Supported Phase 0.9 Mappings**:
  * `Test #` $\rightarrow$ `ExperimentalRun.run_id` (Partial; requires prefixing `PSI25-BHATT-B1`).
  * `Fuel Sample Material` $\rightarrow$ `FuelSpec` (Partial; requires string regex parsing to extract thickness: $100\ \mu\text{m}$, width: $2\text{ cm}$).
* **Unsupported Mappings in this Table**:
  * Olson & Ferkul PMMA rod measurements ($R = 6.35\text{ mm}$, stagnation flow velocities, extinction boundaries).
  * Direct velocity in $\text{cm/s}$ (table only provides uncalibrated `Fan display` index).

---

### 5.3 Saffire-I (`PSI-98`) Experimental Table

* **Table Record Count**: Exactly **5 records** (All 5 records visible in single view).
* **Observed Column Headers & Displayed Units**:
  1. `Sample Number`: Flight sample code (`S1`, `S2`, `F1C1/F1C2`, `F2C1/F2C2`).
  2. `Material`: Sample type or test description (`SIBAL Fabric`, `Pre-test flow visulation data for sample 1`, `Pre-test flow visulation data for sample 2`). Note typographical spelling in source: `"flow visulation"`.
  3. `Sample Thickness (cm)`: Explicit thickness with unit `cm`. Value: `0.37` for `S1` and `S2`; empty for flow visualization rows. (Note: Fabric sample thickness is reported as `0.37 cm` ($3.7\text{ mm}$), representing the sample holder card assembly or total pack thickness, distinct from the $0.4\text{ mm}$ fabric weave).
  4. `Sample Length (cm)`: Specimen length with unit `cm`. Value: `40.6` for `S1` and `S2`.
  5. `Sample Width (cm)`: Specimen width with unit `cm`. Value: `94` for `S1` and `S2`.
  6. `Air Flow (cm/s)`: Forced flow air velocity with explicit unit `cm/s`. Value: `20` for `S1` and `S2`.
  7. `Percent O2`: Oxygen concentration percentage. Values: `21.5 - 21.7` (range string) for `S1`, `~ 21.5` (approximate string) for `S2`.
  8. `Ignition Power (W)`: Electrical hot-wire igniter power with explicit unit `W`. Value: `182` for `S1` and `S2`.
* **All 5 Table Records**:
  * Record 1: `S1 | SIBAL Fabric | 0.37 | 40.6 | 94 | 20 | 21.5 - 21.7 | 182`
  * Record 2: `S2 | SIBAL Fabric | 0.37 | 40.6 | 94 | 20 | ~ 21.5 | 182`
  * Record 3: `F1C1/F1C2 | Pre-test flow visulation data for sample 1 | [BLANK] | [BLANK] | [BLANK] | [BLANK] | [BLANK] | [BLANK]`
  * Record 4: `F2C1/F2C2 | Pre-test flow visulation data for sample 2 | [BLANK] | [BLANK] | [BLANK] | [BLANK] | [BLANK] | [BLANK]`
  * Record 5: Blank delimiter / summary row.
* **Missing Value Representation**: Blank cells (empty string); flow visualization rows leave numerical columns empty rather than inserting zeros.
* **Supported Phase 0.9 Mappings**:
  * `Sample Number` $\rightarrow$ `ExperimentalRun.run_id` (Ready).
  * `Air Flow (cm/s)` $\rightarrow$ `EnvironmentalConditions.flow_velocity_cm_s` (Ready; exact match at $20\text{ cm/s}$).
  * `Percent O2` $\rightarrow$ `EnvironmentalConditions.oxygen_concentration_pct` via `ScientificValue<string>` (Ready; preserves range/approximate strings).
  * `Sample Length (cm)`, `Sample Width (cm)` $\rightarrow$ `FuelSpec.dimensions` (Ready).
* **Unsupported Mappings in this Table**: Dynamic flame spread rate ($2.4\text{ mm/s}$ SIBAL) and chamber pressure rise ($\Delta P$).

---

## 6. Publication-to-Artifact Relationships (Section D)

A critical architectural finding of Phase 0.95 is that published scientific papers and repository-hosted experimental tables are **not automatically interchangeable evidence sources**.

```
┌────────────────────────────────────────────────────────────────────────┐
│             PUBLICATION VS. REPOSITORY ARTIFACT RELATIONSHIP           │
├────────────────────────────────────────────────────────────────────────┤
│  PEER-REVIEWED LITERATURE               REPOSITORY EXPERIMENTAL TABLES  │
│  • Highly curated derived values       • Operational engineering run logs│
│  • Extracted burning slopes (K)         • Raw fan/pressure sensor readings│
│  • Flammability boundary envelopes      • Specific test sub-campaigns     │
│  • Often covers subset of flight runs   • May represent different fuel/PI │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.1 FLEX Mappings
* **Paper**: Dietrich et al. (2017), *Combustion and Flame* (`10.1016/j.combustflame.2017.04.050`).
  * Supports Claims: `FLEX-001`, `FLEX-002`, `FLEX-003`, `FLEX-004`.
  * Measurements: Free droplet burning of $n$-heptane ($d_0 = 1.5\text{–}5.0\text{ mm}$), radiative extinction diameters ($d_{ext} \approx 0.3\text{–}1.5\text{ mm}$), cool-flame persistence.
* **Repository Artifact**: `PSI69-ART-002` (Experimental Table).
  * Focus: 275 flight tests primarily evaluating **Methanol** droplets under various $N_2/CO_2$ inert dilutions.
  * Relationship: **Decoupled**. The table verifies flight run infrastructure and environmental pressure telemetry, but does *not* contain the $n$-heptane burning kinetics reported in Dietrich (2017).
  * Ingestion Policy: In Phase 1, `PSI69-ART-002` provides `EnvironmentalConditions` and `ExperimentalRun` records, while Dietrich (2017) provides `MeasurementRecord` and `EmpiricalFinding` records with linked provenance.

### 6.2 BASS-II Mappings
* **Paper**: Olson & Ferkul (2017), *Combustion and Flame* (`10.1016/j.combustflame.2017.03.001`).
  * Supports Claims: `BASS-001`, `BASS-002`, `BASS-003`, `BASS-006`.
  * Measurements: Opposed-flow burning of thick PMMA cylindrical rods ($R = 6.35\text{–}12.7\text{ mm}$), stagnation flow flammability boundary ($u_\infty \le 1.0\text{ cm/s}$ quenching).
* **Repository Artifact**: `PSI25-ART-002` (Experimental Table).
  * Focus: 130 flight tests conducted by Subrata Bhattacharjee on **thin PMMA films** ($100\text{–}300\ \mu\text{m}$) examining downward/opposed spread over thin substrates.
  * Relationship: **Severe Geometry Decoupling**. These are fundamentally different physical experiments. Thin film burning is thermally thin ($Bi \ll 1$), whereas thick rod burning is thermally thick ($Bi \gg 1$).
  * Ingestion Policy: `PSI25-ART-002` must **never** be used to populate the PMMA rod data contract. Olson & Ferkul's rod test series must be extracted from the uncompressed raw logs in `PSI-25/Raw Data/` or mapped directly from paper tables.

### 6.3 Saffire-I Mappings
* **Paper**: Urban et al. (2019), *Combustion and Flame* (`10.1016/j.combustflame.2018.10.012`).
  * Supports Claims: `SAFFIRE-001`, `SAFFIRE-002`, `SAFFIRE-003`, `SAFFIRE-004`, `SAFFIRE-007`.
  * Measurements: Concurrent flame spread over SIBAL fabric ($2.4\text{ mm/s}$), PMMA slab spread ($0.18\text{ mm/s}$), cabin pressure baseline ($101.3\text{ kPa}$), flame length ($15\text{ cm}$).
* **Repository Artifact**: `PSI98-ART-002` (Experimental Table).
  * Focus: Pre-flight operational log of the 5 test points in Saffire-1 (`S1` and `S2` SIBAL cards, plus 2 flow visualization runs).
  * Relationship: **Complementary Initial Condition Source**. The table provides exact initial configuration parameters (dimensions, airflow, $O_2\%$, ignition wattage), while Urban et al. (2019) provides the resulting dynamic measurements.
  * Ingestion Policy: `PSI98-ART-002` directly populates `FuelSpec` and `EnvironmentalConditions`, while Urban et al. (2019) populates `MeasurementRecord` flame spread rates.

---

## 7. Local Staging Layout Specification

To organize downloaded assets during the future Phase 1 implementation period, the following directory layout is established under `data/raw/psi/`:

```
data/raw/psi/
├── README.md                      # Shared conventions, acceptance rules, licensing
├── flex/                          # FLEX (PSI-69) staging area
│   └── README.md                  # FLEX-specific manifest and run bindings
├── bass_ii/                       # BASS-II (PSI-25) staging area
│   └── README.md                  # BASS-II-specific manifest (film vs. rod separation)
└── saffire_i/                     # Saffire-I (PSI-98) staging area
    └── README.md                  # Saffire-I manifest and sensor telemetry layout
```

### Staging Rules
1. **Preserve Original Filenames**: Files must retain their exact NASA PSI names (e.g. `PSI-98_metadata_PSI-166_SAFFIRE-I.zip`).
2. **Cryptographic Checksums**: Every downloaded asset must be hashed (SHA-256) upon retrieval.
3. **Immutable Raw Storage**: Files placed in `data/raw/psi/` are strictly read-only. Cleaned, parsed, or normalized outputs must be written to `data/processed/` or database fixtures.
4. **No Dummy Placeholders**: Empty staging directories are represented solely by their `README.md`. No zero-byte or fictional test files may be created.

---

## 8. Source-Artifact Acceptance Policy

Before any artifact downloaded from NASA PSI may be ingested into FIRELINE during Phase 1, it must satisfy the following eight acceptance criteria:

1. **Identity Verification**: The artifact must possess a confirmed association with an official NASA PSI investigation code (`PSI-69`, `PSI-25`, `PSI-98`) and display a verifiable persistent identifier (DOI or NASA archive handle).
2. **Provenance Traceability**: The official source URL, repository version, release date, and retrieval timestamp must be recorded in an associated metadata manifest.
3. **Data Integrity**: The downloaded file must match its published file size and pass a SHA-256 hash check.
4. **Licensing Compliance**: The file must carry explicit public access conditions. (All three target investigations carry verified **CC0-1.0** Public Domain dedications).
5. **Scientific Relevance**: The artifact must directly substantiate a cataloged empirical claim or provide necessary boundary conditions. Irrelevant files (e.g. general administrative slide decks) must not be staged.
6. **Inspection Transparency**: The artifact's inspection status must be accurately labeled (`Metadata Inspected`, `Contents Inspected`, `Parsed`). Uninspected files must never be tagged as verified.
7. **Strict Separation of Forms**: Raw sensor streams, parsed tabular records, normalized SI values, derived theoretical models, and synthetic fixtures must remain in physically distinct storage containers.
8. **Honest Missingness**: Ingestion parsers must preserve `null` for unrecorded values. Imputing zero or standard atmospheric defaults ($101.3\text{ kPa}$, $298.15\text{ K}$) for missing data is grounds for immediate artifact rejection.

---

## 9. Remaining Access & Ingestion Blockers (Gap Register Update)

Direct inspection of the NASA PSI repository updates the implementation blocker register:

| Blocker ID | Investigation | Nature of Blocker | Impact on Phase 1 Ingestion | Recommended Resolution | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BLK-01** | All Investigations | Absence of automated REST API on `psi.nasa.gov` | Ingestion pipeline cannot execute automated curl/fetch scripts to pull files dynamically. | Pre-download verified bundles manually into `data/raw/psi/` prior to pipeline execution. | **CONFIRMED OPEN** |
| **BLK-02** | FLEX (`PSI-69`) | 860.39 GB dataset volume | Prohibitive storage and bandwidth overhead for complete archive transfer. | Scope Phase 1 to the 275-row experimental table plus targeted extraction of specific $n$-heptane runs. | **MITIGATION DEFINED** |
| **BLK-03** | BASS-II (`PSI-25`) | Multimodal test series conflation (Films vs. Rods) | Default table preview contains thin PMMA films; thick PMMA rod records require deep archive exploration. | Forbid automated ingestion of default PSI-25 table for rod claims; isolate rod test logs in Phase 1. | **CRITICAL CONSTRAINT** |
| **BLK-04** | Saffire-I (`PSI-98`) | Small table (5 rows) lacks dynamic spread measurements | Table provides initial boundary conditions only; spread rate ($2.4\text{ mm/s}$) is reported in literature. | Implement dual-source ingestion: table for `FuelSpec`/`EnvironmentalConditions`, paper for `MeasurementRecord`. | **RESOLVED ARCHITECTURALLY** |
| **BLK-05** | BASS-II (`PSI-25`) | `Fan display` is an uncalibrated instrument index | Cannot directly map `Fan display` column to `flow_velocity_cm_s` without calibration curve. | Ingestion parser must retain raw fan index in `raw_value` and require calibration formula before populating `normalized_value`. | **CONTRACT CONFIRMED** |

---

## 10. Conclusion & Next Steps

Phase 0.95 establishes grounded empirical realism for FIRELINE's ingestion architecture. We now know the exact size, structure, DOIs, licensing, and column contents of the official NASA PSI portal assets.

In accordance with competition boundaries, all activities remain strictly pre-event research and preparation. Software development remains on standby until November 14, 2026.
