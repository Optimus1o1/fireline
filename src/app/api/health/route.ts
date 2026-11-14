import { NextResponse } from 'next/server';
import empiricalRecords from '@/data/empirical_records.json';
import auditedFindings from '@/data/audited_findings.json';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'fireline-decision-support',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      corpus: {
        empirical_records: empiricalRecords.length,
        audited_findings: auditedFindings.length,
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
