import { NextRequest, NextResponse } from 'next/server';
import { EvidenceRepository } from '@/lib/evidenceRepository';
import { PhysicalComparabilityEngine } from '@/lib/physicalComparabilityEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordAId, recordBId } = body;

    if (!recordAId || !recordBId) {
      return NextResponse.json(
        { success: false, error: 'Both recordAId and recordBId must be provided' },
        { status: 400 }
      );
    }

    const recordA = EvidenceRepository.getRecordById(recordAId);
    const recordB = EvidenceRepository.getRecordById(recordBId);

    if (!recordA) {
      return NextResponse.json(
        { success: false, error: `Record A '${recordAId}' not found` },
        { status: 404 }
      );
    }

    if (!recordB) {
      return NextResponse.json(
        { success: false, error: `Record B '${recordBId}' not found` },
        { status: 404 }
      );
    }

    const comparison = PhysicalComparabilityEngine.compare(recordA, recordB);

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to execute physical comparability analysis' },
      { status: 500 }
    );
  }
}
