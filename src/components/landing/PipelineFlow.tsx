'use client';

import React, { useState } from 'react';
import { Database, ShieldCheck, Layers, GitCompare, Sparkles, ChevronRight, Check } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 'step-1',
    step: '01',
    title: 'NASA PSI Artifacts',
    sub: 'Source Data Ingestion',
    icon: Database,
    description:
      'Extract flight data tables, video diagnostics, and run metadata directly from NASA Physical Sciences Informatics (PSI-98 Saffire-I and PSI-25 BASS-II).',
    detail: '5 Saffire flight rows, 130 BASS runs (5 indexed representative), DOI citations tracked.',
  },
  {
    id: 'step-2',
    step: '02',
    title: 'Pydantic Contracts',
    sub: 'Scientific Data Validation',
    icon: ShieldCheck,
    description:
      'Rigorous automated validation checking units (cm/s, kPa, psia), material properties, oxygen percentages, and Biot number regimes.',
    detail: '17 automated contract validations rejecting non-physical or unverified records.',
  },
  {
    id: 'step-3',
    step: '03',
    title: 'Evidence Corpus',
    sub: 'Classified & Indexed Runs',
    icon: Layers,
    description:
      'Records classified as VALID_RECORD (7 accepted specimens) or REQUIRES_REVIEW (2 flow tests). FLEX droplet data indexed as audited findings.',
    detail: 'Structured JSON repository with zero fabricated measurements.',
  },
  {
    id: 'step-4',
    step: '04',
    title: '5-Gate Comparability',
    sub: 'Similitude Engine',
    icon: GitCompare,
    description:
      'Deterministic rule engine evaluating Material, Geometry/Biot, Atmosphere, Flow Regime, and Gravity before allowing cross-experiment inference.',
    detail: 'Categorizes pairings into COMPARABLE, SCALING_REQUIRED, or PHYSICALLY_DISTINCT.',
  },
  {
    id: 'step-5',
    step: '05',
    title: 'SI Decision Copilot',
    sub: 'Grounded Intelligence',
    icon: Sparkles,
    description:
      'Dual-mode intelligence engine powered by Gemini 2.5 with a deterministic fallback. Answers only from indexed evidence; flags gaps explicitly.',
    detail: 'Strict evidence-bound invariants prevent ungrounded AI extrapolations.',
  },
];

export default function PipelineFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-6">
      {/* Pipeline Navigation Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          const isPassed = idx < activeStep;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left border transition-all relative ${
                isSelected
                  ? 'glass-panel-elevated border-flame/50 bg-flame/10 shadow-ember-sm ring-1 ring-flame-bright/30'
                  : 'glass-panel border-ember-border hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-flame text-white'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-paper-dim'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 inline" /> : step.step}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-flame-bright' : 'text-paper-dim'
                  }`}
                />
              </div>
              <h4 className="text-xs font-bold text-white mb-0.5">{step.title}</h4>
              <p className="text-[11px] text-paper-muted font-medium">{step.sub}</p>

              {/* Connecting line indicator for active */}
              {isSelected && (
                <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-flame to-flame-bright rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Dive Panel */}
      <div className="glass-panel-elevated p-6 rounded-3xl border border-ember-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-flame-bright px-2.5 py-1 rounded bg-flame/15 border border-flame/30">
              STAGE {PIPELINE_STEPS[activeStep].step}
            </span>
            <h3 className="text-base font-bold text-white">
              {PIPELINE_STEPS[activeStep].title} — {PIPELINE_STEPS[activeStep].sub}
            </h3>
          </div>
          <span className="text-xs text-paper-dim font-mono">
            Scientific Rigor Guarantee
          </span>
        </div>

        <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
          {PIPELINE_STEPS[activeStep].description}
        </p>

        <div className="p-3.5 rounded-xl bg-ember-surface/90 border border-white/5 text-xs font-mono text-paper-dim flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-flame-bright shrink-0" />
          <span>{PIPELINE_STEPS[activeStep].detail}</span>
        </div>
      </div>
    </div>
  );
}
