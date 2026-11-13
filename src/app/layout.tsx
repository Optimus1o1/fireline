import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "FIRELINE — NASA's Microgravity Fire Intelligence Platform",
  description:
    'Evidence-first scientific research and decision-support system for NASA microgravity combustion data and spacecraft fire safety.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink text-bone antialiased selection:bg-copper selection:text-ink">
        {children}
      </body>
    </html>
  );
}

