import { NextRequest, NextResponse } from 'next/server';
import { EvidenceRepository } from '@/lib/evidenceRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || undefined;
    const investigationId = searchParams.get('investigation') || undefined;
    const material = searchParams.get('material') || undefined;
    const geometry = searchParams.get('geometry') || undefined;
    const status = searchParams.get('status') || undefined;

    const minO2 = searchParams.get('minO2') ? parseFloat(searchParams.get('minO2')!) : undefined;
    const maxO2 = searchParams.get('maxO2') ? parseFloat(searchParams.get('maxO2')!) : undefined;
    const minFlow = searchParams.get('minFlow') ? parseFloat(searchParams.get('minFlow')!) : undefined;

    const records = EvidenceRepository.searchRecords({
      query,
      investigationId,
      material,
      geometry,
      status,
      minO2,
      maxO2,
      minFlow,
    });

    return NextResponse.json({
      success: true,
      totalCount: records.length,
      datasetLimitation: 'Representative subset indexed: Saffire-I (5 rows), BASS-II (5 rows), FLEX (deferred)',
      records,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to execute evidence search' },
      { status: 500 }
    );
  }
}
