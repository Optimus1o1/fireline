'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Scale,
  ArrowRight,
  Sparkles,
  Info,
  MinusCircle,
} from 'lucide-react';
import { EvidenceRecord } from '@/types/evidence';
import { ComparisonAnalysis } from '@/lib/physicalComparabilityEngine';

export default function ComparePage() {
  const [allRecords, setAllRecords] = useState<EvidenceRecord[]>([]);
  const [recordAId, setRecordAId] = useState<string>('PSI-98-RUN-01');
  const [recordBId, setRecordBId] = useState<string>('PSI-25-RUN-01');
  const [comparison, setComparison] = useState<ComparisonAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingRecords, setFetchingRecords] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load records
  useEffect(() => {
    async function fetchRecords() {
      try {
        setFetchingRecords(true);
        const res = await fetch('/api/evidence/search');
        const data = await res.json();
        if (data.success && data.records) {
          setAllRecords(data.records);
        }
      } catch (err) {
        setError('Failed to load experimental evidence corpus');
      } finally {
        setFetchingRecords(false);
      }
    }
    fetchRecords();
  }, []);

  // Run comparison
  const runComparison = React.useCallback(async (aId: string, bId: string) => {
    if (!aId || !bId) return;
    if (aId === bId) {
      setError('Please select two distinct experimental runs for physical comparability analysis.');
      setComparison(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/evidence/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordAId: aId, recordBId: bId }),
      });
      const data = await res.json();
      if (data.success) {
        setComparison(data.comparison);
      } else {
        setError(data.error || 'Failed to execute physical comparability analysis');
      }
    } catch (err) {
      setError('Connection failure to Physical Comparability Engine');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run initial comparison when records are loaded
  useEffect(() => {
    if (allRecords.length >= 2) {
      runComparison(recordAId, recordBId);
    }
  }, [allRecords, recordAId, recordBId, runComparison]);

  const selectedRecordA = allRecords.find((r) => r.id === recordAId);
  const selectedRecordB = allRecords.find((r) => r.id === recordBId);

  const getDispositionBadge = (disp: string) => {
    switch (disp) {
      case 'DIRECTLY_COMPARABLE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          label: 'Directly Comparable',
        };
      case 'CONDITIONALLY_COMPARABLE':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: AlertTriangle,
          label: 'Conditionally Comparable (Scaling Model Required)',
        };
      case 'NOT_COMPARABLE':
        return {
          bg: 'bg-flame/10 border-flame/30 text-flame-bright',
          icon: AlertOctagon,
          label: 'Physically Distinct (Not Comparable)',
        };
      default:
        return {
          bg: 'bg-white/5 border-white/10 text-paper-muted',
          icon: Info,
          label: 'Insufficient Metadata',
        };
    }
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ember-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-flame/10 text-flame-bright border border-flame/30 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-flame-bright animate-pulse" />
            <span>DETERMINISTIC SIMILITUDE GATES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Physical Comparability Studio
          </h1>
          <p className="mt-1 text-sm text-paper-muted max-w-3xl leading-relaxed">
            Side-by-side scientific gate analysis determining whether two microgravity combustion
            experiments share physical similitude or exhibit fundamental regime differences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel hover:bg-white/5 border border-ember-border text-paper text-xs font-semibold transition-all"
          >
            <span>Evidence Explorer</span>
          </Link>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-flame hover:bg-flame-bright text-white text-xs font-bold transition-all shadow-ember"
          >
            <span>Mission Assessor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Preset Pair Quick Selectors */}
      <div className="glass-panel p-4 rounded-2xl border border-ember-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-flame-bright" />
          <span>Benchmark Comparison Pairs:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setRecordAId('PSI-98-RUN-01');
              setRecordBId('PSI-25-RUN-01');
              runComparison('PSI-98-RUN-01', 'PSI-25-RUN-01');
            }}
            className="px-3 py-1.5 rounded-lg bg-ember-surface hover:bg-white/10 border border-white/10 text-paper transition-all"
          >
            Saffire-I (SIBAL Fabric) vs BASS-II (PMMA Film)
          </button>
          <button
            onClick={() => {
              setRecordAId('PSI-25-RUN-01');
              setRecordBId('PSI-25-RUN-02');
              runComparison('PSI-25-RUN-01', 'PSI-25-RUN-02');
            }}
            className="px-3 py-1.5 rounded-lg bg-ember-surface hover:bg-white/10 border border-white/10 text-paper transition-all"
          >
            BASS-II Run 1 vs Run 2 (Flow Variation)
          </button>
          <button
            onClick={() => {
              setRecordAId('PSI-98-RUN-01');
              setRecordBId('PSI-98-RUN-02');
              runComparison('PSI-98-RUN-01', 'PSI-98-RUN-02');
            }}
            className="px-3 py-1.5 rounded-lg bg-ember-surface hover:bg-white/10 border border-white/10 text-paper transition-all"
          >
            Saffire-I Run 1 vs Run 2 (Replicate Runs)
          </button>
        </div>
      </div>

      {/* Run Selection Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Record A Selector */}
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-flame-bright px-2 py-0.5 rounded bg-flame/10 border border-flame/20">
              SPECIMEN RUN A
            </span>
            <span className="text-xs text-paper-dim font-mono">{recordAId}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-paper-muted">Select Run from Indexed Corpus</label>
            <select
              value={recordAId}
              onChange={(e) => {
                setRecordAId(e.target.value);
                runComparison(e.target.value, recordBId);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              {allRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.investigationId} ({r.material}) {r.geometry}
                </option>
              ))}
            </select>
          </div>

          {selectedRecordA && (
            <div className="bg-ember-surface/80 rounded-xl p-3.5 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-paper-muted">
                <span>Investigation:</span>
                <span className="text-white font-semibold">{selectedRecordA.investigationId}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Material:</span>
                <span className="text-paper">{selectedRecordA.material}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Geometry:</span>
                <span className="text-paper">{selectedRecordA.geometry}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Atmosphere:</span>
                <span className="text-paper">
                  {selectedRecordA.environmentalConditions.oxygenRaw || `${((selectedRecordA.environmentalConditions.oxygenMoleFraction ?? 0.21) * 100).toFixed(1)}% O₂`} @ {selectedRecordA.environmentalConditions.pressureKpa} kPa
                </span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Flow Speed:</span>
                <span className="text-paper">
                  {selectedRecordA.environmentalConditions.flowVelocityCmS ?? 'N/A'} cm/s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Record B Selector */}
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              SPECIMEN RUN B
            </span>
            <span className="text-xs text-paper-dim font-mono">{recordBId}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-paper-muted">Select Run from Indexed Corpus</label>
            <select
              value={recordBId}
              onChange={(e) => {
                setRecordBId(e.target.value);
                runComparison(recordAId, e.target.value);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              {allRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.investigationId} ({r.material}) {r.geometry}
                </option>
              ))}
            </select>
          </div>

          {selectedRecordB && (
            <div className="bg-ember-surface/80 rounded-xl p-3.5 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-paper-muted">
                <span>Investigation:</span>
                <span className="text-white font-semibold">{selectedRecordB.investigationId}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Material:</span>
                <span className="text-paper">{selectedRecordB.material}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Geometry:</span>
                <span className="text-paper">{selectedRecordB.geometry}</span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Atmosphere:</span>
                <span className="text-paper">
                  {selectedRecordB.environmentalConditions.oxygenRaw || `${((selectedRecordB.environmentalConditions.oxygenMoleFraction ?? 0.21) * 100).toFixed(1)}% O₂`} @ {selectedRecordB.environmentalConditions.pressureKpa} kPa
                </span>
              </div>
              <div className="flex justify-between text-paper-muted">
                <span>Flow Speed:</span>
                <span className="text-paper">
                  {selectedRecordB.environmentalConditions.flowVelocityCmS ?? 'N/A'} cm/s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Analysis Results */}
      {comparison && (
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-ember-border space-y-6">
          {/* Overall Verdict Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-xs uppercase tracking-wider text-paper-dim font-mono">
                EPISTEMIC SIMILITUDE DISPOSITION
              </span>
              <div className="flex items-center gap-3 mt-1">
                {(() => {
                  const badge = getDispositionBadge(comparison.disposition);
                  const Icon = badge.icon;
                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <Link
              href={`/copilot?q=${encodeURIComponent(
                `Explain the physical comparability between ${comparison.recordA.id} and ${comparison.recordB.id}`
              )}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-flame/15 hover:bg-flame/25 text-flame-bright text-xs font-semibold border border-flame/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot to Elaborate</span>
            </Link>
          </div>

          {/* Rationale Narrative */}
          <div className="text-xs leading-relaxed text-paper-muted space-y-2">
            <p className="font-semibold text-paper">Physical Comparison Rationale:</p>
            <p className="bg-ember-bg/70 p-4 rounded-2xl border border-ember-border text-paper">
              {comparison.overallExplanation}
            </p>
          </div>

          {/* Evaluated Gates Breakdown */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluated Physical Safeguard Gates ({comparison.gates.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {comparison.gates.map((g, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{g.gateName}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        g.passed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : g.severity === 'BLOCKER'
                          ? 'bg-flame/20 text-flame-bright'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {g.passed ? 'PASSED' : g.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-paper-muted leading-relaxed">{g.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Scientific Claims */}
          {comparison.prohibitedClaims.length > 0 && (
            <div className="p-4 rounded-2xl border border-flame/30 bg-flame/10 space-y-2">
              <h4 className="text-xs font-bold text-flame-bright flex items-center space-x-1.5">
                <MinusCircle className="w-4 h-4" />
                <span>Scientifically Prohibited Inferences for this Pair</span>
              </h4>
              <ul className="list-disc list-inside text-xs text-flame-bright/90 space-y-1">
                {comparison.prohibitedClaims.map((claim, idx) => (
                  <li key={idx}>{claim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Permitted Interpretations */}
          {comparison.permittedInterpretations.length > 0 && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scientifically Validated Interpretations</span>
              </h4>
              <ul className="list-disc list-inside text-xs text-emerald-200 space-y-1">
                {comparison.permittedInterpretations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
