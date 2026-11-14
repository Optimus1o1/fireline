'use client';

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  BookOpen,
  ArrowRight,
  Send,
  X,
  RotateCcw,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAsk = useCallback(
    async (queryText?: string) => {
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
    },
    [question]
  );

  // Auto-populate inquiry if ?q= query param is passed
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && !lastQuestion) {
      setQuestion(qParam);
      handleAsk(qParam);
    }
  }, [searchParams, lastQuestion, handleAsk]);

  // Handle textarea enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      {/* Dataset Grounding Safeguard Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>SCIENTIFIC GROUNDING INVARIANT:</strong> Answers are strictly constrained to indexed NASA PSI flight evidence. Unverified extrapolations trigger an explicit EVIDENCE_GAP.
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-mono shrink-0">
          <span>COGNITIVE ENGINE:</span>
          <span className="font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
            {result?.providerMode === 'GEMINI' ? 'GEMINI ACTIVE' : 'DETERMINISTIC FALLBACK READY'}
          </span>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Suggested Inquiries & Corpus Summary */}
        <aside className="w-full md:w-80 border-r border-ember-border p-5 space-y-6 bg-ember-subtle/60 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Suggested Scientific Inquiries
            </h3>
            <p className="text-[11px] text-paper-dim mt-0.5">
              Click to evaluate against grounded NASA evidence
            </p>
            <div className="mt-3 space-y-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="w-full text-left p-3 rounded-xl glass-panel border border-ember-border hover:border-flame-bright hover:bg-flame/10 text-xs text-paper transition-all leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
              Indexed Evidence Corpus
            </h3>
            <div className="text-xs space-y-2 text-paper-muted">
              <div className="p-3 rounded-xl glass-panel border border-white/5 font-mono">
                <p className="font-bold text-white">Saffire-I (PSI-98)</p>
                <p className="text-[11px] text-paper-dim mt-0.5">Cygnus flight table (5 rows, SIBAL fabric)</p>
              </div>
              <div className="p-3 rounded-xl glass-panel border border-white/5 font-mono">
                <p className="font-bold text-white">BASS-II (PSI-25)</p>
                <p className="text-[11px] text-paper-dim mt-0.5">Thin PMMA films (100–300 µm) with uncalibrated fan indices</p>
              </div>
              <div className="p-3 rounded-xl glass-panel border border-white/5 opacity-65 font-mono">
                <p className="font-bold text-paper-muted">FLEX (PSI-69)</p>
                <p className="text-[11px] text-paper-dim mt-0.5">Audited droplet extinction claims (raw runs deferred)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Query Input & Grounded Response */}
        <section className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Query Input Box */}
          <div className="glass-panel-elevated p-5 rounded-3xl border border-ember-border space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Bot className="w-4 h-4 text-flame-bright" />
                <span>Super Intelligence (SI) Scientific Query</span>
              </label>
              {question.trim() && (
                <button
                  onClick={() => setQuestion('')}
                  className="text-xs text-paper-dim hover:text-white flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about microgravity combustion, flame spread rates, or spaceflight atmospheric limits (Enter to submit, Shift+Enter for newline)..."
                className="w-full bg-ember-bg border border-ember-border rounded-2xl p-3.5 text-xs text-white placeholder-paper-dim focus:outline-none focus:border-flame-bright resize-none"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-paper-dim font-mono">
                  Grounded strictly in NASA PSI citations
                </span>
                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !question.trim()}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
                    loading || !question.trim()
                      ? 'bg-white/5 text-paper-dim cursor-not-allowed'
                      : 'bg-flame hover:bg-flame-bright text-white shadow-ember'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing...</span>
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
          </div>

          {error && (
            <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Response Container */}
          {result && (
            <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-ember-border space-y-6 shadow-xl animate-in fade-in duration-300">
              {/* Epistemic Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div className="flex items-center space-x-3">
                  {result.classification === 'SUPPORTED' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: SUPPORTED BY EVIDENCE</span>
                    </div>
                  )}
                  {result.classification === 'INFERRED' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: INFERRED / SCALED</span>
                    </div>
                  )}
                  {result.classification === 'EVIDENCE_GAP' && (
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-flame/15 text-flame-bright border border-flame/30">
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>EPISTEMIC STATUS: EVIDENCE GAP DETECTED</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-paper-dim">
                  Inference Mode: <span className="text-flame-bright font-bold">{result.providerMode}</span>
                </div>
              </div>

              {/* Inquiry Echo */}
              {lastQuestion && (
                <div className="text-xs text-paper-muted">
                  <span className="font-semibold text-white">Inquiry: </span>
                  <span className="italic">{lastQuestion}</span>
                </div>
              )}

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-paper-muted mb-1.5">
                  Executive Summary
                </h4>
                <p className="text-sm font-semibold text-white leading-relaxed bg-ember-bg/70 p-4 rounded-2xl border border-ember-border">
                  {result.summary}
                </p>
              </div>

              {/* Key Grounded Findings */}
              {result.keyFindings && result.keyFindings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-paper-muted">
                    Grounded Scientific Findings
                  </h4>
                  <div className="space-y-2.5">
                    {result.keyFindings.map((kf, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl glass-panel border border-white/5 space-y-2.5"
                      >
                        <p className="text-xs text-paper leading-relaxed">{kf.statement}</p>
                        <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] uppercase font-mono text-paper-dim">
                            Supporting Citations:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {kf.evidenceIds.map((cid, cidx) => (
                              <span
                                key={cidx}
                                className="px-2 py-0.5 rounded font-mono text-[10px] bg-flame/10 text-flame-bright border border-flame/20 font-bold"
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

              {/* Physical Interpretation */}
              {result.interpretation && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-paper-muted mb-1.5">
                    Physical Interpretation
                  </h4>
                  <p className="text-xs text-paper-muted leading-relaxed bg-ember-surface/60 p-4 rounded-2xl border border-white/5">
                    {result.interpretation}
                  </p>
                </div>
              )}

              {/* Discrepancy Warnings */}
              {result.discrepancyWarnings && result.discrepancyWarnings.length > 0 && (
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Scientific Discrepancy Warnings</span>
                  </h5>
                  <ul className="list-disc list-inside text-xs text-amber-200 leading-relaxed space-y-1">
                    {result.discrepancyWarnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Limitations & Missing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.limitations && result.limitations.length > 0 && (
                  <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1.5">
                    <h5 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
                      Experimental Limitations
                    </h5>
                    <ul className="list-disc list-inside text-xs text-paper-dim space-y-1">
                      {result.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.missingInformation && result.missingInformation.length > 0 && (
                  <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1.5">
                    <h5 className="text-xs font-bold text-paper-muted uppercase tracking-wider">
                      Missing Information / Required Data
                    </h5>
                    <ul className="list-disc list-inside text-xs text-paper-dim space-y-1">
                      {result.missingInformation.map((mi, idx) => (
                        <li key={idx}>{mi}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Validated Primary Source Citations */}
              {result.citations && result.citations.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-paper-muted flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-flame-bright" />
                    <span>Validated Primary Source Citations</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.citations.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl glass-panel border border-white/5 text-xs space-y-1 font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-flame-bright">{c.evidenceId}</span>
                          <span className="text-[10px] text-paper-dim">{c.sourceLocation}</span>
                        </div>
                        <p className="text-white font-medium text-[11px] truncate font-sans">
                          {c.sourceTitle}
                        </p>
                        {c.sourceUrl && (
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-flame-bright hover:underline text-[10px] pt-1"
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
                  <span className="text-xs text-paper-dim">Suggested follow-ups: </span>
                  <div className="inline-flex flex-wrap gap-2 mt-2">
                    {result.suggestedFollowUps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuestion(s);
                          handleAsk(s);
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl glass-panel hover:bg-flame/10 hover:text-white border border-ember-border text-paper-muted transition-colors"
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-ember-bg text-paper p-8 text-center text-sm font-mono">
          Loading SI Copilot...
        </div>
      }
    >
      <CopilotInner />
    </Suspense>
  );
}
