'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Send,
  Globe,
  Linkedin,
  Instagram,
  MapPin,
  Download,
  QrCode,
  Share2,
  Check,
  ShieldCheck,
  Building,
  Smartphone,
  Sparkles,
  Award,
  Crown,
} from 'lucide-react';
import { UserProfile } from '@/types/taplink';
import { downloadVCard } from '@/lib/vcard';

interface PublicProfileViewProps {
  profile: UserProfile;
  isSimulatedTap?: boolean;
  onEditProfile?: () => void;
  canEdit?: boolean;
}

export function PublicProfileView({
  profile,
  isSimulatedTap = false,
  onEditProfile,
  canEdit = false,
}: PublicProfileViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleDownloadVCard = () => {
    downloadVCard(profile);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/u/${profile.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Profile themes styling
  const getThemeClasses = () => {
    switch (profile.appearance.theme) {
      case 'obsidian':
        return {
          wrapper: 'bg-[#121110] text-[#FAF8F5]',
          card: 'bg-[#181716] border-[#2E2C2A]',
          accent: 'text-[#C9A24B]',
          accentBg: 'bg-[#C9A24B]',
          badge: 'bg-[#C9A24B]/15 text-[#C9A24B] border-[#C9A24B]/30',
          buttonPrimary: 'bg-[#C9A24B] text-[#121110] hover:bg-[#D8B45E]',
          actionBtn: 'bg-[#252422] border-[#363431] text-[#FAF8F5] hover:border-[#C9A24B]/60 hover:bg-[#2F2D2A]',
          subtext: 'text-[#9C968B]',
          divider: 'border-[#2E2C2A]',
          monogramBg: 'bg-[#252422] text-[#C9A24B] border-[#C9A24B]/40',
        };
      case 'champagne':
        return {
          wrapper: 'bg-[#252119] text-[#FAF8F5]',
          card: 'bg-[#312B20] border-[#4D4433]',
          accent: 'text-[#E6C676]',
          accentBg: 'bg-[#E6C676]',
          badge: 'bg-[#E6C676]/20 text-[#E6C676] border-[#E6C676]/40',
          buttonPrimary: 'bg-[#E6C676] text-[#252119] hover:bg-[#F2D794]',
          actionBtn: 'bg-[#3D3527] border-[#534936] text-[#FAF8F5] hover:border-[#E6C676]/60',
          subtext: 'text-[#B8AE9C]',
          divider: 'border-[#4D4433]',
          monogramBg: 'bg-[#3D3527] text-[#E6C676] border-[#E6C676]/50',
        };
      case 'titanium':
        return {
          wrapper: 'bg-[#1E2022] text-[#FAF8F5]',
          card: 'bg-[#26282B] border-[#3B3E43]',
          accent: 'text-[#CBD5E1]',
          accentBg: 'bg-[#CBD5E1]',
          badge: 'bg-[#CBD5E1]/15 text-[#E2E8F0] border-[#CBD5E1]/30',
          buttonPrimary: 'bg-[#E2E8F0] text-[#1E2022] hover:bg-white',
          actionBtn: 'bg-[#2E3236] border-[#444950] text-[#FAF8F5] hover:border-[#CBD5E1]/60',
          subtext: 'text-[#9A9FA5]',
          divider: 'border-[#3B3E43]',
          monogramBg: 'bg-[#2E3236] text-[#CBD5E1] border-[#CBD5E1]/40',
        };
      case 'ivory':
      default:
        return {
          wrapper: 'bg-[#FAF8F5] text-[#121110]',
          card: 'bg-[#FFFFFF] border-[#E8E3DA] shadow-lg shadow-[#121110]/5',
          accent: 'text-[#C9A24B]',
          accentBg: 'bg-[#C9A24B]',
          badge: 'bg-[#C9A24B]/10 text-[#A58235] border-[#C9A24B]/30',
          buttonPrimary: 'bg-[#181716] text-[#FAF8F5] hover:bg-[#2B2927]',
          actionBtn: 'bg-[#FAF8F5] border-[#E8E3DA] text-[#121110] hover:border-[#C9A24B] hover:bg-[#F5F1EB]',
          subtext: 'text-[#736E66]',
          divider: 'border-[#E8E3DA]',
          monogramBg: 'bg-[#FAF8F5] text-[#C9A24B] border-[#C9A24B]/40',
        };
    }
  };

  const theme = getThemeClasses();
  const contacts = profile.contacts;
  const cardStyle = profile.appearance.cardStyle || 'executive';

  // Compute initials for monogram archetype
  const getInitials = (name: string) => {
    if (!name) return 'TL';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(profile.fullName);

  // Determine non-empty contact items
  const contactActions = [
    contacts.phone && {
      id: 'contact-phone',
      label: 'Direct Phone',
      value: contacts.phone,
      href: `tel:${contacts.phone.replace(/[^0-9+]/g, '')}`,
      icon: Phone,
      actionText: 'Dial',
    },
    contacts.whatsapp && {
      id: 'contact-whatsapp',
      label: 'WhatsApp',
      value: 'Instant Chat',
      href: `https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${profile.fullName}, I tapped your TapLinkPro NFC business card.`)}`,
      icon: Smartphone,
      actionText: 'Message',
    },
    contacts.telegram && {
      id: 'contact-telegram',
      label: 'Telegram',
      value: contacts.telegram.startsWith('@') ? contacts.telegram : `@${contacts.telegram}`,
      href: `https://t.me/${contacts.telegram.replace('@', '')}`,
      icon: Send,
      actionText: 'Connect',
    },
    contacts.email && {
      id: 'contact-email',
      label: 'Email',
      value: contacts.email,
      href: `mailto:${contacts.email}?subject=${encodeURIComponent(`Connecting via TapLinkPro NFC Card`)}`,
      icon: Mail,
      actionText: 'Write',
    },
    contacts.linkedin && {
      id: 'contact-linkedin',
      label: 'LinkedIn',
      value: 'Executive Profile',
      href: contacts.linkedin.startsWith('http') ? contacts.linkedin : `https://linkedin.com/in/${contacts.linkedin}`,
      icon: Linkedin,
      actionText: 'View',
    },
    contacts.instagram && {
      id: 'contact-instagram',
      label: 'Instagram',
      value: contacts.instagram.startsWith('@') ? contacts.instagram : `@${contacts.instagram}`,
      href: contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '')}`,
      icon: Instagram,
      actionText: 'Follow',
    },
    contacts.website && {
      id: 'contact-website',
      label: 'Website',
      value: contacts.website.replace(/^https?:\/\//, ''),
      href: contacts.website.startsWith('http') ? contacts.website : `https://${contacts.website}`,
      icon: Globe,
      actionText: 'Visit',
    },
  ].filter(Boolean) as {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    actionText: string;
  }[];

  return (
    <div className={`w-full min-h-screen ${theme.wrapper} transition-colors duration-300 pb-16`}>
      {/* Top NFC Simulation Bar (if simulated tap mode) */}
      {isSimulatedTap && (
        <div className="bg-[#181716] border-b border-[#2E2C2A] text-[#FAF8F5] px-4 py-2.5">
          <div className="max-w-md mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A24B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A24B]"></span>
              </span>
              <span className="font-mono text-[#C9A24B] font-medium">NFC Tap Authenticated</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9C968B]">Zero App Required</span>
              {canEdit && onEditProfile && (
                <button
                  onClick={onEditProfile}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#C9A24B] text-[#121110] hover:bg-[#D8B45E]"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Mobile Centric Architecture */}
      <main className="max-w-md mx-auto px-4 pt-6 sm:pt-10">
        {/* Demo Notice Banner (if profile is demo data) */}
        {profile.isDemo && (
          <div
            id="demo-data-badge"
            className="mb-5 px-3 py-2 rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/30 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span className="font-medium text-[#C9A24B]">TapLinkPro Demo Identity</span>
            </div>
            <span className="text-[11px] font-mono text-[#C9A24B]">Official Sample</span>
          </div>
        )}

        {/* ========================================================
            ARCHETYPE 1: EXECUTIVE HIERARCHY
           ======================================================== */}
        {cardStyle === 'executive' && (
          <div className={`rounded-3xl border ${theme.card} p-6 sm:p-8 overflow-hidden relative backdrop-blur-md`}>
            {/* Top Metallic Header Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent opacity-85" />

            {/* Quick Actions Header */}
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase border ${theme.badge}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified NFC Cardholder
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  id="share-profile-btn"
                  onClick={handleCopyLink}
                  title="Copy digital profile link"
                  className={`p-2 rounded-full border transition-colors ${theme.actionBtn}`}
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  id="qr-modal-btn"
                  onClick={() => setShowQrModal(true)}
                  title="Show QR Code for scanning"
                  className={`p-2 rounded-full border transition-colors ${theme.actionBtn}`}
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Header */}
            <header className="flex flex-col items-center text-center">
              <div className="relative group mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border-2 border-[#C9A24B] shadow-xl overflow-hidden bg-[#242220]">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover transition-transform duration-200"
                      style={{
                        transform: `translate(${((profile.avatarCrop?.x || 0) / 256) * 100}%, ${((profile.avatarCrop?.y || 0) / 256) * 100}%) scale(${profile.avatarCrop?.zoom || 1}) rotate(${profile.avatarCrop?.rotate || 0}deg)`,
                        transformOrigin: 'center center',
                      }}
                    />
                  </div>
                </div>

                <div 
                  className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#181716] border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] shadow-md"
                  title="NTAG424 Cryptographic DNA Protection"
                >
                  <span className="text-[10px] font-bold font-mono">NFC</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold tracking-tight mb-1">
                {profile.fullName}
              </h1>
              <p className="text-sm sm:text-base font-medium text-[#C9A24B] mb-1">
                {profile.jobTitle}
              </p>
              {profile.company && (
                <p className={`text-xs sm:text-sm font-normal ${theme.subtext} flex items-center gap-1.5 justify-center mb-3`}>
                  <Building className="w-3.5 h-3.5 opacity-70" />
                  {profile.company}
                </p>
              )}

              {profile.location && (
                <p className={`text-xs ${theme.subtext} flex items-center gap-1.5 justify-center mb-4`}>
                  <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                  {profile.location}
                </p>
              )}

              {profile.bio && (
                <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mb-6 ${theme.subtext} font-light`}>
                  {profile.bio}
                </p>
              )}

              {/* Save Contact Button */}
              <div className="w-full mb-6">
                <button
                  id="save-contact-main-btn"
                  onClick={handleDownloadVCard}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg ${theme.buttonPrimary}`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span>Contact Saved to Phone</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Save Contact to Phone</span>
                    </>
                  )}
                </button>
                <p className={`text-[11px] mt-2 text-center ${theme.subtext}`}>
                  Downloads complete .vcf card directly into Apple Contacts or Android
                </p>
              </div>
            </header>

            {/* Contact Channels */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#736E66] mb-3 px-1">
                Direct Contact &amp; Channels
              </h2>

              {contactActions.length === 0 ? (
                <div className={`p-4 rounded-xl text-center text-xs ${theme.subtext} border border-dashed ${theme.divider}`}>
                  No contact channels configured yet.
                </div>
              ) : (
                contactActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.id}
                      id={action.id}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${theme.actionBtn} group`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#C9A24B]/10 text-[#C9A24B] flex items-center justify-center shrink-0 group-hover:bg-[#C9A24B] group-hover:text-[#121110] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0 truncate">
                          <div className="text-xs font-semibold truncate">{action.label}</div>
                          <div className={`text-[11px] truncate ${theme.subtext}`}>
                            {action.value}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#C9A24B] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                        {action.actionText} →
                      </span>
                    </a>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <footer className="mt-8 pt-6 border-t border-[#E5DFD5]/30 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#736E66]">
                <span className="font-serif-display font-semibold text-[#121110] dark:text-[#FAF8F5]">
                  TapLinkPro
                </span>
                <span>•</span>
                <span>Executive NFC Architecture</span>
              </div>
              <p className="text-[10px] text-[#736E66]/70 mt-1">
                Encrypted NTAG424 Hardware Verified
              </p>
            </footer>
          </div>
        )}

        {/* ========================================================
            ARCHETYPE 2: CONTEMPORARY MINIMAL
           ======================================================== */}
        {cardStyle === 'minimal' && (
          <div className={`rounded-3xl border ${theme.card} p-6 sm:p-8 overflow-hidden relative backdrop-blur-md`}>
            {/* Top Minimal Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5DFD5]/25">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#736E66]">
                  Digital Business Identity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Share link"
                  className={`p-1.5 rounded-lg border text-xs ${theme.actionBtn}`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setShowQrModal(true)}
                  title="Show QR"
                  className={`p-1.5 rounded-lg border text-xs ${theme.actionBtn}`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Centered Minimal Identity */}
            <div className="text-center mb-8">
              {/* Clean Frameless Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-[#C9A24B]/60 shadow-md mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${((profile.avatarCrop?.x || 0) / 256) * 100}%, ${((profile.avatarCrop?.y || 0) / 256) * 100}%) scale(${profile.avatarCrop?.zoom || 1}) rotate(${profile.avatarCrop?.rotate || 0}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-sans font-semibold tracking-tight mb-0.5">
                {profile.fullName}
              </h1>
              <p className="text-xs uppercase tracking-wider font-mono text-[#C9A24B] mb-2">
                {profile.jobTitle} {profile.company && `• ${profile.company}`}
              </p>

              {profile.location && (
                <p className={`text-xs ${theme.subtext} mb-3 flex items-center justify-center gap-1`}>
                  <MapPin className="w-3 h-3 text-[#C9A24B]" />
                  {profile.location}
                </p>
              )}

              {profile.bio && (
                <p className={`text-xs leading-relaxed max-w-xs mx-auto ${theme.subtext} font-normal mb-6`}>
                  {profile.bio}
                </p>
              )}

              {/* Minimal Primary Button */}
              <button
                id="save-contact-minimal-btn"
                onClick={handleDownloadVCard}
                className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${theme.buttonPrimary}`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Contact Saved</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save Contact Card</span>
                  </>
                )}
              </button>
            </div>

            {/* Minimal Pill Actions Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#736E66] block px-1">
                Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contactActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.id}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition-colors ${theme.actionBtn}`}
                    >
                      <Icon className="w-4 h-4 text-[#C9A24B] shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-semibold block truncate">{action.label}</span>
                        <span className={`text-[10px] block truncate ${theme.subtext}`}>{action.value}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Minimal Footer */}
            <footer className="mt-8 pt-4 border-t border-[#E5DFD5]/20 text-center">
              <p className="text-[10px] font-mono text-[#736E66]/70">
                TapLinkPro Minimal Edition • Contactless Identity
              </p>
            </footer>
          </div>
        )}

        {/* ========================================================
            ARCHETYPE 3: LUXURY MONOGRAM ATELIER
           ======================================================== */}
        {cardStyle === 'monogram' && (
          <div className={`rounded-3xl border-2 border-[#C9A24B]/40 ${theme.card} p-7 sm:p-9 overflow-hidden relative shadow-xl backdrop-blur-md`}>
            {/* Fine Ornamental Corner Borders */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C9A24B]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C9A24B]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C9A24B]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C9A24B]" />

            {/* Header Monogram Medallion */}
            <div className="text-center pt-2 mb-6">
              <div className="inline-flex flex-col items-center">
                {/* Monogram Circular Medallion */}
                <div className={`w-20 h-20 rounded-full border-2 border-[#C9A24B] ${theme.monogramBg} flex items-center justify-center shadow-lg relative mb-4`}>
                  <Crown className="w-4 h-4 text-[#C9A24B] absolute -top-2.5" />
                  <span className="font-serif-display text-2xl font-bold tracking-widest text-[#C9A24B]">
                    {initials}
                  </span>
                </div>

                {/* Fine Ornamental Filigree Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#C9A24B]" />
                  <span className="text-[10px] font-serif-display uppercase tracking-[0.25em] text-[#C9A24B]">
                    Atelier Bespoke
                  </span>
                  <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#C9A24B]" />
                </div>
              </div>

              {/* Name & Title in Luxury Typography */}
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold tracking-normal text-[#121110] dark:text-[#FAF8F5] mt-2 mb-1">
                {profile.fullName}
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] font-serif-display text-[#C9A24B] font-semibold mb-1">
                {profile.jobTitle}
              </p>
              {profile.company && (
                <p className={`text-xs ${theme.subtext} font-serif-display italic mb-2`}>
                  {profile.company}
                </p>
              )}

              {/* Photo Inset Thumbnail */}
              <div className="flex justify-center my-4">
                <div className="w-14 h-14 rounded-full border border-[#C9A24B] p-0.5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full rounded-full object-cover"
                    style={{
                      transform: `translate(${((profile.avatarCrop?.x || 0) / 256) * 100}%, ${((profile.avatarCrop?.y || 0) / 256) * 100}%) scale(${profile.avatarCrop?.zoom || 1}) rotate(${profile.avatarCrop?.rotate || 0}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              </div>

              {profile.bio && (
                <p className={`text-xs italic leading-relaxed max-w-sm mx-auto ${theme.subtext} mb-6`}>
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}

              {/* Save Card Button */}
              <button
                id="save-contact-monogram-btn"
                onClick={handleDownloadVCard}
                className={`w-full py-3.5 px-6 rounded-xl font-serif-display font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 border border-[#C9A24B] shadow-md transition-all ${theme.buttonPrimary}`}
              >
                {downloadSuccess ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Credentials Saved</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download vCard Stationery</span>
                  </>
                )}
              </button>
            </div>

            {/* Monogram Contact List */}
            <div className="space-y-2 pt-4 border-t border-[#C9A24B]/30">
              <span className="text-[10px] font-serif-display uppercase tracking-[0.2em] text-[#C9A24B] block text-center mb-3">
                Official Corresponence
              </span>
              {contactActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.id}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-lg border border-[#C9A24B]/30 transition-all ${theme.actionBtn}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#C9A24B]" />
                      <span className="text-xs font-serif-display">{action.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#C9A24B]">
                      {action.actionText} →
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Monogram Footer */}
            <footer className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-center">
              <p className="text-[10px] font-serif-display tracking-widest uppercase text-[#736E66]">
                TapLinkPro Monogram Heritage • Sealed Cryptographic Token
              </p>
            </footer>
          </div>
        )}
      </main>

      {/* QR Code Modal for In-Person Camera Scanning */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#FAF8F5] text-[#121110] p-6 shadow-2xl border border-[#E5DFD5] text-center">
            <h4 className="font-serif-display text-xl font-bold mb-1">
              In-Person Contact Scan
            </h4>
            <p className="text-xs text-[#736E66] mb-5">
              Point any camera at this QR code to instantly open {profile.fullName}&apos;s verified card
            </p>

            {/* Generated visual QR code for this profile URL */}
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white rounded-2xl border-2 border-[#C9A24B] shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    typeof window !== 'undefined' ? `${window.location.origin}/u/${profile.slug}` : `https://taplinkpro.id/u/${profile.slug}`
                  )}&color=181716&bgcolor=ffffff`}
                  alt="Profile QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
            </div>

            <p className="text-xs font-mono text-[#736E66] mb-5">
              taplinkpro.id/u/{profile.slug}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
