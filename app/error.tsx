'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client error
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5DFD5] p-8 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif-display font-bold text-[#121110]">Something went wrong</h2>
        <p className="text-xs text-[#736E66] leading-relaxed">
          An unexpected error occurred while rendering the page.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5DFD5] text-[#121110] text-xs font-semibold hover:bg-[#F5F1EB] transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
