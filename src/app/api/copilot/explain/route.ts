import { NextRequest, NextResponse } from 'next/server';
import { CopilotRetriever } from '@/lib/copilot/retrieval';
import { GeminiCopilotProvider } from '@/lib/copilot/geminiProvider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, investigation_ids, selected_evidence_ids, mission_preset } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A valid non-empty question string is required.' },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Question exceeds maximum allowed length of 500 characters.' },
        { status: 400 }
      );
    }

    // Step 1: Deterministic Evidence Retrieval
    const retrievedItems = CopilotRetriever.retrieve(question, {
      investigationIds: investigation_ids,
      selectedEvidenceIds: selected_evidence_ids,
      missionPreset: mission_preset,
      limit: 6,
    });

    // Step 2: Answer via Gemini with Citation Guardrails & Deterministic Fallback
    const responsePayload = await GeminiCopilotProvider.answerQuestion(question, retrievedItems);

    return NextResponse.json({
      success: true,
      question,
      response: responsePayload,
      retrievedItemsCount: retrievedItems.length,
      retrievedEvidence: retrievedItems.map((item) => ({
        evidenceId: item.evidenceId,
        investigationId: item.investigationId,
        title: item.title,
        status: item.dispositionOrStatus,
      })),
    });
  } catch (error) {
    console.error('Copilot API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error processing SI Copilot query.' },
      { status: 500 }
    );
  }
}
