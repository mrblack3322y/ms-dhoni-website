'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Music, Bell, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioModal({ isOpen, onClose }: AudioModalProps) {
  const [soundState, setSoundState] = useState(soundManager.getSoundState());

  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setSoundState(soundManager.getSoundState());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-md w-full bg-[#0d0d0d] border border-gold/30 rounded-3xl p-8 shadow-2xl space-y-6 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2 text-gold">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-display text-lg font-bold tracking-widest uppercase">
                SOUND DESIGN SUITE
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Sound Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="font-display text-sm font-bold tracking-wider uppercase">
                MASTER AUDIO
              </p>
              <p className="text-xs text-white/50">
                {soundState.enabled ? 'Cinematic audio active' : 'Audio muted'}
              </p>
            </div>
            <button
              onClick={() => soundManager.toggleMasterSound()}
              className={`px-4 py-1.5 rounded-full font-display text-xs tracking-widest uppercase font-bold transition-all ${
                soundState.enabled
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {soundState.enabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white/80">
                <Music className="w-3.5 h-3.5 text-gold" />
                CINEMATIC SCORE VOLUME
              </span>
              <span className="text-gold font-bold">
                {Math.round(soundState.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundState.musicVolume}
              onChange={(e) => soundManager.setMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-[#D4AF66] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white/80">
                <Bell className="w-3.5 h-3.5 text-gold" />
                SOUND EFFECTS VOLUME
              </span>
              <span className="text-gold font-bold">
                {Math.round(soundState.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundState.sfxVolume}
              onChange={(e) => soundManager.setSfxVolume(parseFloat(e.target.value))}
              className="w-full accent-[#D4AF66] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick SFX Test Buttons */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
              SAMPLE ACOUSTICS
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-display uppercase tracking-widest">
              <button
                onClick={() => soundManager.playSfx('bat_impact')}
                className="p-2 rounded-lg border border-white/10 hover:border-gold/50 bg-white/5 text-white/80"
              >
                CRICKET BAT CRACK
              </button>
              <button
                onClick={() => soundManager.playSfx('chepauk_whistle')}
                className="p-2 rounded-lg border border-csk-yellow/30 hover:border-csk-yellow bg-csk-yellow/5 text-csk-yellow"
              >
                CHEPAUK WHISTLE
              </button>
              <button
                onClick={() => soundManager.playSfx('trophy_reveal')}
                className="p-2 rounded-lg border border-white/10 hover:border-gold/50 bg-white/5 text-white/80"
              >
                GOLD SHIMMER
              </button>
              <button
                onClick={() => soundManager.playSfx('bass_braam')}
                className="p-2 rounded-lg border border-white/10 hover:border-gold/50 bg-white/5 text-white/80"
              >
                DEEP BRAAM
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
