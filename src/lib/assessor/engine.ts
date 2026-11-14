import {
  MissionScenario,
  MissionAssessmentResult,
  InvestigationRelevance,
  ParameterCoverage,
  EvidenceGap,
  CoverageOutcome,
} from './types';
import { EvidenceRecord } from '@/types/evidence';
import { AuditedFinding } from '@/lib/copilot/types';
import empiricalRecords from '@/data/empirical_records.json';
import auditedFindings from '@/data/audited_findings.json';

export class EvidenceGapAssessorEngine {
  private static empirical: EvidenceRecord[] = empiricalRecords as EvidenceRecord[];
  private static findings: AuditedFinding[] = auditedFindings as AuditedFinding[];

  public static readonly SCIENTIFIC_DISCLAIMER =
    'FIRELINE evaluates the availability, comparability, and relevance of experimental research evidence. ' +
    'It does not certify spacecraft fire safety or predict fire risk.';

  /**
   * Evaluates how well currently indexed NASA experimental research covers a target mission scenario.
   */
  public static assessMission(scenario: MissionScenario): MissionAssessmentResult {
    // 1. Evaluate Investigation Relevance
    const saffireRelevance = this.evaluateSaffireI(scenario);
    const bassRelevance = this.evaluateBASSII(scenario);
    const flexRelevance = this.evaluateFLEX(scenario);
    const sofieRelevance = this.evaluateSoFIEMIST(scenario);

    const rankings: InvestigationRelevance[] = [
      saffireRelevance,
      bassRelevance,
      flexRelevance,
      sofieRelevance,
    ].sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 2. Evaluate Parameter Coverage Matrix
    const coverageMatrix = this.evaluateCoverageMatrix(scenario);

    // 3. Extract Detailed Evidence Gaps
    const gaps = this.extractEvidenceGaps(scenario, rankings, coverageMatrix);

    const criticalGapsCount = gaps.filter((g) => g.gapSeverity === 'CRITICAL_GAP').length;
    const partialGapsCount = gaps.filter((g) => g.gapSeverity === 'CRITICAL_GAP' || g.gapSeverity === 'PARTIAL_GAP').length;

    let overallStatus: CoverageOutcome = 'EVIDENCE_AVAILABLE';
    if (criticalGapsCount > 0) {
      overallStatus = 'EVIDENCE_GAP';
    } else if (partialGapsCount > 0) {
      overallStatus = 'PARTIAL_EVIDENCE';
    }

    const summary = this.generateSummary(scenario, rankings, gaps, overallStatus);

    return {
      scenario,
      overallStatus,
      summary,
      investigationRankings: rankings,
      coverageMatrix,
      gaps,
      criticalGapsCount,
      partialGapsCount,
      scientificDisclaimer: this.SCIENTIFIC_DISCLAIMER,
      timestamp: new Date().toISOString(),
    };
  }

  // --- Investigation-Specific Evaluators ---

  private static evaluateSaffireI(scenario: MissionScenario): InvestigationRelevance {
    let score = 0;
    const matched: string[] = [];
    const unmatched: string[] = [];
    const warnings: string[] = [];
    const missingMeta: string[] = [];
    const limitations: string[] = [];

    // Phase: Solid
    if (scenario.materialTarget.toLowerCase().includes('liquid')) {
      warnings.push('PHASE_INCOMPATIBLE: Saffire-I tested solid fuels (SIBAL composite fabric & PMMA card), not liquid droplets.');
      unmatched.push('Fuel Phase (Liquid vs. Solid)');
    } else {
      score += 25;
      matched.push('Solid Fuel Phase');
    }

    // Material
    const mat = scenario.materialTarget.toLowerCase();
    if (mat.includes('sibal') || mat.includes('cotton') || mat.includes('fabric')) {
      score += 20;
      matched.push('Material Match (SIBAL Fabric / Cotton-Fiberglass Blend)');
    } else if (mat.includes('pmma') || mat.includes('acrylic') || mat.includes('plastic')) {
      score += 12;
      matched.push('Material Family (PMMA card tested in secondary Saffire burn)');
    } else {
      unmatched.push(`Material Mismatch (Requested ${scenario.materialTarget}, Saffire tested SIBAL & PMMA)`);
    }

    // Atmosphere
    const o2Diff = Math.abs(scenario.oxygenPercent - 21.0);
    const pDiff = Math.abs(scenario.pressureKpa - 101.3);
    if (o2Diff <= 1.0 && pDiff <= 3.0) {
      score += 20;
      matched.push('Atmospheric Match (Standard Air 21% O2 at 101.3 kPa)');
    } else {
      if (o2Diff > 3.0) {
        unmatched.push(`Oxygen Discrepancy (Requested ${scenario.oxygenPercent}% O2 vs Saffire-I 21.5% O2)`);
        warnings.push('DEC-05: Saffire-I provides NO flight evidence for Exploration Atmospheres (e.g. 34% O2).');
      }
      if (pDiff > 10.0) {
        unmatched.push(`Pressure Discrepancy (Requested ${scenario.pressureKpa} kPa vs Saffire-I 101.3 kPa)`);
      }
      if (o2Diff <= 3.0) score += 10;
      if (pDiff <= 10.0) score += 10;
    }

    // Gravity
    if (scenario.gravityRegime === 'microgravity' || scenario.gravity_g === 0) {
      score += 15;
      matched.push('Gravity Match (Microgravity ~10^-6 g)');
    } else {
      unmatched.push(`Gravity Regime Gap (Requested ${scenario.gravityRegime} ${scenario.gravity_g}g vs Saffire-I microgravity)`);
      warnings.push('GRAVITY_REGIME_GAP: Saffire-I microgravity data cannot be directly extrapolated to lunar or martian buoyancy.');
    }

    // Flow
    if (scenario.flowDirection === 'concurrent') {
      score += 5;
      matched.push('Flow Direction Match (Concurrent forced airflow)');
    } else if (scenario.flowDirection !== 'unspecified') {
      unmatched.push(`Flow Direction Mismatch (Requested ${scenario.flowDirection} vs Saffire-I concurrent)`);
      warnings.push('FLOW_DIR_MISMATCH: Concurrent spread is governed by downstream preheating, not opposed conduction.');
    }
    if (scenario.flowVelocityCmS !== null && Math.abs(scenario.flowVelocityCmS - 20.0) <= 5.0) {
      score += 5;
      matched.push('Flow Speed Match (~20 cm/s calibrated forced airflow)');
    } else if (scenario.flowVelocityCmS !== null) {
      unmatched.push(`Flow Speed Discrepancy (Requested ${scenario.flowVelocityCmS} cm/s vs Saffire-I 20 cm/s)`);
    }

    // Measurement Coverage
    score += 10;
    matched.push('Dynamic Flame Spread Rate Measurements Available (Urban et al. 2019: 2.0-2.5 mm/s)');

    missingMeta.push('PSI-98 specimen table does not record time-resolved pyrometry; derived from Urban et al. (2019).');
    limitations.push('Single large fabric burn; statistical repeatability across identical samples established in Saffire-III.');
    limitations.push('Vehicle cabin pressure rise (3.8 kPa) is a theoretical ideal-gas calculation, not a measured empirical transducer log.');

    const category = this.scoreToCategory(score);
    const explanation = `Saffire-I provides large-scale concurrent flame spread data in microgravity air (21% O2, 101.3 kPa, 20 cm/s flow). ` +
      (category === 'HIGH' ? 'Strong physical match with standard microgravity conditions.' :
       category === 'PARTIAL' ? 'Partially relevant for microgravity combustion physics, but diverges in atmosphere, gravity, or geometry.' :
       'Limited relevance due to substantial environmental or material divergence.');

    return {
      investigationId: 'PSI-98',
      investigationTitle: 'Saffire-I (Spacecraft Fire Safety Experiment-I)',
      relevanceCategory: category,
      relevanceScore: Math.min(100, Math.max(0, score)),
      matchedCriteria: matched,
      unmatchedCriteria: unmatched,
      incompatibilityWarnings: warnings,
      missingMetadata: missingMeta,
      explanation,
      relevantRecords: ['PSI98-S1', 'PSI98-S2'],
      relevantClaims: ['SAFFIRE-001', 'SAFFIRE-002', 'SAFFIRE-003', 'SAFFIRE-004', 'SAFFIRE-006', 'SAFFIRE-007', 'SAFFIRE-008'],
      limitations,
    };
  }

  private static evaluateBASSII(scenario: MissionScenario): InvestigationRelevance {
    let score = 0;
    const matched: string[] = [];
    const unmatched: string[] = [];
    const warnings: string[] = [];
    const missingMeta: string[] = [];
    const limitations: string[] = [];

    // Phase: Solid
    if (scenario.materialTarget.toLowerCase().includes('liquid')) {
      warnings.push('PHASE_INCOMPATIBLE: BASS-II investigated solid polymers and fabrics, not liquid droplets.');
      unmatched.push('Fuel Phase (Liquid vs. Solid)');
    } else {
      score += 25;
      matched.push('Solid Fuel Phase');
    }

    // Material
    const mat = scenario.materialTarget.toLowerCase();
    if (mat.includes('pmma') || mat.includes('acrylic')) {
      score += 20;
      matched.push('Material Match (PMMA Acrylic Fuel)');
    } else if (mat.includes('cotton') || mat.includes('fabric')) {
      score += 15;
      matched.push('Material Family (Cotton fabric strips tested in secondary BASS-II tests)');
    } else {
      unmatched.push(`Material Discrepancy (Requested ${scenario.materialTarget} vs BASS-II PMMA)`);
    }

    // Atmosphere
    const o2Diff = Math.abs(scenario.oxygenPercent - 21.0);
    const pDiff = Math.abs(scenario.pressureKpa - 101.3);
    if (o2Diff <= 2.0 && pDiff <= 3.0) {
      score += 20;
      matched.push('Atmospheric Match (Ambient ISS air 21% O2 at 101.3 kPa)');
    } else {
      if (scenario.oxygenPercent <= 22.2 && scenario.oxygenPercent >= 13.6) {
        score += 15;
        matched.push(`Oxygen Sweep Match (Olson 2017 tested 13.6% - 22.2% O2 dilution)`);
      } else {
        unmatched.push(`Oxygen Discrepancy (Requested ${scenario.oxygenPercent}% O2 vs BASS-II 13.6%-22.2% range)`);
        warnings.push('DEC-05: BASS-II provides NO data for 34% O2 exploration atmospheres.');
      }
      if (pDiff > 10.0) {
        unmatched.push(`Pressure Discrepancy (Requested ${scenario.pressureKpa} kPa vs BASS-II 101.3 kPa)`);
      } else {
        score += 5;
      }
    }

    // Gravity
    if (scenario.gravityRegime === 'microgravity' || scenario.gravity_g === 0) {
      score += 15;
      matched.push('Gravity Match (ISS Microgravity Science Glovebox ~10^-6 g)');
    } else {
      unmatched.push(`Gravity Regime Gap (Requested ${scenario.gravityRegime} ${scenario.gravity_g}g vs BASS-II microgravity)`);
      warnings.push('GRAVITY_REGIME_GAP: BASS-II microgravity data cannot be directly extrapolated to lunar or martian partial gravity.');
    }

    // Flow
    if (scenario.flowDirection === 'opposed') {
      score += 5;
      matched.push('Flow Direction Match (Opposed-flow / stagnation boundary)');
    } else if (scenario.flowDirection !== 'unspecified') {
      unmatched.push(`Flow Direction Discrepancy (Requested ${scenario.flowDirection} vs BASS-II opposed flow)`);
    }

    // Flow Calibration Warning
    warnings.push('DEC-04: BASS-II thin-film table records fan display settings (47-62) as uncalibrated indices without physical velocity.');
    missingMeta.push('Duct hot-wire anemometer calibration curves translating fan index to cm/s are unextracted.');

    // Geometry & Measurement Coverage
    const geom = scenario.geometryTarget.toLowerCase();
    if (geom.includes('rod') || geom.includes('cylinder')) {
      score += 10;
      matched.push('Geometry Match (Cylindrical PMMA rods in Olson & Ferkul 2017)');
    } else if (geom.includes('thin') || geom.includes('film')) {
      score += 8;
      matched.push('Geometry Match (Thin PMMA films in Bhattacharjee series)');
    } else {
      unmatched.push(`Geometry Discrepancy (Requested ${scenario.geometryTarget} vs BASS-II rods/films)`);
    }

    limitations.push('Duct boundary layer and wall heat loss perturb low-speed flame spread.');
    limitations.push('Olson & Ferkul rod quenching data (1.0-1.5 cm/s) cannot be applied directly to thin films due to thermal Biot number divergence.');

    const category = this.scoreToCategory(score);
    const explanation = `BASS-II investigates opposed-flow flame spread, radiative quenching limits, and blowoff boundaries on PMMA in microgravity. ` +
      (category === 'HIGH' ? 'High relevance for solid PMMA opposed-flow flame spread.' :
       category === 'PARTIAL' ? 'Partially relevant for solid flammability boundaries, but diverges in atmosphere, flow calibration, or geometry.' :
       'Limited relevance due to environmental differences.');

    return {
      investigationId: 'PSI-25',
      investigationTitle: 'BASS-II (Burning and Suppression of Solids - II)',
      relevanceCategory: category,
      relevanceScore: Math.min(100, Math.max(0, score)),
      matchedCriteria: matched,
      unmatchedCriteria: unmatched,
      incompatibilityWarnings: warnings,
      missingMetadata: missingMeta,
      explanation,
      relevantRecords: ['PSI25-B1', 'PSI25-B2', 'PSI25-B3', 'PSI25-B4', 'PSI25-B5'],
      relevantClaims: ['BASS-001', 'BASS-002', 'BASS-003', 'BASS-007'],
      limitations,
    };
  }

  private static evaluateFLEX(scenario: MissionScenario): InvestigationRelevance {
    let score = 0;
    const matched: string[] = [];
    const unmatched: string[] = [];
    const warnings: string[] = [];
    const missingMeta: string[] = [];
    const limitations: string[] = [];

    // Phase: Liquid vs Solid
    const isSolid = !scenario.materialTarget.toLowerCase().includes('liquid') &&
                    !scenario.materialTarget.toLowerCase().includes('droplet') &&
                    !scenario.materialTarget.toLowerCase().includes('alkane') &&
                    !scenario.materialTarget.toLowerCase().includes('alcohol');

    if (isSolid) {
      warnings.push('PHASE_INCOMPATIBLE: FLEX investigated liquid hydrocarbon droplets (n-alkanes, methanol). Liquid phase change cannot support solid polymer pyrolysis or charring.');
      unmatched.push('Phase Incompatible (Liquid Droplets vs Requested Solid Material)');
      score = 15; // Low baseline retrieval score for fundamental gas-phase chemical kinetics
    } else {
      score += 25;
      matched.push('Liquid Fuel Phase Match');
      score += 20;
      matched.push('Hydrocarbon Droplet Fuel Match');
    }

    // Atmosphere
    if (Math.abs(scenario.pressureKpa - 101.3) <= 5.0 && Math.abs(scenario.oxygenPercent - 21.0) <= 2.0) {
      score += 15;
      matched.push('Atmosphere Match (Standard ambient air 21% O2 at 101.3 kPa)');
    } else {
      unmatched.push('Atmosphere Discrepancy');
    }

    // Gravity
    if (scenario.gravityRegime === 'microgravity' || scenario.gravity_g === 0) {
      score += 15;
      matched.push('Microgravity Droplet Kinetics (~10^-6 g)');
    } else {
      unmatched.push('Gravity Regime Gap (FLEX conducted in microgravity)');
    }

    // Flow: FLEX is quiescent
    if (scenario.flowDirection === 'quiescent' || scenario.flowVelocityCmS === 0) {
      score += 10;
      matched.push('Flow Match (Quiescent diffusion environment)');
    } else if (scenario.flowVelocityCmS !== null && scenario.flowVelocityCmS > 0) {
      unmatched.push(`Convective Flow Discrepancy (FLEX is quiescent u_infty = 0, requested ${scenario.flowVelocityCmS} cm/s)`);
    }

    warnings.push('FLEX experimental records are currently DEFERRED from FIRELINE active indexing (DEC-02).');
    limitations.push('Spherical liquid droplet geometry has no internal solid heat conduction or thermal Biot number.');
    limitations.push('Cool-flame persistence demonstrated in FLEX has not been experimentally validated for solid spacecraft polymers.');

    const category: 'LIMITED' | 'PARTIAL' | 'HIGH' = isSolid ? 'LIMITED' : this.scoreToCategory(score);
    const explanation = isSolid
      ? 'FLEX provides microgravity liquid droplet combustion and cool-flame extinction data. It is PHYSICALLY INCOMPATIBLE as direct empirical evidence for solid materials fire safety.'
      : 'FLEX provides definitive microgravity droplet burning and radiative extinction data.';

    return {
      investigationId: 'PSI-69',
      investigationTitle: 'FLEX (Flame Extinguishment Experiment)',
      relevanceCategory: category,
      relevanceScore: Math.min(100, Math.max(0, isSolid ? Math.min(score, 30) : score)),
      matchedCriteria: matched,
      unmatchedCriteria: unmatched,
      incompatibilityWarnings: warnings,
      missingMetadata: missingMeta,
      explanation,
      relevantRecords: [],
      relevantClaims: ['FLEX-001', 'FLEX-003', 'FLEX-004', 'CROSS-001'],
      limitations,
    };
  }

  private static evaluateSoFIEMIST(scenario: MissionScenario): InvestigationRelevance {
    return {
      investigationId: 'SOFIE-MIST',
      investigationTitle: 'SoFIE-MIST (Material Ignition and Suppression Test)',
      relevanceCategory: 'UNAVAILABLE',
      relevanceScore: 0,
      matchedCriteria: [],
      unmatchedCriteria: ['Investigation not currently indexed in FIRELINE repository.'],
      incompatibilityWarnings: ['UNINDEXED: Planned for future ingestion wave.'],
      missingMetadata: ['Full PSI dataset unindexed.'],
      explanation: 'SoFIE-MIST is an unindexed NASA investigation in the current prototype repository.',
      relevantRecords: [],
      relevantClaims: [],
      limitations: ['Data unavailable in local repository.'],
    };
  }

  // --- Parameter Coverage Evaluator ---

  private static evaluateCoverageMatrix(scenario: MissionScenario): ParameterCoverage[] {
    const matrix: ParameterCoverage[] = [];

    // 1. Gravity
    if (scenario.gravityRegime === 'microgravity' || scenario.gravity_g === 0) {
      matrix.push({
        parameter: 'Gravity Acceleration',
        requestedValue: `${scenario.gravityRegime} (${scenario.gravity_g}g)`,
        availableRange: 'Microgravity (~10⁻⁶ g) across Saffire-I & BASS-II',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Exact match: microgravity flight environment fully documented.',
        bestMatchingInvestigation: 'PSI-98 / PSI-25',
      });
    } else {
      matrix.push({
        parameter: 'Gravity Acceleration',
        requestedValue: `${scenario.gravityRegime} (${scenario.gravity_g}g)`,
        availableRange: 'Microgravity (~10⁻⁶ g) and ground 1g only',
        status: 'EVIDENCE_GAP',
        differenceDescription: `CRITICAL GAP: Zero flight combustion data exists in NASA PSI for partial gravity (${scenario.gravity_g}g).`,
        bestMatchingInvestigation: 'None (Claim CROSS-004)',
      });
    }

    // 2. Oxygen Concentration
    if (Math.abs(scenario.oxygenPercent - 21.0) <= 1.0) {
      matrix.push({
        parameter: 'Oxygen Concentration',
        requestedValue: `${scenario.oxygenPercent}% O₂`,
        availableRange: '21.0% - 21.7% O₂ (Saffire-I & BASS-II baseline)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Exact match: sea-level atmospheric oxygen concentration.',
        bestMatchingInvestigation: 'PSI-98 (Saffire-I)',
      });
    } else if (scenario.oxygenPercent >= 13.6 && scenario.oxygenPercent <= 22.2) {
      matrix.push({
        parameter: 'Oxygen Concentration',
        requestedValue: `${scenario.oxygenPercent}% O₂`,
        availableRange: '13.6% - 22.2% O₂ (BASS-II nitrogen dilution sweeps)',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: 'Sub-atmospheric oxygen sweep covered by Olson & Ferkul (2017) on PMMA rods.',
        bestMatchingInvestigation: 'PSI-25 (BASS-II)',
      });
    } else {
      matrix.push({
        parameter: 'Oxygen Concentration',
        requestedValue: `${scenario.oxygenPercent}% O₂`,
        availableRange: '13.6% - 22.2% O₂ (No exploration atmosphere >22.2% indexed)',
        status: 'EVIDENCE_GAP',
        differenceDescription: `CRITICAL GAP: High oxygen exploration atmospheres (${scenario.oxygenPercent}% O₂) are completely unindexed in current repository.`,
        bestMatchingInvestigation: 'None (Claim CROSS-005)',
      });
    }

    // 3. Ambient Pressure
    if (Math.abs(scenario.pressureKpa - 101.3) <= 2.0) {
      matrix.push({
        parameter: 'Ambient Total Pressure',
        requestedValue: `${scenario.pressureKpa} kPa (${scenario.pressurePsia} psia)`,
        availableRange: '101.3 kPa (Standard sea-level cabin air)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Exact match: standard nominal cabin pressure.',
        bestMatchingInvestigation: 'PSI-98 (Saffire-I)',
      });
    } else {
      matrix.push({
        parameter: 'Ambient Total Pressure',
        requestedValue: `${scenario.pressureKpa} kPa (${scenario.pressurePsia} psia)`,
        availableRange: '101.3 kPa flight baseline (Sub-atmospheric runs unindexed)',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: `Pressure discrepancy: requested ${scenario.pressureKpa} kPa vs available 101.3 kPa.`,
        bestMatchingInvestigation: 'PSI-98',
      });
    }

    // 4. Flow Velocity & Calibration
    if (scenario.flowVelocityCmS !== null && Math.abs(scenario.flowVelocityCmS - 20.0) <= 2.0) {
      matrix.push({
        parameter: 'Convective Flow Velocity',
        requestedValue: `${scenario.flowVelocityCmS} cm/s`,
        availableRange: '20.0 cm/s (Saffire-I calibrated tunnel flow)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Calibrated forced flow velocity at 20 cm/s in Saffire-I.',
        bestMatchingInvestigation: 'PSI-98 (Saffire-I)',
      });
    } else if (scenario.flowVelocityCmS !== null && scenario.flowVelocityCmS <= 2.0) {
      matrix.push({
        parameter: 'Convective Flow Velocity',
        requestedValue: `${scenario.flowVelocityCmS} cm/s`,
        availableRange: '1.0 - 1.5 cm/s quenching threshold (Olson 2017) / Uncalibrated fan dial (BASS-II table)',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: 'Low-speed quenching boundary documented on rods; thin-film fan settings are uncalibrated indices.',
        bestMatchingInvestigation: 'PSI-25 (BASS-II)',
      });
    } else {
      matrix.push({
        parameter: 'Convective Flow Velocity',
        requestedValue: scenario.flowVelocityCmS !== null ? `${scenario.flowVelocityCmS} cm/s` : 'Unspecified',
        availableRange: '20 cm/s (Saffire) | 0-55 cm/s (BASS rods) | Uncalibrated fan (BASS table)',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: 'Flow rate differs from calibrated setpoints.',
        bestMatchingInvestigation: 'PSI-98 / PSI-25',
      });
    }

    // 5. Fuel Material
    const mat = scenario.materialTarget.toLowerCase();
    if (mat.includes('sibal')) {
      matrix.push({
        parameter: 'Fuel Material',
        requestedValue: scenario.materialTarget,
        availableRange: 'SIBAL fabric (75% cotton / 25% fiberglass)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Exact match: Saffire-I primary flight specimen.',
        bestMatchingInvestigation: 'PSI-98 (Saffire-I)',
      });
    } else if (mat.includes('pmma')) {
      matrix.push({
        parameter: 'Fuel Material',
        requestedValue: scenario.materialTarget,
        availableRange: 'PMMA (Thin film 100-300 μm, thick rods, thick cards)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Exact match: BASS-II and Saffire-I PMMA specimens.',
        bestMatchingInvestigation: 'PSI-25 (BASS-II)',
      });
    } else if (mat.includes('liquid') || mat.includes('droplet')) {
      matrix.push({
        parameter: 'Fuel Material',
        requestedValue: scenario.materialTarget,
        availableRange: 'n-Alkanes, Methanol (FLEX liquid droplets)',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: 'Liquid droplets available in deferred FLEX dataset; not comparable to solid spacecraft fuels.',
        bestMatchingInvestigation: 'PSI-69 (FLEX)',
      });
    } else {
      matrix.push({
        parameter: 'Fuel Material',
        requestedValue: scenario.materialTarget,
        availableRange: 'SIBAL fabric and PMMA acrylic',
        status: 'EVIDENCE_GAP',
        differenceDescription: `Material gap: ${scenario.materialTarget} is not directly represented in indexed flight records.`,
        bestMatchingInvestigation: 'None',
      });
    }

    // 6. Specimen Geometry
    const geom = scenario.geometryTarget.toLowerCase();
    if (geom.includes('large') || geom.includes('panel') || geom.includes('fabric')) {
      matrix.push({
        parameter: 'Specimen Geometry',
        requestedValue: scenario.geometryTarget,
        availableRange: 'Large fabric panel (40.6 cm x 94.0 cm x 0.4 mm)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Full-scale fabric panel tested in Saffire-I.',
        bestMatchingInvestigation: 'PSI-98 (Saffire-I)',
      });
    } else if (geom.includes('film') || geom.includes('thin')) {
      matrix.push({
        parameter: 'Specimen Geometry',
        requestedValue: scenario.geometryTarget,
        availableRange: 'Thin PMMA films (100, 200, 300 μm)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Thermally thin PMMA films tested in BASS-II.',
        bestMatchingInvestigation: 'PSI-25 (BASS-II)',
      });
    } else if (geom.includes('rod') || geom.includes('cylinder')) {
      matrix.push({
        parameter: 'Specimen Geometry',
        requestedValue: scenario.geometryTarget,
        availableRange: 'Thick cylindrical rods (dia 6.35 - 12.7 mm)',
        status: 'EVIDENCE_AVAILABLE',
        differenceDescription: 'Thermally thick rods tested in BASS-II (Olson & Ferkul 2017).',
        bestMatchingInvestigation: 'PSI-25 (BASS-II)',
      });
    } else {
      matrix.push({
        parameter: 'Specimen Geometry',
        requestedValue: scenario.geometryTarget,
        availableRange: 'Thin films, thick rods, and large fabric sheets',
        status: 'PARTIAL_EVIDENCE',
        differenceDescription: 'Geometric scaling requires thermal Biot number analysis.',
        bestMatchingInvestigation: 'PSI-98 / PSI-25',
      });
    }

    return matrix;
  }

  // --- Gap Extraction ---

  private static extractEvidenceGaps(
    scenario: MissionScenario,
    rankings: InvestigationRelevance[],
    matrix: ParameterCoverage[]
  ): EvidenceGap[] {
    const gaps: EvidenceGap[] = [];

    // Gap 1: Gravity Regime (Partial Gravity)
    if (scenario.gravityRegime !== 'microgravity' && scenario.gravity_g > 0) {
      gaps.push({
        gapId: 'GAP-GRAV-PARTIAL',
        parameterName: 'Partial-Gravity Regime',
        requestedCondition: `${scenario.gravityRegime} (${scenario.gravity_g}g)`,
        availableCondition: 'Microgravity (~10⁻⁶ g) and ground 1g only',
        gapSeverity: 'CRITICAL_GAP',
        relevantInvestigation: 'Cross-Investigation',
        explanation:
          'There is a complete absence of flight combustion data in reduced partial gravity (Lunar 0.16g and Martian 0.38g). ' +
          'In partial gravity, buoyant convection re-emerges at low Richardson numbers, altering convective oxidizer transport and extinction boundaries.',
        requiredResearch:
          'Long-duration centrifuge or orbital partial-gravity combustion tests to map flammability boundaries between 0g and 1g.',
        supportingCitations: ['CROSS-004'],
      });
    }

    // Gap 2: Exploration Atmosphere (High O2)
    if (scenario.oxygenPercent > 25.0) {
      gaps.push({
        gapId: 'GAP-ATM-O2-ELEVATED',
        parameterName: 'Exploration Atmosphere Oxygen Concentration',
        requestedCondition: `${scenario.oxygenPercent}% O₂ at ${scenario.pressureKpa} kPa`,
        availableCondition: '21.0% - 21.7% O₂ at 101.3 kPa',
        gapSeverity: 'CRITICAL_GAP',
        relevantInvestigation: 'Saffire-I / BASS-II',
        explanation:
          'Neither Saffire-I nor BASS-II tested elevated oxygen concentrations typical of Exploration Atmospheres (34% O₂ at 56.5 kPa / 8.2 psia). ' +
          'Elevated oxygen severely increases flame spread rates and widens flammability limits.',
        requiredResearch:
          'Ingestion of Saffire-IV/V/VI datasets or dedicated 34% O₂ flight combustion experiments.',
        supportingCitations: ['CROSS-005'],
      });
    }

    // Gap 3: Sub-atmospheric Pressure
    if (scenario.pressureKpa < 80.0) {
      gaps.push({
        gapId: 'GAP-ATM-SUBATMOSPHERIC',
        parameterName: 'Total Ambient Pressure',
        requestedCondition: `${scenario.pressureKpa} kPa (${scenario.pressurePsia} psia)`,
        availableCondition: '101.3 kPa nominal cabin air',
        gapSeverity: 'PARTIAL_GAP',
        relevantInvestigation: 'Saffire-I / BASS-II',
        explanation:
          'Indexed flight data reflects sea-level 1 atm pressure. Reduced pressure modifies chemical reaction zone thickness and gas-phase thermal conductivity.',
        requiredResearch:
          'Extraction of sub-atmospheric pressure runs from subsequent flight series.',
        supportingCitations: ['SAFFIRE-002', 'CROSS-005'],
      });
    }

    // Gap 4: Flow Calibration in BASS-II
    if (scenario.flowVelocityCmS !== null && scenario.flowVelocityCmS < 5.0) {
      gaps.push({
        gapId: 'GAP-FLOW-UNCALIBRATED',
        parameterName: 'BASS-II Thin-Film Flow Velocity Calibration',
        requestedCondition: `${scenario.flowVelocityCmS} cm/s physical velocity`,
        availableCondition: 'Fan display settings reported as discrete integer indices (47-62)',
        gapSeverity: 'PARTIAL_GAP',
        relevantInvestigation: 'PSI-25 (BASS-II)',
        explanation:
          'Engineering Decision DEC-04 prohibits converting fan display indices into cm/s without verified duct calibration curves. ' +
          'Physical airspeed in BASS-II thin-film tests remains uncalibrated in the staged table.',
        requiredResearch:
          'Extraction of MSG flow duct hot-wire anemometer calibration data from PSI-25 raw archive.',
        supportingCitations: ['BASS-007'],
      });
    }

    // Gap 5: Liquid vs Solid Phase Divergence
    if (scenario.materialTarget.toLowerCase().includes('liquid') || scenario.geometryTarget.toLowerCase().includes('droplet')) {
      gaps.push({
        gapId: 'GAP-PHASE-SOLID-VS-LIQUID',
        parameterName: 'Physical Phase Divergence',
        requestedCondition: 'Liquid droplet combustion',
        availableCondition: 'Solid fabric panels (Saffire) and PMMA acrylic (BASS-II)',
        gapSeverity: 'CRITICAL_GAP',
        relevantInvestigation: 'PSI-69 (FLEX)',
        explanation:
          'Liquid droplet evaporation mechanics (d²-law, spherical symmetry) cannot be used as empirical evidence for solid pyrolysis or charring (CROSS-001).',
        requiredResearch: 'Activate dedicated liquid fuel combustion module.',
        supportingCitations: ['CROSS-001', 'FLEX-001', 'FLEX-003'],
      });
    }

    return gaps;
  }

  // --- Helper Methods ---

  private static scoreToCategory(score: number): 'HIGH' | 'PARTIAL' | 'LIMITED' {
    if (score >= 75) return 'HIGH';
    if (score >= 50) return 'PARTIAL';
    return 'LIMITED';
  }

  private static generateSummary(
    scenario: MissionScenario,
    rankings: InvestigationRelevance[],
    gaps: EvidenceGap[],
    overallStatus: CoverageOutcome
  ): string {
    const topInv = rankings[0];
    const critCount = gaps.filter((g) => g.gapSeverity === 'CRITICAL_GAP').length;

    if (critCount > 0) {
      const critNames = gaps.filter((g) => g.gapSeverity === 'CRITICAL_GAP').map((g) => g.parameterName).join(', ');
      return `CRITICAL SCIENTIFIC EVIDENCE GAP: The requested mission environment (${scenario.name}) cannot be validated using currently indexed NASA flight evidence. Critical voids detected in: ${critNames}. ${topInv.investigationTitle} provides highest partial relevance (${topInv.relevanceScore}/100) under differing conditions.`;
    }

    if (overallStatus === 'PARTIAL_EVIDENCE') {
      return `PARTIAL EVIDENCE AVAILABLE: ${topInv.investigationTitle} provides relevant baseline data (${topInv.relevanceScore}/100 relevance), but physical scaling adjustments are required for parameter discrepancies.`;
    }

    return `EVIDENCE AVAILABLE: ${topInv.investigationTitle} directly covers the requested mission conditions with verified microgravity flight observations (${topInv.relevanceScore}/100 relevance).`;
  }
}
