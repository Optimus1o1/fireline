import { NextRequest, NextResponse } from 'next/server';
import { EvidenceGapAssessorEngine } from '@/lib/assessor/engine';
import { MissionScenario } from '@/lib/assessor/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON object with a "scenario" field.' },
        { status: 400 }
      );
    }

    const scenario: MissionScenario = body.scenario || body;

    // Validate scenario fields
    if (!scenario || typeof scenario !== 'object') {
      return NextResponse.json(
        { error: 'Missing mission scenario configuration.' },
        { status: 400 }
      );
    }

    if (typeof scenario.oxygenPercent !== 'number' || isNaN(scenario.oxygenPercent) || scenario.oxygenPercent < 0 || scenario.oxygenPercent > 100) {
      return NextResponse.json(
        { error: 'Invalid oxygen concentration: must be a number between 0 and 100%.' },
        { status: 400 }
      );
    }

    if (typeof scenario.pressureKpa !== 'number' || isNaN(scenario.pressureKpa) || scenario.pressureKpa <= 0) {
      return NextResponse.json(
        { error: 'Invalid pressure: must be a positive number in kPa.' },
        { status: 400 }
      );
    }

    if (typeof scenario.gravity_g !== 'number' || isNaN(scenario.gravity_g) || scenario.gravity_g < 0) {
      return NextResponse.json(
        { error: 'Invalid gravity acceleration: must be a non-negative number in g.' },
        { status: 400 }
      );
    }

    if (!scenario.materialTarget || typeof scenario.materialTarget !== 'string' || scenario.materialTarget.trim() === '') {
      return NextResponse.json(
        { error: 'Missing materialTarget: a solid or liquid fuel material must be specified.' },
        { status: 400 }
      );
    }

    // Execute Deterministic Evidence-Gap Assessment
    const result = EvidenceGapAssessorEngine.assessMission(scenario);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('API /api/assess error:', err);
    return NextResponse.json(
      { error: 'Internal server error while evaluating mission evidence coverage.' },
      { status: 500 }
    );
  }
}
