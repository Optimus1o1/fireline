import React from 'react';
import Link from 'next/link';
import { Flame, ShieldAlert, Database, Search, GitCompare, BookOpen, ExternalLink } from 'lucide-react';

export default function HomePage() {
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
          <Link href="#missions" className="hover:text-bone transition-colors">Mission Presets</Link>
          <Link href="#architecture" className="hover:text-bone transition-colors">HCO Architecture</Link>
          <a
            href="https://psi.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-copper hover:underline text-xs"
          >
            <span>NASA PSI Data</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6" id="overview">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-copper/10 border border-copper/30 text-copper">
          <span>NASA Space Apps Challenge 2026</span>
          <span className="text-slate">•</span>
          <span>Flame in Freefall</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-bone max-w-3xl leading-tight">
          Evidence-First Fire Intelligence for Microgravity Exploration
        </h2>

        <p className="text-base sm:text-lg text-slate max-w-2xl leading-relaxed">
          Structuring, linking, and interpreting heterogeneous NASA microgravity combustion research across BASS, Saffire, and CIR flight campaigns. Defending crewed missions with physics-grounded evidence.
        </p>

        {/* Development Status Notice */}
        <div className="w-full max-w-xl p-4 rounded-xl border border-copper/40 bg-ink/60 text-left flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-bone">P0 Application Shell & Database Migration Active</p>
            <p className="text-slate">
              Scaffolding complete. Canonical Harmonized Combustion Ontology (HCO) relational schema instantiated. Ready for verified flight data ingestion (BASS-II flat PMMA & Saffire-I).
            </p>
          </div>
        </div>
      </section>

      {/* Deep-Space Mission Presets */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full" id="missions">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-bone">Deep-Space Mission Exploration Presets</h3>
          <p className="text-sm text-slate">Targeted atmospheric regimes authorized in Phase 1.0 Scope Decision</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate/20 bg-ink/40 hover:border-copper/40 transition-all">
            <span className="text-xs font-semibold text-copper uppercase tracking-wider">Lunar Surface</span>
            <h4 className="text-base font-bold text-bone mt-1">Artemis Habitat Atmosphere</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">34% O₂</span></p>
              <p>Pressure: <span className="text-bone font-medium">56.5 kPa (8.2 psia)</span></p>
              <p>Ventilation: <span className="text-bone font-medium">Low forced (1–5 cm/s)</span></p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate/20 bg-ink/40 hover:border-copper/40 transition-all">
            <span className="text-xs font-semibold text-slate uppercase tracking-wider">Low Earth Orbit</span>
            <h4 className="text-base font-bold text-bone mt-1">Standard ISS Environment</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">21% O₂</span></p>
              <p>Pressure: <span className="text-bone font-medium">101.3 kPa (14.7 psia)</span></p>
              <p>Ventilation: <span className="text-bone font-medium">Cabin nominal (10–20 cm/s)</span></p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate/20 bg-ink/40 hover:border-copper/40 transition-all">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Critical Limit</span>
            <h4 className="text-base font-bold text-bone mt-1">Depressurized Boundary</h4>
            <div className="mt-3 text-xs text-slate space-y-1">
              <p>Oxygen: <span className="text-bone font-medium">Elevated O₂ fraction</span></p>
              <p>Pressure: <span className="text-bone font-medium">Sub-atmospheric (&lt;50 kPa)</span></p>
              <p>Status: <span className="text-amber-500 font-medium">Extinction edge</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Canonical Architecture Pillars */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full border-t border-slate/20" id="architecture">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-bone">Evidence-First Safeguards</h3>
          <p className="text-sm text-slate">Governed by Canonical HCO Specification</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-ink/30 border border-slate/20 space-y-2">
            <Database className="w-5 h-5 text-copper" />
            <h5 className="font-semibold text-sm text-bone">Zero Hallucination</h5>
            <p className="text-xs text-slate leading-relaxed">
              Missing values remain strictly NULL. Non-physical measurements are quarantined.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-ink/30 border border-slate/20 space-y-2">
            <Search className="w-5 h-5 text-copper" />
            <h5 className="font-semibold text-sm text-bone">Dual Units</h5>
            <p className="text-xs text-slate leading-relaxed">
              Verbatim reported units (psia, in) preserved alongside normalized SI units.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-ink/30 border border-slate/20 space-y-2">
            <GitCompare className="w-5 h-5 text-copper" />
            <h5 className="font-semibold text-sm text-bone">Physical Gating</h5>
            <p className="text-xs text-slate leading-relaxed">
              Automated warning prevents invalid comparison across mismatched duct scales.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-ink/30 border border-slate/20 space-y-2">
            <BookOpen className="w-5 h-5 text-copper" />
            <h5 className="font-semibold text-sm text-bone">Full Lineage</h5>
            <p className="text-xs text-slate leading-relaxed">
              Direct traceability to NASA Physical Sciences Informatics (PSI) & NTRS reports.
            </p>
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

