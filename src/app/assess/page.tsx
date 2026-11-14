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
import {
  ShieldAlert,
  Flame,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  Sliders,
  Scale,
  Compass,
} from 'lucide-react';

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

  // Safe input handler preventing NaN lockup
  const handleNumericChange = (
    field: keyof MissionScenario,
    rawVal: string,
    min = 0,
    max = 999
  ) => {
    setSelectedPresetId('custom');
    if (rawVal === '' || rawVal === '-') {
      setScenario((prev) => ({
        ...prev,
        [field]: '' as any,
        isUserModified: true,
      }));
      return;
    }

    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      setScenario((prev) => {
        const clamped = Math.max(min, Math.min(max, num));
        const updated = { ...prev, [field]: clamped, isUserModified: true };
        if (field === 'pressureKpa') {
          updated.pressurePsia = parseFloat((clamped * 0.145038).toFixed(2));
        }
        return updated;
      });
    }
  };

  const handleFieldChange = (field: keyof MissionScenario, value: any) => {
    setSelectedPresetId('custom');
    setScenario((prev) => ({ ...prev, [field]: value, isUserModified: true }));
  };

  const handleAssess = () => {
    setIsAssessing(true);

    // Normalize empty strings to defaults before assessment
    const normalizedScenario: MissionScenario = {
      ...scenario,
      gravity_g: Number(scenario.gravity_g) || 0,
      oxygenPercent: Number(scenario.oxygenPercent) || 21,
      pressureKpa: Number(scenario.pressureKpa) || 101.3,
      flowVelocityCmS:
        scenario.flowVelocityCmS === null || scenario.flowVelocityCmS === ('' as any)
          ? null
          : Number(scenario.flowVelocityCmS),
    };

    setTimeout(() => {
      const res = EvidenceGapAssessorEngine.assessMission(normalizedScenario);
      setAssessment(res);
      setIsAssessing(false);
    }, 150);
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      {/* Title & Scope Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ember-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-flame/10 text-flame-bright border border-flame/30 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-flame-bright animate-pulse" />
            <span>DETERMINISTIC RETRIEVAL & COVERAGE RANKING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Spacecraft Mission Evidence-Gap Assessor
          </h1>
          <p className="mt-1 text-sm text-paper-muted max-w-3xl leading-relaxed">
            Define target exploration atmospheres and gravitational regimes to evaluate how well
            indexed NASA microgravity combustion datasets (Saffire-I, BASS-II, FLEX) cover your mission parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/copilot?q=${encodeURIComponent(
              `Assess research evidence availability for ${scenario.name} (${scenario.oxygenPercent}% O2 at ${scenario.pressureKpa} kPa, ${scenario.gravity_g}g)`
            )}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-flame/15 hover:bg-flame/25 text-flame-bright text-xs font-bold border border-flame/30 transition-all shadow-ember-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Query SI Copilot on Scenario</span>
          </Link>
        </div>
      </div>

      {/* Epistemic Disclaimer Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-300 font-semibold">SCIENTIFIC INTEGRITY SAFEGUARD: </strong>
          <span>
            FIRELINE evaluates research evidence availability and physical comparability; it does not
            certify spacecraft fire safety or predict fire probability. Relevance scores reflect algorithmic
            retrieval priority, never experimental certainty.
          </span>
        </div>
      </div>

      {/* SECTION 1: Mission Presets & Editable Environment Controls */}
      <section className="glass-panel-elevated rounded-3xl border border-ember-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>1. Select Mission Scenario Benchmark</span>
              {scenario.isUserModified && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-flame/20 text-flame-bright border border-flame/30 font-mono">
                  Custom Modified
                </span>
              )}
            </h2>
            <p className="text-xs text-paper-muted mt-0.5">
              Choose a documented space agency reference mission or manually fine-tune parameters below.
            </p>
          </div>
        </div>

        {/* Preset Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MISSION_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`text-left p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-flame/15 border-flame/50 ring-1 ring-flame-bright/40 text-white shadow-ember-sm'
                    : 'glass-panel border-ember-border hover:border-white/20 text-paper-muted'
                }`}
              >
                <div>
                  <div className="font-bold text-sm mb-1 text-white">{p.name}</div>
                  <div className="text-paper-dim text-xs line-clamp-2 leading-relaxed mb-3">
                    {p.description}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-white/5 font-mono text-[10px] text-paper-dim">
                  <span className="bg-ember-surface px-1.5 py-0.5 rounded">{p.oxygenPercent}% O₂</span>
                  <span className="bg-ember-surface px-1.5 py-0.5 rounded">{p.pressureKpa} kPa</span>
                  <span className="bg-ember-surface px-1.5 py-0.5 rounded">{p.gravity_g}g</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Condition Controls (Grid Form) */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-flame-bright" />
              <span>2. Environmental & Specimen Parameters</span>
            </h3>
            <span className="text-xs text-paper-dim font-mono">Real-time Parameter Tuning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Scenario Name */}
            <div className="space-y-1.5">
              <label htmlFor={scenarioNameId} className="font-semibold text-paper-muted">
                Mission Name
              </label>
              <input
                id={scenarioNameId}
                type="text"
                value={scenario.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright text-xs"
              />
            </div>

            {/* Gravity Regime */}
            <div className="space-y-1.5">
              <label htmlFor={gravityRegimeId} className="font-semibold text-paper-muted">
                Gravity Regime
              </label>
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
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright text-xs"
              >
                <option value="microgravity">Microgravity (~10⁻⁶ g)</option>
                <option value="lunar">Lunar Surface (0.16g)</option>
                <option value="martian">Martian Surface (0.38g)</option>
                <option value="terrestrial">Terrestrial 1g (Ground)</option>
              </select>
            </div>

            {/* Gravity Acceleration (g) */}
            <div className="space-y-1.5">
              <label htmlFor={gravityValueId} className="font-semibold text-paper-muted">
                Gravity Value (g)
              </label>
              <input
                id={gravityValueId}
                type="number"
                step="0.01"
                min="0"
                max="1.5"
                value={scenario.gravity_g}
                onChange={(e) => handleNumericChange('gravity_g', e.target.value, 0, 2)}
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright font-mono text-xs"
              />
            </div>

            {/* Oxygen Concentration */}
            <div className="space-y-1.5">
              <label htmlFor={oxygenPercentId} className="font-semibold text-paper-muted">
                Oxygen Concentration (% O₂)
              </label>
              <input
                id={oxygenPercentId}
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={scenario.oxygenPercent}
                onChange={(e) => handleNumericChange('oxygenPercent', e.target.value, 0, 100)}
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright font-mono text-xs"
              />
            </div>

            {/* Total Pressure (kPa) */}
            <div className="space-y-1.5">
              <label htmlFor={pressureKpaId} className="font-semibold text-paper-muted">
                Pressure (kPa)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  id={pressureKpaId}
                  type="number"
                  step="0.1"
                  min="1"
                  max="200"
                  value={scenario.pressureKpa}
                  onChange={(e) => handleNumericChange('pressureKpa', e.target.value, 1, 300)}
                  className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright font-mono text-xs"
                />
                <span className="text-paper-dim font-mono text-[11px] shrink-0">
                  ≈ {scenario.pressurePsia} psia
                </span>
              </div>
            </div>

            {/* Flow Speed */}
            <div className="space-y-1.5">
              <label htmlFor={flowVelocityId} className="font-semibold text-paper-muted">
                Flow Speed (cm/s)
              </label>
              <input
                id={flowVelocityId}
                type="number"
                step="0.5"
                min="0"
                max="60"
                value={scenario.flowVelocityCmS ?? ''}
                onChange={(e) => handleNumericChange('flowVelocityCmS', e.target.value, 0, 100)}
                placeholder="e.g. 20.0"
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright font-mono text-xs"
              />
            </div>

            {/* Flow Direction */}
            <div className="space-y-1.5">
              <label htmlFor={flowDirectionId} className="font-semibold text-paper-muted">
                Flow Direction
              </label>
              <select
                id={flowDirectionId}
                value={scenario.flowDirection}
                onChange={(e) => handleFieldChange('flowDirection', e.target.value as FlowDirection)}
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright text-xs"
              >
                <option value="concurrent">Concurrent (Wind with flame)</option>
                <option value="opposed">Opposed (Wind against flame)</option>
                <option value="quiescent">Quiescent (Zero forced flow, pure diffusion)</option>
                <option value="unspecified">Unspecified / Any</option>
              </select>
            </div>

            {/* Target Material */}
            <div className="space-y-1.5">
              <label htmlFor={materialTargetId} className="font-semibold text-paper-muted">
                Target Fuel Material
              </label>
              <input
                id={materialTargetId}
                type="text"
                value={scenario.materialTarget}
                onChange={(e) => handleFieldChange('materialTarget', e.target.value)}
                placeholder="e.g. PMMA, SIBAL Fabric, Nomex"
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright text-xs"
              />
            </div>

            {/* Specimen Geometry */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor={geometryTargetId} className="font-semibold text-paper-muted">
                Specimen Geometry & Biot Regime
              </label>
              <input
                id={geometryTargetId}
                type="text"
                value={scenario.geometryTarget}
                onChange={(e) => handleFieldChange('geometryTarget', e.target.value)}
                placeholder="e.g. Thin Sheet / Film (Bi << 0.1), Cylindrical Rod (Bi > 1), Large Panel"
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-flame-bright text-xs"
              />
            </div>

            {/* Assess Trigger Action */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                onClick={handleAssess}
                disabled={isAssessing}
                className="w-full h-[38px] bg-flame hover:bg-flame-bright text-white font-bold px-4 rounded-xl shadow-ember text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {isAssessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Flight Coverage...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Assess Evidence Coverage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Overall Assessment Outcome */}
      <section className="glass-panel-elevated rounded-3xl border border-ember-border p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Assessment Outcome</h2>
            <span className="text-xs text-paper-dim">
              Deterministic coverage audit against verified flight archives
            </span>
          </div>
          <div>
            {assessment.overallStatus === 'EVIDENCE_GAP' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-flame/15 text-flame-bright border border-flame/40 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>EVIDENCE GAP DETECTED ({assessment.criticalGapsCount} CRITICAL)</span>
              </span>
            )}
            {assessment.overallStatus === 'PARTIAL_EVIDENCE' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PARTIAL EVIDENCE AVAILABLE</span>
              </span>
            )}
            {assessment.overallStatus === 'EVIDENCE_AVAILABLE' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>DIRECT EVIDENCE AVAILABLE</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-paper leading-relaxed font-sans bg-ember-bg/70 p-4 rounded-2xl border border-ember-border">
          {assessment.summary}
        </p>
      </section>

      {/* SECTION 3: Investigation Relevance Rankings */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Investigation Relevance Ranking</h2>
            <p className="text-xs text-paper-muted">
              Ranked by physical phase, fuel chemistry, atmosphere, gravity, and measurement completeness.
            </p>
          </div>
          <span className="text-[11px] font-mono text-paper-dim bg-ember-surface px-2.5 py-1 rounded-lg border border-white/5">
            Score: Algorithmic Retrieval Priority (0-100)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessment.investigationRankings.map((inv) => {
            const badgeColor =
              inv.relevanceCategory === 'HIGH'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : inv.relevanceCategory === 'PARTIAL'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : inv.relevanceCategory === 'LIMITED'
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                : 'bg-white/5 text-paper-muted border-white/10';

            return (
              <div
                key={inv.investigationId}
                className="glass-panel rounded-2xl border border-ember-border p-5 flex flex-col justify-between space-y-4 hover:border-flame/30 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-flame-bright">
                          {inv.investigationId}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                          {inv.relevanceCategory} RELEVANCE
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{inv.investigationTitle}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-white">{inv.relevanceScore}</div>
                      <div className="text-[9px] uppercase tracking-wider text-paper-dim font-mono">PRIORITY</div>
                    </div>
                  </div>

                  <p className="text-xs text-paper-muted leading-relaxed mb-3">{inv.explanation}</p>

                  <div className="space-y-2 text-[11px]">
                    {inv.matchedCriteria.length > 0 && (
                      <div>
                        <span className="text-paper-dim font-mono text-[10px] uppercase block mb-1">
                          Matched Criteria ({inv.matchedCriteria.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inv.matchedCriteria.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            >
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {inv.unmatchedCriteria.length > 0 && (
                      <div>
                        <span className="text-paper-dim font-mono text-[10px] uppercase block mb-1">
                          Unmatched / Discrepant ({inv.unmatchedCriteria.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inv.unmatchedCriteria.map((u, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-flame/10 text-flame-bright border border-flame/20"
                            >
                              ✗ {u}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {inv.incompatibilityWarnings.length > 0 && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                        {inv.incompatibilityWarnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-paper-dim">
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
                      className="text-flame-bright hover:underline font-semibold font-sans text-xs flex items-center space-x-1"
                    >
                      <span>Inspect {inv.relevantRecords.length} records</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Parameter Coverage Matrix */}
      <section className="glass-panel rounded-3xl border border-ember-border p-6 sm:p-8 space-y-4">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-base font-bold text-white">Parameter Coverage Matrix</h2>
          <p className="text-xs text-paper-muted">
            Condition-by-condition comparison against documented NASA flight envelopes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ember-surface text-paper-muted font-mono uppercase tracking-wider text-[10px] border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Physical Parameter</th>
                <th className="py-2.5 px-3">Target Condition</th>
                <th className="py-2.5 px-3">Available NASA Range</th>
                <th className="py-2.5 px-3">Coverage Status</th>
                <th className="py-2.5 px-3">Assessment Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-paper">
              {assessment.coverageMatrix.map((row, idx) => {
                const statusBadge =
                  row.status === 'EVIDENCE_AVAILABLE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : row.status === 'PARTIAL_EVIDENCE'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-flame/10 text-flame-bright border-flame/30';

                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{row.parameter}</td>
                    <td className="py-3 px-3 font-mono text-flame-bright">{row.requestedValue}</td>
                    <td className="py-3 px-3 font-mono text-paper-dim">{row.availableRange}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusBadge}`}>
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-paper-muted">
                      <div className="leading-relaxed">{row.differenceDescription}</div>
                      <div className="text-[10px] font-mono text-paper-dim mt-0.5">
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

      {/* SECTION 5: Evidence-Gap Report */}
      <section className="glass-panel-elevated rounded-3xl border border-ember-border p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Evidence-Gap Report</h2>
            <p className="text-xs text-paper-muted">
              Missing flight conditions and uncharacterized physical regimes requiring targeted experimental research.
            </p>
          </div>
          <span className="text-xs font-mono text-paper-dim">
            {assessment.gaps.length} Gaps Identified
          </span>
        </div>

        {assessment.gaps.length === 0 ? (
          <div className="p-6 text-center text-paper-dim text-xs">
            No evidence gaps detected. All target parameters match verified NASA flight conditions.
          </div>
        ) : (
          <div className="space-y-3">
            {assessment.gaps.map((gap) => {
              const isCrit = gap.gapSeverity === 'CRITICAL_GAP';
              return (
                <div
                  key={gap.gapId}
                  className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                    isCrit
                      ? 'bg-flame/10 border-flame/30 text-paper'
                      : 'bg-amber-500/10 border-amber-500/30 text-paper'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] bg-ember-bg px-2 py-0.5 rounded border border-ember-border text-white">
                        {gap.gapId}
                      </span>
                      <span className="font-bold text-white">{gap.parameterName}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCrit
                          ? 'bg-flame/20 text-flame-bright border-flame/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {gap.gapSeverity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-ember-surface/80 p-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-paper-dim block">Requested Condition:</span>
                      <span className="font-mono text-flame-bright">{gap.requestedCondition}</span>
                    </div>
                    <div>
                      <span className="text-paper-dim block">Available Flight Evidence:</span>
                      <span className="font-mono text-paper">{gap.availableCondition}</span>
                    </div>
                  </div>

                  <p className="text-paper-muted leading-relaxed text-xs">{gap.explanation}</p>

                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-paper-dim">
                    <div>
                      <strong className="text-paper">Research Needed: </strong>
                      <span>{gap.requiredResearch}</span>
                    </div>
                    <div className="font-mono text-[10px] shrink-0 text-flame-bright">
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
  );
}

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ember-bg text-paper p-8 text-center text-xs font-mono">
          Loading Mission Evidence Assessor...
        </div>
      }
    >
      <AssessInner />
    </Suspense>
  );
}
