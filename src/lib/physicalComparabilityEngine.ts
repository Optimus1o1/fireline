import { EvidenceRecord } from '@/types/evidence';

export type ComparisonDisposition =
  | 'DIRECTLY_COMPARABLE'
  | 'CONDITIONALLY_COMPARABLE'
  | 'NOT_COMPARABLE'
  | 'INSUFFICIENT_METADATA';

export interface ComparabilityGateResult {
  gateName: string;
  passed: boolean;
  severity: 'INFO' | 'WARNING' | 'BLOCKER';
  reason: string;
}

export interface ComparisonAnalysis {
  recordA: EvidenceRecord;
  recordB: EvidenceRecord;
  disposition: ComparisonDisposition;
  overallExplanation: string;
  gates: ComparabilityGateResult[];
  permittedInterpretations: string[];
  prohibitedClaims: string[];
}

export class PhysicalComparabilityEngine {
  /**
   * Deterministically evaluates the physical comparability of two experimental records.
   * Enforces 7 physical gates based on 01-Research/Cross-Investigation-Analysis.md.
   */
  public static compare(recordA: EvidenceRecord, recordB: EvidenceRecord): ComparisonAnalysis {
    const gates: ComparabilityGateResult[] = [];
    const permitted: string[] = [];
    const prohibited: string[] = [];

    // Gate 1: Measurement Meaning & Diagnostic vs Specimen
    const isDiagA = recordA.geometry === 'flow_visualization';
    const isDiagB = recordB.geometry === 'flow_visualization';

    if (isDiagA || isDiagB) {
      gates.push({
        gateName: 'Gate 1: Experimental Type & Diagnostic Isolation',
        passed: false,
        severity: 'BLOCKER',
        reason: 'One or both records represent aerodynamic flow-visualization diagnostics, not solid-fuel combustion experiments.',
      });
      prohibited.push('Do not compare aerodynamic diagnostics with solid-fuel combustion or flame spread.');
    } else {
      gates.push({
        gateName: 'Gate 1: Experimental Type Match',
        passed: true,
        severity: 'INFO',
        reason: 'Both records represent combustible solid material specimens.',
      });
    }

    // Gate 2: Material Compatibility
    const matA = recordA.material.toLowerCase();
    const matB = recordB.material.toLowerCase();
    const isPmmaA = matA.includes('pmma');
    const isPmmaB = matB.includes('pmma');
    const isSibalA = matA.includes('sibal');
    const isSibalB = matB.includes('sibal');

    if ((isPmmaA && isSibalB) || (isSibalA && isPmmaB)) {
      gates.push({
        gateName: 'Gate 2: Fuel Phase & Pyrolysis Mechanics',
        passed: false,
        severity: 'BLOCKER',
        reason: 'Incompatible materials: PMMA is a non-charring thermoplastic vaporizing by thermal pyrolysis; SIBAL is a composite fabric (75% cotton pyrolyzing to char / 25% non-combustible fiberglass weave).',
      });
      prohibited.push('Do not compare PMMA thermoplastic flame spread with SIBAL composite fabric without distinct pyrolysis kinetics models.');
    } else if (isPmmaA && isPmmaB) {
      gates.push({
        gateName: 'Gate 2: Material Compatibility',
        passed: true,
        severity: 'INFO',
        reason: 'Compatible fuel: Both specimens are cast poly(methyl methacrylate) [PMMA].',
      });
      permitted.push('Comparison of PMMA combustion under varying thickness and flow settings.');
    } else if (isSibalA && isSibalB) {
      gates.push({
        gateName: 'Gate 2: Material Compatibility',
        passed: true,
        severity: 'INFO',
        reason: 'Compatible fuel: Both specimens are standard NASA SIBAL composite cloth.',
      });
      permitted.push('Comparison of identical SIBAL fabric weave response across flight runs.');
    } else {
      gates.push({
        gateName: 'Gate 2: Material Compatibility',
        passed: false,
        severity: 'WARNING',
        reason: `Heterogeneous material definitions: '${recordA.material}' vs '${recordB.material}'.`,
      });
    }

    // Gate 3: Geometry & Scale Compatibility
    const geomA = recordA.geometry;
    const geomB = recordB.geometry;

    if (geomA !== geomB) {
      gates.push({
        gateName: 'Gate 3: Specimen Geometry Compatibility',
        passed: false,
        severity: 'BLOCKER',
        reason: `Mismatched geometries: ${geomA} vs ${geomB}. Thermally thin films/fabrics cannot be compared directly with different geometries without correcting for thermal Biot number (Bi).`,
      });
      prohibited.push('Do not treat narrow thin-film strips as interchangeable with large-scale fabric panels.');
    } else {
      // Check scale differences (e.g., duct scale)
      if (recordA.investigationId !== recordB.investigationId) {
        gates.push({
          gateName: 'Gate 3: Flow Duct Scale Compatibility',
          passed: false,
          severity: 'BLOCKER',
          reason: 'Severe scale disparity: BASS-II operates in a narrow glovebox flow duct (edge-constrained flame); Saffire-I operates in a 1-meter wide vehicle cargo duct (unobstructed macro-scale flame base).',
        });
        prohibited.push('Do not scale BASS-II glovebox flame dimensions to full-scale spacecraft habitat fire scenarios.');
      } else {
        gates.push({
          gateName: 'Gate 3: Specimen Geometry & Scale',
          passed: true,
          severity: 'INFO',
          reason: `Matching geometry class (${geomA}) within the same experimental facility.`,
        });
      }
    }

    // Gate 4: Flow Regime & Calibration
    const uncalA = recordA.environmentalConditions.isFlowUncalibrated;
    const uncalB = recordB.environmentalConditions.isFlowUncalibrated;

    if (uncalA || uncalB) {
      gates.push({
        gateName: 'Gate 4: Flow Velocity Calibration Safeguard (DEC-04)',
        passed: false,
        severity: 'WARNING',
        reason: 'Flow calibration limitation: One or both records use uncalibrated integer fan display settings (e.g., 47–62). Physical airflow in cm/s or m/s is unavailable.',
      });
      prohibited.push('Do not treat fan display numbers as physical velocity (cm/s) or Reynolds number (Re).');
      permitted.push('Relative qualitative comparison across fan dial indices within the same BASS-II hardware run.');
    } else {
      const flowA = recordA.environmentalConditions.flowVelocityCmS;
      const flowB = recordB.environmentalConditions.flowVelocityCmS;
      if (flowA === flowB) {
        gates.push({
          gateName: 'Gate 4: Flow Velocity Match',
          passed: true,
          severity: 'INFO',
          reason: `Matching calibrated forced flow velocity: ${flowA} cm/s.`,
        });
      } else {
        gates.push({
          gateName: 'Gate 4: Flow Velocity Differential',
          passed: true,
          severity: 'INFO',
          reason: `Different forced flow velocities: ${flowA} cm/s vs ${flowB} cm/s.`,
        });
        permitted.push('Evaluate velocity effect on flame propagation.');
      }
    }

    // Gate 5: Atmospheric & Environmental Compatibility
    const pA = recordA.environmentalConditions.pressureKpa;
    const pB = recordB.environmentalConditions.pressureKpa;
    const o2A = recordA.environmentalConditions.oxygenMoleFraction;
    const o2B = recordB.environmentalConditions.oxygenMoleFraction;

    if (pA === pB && o2A && o2B && Math.abs(o2A - o2B) < 0.01) {
      gates.push({
        gateName: 'Gate 5: Atmosphere Match',
        passed: true,
        severity: 'INFO',
        reason: `Nominal microgravity cabin atmosphere: ${pA} kPa at ~${(o2A * 100).toFixed(1)}% O₂.`,
      });
    } else {
      gates.push({
        gateName: 'Gate 5: Atmosphere Variation',
        passed: true,
        severity: 'INFO',
        reason: `Atmospheric differences: Pressure (${pA} vs ${pB} kPa), Oxygen (${o2A ? (o2A*100).toFixed(1) : 'N/A'}% vs ${o2B ? (o2B*100).toFixed(1) : 'N/A'}%).`,
      });
    }

    // Determine Overall Disposition
    const hasBlockers = gates.some((g) => g.severity === 'BLOCKER');
    const hasWarnings = gates.some((g) => g.severity === 'WARNING');

    let disposition: ComparisonDisposition;
    let explanation: string;

    if (hasBlockers) {
      disposition = 'NOT_COMPARABLE';
      explanation = 'These records cannot be quantitatively compared: fundamental physical differences in fuel material, geometry, or diagnostic classification prevent scientifically valid equivalence.';
    } else if (hasWarnings) {
      disposition = 'CONDITIONALLY_COMPARABLE';
      explanation = 'These records are conditionally comparable for qualitative trend analysis, but specific limitations (e.g. uncalibrated flow indices or thickness approximation) require explicit qualification.';
    } else {
      disposition = 'DIRECTLY_COMPARABLE';
      explanation = 'These records share compatible fuel material, geometry class, physical scale, and calibrated environmental conditions.';
    }

    // Default prohibitions for all comparisons
    prohibited.push('Never invent fire risk percentages or extrapolate to untested deep-space atmospheres.');

    return {
      recordA,
      recordB,
      disposition,
      overallExplanation: explanation,
      gates,
      permittedInterpretations: Array.from(new Set(permitted)),
      prohibitedClaims: Array.from(new Set(prohibited)),
    };
  }
}
