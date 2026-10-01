'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Shield,
  Layers,
  Check,
  CreditCard,
  Sliders,
  ChevronRight,
  Info,
  Clock,
  BellRing,
  ArrowRight,
} from 'lucide-react';
import { CardDesign, Order } from '@/types/taplink';
import { LUXURY_CARD_DESIGNS } from '@/lib/initial-data';

interface CardShowroomProps {
  onSelectDesignForOrder?: (design: CardDesign) => void;
  onPlaceOrder?: (order: Order) => void;
  userFullName?: string;
  userEmail?: string;
  userPhone?: string;
  userCompany?: string;
  designs?: CardDesign[];
}

export function CardShowroom({
  onSelectDesignForOrder,
  onPlaceOrder,
  userFullName = 'Haziq Aiman',
  userEmail = 'dhaziq.aiman@gmail.com',
  userPhone = '+60 16-52353789',
  userCompany = 'TapLinkPro',
  designs = LUXURY_CARD_DESIGNS,
}: CardShowroomProps) {
  const activeDesigns = designs.filter((d) => d.availability !== 'DISABLED');
  const [selectedDesignId, setSelectedDesignId] = useState<string>(
    activeDesigns[0]?.id || LUXURY_CARD_DESIGNS[0].id
  );
  const [customName, setCustomName] = useState<string>(userFullName);
  const [customRole, setCustomRole] = useState<string>('Creative Director');
  const [shippingAddress, setShippingAddress] = useState<string>(
    'Tower 2, Level 38, KLCC Suites, 50088 Kuala Lumpur, Malaysia'
  );
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  // Metal Card VIP Waitlist state
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState(userEmail);

  const cardRef = useRef<HTMLDivElement>(null);

  const currentDesign =
    activeDesigns.find((d) => d.id === selectedDesignId) || activeDesigns[0] || LUXURY_CARD_DESIGNS[0];

  const isComingSoon = currentDesign.availability === 'WAITLIST' || currentDesign.category.includes('Coming Soon');

  // Mouse / Touch 3D tilt tracking for physical card luster
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Modest degree of tilt (Apple/Porsche style subtle physical presence)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Card texture styling based on authentic material selection
  const getCardMaterialStyle = (design: CardDesign) => {
    switch (design.id) {
      case 'design-pvc-signature':
        return {
          background: 'linear-gradient(145deg, #222120 0%, #151413 60%, #0d0d0c 100%)',
          border: '1px solid rgba(201, 162, 75, 0.4)',
          textColor: '#FAF8F5',
          accentColor: '#C9A24B',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#DFB864] via-[#FCECB5] to-[#C9A24B]',
        };
      case 'design-pvc-custom':
        return {
          background: 'linear-gradient(145deg, #2a2927 0%, #1a1918 60%, #11100f 100%)',
          border: '1px solid rgba(223, 184, 100, 0.5)',
          textColor: '#FAF8F5',
          accentColor: '#DFB864',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#FCECB5] via-[#DFB864] to-[#C9A24B]',
        };
      case 'design-obsidian':
        return {
          background: 'linear-gradient(135deg, #1f1e1d 0%, #11100f 50%, #0d0c0b 100%)',
          border: '1px solid rgba(201, 162, 75, 0.35)',
          textColor: '#FAF8F5',
          accentColor: '#C9A24B',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#DFB864] via-[#FCECB5] to-[#C9A24B]',
        };
      case 'design-titanium':
        return {
          background: 'linear-gradient(135deg, #38393c 0%, #242528 50%, #1e1f21 100%)',
          border: '1px solid rgba(220, 225, 230, 0.35)',
          textColor: '#F1F4F8',
          accentColor: '#CBD5E1',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#CBD5E1] via-[#FFFFFF] to-[#94A3B8]',
        };
      case 'design-champagne':
        return {
          background: 'linear-gradient(135deg, #3d3423 0%, #292215 50%, #1a160d 100%)',
          border: '1px solid rgba(230, 198, 118, 0.45)',
          textColor: '#FAF8F5',
          accentColor: '#E6C676',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#FCECB5] via-[#E6C676] to-[#C99C35]',
        };
      case 'design-24k':
        return {
          background: 'linear-gradient(135deg, #3f2f0e 0%, #271c08 50%, #191204 100%)',
          border: '1px solid rgba(255, 215, 0, 0.65)',
          textColor: '#FFF9E6',
          accentColor: '#FFD700',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4B8] via-[#FFD700] to-[#E6A800]',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #1f1e1d 0%, #11100f 50%, #0d0c0b 100%)',
          border: '1px solid rgba(201, 162, 75, 0.35)',
          textColor: '#FAF8F5',
          accentColor: '#C9A24B',
          foilStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#DFB864] via-[#FCECB5] to-[#C9A24B]',
        };
    }
  };

  const matStyle = getCardMaterialStyle(currentDesign);

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A24B]/10 text-[#C9A24B] border border-[#C9A24B]/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          The Bespoke Showroom
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#121110] tracking-tight mb-4">
          Physical Luxury NFC Stationery
        </h2>
        <p className="text-base text-[#736E66] font-normal leading-relaxed">
          Crafted from aerospace alloys, forged brass, sintered zirconia, and optical polymers. 
          Every card houses an encrypted NTAG424 cryptographic chip engineered for instant smartphone communication.
        </p>
      </div>

      {/* Main Studio Grid: Configurator & Physical Card Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left / Center: Interactive Physical Card Stage (Apple / Porsche style) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Card Controls (Flip front/back) */}
          <div className="flex items-center gap-2 mb-6 bg-[#EBE6DC] p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveSide('front')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSide === 'front'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              Front Face (Laser Inlay)
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSide === 'back'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              Reverse Face (NFC Target)
            </button>
          </div>

          {/* 3D Card Stage with cursor tilt */}
          <div
            className="w-full max-w-md perspective-[1000px] flex justify-center py-4"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardRef}
              className="relative w-80 sm:w-96 aspect-[1.586/1] rounded-2xl p-6 transition-transform duration-150 ease-out will-change-transform shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer"
              style={{
                background: matStyle.background,
                border: matStyle.border,
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                boxShadow:
                  '0 25px 50px -12px rgba(18, 17, 16, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Dynamic Metallic Sheen Highlight Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + tilt.rotateY * 2.5}% ${
                    50 + tilt.rotateX * -2.5
                  }%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`,
                }}
              />

              {activeSide === 'front' ? (
                /* Card Front */
                <>
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded border border-[#C9A24B]/50 flex items-center justify-center">
                        <span className="font-serif-display font-bold text-xs text-[#C9A24B]">TLP</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-widest font-mono text-[#736E66]">
                        TAPLINKPRO
                      </span>
                    </div>

                    {/* Laser Engraved Serial */}
                    <span className="text-[10px] font-mono opacity-60 tracking-wider">
                      SERIES 3.0 • V3
                    </span>
                  </div>

                  <div className="z-10 my-auto py-2">
                    <h3
                      className={`text-xl sm:text-2xl font-serif-display font-bold tracking-tight mb-1 ${matStyle.foilStyle}`}
                    >
                      {customName || 'Your Name Here'}
                    </h3>
                    <p className="text-xs tracking-wider uppercase font-medium opacity-80" style={{ color: matStyle.accentColor }}>
                      {customRole}
                    </p>
                    <p className="text-[11px] opacity-60 tracking-wide font-light">
                      {userCompany}
                    </p>
                  </div>

                  <div className="flex items-end justify-between z-10 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block opacity-50 font-mono">
                        Hardware Finish
                      </span>
                      <span className="text-[11px] font-medium opacity-90">
                        {currentDesign.finish}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* NFC Contactless Symbol */}
                      <div className="flex items-center gap-1 opacity-70">
                        <svg className="w-5 h-5 text-[#C9A24B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 6a7 7 0 0 1 0 12" />
                          <path d="M10 9a4 4 0 0 1 0 6" />
                          <path d="M4 3a11 11 0 0 1 0 18" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Card Back */
                <>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono opacity-60">
                      NTAG424 CRYPTOGRAPHIC DNA
                    </span>
                    <span className="text-[10px] font-mono text-[#C9A24B]">
                      TAMPER LOOP OK
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
                    {/* Concentric NFC Target Circles */}
                    <div className="w-16 h-16 rounded-full border border-dashed border-[#C9A24B]/40 flex items-center justify-center p-2">
                      <div className="w-10 h-10 rounded-full border border-[#C9A24B] flex items-center justify-center bg-[#C9A24B]/10">
                        <CreditCard className="w-5 h-5 text-[#C9A24B]" />
                      </div>
                    </div>
                    <span className="text-[11px] tracking-wider uppercase font-medium mt-2 text-[#C9A24B]">
                      Tap Top of Phone Here
                    </span>
                    <span className="text-[9px] font-mono opacity-60">
                      Zero Battery • Guaranteed 100,000+ Taps
                    </span>
                  </div>

                  <div className="flex items-center justify-between z-10 text-[9px] font-mono opacity-50 border-t border-white/10 pt-2">
                    <span>PATENT PENDING</span>
                    <span>ENGINEERED FOR TAPLINKPRO</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-[#736E66] mt-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#C9A24B]" />
            Move cursor over card to observe tactile light dispersion
          </p>
        </div>

        {/* Right: Bespoke Configurator Controls (Porsche/Apple style) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B]">
                {currentDesign.category}
              </span>
              <h3 className="text-2xl font-serif-display font-bold text-[#121110]">
                {currentDesign.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-serif-display font-bold text-[#121110] block">
                {currentDesign.price}
              </span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold inline-block mt-0.5 ${
                isComingSoon ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}>
                {isComingSoon ? 'Coming Soon (Tooling)' : 'Ready to Ship'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#736E66] leading-relaxed mb-6">
            {currentDesign.description}
          </p>

          {/* Physical Specifications Sheet */}
          <div className="bg-[#F5F1EB] rounded-2xl p-4 mb-6 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#736E66]">Material Base:</span>
              <span className="font-medium text-[#121110] text-right">{currentDesign.material}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#736E66]">Weight / Handfeel:</span>
              <span className="font-mono font-medium text-[#121110]">{currentDesign.weight}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#736E66]">Antenna Engineering:</span>
              <span className="font-medium text-[#121110]">Ultra-low impedance high-frequency coil</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#736E66]">NFC Chipset:</span>
              <span className="font-mono font-medium text-[#C9A24B]">NXP NTAG213/424 DNA</span>
            </div>
          </div>

          {/* Available PVC Finish Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block mb-2">
              Select Starting PVC Edition (In Stock)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LUXURY_CARD_DESIGNS.filter(d => d.availability === 'IN_STOCK').map((design) => {
                const isSelected = design.id === selectedDesignId;
                return (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesignId(design.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C9A24B] bg-[#C9A24B]/10 shadow-sm'
                        : 'border-[#E5DFD5] bg-[#FFFFFF] hover:border-[#C9A24B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#121110] truncate">
                        {design.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A24B]" />}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#736E66]">
                      <span className="truncate">{design.price}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Personalization Preview Input */}
          <div className="space-y-3 mb-6 pt-4 border-t border-[#E5DFD5]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#736E66] block">
              Card Face Custom Hotstamp / Engraving
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#736E66] mb-1 block">Full Name:</span>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#736E66] mb-1 block">Title / Subtitle:</span>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Role or Company"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>
          </div>

          {/* Order / Inquiry Button */}
          {isComingSoon ? (
            <button
              id="waitlist-metal-card-btn"
              onClick={() => {
                setWaitlistModalOpen(true);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-[#C9A24B] text-[#121110] font-semibold text-sm hover:bg-[#D8B45B] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <BellRing className="w-4 h-4" />
              <span>Join Metal Card VIP Waitlist</span>
            </button>
          ) : (
            <button
              id="order-bespoke-card-btn"
              onClick={() => {
                if (onSelectDesignForOrder) {
                  onSelectDesignForOrder(currentDesign);
                }
                setOrderModalOpen(true);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-[#181716] text-[#FAF8F5] font-semibold text-sm hover:bg-[#2B2927] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Order {currentDesign.name} ({currentDesign.price})</span>
              <ChevronRight className="w-4 h-4 text-[#C9A24B]" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NEXT GENERATION TEASER SECTION: Solid Metal & Precious Ingot NFC Cards     */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-b from-[#181716] to-[#121110] text-[#FAF8F5] p-8 sm:p-12 border border-[#C9A24B]/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Next Evolution • Coming Soon
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-display font-bold text-[#FAF8F5]">
              Solid Metal &amp; Precious Ingot Series
            </h3>
            <p className="text-xs sm:text-sm text-[#E5DFD5]/70 max-w-xl mt-2 leading-relaxed">
              Precision milled from aerospace titanium, obsidian anodized alloy, and 24K gold mirror inlays with resonant through-metal micro-antenna. Tooling in progress.
            </p>
          </div>

          <button
            onClick={() => {
              const firstMetal = LUXURY_CARD_DESIGNS.find(d => d.availability === 'WAITLIST') || LUXURY_CARD_DESIGNS[2];
              setSelectedDesignId(firstMetal.id);
              setWaitlistModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A24B] text-[#121110] text-xs font-bold hover:bg-[#D8B45B] transition-all shrink-0 shadow-lg"
          >
            <BellRing className="w-4 h-4" />
            Join VIP Metal Priority List
          </button>
        </div>

        {/* Metal Teaser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {LUXURY_CARD_DESIGNS.filter(d => d.availability === 'WAITLIST').map((metalCard) => (
            <div
              key={metalCard.id}
              onClick={() => {
                setSelectedDesignId(metalCard.id);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C9A24B]/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B]">
                    {metalCard.finish}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                    {metalCard.weight}
                  </span>
                </div>
                <h4 className="text-base font-serif-display font-bold text-[#FAF8F5] group-hover:text-[#C9A24B] transition-colors">
                  {metalCard.name}
                </h4>
                <p className="text-xs text-[#FAF8F5]/60 mt-1 line-clamp-2">
                  {metalCard.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#C9A24B]">
                  {metalCard.price}
                </span>
                <span className="text-[11px] text-[#FAF8F5]/70 group-hover:text-white inline-flex items-center gap-1 font-medium">
                  Preview 3D <ArrowRight className="w-3 h-3 text-[#C9A24B]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Modal for In-Stock PVC NFC Card */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl">
            {orderSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif-display font-bold">
                  Card Order Placed: #{placedOrderId}
                </h4>
                <p className="text-xs text-[#736E66] leading-relaxed">
                  Your configuration for <strong>{currentDesign.name}</strong> ({currentDesign.finish}) 
                  engraved for <strong>{customName}</strong> has been received by TapLinkPro operations.
                </p>
                <div className="p-3 bg-[#F5F1EB] rounded-xl text-left text-xs space-y-1">
                  <span className="font-semibold block text-[#121110]">Next Steps:</span>
                  <span className="text-[#736E66] block">1. Owner will confirm bank transfer / QR payment.</span>
                  <span className="text-[#736E66] block">2. PVC card printed and NFC chip programmed.</span>
                  <span className="text-[#736E66] block">3. Shipped to your address with tamper seal code.</span>
                </div>
                <button
                  onClick={() => {
                    setOrderSubmitted(false);
                    setOrderModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-xl font-serif-display font-bold mb-1">
                  Confirm PVC NFC Card Order
                </h4>
                <p className="text-xs text-[#736E66] mb-5">
                  Review your specifications before dispatching order to TapLinkPro operations.
                </p>

                <div className="bg-[#F5F1EB] rounded-xl p-4 text-xs space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Edition:</span>
                    <span className="font-semibold">{currentDesign.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Finish:</span>
                    <span>{currentDesign.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Engraved Name:</span>
                    <span className="font-mono text-[#C9A24B]">{customName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E66]">Sub-title:</span>
                    <span>{customRole}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5DFD5] pt-2">
                    <span className="text-[#736E66]">Total Price:</span>
                    <span className="font-bold font-mono text-[#C9A24B]">{currentDesign.price}</span>
                  </div>
                </div>

                {/* Shipping Delivery Address */}
                <div className="mb-5 text-xs">
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Courier Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter full shipping address with postal code"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#E5DFD5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOrderModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-[#E5DFD5] text-xs font-semibold text-[#736E66]"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-bespoke-order-btn"
                    onClick={() => {
                      const newOrderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
                      setPlacedOrderId(newOrderId);
                      if (onPlaceOrder) {
                        onPlaceOrder({
                          id: newOrderId,
                          customer: {
                            name: customName || userFullName,
                            email: userEmail,
                            phone: userPhone,
                            shippingAddress: shippingAddress || 'HQ Delivery Office',
                          },
                          selectedDesign: {
                            id: currentDesign.id,
                            name: currentDesign.name,
                            finish: currentDesign.finish,
                            price: currentDesign.price,
                          },
                          engraving: {
                            name: customName,
                            subtext: customRole,
                          },
                          quantity: 1,
                          price: currentDesign.price,
                          paymentStatus: 'PENDING',
                          productionStatus: 'REQUESTED',
                          shippingStatus: 'NOT_SHIPPED',
                          trackingNumber: null,
                          associatedCardSerialNumber: null,
                          createdDate: new Date().toISOString().split('T')[0],
                        });
                      }
                      setOrderSubmitted(true);
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
                  >
                    Place Order ({currentDesign.price})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIP Metal Waitlist Modal */}
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181716] text-[#FAF8F5] rounded-3xl border border-[#C9A24B]/40 p-6 sm:p-8 shadow-2xl">
            {waitlistSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif-display font-bold text-[#FAF8F5]">
                  VIP Priority Access Reserved
                </h4>
                <p className="text-xs text-[#E5DFD5]/70 leading-relaxed">
                  We have added <strong>{waitlistEmail}</strong> to the early allocation queue for <strong>{currentDesign.name}</strong>. You will receive private invite access and early-bird pricing prior to public release.
                </p>
                <button
                  onClick={() => {
                    setWaitlistSubmitted(false);
                    setWaitlistModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C9A24B] text-[#121110] text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#C9A24B]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">VIP Early Access</span>
                </div>
                <h4 className="text-xl font-serif-display font-bold mb-1 text-[#FAF8F5]">
                  {currentDesign.name}
                </h4>
                <p className="text-xs text-[#E5DFD5]/70 mb-5 leading-relaxed">
                  Join the limited allocation list for our forthcoming solid metal &amp; precious ingot series.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span className="text-[#E5DFD5]/60">Finish:</span>
                    <span className="text-[#FAF8F5] font-semibold">{currentDesign.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5DFD5]/60">Target Launch:</span>
                    <span className="text-[#C9A24B] font-mono">Q3 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5DFD5]/60">Estimated Price:</span>
                    <span className="text-[#FAF8F5] font-mono">{currentDesign.price}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="text-[11px] font-mono text-[#E5DFD5]/70 block">
                    Your Email for Early Allocation Invite:
                  </label>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#252422] border border-[#C9A24B]/30 text-[#FAF8F5] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWaitlistModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-[#E5DFD5]/70 hover:bg-white/5"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setWaitlistSubmitted(true)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#C9A24B] text-[#121110] text-xs font-bold hover:bg-[#D8B45B]"
                  >
                    Join VIP Waitlist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
