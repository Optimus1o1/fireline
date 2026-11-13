-- ==============================================================================
-- FIRELINE - Supabase / PostgreSQL Schema Migration
-- Migration: 20261114000001_initial_hco_schema.sql
-- Baseline: Canonical Harmonized Combustion Ontology (hco_schema_specification.md)
-- Scope: P0 & P1 Entities (Investigations, Runs, Environments, Fuels, Measurements, Findings)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Investigations Table
-- Canonical Entity: Investigation
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id VARCHAR(64) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    lead_scientist TEXT,
    flight_campaign VARCHAR(64) NOT NULL, -- e.g., 'ISS Exp 39/40', 'Cygnus OA-6', 'Drop Tower'
    facility VARCHAR(128) NOT NULL,       -- e.g., 'Combustion Integrated Rack (CIR)', 'Saffire Test Unit'
    description TEXT,
    primary_doi VARCHAR(128),
    psi_collection_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Material Specifications Table
-- Canonical Entity: MaterialSample
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_samples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id VARCHAR(64) UNIQUE NOT NULL,
    common_name VARCHAR(128) NOT NULL,     -- e.g., 'PMMA', 'Cotton-Fiberglass Fabric (Sibal cloth)'
    chemical_formula VARCHAR(128),         -- e.g., '(C5O2H8)n'
    physical_form VARCHAR(64) NOT NULL,    -- 'flat_sheet', 'rod', 'droplet', 'fabric'
    thickness_mm NUMERIC(8, 4),            -- Canonical converted SI (nullable for unmeasured)
    thickness_raw VARCHAR(64),             -- Verbatim reported string (DEC-01 safeguard)
    is_thickness_approximated BOOLEAN DEFAULT FALSE,
    width_mm NUMERIC(8, 4),
    length_mm NUMERIC(8, 4),
    density_g_cm3 NUMERIC(8, 4),
    source_provenance JSONB,               -- Lineage and source page reference
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Experimental Conditions Table
-- Canonical Entity: EnvironmentalCondition
-- Preserves Physical Safeguards & Dual Units
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS environmental_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condition_id VARCHAR(64) UNIQUE NOT NULL,
    -- Atmosphere & Pressure
    oxygen_mole_fraction NUMERIC(6, 4) NOT NULL, -- e.g. 0.2100 (must be > 0)
    inert_gas_type VARCHAR(32) DEFAULT 'N2',
    pressure_kpa NUMERIC(10, 4) NOT NULL,        -- Canonical SI (must be > 0)
    pressure_psia_raw NUMERIC(10, 4),            -- Verbatim reported unit
    temperature_k NUMERIC(8, 2) DEFAULT 298.15,
    -- Flow Velocity & Gravity
    flow_velocity_cm_s NUMERIC(8, 4),            -- Converted SI (nullable if uncalibrated)
    flow_velocity_raw VARCHAR(64),               -- Verbatim reported flow
    fan_display_index INT,                       -- Discrete fan index (DEC-04 safeguard)
    is_flow_uncalibrated BOOLEAN DEFAULT FALSE,
    flow_duct_scale_cm NUMERIC(8, 2),            -- Hydraulic duct width/height for comparability
    gravity_level VARCHAR(32) NOT NULL DEFAULT 'microgravity', -- 'microgravity', 'lunar', 'martian', '1g'
    -- Hard Physical Boundary Constraints
    CONSTRAINT chk_positive_oxygen CHECK (oxygen_mole_fraction > 0 AND oxygen_mole_fraction <= 1.0),
    CONSTRAINT chk_positive_pressure CHECK (pressure_kpa > 0)
);

-- ------------------------------------------------------------------------------
-- 4. Experimental Runs Table
-- Canonical Entity: ExperimentalRun
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experimental_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id VARCHAR(64) UNIQUE NOT NULL,
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE RESTRICT,
    material_sample_id UUID NOT NULL REFERENCES material_samples(id) ON DELETE RESTRICT,
    environmental_condition_id UUID NOT NULL REFERENCES environmental_conditions(id) ON DELETE RESTRICT,
    ignition_source VARCHAR(64),                  -- e.g., 'hot_wire', 'spark', 'laser'
    combustion_outcome VARCHAR(64) NOT NULL,      -- 'sustained_propagation', 'extinction', 'quenched', 'smoldering'
    execution_date TIMESTAMPTZ,
    data_quality_flag VARCHAR(32) DEFAULT 'VERIFIED_EMPIRICAL', -- 'VERIFIED_EMPIRICAL', 'QUARANTINED', 'SYNTHETIC_TEST'
    is_synthetic BOOLEAN DEFAULT FALSE,           -- Quarantine flag for synthetic fixtures
    source_psi_id VARCHAR(64),                    -- e.g., 'PSI-25', 'PSI-98'
    source_artifact_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Empirical Measurements Table
-- Canonical Entity: SensorMeasurement / EmpiricalFinding
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empirical_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES experimental_runs(id) ON DELETE CASCADE,
    metric_type VARCHAR(64) NOT NULL,             -- e.g., 'flame_spread_rate', 'flame_length', 'burn_duration'
    measured_value NUMERIC(12, 6) NOT NULL,       -- Converted SI value (mm/s, mm, s)
    measured_unit VARCHAR(32) NOT NULL,           -- 'mm/s', 'mm', 's'
    raw_value NUMERIC(12, 6),                     -- Verbatim reported number
    raw_unit VARCHAR(32),                         -- e.g., 'in/s', 'cm/s'
    uncertainty_margin NUMERIC(10, 6),
    measurement_method VARCHAR(128),              -- e.g., 'optical_pyrometry', 'video_tracking', 'thermocouple'
    is_extrapolated BOOLEAN DEFAULT FALSE,
    source_table_ref TEXT,                        -- Page/Table citation
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Indexes for High-Performance Search and Gating
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_runs_investigation ON experimental_runs(investigation_id);
CREATE INDEX IF NOT EXISTS idx_runs_outcome ON experimental_runs(combustion_outcome);
CREATE INDEX IF NOT EXISTS idx_runs_synthetic ON experimental_runs(is_synthetic);
CREATE INDEX IF NOT EXISTS idx_env_o2 ON environmental_conditions(oxygen_mole_fraction);
CREATE INDEX IF NOT EXISTS idx_env_pressure ON environmental_conditions(pressure_kpa);
CREATE INDEX IF NOT EXISTS idx_env_flow ON environmental_conditions(flow_velocity_cm_s);
CREATE INDEX IF NOT EXISTS idx_material_name ON material_samples(common_name);

