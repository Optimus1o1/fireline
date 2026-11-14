'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

function CopilotInner() {
  const searchParams = useSearchParams();
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

  // Auto-populate inquiry if ?q= query param is passed
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && !lastQuestion) {
      setQuestion(qParam);
      handleAsk(qParam);
    }
  }, [searchParams]);

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
          <Link href="/assess" className="hover:text-bone transition-colors">Evidence Assessor</Link>
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
            <strong>SCIENTIFIC GROUNDING INVARIANT:</strong> Answers are strictly constrained to indexed NASA PSI flight evidence. Any query requesting unverified extrapolations triggers an explicit EVIDENCE_GAP.
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
                className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 ${
                  loading || !question.trim()
                    ? 'bg-slate/20 text-slate cursor-not-allowed'
                    : 'bg-copper hover:bg-copper/90 text-ink shadow-lg shadow-copper/20'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-ink/30 border-t-ink rounded-full animate-spin"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Query Copilot</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Response Container */}
          {result && (
            <div className="p-6 rounded-xl border border-slate/20 bg-ink/40 space-y-6 shadow-xl">
              {/* Epistemic Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate/20">
                <div className="flex items-center space-x-3">
                  {result.classification === 'SUPPORTED' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: SUPPORTED BY EVIDENCE</span>
                    </div>
                  )}
                  {result.classification === 'INFERRED' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: INFERRED / SCALED</span>
                    </div>
                  )}
                  {result.classification === 'EVIDENCE_GAP' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: EVIDENCE GAP DETECTED</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate">
                  Provider: <span className="text-copper">{result.providerMode}</span>
                </div>
              </div>

              {/* Inquiry Question Echo */}
              {lastQuestion && (
                <div className="text-xs text-slate">
                  <span className="font-semibold text-bone">Inquiry: </span>
                  <span>{lastQuestion}</span>
                </div>
              )}

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-1">Executive Summary</h4>
                <p className="text-sm font-semibold text-bone leading-relaxed bg-ink/60 p-4 rounded-lg border border-slate/20">
                  {result.summary}
                </p>
              </div>

              {/* Key Grounded Findings with Direct Citation Badges */}
              {result.keyFindings && result.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-2">Grounded Scientific Findings</h4>
                  <div className="space-y-2">
                    {result.keyFindings.map((kf, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate/20 bg-ink/30 space-y-2">
                        <p className="text-xs text-bone leading-relaxed">{kf.statement}</p>
                        <div className="flex items-center space-x-2 pt-1 border-t border-slate/10">
                          <span className="text-[10px] uppercase font-mono text-slate/70">Supporting Citations:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {kf.evidenceIds.map((cid, cidx) => (
                              <span
                                key={cidx}
                                className="px-2 py-0.5 rounded font-mono text-[10px] bg-copper/10 text-copper border border-copper/30 font-semibold"
                              >
                                #{cid}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scientific Interpretation */}
              {result.interpretation && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-1">Physical Interpretation</h4>
                  <p className="text-xs text-slate leading-relaxed bg-ink/20 p-3.5 rounded-lg border border-slate/10">
                    {result.interpretation}
                  </p>
                </div>
              )}

              {/* Discrepancy Warnings */}
              {result.discrepancyWarnings && result.discrepancyWarnings.length > 0 && (
                <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Scientific Discrepancy Warnings</span>
                  </h5>
                  <ul className="list-disc list-inside text-xs text-amber-200/80 space-y-1">
                    {result.discrepancyWarnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Limitations & Missing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.limitations && result.limitations.length > 0 && (
                  <div className="p-3.5 rounded-lg border border-slate/20 bg-ink/20 space-y-1.5">
                    <h5 className="text-xs font-bold text-slate uppercase tracking-wider">Experimental Limitations</h5>
                    <ul className="list-disc list-inside text-xs text-slate/80 space-y-1">
                      {result.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.missingInformation && result.missingInformation.length > 0 && (
                  <div className="p-3.5 rounded-lg border border-slate/20 bg-ink/20 space-y-1.5">
                    <h5 className="text-xs font-bold text-slate uppercase tracking-wider">Missing Information / Required Data</h5>
                    <ul className="list-disc list-inside text-xs text-slate/80 space-y-1">
                      {result.missingInformation.map((mi, idx) => (
                        <li key={idx}>{mi}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Validated Primary Source Citations */}
              {result.citations && result.citations.length > 0 && (
                <div className="pt-4 border-t border-slate/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-copper" />
                    <span>Validated Primary Source Citations</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.citations.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate/20 bg-ink/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-copper">{c.evidenceId}</span>
                          <span className="text-[10px] text-slate/70 font-mono">{c.sourceLocation}</span>
                        </div>
                        <p className="text-bone font-medium text-[11px] truncate">{c.sourceTitle}</p>
                        {c.sourceUrl && (
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-copper hover:underline text-[10px] pt-1"
                          >
                            <span>View Source Publication</span>
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

export default function CopilotPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink text-bone p-8 text-center text-sm font-mono">Loading SI Copilot...</div>}>
      <CopilotInner />
    </Suspense>
  );
}
