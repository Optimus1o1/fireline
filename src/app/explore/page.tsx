'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  Info,
  RotateCcw,
  Scale,
  GitCompare,
  X,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EvidenceRecord, InvestigationSummary } from '@/types/evidence';
import { ComparisonAnalysis } from '@/lib/physicalComparabilityEngine';

export default function ExplorePage() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');
  const [selectedGeometry, setSelectedGeometry] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Active detail modal/drawer
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);

  // Comparison State
  const [compareList, setCompareList] = useState<EvidenceRecord[]>([]);
  const [comparisonAnalysis, setComparisonAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Reactive search function
  const executeSearch = useCallback(
    async (
      q = query,
      inv = selectedInvestigation,
      mat = selectedMaterial,
      geom = selectedGeometry,
      stat = selectedStatus
    ) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (q.trim()) params.append('q', q.trim());
        if (inv !== 'ALL') params.append('investigation', inv);
        if (mat !== 'ALL') params.append('material', mat);
        if (geom !== 'ALL') params.append('geometry', geom);
        if (stat !== 'ALL') params.append('status', stat);

        const res = await fetch(`/api/evidence/search?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setRecords(data.records);
          if (
            data.records.length > 0 &&
            (!selectedRecord || !data.records.some((r: EvidenceRecord) => r.id === selectedRecord.id))
          ) {
            setSelectedRecord(data.records[0]);
          }
        }
      } catch (err) {
        setError('Search query failed');
      } finally {
        setLoading(false);
      }
    },
    [query, selectedInvestigation, selectedMaterial, selectedGeometry, selectedStatus, selectedRecord]
  );

  // Fetch initial data
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const [invRes, recRes] = await Promise.all([
          fetch('/api/investigations'),
          fetch('/api/evidence/search'),
        ]);

        const invData = await invRes.json();
        const recData = await recRes.json();

        if (invData.success) setInvestigations(invData.investigations);
        if (recData.success) {
          setRecords(recData.records);
          if (recData.records.length > 0) setSelectedRecord(recData.records[0]);
        }
      } catch (err) {
        setError('Failed to connect to FIRELINE scientific evidence API');
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const resetFilters = async () => {
    setQuery('');
    setSelectedInvestigation('ALL');
    setSelectedMaterial('ALL');
    setSelectedGeometry('ALL');
    setSelectedStatus('ALL');
    try {
      setLoading(true);
      const res = await fetch('/api/evidence/search');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        if (data.records.length > 0) setSelectedRecord(data.records[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (rec: EvidenceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some((r) => r.id === rec.id)) {
      setCompareList(compareList.filter((r) => r.id !== rec.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], rec]);
      } else {
        setCompareList([...compareList, rec]);
      }
    }
  };

  const triggerCompareAnalysis = async () => {
    if (compareList.length !== 2) return;
    try {
      setIsComparing(true);
      const res = await fetch('/api/evidence/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordAId: compareList[0].id,
          recordBId: compareList[1].id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComparisonAnalysis(data.comparison);
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      {/* Scope Transparency Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Indexed NASA Flight Corpus:</strong> Saffire-I (5 flight rows / 2 accepted specimens), BASS-II (5 representative thin-film rows of 130), FLEX (audited droplet claims).
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          {compareList.length > 0 && (
            <button
              onClick={triggerCompareAnalysis}
              disabled={compareList.length !== 2}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                compareList.length === 2
                  ? 'bg-flame text-white hover:bg-flame-bright shadow-ember-sm'
                  : 'bg-white/10 text-paper-dim cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Selected ({compareList.length}/2)</span>
            </button>
          )}
          <span className="text-[11px] text-amber-400/80 font-mono">NON-FABRICATED EMPIRICAL RECORDS</span>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Filter Panel */}
        <aside className="w-full md:w-80 border-r border-ember-border p-5 space-y-5 bg-ember-subtle/60 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Filter className="w-4 h-4 text-flame-bright" />
              <span>Scientific Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-paper-muted hover:text-flame-bright flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-paper-muted">Search Query / Run ID</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  executeSearch(e.target.value, selectedInvestigation, selectedMaterial, selectedGeometry, selectedStatus);
                }}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                placeholder="e.g. S1, B1, PMMA, SIBAL..."
                className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white placeholder-paper-dim focus:outline-none focus:border-flame-bright"
              />
              <button
                onClick={() => executeSearch()}
                className="absolute right-2.5 top-2.5 text-paper-dim hover:text-flame-bright"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Investigation Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-paper-muted">Investigation</label>
            <select
              value={selectedInvestigation}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedInvestigation(val);
                executeSearch(query, val, selectedMaterial, selectedGeometry, selectedStatus);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              <option value="ALL">All Investigations</option>
              <option value="PSI-98">Saffire-I (PSI-98)</option>
              <option value="PSI-25">BASS-II (PSI-25)</option>
            </select>
          </div>

          {/* Material Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-paper-muted">Fuel Material</label>
            <select
              value={selectedMaterial}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMaterial(val);
                executeSearch(query, selectedInvestigation, val, selectedGeometry, selectedStatus);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              <option value="ALL">All Materials</option>
              <option value="PMMA">PMMA (Acrylic)</option>
              <option value="SIBAL">SIBAL Fabric (Cotton-Fiberglass)</option>
            </select>
          </div>

          {/* Geometry Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-paper-muted">Sample Geometry</label>
            <select
              value={selectedGeometry}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGeometry(val);
                executeSearch(query, selectedInvestigation, selectedMaterial, val, selectedStatus);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              <option value="ALL">All Geometries</option>
              <option value="thin_film">Thin Film (BASS-II)</option>
              <option value="fabric">Solid Fabric Pack (Saffire-I)</option>
              <option value="flow_visualization">Flow Visualization Diagnostics</option>
            </select>
          </div>

          {/* Verification Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-paper-muted">Validation Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStatus(val);
                executeSearch(query, selectedInvestigation, selectedMaterial, selectedGeometry, val);
              }}
              className="w-full bg-ember-bg border border-ember-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-flame-bright"
            >
              <option value="ALL">All Dispositions</option>
              <option value="VALID_RECORD">Valid Specimen Record</option>
              <option value="REQUIRES_REVIEW">Requires Review / Diagnostic</option>
            </select>
          </div>

          <button
            onClick={() => executeSearch()}
            className="w-full bg-flame hover:bg-flame-bright text-white font-bold rounded-xl py-2.5 text-xs transition-all shadow-ember"
          >
            Apply Filters
          </button>
        </aside>

        {/* Center Results Grid */}
        <section className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h2 className="text-base font-bold text-white">
              Scientific Evidence Records ({records.length})
            </h2>
            <span className="text-xs text-paper-dim">
              {loading ? 'Querying records...' : 'Click card to inspect full experimental details'}
            </span>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-ember-border space-y-2">
              <p className="text-sm font-semibold text-white">No records match the selected criteria</p>
              <p className="text-xs text-paper-dim">Try adjusting your material or investigation filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {records.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                const isInCompare = compareList.some((r) => r.id === rec.id);

                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-4 rounded-2xl glass-panel border cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-flame-bright bg-flame/10 shadow-ember-sm ring-1 ring-flame-bright/30'
                        : 'border-ember-border hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-flame-bright">
                            {rec.runId}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-paper-muted border border-white/10 font-mono">
                            {rec.investigationId}
                          </span>
                          {rec.disposition === 'REQUIRES_REVIEW' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Diagnostic
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">{rec.material}</h3>
                      </div>

                      {/* Compare Checkbox Button */}
                      <button
                        onClick={(e) => toggleCompare(rec, e)}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-colors ${
                          isInCompare
                            ? 'bg-flame text-white border-flame font-bold'
                            : 'bg-ember-surface text-paper-muted border-white/10 hover:border-flame-bright'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isInCompare ? 'Selected' : 'Compare'}</span>
                      </button>
                    </div>

                    {/* Physical Specs */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-paper-muted font-mono">
                      <div>
                        <span className="text-paper-dim">Atmosphere: </span>
                        <span className="text-white font-medium">
                          {rec.environmentalConditions.oxygenRaw ||
                            `${(rec.environmentalConditions.oxygenMoleFraction! * 100).toFixed(1)}% O₂`}
                        </span>
                      </div>
                      <div>
                        <span className="text-paper-dim">Pressure: </span>
                        <span className="text-white font-medium">
                          {rec.environmentalConditions.pressureKpa} kPa
                        </span>
                      </div>
                      <div>
                        <span className="text-paper-dim">Flow: </span>
                        <span className="text-white font-medium">
                          {rec.environmentalConditions.isFlowUncalibrated
                            ? `Fan #${rec.environmentalConditions.fanDisplayIndex} (Uncal.)`
                            : `${rec.environmentalConditions.flowVelocityCmS} cm/s`}
                        </span>
                      </div>
                      <div>
                        <span className="text-paper-dim">Thickness: </span>
                        <span className="text-white font-medium">
                          {rec.dimensions.thicknessRaw
                            ? `${rec.dimensions.thicknessRaw} (${rec.dimensions.thicknessMm} mm)`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Discrepancy Alert */}
                    {rec.discrepancyWarnings.length > 0 && (
                      <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{rec.discrepancyWarnings[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Detail Inspector Panel */}
        {selectedRecord && (
          <aside className="w-full md:w-96 border-l border-ember-border p-6 space-y-6 bg-ember-subtle/80 overflow-y-auto">
            <div>
              <div className="flex items-center space-x-2 text-xs text-flame-bright font-mono">
                <span>{selectedRecord.investigationTitle}</span>
                <span>•</span>
                <span>{selectedRecord.runId}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">{selectedRecord.material}</h2>
              <p className="text-xs text-paper-dim mt-0.5">{selectedRecord.facility}</p>
            </div>

            {/* Scientific Discrepancy Warnings */}
            {selectedRecord.discrepancyWarnings.length > 0 && (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Unresolved Physical Discrepancy</span>
                </div>
                {selectedRecord.discrepancyWarnings.map((w, idx) => (
                  <p key={idx} className="text-xs text-amber-200 leading-relaxed">
                    {w}
                  </p>
                ))}
              </div>
            )}

            {/* Specimen Dimensions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
                Specimen Dimensions
              </h4>
              <div className="p-3.5 rounded-xl glass-panel border border-white/5 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-paper-dim">Reported Thickness:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.dimensions.thicknessRaw || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Normalized SI Thickness:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.dimensions.thicknessMm
                      ? `${selectedRecord.dimensions.thicknessMm} mm`
                      : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Length × Width:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.dimensions.lengthMm
                      ? `${selectedRecord.dimensions.lengthMm} × ${selectedRecord.dimensions.widthMm} mm`
                      : selectedRecord.dimensions.widthMm
                      ? `${selectedRecord.dimensions.widthMm} mm wide`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Geometry Classification:</span>
                  <span className="text-flame-bright font-semibold">
                    {selectedRecord.geometry}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
                Atmospheric & Flow Regime
              </h4>
              <div className="p-3.5 rounded-xl glass-panel border border-white/5 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-paper-dim">Reported Oxygen:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.environmentalConditions.oxygenRaw || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Ambient Pressure:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.environmentalConditions.pressureKpa} kPa (
                    {selectedRecord.environmentalConditions.pressurePsiaRaw} psia)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Airflow Velocity:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.environmentalConditions.isFlowUncalibrated
                      ? 'UNAVAILABLE (Uncalibrated Fan Index)'
                      : `${selectedRecord.environmentalConditions.flowVelocityCmS} cm/s`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Fan Display Setting:</span>
                  <span className="text-white font-semibold">
                    {selectedRecord.environmentalConditions.fanDisplayIndex ?? 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Source Lineage & Provenance */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
                Source Provenance
              </h4>
              <div className="p-3.5 rounded-xl glass-panel border border-white/5 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-paper-dim">Source Artifact:</span>
                  <span className="text-flame-bright">{selectedRecord.sourceArtifact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Table Row:</span>
                  <span className="text-white">Row #{selectedRecord.sourceRowNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">DOI:</span>
                  <span className="text-white">{selectedRecord.doi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-paper-dim">Validation Status:</span>
                  <span className="text-emerald-400">{selectedRecord.validationStatus}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <a
                    href={selectedRecord.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-flame-bright hover:underline text-xs"
                  >
                    <span>View NASA PSI Collection</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Side-by-Side Comparison Drawer Modal */}
      {comparisonAnalysis && (
        <div className="fixed inset-0 z-50 bg-ember-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated border border-ember-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-ember-surface/95 z-10">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-flame-bright" />
                <h3 className="font-bold text-base text-white">Physical Comparability Analysis</h3>
              </div>
              <button
                onClick={() => setComparisonAnalysis(null)}
                className="text-paper-dim hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparability Outcome Banner */}
            <div className="p-6 space-y-4">
              <div
                className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                  comparisonAnalysis.disposition === 'DIRECTLY_COMPARABLE'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : comparisonAnalysis.disposition === 'CONDITIONALLY_COMPARABLE'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-flame/10 border-flame/30 text-flame-bright'
                }`}
              >
                {comparisonAnalysis.disposition === 'DIRECTLY_COMPARABLE' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : comparisonAnalysis.disposition === 'CONDITIONALLY_COMPARABLE' ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    Disposition: {comparisonAnalysis.disposition.replace('_', ' ')}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {comparisonAnalysis.overallExplanation}
                  </p>
                </div>
              </div>

              {/* Side-by-Side Metadata Cards */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Left Card: Record A */}
                <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-flame-bright">
                    RECORD A
                  </span>
                  <h5 className="font-bold text-sm text-white">{comparisonAnalysis.recordA.runId}</h5>
                  <p className="text-xs text-paper-muted">{comparisonAnalysis.recordA.material}</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-white/5 text-paper-dim font-mono">
                    <p>Geometry: <span className="text-white">{comparisonAnalysis.recordA.geometry}</span></p>
                    <p>Atmosphere: <span className="text-white">{comparisonAnalysis.recordA.environmentalConditions.oxygenRaw || `${(comparisonAnalysis.recordA.environmentalConditions.oxygenMoleFraction! * 100).toFixed(1)}% O₂`}</span></p>
                    <p>Pressure: <span className="text-white">{comparisonAnalysis.recordA.environmentalConditions.pressureKpa} kPa</span></p>
                  </div>
                </div>

                {/* Right Card: Record B */}
                <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    RECORD B
                  </span>
                  <h5 className="font-bold text-sm text-white">{comparisonAnalysis.recordB.runId}</h5>
                  <p className="text-xs text-paper-muted">{comparisonAnalysis.recordB.material}</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-white/5 text-paper-dim font-mono">
                    <p>Geometry: <span className="text-white">{comparisonAnalysis.recordB.geometry}</span></p>
                    <p>Atmosphere: <span className="text-white">{comparisonAnalysis.recordB.environmentalConditions.oxygenRaw || `${(comparisonAnalysis.recordB.environmentalConditions.oxygenMoleFraction! * 100).toFixed(1)}% O₂`}</span></p>
                    <p>Pressure: <span className="text-white">{comparisonAnalysis.recordB.environmentalConditions.pressureKpa} kPa</span></p>
                  </div>
                </div>
              </div>

              {/* Prohibited Scientific Claims */}
              {comparisonAnalysis.prohibitedClaims.length > 0 && (
                <div className="p-3.5 rounded-xl border border-flame/30 bg-flame/10 space-y-1">
                  <h6 className="text-xs font-bold text-flame-bright flex items-center space-x-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Scientifically Prohibited Claims</span>
                  </h6>
                  <ul className="list-disc list-inside text-xs text-flame-bright/90 space-y-0.5">
                    {comparisonAnalysis.prohibitedClaims.map((claim, idx) => (
                      <li key={idx}>{claim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-ember-surface/90 flex justify-between items-center">
              <Link
                href="/compare"
                className="text-xs text-flame-bright hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Open Full 5-Gate Comparability Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setComparisonAnalysis(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
