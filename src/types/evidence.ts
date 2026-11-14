/**
 * FIRELINE Investigation and Evidence Record Types
 */

export interface EvidenceRecord {
  id: string;
  investigationId: string;
  investigationTitle: string;
  flightCampaign: string;
  facility: string;
  doi: string;
  runId: string;
  material: string;
  chemicalFormula?: string | null;
  geometry: string; // 'fabric' | 'thin_film' | 'flow_visualization' | 'droplet' | 'cylindrical_rod'
  dimensions: {
    thicknessMm?: number | null;
    thicknessRaw?: string | null;
    isThicknessApproximated?: boolean;
    lengthMm?: number | null;
    widthMm?: number | null;
  };
  environmentalConditions: {
    oxygenMoleFraction?: number | null;
    oxygenRaw?: string | null;
    pressureKpa: number;
    pressurePsiaRaw?: number | null;
    flowVelocityCmS?: number | null;
    fanDisplayIndex?: number | null;
    isFlowUncalibrated: boolean;
    gravityLevel: string;
  };
  measurements: Array<{
    metricType: string;
    value?: number | null;
    unit: string;
    rawValue?: number | string | null;
    rawUnit?: string | null;
  }>;
  validationStatus: string;
  disposition: string;
  notes: string[];
  isSynthetic: boolean;
  sourceArtifact: string;
  sourceUrl: string;
  sourceRowNumber: number;
  discrepancyWarnings: string[];
  relevanceScore?: number;
  relevanceReasons?: string[];
}

export interface InvestigationSummary {
  id: string;
  name: string;
  title: string;
  focus: string;
  campaign: string;
  facility: string;
  doi?: string;
  artifactCount: number;
  recordCount: number;
  status: 'ACTIVE_INDEXED' | 'REPRESENTATIVE_SLICE' | 'DEFERRED_BLOCKED';
  statusLabel: string;
  description: string;
}
