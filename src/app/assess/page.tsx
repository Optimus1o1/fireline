'use client';

import React, { useState, useId, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MISSION_PRESETS } from '@/lib/assessor/presets';
import {
  MissionScenario,
  MissionAssessmentResult,
  GravityRegime,
  FlowDirection,
} from '@/lib/assessor/types';
import { EvidenceGapAssessorEngine } from '@/lib/assessor/engine';

function AssessInner() {
  const searchParams = useSearchParams();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('artemis_lunar');
  const [scenario, setScenario] = useState<MissionScenario>(MISSION_PRESETS[1]); // Default to Artemis
  const [assessment, setAssessment] = useState<MissionAssessmentResult>(() =>
    EvidenceGapAssessorEngine.assessMission(MISSION_PRESETS[1])
  );
  const [isAssessing, setIsAssessing] = useState<boolean>(false);

  // Form field IDs for accessibility
  const scenarioNameId = useId();
  const gravityRegimeId = useId();
  const gravityValueId = useId();
  const oxygenPercentId = useId();
  const pressureKpaId = useId();
  const flowVelocityId = useId();
  const flowDirectionId = useId();
  const materialTargetId = useId();
  const geometryTargetId = useId();

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = MISSION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setScenario({ ...preset, isUserModified: false });
      setAssessment(EvidenceGapAssessorEngine.assessMission(preset));
    }
  };

  useEffect(() => {
    const pParam = searchParams.get('preset');
    if (pParam) {
      handleSelectPreset(pParam);
    }
  }, [searchParams]);

  const handleFieldChange = (field: keyof MissionScenario, value: any) => {
    setSelectedPresetId('custom');
    setScenario((prev) => {
      const updated = { ...prev, [field]: value, isUserModified: true };
      if (field === 'pressureKpa') {
        updated.pressurePsia = parseFloat((Number(value) * 0.145038).toFixed(2));
      }
      return updated;
    });
  };

  const handleAssess = () => {
    setIsAssessing(true);
    setTimeout(() => {
      const res = EvidenceGapAssessorEngine.assessMission(scenario);
      setAssessment(res);
      setIsAssessing(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                FL
              </span>
              <div>
                <span className="font-extrabold tracking-wider text-white text-base">FIRELINE</span>
                <span className="text-xs text-orange-400 block tracking-normal font-mono -mt-0.5">NASA SPACE APPS 2026</span>
              </div>
            </Link>
            <span className="text-slate-600 font-light">/</span>
            <span className="text-xs uppercase tracking-widest font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
              Evidence-Gap Assessor
            </span>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/explore"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              Evidence Explorer
            </Link>
            <Link
              href="/assess"
              className="text-xs sm:text-sm font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-lg shadow-sm"
            >
              Evidence Assessor
            </Link>
            <Link
              href="/copilot"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              SI Copilot
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Page Title & Scope Header */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-orange-950/60 text-orange-400 border border-orange-800/60 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                DETERMINISTIC RETRIEVAL & COVERAGE RANKING
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Spacecraft Mission Evidence-Gap Assessor
              </h1>
              <p className="mt-1 text-sm text-slate-400 max-w-3xl">
                Define a candidate mission atmosphere and gravity environment to evaluate how well NASA microgravity
                combustion experiments (Saffire-I, BASS-II, FLEX) cover your target conditions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/copilot?q=${encodeURIComponent(
                  `Assess research evidence availability for ${scenario.name} (${scenario.oxygenPercent}% O2 at ${scenario.pressureKpa} kPa, ${scenario.gravity_g}g)`
                )}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <span>Ask SI Copilot About Scenario</span>
                <span className="text-orange-400 font-bold">→</span>
              </Link>
            </div>
          </div>

          {/* Hard Epistemic Disclaimer Banner */}
          <div className="mt-4 p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
            <span className="text-amber-400 text-base font-bold shrink-0">⚠️</span>
            <div>
              <strong className="text-amber-300 font-semibold">SCIENTIFIC INTEGRITY SAFEGUARD: </strong>
              FIRELINE evaluates the availability, comparability, and relevance of experimental research evidence. It
              does not certify spacecraft fire safety or predict fire probability. Relevance scores reflect algorithmic
              retrieval priority, never experimental certainty or flame survivability.
            </div>
          </div>
        </div>

        {/* Section 1: Mission Presets & Editable Environment Controls */}
        <section className="bg-slate-900/60 rounded-xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1. Select Mission Scenario Preset</span>
                {scenario.isUserModified && (
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-mono">
                    User Modified
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose a documented reference mission or customize environmental parameters.
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MISSION_PRESETS.map((p) => {
              const isSelected = selectedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`text-left p-3.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1 text-white">{p.name}</div>
                  <div className="text-slate-400 text-xs line-clamp-2 leading-normal mb-2">{p.description}</div>
                  <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-slate-700/40 font-mono text-[10px] text-slate-400">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">{p.oxygenPercent}% O₂</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">{p.pressureKpa} kPa</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">{p.gravity_g}g</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Condition Controls (Grid Form) */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
              <span>2. Environmental & Specimen Parameters</span>
              <span className="text-xs text-slate-400 font-mono">Direct Parameter Tuning</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Scenario Name */}
              <div className="space-y-1.5">
                <label htmlFor={scenarioNameId} className="font-medium text-slate-300">Mission Name</label>
                <input
                  id={scenarioNameId}
                  type="text"
                  value={scenario.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              {/* Gravity Regime */}
              <div className="space-y-1.5">
                <label htmlFor={gravityRegimeId} className="font-medium text-slate-300">Gravity Regime</label>
                <select
                  id={gravityRegimeId}
                  value={scenario.gravityRegime}
                  onChange={(e) => {
                    const regime = e.target.value as GravityRegime;
                    let gVal = 0.0;
                    if (regime === 'lunar') gVal = 0.16;
                    if (regime === 'martian') gVal = 0.38;
                    if (regime === 'terrestrial') gVal = 1.0;
                    handleFieldChange('gravityRegime', regime);
                    handleFieldChange('gravity_g', gVal);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs"
                >
                  <option value="microgravity">Microgravity (~10⁻⁶ g)</option>
                  <option value="lunar">Lunar Surface (0.16g)</option>
                  <option value="martian">Martian Surface (0.38g)</option>
                  <option value="terrestrial">Terrestrial 1g (Ground)</option>
                </select>
              </div>

              {/* Gravity Acceleration (g) */}
              <div className="space-y-1.5">
                <label htmlFor={gravityValueId} className="font-medium text-slate-300">Gravity Value (g)</label>
                <input
                  id={gravityValueId}
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  value={scenario.gravity_g}
                  onChange={(e) => handleFieldChange('gravity_g', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              {/* Oxygen Concentration */}
              <div className="space-y-1.5">
                <label htmlFor={oxygenPercentId} className="font-medium text-slate-300">Oxygen Concentration (% O₂)</label>
                <input
                  id={oxygenPercentId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={scenario.oxygenPercent}
                  onChange={(e) => handleFieldChange('oxygenPercent', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              {/* Total Pressure (kPa) */}
              <div className="space-y-1.5">
                <label htmlFor={pressureKpaId} className="font-medium text-slate-300">Pressure (kPa)</label>
                <div className="flex gap-2 items-center">
                  <input
                    id={pressureKpaId}
                    type="number"
                    step="0.1"
                    min="1"
                    max="200"
                    value={scenario.pressureKpa}
                    onChange={(e) => handleFieldChange('pressureKpa', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                  />
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    ≈ {scenario.pressurePsia} psia
                  </span>
                </div>
              </div>

              {/* Flow Speed */}
              <div className="space-y-1.5">
                <label htmlFor={flowVelocityId} className="font-medium text-slate-300">Flow Speed (cm/s)</label>
                <input
                  id={flowVelocityId}
                  type="number"
                  step="0.5"
                  min="0"
                  max="60"
                  value={scenario.flowVelocityCmS ?? ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'flowVelocityCmS',
                      e.target.value === '' ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder="e.g. 20.0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              {/* Flow Direction */}
              <div className="space-y-1.5">
                <label htmlFor={flowDirectionId} className="font-medium text-slate-300">Flow Direction</label>
                <select
                  id={flowDirectionId}
                  value={scenario.flowDirection}
                  onChange={(e) => handleFieldChange('flowDirection', e.target.value as FlowDirection)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs"
                >
                  <option value="concurrent">Concurrent (Flame & flow in same direction)</option>
                  <option value="opposed">Opposed (Flame spreads into incoming flow)</option>
                  <option value="quiescent">Quiescent (Zero forced flow, pure diffusion)</option>
                  <option value="unspecified">Unspecified / Any</option>
                </select>
              </div>

              {/* Material Target */}
              <div className="space-y-1.5">
                <label htmlFor={materialTargetId} className="font-medium text-slate-300">Target Material</label>
                <input
                  id={materialTargetId}
                  type="text"
                  value={scenario.materialTarget}
                  onChange={(e) => handleFieldChange('materialTarget', e.target.value)}
                  placeholder="e.g. PMMA, SIBAL Fabric, Nomex"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              {/* Specimen Geometry */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor={geometryTargetId} className="font-medium text-slate-300">Specimen Geometry</label>
                <input
                  id={geometryTargetId}
                  type="text"
                  value={scenario.geometryTarget}
                  onChange={(e) => handleFieldChange('geometryTarget', e.target.value)}
                  placeholder="e.g. Thin Sheet / Film (Bi << 0.1), Cylindrical Rod (Bi > 1), Large Panel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              {/* Assess Trigger Action */}
              <div className="md:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={handleAssess}
                  disabled={isAssessing}
                  className="w-full h-[38px] bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-4 rounded-lg shadow-lg shadow-orange-500/20 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {isAssessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Evaluating Coverage...</span>
                    </>
                  ) : (
                    <>
                      <span>ASSESS EVIDENCE COVERAGE</span>
                      <span className="text-orange-200">🔍</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Overall Assessment Outcome & Summary */}
        <section className="bg-slate-900/60 rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Assessment Outcome</h2>
              <span className="text-xs text-slate-400">Deterministic coverage audit against verified flight archives</span>
            </div>
            <div>
              {assessment.overallStatus === 'EVIDENCE_GAP' && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800">
                  🔴 EVIDENCE GAP DETECTED ({assessment.criticalGapsCount} CRITICAL)
                </span>
              )}
              {assessment.overallStatus === 'PARTIAL_EVIDENCE' && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
                  🟡 PARTIAL EVIDENCE AVAILABLE
                </span>
              )}
              {assessment.overallStatus === 'EVIDENCE_AVAILABLE' && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  🟢 DIRECT EVIDENCE AVAILABLE
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            {assessment.summary}
          </p>
        </section>

        {/* Section 3: Investigation Relevance Rankings */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Investigation Relevance Ranking</h2>
              <p className="text-xs text-slate-400">
                Determined by physical phase, fuel chemistry, atmosphere, gravity, and measurement completeness.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Score: Algorithmic Retrieval Priority (0-100)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.investigationRankings.map((inv) => {
              const badgeColor =
                inv.relevanceCategory === 'HIGH'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : inv.relevanceCategory === 'PARTIAL'
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : inv.relevanceCategory === 'LIMITED'
                  ? 'bg-blue-950 text-blue-400 border-blue-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700';

              return (
                <div
                  key={inv.investigationId}
                  className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-orange-400">{inv.investigationId}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                            {inv.relevanceCategory} RELEVANCE
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">{inv.investigationTitle}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black font-mono text-white">{inv.relevanceScore}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">PRIORITY</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-normal mb-3">{inv.explanation}</p>

                    {/* Matched vs Unmatched Pills */}
                    <div className="space-y-2 text-[11px]">
                      {inv.matchedCriteria.length > 0 && (
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">
                            Matched Criteria ({inv.matchedCriteria.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {inv.matchedCriteria.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-900/80"
                              >
                                ✓ {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {inv.unmatchedCriteria.length > 0 && (
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">
                            Unmatched / Discrepant ({inv.unmatchedCriteria.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {inv.unmatchedCriteria.map((u, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-900/80"
                              >
                                ✗ {u}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {inv.incompatibilityWarnings.length > 0 && (
                        <div className="mt-2 p-2 rounded bg-amber-950/30 border border-amber-900/50 text-amber-300 text-[11px]">
                          {inv.incompatibilityWarnings.map((w, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <span>⚠️</span>
                              <span>{w}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Claims Traceability */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div>
                      {inv.relevantClaims.length > 0 ? (
                        <span>Claims: {inv.relevantClaims.slice(0, 3).join(', ')}</span>
                      ) : (
                        <span>No indexed claims</span>
                      )}
                    </div>
                    {inv.relevantRecords.length > 0 && (
                      <Link
                        href={`/explore?investigation=${inv.investigationId}`}
                        className="text-orange-400 hover:text-orange-300 underline font-sans text-xs"
                      >
                        Inspect {inv.relevantRecords.length} records →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Parameter Coverage Matrix */}
        <section className="bg-slate-900/60 rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Parameter Coverage Matrix</h2>
            <p className="text-xs text-slate-400">
              Detailed condition-by-condition comparison against documented NASA flight bounds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Physical Parameter</th>
                  <th className="py-2.5 px-3">Target Condition</th>
                  <th className="py-2.5 px-3">Available NASA Range</th>
                  <th className="py-2.5 px-3">Coverage Status</th>
                  <th className="py-2.5 px-3">Source & Assessment Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {assessment.coverageMatrix.map((row, idx) => {
                  const statusBadge =
                    row.status === 'EVIDENCE_AVAILABLE'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : row.status === 'PARTIAL_EVIDENCE'
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800';

                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{row.parameter}</td>
                      <td className="py-3 px-3 font-mono text-orange-300">{row.requestedValue}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{row.availableRange}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusBadge}`}>
                          {row.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <div className="leading-relaxed">{row.differenceDescription}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Ref: {row.bestMatchingInvestigation}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Evidence-Gap Report */}
        <section className="bg-slate-900/60 rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Evidence-Gap Report</h2>
              <p className="text-xs text-slate-400">
                Missing conditions and insufficiently characterized physical regimes requiring targeted experimental research.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {assessment.gaps.length} Gaps Identified
            </span>
          </div>

          {assessment.gaps.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No evidence gaps detected. All target parameters match verified NASA flight conditions.
            </div>
          ) : (
            <div className="space-y-3">
              {assessment.gaps.map((gap) => {
                const isCrit = gap.gapSeverity === 'CRITICAL_GAP';
                return (
                  <div
                    key={gap.gapId}
                    className={`p-4 rounded-lg border text-xs space-y-2 ${
                      isCrit
                        ? 'bg-red-950/20 border-red-900/50 text-red-200'
                        : 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-white">
                          {gap.gapId}
                        </span>
                        <span className="font-semibold text-white">{gap.parameterName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isCrit
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {gap.gapSeverity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block">Requested Condition:</span>
                        <span className="font-mono text-orange-300">{gap.requestedCondition}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Available Flight Evidence:</span>
                        <span className="font-mono text-slate-300">{gap.availableCondition}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-xs">{gap.explanation}</p>

                    <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                      <div>
                        <strong className="text-slate-300">Research Needed: </strong>
                        <span>{gap.requiredResearch}</span>
                      </div>
                      <div className="font-mono text-[10px] shrink-0 text-orange-400">
                        Citations: {gap.supportingCitations.join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400 font-mono">
        FIRELINE · NASA Space Apps Challenge 2026 · Moon Sanctum Labs — Decode. Build. Evolve.
      </footer>
    </div>
  );
}

export default function AssessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 p-8 text-center text-xs font-mono">Loading Evidence Assessor...</div>}>
      <AssessInner />
    </Suspense>
  );
}
