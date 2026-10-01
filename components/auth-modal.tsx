'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserRole, UserProfile } from '@/types/taplink';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (role: UserRole, customUser?: { name: string; email: string; company?: string }) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<'customer' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (!email.trim() || !password.trim()) {
        setError('Please provide your email address and password.');
        return;
      }

      if (mode === 'register' && !fullName.trim()) {
        setError('Please enter your full legal or professional name.');
        return;
      }

      // Check owner credentials
      if (email.toLowerCase().includes('owner') || email.toLowerCase().includes('admin') || selectedRoleType === 'admin') {
        onSuccess('owner', {
          name: fullName || 'TapLinkPro Owner',
          email,
          company: company || 'TapLinkPro HQ',
        });
        onClose();
        return;
      }

      // If registering new account
      if (mode === 'register') {
        onSuccess('registered_user', {
          name: fullName,
          email,
          company: company || 'Independent Executive',
        });
        onClose();
        return;
      }

      // Default to paid customer (e.g. Haziq Aiman or customer with card)
      onSuccess('paid_customer', {
        name: fullName || 'Haziq Aiman',
        email,
        company: company || 'TapLinkPro',
      });
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-3xl border border-[#E5DFD5] shadow-2xl overflow-hidden relative">
        {/* Top Metallic Trim */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#181716] via-[#C9A24B] to-[#181716]" />

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-[#736E66] hover:text-[#121110] hover:bg-[#EBE6DC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#181716] flex items-center justify-center text-[#C9A24B] font-serif-display font-bold text-xs">
              TLP
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A24B] font-semibold">
              Security Authentication
            </span>
          </div>

          <h3 className="text-2xl font-serif-display font-bold text-[#121110]">
            {mode === 'login' ? 'Sign In to TapLinkPro' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-[#736E66] mt-1">
            {mode === 'login'
              ? 'Access your customer workstation, NFC hardware controls, and digital identity.'
              : 'Register your executive profile and configure your digital card before arrival.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#EBE6DC] rounded-xl text-xs font-semibold mt-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#121110] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#121110] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                  Full Legal / Professional Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#736E66] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Haziq Aiman"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#736E66] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Group Holdings"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#736E66] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#736E66] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#736E66]">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-[#C9A24B] cursor-pointer hover:underline">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#736E66] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Workstation' : 'Complete Registration'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
