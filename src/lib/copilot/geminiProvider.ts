import { GoogleGenAI, Type, Schema } from '@google/genai';
import { RetrievedEvidenceItem, CopilotResponsePayload } from './types';
import { CitationValidator } from './citationValidator';
import { DeterministicFallbackEngine } from './fallback';

export class GeminiCopilotProvider {
  /**
   * Calls Gemini via @google/genai SDK using structured outputs,
   * with automated server-side citation validation and deterministic fallback.
   */
  public static async answerQuestion(
    question: string,
    retrievedItems: RetrievedEvidenceItem[]
  ): Promise<CopilotResponsePayload> {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // If API key is missing or blank, seamlessly activate deterministic engine
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-gemini-api-key')) {
      return DeterministicFallbackEngine.generateFallback(question, retrievedItems);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Construct grounded context block
      const contextString = retrievedItems
        .map(
          (item) => `[ID: ${item.evidenceId}] (${item.category})
Investigation: ${item.investigationId}
Title: ${item.title}
Data: ${item.statementOrDescription}
Conditions: ${item.conditionsSummary}
Source: ${item.sourceArtifactOrDoi} | Location: ${item.sourceLocation}
Status: ${item.dispositionOrStatus}
Limitations: ${item.limitations}`
        )
        .join('\n\n');

      const systemInstruction = `You are the FIRELINE Super Intelligence (SI) Copilot for NASA microgravity combustion research.
Analyze the user's research question STRICTLY based on the retrieved NASA evidence provided below.

CRITICAL SCIENTIFIC INTEGRITY INVARIANTS:
1. ONLY make factual statements supported by the provided evidence IDs.
2. NEVER invent experimental numbers, flight runs, or fake citations.
3. Every factual point in "keyFindings" MUST include the exact evidenceId(s) supporting it.
4. If the retrieved evidence does not contain the answer, or if asked to extrapolate to untested conditions (e.g. 34% O2 lunar habitat, partial gravity), you MUST set classification to "EVIDENCE_GAP".
5. Distinguish specimen metadata from dynamic flame spread measurements.
6. Do NOT fabricate numerical fire risk percentages or safety predictions.
7. Available evidence items:
${contextString}`;

      // Define structured output schema using @google/genai Types
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            enum: ['SUPPORTED', 'INFERRED', 'EVIDENCE_GAP'],
            description: 'Epistemic certainty level of the answer.',
          },
          summary: {
            type: Type.STRING,
            description: 'Concise executive summary of the scientific answer.',
          },
          keyFindings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statement: { type: Type.STRING },
                evidenceIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exact evidence IDs from context supporting this statement.',
                },
              },
              required: ['statement', 'evidenceIds'],
            },
          },
          interpretation: {
            type: Type.STRING,
            description: 'Scientific interpretation grounded in the physics of the evidence.',
          },
          limitations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          missingInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestedFollowUps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'classification',
          'summary',
          'keyFindings',
          'interpretation',
          'limitations',
          'missingInformation',
        ],
      };

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [{ text: `Research Question: ${question}` }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.1, // Near-zero temperature for maximum grounding
        },
      });

      let responseText: string | undefined;
      if (typeof (response as any).text === 'function') {
        responseText = (response as any).text();
      } else if (typeof (response as any).text === 'string') {
        responseText = (response as any).text;
      }
      if (!responseText) {
        return DeterministicFallbackEngine.generateFallback(question, retrievedItems);
      }

      const parsed = JSON.parse(responseText);

      // Validate citations against retrieved evidence allowlist
      const allCitedIds: string[] = [];
      if (Array.isArray(parsed.keyFindings)) {
        for (const kf of parsed.keyFindings) {
          if (Array.isArray(kf.evidenceIds)) {
            allCitedIds.push(...kf.evidenceIds);
          }
        }
      }

      const { validCitations, invalidIds } = CitationValidator.validateCitations(
        allCitedIds,
        retrievedItems
      );

      // If the model hallucinated citations not present in retrieval, fallback cleanly
      if (invalidIds.length > 0 && validCitations.length === 0) {
        console.warn('Citation validation failed; activating deterministic fallback:', invalidIds);
        return DeterministicFallbackEngine.generateFallback(question, retrievedItems);
      }

      return {
        classification: parsed.classification || 'INFERRED',
        summary: parsed.summary || 'Summary unavailable',
        keyFindings: parsed.keyFindings || [],
        interpretation: parsed.interpretation || '',
        limitations: parsed.limitations || [],
        missingInformation: parsed.missingInformation || [],
        citations: validCitations,
        providerMode: 'GEMINI',
        suggestedFollowUps: parsed.suggestedFollowUps || [],
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic mode:', err);
      return DeterministicFallbackEngine.generateFallback(question, retrievedItems);
    }
  }
}
