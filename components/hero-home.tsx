'use client';

import React from 'react';
import {
  Sparkles,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Zap,
  Layers,
  Award,
} from 'lucide-react';
import { LUXURY_CARD_DESIGNS } from '@/lib/initial-data';
import { UserProfile, UserRole } from '@/types/taplink';

interface HeroHomeProps {
  onNavigate: (view: 'showroom' | 'public' | 'dashboard' | 'customizer' | 'architecture') => void;
  onSelectRole: (role: UserRole) => void;
  demoProfile: UserProfile;
}

export function HeroHome({ onNavigate, onSelectRole, demoProfile }: HeroHomeProps) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#C9A24B]/10 text-[#C9A24B] border border-[#C9A24B]/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Series 3.0 • The Standard in Executive Contactless Identity
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-display font-bold text-[#121110] tracking-tight leading-[1.08] mb-6">
            Luxury Physical NFC Stationery.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#181716] via-[#C9A24B] to-[#181716]">
              Instant Digital Prestige.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#736E66] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Precision-milled from aerospace titanium, forged brass, and sintered ceramic. 
            One tap against any smartphone instantly opens your verified identity and downloads your complete vCard. Zero apps required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-explore-showroom-btn"
              onClick={() => onNavigate('showroom')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#181716] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2B2927] transition-all flex items-center justify-center gap-2 shadow-xl group"
            >
              <span>Explore Bespoke Showroom</span>
              <ArrowRight className="w-4 h-4 text-[#C9A24B] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-test-nfc-tap-btn"
              onClick={() => onNavigate('public')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-[#E5DFD5] text-sm font-semibold text-[#121110] hover:border-[#C9A24B] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-[#C9A24B]" />
              <span>Simulate NFC Smartphone Tap</span>
            </button>
          </div>
        </div>

        {/* Floating Physical Card Triad Showcase */}
        <div className="mt-16 sm:mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Obsidian */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#1e1d1b] to-[#0f0e0d] border border-[#C9A24B]/30 shadow-2xl text-[#FAF8F5] flex flex-col justify-between aspect-[1.586/1] relative overflow-hidden group">
              <div className="flex justify-between items-center z-10">
                <span className="font-serif-display text-sm tracking-wider font-bold text-[#C9A24B]">TLP</span>
                <span className="text-[10px] font-mono text-[#736E66]">AEROSPACE 6061</span>
              </div>
              <div className="z-10">
                <h4 className="font-serif-display text-lg font-bold text-white">The Obsidian Sovereign</h4>
                <p className="text-xs text-[#C9A24B]">Matte Obsidian Black</p>
              </div>
              <div className="flex justify-between items-end z-10 text-[10px] font-mono text-[#9C968B]">
                <span>24.5g Solid Metal</span>
                <span className="text-[#C9A24B]">NTAG424 DNA</span>
              </div>
            </div>

            {/* Card 2: Titanium */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#383a3d] to-[#1f2124] border border-white/20 shadow-2xl text-[#FAF8F5] flex flex-col justify-between aspect-[1.586/1] relative overflow-hidden group">
              <div className="flex justify-between items-center z-10">
                <span className="font-serif-display text-sm tracking-wider font-bold text-slate-200">TLP</span>
                <span className="text-[10px] font-mono text-slate-400">GRADE-5 TITANIUM</span>
              </div>
              <div className="z-10">
                <h4 className="font-serif-display text-lg font-bold text-white">Titanium Executive</h4>
                <p className="text-xs text-slate-300">Brushed Titanium Steel</p>
              </div>
              <div className="flex justify-between items-end z-10 text-[10px] font-mono text-slate-400">
                <span>26.8g Solid Alloy</span>
                <span className="text-slate-200">Laser Inlay</span>
              </div>
            </div>

            {/* Card 3: 24K Gold Ingot */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#362709] to-[#1a1304] border border-[#FFD700]/40 shadow-2xl text-[#FAF8F5] flex flex-col justify-between aspect-[1.586/1] relative overflow-hidden group">
              <div className="flex justify-between items-center z-10">
                <span className="font-serif-display text-sm tracking-wider font-bold text-[#FFD700]">TLP</span>
                <span className="text-[10px] font-mono text-amber-500/80">24K MIRROR INGOT</span>
              </div>
              <div className="z-10">
                <h4 className="font-serif-display text-lg font-bold text-white">Imperial 24K Ingot</h4>
                <p className="text-xs text-[#FFD700]">24K Gold Mirror Finish</p>
              </div>
              <div className="flex justify-between items-end z-10 text-[10px] font-mono text-amber-300">
                <span>32.0g Heirloom Weight</span>
                <span>Serial Etched</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Craftsmanship Section */}
      <section className="bg-[#181716] text-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-display font-bold">
                Tangible Gravitas
              </h3>
              <p className="text-xs sm:text-sm text-[#9C968B] leading-relaxed">
                When you hand over a TapLinkPro card, its 24-gram solid density commands immediate attention. It speaks before words are exchanged.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-display font-bold">
                Zero Friction Tap
              </h3>
              <p className="text-xs sm:text-sm text-[#9C968B] leading-relaxed">
                Powered by ambient radio frequency induction. No battery to recharge, no software application to download, and zero typing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-display font-bold">
                Cryptographic DNA
              </h3>
              <p className="text-xs sm:text-sm text-[#9C968B] leading-relaxed">
                Built on NXP NTAG424 DNA silicon with factory-sealed two-token activation credentials. You retain instant remote emergency lock control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
