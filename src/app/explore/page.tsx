'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  Info,
  RotateCcw,
  BookOpen,
  Scale,
  GitCompare,
  X,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
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

  // Fetch investigations & initial records
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

  // Filter effect
  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (selectedInvestigation !== 'ALL') params.append('investigation', selectedInvestigation);
      if (selectedMaterial !== 'ALL') params.append('material', selectedMaterial);
      if (selectedGeometry !== 'ALL') params.append('geometry', selectedGeometry);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);

      const res = await fetch(`/api/evidence/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        if (data.records.length > 0 && (!selectedRecord || !data.records.some((r: EvidenceRecord) => r.id === selectedRecord.id))) {
          setSelectedRecord(data.records[0]);
        }
      }
    } catch (err) {
      setError('Search query failed');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-ink text-bone flex flex-col">
      {/* Header */}
      <header className="border-b border-slate/20 bg-ink/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-copper/10 border border-copper/30 rounded-lg text-copper group-hover:border-copper/60 transition-colors">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg text-bone">FIRELINE</h1>
              <p className="text-xs text-slate">Evidence Explorer & Decision Support</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium text-slate">
          <Link href="/" className="hover:text-bone transition-colors">Overview</Link>
          <span className="text-copper font-semibold">Evidence Explorer</span>
          <a
            href="https://psi.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate hover:text-bone text-xs"
          >
            <span>NASA PSI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </header>

      {/* Dataset Limitation Transparency Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Representative Flight Dataset Indexed:</strong> Saffire-I (5 rows / 2 specimen records), BASS-II (5 representative thin-film rows of 130), FLEX (deferred).
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {compareList.length > 0 && (
            <button
              onClick={triggerCompareAnalysis}
              disabled={compareList.length !== 2}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                compareList.length === 2
                  ? 'bg-copper text-ink hover:bg-copper/90'
                  : 'bg-slate/20 text-slate cursor-not-allowed'
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
        <aside className="w-full md:w-80 border-r border-slate/20 p-5 space-y-5 bg-ink/50 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate/20">
            <div className="flex items-center space-x-2 text-bone font-semibold text-sm">
              <Filter className="w-4 h-4 text-copper" />
              <span>Scientific Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate hover:text-copper flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate">Search Query / Run ID</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. S1, B1, PMMA, SIBAL..."
                className="w-full bg-ink border border-slate/30 rounded-lg px-3 py-2 text-xs text-bone placeholder-slate/50 focus:outline-none focus:border-copper"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 text-slate hover:text-copper"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Investigation Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate">Investigation</label>
            <select
              value={selectedInvestigation}
              onChange={(e) => setSelectedInvestigation(e.target.value)}
              className="w-full bg-ink border border-slate/30 rounded-lg px-3 py-2 text-xs text-bone focus:outline-none focus:border-copper"
            >
              <option value="ALL">All Investigations</option>
              <option value="PSI-98">Saffire-I (PSI-98)</option>
              <option value="PSI-25">BASS-II (PSI-25)</option>
            </select>
          </div>

          {/* Material Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate">Fuel Material</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-ink border border-slate/30 rounded-lg px-3 py-2 text-xs text-bone focus:outline-none focus:border-copper"
            >
              <option value="ALL">All Materials</option>
              <option value="PMMA">PMMA (Acrylic)</option>
              <option value="SIBAL">SIBAL Fabric (Cotton-Fiberglass)</option>
            </select>
          </div>

          {/* Geometry Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate">Sample Geometry</label>
            <select
              value={selectedGeometry}
              onChange={(e) => setSelectedGeometry(e.target.value)}
              className="w-full bg-ink border border-slate/30 rounded-lg px-3 py-2 text-xs text-bone focus:outline-none focus:border-copper"
            >
              <option value="ALL">All Geometries</option>
              <option value="thin_film">Thin Film (BASS-II)</option>
              <option value="fabric">Solid Fabric Pack (Saffire-I)</option>
              <option value="flow_visualization">Flow Visualization Diagnostics</option>
            </select>
          </div>

          {/* Verification Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate">Validation Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-ink border border-slate/30 rounded-lg px-3 py-2 text-xs text-bone focus:outline-none focus:border-copper"
            >
              <option value="ALL">All Dispositions</option>
              <option value="VALID_RECORD">Valid Specimen Record</option>
              <option value="REQUIRES_REVIEW">Requires Review / Diagnostic</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-copper hover:bg-copper/90 text-ink font-semibold rounded-lg py-2 text-xs transition-colors"
          >
            Apply Filters
          </button>
        </aside>

        {/* Center Results Grid */}
        <section className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-bone">
              Scientific Evidence Records ({records.length})
            </h2>
            <span className="text-xs text-slate">
              {loading ? 'Querying records...' : 'Select records for side-by-side comparability'}
            </span>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center border border-slate/20 rounded-xl bg-ink/40 space-y-2">
              <p className="text-sm font-semibold text-slate">No records match the selected criteria</p>
              <p className="text-xs text-slate/60">Try adjusting your material or investigation filters.</p>
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
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-copper bg-copper/5 shadow-lg shadow-copper/5'
                        : 'border-slate/20 bg-ink/40 hover:border-slate/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-copper">{rec.runId}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate/10 text-slate border border-slate/20">
                            {rec.investigationId}
                          </span>
                          {rec.disposition === 'REQUIRES_REVIEW' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Diagnostic
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-bone mt-1">{rec.material}</h3>
                      </div>

                      {/* Compare Checkbox Button */}
                      <button
                        onClick={(e) => toggleCompare(rec, e)}
                        className={`text-xs px-2 py-1 rounded border flex items-center space-x-1 transition-colors ${
                          isInCompare
                            ? 'bg-copper text-ink border-copper font-bold'
                            : 'bg-ink/60 text-slate border-slate/30 hover:border-copper/50'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
                      </button>
                    </div>

                    {/* Physical Specs */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate/20 text-xs text-slate">
                      <div>
                        <span className="text-slate/60">Atmosphere: </span>
                        <span className="text-bone font-medium">
                          {rec.environmentalConditions.oxygenRaw || `${(rec.environmentalConditions.oxygenMoleFraction! * 100).toFixed(1)}% O₂`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate/60">Pressure: </span>
                        <span className="text-bone font-medium">
                          {rec.environmentalConditions.pressureKpa} kPa
                        </span>
                      </div>
                      <div>
                        <span className="text-slate/60">Flow / Vent: </span>
                        <span className="text-bone font-medium">
                          {rec.environmentalConditions.isFlowUncalibrated
                            ? `Fan Index ${rec.environmentalConditions.fanDisplayIndex} (Uncal.)`
                            : `${rec.environmentalConditions.flowVelocityCmS} cm/s`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate/60">Thickness: </span>
                        <span className="text-bone font-medium">
                          {rec.dimensions.thicknessRaw ? `${rec.dimensions.thicknessRaw} (${rec.dimensions.thicknessMm} mm)` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Discrepancy Alert */}
                    {rec.discrepancyWarnings.length > 0 && (
                      <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
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
          <aside className="w-full md:w-96 border-l border-slate/20 p-6 space-y-6 bg-ink/70 overflow-y-auto">
            <div>
              <div className="flex items-center space-x-2 text-xs text-copper font-mono">
                <span>{selectedRecord.investigationTitle}</span>
                <span>•</span>
                <span>{selectedRecord.runId}</span>
              </div>
              <h2 className="text-lg font-extrabold text-bone mt-1">{selectedRecord.material}</h2>
              <p className="text-xs text-slate mt-0.5">{selectedRecord.facility}</p>
            </div>

            {/* Scientific Discrepancy Warnings */}
            {selectedRecord.discrepancyWarnings.length > 0 && (
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unresolved Physical Discrepancy</span>
                </div>
                {selectedRecord.discrepancyWarnings.map((w, idx) => (
                  <p key={idx} className="text-xs text-amber-200/90 leading-relaxed">
                    {w}
                  </p>
                ))}
              </div>
            )}

            {/* Physical Dimensions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate uppercase tracking-wider">Specimen Dimensions</h4>
              <div className="p-3 rounded-lg bg-ink border border-slate/20 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate">Reported Thickness:</span>
                  <span className="text-bone font-mono font-medium">{selectedRecord.dimensions.thicknessRaw || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Normalized SI Thickness:</span>
                  <span className="text-bone font-mono font-medium">{selectedRecord.dimensions.thicknessMm ? `${selectedRecord.dimensions.thicknessMm} mm` : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Length × Width:</span>
                  <span className="text-bone font-mono font-medium">
                    {selectedRecord.dimensions.lengthMm ? `${selectedRecord.dimensions.lengthMm} × ${selectedRecord.dimensions.widthMm} mm` : selectedRecord.dimensions.widthMm ? `${selectedRecord.dimensions.widthMm} mm wide` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Geometry Classification:</span>
                  <span className="text-copper font-medium">{selectedRecord.geometry}</span>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate uppercase tracking-wider">Atmospheric & Flow Regime</h4>
              <div className="p-3 rounded-lg bg-ink border border-slate/20 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate">Reported Oxygen:</span>
                  <span className="text-bone font-mono font-medium">{selectedRecord.environmentalConditions.oxygenRaw || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Ambient Pressure:</span>
                  <span className="text-bone font-mono font-medium">{selectedRecord.environmentalConditions.pressureKpa} kPa ({selectedRecord.environmentalConditions.pressurePsiaRaw} psia)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Airflow Velocity:</span>
                  <span className="text-bone font-mono font-medium">
                    {selectedRecord.environmentalConditions.isFlowUncalibrated
                      ? 'UNAVAILABLE (Uncalibrated Fan Index)'
                      : `${selectedRecord.environmentalConditions.flowVelocityCmS} cm/s`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Fan Display Setting:</span>
                  <span className="text-bone font-mono font-medium">
                    {selectedRecord.environmentalConditions.fanDisplayIndex ?? 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Source Lineage & Provenance */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate uppercase tracking-wider">Source Provenance</h4>
              <div className="p-3 rounded-lg bg-ink border border-slate/20 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate">Source Artifact:</span>
                  <span className="text-copper font-mono">{selectedRecord.sourceArtifact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Table Row:</span>
                  <span className="text-bone font-mono">Row #{selectedRecord.sourceRowNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">DOI:</span>
                  <span className="text-bone font-mono">{selectedRecord.doi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Validation Status:</span>
                  <span className="text-bone font-mono">{selectedRecord.validationStatus}</span>
                </div>
                <div className="pt-2 border-t border-slate/20">
                  <a
                    href={selectedRecord.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-copper hover:underline text-xs"
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

      {/* Side-by-Side Comparison Drawer (TASK-D1-09) */}
      {comparisonAnalysis && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-ink border border-slate/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate/20 flex items-center justify-between sticky top-0 bg-ink/95 z-10">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-copper" />
                <h3 className="font-bold text-base text-bone">Physical Comparability Analysis</h3>
              </div>
              <button
                onClick={() => setComparisonAnalysis(null)}
                className="text-slate hover:text-bone p-1 rounded-lg hover:bg-slate/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparability Outcome Banner */}
            <div className="p-5 space-y-3">
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  comparisonAnalysis.disposition === 'DIRECTLY_COMPARABLE'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : comparisonAnalysis.disposition === 'CONDITIONALLY_COMPARABLE'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {comparisonAnalysis.disposition === 'DIRECTLY_COMPARABLE' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : comparisonAnalysis.disposition === 'CONDITIONALLY_COMPARABLE' ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
                <div className="p-4 rounded-xl bg-ink/60 border border-slate/20 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-copper">RECORD A</span>
                  <h5 className="font-bold text-sm text-bone">{comparisonAnalysis.recordA.runId}</h5>
                  <p className="text-xs text-slate">{comparisonAnalysis.recordA.material}</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate/20 text-slate">
                    <p>Geometry: <span className="text-bone">{comparisonAnalysis.recordA.geometry}</span></p>
                    <p>Atmosphere: <span className="text-bone">{comparisonAnalysis.recordA.environmentalConditions.oxygenRaw || `${(comparisonAnalysis.recordA.environmentalConditions.oxygenMoleFraction!*100).toFixed(1)}% O₂`}</span></p>
                    <p>Pressure: <span className="text-bone">{comparisonAnalysis.recordA.environmentalConditions.pressureKpa} kPa</span></p>
                    <p>Flow: <span className="text-bone">{comparisonAnalysis.recordA.environmentalConditions.isFlowUncalibrated ? `Fan Index ${comparisonAnalysis.recordA.environmentalConditions.fanDisplayIndex}` : `${comparisonAnalysis.recordA.environmentalConditions.flowVelocityCmS} cm/s`}</span></p>
                  </div>
                </div>

                {/* Right Card: Record B */}
                <div className="p-4 rounded-xl bg-ink/60 border border-slate/20 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-copper">RECORD B</span>
                  <h5 className="font-bold text-sm text-bone">{comparisonAnalysis.recordB.runId}</h5>
                  <p className="text-xs text-slate">{comparisonAnalysis.recordB.material}</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate/20 text-slate">
                    <p>Geometry: <span className="text-bone">{comparisonAnalysis.recordB.geometry}</span></p>
                    <p>Atmosphere: <span className="text-bone">{comparisonAnalysis.recordB.environmentalConditions.oxygenRaw || `${(comparisonAnalysis.recordB.environmentalConditions.oxygenMoleFraction!*100).toFixed(1)}% O₂`}</span></p>
                    <p>Pressure: <span className="text-bone">{comparisonAnalysis.recordB.environmentalConditions.pressureKpa} kPa</span></p>
                    <p>Flow: <span className="text-bone">{comparisonAnalysis.recordB.environmentalConditions.isFlowUncalibrated ? `Fan Index ${comparisonAnalysis.recordB.environmentalConditions.fanDisplayIndex}` : `${comparisonAnalysis.recordB.environmentalConditions.flowVelocityCmS} cm/s`}</span></p>
                  </div>
                </div>
              </div>

              {/* Physical Comparability Gates Evaluation */}
              <div className="pt-2 space-y-2">
                <h5 className="text-xs font-bold text-slate uppercase tracking-wider">Physical Safeguard Gates</h5>
                <div className="space-y-1.5">
                  {comparisonAnalysis.gates.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate/20 bg-ink/40 flex items-start space-x-2 text-xs"
                    >
                      {g.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : g.severity === 'BLOCKER' ? (
                        <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-bone">{g.gateName}</span>
                        <p className="text-slate text-[11px] mt-0.5">{g.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prohibited Scientific Claims */}
              {comparisonAnalysis.prohibitedClaims.length > 0 && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 space-y-1">
                  <h6 className="text-xs font-bold text-red-400 flex items-center space-x-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Scientifically Prohibited Claims</span>
                  </h6>
                  <ul className="list-disc list-inside text-xs text-red-200/80 space-y-0.5">
                    {comparisonAnalysis.prohibitedClaims.map((claim, idx) => (
                      <li key={idx}>{claim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate/20 bg-ink/90 flex justify-end">
              <button
                onClick={() => setComparisonAnalysis(null)}
                className="px-4 py-2 bg-slate/20 hover:bg-slate/30 text-bone text-xs font-semibold rounded-lg transition-colors"
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
