import { NextResponse } from 'next/server';
import { EvidenceRepository } from '@/lib/evidenceRepository';

export async function GET() {
  try {
    const investigations = EvidenceRepository.getInvestigations();
    return NextResponse.json({
      success: true,
      investigations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investigations' },
      { status: 500 }
    );
  }
}
