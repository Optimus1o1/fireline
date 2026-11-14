# FIRELINE Data Dictionary & Schema Specification

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall  
**Agency:** Moon Sanctum Labs (*Decode. Build. Evolve.*)  
**Lead Developer:** Aniket Nandi (Kolkata, IST)  
**Status:** Complete / Validated Baseline  
**Revision:** v1.0.0

---

## 1. Overview

This document specifies the exact schemas, data types, physical units, nullability constraints, and source mappings for all data structures utilized within the FIRELINE application. Every data model is formally implemented as a Pydantic V2 model in `backend/src/fireline_data/contracts/` and mirrored as TypeScript interfaces in `src/lib/types.ts`.

---

## 2. Core Entities

### 2.1 `EvidenceRecord` (Empirical Flight Run)
Represents a single, experimentally verified microgravity combustion test executed aboard a spacecraft or space station facility.

| Field Name | Type | Unit | Nullable? | Description & Allowed Values | Source Mapping |
|:---|:---|:---|:---|:---|:---|
| `id` | `string` | — | No | Unique canonical run identifier (e.g., `PSI98-F1C1/F1C2`, `PSI25-B1`) | NASA PSI Run ID |
| `investigation` | `string` | — | No | NASA PSI investigation designation (`Saffire-I`, `BASS-II`, `FLEX`) | PSI Repository ID |
| `dataset_id` | `string` | — | No | Official PSI dataset accession code (`PSI-98`, `PSI-25`, `PSI-69`) | PSI Accession Code |
| `artifact_id` | `string` | — | No | Exact source artifact file name (e.g., `PSI98-ART-002`, `PSI25-ART-002`) | PSI File Identifier |
| `test_date` | `string` | ISO 8601 | Yes | Date on which the flight experiment was ignited (`YYYY-MM-DD`) | Telemetry timestamp |
| `material` | `string` | — | No | Fuel material name (e.g., `SIBAL`, `PMMA`) | Specimen label |
| `material_family` | `string` | — | No | Categorical fuel family (`Cellulosic Blend`, `Thermoplastic`, `Liquid Hydrocarbon`) | Material taxonomy |
| `geometry` | `string` | — | No | Sample physical form factor (`Flat Fabric Sheet`, `Flat Sheet`, `Cylindrical Rod`, `Droplet`) | Specimen specification |
| `thickness_mm` | `float` | mm | Yes | Specimen physical thickness (e.g., $0.05\text{ mm}$ for BASS thin film, $10.0\text{ mm}$ for thick PMMA) | Specimen dimensions |
| `width_mm` | `float` | mm | Yes | Specimen lateral width in millimeters | Specimen dimensions |
| `length_mm` | `float` | mm | Yes | Specimen total axial length in millimeters | Specimen dimensions |
| `oxygen_pct` | `float` | % mole fraction | No | Oxidizer oxygen volumetric percentage ($0.0 \le \% \le 100.0$) | Cabin/duct gas analyzer |
| `pressure_kpa` | `float` | kPa | No | Ambient atmospheric chamber pressure ($P > 0.0$) | Chamber pressure sensor |
| `flow_velocity_cms` | `float` | cm/s | Yes | Forced convective gas flow velocity; `null` for quiescent tests or uncalibrated fans | Flow duct anemometer |
| `burn_orientation` | `string` | — | No | Aerodynamic flow relative to spread (`Opposed`, `Concurrent`, `Quiescent`) | Ignition setup |
| `flame_spread_rate_mms` | `float` | mm/s | Yes | Measured steady-state flame spread velocity; `null` if unmeasured | Optical video analysis |
| `burning_rate_constant_mm2s`| `float` | $\text{mm}^2/\text{s}$ | Yes | $d^2$-law burning rate constant (droplet combustion); `null` for solids | Droplet video tracking |
| `extinction_limit_pct` | `float` | % $\text{O}_2$ | Yes | Extinction oxygen limit at test condition; `null` if run did not extinguish | Extinction test result |
| `fan_display_index` | `int` | dial index | Yes | Raw BASS-II fan display dial setting (`47–62`); preserved raw per `DEC-04` | Fan controller display |
| `source_url` | `string` | URL | No | Direct URL link to primary NASA PSI investigation record | `https://psi.nasa.gov/...` |
| `doi` | `string` | DOI | Yes | Primary publication Digital Object Identifier | Peer-reviewed paper DOI |
| `audit_status` | `string` | — | No | Verification status (`VERIFIED_EMPIRICAL`, `BOUNDARY_GATED`) | Audit pipeline status |
| `sha256_hash` | `string` | Hex | No | SHA-256 cryptographic checksum of raw data record | Pipeline integrity audit |

---

### 2.2 `AuditedFinding` (Peer-Reviewed Scientific Claim)
Represents a vetted scientific finding extracted from peer-reviewed combustion literature linked to NASA PSI experiments.

| Field Name | Type | Nullable? | Description | Example |
|:---|:---|:---|:---|:---|
| `finding_id` | `string` | No | Canonical finding identifier (`SAFFIRE-001` to `SAFFIRE-007`, `BASS-001` to `BASS-010`, `FLEX-001` to `FLEX-003`) | `SAFFIRE-001` |
| `investigation` | `string` | No | NASA Investigation name | `Saffire-I` |
| `claim` | `string` | No | Concise scientific assertion | SIBAL fabric flame spread rate under 20 cm/s flow |
| `empirical_value` | `string` | No | Exact measured value with units | `0.45 mm/s` |
| `uncertainty` | `string` | Yes | Reported measurement uncertainty | `± 0.05 mm/s` |
| `epistemic_status`| `string` | No | Epistemic validation tier (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`) | `SUPPORTED` |
| `citation` | `string` | No | Formal literature citation | `Urban et al. (2019)` |
| `doi` | `string` | Yes | Digital Object Identifier | `10.1016/j.combustflame.2019.04.015` |
| `notes` | `string` | Yes | Contextual physical details, chamber dimensions, or derivation basis | Saffire flow duct test |

---

### 2.3 `MissionScenario` (Spacecraft Habitat Atmosphere)
Defines an operational human spaceflight habitat or vehicle atmospheric profile.

| Field Name | Type | Unit | Description | Preset Values |
|:---|:---|:---|:---|:---|
| `id` | `string` | — | Unique mission scenario identifier | `iss_nominal`, `artemis_lunar`, `mars_habitat`, `deep_space_transit` |
| `name` | `string` | — | Full display title | Artemis Lunar Habitat (Exploration Atmosphere) |
| `oxygen_pct` | `float` | % | Ambient oxygen concentration | ISS: $21.0\%$, Artemis: $34.0\%$, Mars: $28.0\%$ |
| `pressure_kpa` | `float` | kPa | Total cabin atmospheric pressure | ISS: $101.3$, Artemis: $56.5$, Mars: $70.3$ |
| `flow_velocity_cms` | `float` | cm/s | Cabin forced ventilation airflow velocity | ISS: $10.0$, Artemis: $15.0$, Mars: $8.0$ |
| `gravity_level_g` | `float` | g | Acceleration environment | ISS/Transit: $0.0\text{ g}$, Artemis: $0.166\text{ g}$, Mars: $0.38\text{ g}$ |
| `target_materials` | `list[str]` | — | Representative materials present in cabin | `["Nomex", "SIBAL", "Polycarbonate", "PMMA"]` |
| `rationale` | `string` | — | Environmental design rationale | Reduced pre-breathe time for lunar EVAs |

---

### 2.4 `ComparisonAnalysis` (7-Gate Comparability Result)
The output of comparing two experimental flight records through the physical comparability engine.

| Field Name | Type | Description |
|:---|:---|:---|
| `record_a_id` | `string` | Identifier of the first empirical record |
| `record_b_id` | `string` | Identifier of the second empirical record |
| `overall_classification` | `string` | `FULLY_COMPARABLE`, `CONDITIONALLY_COMPARABLE`, `INCOMPARABLE`, `CONFLICTING` |
| `gates` | `list[GateResult]` | Individual evaluation of the 7 thermodynamic gates |
| `explanation` | `string` | Detailed physical synthesis explaining why the records can or cannot be scaled |
| `scaling_notes` | `string` | Mathematical and physical scaling considerations (e.g., Damköhler number scaling) |

Each `GateResult` contains:
- `gate_name`: `Regime`, `Material`, `Geometry`, `FlowVelocity`, `Pressure`, `Oxygen`, `BurnOrientation`
- `status`: `PASSED`, `FAILED`, `WARNING`
- `difference_description`: Quantitative delta between runs
- `tolerance_applied`: Scientific tolerance threshold applied

---

### 2.5 `AssessmentResult` (Mission Gap Analysis)
The output produced by evaluating a mission scenario against the empirical database.

| Field Name | Type | Description |
|:---|:---|:---|
| `scenario_id` | `string` | Evaluated scenario identifier |
| `overall_coverage_pct`| `float` | Algorithmic percentage of parameters covered by empirical data ($0\text{--}100\%$) |
| `coverage_by_parameter`| `dict` | Breakdown of coverage for Oxygen, Pressure, Flow, and Material |
| `identified_gaps` | `list[EvidenceGap]` | List of identified microgravity empirical voids |
| `matched_records` | `list[string]` | Nearest empirical runs available in the database |
| `recommendations` | `list[string]` | Prioritized research and testing recommendations to close gaps |

Each `EvidenceGap` contains:
- `parameter`: Parameter lacking empirical precedent (e.g., `Hypobaric Hyperoxia`)
- `mission_value`: Value required by mission architecture ($34\%\ \text{O}_2,\ 56.5\text{ kPa}$)
- `empirical_range`: Range tested in NASA microgravity ($16\text{--}21\%\ \text{O}_2,\ 97\text{--}101\text{ kPa}$)
- `gap_severity`: `CRITICAL`, `HIGH`, `MODERATE`, `LOW`
- `physical_impact`: Thermodynamic consequences (e.g., elevated flame temperature, accelerated ignition kinetics)

---

## 3. Engineering Decisions & Constraints

- **`DEC-01` (Null Representation):** Missing empirical values MUST remain `null` in JSON and `None` in Python. Never substitute `0.0`, as zero represents a physically distinct condition (e.g., quiescent zero flow).
- **`DEC-02` (FLEX Scope):** Droplet combustion data from FLEX (`PSI-69`) is currently represented via 3 audited findings (`FLEX-001`, `FLEX-002`, `FLEX-003`). Droplet tabular records are held in reserve until multi-phase droplet geometry contracts are unified.
- **`DEC-03` (Canonical Designation):** Run `PSI98-F1C1/F1C2` designates the Saffire-I multi-camera flow visualization experiment and must not be split into disparate run keys.
- **`DEC-04` (Uncalibrated Fan Dial):** BASS-II fan settings (`47–62`) are stored strictly as `fan_display_index` and MUST NOT be converted to velocities without published NASA calibration tables.
- **`DEC-05` (Chamber Pressure Surges):** Saffire-I transient pressure rises are explicitly partitioned: $\Delta P \approx 3.8\text{ kPa}$ is tagged as a derived combustion model estimate (`SAFFIRE-006`), whereas $0.5\text{ kPa}$ is tagged as unverified telemetry (`SAFFIRE-009`).

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
