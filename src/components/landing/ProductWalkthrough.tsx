'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const WALKTHROUGH_STAGES = [
  {
    num: 1,
    title: 'Define Exploration Scenario',
    tag: 'INPUT CONDITION',
    desc: 'Select an operational mission atmosphere. For example: Artemis Lunar Surface Habitat (34% O₂, 56.5 kPa, 0.16g).',
    preview: {
      type: 'condition',
      atmosphere: '34% O₂ / 66% N₂',
      pressure: '56.5 kPa (8.2 psia)',
      gravity: '0.16g (Lunar surface)',
      flow: 'Forced low (1–5 cm/s)',
    },
  },
  {
    num: 2,
    title: 'Query Flight Evidence Corpus',
    tag: 'CORPUS SEARCH',
    desc: 'FIRELINE compares the target conditions against verified NASA flight test records from Saffire-I and BASS-II.',
    preview: {
      type: 'matches',
      saffire: 'Saffire-I tested 21% O₂ at 101.3 kPa (~10⁻⁶ g)',
      bass: 'BASS-II tested 18–21% O₂ at 101.3 kPa (~10⁻⁶ g)',
      droplets: 'FLEX verified heptane cool flames (deferred raw tables)',
    },
  },
  {
    num: 3,
    title: 'Flag Evidence Gaps Immediately',
    tag: 'EPISTEMIC SAFETY',
    desc: 'Rather than hallucinating safety predictions, FIRELINE detects a critical gap: zero NASA flight tests exist at 34% O₂ in partial gravity.',
    preview: {
      type: 'gap',
      status: 'EVIDENCE_GAP DETECTED',
      gapDesc: 'No NASA microgravity or partial-gravity flight combustion data exists at 34% O₂.',
      risk: 'Materials flammability increases exponentially above 21% O₂; ground 1g tests fail to replicate low-buoyancy convective heat loss.',
    },
  },
  {
    num: 4,
    title: 'Explain with Grounded SI Copilot',
    tag: 'DECISION SUPPORT',
    desc: 'The SI Copilot cites specific Saffire and BASS flight findings, explains why PMMA and fabric behave differently, and prescribes required ground/flight testing.',
    preview: {
      type: 'action',
      recText: 'Recommend low-g drop tower verification at 34% O₂ prior to crew habitat deployment.',
      citation: 'NASA PSI-98 ART-002, Olson et al. (2018), Ferkul et al. (2016).',
    },
  },
];

export default function ProductWalkthrough() {
  const [activeStage, setActiveStage] = useState(0);
  const current = WALKTHROUGH_STAGES[activeStage];

  return (
    <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-ember-border space-y-6">
      {/* Step Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {WALKTHROUGH_STAGES.map((s, idx) => (
          <button
            key={s.num}
            onClick={() => setActiveStage(idx)}
            className={`p-3 rounded-xl text-left border transition-all ${
              activeStage === idx
                ? 'bg-flame/15 border-flame/40 text-white shadow-ember-sm ring-1 ring-flame/30'
                : 'bg-ember-surface/60 border-white/5 text-paper-muted hover:text-paper hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-white">
                0{s.num}
              </span>
              <span className="text-[10px] font-mono text-paper-dim uppercase">{s.tag}</span>
            </div>
            <p className="text-xs font-bold line-clamp-1">{s.title}</p>
          </button>
        ))}
      </div>

      {/* Interactive Display Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Explanation */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-flame/10 text-flame-bright border border-flame/30">
            <span>STEP 0{current.num} OF 04</span>
            <span>•</span>
            <span>{current.tag}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
            {current.desc}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/assess?preset=artemis_lunar"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-flame hover:bg-flame-bright text-white text-xs font-bold transition-all shadow-ember"
            >
              <span>Test Artemis in Assessor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/copilot?q=Can%20existing%20Saffire-I%20data%20predict%20fire%20safety%20in%20a%2034%25%20O2%20Artemis%20habitat%3F"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl glass-panel hover:bg-white/5 text-paper text-xs font-semibold border border-white/10 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-flame-bright" />
              <span>Ask Copilot This Question</span>
            </Link>
          </div>
        </div>

        {/* Right: Live Interactive Card Simulation */}
        <div className="p-5 rounded-2xl bg-ember-bg border border-ember-border space-y-4 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] text-paper-dim">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-flame-bright" />
              <span>FIRELINE DECISION KERNEL</span>
            </span>
            <span>STATUS: SIMULATING</span>
          </div>

          {current.preview.type === 'condition' && (
            <div className="space-y-2 text-paper">
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-paper-dim">Target Environment:</span>
                <span className="font-semibold text-white">Artemis Lunar Habitat</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-paper-dim">Atmosphere Composition:</span>
                <span className="text-flame-bright font-bold">{current.preview.atmosphere}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-paper-dim">Total Pressure:</span>
                <span className="text-paper">{current.preview.pressure}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-paper-dim">Gravity Regime:</span>
                <span className="text-amber-400">{current.preview.gravity}</span>
              </div>
            </div>
          )}

          {current.preview.type === 'matches' && (
            <div className="space-y-2 text-paper">
              <div className="p-2.5 rounded bg-white/5 border border-white/5">
                <span className="text-paper-dim block text-[10px]">PSI-98 RECORD SEARCH:</span>
                <span className="text-white text-xs">{current.preview.saffire}</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/5">
                <span className="text-paper-dim block text-[10px]">PSI-25 RECORD SEARCH:</span>
                <span className="text-white text-xs">{current.preview.bass}</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/5">
                <span className="text-paper-dim block text-[10px]">PSI-69 DROPLET CORROBORATION:</span>
                <span className="text-paper-dim text-xs">{current.preview.droplets}</span>
              </div>
            </div>
          )}

          {current.preview.type === 'gap' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-flame/15 border border-flame/40 text-flame-bright flex items-center space-x-2 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{current.preview.status}</span>
              </div>
              <p className="text-[11px] text-paper-muted leading-relaxed">
                {current.preview.gapDesc}
              </p>
              <div className="p-2.5 rounded bg-white/5 border border-white/5 text-[11px] text-amber-300">
                {current.preview.risk}
              </div>
            </div>
          )}

          {current.preview.type === 'action' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Epistemic Grounding Verified</span>
              </div>
              <p className="text-[11px] text-paper leading-relaxed">
                {current.preview.recText}
              </p>
              <p className="text-[10px] text-paper-dim border-t border-white/10 pt-2">
                NASA Sources Cited: {current.preview.citation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
