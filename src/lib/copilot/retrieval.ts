import { EvidenceRecord } from '@/types/evidence';
import { AuditedFinding, RetrievedEvidenceItem } from './types';
import empiricalRecords from '@/data/empirical_records.json';
import auditedFindings from '@/data/audited_findings.json';

export class CopilotRetriever {
  private static empirical: EvidenceRecord[] = empiricalRecords as EvidenceRecord[];
  private static findings: AuditedFinding[] = auditedFindings as AuditedFinding[];

  /**
   * Deterministically retrieves and ranks evidence items matching the researcher's query.
   */
  public static retrieve(
    question: string,
    options?: {
      investigationIds?: string[];
      selectedEvidenceIds?: string[];
      missionPreset?: string | null;
      limit?: number;
    }
  ): RetrievedEvidenceItem[] {
    const q = question.toLowerCase().trim();
    const items: RetrievedEvidenceItem[] = [];
    const limit = options?.limit || 6;

    // 1. Convert Empirical Records to Retrieved Items
    for (const rec of this.empirical) {
      if (rec.isSynthetic) continue;

      let score = 0;
      const recId = rec.runId;
      const invId = rec.investigationId;
      const mat = rec.material.toLowerCase();
      const geom = rec.geometry.toLowerCase();

      if (options?.investigationIds && options.investigationIds.length > 0) {
        if (!options.investigationIds.includes(invId)) continue;
      }

      if (options?.selectedEvidenceIds && options.selectedEvidenceIds.includes(rec.id)) {
        score += 20;
      }

      if (q.includes(recId.toLowerCase())) score += 15;
      if (q.includes(invId.toLowerCase())) score += 8;
      if (q.includes(mat) || mat.split(' ').some((w) => w.length > 3 && q.includes(w))) score += 7;
      if (q.includes(geom)) score += 5;
      if (q.includes('pmma') && mat.includes('pmma')) score += 8;
      if (q.includes('sibal') && mat.includes('sibal')) score += 8;
      if (q.includes('thin') && geom.includes('thin')) score += 6;
      if (q.includes('fan') || q.includes('flow') || q.includes('speed')) {
        if (rec.environmentalConditions.fanDisplayIndex !== null || rec.environmentalConditions.flowVelocityCmS !== null) {
          score += 6;
        }
      }
      if (q.includes('iss') && invId === 'PSI-25') score += 4;
      if (q.includes('saffire') && invId === 'PSI-98') score += 8;
      if (q.includes('bass') && invId === 'PSI-25') score += 8;

      if (score > 0) {
        items.push({
          evidenceId: rec.runId, // Stable citation ID like PSI98-S1 or PSI25-B1
          category: 'EXPERIMENTAL_RECORD',
          investigationId: rec.investigationId,
          title: `${rec.investigationTitle}: Run ${rec.runId}`,
          statementOrDescription: `Specimen configuration: ${rec.material} (${rec.geometry}), reported thickness: ${rec.dimensions.thicknessRaw || 'None'}, ambient pressure: ${rec.environmentalConditions.pressureKpa} kPa, oxygen: ${rec.environmentalConditions.oxygenRaw || '21%'}.`,
          sourceArtifactOrDoi: rec.sourceArtifact,
          sourceLocation: `Row #${rec.sourceRowNumber}`,
          sourceUrl: rec.sourceUrl,
          dispositionOrStatus: rec.disposition,
          conditionsSummary: `Pressure: ${rec.environmentalConditions.pressureKpa} kPa | O2: ${rec.environmentalConditions.oxygenRaw || '21%'} | Flow: ${rec.environmentalConditions.isFlowUncalibrated ? `Fan Index ${rec.environmentalConditions.fanDisplayIndex}` : `${rec.environmentalConditions.flowVelocityCmS} cm/s`}`,
          limitations: rec.discrepancyWarnings.join('; ') || 'Specimen initial conditions only; dynamic spread rates not in table.',
          relevanceScore: score,
        });
      }
    }

    // 2. Convert Audited Scientific Findings to Retrieved Items
    for (const find of this.findings) {
      let score = 0;
      const cid = find.claimId.toLowerCase();
      const inv = find.investigationId.toLowerCase();
      const text = find.findingStatement.toLowerCase();

      if (options?.investigationIds && options.investigationIds.length > 0) {
        if (find.investigationId !== 'CROSS' && !options.investigationIds.includes(find.investigationId)) {
          continue;
        }
      }

      if (options?.selectedEvidenceIds && options.selectedEvidenceIds.includes(find.claimId)) {
        score += 20;
      }

      if (q.includes(cid)) score += 15;
      if (q.includes(inv)) score += 8;
      if (q.includes('artemis') || q.includes('lunar') || q.includes('habitat') || q.includes('34%')) {
        if (find.claimId === 'CROSS-005' || find.claimId === 'CROSS-004') score += 15;
      }
      if (q.includes('rod') || q.includes('thick') || q.includes('geometry')) {
        if (find.claimId === 'BASS-002' || find.claimId === 'BASS-001' || find.claimId === 'CROSS-001') score += 12;
      }
      if (q.includes('flex') || q.includes('droplet') || q.includes('extinction')) {
        if (find.claimId === 'FLEX-001' || find.claimId === 'FLEX-003' || find.claimId === 'FLEX-004') score += 14;
      }
      if (q.includes('saffire') && find.investigationId === 'PSI-98') score += 8;
      if (q.includes('bass') && find.investigationId === 'PSI-25') score += 8;
      if (q.includes('pressure') && (find.claimId === 'SAFFIRE-002' || find.claimId === 'SAFFIRE-006')) score += 10;
      if (q.includes('quench') && find.claimId === 'BASS-002') score += 10;
      if ((q.includes('spread') || q.includes('rate')) && find.claimId === 'SAFFIRE-004') score += 12;
      if (q.includes('pmma') && (find.claimId === 'SAFFIRE-008' || find.claimId === 'BASS-002')) score += 10;

      // Keyword density
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      for (const w of words) {
        if (text.includes(w)) score += 3;
      }

      if (score > 0) {
        items.push({
          evidenceId: find.claimId,
          category: 'AUDITED_FINDING',
          investigationId: find.investigationId,
          title: `${find.investigationTitle}: Claim ${find.claimId}`,
          statementOrDescription: find.findingStatement,
          sourceArtifactOrDoi: find.sourcePublication + (find.doi ? ` (DOI: ${find.doi})` : ''),
          sourceLocation: find.sourceLocation,
          sourceUrl: find.doi ? `https://doi.org/${find.doi}` : undefined,
          dispositionOrStatus: find.auditDisposition,
          conditionsSummary: find.applicableConditions,
          limitations: find.limitations,
          relevanceScore: score,
        });
      }
    }

    // Sort descending by relevance score and cap at limit
    return items.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
  }
}
