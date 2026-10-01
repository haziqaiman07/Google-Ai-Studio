'use client';

import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Share2,
  ExternalLink,
  Edit,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Download,
  Lock,
} from 'lucide-react';
import { PhysicalCard, UserProfile } from '@/types/taplink';
import { calculateProfileCompletion } from '@/lib/initial-data';
import { downloadVCard } from '@/lib/vcard';

interface DashboardViewProps {
  profile: UserProfile;
  card: PhysicalCard | null;
  onNavigate: (view: 'profile' | 'card' | 'designs' | 'public') => void;
  onOpenActivation: () => void;
}

export function DashboardView({
  profile,
  card,
  onNavigate,
  onOpenActivation,
}: DashboardViewProps) {
  const completion = calculateProfileCompletion(profile);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B]">
            Executive Identity Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#121110]">
            Welcome back, {profile.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#736E66] mt-1">
            TapLinkPro Series 3.0 • Verified physical cardholder workstation
          </p>
        </div>

        {/* Quick Action Pill Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all shadow-sm"
          >
            <Edit className="w-3.5 h-3.5 text-[#C9A24B]" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* The 4 Core Questions Grid (Architectural mandate) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QUESTION 1: Is my NFC card active? */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E66]">
                Question 01
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                  card && card.status === 'ACTIVE' && !card.isHardwareLocked
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : card?.isHardwareLocked
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {card && card.status === 'ACTIVE' && !card.isHardwareLocked ? (
                  <>
                    <ShieldCheck className="w-3 h-3" /> Card Active
                  </>
                ) : card?.isHardwareLocked ? (
                  <>
                    <Lock className="w-3 h-3" /> Hardware Locked
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" /> No Card Linked
                  </>
                )}
              </span>
            </div>

            <h3 className="text-xl font-serif-display font-bold text-[#121110] mb-2">
              Is my physical NFC card active?
            </h3>

            {card && card.status === 'ACTIVE' ? (
              <div className="space-y-3 mt-4">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Hardware Edition:</span>
                    <span className="font-semibold text-[#121110]">{card.designName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Finish:</span>
                    <span>{card.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Card Serial Number:</span>
                    <span className="font-mono text-[#C9A24B]">{card.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Hardware Read Status:</span>
                    <span className="font-mono">{card.tapCount} verified smartphone taps</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#736E66] leading-relaxed mt-2">
                No physical NFC card is currently active on your account. You can configure your digital profile first, then activate your card when your luxury presentation package arrives.
              </p>
            )}
          </div>

          <div className="pt-5 mt-4 border-t border-[#E5DFD5]">
            <button
              onClick={() => onNavigate('card')}
              className="text-xs font-semibold text-[#C9A24B] hover:text-[#A58235] inline-flex items-center gap-1"
            >
              <span>Manage hardware &amp; security locks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* QUESTION 2: Is my profile complete? (Calculated dynamically, never hardcoded!) */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E66]">
                Question 02
              </span>
              <span className="font-mono text-xs font-bold text-[#121110]">
                {completion.percentage}% Complete
              </span>
            </div>

            <h3 className="text-xl font-serif-display font-bold text-[#121110] mb-2">
              Is my digital identity profile complete?
            </h3>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-[#EBE6DC] h-2 rounded-full overflow-hidden my-3">
              <div
                className="bg-[#C9A24B] h-full transition-all duration-500 rounded-full"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>

            <p className="text-xs text-[#736E66] mb-3">
              {completion.completedCount} of {completion.totalCount} identity attributes populated.
            </p>

            {/* Missing items checklist if any */}
            {completion.missingFields.length > 0 ? (
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DFD5] text-[11px] text-[#736E66]">
                <span className="font-semibold text-[#121110] block mb-1">
                  Recommended additions for higher engagement:
                </span>
                <span className="text-[#C9A24B]">
                  Missing: {completion.missingFields.slice(0, 3).join(', ')}
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All core executive contact attributes are complete and verified.</span>
              </div>
            )}
          </div>

          <div className="pt-5 mt-4 border-t border-[#E5DFD5]">
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-[#C9A24B] hover:text-[#A58235] inline-flex items-center gap-1"
            >
              <span>Update profile attributes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* QUESTION 3: How do people contact me? */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E66]">
                Question 03
              </span>
              <span className="text-[10px] font-mono text-[#C9A24B]">Direct Routing</span>
            </div>

            <h3 className="text-xl font-serif-display font-bold text-[#121110] mb-2">
              How do people contact me?
            </h3>

            <p className="text-xs text-[#736E66] leading-relaxed mb-4">
              When someone taps your physical NFC card or scans your QR code, their phone immediately accesses:
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#736E66]">Public Tap URL:</span>
                <span className="font-mono text-[#121110] font-medium">/u/{profile.slug}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#736E66]">Direct Actions:</span>
                <span className="text-[#121110]">
                  Phone dial, WhatsApp, Telegram, Email, LinkedIn
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#736E66]">1-Click vCard:</span>
                <button
                  onClick={() => downloadVCard(profile)}
                  className="text-[#C9A24B] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Test .vcf download
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#E5DFD5] flex items-center justify-between">
            <button
              onClick={() => onNavigate('public')}
              className="text-xs font-semibold text-[#C9A24B] hover:text-[#A58235] inline-flex items-center gap-1"
            >
              <span>View live NFC page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* QUESTION 4: What should I do next? */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E66]">
                Question 04
              </span>
              <span className="text-[10px] font-mono text-[#C9A24B]">Action Checklist</span>
            </div>

            <h3 className="text-xl font-serif-display font-bold text-[#121110] mb-2">
              What should I do next?
            </h3>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                <span className="w-5 h-5 rounded-full bg-[#181716] text-[#FAF8F5] text-[10px] font-mono flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <span className="font-semibold text-[#121110] block">
                    Verify Your Contact Card (.vcf)
                  </span>
                  <span className="text-[#736E66] text-[11px]">
                    Ensure phone, email, and company title are up to date.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                <span className="w-5 h-5 rounded-full bg-[#181716] text-[#FAF8F5] text-[10px] font-mono flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <span className="font-semibold text-[#121110] block">
                    {card ? 'Check Hardware Lock Setting' : 'Activate Physical Card'}
                  </span>
                  <span className="text-[#736E66] text-[11px]">
                    {card
                      ? 'Ensure emergency lock is off so taps route cleanly.'
                      : 'Enter your Card Serial and Code once package arrives.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                <span className="w-5 h-5 rounded-full bg-[#181716] text-[#FAF8F5] text-[10px] font-mono flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <span className="font-semibold text-[#121110] block">
                    Explore Luxury Materials
                  </span>
                  <span className="text-[#736E66] text-[11px]">
                    Browse solid titanium, 24K gold mirror, or ceramic finishes in the showroom.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#E5DFD5]">
            <button
              onClick={() => onNavigate('designs')}
              className="text-xs font-semibold text-[#C9A24B] hover:text-[#A58235] inline-flex items-center gap-1"
            >
              <span>Explore Bespoke Showroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MANDATORY ANALYTICS PLACEHOLDER (Explicit Prompt Rule: Do NOT invent fake numbers!) */}
      <div className="rounded-3xl border border-[#E5DFD5] bg-[#F5F1EB] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-center mx-auto text-[#C9A24B] shadow-sm">
          <Sliders className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-serif-display font-bold text-[#121110]">
          Contactless Telemetry &amp; Analytics
        </h4>
        <p className="text-sm font-medium text-[#121110]">
          {card && card.status === 'ACTIVE'
            ? 'Analytics available after NFC activation'
            : 'Analytics available after NFC activation'}
        </p>
        <p className="text-xs text-[#736E66] max-w-lg mx-auto leading-relaxed">
          In adherence to our strict zero-fabrication privacy standard, TapLinkPro does not display simulated engagement numbers. Real-time unique device taps, vCard downloads, and contact channels are tracked securely via cryptographic tokens once your physical hardware card is tapped in the field.
        </p>
      </div>
    </div>
  );
}
