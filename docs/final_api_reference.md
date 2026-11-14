# FIRELINE REST API Reference Specification

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall  
**Agency:** Moon Sanctum Labs (*Decode. Build. Evolve.*)  
**Lead Developer:** Aniket Nandi (Kolkata, IST)  
**Base URL:** `http://localhost:3000` (Local) / `https://fireline-nasa.vercel.app` (Production)  
**Version:** v1.0.0

---

## 1. Overview

The FIRELINE API delivers high-performance, deterministic access to validated NASA Physical Sciences Informatics (PSI) combustion data, physical comparability logic, mission environmental gap assessments, and grounded SI copilot intelligence.

### Standard Response Headers
```http
Content-Type: application/json; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=59
```

---

## 2. API Endpoints

### 2.1 `GET /api/investigations`
Retrieves metadata and status for all NASA Physical Sciences Informatics (PSI) investigations indexed by the engine.

#### Query Parameters
*None.*

#### Response (`200 OK`)
```json
{
  "investigations": [
    {
      "id": "saffire-1",
      "name": "Saffire-I (PSI-98)",
      "full_name": "Spacecraft Fire Safety Demonstration Project - Flight 1",
      "platform": "Cygnus Pressurized Cargo Module",
      "records_count": 4,
      "findings_count": 7,
      "primary_material": "SIBAL (Cotton/Fiberglass blend), PMMA",
      "status": "VERIFIED_EMPIRICAL"
    },
    {
      "id": "bass-2",
      "name": "BASS-II (PSI-25)",
      "full_name": "Burning and Suppression of Solids - II",
      "platform": "ISS Microgravity Science Glovebox (MSG)",
      "records_count": 5,
      "findings_count": 10,
      "primary_material": "Cast PMMA thin films",
      "status": "VERIFIED_EMPIRICAL"
    },
    {
      "id": "flex",
      "name": "FLEX (PSI-69)",
      "full_name": "Flame Extinction Experiment",
      "platform": "ISS Combustion Integrated Rack (CIR)",
      "records_count": 0,
      "findings_count": 3,
      "primary_material": "Heptane / Methanol droplets",
      "status": "BOUNDARY_GATED"
    }
  ]
}
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/investigations"
```

---

### 2.2 `GET /api/evidence/search`
Performs deterministic, multi-parameter keyword and faceted search across empirical flight records.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
|:---|:---|:---|:---|:---|
| `q` | `string` | No | Search query matching material, run ID, or regime | `sibal` |
| `investigation` | `string` | No | Filter by investigation (`Saffire-I`, `BASS-II`) | `Saffire-I` |
| `material` | `string` | No | Filter by material (`SIBAL`, `PMMA`) | `PMMA` |
| `min_o2` | `float` | No | Minimum oxygen percentage | `16.0` |
| `max_o2` | `float` | No | Maximum oxygen percentage | `21.0` |
| `limit` | `int` | No | Max records to return (default: `20`) | `10` |

#### Response (`200 OK`)
```json
{
  "total": 1,
  "records": [
    {
      "id": "PSI98-F1C1/F1C2",
      "investigation": "Saffire-I",
      "dataset_id": "PSI-98",
      "material": "SIBAL",
      "geometry": "Flat Fabric Sheet",
      "thickness_mm": 0.4,
      "width_mm": 400.0,
      "length_mm": 940.0,
      "oxygen_pct": 21.0,
      "pressure_kpa": 100.0,
      "flow_velocity_cms": 20.0,
      "burn_orientation": "Opposed",
      "flame_spread_rate_mms": 0.45,
      "fan_display_index": null,
      "audit_status": "VERIFIED_EMPIRICAL",
      "doi": "10.1016/j.combustflame.2019.04.015"
    }
  ]
}
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/evidence/search?q=sibal&investigation=Saffire-I"
```

---

### 2.3 `GET /api/evidence/[id]`
Retrieves the complete data record, measurement telemetry, physical parameters, and provenance audit for a single NASA run.

#### Path Parameters
- `id` (`string`, required): Canonical NASA PSI run identifier (e.g., `PSI98-F1C1/F1C2`, `PSI25-B1`). Note: Forward slashes in IDs should be URL encoded (`PSI98-F1C1%2FF1C2`).

#### Response (`200 OK`)
```json
{
  "record": {
    "id": "PSI25-B1",
    "investigation": "BASS-II",
    "dataset_id": "PSI-25",
    "artifact_id": "PSI25-ART-002",
    "test_date": "2014-04-12",
    "material": "PMMA",
    "material_family": "Thermoplastic",
    "geometry": "Flat Sheet",
    "thickness_mm": 0.05,
    "width_mm": 10.0,
    "length_mm": 100.0,
    "oxygen_pct": 20.9,
    "pressure_kpa": 101.3,
    "flow_velocity_cms": null,
    "burn_orientation": "Opposed",
    "flame_spread_rate_mms": 1.2,
    "extinction_limit_pct": 16.3,
    "fan_display_index": 62,
    "source_url": "https://psi.nasa.gov/investigation/BASS-II",
    "doi": "NASA/TM-2017-219504",
    "audit_status": "VERIFIED_EMPIRICAL",
    "sha256_hash": "a4f8d29b7c1e55648f..."
  },
  "linked_findings": [
    {
      "finding_id": "BASS-001",
      "claim": "Extinction boundary for thin PMMA in opposed microgravity flow",
      "empirical_value": "16.3% O2",
      "epistemic_status": "SUPPORTED",
      "citation": "Olson & Ferkul (2017)"
    }
  ]
}
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/evidence/PSI25-B1"
```

---

### 2.4 `POST /api/evidence/compare`
Evaluates two empirical runs through the 7-gate physical comparability matrix.

#### Request Body
```json
{
  "record_a_id": "PSI98-F1C1/F1C2",
  "record_b_id": "PSI25-B1"
}
```

#### Response (`200 OK`)
```json
{
  "record_a_id": "PSI98-F1C1/F1C2",
  "record_b_id": "PSI25-B1",
  "overall_classification": "INCOMPARABLE",
  "gates": [
    {
      "gate_name": "Regime",
      "status": "PASSED",
      "difference_description": "Both runs are solid-phase opposed surface flame spread."
    },
    {
      "gate_name": "Material",
      "status": "FAILED",
      "difference_description": "Material mismatch: SIBAL (cellulosic blend) vs PMMA (acrylic thermoplastic)."
    },
    {
      "gate_name": "Geometry",
      "status": "FAILED",
      "difference_description": "Large dimension & thickness mismatch: 400x940x0.4 mm fabric vs 10x100x0.05 mm film."
    },
    {
      "gate_name": "FlowVelocity",
      "status": "WARNING",
      "difference_description": "Record B uses uncalibrated fan display index (62) while Record A has measured 20 cm/s."
    },
    {
      "gate_name": "Pressure",
      "status": "PASSED",
      "difference_description": "Pressure difference is 1.3 kPa (within 10.0 kPa tolerance)."
    },
    {
      "gate_name": "Oxygen",
      "status": "PASSED",
      "difference_description": "Oxygen difference is 0.1% (within 2.0% tolerance)."
    },
    {
      "gate_name": "BurnOrientation",
      "status": "PASSED",
      "difference_description": "Both tests are opposed-flow spread."
    }
  ],
  "explanation": "These experiments cannot be directly scaled or cross-compared due to critical differences in fuel material pyrolysis chemistry and specimen thermal thickness.",
  "scaling_notes": "SIBAL exhibits char formation and gas-phase pyrolysis, whereas PMMA undergoes pure endothermic depolymerization without char."
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/evidence/compare" \
  -H "Content-Type: application/json" \
  -d '{"record_a_id":"PSI98-F1C1/F1C2","record_b_id":"PSI25-B1"}'
```

---

### 2.5 `POST /api/assess`
Executes an environmental gap assessment of a spaceflight mission scenario against empirical microgravity data.

#### Request Body
```json
{
  "scenario_id": "artemis_lunar"
}
```
*(Or specify custom parameters: `{ "oxygen_pct": 34.0, "pressure_kpa": 56.5, "flow_velocity_cms": 15.0, "gravity_level_g": 0.166 }`)*

#### Response (`200 OK`)
```json
{
  "scenario_id": "artemis_lunar",
  "name": "Artemis Lunar Habitat (Exploration Atmosphere)",
  "overall_coverage_pct": 32.5,
  "coverage_by_parameter": {
    "oxygen": 15.0,
    "pressure": 25.0,
    "flow": 70.0,
    "materials": 20.0
  },
  "identified_gaps": [
    {
      "parameter": "Oxygen Enrichment",
      "mission_value": 34.0,
      "empirical_range": "16.3% - 21.0%",
      "severity": "CRITICAL",
      "physical_impact": "Severe empirical void: NASA microgravity flight tests have only examined normoxic (21%) or hypoxic (<21%) atmospheres. No microgravity data exists for 34% O2, where flame spread rates accelerate by 200-400%."
    },
    {
      "parameter": "Hypobaric Pressure",
      "mission_value": 56.5,
      "empirical_range": "97.9 kPa - 101.4 kPa",
      "severity": "HIGH",
      "physical_impact": "Reduced pressure (56.5 kPa) combined with elevated oxygen alters gas-phase chemical timescales and radiation heat loss."
    }
  ],
  "matched_records": [
    "PSI98-F1C1/F1C2",
    "PSI25-B1"
  ],
  "recommendations": [
    "Prioritize Saffire-IV/V/VI exploration atmosphere flight experiments at 34% O2 and 56.5 kPa.",
    "Do not extrapolate 1-g NASA-STD-6001 flammability limits to lunar exploration cabins.",
    "Conduct parabolic flight testing with lunar partial gravity (0.166 g) under hypobaric hyperoxic conditions."
  ]
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/assess" \
  -H "Content-Type: application/json" \
  -d '{"scenario_id":"artemis_lunar"}'
```

---

### 2.6 `POST /api/copilot/explain`
Conducts grounded scientific inquiry against NASA microgravity combustion findings using the SI Copilot.

#### Request Body
```json
{
  "question": "What is the flame spread rate of SIBAL fabric in Saffire-I under microgravity?",
  "record_ids": ["PSI98-F1C1/F1C2"]
}
```

#### Response (`200 OK`)
```json
{
  "question": "What is the flame spread rate of SIBAL fabric in Saffire-I under microgravity?",
  "answer": "According to Saffire-I experimental run [PSI98-F1C1/F1C2] and peer-reviewed analysis by Urban et al. (2019) [SAFFIRE-001], the flame spread rate of SIBAL fabric (75% cotton / 25% fiberglass) under microgravity with a forced concurrent flow of 20 cm/s in a 21.0% O2, 100.0 kPa atmosphere was measured at 0.45 mm/s (± 0.05 mm/s).",
  "epistemic_status": "SUPPORTED",
  "citations": [
    {
      "citation_id": "SAFFIRE-001",
      "finding_id": "SAFFIRE-001",
      "claim": "SIBAL fabric flame spread rate under 20 cm/s flow",
      "empirical_value": "0.45 mm/s",
      "source": "Urban et al. (2019), Combustion and Flame"
    },
    {
      "citation_id": "PSI98-F1C1/F1C2",
      "run_id": "PSI98-F1C1/F1C2",
      "investigation": "Saffire-I",
      "material": "SIBAL"
    }
  ],
  "validation_passed": true,
  "model_used": "gemini-2.5-flash"
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/copilot/explain" \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the flame spread rate of SIBAL fabric in Saffire-I?"}'
```

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
