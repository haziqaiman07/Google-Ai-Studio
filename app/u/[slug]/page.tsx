'use client';

import React, { use, useState, useEffect } from 'react';
import { PublicProfileView } from '@/components/public-profile-view';
import { INITIAL_DEMO_PROFILE } from '@/lib/initial-data';
import { UserProfile } from '@/types/taplink';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Smartphone } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [profile, setProfile] = useState<UserProfile>(INITIAL_DEMO_PROFILE);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored =
          localStorage.getItem('taplinkpro_v4_profile') ||
          localStorage.getItem('taplinkpro_v3_profile') ||
          localStorage.getItem('taplink_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.slug === slug || slug === 'haziq') {
            setProfile(parsed);
          }
        }
      } catch {
        // fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Navigation Bar with Quick Back to TapLinkPro Studio */}
      <nav className="border-b border-[#E5DFD5] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#121110] hover:text-[#C9A24B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>TapLinkPro Platform</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-[#736E66]">NFC Tap Simulated</span>
          </div>
        </div>
      </nav>

      {/* Public Profile View Component */}
      <PublicProfileView profile={profile} isSimulatedTap={true} />
    </div>
  );
}
