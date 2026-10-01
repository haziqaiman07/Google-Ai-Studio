'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, ZoomIn, ZoomOut, RotateCw, RefreshCcw, Check, Upload, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Focus } from 'lucide-react';
import { AvatarCropData } from '@/types/taplink';

interface ProfilePhotoEditorProps {
  currentUrl: string;
  cropData: AvatarCropData;
  onSave: (url: string, crop: AvatarCropData) => void;
  onClose: () => void;
}

export function ProfilePhotoEditor({
  currentUrl,
  cropData,
  onSave,
  onClose,
}: ProfilePhotoEditorProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentUrl);
  const [crop, setCrop] = useState<AvatarCropData>({ ...cropData });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample professional portraits for quick testing
  const sampleAvatars = [
    { label: 'Executive 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
    { label: 'Executive 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
    { label: 'Director', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
    { label: 'Creative', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setCrop((prev) => ({
      ...prev,
      x: Math.max(-130, Math.min(130, newX)),
      y: Math.max(-130, Math.min(130, newY)),
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - crop.x,
        y: e.touches[0].clientY - crop.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setCrop((prev) => ({
      ...prev,
      x: Math.max(-130, Math.min(130, newX)),
      y: Math.max(-130, Math.min(130, newY)),
    }));
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setCrop({ x: 0, y: 0, zoom: 1, rotate: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0, zoom: 1, rotate: 0 });
  };

  const handleRotate = () => {
    setCrop((prev) => ({
      ...prev,
      rotate: (prev.rotate + 90) % 360,
    }));
  };

  const handleNudge = (dx: number, dy: number) => {
    setCrop((prev) => ({
      ...prev,
      x: Math.max(-130, Math.min(130, prev.x + dx)),
      y: Math.max(-130, Math.min(130, prev.y + dy)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121110]/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div 
        id="profile-photo-modal" 
        className="w-full max-w-md rounded-3xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5DFD5] bg-[#F5F1EB]">
          <div>
            <h3 className="text-base sm:text-lg font-serif-display font-semibold text-[#121110]">
              Profile Photo Alignment
            </h3>
            <p className="text-[11px] text-[#736E66]">
              Drag with finger or use nudges to position face in NFC circle
            </p>
          </div>
          <button
            id="close-photo-editor-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#736E66] hover:text-[#121110] hover:bg-[#E5DFD5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Canvas */}
        <div className="relative flex flex-col items-center justify-center p-5 bg-[#181716] select-none">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-[#C9A24B] shadow-2xl cursor-grab active:cursor-grabbing bg-[#252422] touch-none"
          >
            {/* Movable and scalable image */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate(${(crop.x / 256) * 100}%, ${(crop.y / 256) * 100}%) scale(${crop.zoom}) rotate(${crop.rotate}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Profile Crop"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Crosshair / framing circle */}
            <div className="absolute inset-0 pointer-events-none rounded-full border border-white/20">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-white/10" />
            </div>
          </div>

          {/* Quick Directional Nudges for Phone Precision */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleNudge(-10, 0)}
              title="Nudge Left"
              className="p-1.5 rounded-lg bg-white/10 text-[#FAF8F5] hover:bg-white/20 active:scale-95 text-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleNudge(0, -10)}
              title="Nudge Up"
              className="p-1.5 rounded-lg bg-white/10 text-[#FAF8F5] hover:bg-white/20 active:scale-95 text-xs transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Center Face"
              className="px-2.5 py-1.5 rounded-lg bg-[#C9A24B]/20 border border-[#C9A24B]/40 text-[#C9A24B] hover:bg-[#C9A24B]/30 text-[11px] font-semibold flex items-center gap-1"
            >
              <Focus className="w-3 h-3" />
              Center
            </button>
            <button
              type="button"
              onClick={() => handleNudge(0, 10)}
              title="Nudge Down"
              className="p-1.5 rounded-lg bg-white/10 text-[#FAF8F5] hover:bg-white/20 active:scale-95 text-xs transition-all"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleNudge(10, 0)}
              title="Nudge Right"
              className="p-1.5 rounded-lg bg-white/10 text-[#FAF8F5] hover:bg-white/20 active:scale-95 text-xs transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#FAF8F5]">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-[#736E66]">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#121110]" />
                Scale &amp; Zoom
              </span>
              <span className="font-mono text-[#121110]">
                {(crop.zoom * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-[#736E66]" />
              <input
                id="photo-zoom-slider"
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={crop.zoom}
                onChange={(e) =>
                  setCrop((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))
                }
                className="w-full h-1.5 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
              />
              <ZoomIn className="w-4 h-4 text-[#736E66]" />
            </div>
          </div>

          {/* Quick Actions (Rotate, Reset, Upload) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E5DFD5]/60">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="photo-rotate-btn"
                onClick={handleRotate}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-[#F0ECE1] text-[#121110] hover:bg-[#E5DFD5] transition-colors"
              >
                <RotateCw className="w-3 h-3 text-[#C9A24B]" />
                Rotate 90°
              </button>
              <button
                type="button"
                id="photo-reset-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-[#F0ECE1] text-[#736E66] hover:bg-[#E5DFD5] hover:text-[#121110] transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-file-upload-input"
              />
              <button
                type="button"
                id="trigger-file-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#C9A24B]/40 text-[#121110] bg-[#C9A24B]/10 hover:bg-[#C9A24B]/20 transition-colors"
              >
                <Upload className="w-3 h-3 text-[#C9A24B]" />
                Upload File
              </button>
            </div>
          </div>

          {/* Preset Samples */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#736E66] font-medium mb-1.5">
              Or pick sample portrait
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {sampleAvatars.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(sample.url);
                    setCrop({ x: 0, y: 0, zoom: 1, rotate: 0 });
                  }}
                  className={`text-xs text-left p-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    imageUrl === sample.url
                      ? 'border-[#C9A24B] bg-[#C9A24B]/10 font-semibold'
                      : 'border-[#E5DFD5] hover:border-[#C9A24B]/50'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.url}
                    alt={sample.label}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <span className="truncate text-[10px] text-[#121110]">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5DFD5]">
            <button
              type="button"
              id="cancel-photo-editor-btn"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-[#736E66] hover:bg-[#E5DFD5]/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="save-photo-editor-btn"
              onClick={() => {
                onSave(imageUrl, crop);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#181716] text-[#FAF8F5] hover:bg-[#2B2927] transition-all shadow-md"
            >
              <Check className="w-3.5 h-3.5 text-[#C9A24B]" />
              Apply Position &amp; Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

