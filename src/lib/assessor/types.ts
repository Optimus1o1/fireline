/**
 * FIRELINE — Evidence-Gap Assessor & Relevance Ranking Types
 * 
 * Epistemic principle: Evaluates empirical evidence availability and retrieval priority.
 * NEVER outputs fire probability, safety certifications, or crew risk scores.
 */

export type GravityRegime = 'microgravity' | 'lunar' | 'martian' | 'terrestrial';
export type FlowDirection = 'concurrent' | 'opposed' | 'quiescent' | 'unspecified';

export type CoverageOutcome =
  | 'EVIDENCE_AVAILABLE'
  | 'PARTIAL_EVIDENCE'
  | 'EVIDENCE_GAP'
  | 'NOT_APPLICABLE'
  | 'UNKNOWN';

export type RelevanceCategory = 'HIGH' | 'PARTIAL' | 'LIMITED' | 'UNAVAILABLE';
export type GapSeverity = 'CRITICAL_GAP' | 'PARTIAL_GAP' | 'COVERED';

export interface MissionScenario {
  id: string;
  name: string;
  description: string;
  gravityRegime: GravityRegime;
  gravity_g: number;
  pressureKpa: number;
  pressurePsia: number;
  oxygenPercent: number;
  flowVelocityCmS: number | null;
  flowDirection: FlowDirection;
  materialTarget: string;
  geometryTarget: string;
  targetPhenomenon: string;
  isUserModified?: boolean;
  notes?: string;
}

export interface ParameterCoverage {
  parameter: string;
  requestedValue: string;
  availableRange: string;
  status: CoverageOutcome;
  differenceDescription: string;
  bestMatchingInvestigation: string;
}

export interface EvidenceGap {
  gapId: string;
  parameterName: string;
  requestedCondition: string;
  availableCondition: string;
  gapSeverity: GapSeverity;
  relevantInvestigation: string;
  explanation: string;
  requiredResearch: string;
  supportingCitations: string[];
}

export interface InvestigationRelevance {
  investigationId: string;
  investigationTitle: string;
  relevanceCategory: RelevanceCategory;
  relevanceScore: number; // 0 to 100 retrieval priority score (NOT fire risk or scientific confidence)
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  incompatibilityWarnings: string[];
  missingMetadata: string[];
  explanation: string;
  relevantRecords: string[];
  relevantClaims: string[];
  limitations: string[];
}

export interface MissionAssessmentResult {
  scenario: MissionScenario;
  overallStatus: CoverageOutcome;
  summary: string;
  investigationRankings: InvestigationRelevance[];
  coverageMatrix: ParameterCoverage[];
  gaps: EvidenceGap[];
  criticalGapsCount: number;
  partialGapsCount: number;
  scientificDisclaimer: string;
  timestamp: string;
}
