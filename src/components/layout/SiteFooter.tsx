import React from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ember-border bg-ember-subtle/80 backdrop-blur-md text-xs text-paper-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/5">
          {/* Col 1: System Lockup */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-flame/10 border border-flame/30 text-flame-bright">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-wider text-sm text-paper">FIRELINE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-flame/15 text-flame-bright border border-flame/30">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-xs text-paper-muted max-w-md leading-relaxed">
              Fire Intelligence & Research Evidence Linkage Engine. Transforming NASA microgravity
              combustion datasets into explainable scientific decision support for spacecraft fire safety.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-paper-dim">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded in NASA Physical Sciences Informatics (PSI-98 & PSI-25)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-paper text-xs uppercase tracking-wider">
              Research Platform
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-flame-bright transition-colors">
                  Overview & 3D Chamber
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-flame-bright transition-colors">
                  Mission Dashboard
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-flame-bright transition-colors">
                  Evidence Explorer
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-flame-bright transition-colors">
                  Physical Comparability
                </Link>
              </li>
              <li>
                <Link href="/assess" className="hover:text-flame-bright transition-colors">
                  Mission Gap Assessor
                </Link>
              </li>
              <li>
                <Link href="/copilot" className="hover:text-flame-bright transition-colors">
                  SI Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: NASA PSI & Integrity */}
          <div className="space-y-2">
            <h4 className="font-semibold text-paper text-xs uppercase tracking-wider">
              Data & Standards
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://psi.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flame-bright flex items-center space-x-1 transition-colors"
                >
                  <span>NASA PSI Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flame-bright flex items-center space-x-1 transition-colors"
                >
                  <span>NASA Challenge: Flame in Freefall</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-paper-dim">Pydantic Scientific Data Contracts</span>
              </li>
              <li>
                <span className="text-paper-dim">Deterministic Fallback Architecture</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Epistemic Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-paper-dim">
          <p>
            Developed by <strong className="text-paper">Aniket Nandi</strong> at{' '}
            <strong className="text-flame-bright">Moon Sanctum Labs</strong> —{' '}
            <span className="italic">Decode. Build. Evolve.</span>
          </p>
          <p className="text-center md:text-right max-w-xl">
            Scientific decision support tool. Evaluates research availability and physical comparability;
            does not replace official NASA NASA-STD-6001 flight safety certification.
          </p>
        </div>
      </div>
    </footer>
  );
}
