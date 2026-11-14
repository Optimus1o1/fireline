'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  LayoutDashboard,
  Search,
  GitCompare,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  Compass,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', href: '/', icon: Compass, exact: true },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Evidence Explorer', href: '/explore', icon: Search },
  { name: 'Comparability', href: '/compare', icon: GitCompare },
  { name: 'Mission Assessor', href: '/assess', icon: ShieldAlert },
  { name: 'SI Copilot', href: '/copilot', icon: Sparkles },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll detection for glass intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-ember-bg/90 backdrop-blur-md border-b border-ember-border shadow-glass'
          : 'bg-ember-bg/80 backdrop-blur border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Lockup */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 rounded-xl bg-flame/10 border border-flame/30 text-flame-bright group-hover:border-flame-bright group-hover:bg-flame/20 transition-all duration-300 shadow-ember-sm">
              <Flame className="w-5 h-5 animate-pulse" />
              <div className="absolute -inset-1 rounded-xl bg-flame-bright/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-base text-paper group-hover:text-white transition-colors">
                  FIRELINE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-flame/15 text-flame-bright border border-flame/30">
                  PSI
                </span>
              </div>
              <p className="text-[10px] font-medium text-paper-muted tracking-tight">
                NASA Microgravity Fire Decision Support
              </p>
            </div>
          </Link>

          {/* Desktop Global Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 ${
                    active
                      ? 'text-white bg-flame/15 border border-flame/30 shadow-ember-sm'
                      : 'text-paper-muted hover:text-paper hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      active ? 'text-flame-bright' : 'text-paper-dim'
                    }`}
                  />
                  <span>{item.name}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-flame to-flame-bright rounded-full shadow-ember" />
                  )}
                </Link>
              );
            })}

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            {/* External NASA PSI Link */}
            <a
              href="https://psi.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-xs font-medium text-paper-muted hover:text-white flex items-center space-x-1 transition-colors"
              title="NASA Physical Sciences Informatics Repository"
            >
              <span>NASA PSI</span>
              <ExternalLink className="w-3 h-3 text-paper-dim" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-ember-surface border border-ember-border text-paper hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-flame-bright" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ember-border bg-ember-bg/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-flame/20 text-white border border-flame/40 font-semibold'
                      : 'text-paper-muted hover:text-paper hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-flame-bright' : 'text-paper-dim'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <a
              href="https://psi.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-paper-muted hover:text-white hover:bg-white/5"
            >
              <span className="flex items-center space-x-2">
                <span>NASA Physical Sciences Informatics</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-paper-dim" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
