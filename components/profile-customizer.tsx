'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  Palette,
  Camera,
  Eye,
  Edit3,
  Check,
  Shield,
  Save,
  Clock,
} from 'lucide-react';
import { UserProfile, AvatarCropData } from '@/types/taplink';
import { ProfilePhotoEditor } from './profile-photo-editor';
import { PublicProfileView } from './public-profile-view';

interface ProfileCustomizerProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  userRole: string;
}

export function ProfileCustomizer({
  profile,
  onUpdateProfile,
  userRole,
}: ProfileCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'appearance'>('personal');
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
  const [manualSaved, setManualSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Real-time Live Sync (Kept intact: onUpdateProfile fires immediately on changes)
  const handleFieldChange = (field: keyof UserProfile, value: unknown) => {
    const updated = {
      ...profile,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    triggerLiveSyncNotice();
  };

  const handleContactChange = (field: keyof UserProfile['contacts'], value: string) => {
    const updated: UserProfile = {
      ...profile,
      contacts: {
        ...profile.contacts,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    triggerLiveSyncNotice();
  };

  const handleAppearanceChange = (field: keyof UserProfile['appearance'], value: unknown) => {
    const updated: UserProfile = {
      ...profile,
      appearance: {
        ...profile.appearance,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    triggerLiveSyncNotice();
  };

  const handleSaveAvatar = (url: string, crop: AvatarCropData) => {
    const updated: UserProfile = {
      ...profile,
      avatarUrl: url,
      avatarCrop: crop,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    triggerLiveSyncNotice();
  };

  const triggerLiveSyncNotice = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  // Dedicated manual Save button action
  const handleManualSave = () => {
    setManualSaving(true);
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('taplinkpro_v3_profile', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to write profile to localStorage', err);
      }
    }
    setTimeout(() => {
      setManualSaving(false);
      setManualSaved(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeStr);
      setTimeout(() => setManualSaved(false), 3500);
    }, 450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5DFD5]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B]">
            Digital Identity Studio
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#121110]">
            Profile Customizer
          </h2>
          <p className="text-xs sm:text-sm text-[#736E66]">
            Live configuration for instant NFC contactless identity display.
          </p>
        </div>

        {/* Header Actions: Save Button, Live Sync Badge & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Live sync heartbeat */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5DFD5] text-[11px] font-mono text-[#736E66]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{savedNotification ? 'Syncing...' : 'Live Sync Active'}</span>
          </div>

          {/* Manual Save Profile Button */}
          <button
            id="save-profile-header-btn"
            onClick={handleManualSave}
            disabled={manualSaving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
              manualSaved
                ? 'bg-emerald-700 text-white'
                : 'bg-[#181716] text-[#FAF8F5] hover:bg-[#2B2927]'
            }`}
          >
            {manualSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved ({lastSavedTime})</span>
              </>
            ) : manualSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Save Profile</span>
              </>
            )}
          </button>

          {/* Mobile Edit / Preview toggle */}
          <div className="flex lg:hidden bg-[#EBE6DC] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMobileMode('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mobileMode === 'edit'
                  ? 'bg-[#181716] text-[#FAF8F5]'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setMobileMode('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mobileMode === 'preview'
                  ? 'bg-[#181716] text-[#FAF8F5]'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A24B]" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Split View: Left Controls / Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Editing Controls */}
        <div
          className={`lg:col-span-6 xl:col-span-7 bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-sm ${
            mobileMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section Tabs (Personal, Contact, Appearance - Payment removed per user instruction) */}
          <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-[#E5DFD5]">
            <button
              onClick={() => setActiveTab('personal')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'personal'
                  ? 'bg-[#181716] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#C9A24B]" />
              Personal
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'contact'
                  ? 'bg-[#181716] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
              Contact
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'appearance'
                  ? 'bg-[#181716] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#C9A24B]" />
              Appearance
            </button>
          </div>

          {/* TAB 1: PERSONAL */}
          {activeTab === 'personal' && (
            <div className="space-y-5">
              {/* Photo & Alignment trigger */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5]">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A24B] shrink-0 bg-[#181716]">
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
                <div>
                  <h4 className="text-xs font-semibold text-[#121110] mb-0.5">
                    Profile Portrait Alignment
                  </h4>
                  <p className="text-[11px] text-[#736E66] mb-2">
                    Adjust zoom, rotation, and freely reposition face inside the circular NFC boundary.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPhotoEditor(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C9A24B]" />
                    Edit Position &amp; Crop
                  </button>
                </div>
              </div>

              {/* Personal Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => handleFieldChange('company', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    placeholder="e.g. Kuala Lumpur, Malaysia"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                  Short Executive Biography
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <p className="text-xs text-[#736E66] mb-2">
                Only fields with content will appear on your public NFC card. Empty fields are automatically suppressed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Direct Phone (vCard dial)
                  </label>
                  <input
                    type="text"
                    value={profile.contacts.phone || ''}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+60 16-52353789"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={profile.contacts.email || ''}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="dhaziq.aiman@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={profile.contacts.whatsapp || ''}
                    onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                    placeholder="601652353789 (country code first)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Telegram Handle
                  </label>
                  <input
                    type="text"
                    value={profile.contacts.telegram || ''}
                    onChange={(e) => handleContactChange('telegram', e.target.value)}
                    placeholder="@taplinkpro"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    LinkedIn Username / URL
                  </label>
                  <input
                    type="text"
                    value={profile.contacts.linkedin || ''}
                    onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    placeholder="haziq-aiman"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={profile.contacts.instagram || ''}
                    onChange={(e) => handleContactChange('instagram', e.target.value)}
                    placeholder="taplinkpro"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  value={profile.contacts.website || ''}
                  onChange={(e) => handleContactChange('website', e.target.value)}
                  placeholder="https://taplinkpro.id"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-3">
                  Digital Palette Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'obsidian', name: 'Obsidian Noir', bg: '#181716', border: '#C9A24B', text: '#FAF8F5' },
                    { id: 'ivory', name: 'Alabaster Ivory', bg: '#FAF8F5', border: '#C9A24B', text: '#121110' },
                    { id: 'champagne', name: 'Champagne Brass', bg: '#312B20', border: '#E6C676', text: '#FAF8F5' },
                    { id: 'titanium', name: 'Brushed Titanium', bg: '#26282B', border: '#CBD5E1', text: '#FAF8F5' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAppearanceChange('theme', t.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        profile.appearance.theme === t.id
                          ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]/30'
                          : 'border-[#E5DFD5] hover:border-[#C9A24B]/50'
                      }`}
                      style={{ backgroundColor: t.bg }}
                    >
                      <div className="w-5 h-5 rounded-full mb-2 border" style={{ borderColor: t.border, backgroundColor: t.border }} />
                      <span className="text-xs font-semibold block truncate" style={{ color: t.text }}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-3">
                  Card Layout Archetype
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'executive', name: 'Executive', desc: 'Formal hierarchy & gold seal' },
                    { id: 'minimal', name: 'Minimalist', desc: 'Clean Scandinavian pill layout' },
                    { id: 'monogram', name: 'Monogram', desc: 'Atelier bespoke stationery' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleAppearanceChange('cardStyle', style.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        profile.appearance.cardStyle === style.id
                          ? 'border-[#C9A24B] bg-[#C9A24B]/10 font-semibold'
                          : 'border-[#E5DFD5] hover:border-[#C9A24B]/50'
                      }`}
                    >
                      <span className="text-xs text-[#121110] block">{style.name}</span>
                      <span className="text-[10px] text-[#736E66] block">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Explicit Save Bar */}
          <div className="mt-8 pt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#736E66] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>All changes automatically live-sync. Click save to store permanent record.</span>
            </div>
            <button
              id="save-profile-bottom-btn"
              onClick={handleManualSave}
              disabled={manualSaving}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                manualSaved
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#181716] text-[#FAF8F5] hover:bg-[#2B2927]'
              }`}
            >
              {manualSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Profile Saved Successfully</span>
                </>
              ) : manualSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Committing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C9A24B]" />
                  <span>Save Digital Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Digital Card Preview (Sticky Mobile Simulator) */}
        <div
          className={`lg:col-span-6 xl:col-span-5 ${
            mobileMode === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-20">
            <div className="flex items-center justify-between px-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#736E66] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live NFC Tap View Simulator
              </span>
              <span className="text-[11px] font-mono text-[#736E66]">
                /u/{profile.slug}
              </span>
            </div>

            {/* Mobile Device Bezel Framing */}
            <div className="rounded-[40px] border-[6px] border-[#181716] shadow-2xl overflow-hidden bg-black max-w-[380px] mx-auto">
              {/* Dynamic Island / Speaker notch */}
              <div className="bg-[#181716] py-2 flex justify-center items-center">
                <div className="w-20 h-4 bg-black rounded-full" />
              </div>

              {/* Viewport Inside */}
              <div className="max-h-[640px] overflow-y-auto">
                <PublicProfileView profile={profile} isSimulatedTap={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Repositioning Editor Modal */}
      {showPhotoEditor && (
        <ProfilePhotoEditor
          currentUrl={profile.avatarUrl}
          cropData={profile.avatarCrop}
          onSave={handleSaveAvatar}
          onClose={() => setShowPhotoEditor(false)}
        />
      )}
    </div>
  );
}
