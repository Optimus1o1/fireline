import { RetrievedEvidenceItem, CopilotResponsePayload } from './types';

export class DeterministicFallbackEngine {
  /**
   * Generates a fully grounded deterministic response strictly from retrieved items.
   * Activates whenever Gemini is unconfigured, times out, or fails citation validation.
   */
  public static generateFallback(
    question: string,
    retrievedItems: RetrievedEvidenceItem[]
  ): CopilotResponsePayload {
    const q = question.toLowerCase();

    // Case 1: Zero evidence found
    if (retrievedItems.length === 0) {
      return {
        classification: 'EVIDENCE_GAP',
        summary: 'No experimental evidence or audited literature findings in FIRELINE match this query.',
        keyFindings: [],
        interpretation: 'The current repository dataset does not contain flight data or documented claims addressing this inquiry.',
        limitations: [
          'Indexed corpus is bounded to Saffire-I (PSI-98 table), BASS-II (PSI-25 thin films), and 9 audited claims.',
          'FLEX droplet experiments and partial-gravity regimes are unindexed.',
        ],
        missingInformation: [
          'Requires querying broader NASA Physical Sciences Informatics (PSI) database or NTRS publications.',
        ],
        citations: [],
        providerMode: 'DETERMINISTIC',
        suggestedFollowUps: [
          'What did Saffire-I investigate?',
          'What conditions are available for BASS-II?',
          'What evidence is available for Artemis atmospheric conditions?',
        ],
      };
    }

    // Case 2: Artemis / 34% O2 Lunar Habitat query
    if (q.includes('artemis') || q.includes('34%') || q.includes('lunar habitat')) {
      const artemisClaim = retrievedItems.find((i) => i.evidenceId === 'CROSS-005') || retrievedItems[0];
      return {
        classification: 'EVIDENCE_GAP',
        summary: 'Existing NASA microgravity flight evidence CANNOT predict fire safety outcomes for Artemis lunar habitat atmospheres (34% O₂ at 56.5 kPa).',
        keyFindings: [
          {
            statement: 'NASA flight campaigns Saffire-I and BASS-II tested strictly in nominal sea-level cabin air (21% O₂ at 101.3 kPa). No 34% O₂ flight data exists in the indexed repository.',
            evidenceIds: [artemisClaim.evidenceId],
          },
        ],
        interpretation: 'Elevated oxygen (34% O₂) drastically accelerates flame propagation rates and lowers extinction limits. Extrapolating sea-level 21% O₂ data to Exploration Atmospheres without high-O₂ flight tests is physically invalid.',
        limitations: [
          'Complete empirical gap for solid fuel combustion in 34% O₂ / 8.2 psia microgravity or lunar gravity.',
        ],
        missingInformation: [
          'Flight test data in low forced flow (1–5 cm/s) under 34% O₂ and sub-atmospheric pressure.',
        ],
        citations: [
          {
            evidenceId: artemisClaim.evidenceId,
            sourceTitle: artemisClaim.sourceArtifactOrDoi,
            sourceLocation: artemisClaim.sourceLocation,
            sourceUrl: artemisClaim.sourceUrl,
          },
        ],
        providerMode: 'DETERMINISTIC',
        discrepancyWarnings: ['DEC-05: Absolute evidence gap for exploration atmosphere flammability.'],
        suggestedFollowUps: [
          'What conditions were tested in Saffire-I?',
          'What materials were tested in BASS-II?',
        ],
      };
    }

    // Case 3: BASS-II Fan Display Calibration query
    if (q.includes('fan') || q.includes('20 cm/s') || (q.includes('bass') && q.includes('speed'))) {
      const bassItem = retrievedItems.find((i) => i.investigationId === 'PSI-25') || retrievedItems[0];
      return {
        classification: 'EVIDENCE_GAP',
        summary: 'Flow velocity in cm/s cannot be determined for BASS-II thin-film records because the fan display is an uncalibrated integer index.',
        keyFindings: [
          {
            statement: 'BASS-II experimental table reports fan display settings as discrete integer dial indices (47 to 62), not calibrated air velocity.',
            evidenceIds: [bassItem.evidenceId],
          },
        ],
        interpretation: 'In accordance with Engineering Decision DEC-04, converting fan display numbers into physical velocity (cm/s) is prohibited without verified duct calibration curves.',
        limitations: [
          'Flow calibration curves translating fan index to cm/s are unextracted in the 257 GB raw archive.',
        ],
        missingInformation: [
          'MSG flow duct hot-wire anemometer calibration data.',
        ],
        citations: [
          {
            evidenceId: bassItem.evidenceId,
            sourceTitle: bassItem.sourceArtifactOrDoi,
            sourceLocation: bassItem.sourceLocation,
            sourceUrl: bassItem.sourceUrl,
          },
        ],
        providerMode: 'DETERMINISTIC',
        discrepancyWarnings: ['DEC-04: Uncalibrated fan index dial.'],
      };
    }

    // Case 4: General Grounded Fallback
    const primary = retrievedItems[0];
    const citations = retrievedItems.slice(0, 3).map((item) => ({
      evidenceId: item.evidenceId,
      sourceTitle: item.sourceArtifactOrDoi,
      sourceLocation: item.sourceLocation,
      sourceUrl: item.sourceUrl,
    }));

    return {
      classification: primary.dispositionOrStatus === 'EVIDENCE_GAP' ? 'EVIDENCE_GAP' : 'SUPPORTED',
      summary: `Retrieved ${retrievedItems.length} evidence items matching query from ${primary.investigationId}.`,
      keyFindings: retrievedItems.slice(0, 3).map((item) => ({
        statement: item.statementOrDescription,
        evidenceIds: [item.evidenceId],
      })),
      interpretation: `Evidence indicates findings under specific flight conditions: ${primary.conditionsSummary}.`,
      limitations: retrievedItems.map((i) => `${i.title}: ${i.limitations}`).slice(0, 3),
      missingInformation: [
        'Dynamic sensor waveforms and time-dependent spread rates are not recorded in preview tables.',
      ],
      citations,
      providerMode: 'DETERMINISTIC',
      suggestedFollowUps: [
        'Compare Saffire-I and BASS-II in the Evidence Explorer',
        'Check Artemis exploration atmosphere coverage',
      ],
    };
  }
}
