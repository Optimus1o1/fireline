import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  GitCompare,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { EvidenceRepository } from '@/lib/evidenceRepository';

export default function DashboardPage() {
  const investigations = EvidenceRepository.getInvestigations();
  const allRecords = EvidenceRepository.getRecords();

  const totalSourceRows = 10; // 5 from Saffire-I + 5 from BASS-II
  const acceptedRecords = allRecords.filter((r) => r.disposition === 'VALID_RECORD').length; // 7
  const reviewRecords = allRecords.filter((r) => r.disposition === 'REQUIRES_REVIEW').length; // 2

  return (
    <main className="flex-1 flex flex-col py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ember-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-flame/10 text-flame-bright border border-flame/30 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-flame-bright animate-pulse" />
            <span>OPERATIONAL MISSION CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Microgravity Research & Evidence Dashboard
          </h1>
          <p className="mt-1 text-sm text-paper-muted max-w-3xl leading-relaxed">
            Central operational intelligence node monitoring indexed NASA Physical Sciences Informatics
            experiments, flight specimens, physical comparability gates, and space atmosphere scenarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-flame hover:bg-flame-bright text-white text-xs font-bold transition-all shadow-ember"
          >
            <Search className="w-4 h-4" />
            <span>Evidence Explorer</span>
          </Link>
          <Link
            href="/copilot"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel hover:bg-white/5 border border-ember-border text-paper text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-flame-bright" />
            <span>Query Copilot</span>
          </Link>
        </div>
      </div>

      {/* Epistemic Scope Notice */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-left flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 text-amber-200">
          <p className="font-bold text-amber-300">Empirical Research Evidence Scope & Grounding Guardrails</p>
          <p className="leading-relaxed">
            Data indexed strictly from verified NASA Physical Sciences Informatics (PSI) artifacts: Saffire-I
            (5 flight rows, 2 accepted specimen records), BASS-II (5 representative thin-film rows of 130), and
            FLEX (audited droplet claims; raw tables deferred). Zero fabricated measurements exist in this corpus.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-1">
          <span className="text-xs text-paper-muted uppercase tracking-wider font-semibold">Investigations</span>
          <p className="text-3xl font-black text-white">3</p>
          <p className="text-[11px] text-paper-dim">2 Indexed, 1 Deferred</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-1">
          <span className="text-xs text-paper-muted uppercase tracking-wider font-semibold">Source PSI Rows</span>
          <p className="text-3xl font-black text-flame-bright">{totalSourceRows}</p>
          <p className="text-[11px] text-paper-dim">Audited raw flight table entries</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-1">
          <span className="text-xs text-paper-muted uppercase tracking-wider font-semibold">Accepted Specimens</span>
          <p className="text-3xl font-black text-emerald-400">{acceptedRecords}</p>
          <p className="text-[11px] text-paper-dim">Pydantic-validated empirical runs</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-ember-border space-y-1">
          <span className="text-xs text-paper-muted uppercase tracking-wider font-semibold">Review / Diagnostics</span>
          <p className="text-3xl font-black text-amber-400">{reviewRecords}</p>
          <p className="text-[11px] text-paper-dim">Flow visualization flight tests</p>
        </div>
      </div>

      {/* Investigations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Covered NASA Investigations</h2>
            <p className="text-xs text-paper-muted">
              Direct linkage to NASA Physical Sciences Informatics (PSI) artifacts
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs text-flame-bright hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>View All in Explorer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investigations.map((inv) => {
            const isDeferred = inv.status === 'DEFERRED_BLOCKED';
            return (
              <div
                key={inv.id}
                className={`p-6 rounded-2xl glass-panel flex flex-col justify-between transition-all ${
                  isDeferred
                    ? 'border-white/5 opacity-65'
                    : 'border-ember-border hover:border-flame/40 hover:shadow-ember-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-flame-bright bg-flame/10 px-2 py-0.5 rounded border border-flame/20">
                      {inv.id}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${
                        isDeferred
                          ? 'bg-white/5 text-paper-muted border-white/10'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {inv.recordCount} Records
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{inv.name}</h3>
                    <p className="text-xs text-paper-muted mt-1 leading-snug">{inv.title}</p>
                  </div>
                  <p className="text-xs text-paper-dim leading-relaxed">{inv.focus}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-paper-dim font-mono">{inv.facility}</span>
                  {!isDeferred ? (
                    <Link
                      href={`/explore?investigation=${inv.id}`}
                      className="text-flame-bright hover:underline font-semibold flex items-center space-x-1"
                    >
                      <span>Explore Runs</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-paper-dim italic">Geometry Blocked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exploration Mission Presets */}
      <div className="space-y-4 pt-4 border-t border-ember-border">
        <div>
          <h2 className="text-lg font-bold text-white">Spaceflight Mission Scenario Benchmarks</h2>
          <p className="text-xs text-paper-muted">
            Pre-configured exploration atmospheres for assessing microgravity fire safety coverage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/assess?preset=artemis_lunar"
            className="p-5 rounded-2xl glass-panel border border-ember-border hover:border-flame/40 hover:shadow-ember-sm transition-all block group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-flame-bright uppercase tracking-wider font-mono">
                Lunar Surface
              </span>
              <ChevronRight className="w-4 h-4 text-paper-dim group-hover:text-flame-bright transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white mt-1">Artemis Habitat Atmosphere</h3>
            <div className="mt-3 text-xs text-paper-muted space-y-1 font-mono">
              <p>Oxygen: <span className="text-paper font-semibold">34% O₂</span></p>
              <p>Pressure: <span className="text-paper font-semibold">56.5 kPa (8.2 psia)</span></p>
              <p>Ventilation: <span className="text-paper font-semibold">1–5 cm/s (Forced)</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-amber-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Evidence Gap: No 34% O₂ flight data in current slice</span>
            </div>
          </Link>

          <Link
            href="/assess?preset=iss_nominal"
            className="p-5 rounded-2xl glass-panel border border-ember-border hover:border-flame/40 hover:shadow-ember-sm transition-all block group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-paper-muted uppercase tracking-wider font-mono">
                Low Earth Orbit
              </span>
              <ChevronRight className="w-4 h-4 text-paper-dim group-hover:text-flame-bright transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white mt-1">Standard ISS Environment</h3>
            <div className="mt-3 text-xs text-paper-muted space-y-1 font-mono">
              <p>Oxygen: <span className="text-paper font-semibold">21% O₂</span></p>
              <p>Pressure: <span className="text-paper font-semibold">101.3 kPa (14.7 psia)</span></p>
              <p>Ventilation: <span className="text-paper font-semibold">10–20 cm/s (Nominal)</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Direct Flight Coverage (Saffire-I & BASS-II)</span>
            </div>
          </Link>

          <Link
            href="/assess?preset=mars_habitat"
            className="p-5 rounded-2xl glass-panel border border-ember-border hover:border-flame/40 hover:shadow-ember-sm transition-all block group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider font-mono">
                Martian Surface
              </span>
              <ChevronRight className="w-4 h-4 text-paper-dim group-hover:text-flame-bright transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white mt-1">Mars Habitat Environment</h3>
            <div className="mt-3 text-xs text-paper-muted space-y-1 font-mono">
              <p>Oxygen: <span className="text-paper font-semibold">28% O₂</span></p>
              <p>Pressure: <span className="text-paper font-semibold">56.0 kPa (8.1 psia)</span></p>
              <p>Gravity: <span className="text-paper font-semibold">0.38g (Partial Buoyancy)</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-amber-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Evidence Gap: Zero partial-gravity flight data</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
