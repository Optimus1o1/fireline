'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { CopilotResponsePayload } from '@/lib/copilot/types';

const SUGGESTED_QUESTIONS = [
  'What did Saffire-I investigate and what were its findings?',
  'What experimental conditions are available for BASS-II?',
  'Why are BASS-II thin films not directly comparable to PMMA rods?',
  'Can existing Saffire-I data predict fire safety in a 34% O2 Artemis habitat?',
  'What does FLEX show about liquid droplet extinction?',
  'What fan speed corresponds to 20 cm/s in BASS-II?',
];

export default function CopilotPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopilotResponsePayload | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setLastQuestion(q);

      const res = await fetch('/api/copilot/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.response);
      } else {
        setError(data.error || 'Failed to process inquiry');
      }
    } catch (err) {
      setError('Connection failure to SI Copilot service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate/20 bg-ink/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-copper/10 border border-copper/30 rounded-lg text-copper group-hover:border-copper/60 transition-colors">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg text-bone">FIRELINE</h1>
              <p className="text-xs text-slate">SI Copilot — Grounded Scientific Intelligence</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium text-slate">
          <Link href="/" className="hover:text-bone transition-colors">Overview</Link>
          <Link href="/explore" className="hover:text-bone transition-colors">Evidence Explorer</Link>
          <span className="text-copper font-semibold flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>SI Copilot</span>
          </span>
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

      {/* Dataset Limitation Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Grounded Intelligence Invariant:</strong> SI Copilot answers are derived strictly from indexed NASA PSI tables and audited literature findings. Hallucinated numbers and ungrounded extrapolations are prohibited.
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-mono">
          <span>MODE:</span>
          <span className="font-bold uppercase">
            {result?.providerMode === 'GEMINI' ? 'GEMINI ACTIVE' : 'DETERMINISTIC FALLBACK READY'}
          </span>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Suggested Questions & Indexed Investigations */}
        <aside className="w-full md:w-80 border-r border-slate/20 p-5 space-y-6 bg-ink/50 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider">Suggested Scientific Inquiries</h3>
            <p className="text-[11px] text-slate/70 mt-0.5">Click to run against grounded evidence</p>
            <div className="mt-3 space-y-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate/20 bg-ink/40 hover:border-copper/50 hover:bg-copper/5 text-xs text-bone transition-all leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate/20 space-y-3">
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider">Indexed Evidence Corpus</h3>
            <div className="text-xs space-y-2 text-slate">
              <div className="p-2.5 rounded-lg bg-ink/40 border border-slate/20">
                <p className="font-bold text-bone">Saffire-I (PSI-98)</p>
                <p className="text-[11px] mt-0.5">Cygnus OA-6 flight table (5 rows, SIBAL fabric)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-ink/40 border border-slate/20">
                <p className="font-bold text-bone">BASS-II (PSI-25)</p>
                <p className="text-[11px] mt-0.5">Thin PMMA films (100–300 µm) with uncalibrated fan indices</p>
              </div>
              <div className="p-2.5 rounded-lg bg-ink/40 border border-slate/20 opacity-60">
                <p className="font-bold text-slate">FLEX (PSI-69)</p>
                <p className="text-[11px] mt-0.5">Audited droplet extinction claims only (Raw runs deferred)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Conversation & Grounded Response */}
        <section className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Query Input Box */}
          <div className="p-4 rounded-xl border border-slate/20 bg-ink/60 space-y-3 shadow-lg">
            <label className="text-xs font-bold text-bone flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-copper" />
              <span>Ask the SI Copilot</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask about microgravity combustion, flame spread, or mission atmospheric limits..."
                className="flex-1 bg-ink border border-slate/30 rounded-lg px-4 py-2.5 text-xs text-bone placeholder-slate/50 focus:outline-none focus:border-copper"
              />
              <button
                onClick={() => handleAsk()}
                disabled={loading || !question.trim()}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all ${
                  loading || !question.trim()
                    ? 'bg-slate/20 text-slate cursor-not-allowed'
                    : 'bg-copper hover:bg-copper/90 text-ink shadow-md shadow-copper/10'
                }`}
              >
                {loading ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Response Container */}
          {result && (
            <div className="space-y-5">
              {/* Epistemic Classification Header */}
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  result.classification === 'SUPPORTED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : result.classification === 'INFERRED'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                {result.classification === 'SUPPORTED' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : result.classification === 'INFERRED' ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-ink/40 border border-current">
                      {result.classification.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] opacity-80">
                      Query: &ldquo;{lastQuestion}&rdquo;
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-2 text-bone leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Key Evidence-Backed Findings */}
              {result.keyFindings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate uppercase tracking-wider">
                    Evidence-Backed Findings
                  </h4>
                  <div className="space-y-2">
                    {result.keyFindings.map((kf, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate/20 bg-ink/40 space-y-2 text-xs"
                      >
                        <p className="text-bone leading-relaxed">{kf.statement}</p>
                        <div className="flex items-center space-x-1.5 text-[11px]">
                          <span className="text-slate">Cited Evidence:</span>
                          {kf.evidenceIds.map((eid, eidx) => (
                            <span
                              key={eidx}
                              className="px-2 py-0.5 rounded bg-copper/10 border border-copper/30 text-copper font-mono font-semibold"
                            >
                              {eid}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualified Scientific Interpretation */}
              {result.interpretation && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate uppercase tracking-wider">
                    Qualified Scientific Interpretation
                  </h4>
                  <div className="p-4 rounded-lg border border-slate/20 bg-ink/30 text-xs text-slate/90 leading-relaxed">
                    {result.interpretation}
                  </div>
                </div>
              )}

              {/* Limitations & Missing Information (Physical Safeguards) */}
              {(result.limitations.length > 0 || result.missingInformation.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.limitations.length > 0 && (
                    <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1.5">
                      <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Documented Limitations</span>
                      </h5>
                      <ul className="list-disc list-inside text-xs text-amber-200/80 space-y-1">
                        {result.limitations.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.missingInformation.length > 0 && (
                    <div className="p-3.5 rounded-lg border border-slate/20 bg-ink/40 space-y-1.5">
                      <h5 className="text-xs font-bold text-slate flex items-center space-x-1.5">
                        <MinusCircle className="w-3.5 h-3.5" />
                        <span>Missing NASA Flight Data</span>
                      </h5>
                      <ul className="list-disc list-inside text-xs text-slate/80 space-y-1">
                        {result.missingInformation.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Validated Citations */}
              {result.citations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate/20">
                  <h4 className="text-xs font-bold text-slate uppercase tracking-wider">
                    Source Provenance & Citations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate/20 bg-ink/50 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-copper">{cite.evidenceId}</span>
                          <span className="text-[11px] text-slate">{cite.sourceLocation}</span>
                        </div>
                        <p className="text-slate/80 text-[11px] truncate">{cite.sourceTitle}</p>
                        {cite.sourceUrl && (
                          <a
                            href={cite.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-copper hover:underline text-[11px] pt-1"
                          >
                            <span>Inspect Official Artifact</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {result.suggestedFollowUps && result.suggestedFollowUps.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-slate">Suggested follow-ups: </span>
                  <div className="inline-flex flex-wrap gap-2 mt-2">
                    {result.suggestedFollowUps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuestion(s);
                          handleAsk(s);
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-slate/10 hover:bg-copper/10 hover:text-copper border border-slate/20 text-slate transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
