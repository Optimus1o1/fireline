import { EvidenceRecord, InvestigationSummary } from '@/types/evidence';
import empiricalRecords from '@/data/empirical_records.json';

/**
 * Server-side Data Access Layer for FIRELINE Empirical Records.
 * Guarantees that synthetic fixtures are NEVER returned in empirical queries.
 */
export class EvidenceRepository {
  private static records: EvidenceRecord[] = (empiricalRecords as EvidenceRecord[]).filter(
    (r) => !r.isSynthetic
  );

  private static investigations: InvestigationSummary[] = [
    {
      id: 'PSI-98',
      name: 'Saffire-I',
      title: 'Spacecraft Fire Safety Experiment-I',
      focus: 'Large-scale solid fabric and PMMA concurrent flame spread in realistic vehicle flow duct.',
      campaign: 'Orbital ATK Cygnus OA-6',
      facility: 'Saffire Test Unit (Cygnus pressurized module)',
      doi: '10.60555/0t15-1243',
      artifactCount: 1,
      recordCount: 4, // 2 specimen records + 2 flow-visualization diagnostics
      status: 'REPRESENTATIVE_SLICE',
      statusLabel: 'Representative Flight Table (5 rows)',
      description: 'First large-scale spacecraft fire safety experiment in an uncrewed cargo vehicle.',
    },
    {
      id: 'PSI-25',
      name: 'BASS-II',
      title: 'Burning and Suppression of Solids - II',
      focus: 'Thin PMMA film flame extinction and microgravity airflow stability in glovebox duct.',
      campaign: 'ISS Expeditions 39/40',
      facility: 'Microgravity Science Glovebox (MSG)',
      doi: '10.60555/4qc4-de67',
      artifactCount: 1,
      recordCount: 5, // 5 curated thin-film tests
      status: 'REPRESENTATIVE_SLICE',
      statusLabel: 'Curated Thin-Film Slice (5 rows of 130)',
      description: 'Thin PMMA film combustion in narrow flow duct with discrete fan display settings.',
    },
    {
      id: 'PSI-69',
      name: 'FLEX',
      title: 'Flame Extinguishment Experiment',
      focus: 'Isolated droplet combustion, cool-flame kinetics, and spherical extinction.',
      campaign: 'ISS CIR Multi-User Facility',
      facility: 'Combustion Integrated Rack (CIR)',
      doi: '10.60555/mbq8-0451',
      artifactCount: 0,
      recordCount: 0,
      status: 'DEFERRED_BLOCKED',
      statusLabel: 'Deferred (Quiescent / Non-solid geometry)',
      description: 'Droplet burning investigation deferred pending canonical nullability and spherical geometry resolution.',
    },
  ];

  public static getInvestigations(): InvestigationSummary[] {
    return this.investigations;
  }

  public static getRecords(): EvidenceRecord[] {
    return this.records;
  }

  public static getRecordById(id: string): EvidenceRecord | null {
    const found = this.records.find((r) => r.id === id || r.runId === id);
    return found || null;
  }

  /**
   * Explainable, deterministic scientific relevance search & filter.
   */
  public static searchRecords(params: {
    query?: string;
    investigationId?: string;
    material?: string;
    geometry?: string;
    minO2?: number;
    maxO2?: number;
    minFlow?: number;
    maxFlow?: number;
    status?: string;
  }): EvidenceRecord[] {
    let results = [...this.records];

    if (params.investigationId && params.investigationId !== 'ALL') {
      results = results.filter((r) => r.investigationId === params.investigationId);
    }

    if (params.material && params.material !== 'ALL') {
      const mat = params.material.toLowerCase();
      results = results.filter((r) => r.material.toLowerCase().includes(mat));
    }

    if (params.geometry && params.geometry !== 'ALL') {
      results = results.filter((r) => r.geometry === params.geometry);
    }

    if (params.status && params.status !== 'ALL') {
      results = results.filter((r) => r.disposition === params.status);
    }

    if (params.minO2 !== undefined) {
      results = results.filter((r) => {
        const o2 = r.environmentalConditions.oxygenMoleFraction;
        return o2 !== null && o2 !== undefined && o2 >= params.minO2!;
      });
    }

    if (params.maxO2 !== undefined) {
      results = results.filter((r) => {
        const o2 = r.environmentalConditions.oxygenMoleFraction;
        return o2 !== null && o2 !== undefined && o2 <= params.maxO2!;
      });
    }

    if (params.minFlow !== undefined) {
      results = results.filter((r) => {
        const flow = r.environmentalConditions.flowVelocityCmS;
        return flow !== null && flow !== undefined && flow >= params.minFlow!;
      });
    }

    // Free text query with explainable ranking
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      results = results
        .map((rec) => {
          let score = 0;
          const reasons: string[] = [];

          if (rec.runId.toLowerCase().includes(q)) {
            score += 10;
            reasons.push(`Exact run ID match: ${rec.runId}`);
          }
          if (rec.material.toLowerCase().includes(q)) {
            score += 8;
            reasons.push(`Material match: ${rec.material}`);
          }
          if (rec.investigationTitle.toLowerCase().includes(q) || rec.investigationId.toLowerCase().includes(q)) {
            score += 5;
            reasons.push(`Investigation match: ${rec.investigationTitle}`);
          }
          if (rec.geometry.toLowerCase().includes(q)) {
            score += 4;
            reasons.push(`Geometry match: ${rec.geometry}`);
          }
          if (q.includes('artemis') || q.includes('lunar')) {
            if (rec.environmentalConditions.oxygenMoleFraction && rec.environmentalConditions.oxygenMoleFraction > 0.25) {
              score += 6;
              reasons.push('Elevated oxygen matching Exploration Atmosphere (>25% O2)');
            }
          }
          if (q.includes('iss') || q.includes('orbit')) {
            if (rec.environmentalConditions.pressureKpa === 101.3) {
              score += 4;
              reasons.push('Nominal sea-level cabin pressure (101.3 kPa)');
            }
          }

          return {
            ...rec,
            relevanceScore: score,
            relevanceReasons: reasons.length > 0 ? reasons : ['General baseline match'],
          };
        })
        .filter((r) => (r.relevanceScore || 0) > 0)
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    return results;
  }
}
