'use client';

import { Sparkles, ArrowUp, Heart, Flame } from 'lucide-react';
import { soundManager } from '@/lib/audio';

export default function Footer() {
  const scrollToTop = () => {
    soundManager.playSfx('whoosh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020202] text-white pt-20 pb-16 px-6 md:px-12 border-t border-white/5 overflow-hidden">
      {/* Subtle Yellow Ambient Aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[radial-gradient(circle,rgba(253,185,19,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12 relative z-10">
        
        {/* Creator Master Badge: GOWTHAMAN N WITH YELLOVE */}
        <div className="w-full max-w-2xl mx-auto rounded-3xl border border-csk-yellow/35 bg-gradient-to-b from-[#141005] via-[#0c0c0c] to-[#070707] p-8 md:p-10 shadow-[0_0_50px_rgba(253,185,19,0.18)] relative overflow-hidden group hover:border-csk-yellow/70 transition-all duration-500 text-center">
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-csk-yellow to-transparent" />
          
          <div className="flex items-center justify-center space-x-2 text-csk-yellow font-mono text-xs uppercase tracking-[0.35em] mb-3">
            <Heart className="w-3.5 h-3.5 fill-csk-yellow text-csk-yellow animate-pulse" />
            <span>CINEMATIC ARCHIVE &amp; TRIBUTE</span>
            <Heart className="w-3.5 h-3.5 fill-csk-yellow text-csk-yellow animate-pulse" />
          </div>

          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
            CREATED BY{' '}
            <span className="csk-text-gradient drop-shadow-[0_0_20px_rgba(253,185,19,0.6)]">
              GOWTHAMAN N
            </span>
          </h3>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 font-mono text-xs sm:text-sm tracking-[0.25em] text-white/80">
            <span>WITH</span>
            <span className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full border border-csk-yellow/60 bg-csk-yellow/20 text-csk-yellow font-black tracking-[0.2em] shadow-[0_0_20px_rgba(253,185,19,0.35)] animate-pulse">
              <span>YELLOVE</span>
              <span className="text-base">💛</span>
              <Flame className="w-3.5 h-3.5 text-csk-yellow inline" />
            </span>
            <span>•</span>
            <span className="text-white/50 text-xs">CHENNAI SUPER KINGS PRIDE</span>
          </div>
        </div>

        {/* Bottom Bar: Brand, Historical Archives note, Back to Top */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-display text-2xl font-black tracking-widest gold-text-gradient">
                MAHI
              </span>
              <span className="text-gold font-mono text-xs font-bold px-1.5 py-0.5 rounded border border-gold/30 bg-gold/10">
                #07
              </span>
            </div>
            <p className="font-editorial italic text-xs text-white/50 tracking-wide text-center md:text-left">
              A tribute to Mahendra Singh Dhoni — Captain, Leader, Legend.
            </p>
          </div>

          {/* Center Credits */}
          <div className="text-center font-mono text-[10px] md:text-[11px] text-white/35 tracking-wider max-w-md">
            <p>CRAFTED WITH CINEMATIC DIRECTION &amp; INTERACTIVE EXCELLENCE</p>
            <p className="text-white/20 mt-1">ALL FOOTAGE &amp; HISTORICAL BROADCASTS BELONG TO RESPECTIVE ACCREDITED HOLDERS</p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-full border border-gold/30 bg-gold/10 text-xs font-display tracking-widest uppercase text-gold hover:bg-gold hover:text-black transition-all shadow-[0_0_15px_rgba(212,175,102,0.2)]"
            data-cursor-hover
            data-cursor-text="TOP"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
