'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Smartphone,
  Layers,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Check,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Lock,
  KeyRound,
  ArrowRight,
  User,
  Sliders,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import {
  UserRole,
  UserProfile,
  PhysicalCard,
  Order,
  Customer,
  NfcCard,
  CardDesign,
} from '@/types/taplink';
import {
  INITIAL_DEMO_PROFILE,
  INITIAL_PHYSICAL_CARD,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_NFC_CARDS,
  LUXURY_CARD_DESIGNS,
} from '@/lib/initial-data';
import { HeroHome } from '@/components/hero-home';
import { CardShowroom } from '@/components/card-showroom';
import { PublicProfileView } from '@/components/public-profile-view';
import { ProfileCustomizer } from '@/components/profile-customizer';
import { CardManagement } from '@/components/card-management';
import { DashboardView } from '@/components/dashboard-view';
import { OwnerDashboard } from '@/components/owner-dashboard';
import { AuthModal } from '@/components/auth-modal';

export default function HomePage() {
  // Current user state (Default to Paid Customer with Haziq Aiman demo data per prompt)
  const [userRole, setUserRole] = useState<UserRole>('paid_customer');

  // Hydration-safe state initialization (prevents SSR vs Client mismatch)
  const [profile, setProfile] = useState<UserProfile>(INITIAL_DEMO_PROFILE);
  const [card, setCard] = useState<PhysicalCard | null>(INITIAL_PHYSICAL_CARD);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [cards, setCards] = useState<NfcCard[]>(INITIAL_NFC_CARDS);
  const [designs, setDesigns] = useState<CardDesign[]>(LUXURY_CARD_DESIGNS);

  // Active View navigation
  const [activeView, setActiveView] = useState<
    'home' | 'showroom' | 'public' | 'dashboard' | 'customizer' | 'card_management' | 'owner_dashboard'
  >('dashboard');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Safely hydrate from localStorage on client mount only
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedProfile = localStorage.getItem('taplinkpro_v5_profile') || localStorage.getItem('taplinkpro_v4_profile');
        if (storedProfile) setProfile(JSON.parse(storedProfile));

        const storedCard = localStorage.getItem('taplinkpro_v5_card') || localStorage.getItem('taplinkpro_v4_card');
        if (storedCard) setCard(JSON.parse(storedCard));

        const storedOrders = localStorage.getItem('taplinkpro_v5_orders') || localStorage.getItem('taplinkpro_v4_orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedCustomers = localStorage.getItem('taplinkpro_v5_customers') || localStorage.getItem('taplinkpro_v4_customers');
        if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

        const storedCards = localStorage.getItem('taplinkpro_v5_inventory') || localStorage.getItem('taplinkpro_v4_inventory');
        if (storedCards) setCards(JSON.parse(storedCards));

        const storedDesigns = localStorage.getItem('taplinkpro_v5_designs') || localStorage.getItem('taplinkpro_v4_designs');
        if (storedDesigns) setDesigns(JSON.parse(storedDesigns));
      } catch {
        // LocalStorage access fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('taplinkpro_v5_profile', JSON.stringify(updated));
    } catch {}
  };

  const handleActivateCard = (activated: PhysicalCard) => {
    setCard(activated);
    try {
      localStorage.setItem('taplinkpro_v5_card', JSON.stringify(activated));
    } catch {}

    // Update inventory card to ACTIVE status
    setCards((prev) =>
      prev.map((c) =>
        c.serialNumber === activated.serialNumber
          ? {
              ...c,
              status: 'ACTIVE',
              customer: profile.fullName,
              customerEmail: profile.contacts.email || null,
              activatedDate: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    // Update current customer to PAID_CUSTOMER
    setCustomers((prev) =>
      prev.map((cust) =>
        cust.email.toLowerCase() === (profile.contacts.email || '').toLowerCase()
          ? {
              ...cust,
              accountType: 'PAID_CUSTOMER',
              cardStatus: 'ACTIVE',
              activeCardSerial: activated.serialNumber,
            }
          : cust
      )
    );

    // Upgrading to paid customer on activation
    if (userRole === 'registered_user' || userRole === 'public_visitor') {
      setUserRole('paid_customer');
    }
  };

  const handleToggleHardwareLock = () => {
    if (!card) return;
    const updatedCard: PhysicalCard = {
      ...card,
      isHardwareLocked: !card.isHardwareLocked,
      status: card.isHardwareLocked ? 'ACTIVE' : 'LOCKED',
    };
    setCard(updatedCard);
    try {
      localStorage.setItem('taplinkpro_v5_card', JSON.stringify(updatedCard));
    } catch {}
  };

  // Simplified MVP Role Switcher handler
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'public_visitor') {
      setActiveView('home');
    } else if (role === 'registered_user') {
      setActiveView('customizer');
    } else if (role === 'paid_customer') {
      setActiveView('dashboard');
    } else if (role === 'owner') {
      setActiveView('owner_dashboard');
    }
    setMobileMenuOpen(false);
  };

  const handleAuthSuccess = (
    role: UserRole,
    customUser?: { name: string; email: string; company?: string }
  ) => {
    setUserRole(role);
    if (customUser && customUser.name) {
      const updatedProfile: UserProfile = {
        ...profile,
        fullName: customUser.name,
        company: customUser.company || profile.company,
        contacts: {
          ...profile.contacts,
          email: customUser.email || profile.contacts.email,
        },
      };
      setProfile(updatedProfile);
      try {
        localStorage.setItem('taplinkpro_v4_profile', JSON.stringify(updatedProfile));
      } catch {}

      // Add to customers directory if not already there
      setCustomers((prev) => {
        const exists = prev.find((c) => c.email.toLowerCase() === customUser.email.toLowerCase());
        if (exists) return prev;
        const newCust: Customer = {
          id: `cust_${Date.now()}`,
          name: customUser.name,
          email: customUser.email,
          accountType: role === 'paid_customer' ? 'PAID_CUSTOMER' : 'REGISTERED_USER',
          cardStatus: role === 'paid_customer' ? 'ACTIVE' : 'NO_CARD',
          orderStatus: 'NONE',
          createdDate: new Date().toISOString().split('T')[0],
          slug: customUser.name.toLowerCase().replace(/\s+/g, '-'),
          company: customUser.company,
        };
        const nextList = [newCust, ...prev];
        try {
          localStorage.setItem('taplinkpro_v5_customers', JSON.stringify(nextList));
        } catch {}
        return nextList;
      });
    }

    if (role === 'owner') {
      setActiveView('owner_dashboard');
    } else if (role === 'registered_user') {
      setActiveView('customizer');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole('public_visitor');
    setActiveView('home');
    setMobileMenuOpen(false);
  };

  // Order Placement from Customer Showroom
  const handlePlaceOrder = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem('taplinkpro_v5_orders', JSON.stringify(updatedOrders));
    } catch {}

    // Update customer's orderStatus in customer database
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.email.toLowerCase() === newOrder.customer.email.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, orderStatus: 'PENDING_PAYMENT' }
            : c
        );
      }
      // Or add customer if new
      const newCust: Customer = {
        id: `cust_${Date.now()}`,
        name: newOrder.customer.name,
        email: newOrder.customer.email,
        phone: newOrder.customer.phone,
        accountType: 'REGISTERED_USER',
        cardStatus: 'NO_CARD',
        orderStatus: 'PENDING_PAYMENT',
        createdDate: new Date().toISOString().split('T')[0],
        slug: newOrder.customer.name.toLowerCase().replace(/\s+/g, '-'),
      };
      return [newCust, ...prev];
    });
  };

  // Owner updates order (Payment, Production, Serial, Shipping)
  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
      try {
        localStorage.setItem('taplinkpro_v5_orders', JSON.stringify(next));
      } catch {}
      return next;
    });

    // If order was marked delivered or paid, sync customer status
    if (updates.shippingStatus === 'DELIVERED') {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.email.toLowerCase() === targetOrder.customer.email.toLowerCase()
              ? { ...c, orderStatus: 'DELIVERED', cardStatus: 'AVAILABLE' }
              : c
          )
        );
      }
    }
  };

  // Owner adds physical card to vault
  const handleAddCard = (newCard: NfcCard) => {
    setCards((prev) => {
      const next = [newCard, ...prev];
      try {
        localStorage.setItem('taplinkpro_v5_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Owner updates physical card in inventory
  const handleUpdateCard = (serialNumber: string, updates: Partial<NfcCard>) => {
    setCards((prev) => {
      const next = prev.map((c) => (c.serialNumber === serialNumber ? { ...c, ...updates } : c));
      try {
        localStorage.setItem('taplinkpro_v5_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Owner adds bespoke design to catalog
  const handleAddDesign = (newDesign: CardDesign) => {
    setDesigns((prev) => {
      const next = [newDesign, ...prev];
      try {
        localStorage.setItem('taplinkpro_v5_designs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Owner updates design in catalog
  const handleUpdateDesign = (designId: string, updates: Partial<CardDesign>) => {
    setDesigns((prev) => {
      const next = prev.map((d) => (d.id === designId ? { ...d, ...updates } : d));
      try {
        localStorage.setItem('taplinkpro_v5_designs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isAuthenticated = userRole !== 'public_visitor';
  const isWorkstationAllowed = userRole === 'paid_customer' || userRole === 'owner';
  const isOwner = userRole === 'owner';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#121110]">
      {/* Top Identity & Access Bar: Simplified MVP Roles */}
      <aside aria-label="Role Simulation" className="bg-[#181716] text-[#FAF8F5] border-b border-[#2B2927] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-pulse" />
            <span className="font-mono text-[#C9A24B] font-semibold">TapLinkPro V5</span>
            <span className="text-[#9C968B] hidden sm:inline">|</span>
            <span className="text-[#9C968B]">Active Persona:</span>
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] bg-white/10 px-2 py-0.5 rounded">
              {userRole.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#9C968B] hidden md:inline">Switch Role:</span>
            <button
              onClick={() => handleRoleChange('public_visitor')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                userRole === 'public_visitor'
                  ? 'bg-[#C9A24B] text-[#121110] font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Public Visitor
            </button>
            <button
              onClick={() => handleRoleChange('registered_user')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                userRole === 'registered_user'
                  ? 'bg-[#C9A24B] text-[#121110] font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Registered User
            </button>
            <button
              onClick={() => handleRoleChange('paid_customer')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                userRole === 'paid_customer'
                  ? 'bg-[#C9A24B] text-[#121110] font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Paid Customer
            </button>
            <button
              onClick={() => handleRoleChange('owner')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                userRole === 'owner'
                  ? 'bg-[#C9A24B] text-[#121110] font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Owner
            </button>
          </div>
        </div>
      </aside>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#181716] border border-[#C9A24B]/50 flex items-center justify-center text-[#C9A24B] shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif-display font-bold text-base">TLP</span>
            </div>
            <div>
              <span className="font-serif-display font-bold text-lg sm:text-xl text-[#121110] tracking-tight block leading-tight">
                TapLinkPro
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#736E66] block">
                Bespoke NFC Stationery
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {!isAuthenticated ? (
              /* Public Visitor Navigation */
              <>
                <button
                  id="nav-home-btn"
                  onClick={() => setActiveView('home')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'home'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Home
                </button>
                <button
                  id="nav-showroom-btn"
                  onClick={() => setActiveView('showroom')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'showroom'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Designs
                </button>
                <button
                  id="nav-live-tap-btn"
                  onClick={() => setActiveView('public')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'public'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Live NFC Tap
                </button>
                <div className="h-4 w-px bg-[#E5DFD5] mx-2" />
                <button
                  id="nav-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121110] hover:bg-[#EBE6DC] transition-all"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all shadow-sm"
                >
                  Create Account
                </button>
              </>
            ) : (
              /* Authenticated Navigation */
              <>
                {/* Owner Dashboard Highlight for Owner Role */}
                {isOwner && (
                  <button
                    id="nav-owner-dashboard-btn"
                    onClick={() => setActiveView('owner_dashboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeView === 'owner_dashboard'
                        ? 'bg-[#C9A24B] text-[#121110] shadow-sm font-bold'
                        : 'bg-[#181716] text-[#C9A24B] hover:bg-[#2B2927]'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Owner Dashboard</span>
                  </button>
                )}

                {/* Customer Workstation (Allowed to paid_customer & owner) */}
                {isWorkstationAllowed ? (
                  <button
                    id="nav-dashboard-btn"
                    onClick={() => setActiveView('dashboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'dashboard'
                        ? 'bg-[#181716] text-[#FAF8F5]'
                        : 'text-[#736E66] hover:text-[#121110]'
                    }`}
                  >
                    Workstation
                  </button>
                ) : (
                  <button
                    id="nav-dashboard-locked-btn"
                    onClick={() => setActiveView('dashboard')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#9C968B] hover:text-[#121110] flex items-center gap-1.5"
                    title="Customer Workstation requires an active physical NFC card"
                  >
                    <Lock className="w-3 h-3 text-[#C9A24B]" />
                    <span>Workstation</span>
                  </button>
                )}

                <button
                  id="nav-profile-btn"
                  onClick={() => setActiveView('customizer')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'customizer'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Profile Customizer
                </button>

                {isWorkstationAllowed && (
                  <button
                    id="nav-manage-card-btn"
                    onClick={() => setActiveView('card_management')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'card_management'
                        ? 'bg-[#181716] text-[#FAF8F5]'
                        : 'text-[#736E66] hover:text-[#121110]'
                    }`}
                  >
                    Manage Card
                  </button>
                )}

                <button
                  id="nav-showroom-auth-btn"
                  onClick={() => setActiveView('showroom')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'showroom'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Designs
                </button>

                <button
                  id="nav-public-preview-btn"
                  onClick={() => setActiveView('public')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === 'public'
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'text-[#736E66] hover:text-[#121110]'
                  }`}
                >
                  Live NFC Tap
                </button>

                <div className="h-4 w-px bg-[#E5DFD5] mx-2" />

                {/* Always Visible Logout */}
                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  title="Sign out of current account"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-[#E5DFD5] text-[#121110]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E5DFD5] bg-[#FAF8F5] p-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setActiveView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveView('showroom');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Designs
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Live NFC Tap
                </button>
                <div className="pt-2 border-t border-[#E5DFD5] flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="w-1/2 py-2 text-center text-xs font-semibold rounded-lg border border-[#E5DFD5]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="w-1/2 py-2 text-center text-xs font-semibold rounded-lg bg-[#181716] text-[#FAF8F5]"
                  >
                    Register
                  </button>
                </div>
              </>
            ) : (
              <>
                {isOwner && (
                  <button
                    onClick={() => {
                      setActiveView('owner_dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg bg-[#181716] text-[#C9A24B] flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Owner Dashboard</span>
                  </button>
                )}

                {isWorkstationAllowed ? (
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                  >
                    Workstation
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg text-[#9C968B] flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-[#C9A24B]" />
                    <span>Workstation (Card Required)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveView('customizer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Profile Customizer
                </button>

                {isWorkstationAllowed && (
                  <button
                    onClick={() => {
                      setActiveView('card_management');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                  >
                    Manage Card
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveView('showroom');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Designs
                </button>

                <button
                  onClick={() => {
                    setActiveView('public');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-[#EBE6DC]"
                >
                  Live NFC Tap
                </button>

                <div className="pt-2 border-t border-[#E5DFD5]">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-center text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HeroHome
            onNavigate={(v) => {
              if (v === 'showroom') setActiveView('showroom');
              else if (v === 'public') setActiveView('public');
              else if (v === 'dashboard') setActiveView('dashboard');
              else if (v === 'customizer') setActiveView('customizer');
              else if (v === 'architecture') setActiveView('owner_dashboard');
            }}
            onSelectRole={handleRoleChange}
            demoProfile={profile}
          />
        )}

        {activeView === 'showroom' && (
          <CardShowroom
            userFullName={profile.fullName}
            userEmail={profile.contacts.email}
            userPhone={profile.contacts.phone}
            userCompany={profile.company}
            designs={designs}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeView === 'public' && (
          <div className="py-6">
            <PublicProfileView
              profile={profile}
              isSimulatedTap={true}
              onEditProfile={() => setActiveView('customizer')}
              canEdit={userRole !== 'public_visitor'}
            />
          </div>
        )}

        {/* CUSTOMER WORKSTATION ACCESS CHECK */}
        {activeView === 'dashboard' && (
          isWorkstationAllowed ? (
            <DashboardView
              profile={profile}
              card={card}
              onNavigate={(v) => {
                if (v === 'profile') setActiveView('customizer');
                else if (v === 'card') setActiveView('card_management');
                else if (v === 'designs') setActiveView('showroom');
                else if (v === 'public') setActiveView('public');
              }}
              onOpenActivation={() => setActiveView('card_management')}
            />
          ) : (
            /* ACCESS GATE FOR PUBLIC VISITOR & REGISTERED USER */
            <div className="max-w-2xl mx-auto py-16 px-4 text-center">
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 sm:p-12 shadow-sm space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F1EB] border border-[#E5DFD5] flex items-center justify-center text-[#C9A24B] mx-auto">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B] font-semibold">
                    Access Restricted
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#121110] mt-1">
                    Customer Workstation Requires Physical NFC Hardware
                  </h2>
                  <p className="text-xs sm:text-sm text-[#736E66] max-w-md mx-auto mt-3 leading-relaxed">
                    The Customer Workstation and real-time hardware telemetry are exclusively available to accounts with an active physical NFC card.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex items-center gap-2 font-semibold text-[#121110]">
                    <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                    <span>How to access the Workstation:</span>
                  </div>
                  <ul className="space-y-1.5 text-[#736E66] list-disc list-inside">
                    <li>If you received your physical card, activate your card serial number.</li>
                    <li>If you already have a paid customer account, sign in with your credentials.</li>
                    <li>Registered users can configure their digital identity in the Profile Customizer.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('card_management')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-[#C9A24B]" />
                    <span>Activate Physical Card</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] text-xs font-semibold hover:border-[#C9A24B] transition-all"
                  >
                    Sign In to Paid Account
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {activeView === 'customizer' && (
          <ProfileCustomizer
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            userRole={userRole}
          />
        )}

        {activeView === 'card_management' && (
          <CardManagement
            card={card}
            profile={profile}
            onActivateCard={handleActivateCard}
            onToggleHardwareLock={handleToggleHardwareLock}
            userRole={userRole}
          />
        )}

        {/* OWNER DASHBOARD ACCESS */}
        {activeView === 'owner_dashboard' && (
          isOwner ? (
            <OwnerDashboard
              customers={customers}
              orders={orders}
              cards={cards}
              designs={designs}
              onUpdateOrder={handleUpdateOrder}
              onAddCard={handleAddCard}
              onUpdateCard={handleUpdateCard}
              onAddDesign={handleAddDesign}
              onUpdateDesign={handleUpdateDesign}
              onViewCustomerProfile={(slug) => {
                setActiveView('public');
              }}
            />
          ) : (
            <div className="max-w-xl mx-auto py-16 px-4 text-center">
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 sm:p-10 shadow-sm space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif-display font-bold text-[#121110]">
                  Owner Privilege Required
                </h3>
                <p className="text-xs text-[#736E66] max-w-sm mx-auto leading-relaxed">
                  The Owner Dashboard is restricted to platform owners and production managers. You can switch to the Owner persona using the role switcher above.
                </p>
                <button
                  onClick={() => handleRoleChange('owner')}
                  className="px-6 py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
                >
                  Switch to Owner Persona
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#181716] text-[#FAF8F5] border-t border-[#2E2C2A] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9C968B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-[#C9A24B]/50 flex items-center justify-center font-serif-display font-bold text-[#C9A24B]">
              TLP
            </div>
            <div>
              <p className="font-serif-display font-semibold text-white">TapLinkPro V4</p>
              <p className="text-[11px] text-[#736E66]">Small Business NFC MVP Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            <button onClick={() => setActiveView('showroom')} className="hover:text-white transition-colors">
              Physical Card Showroom
            </button>
            <button onClick={() => setActiveView('public')} className="hover:text-white transition-colors">
              Live NFC Tap
            </button>
            <button
              onClick={() => {
                if (isOwner) setActiveView('owner_dashboard');
                else handleRoleChange('owner');
              }}
              className="hover:text-white transition-colors text-[#C9A24B]"
            >
              Owner Dashboard
            </button>
            <button
              onClick={() => {
                if (isWorkstationAllowed) setActiveView('dashboard');
                else setActiveView('dashboard');
              }}
              className="hover:text-white transition-colors"
            >
              Customer Workstation
            </button>
          </div>

          <div className="text-right">
            <p className="font-mono text-[11px]">NXP NTAG424 Cryptographic Standard</p>
            <p className="text-[10px] text-[#736E66]">Zero App Required • Instant RFC 6350 Ingestion</p>
          </div>
        </div>
      </footer>

      {/* Account Login / Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

