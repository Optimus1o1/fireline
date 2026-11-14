import { NextRequest, NextResponse } from 'next/server';
import { EvidenceRepository } from '@/lib/evidenceRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = EvidenceRepository.getRecordById(id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: `Evidence record '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evidence record' },
      { status: 500 }
    );
  }
}
