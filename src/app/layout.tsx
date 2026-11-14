import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: "FIRELINE — NASA's Microgravity Fire Intelligence Platform",
  description:
    'Evidence-first scientific research and decision-support system for NASA microgravity combustion data and spacecraft fire safety. NASA Space Apps Challenge 2026.',
  keywords: [
    'NASA',
    'Space Apps Challenge',
    'Microgravity Combustion',
    'Fire Safety',
    'Saffire',
    'BASS-II',
    'FLEX',
    'Spacecraft Safety',
    'Moon Sanctum Labs',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-ember-bg text-paper antialiased selection:bg-flame selection:text-white flex flex-col font-sans">
        <SiteHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
