import { EvidenceRecord } from '@/types/evidence';

export type EpistemicClassification = 'SUPPORTED' | 'INFERRED' | 'EVIDENCE_GAP';

export interface AuditedFinding {
  claimId: string;
  investigationId: string;
  investigationTitle: string;
  findingStatement: string;
  auditDisposition: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'CONTRADICTED' | 'UNVERIFIED' | 'DERIVED_ESTIMATE' | 'EVIDENCE_GAP';
  sourcePublication: string;
  doi?: string;
  sourceLocation: string; // e.g. "Section 4.2, Figure 6"
  applicableConditions: string;
  limitations: string;
}

export interface UnresolvedResearchQuestion {
  questionId: string;
  investigationId: string;
  question: string;
  physicalPhenomenon: string;
  missingDataRequired: string;
}

export interface RetrievedEvidenceItem {
  evidenceId: string;
  category: 'EXPERIMENTAL_RECORD' | 'AUDITED_FINDING' | 'RESEARCH_QUESTION';
  investigationId: string;
  title: string;
  statementOrDescription: string;
  sourceArtifactOrDoi: string;
  sourceLocation: string;
  sourceUrl?: string;
  dispositionOrStatus: string;
  conditionsSummary: string;
  limitations: string;
  relevanceScore: number;
}

export interface CopilotFinding {
  statement: string;
  evidenceIds: string[];
}

export interface CopilotCitation {
  evidenceId: string;
  sourceTitle: string;
  sourceLocation: string;
  sourceUrl?: string;
}

export interface CopilotResponsePayload {
  classification: EpistemicClassification;
  summary: string;
  keyFindings: CopilotFinding[];
  interpretation: string;
  limitations: string[];
  missingInformation: string[];
  citations: CopilotCitation[];
  providerMode: 'GEMINI' | 'DETERMINISTIC';
  discrepancyWarnings?: string[];
  suggestedFollowUps?: string[];
}
