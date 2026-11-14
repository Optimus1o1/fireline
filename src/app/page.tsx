import React from 'react';
import Link from 'next/link';
import {
  Flame,
  ShieldAlert,
  Database,
  Search,
  GitCompare,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Layers,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { EvidenceRepository } from '@/lib/evidenceRepository';

export default function HomePage() {
  const investigations = EvidenceRepository.getInvestigations();
  const allRecords = EvidenceRepository.getRecords();

  const totalSourceRows = 10; // 5 from Saffire-I + 5 from BASS-II
  const acceptedRecords = allRecords.filter((r) => r.disposition === 'VALID_RECORD').length; // 2 Saffire + 5 BASS = 7
  const reviewRecords = allRecords.filter((r) => r.disposition === 'REQUIRES_REVIEW').length; // 2 flow vis

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="border-b border-slate/20 bg-ink/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-copper/10 border border-copper/30 rounded-lg text-copper">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg text-bone">FIRELINE</h1>
            <p className="text-xs text-slate">NASA Microgravity Fire Safety Decision Support</p>
          </div>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium text-slate">
          <Link href="#overview" className="hover:text-bone transition-colors">Overview</Link>
          <Link href="/explore" className="hover:text-bone transition-colors">Evidence Explorer</Link>
          <Link href="/assess" className="hover:text-bone text-copper font-medium transition-colors">Evidence Assessor</Link>
          <Link href="/copilot" className="text-copper hover:underline font-semibold flex items-center space-x-1">
            <span>SI Copilot</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="#missions" className="hover:text-bone transition-colors">Mission Presets</Link>
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

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6" id="overview">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-copper/10 border border-copper/30 text-copper">
          <span>NASA Space Apps Challenge 2026</span>
          <span className="text-slate">•</span>
          <span>Flame in Freefall: SI-Powered Fire Safety Insights</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-bone max-w-3xl leading-tight">
          Understanding Fire Beyond Earth
        </h2>

        <p className="text-base sm:text-lg text-slate max-w-2xl leading-relaxed">
          Explore experimental evidence from NASA microgravity combustion research to investigate how flames behave under spaceflight conditions.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3 justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center space-x-2 bg-copper hover:bg-copper/90 text-ink font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-copper/10"
          >
            <Search className="w-4 h-4" />
            <span>Launch Evidence Explorer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/assess"
            className="inline-flex items-center space-x-2 bg-ink/80 hover:bg-ink text-bone border border-slate/30 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <GitCompare className="w-4 h-4 text-copper" />
            <span>Assess Mission Gaps</span>
            <ChevronRight className="w-4 h-4 text-slate" />
          </Link>
        </div>

        {/* Dataset Transparency Notice */}
        <div className="w-full max-w-2xl p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-left flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-amber-200/90">
            <p className="font-semibold text-amber-300">Empirical Research Evidence Scope & Limitations</p>
            <p>
              Research evidence availability is strictly limited to currently indexed NASA source artifacts: Saffire-I (5 flight rows, 2 accepted specimen records), BASS-II (5 representative thin-film rows of 130), and FLEX (deferred pending spherical geometry resolution). No fabricated measurements exist.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Statistics Grid */}
      <section className="px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate/20 bg-ink/40 space-y-1">
            <span className="text-xs text-slate uppercase tracking-wider">Investigations</span>
            <p className="text-2xl font-black text-bone">3</p>
            <p className="text-[11px] text-slate/70">2 Indexed, 1 Deferred</p>
          </div>
          <div className="p-4 rounded-xl border border-slate/20 bg-ink/40 space-y-1">
            <span className="text-xs text-slate uppercase tracking-wider">Source Rows</span>
            <p className="text-2xl font-black text-copper">10</p>
            <p className="text-[11px] text-slate/70">Raw PSI table entries</p>
          </div>
          <div className="p-4 rounded-xl border border-slate/20 bg-ink/40 space-y-1">
            <span className="text-xs text-slate uppercase tracking-wider">Accepted Specimens</span>
            <p className="text-2xl font-black text-emerald-400">{acceptedRecords}</p>
            <p className="text-[11px] text-slate/70">Validated empirical runs</p>
          </div>
          <div className="p-4 rounded-xl border border-slate/20 bg-ink/40 space-y-1">
            <span className="text-xs text-slate uppercase tracking-wider">Review / Diagnostics</span>
            <p className="text-2xl font-black text-amber-400">{reviewRecords}</p>
            <p className="text-[11px] text-slate/70">Flow visualization runs</p>
          </div>
        </div>
      </section>

      {/* Investigation Cards */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full border-t border-slate/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-bone">Covered NASA Investigations</h3>
            <p className="text-sm text-slate">Direct linkage to NASA Physical Sciences Informatics (PSI)</p>
          </div>
          <Link href="/explore" className="text-xs text-copper hover:underline flex items-center space-x-1">
            <span>Explore All</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investigations.map((inv) => {
            const isDeferred = inv.status === 'DEFERRED_BLOCKED';
            return (
              <div
                key={inv.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isDeferred
                    ? 'border-slate/10 bg-ink/20 opacity-70'
                    : 'border-slate/20 bg-ink/40 hover:border-copper/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-copper">{inv.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                        isDeferred
                          ? 'bg-slate/10 text-slate border-slate/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {inv.recordCount} Records
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-bone">{inv.name}</h4>
                    <p className="text-xs text-slate/80 mt-1">{inv.title}</p>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{inv.focus}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate/20 flex items-center justify-between text-xs">
                  <span className="text-slate/60">{inv.facility}</span>
                  {!isDeferred ? (
                    <Link
                      href={`/explore?investigation=${inv.id}`}
                      className="text-copper hover:underline font-semibold flex items-center space-x-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-slate/50 italic">Deferred</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exploration Mission Presets */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full border-t border-slate/20" id="missions">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-bone">Exploration Atmosphere Scenario Presets</h3>
          <p className="text-sm text-slate">
            Reference mission conditions for evaluating fire safety data coverage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/explore?q=artemis"
            className="p-5 rounded-xl border border-slate/20 bg-ink/40 hover:border-copper/40 transition-all block group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-copper uppercase tracking-wider">Lunar Surface</span>
              <ChevronRight className="w-4 h-4 text-slate group-hover:text-copper transition-colors" />
            </div>
            <h4 className="text-base font-bold text-bone mt-1">Artemis Habitat Atmosphere</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">34% O₂</span></p>
              <p>Pressure: <span className="text-bone font-medium">56.5 kPa (8.2 psia)</span></p>
              <p>Ventilation: <span className="text-bone font-medium">Low forced (1–5 cm/s)</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate/20 text-[11px] text-amber-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>Evidence Gap: No 34% O₂ flight data in current slice</span>
            </div>
          </Link>

          <Link
            href="/explore?q=iss"
            className="p-5 rounded-xl border border-slate/20 bg-ink/40 hover:border-copper/40 transition-all block group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate uppercase tracking-wider">Low Earth Orbit</span>
              <ChevronRight className="w-4 h-4 text-slate group-hover:text-copper transition-colors" />
            </div>
            <h4 className="text-base font-bold text-bone mt-1">Standard ISS Environment</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">21% O₂</span></p>
              <p>Pressure: <span className="text-bone font-medium">101.3 kPa (14.7 psia)</span></p>
              <p>Ventilation: <span className="text-bone font-medium">Cabin nominal (10–20 cm/s)</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate/20 text-[11px] text-emerald-400 flex items-center space-x-1">
              <span>Coverage Available (Saffire-I & BASS-II)</span>
            </div>
          </Link>

          <div className="p-5 rounded-xl border border-slate/20 bg-ink/40">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Critical Limit</span>
            <h4 className="text-base font-bold text-bone mt-1">Depressurized Boundary</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">Elevated O₂ fraction</span></p>
              <p>Pressure: <span className="text-bone font-medium">Sub-atmospheric (&lt;50 kPa)</span></p>
              <p>Status: <span className="text-amber-500 font-medium">Extinction edge</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate/20 text-[11px] text-slate/60">
              Theoretical reference condition
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate/20 px-6 py-6 text-center text-xs text-slate">
        <p>FIRELINE — Fire Intelligence & Research Evidence Linkage Engine</p>
        <p className="mt-1">Developed for NASA International Space Apps Challenge 2026</p>
      </footer>
    </main>
  );
}
