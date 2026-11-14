import { RetrievedEvidenceItem, CopilotCitation } from './types';

export class CitationValidator {
  /**
   * Validates citations against the retrieved evidence allowlist.
   * Rejects any citation not explicitly present in the retrieved context.
   */
  public static validateCitations(
    citedIds: string[],
    retrievedItems: RetrievedEvidenceItem[]
  ): { validCitations: CopilotCitation[]; invalidIds: string[] } {
    const validCitations: CopilotCitation[] = [];
    const invalidIds: string[] = [];

    const itemMap = new Map<string, RetrievedEvidenceItem>();
    for (const item of retrievedItems) {
      itemMap.set(item.evidenceId.toUpperCase(), item);
    }

    for (const rawId of citedIds) {
      const cleanId = rawId.trim().toUpperCase();
      const match = itemMap.get(cleanId);
      if (match) {
        validCitations.push({
          evidenceId: match.evidenceId,
          sourceTitle: match.sourceArtifactOrDoi,
          sourceLocation: match.sourceLocation,
          sourceUrl: match.sourceUrl,
        });
      } else {
        invalidIds.push(rawId);
      }
    }

    return { validCitations, invalidIds };
  }
}
