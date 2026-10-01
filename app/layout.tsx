import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TapLinkPro V5 — Luxury NFC Business Cards',
  description: 'Luxury physical NFC business cards, digital identity profiles, and practical small-business card lifecycle management.',
  openGraph: {
    title: 'TapLinkPro V5 — Luxury NFC Business Cards',
    description: 'Luxury physical NFC business cards, digital identity profiles, and practical small-business card lifecycle management.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TapLinkPro V5 — Luxury NFC Business Cards',
    description: 'Luxury physical NFC business cards, digital identity profiles, and practical small-business card lifecycle management.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#FAF8F5] text-[#121110] antialiased">
        {children}
      </body>
    </html>
  );
}
