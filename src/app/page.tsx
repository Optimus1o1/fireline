import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  LayoutDashboard,
  GitCompare,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Compass,
  Cpu,
} from 'lucide-react';
import CombustionChamber3D from '@/components/landing/CombustionChamber3D';
import PipelineFlow from '@/components/landing/PipelineFlow';
import ProductWalkthrough from '@/components/landing/ProductWalkthrough';

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col space-y-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* SECTION 1: HERO */}
      <section className="flex flex-col items-center text-center space-y-8 pt-4 sm:pt-8">
        {/* Challenge Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-mono bg-flame/10 border border-flame/30 text-flame-bright shadow-ember-sm">
          <span className="w-2 h-2 rounded-full bg-flame-bright animate-ping" />
          <span className="font-bold">NASA SPACE APPS CHALLENGE 2026</span>
          <span className="text-paper-dim">•</span>
          <span className="text-paper-muted">Flame in Freefall</span>
        </div>

        {/* Main Title */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Decoding Fire in Space.{' '}
            <span className="flame-gradient-text block sm:inline">
              Grounded in NASA Science.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-paper-muted max-w-2xl mx-auto leading-relaxed">
            FIRELINE bridges experimental microgravity combustion physics and spacecraft mission design.
            Transforming raw flight test datasets from Saffire-I and BASS-II into explainable,
            evidence-first fire safety decision support.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-flame hover:bg-flame-bright text-white font-bold text-sm transition-all shadow-ember hover:scale-105 active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Launch Mission Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-ember-border text-paper font-bold text-sm transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-4 h-4 text-flame-bright" />
            <span>Explore Flight Evidence</span>
          </Link>
          <Link
            href="/copilot"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl glass-panel hover:bg-flame/10 border border-flame/30 text-paper font-bold text-sm transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-flame-bright" />
            <span>SI Copilot</span>
          </Link>
        </div>

        {/* 3D Combustion Chamber Visual Experience */}
        <div className="w-full pt-6">
          <CombustionChamber3D />
        </div>
      </section>

      {/* SECTION 2: THE MICROGRAVITY PROBLEM */}
      <section className="space-y-8 pt-10 border-t border-ember-border">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-flame-bright">
            THE RESEARCH CHALLENGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Terrestrial Fire Physics Fails in Orbit
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            In microgravity, the absence of natural buoyant convection transforms combustion into an entirely
            different physical regime. Standard ground safety tests (1g) cannot be blindly extrapolated to space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-ember-border space-y-3">
            <div className="p-3 rounded-2xl bg-flame/10 border border-flame/20 text-flame-bright w-fit">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">No Buoyant Plume</h3>
            <p className="text-xs text-paper-muted leading-relaxed">
              Without density-driven buoyancy, hot combustion products do not rise. Flames form quiet,
              spherical diffusion zones starved of natural oxygen replenishers, often burning cooler and longer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-ember-border space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Forced Airflow Criticality</h3>
            <p className="text-xs text-paper-muted leading-relaxed">
              Spacecraft ventilation systems (1–20 cm/s) provide the sole convective transport. Low forced
              flow can sustain steady flame spread without cooling the solid fuel, creating dangerous ignition zones.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-ember-border space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">The Geometry Scaling Trap</h3>
            <p className="text-xs text-paper-muted leading-relaxed">
              Thin polymer films (Bi &lt;&lt; 0.1) extinguish via radiative heat loss, while thick slabs
              (Bi &gt; 1) burn under thermally thick conduction. Comparing them without physical similitude causes fatal errors.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW FIRELINE WORKS (PIPELINE) */}
      <section className="space-y-8 pt-10 border-t border-ember-border">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-flame-bright">
            SCIENTIFIC METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Evidence-First Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            From raw NASA Physical Sciences Informatics (PSI) artifacts to grounded Super Intelligence (SI).
            Every step is governed by strict Pydantic contracts and physical gates.
          </p>
        </div>

        <PipelineFlow />
      </section>

      {/* SECTION 4: INTERACTIVE PRODUCT WALKTHROUGH */}
      <section className="space-y-8 pt-10 border-t border-ember-border">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-flame-bright">
            INTERACTIVE DEMONSTRATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FIRELINE Identifies Mission Fire Gaps
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            Follow a real engineering scenario: testing whether the Artemis Lunar Habitat atmosphere (34% O₂)
            is covered by existing microgravity flight data.
          </p>
        </div>

        <ProductWalkthrough />
      </section>

      {/* SECTION 5: CORE PLATFORM CAPABILITIES */}
      <section className="space-y-8 pt-10 border-t border-ember-border">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-flame-bright">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Grounded Scientific Modules
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            Designed for researchers, spacecraft engineers, and mission planners requiring verified evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: Evidence Explorer */}
          <Link
            href="/explore"
            className="glass-panel-hover glass-panel p-6 sm:p-8 rounded-3xl border border-ember-border flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-flame/10 border border-flame/30 text-flame-bright">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-paper-dim group-hover:text-flame-bright transition-colors">
                  /explore →
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-bright transition-colors">
                NASA PSI Evidence Explorer
              </h3>
              <p className="text-xs text-paper-muted leading-relaxed">
                Filter and inspect individual experimental runs from Saffire-I and BASS-II. Examine exact flame
                spread rates, oxygen fractions, pressures, fan speeds, and specimen dimensions with direct links to NASA repositories.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-paper-dim font-mono">
              <span>7 Accepted Specimens</span>
              <span className="text-flame-bright font-semibold">Open Explorer</span>
            </div>
          </Link>

          {/* Module 2: Physical Comparability Studio */}
          <Link
            href="/compare"
            className="glass-panel-hover glass-panel p-6 sm:p-8 rounded-3xl border border-ember-border flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <GitCompare className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-paper-dim group-hover:text-amber-400 transition-colors">
                  /compare →
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                5-Gate Physical Comparability
              </h3>
              <p className="text-xs text-paper-muted leading-relaxed">
                Deterministic similitude validator checking Material, Geometry/Biot, Atmosphere, Flow Regime,
                and Gravity before cross-experiment inferences are drawn. Prevents non-physical extrapolations.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-paper-dim font-mono">
              <span>5 Automated Physical Gates</span>
              <span className="text-amber-400 font-semibold">Open Studio</span>
            </div>
          </Link>

          {/* Module 3: Spacecraft Mission Assessor */}
          <Link
            href="/assess"
            className="glass-panel-hover glass-panel p-6 sm:p-8 rounded-3xl border border-ember-border flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-paper-dim group-hover:text-emerald-400 transition-colors">
                  /assess →
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                Spacecraft Mission Gap Assessor
              </h3>
              <p className="text-xs text-paper-muted leading-relaxed">
                Evaluate Artemis Lunar Habitats, ISS Nominal atmospheres, or Martian surface conditions against
                known flight combustion boundaries. Immediately reveals uncharacterized operational regimes.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-paper-dim font-mono">
              <span>3 Documented Reference Presets</span>
              <span className="text-emerald-400 font-semibold">Open Assessor</span>
            </div>
          </Link>

          {/* Module 4: Grounded SI Copilot */}
          <Link
            href="/copilot"
            className="glass-panel-hover glass-panel p-6 sm:p-8 rounded-3xl border border-ember-border flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-flame/10 border border-flame/30 text-flame-bright">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-paper-dim group-hover:text-flame-bright transition-colors">
                  /copilot →
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-bright transition-colors">
                Grounded SI Copilot
              </h3>
              <p className="text-xs text-paper-muted leading-relaxed">
                Grounded Super Intelligence powered by Gemini with a deterministic fallback. Strictly constrained
                to indexed flight evidence; articulates physical rationales and cites exact NASA source tables.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-paper-dim font-mono">
              <span>Dual-Mode AI + Fallback</span>
              <span className="text-flame-bright font-semibold">Launch Copilot</span>
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 6: SCIENTIFIC INTEGRITY & EPISTEMIC STANDARDS */}
      <section className="glass-panel-elevated p-8 sm:p-10 rounded-3xl border border-ember-border space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>SCIENTIFIC INTEGRITY FRAMEWORK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Epistemic Classification Invariant
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted max-w-3xl leading-relaxed">
            In human spaceflight, false confidence can be fatal. FIRELINE categorizes every claim and
            assessment output into three strictly bounded epistemic classifications:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Supported */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SUPPORTED
            </span>
            <p className="text-xs font-bold text-white pt-2">Empirically Grounded</p>
            <p className="text-[11px] text-paper-muted leading-relaxed">
              Directly documented in verified NASA PSI flight test records with DOI citation, specimen dimensions,
              and measured flame spread rates.
            </p>
          </div>

          {/* Inferred */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              INFERRED
            </span>
            <p className="text-xs font-bold text-white pt-2">Physically Modeled</p>
            <p className="text-[11px] text-paper-muted leading-relaxed">
              Derived via verified physical similitude models (Reynolds, Biot, Arrhenius scaling) from comparable runs.
              Assumptions explicitly stated.
            </p>
          </div>

          {/* Evidence Gap */}
          <div className="p-5 rounded-2xl bg-flame/5 border border-flame/20 space-y-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-flame/20 text-flame-bright border border-flame/30">
              EVIDENCE_GAP
            </span>
            <p className="text-xs font-bold text-white pt-2">Uncharacterized Space</p>
            <p className="text-[11px] text-paper-muted leading-relaxed">
              Conditions where no NASA microgravity combustion flight data exists. Flagged immediately to prevent
              dangerous extrapolations.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="text-center py-12 px-6 rounded-3xl glass-panel border border-ember-border space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-flame/5 pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Explore Spacecraft Fire Safety?
          </h2>
          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            Access the complete indexed NASA PSI corpus, run 5-gate comparability analyses, and test mission
            atmospheric conditions with SI Copilot.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-flame hover:bg-flame-bright text-white font-bold text-sm transition-all shadow-ember"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter Mission Dashboard</span>
            </Link>
            <Link
              href="/copilot"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-ember-border text-paper font-bold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-flame-bright" />
              <span>Query SI Copilot</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
