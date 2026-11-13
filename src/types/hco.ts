/**
 * FIRELINE Domain Types
 * Derived strictly from Canonical Harmonized Combustion Ontology (hco_schema_specification.md)
 * and Phase 1.0 Scope Refinements (docs/phase10_scope_decision.md).
 */

export type CombustionOutcome =
  | 'sustained_propagation'
  | 'extinction'
  | 'quenched'
  | 'smoldering'
  | 'unresolved';

export type QualityFlag =
  | 'VERIFIED_EMPIRICAL'
  | 'QUARANTINED'
  | 'SYNTHETIC_TEST';

export interface Investigation {
  id: string;
  investigationId: string;
  title: string;
  leadScientist?: string;
  flightCampaign: string;
  facility: string;
  description?: string;
  primaryDoi?: string;
  psiCollectionUrl?: string;
}

export interface MaterialSample {
  id: string;
  sampleId: string;
  commonName: string;
  chemicalFormula?: string;
  physicalForm: 'flat_sheet' | 'rod' | 'droplet' | 'fabric';
  thicknessMm?: number | null;
  thicknessRaw?: string | null;
  isThicknessApproximated: boolean;
  widthMm?: number | null;
  lengthMm?: number | null;
  densityGCm3?: number | null;
}

export interface EnvironmentalCondition {
  id: string;
  conditionId: string;
  oxygenMoleFraction: number; // 0.0 - 1.0
  inertGasType: string;       // e.g. 'N2'
  pressureKpa: number;        // SI kPa
  pressurePsiaRaw?: number | null;
  temperatureK: number;
  flowVelocityCmS?: number | null;
  flowVelocityRaw?: string | null;
  fanDisplayIndex?: number | null;
  isFlowUncalibrated: boolean;
  flowDuctScaleCm?: number | null;
  gravityLevel: 'microgravity' | 'lunar' | 'martian' | '1g';
}

export interface EmpiricalMeasurement {
  id: string;
  metricType: 'flame_spread_rate' | 'flame_length' | 'burn_duration' | 'quench_diameter';
  measuredValue: number;
  measuredUnit: string;
  rawValue?: number | null;
  rawUnit?: string | null;
  uncertaintyMargin?: number | null;
  measurementMethod?: string;
  isExtrapolated: boolean;
  sourceTableRef?: string;
}

export interface ExperimentalRun {
  id: string;
  runId: string;
  investigation: Investigation;
  materialSample: MaterialSample;
  environmentalCondition: EnvironmentalCondition;
  ignitionSource?: string;
  combustionOutcome: CombustionOutcome;
  executionDate?: string;
  dataQualityFlag: QualityFlag;
  isSynthetic: boolean;
  sourcePsiId: string;
  sourceArtifactUrl?: string;
  measurements: EmpiricalMeasurement[];
}

