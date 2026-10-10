# Harmonized Combustion Ontology (HCO) — Schema Change Proposal
**Milestone**: Phase 0.5 — Engineering Verification  
**Status**: PROPOSED  
**Standard**: NASA Physical Sciences Informatics (PSI) Ingestion Integrity  
**Author**: Lead Scientific Data Engineer & Architecture Team

---

## 1. Motivation & Current Schema Vulnerabilities

The initial draft of the HCO TypeScript schema (`hco_schema_specification.md`) provided a clean conceptual model, but an audit against real NASA PSI datasets revealed critical failure points when handling real-world flight data:

1. **Mandatory Non-Nullable Numerical Fields**:
   * *Problem*: In real PSI investigations, certain environmental variables are unmeasured, uncalibrated, or absent. For example, Saffire-I did not apply external radiant flux ($\dot{q}''_{ext}$); BASS-II flight logs often report thermocouple readings in °C or mV without ambient temperature $T_\infty$ recorded in Kelvin; early droplet runs did not estimate measurement uncertainty.
   * *Risk*: Enforcing strict non-null numbers forces ingestion pipelines to fabricate dummy defaults (e.g., `uncertainty: 0` or `ambient_temp_k: 298.15`), introducing false certainty into scientific calculations.
2. **Lack of Distinction Between Original and Normalized Values**:
   * *Problem*: Real NASA tables report in heterogeneous engineering units (e.g., flow in $ft/min$ or $m/s$, pressure in $psia$ or $torr$, dimensions in inches). The previous schema only stored normalized values, destroying traceability back to the raw CSV/table cell.
3. **No Verification Status on Findings**:
   * *Problem*: A synthetic/mock test record looked identical to a peer-reviewed NASA empirical observation in memory, enabling unverified data to contaminate scientific rankings and evidence gaps.
4. **Heterogeneous Geometry Collapse**:
   * *Problem*: Liquid droplets have initial diameters ($d_0$) and fiber bead diameters ($d_{fiber}$); fabric sheets have areal density ($g/m^2$) and weave composition; cylindrical rods have burn aspect ratios. Collapsing these into a generic `dimensions` map caused loose typing.

---

## 2. Proposed Schema Modifications

### 2.1 Addition of `DataVerificationStatus`
Every record must carry explicit verification tags:
```typescript
export type VerificationLevel = 
  | 'VERIFIED_EMPIRICAL'      // Audited against official NASA PSI table + DOI
  | 'PARTIALLY_VERIFIED'     // Genuine NASA data, but secondary telemetry unconfirmed
  | 'PRELIMINARY_UNAUDITED'   // Automatically ingested from PSI, awaits human audit
  | 'SYNTHETIC_ILLUSTRATIVE'; // Mock/test record; NEVER to be surfaced in production
```

### 2.2 Dual-Representation: Original vs. Normalized Values
To preserve provenance, measurements and environmental conditions store both the raw reported reading and the harmonized standard SI value:
```typescript
export interface ScientificValue<T = number> {
  /** Harmonized SI value used for engine search, distance metrics, and scaling */
  normalized_value: T;
  normalized_unit: string;
  
  /** Exact raw reading parsed from the NASA archive */
  raw_value: number | string | null;
  raw_unit: string | null;
  
  /** Explicit measurement uncertainty (null if not calculated in source) */
  uncertainty?: number | null;
  uncertainty_type?: 'standard_deviation' | 'confidence_interval_95' | 'instrument_tolerance' | 'estimated';
  
  /** Provenance of this specific cell/reading */
  source_column_header?: string;
}
```

### 2.3 Explicit Nullability for Environmental Conditions
Fields that may not exist in a given rig (e.g., radiant flux on BASS-II or forced flow in quiescent CIR droplets) are strictly nullable with reason tags:
```typescript
export interface EnvironmentalConditions {
  gravity_g: ScientificValue<number>;
  pressure_kpa: ScientificValue<number>;
  oxygen_mole_fraction: ScientificValue<number>;
  
  /** Null if quiescent / enclosed droplet (e.g., FLEX) */
  flow_velocity_cm_s: ScientificValue<number> | null;
  
  diluent: 'N2' | 'CO2' | 'He' | 'Ar' | 'mixed' | 'unspecified';
  diluent_fraction?: ScientificValue<number> | null;
  
  /** Null if no external radiative heater present (e.g., BASS-II, Saffire-I) */
  external_radiant_flux_kw_m2?: ScientificValue<number> | null;
  
  /** Null if chamber temperature sensor uncalibrated or omitted */
  ambient_temp_k?: ScientificValue<number> | null;
}
```

### 2.4 Strongly Typed Fuel Geometries
Discriminated unions ensure physical parameters match fuel phase:
```typescript
export interface DropletGeometry {
  geometry_type: 'suspended_droplet' | 'free_floating_droplet';
  initial_diameter_mm: ScientificValue<number>;
  fiber_support_diameter_um?: ScientificValue<number> | null;
}

export interface FlatSampleGeometry {
  geometry_type: 'flat_slab' | 'fabric_sheet';
  thickness_mm: ScientificValue<number>;
  width_mm: ScientificValue<number>;
  length_mm: ScientificValue<number>;
  areal_density_g_m2?: ScientificValue<number> | null;
}

export interface CylindricalGeometry {
  geometry_type: 'cylindrical_rod' | 'tube';
  diameter_mm: ScientificValue<number>;
  length_mm: ScientificValue<number>;
  core_type?: 'solid' | 'hollow';
}

export type FuelGeometrySpec = DropletGeometry | FlatSampleGeometry | CylindricalGeometry;
```

### 2.5 Strict Provenance Audit Trail
```typescript
export interface AuditProvenance {
  psi_investigation_code: string;       // e.g., "PSI-98"
  psi_run_id: string;                   // Official NASA run/sample identifier
  raw_data_archive_path?: string | null;// Exact path inside NASA archive bundle
  source_table_row_index?: number | null;
  peer_reviewed_doi?: string | null;    // Verified DOI
  doi_verification_status: 'VERIFIED_MATCH' | 'UNVERIFIED' | 'NOT_APPLICABLE';
  psi_direct_url: string;
  audit_date: string;                  // ISO 8601 timestamp
  auditor_id: string;                  // Engineer ID or pipeline validator version
}
```

---

## 3. Concrete Example of Missing/Unmeasured Data Representation

Here is how a real BASS-II run is represented without inventing numbers:

```json
{
  "finding_id": "FINDING-BASS2-REAL-01",
  "verification_status": "PRELIMINARY_UNAUDITED",
  "investigation_id": "PSI-25-BASS-II",
  "run_id": "BASS2-TEST-24",
  "claim_statement": "Opposed flame spread rate over cast PMMA flat sheet in 2.2 cm/s forced flow.",
  "phenomenon": "flame_spread_rate",
  "environmental_conditions": {
    "gravity_g": {
      "normalized_value": 0.0,
      "normalized_unit": "g0",
      "raw_value": "microgravity",
      "raw_unit": "platform_status"
    },
    "pressure_kpa": {
      "normalized_value": 101.3,
      "normalized_unit": "kPa",
      "raw_value": 14.69,
      "raw_unit": "psia",
      "source_column_header": "CHAMBER_PRESS_PSIA"
    },
    "oxygen_mole_fraction": {
      "normalized_value": 0.209,
      "normalized_unit": "mole_fraction",
      "raw_value": 20.9,
      "raw_unit": "percent",
      "source_column_header": "O2_PCT"
    },
    "flow_velocity_cm_s": {
      "normalized_value": 2.2,
      "normalized_unit": "cm/s",
      "raw_value": 2.2,
      "raw_unit": "cm/s",
      "source_column_header": "DUCT_VEL_CMS"
    },
    "diluent": "N2",
    "external_radiant_flux_kw_m2": null,
    "ambient_temp_k": null
  },
  "fuel": {
    "material_name": "Clear Cast PMMA",
    "phase": "solid",
    "geometry": {
      "geometry_type": "flat_slab",
      "thickness_mm": {
        "normalized_value": 1.2,
        "normalized_unit": "mm",
        "raw_value": 0.047,
        "raw_unit": "inch"
      },
      "width_mm": {
        "normalized_value": 10.0,
        "normalized_unit": "mm",
        "raw_value": 0.394,
        "raw_unit": "inch"
      },
      "length_mm": {
        "normalized_value": 100.0,
        "normalized_unit": "mm",
        "raw_value": 3.937,
        "raw_unit": "inch"
      }
    },
    "thermally_thin": true
  },
  "quantitative_measurements": [
    {
      "metric_name": "Opposed Flame Spread Rate",
      "metric_symbol": "V_f",
      "normalized_value": 0.068,
      "normalized_unit": "mm/s",
      "raw_value": 0.068,
      "raw_unit": "mm/s",
      "uncertainty": null,
      "uncertainty_type": null,
      "measurement_method": "optical_tracking"
    }
  ],
  "provenance": {
    "psi_investigation_code": "PSI-25",
    "psi_run_id": "BASS2-TEST-24",
    "raw_data_archive_path": "BASS2_flight_data/test24/run24_summary.dat",
    "source_table_row_index": 24,
    "peer_reviewed_doi": "10.1016/j.combustflame.2017.03.001",
    "doi_verification_status": "VERIFIED_MATCH",
    "psi_direct_url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25",
    "audit_date": "2026-10-10T02:40:00Z",
    "auditor_id": "PHASE_05_AUDIT"
  }
}
```

---

## 4. Backward Compatibility & Migration Impact

1. **Database Schema**:
   * Upgrading from the initial non-nullable schema will not cause data loss because no production database has been populated yet.
   * New migrations must enforce `NOT NULL` exclusively on primary keys (`finding_id`, `run_id`, `investigation_id`), `verification_status`, and `provenance.psi_investigation_code`.
2. **Search Engine & Ingestion**:
   * Ingestion parsers map source table column names directly to `raw_value` and `source_column_header`.
   * Standard conversion utilities (e.g., `psia_to_kpa`, `inch_to_mm`) populate `normalized_value`.
3. **Evidence Classifier Ingestion**:
   * Downstream classifier algorithms consume `normalized_value` while explicitly checking for `null` before computing dimensional distances.
