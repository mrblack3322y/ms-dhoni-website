'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Film, Zap, ArrowDown, Flame, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { SplitTextReveal } from '@/components/CinematicTransition';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoMode, setVideoMode] = useState<'arrival' | 'mashup'>('arrival');
  const [isFlashing, setIsFlashing] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.95;
      videoRef.current.play().catch(() => {});
    }
  }, [videoMode]);

  const toggleHeroVideo = () => {
    soundManager.playSfx(videoMode === 'arrival' ? 'bat_impact' : 'whoosh');
    setIsFlashing(true);
    setTimeout(() => {
      setVideoMode(prev => prev === 'arrival' ? 'mashup' : 'arrival');
    }, 120);
    setTimeout(() => {
      setIsFlashing(false);
    }, 450);
  };

  const currentVideoSrc = videoMode === 'arrival'
    ? '/assets/videos/hero_arrival.mp4'
    : '/assets/videos/mashup_helicopter.mp4';

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center select-none"
    >
      {/* Background Visuals - Optimized for Landscape & Portrait with Live Reel Switching */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          poster="/assets/images/dhoni_long_hair_landscape.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_top] md:object-[65%_25%] filter brightness-[0.72] contrast-[1.18]"
        />

        {/* Mobile Portrait Fallback Image Layer (visible on portrait screens) */}
        <div className="absolute inset-0 md:hidden w-full h-full opacity-40">
          <Image
            src="/assets/images/dhoni_long_hair_portrait.jpg"
            alt="MS Dhoni Long Hair Portrait"
            fill
            className="object-cover object-[center_top]"
            priority
          />
        </div>

        {/* Cinematic Film Burn Flash Wipe on Reel Toggle */}
        <AnimatePresence>
          {isFlashing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0.3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-r from-[#FFF5DC] via-[#D4AF66] to-[#FDB913] mix-blend-screen z-10"
            />
          )}
        </AnimatePresence>

        {/* Cinematic Multi-layered Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 md:via-transparent to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_95%)]" />
      </motion.div>

      {/* Floating Interactive Video Reel Angle Switcher in Top-Right */}
      <div className="absolute top-24 right-6 md:right-12 z-20">
        <button
          onClick={toggleHeroVideo}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-black/60 backdrop-blur-md text-gold hover:bg-gold/15 transition-all text-[10px] md:text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,102,0.25)]"
          data-cursor-hover
          data-cursor-text="SWITCH"
        >
          {videoMode === 'arrival' ? <Zap className="w-3.5 h-3.5 fill-current animate-pulse" /> : <Film className="w-3.5 h-3.5 text-gold" />}
          <span>{videoMode === 'arrival' ? 'SWITCH TO MASHUP CUT' : 'SWITCH TO THE ARRIVAL'}</span>
        </button>
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start justify-center h-full pt-20 md:pt-16"
      >
        {/* Subtle Pre-heading Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-4"
        >
          <span className="w-8 h-[1px] bg-gold" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-gold/90 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-gold inline" />
            AN INTERACTIVE CINEMATIC EXPERIENCE
          </span>
          <span className="px-2.5 py-0.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-[9px] font-mono tracking-widest uppercase">
            2005 LONG HAIR ERA
          </span>
          <span className="px-3 py-1 rounded-full border border-csk-yellow/60 bg-csk-yellow/20 text-csk-yellow text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_20px_rgba(253,185,19,0.35)] animate-pulse">
            <Flame className="w-3 h-3 text-csk-yellow" />
            IPL RETIREMENT • TODAY
          </span>
        </motion.div>

        {/* Massive Headline */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-black uppercase tracking-tight leading-[0.88] text-white"
          >
            MAHENDRA<br />
            <span className="text-white/85">SINGH</span><br />
            <span className="gold-text-gradient">DHONI.</span>
          </motion.h1>
        </div>

        {/* IPL Retirement Breaking Tribute Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="my-3 p-3.5 sm:p-4 rounded-2xl border border-csk-yellow/40 bg-gradient-to-r from-csk-yellow/15 via-black/80 to-transparent backdrop-blur-md max-w-xl flex items-center space-x-3.5 shadow-[0_0_30px_rgba(253,185,19,0.15)]"
        >
          <div className="w-10 h-10 rounded-full border border-csk-yellow/60 bg-csk-yellow/20 flex items-center justify-center shrink-0 animate-pulse">
            <span className="font-display font-black text-sm text-csk-yellow">7</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-csk-yellow animate-ping" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-csk-yellow font-bold">
                BREAKING • RETIRED FROM IPL TODAY
              </span>
            </div>
            <p className="font-editorial italic text-xs sm:text-sm text-white/90 tracking-wide mt-0.5">
              &ldquo;No. 7 hangs up the yellow jersey.&rdquo; 5 IPL Trophies, 264 matches, 16 years of Chepauk magic. Thank You, Thala.
            </p>
          </div>
        </motion.div>

        {/* Animated Gold Separator Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-[2px] bg-gradient-to-r from-gold via-csk-yellow to-transparent w-48 md:w-80 my-4 origin-left"
        />

        {/* Sub-headline: The Man. The Captain. The Legend. */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="flex flex-col space-y-1.5 max-w-xl"
        >
          <h2 className="font-display text-lg md:text-2xl tracking-[0.3em] uppercase text-white font-semibold">
            THE MAN. THE CAPTAIN. THE LEGEND.
          </h2>
          <p className="font-editorial italic text-sm md:text-base text-white/70 tracking-wider">
            RANCHI, INDIA — FROM THE FEARLESS LONG-HAIRED SENSATION TO ETERNAL IMMORTALITY.
          </p>
        </motion.div>

        {/* Quick action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#journey"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playSfx('whoosh');
              if (typeof window !== 'undefined' && (window as any).__lenis) {
                (window as any).__lenis.scrollTo('#journey');
              } else {
                document.querySelector('#journey')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 rounded-full bg-gold text-[#050505] font-display text-xs tracking-[0.25em] font-bold uppercase hover:bg-gold-light transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,102,0.35)]"
            data-cursor-hover
            data-cursor-text="JOURNEY"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            EXPLORE THE JOURNEY
          </a>

          <a
            href="#mashups"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playSfx('whoosh');
              if (typeof window !== 'undefined' && (window as any).__lenis) {
                (window as any).__lenis.scrollTo('#mashups');
              } else {
                document.querySelector('#mashups')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 rounded-full border border-gold/40 bg-gold/10 text-gold font-display text-xs tracking-[0.25em] font-bold uppercase hover:bg-gold/25 transition-all flex items-center gap-2"
            data-cursor-hover
            data-cursor-text="MASHUP"
          >
            <Film className="w-3.5 h-3.5" />
            CINEMATIC MASHUPS
          </a>

          <a
            href="#yellow-legacy"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playSfx('chepauk_whistle');
              if (typeof window !== 'undefined' && (window as any).__lenis) {
                (window as any).__lenis.scrollTo('#yellow-legacy');
              } else {
                document.querySelector('#yellow-legacy')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 rounded-full border border-csk-yellow/40 bg-csk-yellow/10 text-csk-yellow font-display text-xs tracking-[0.25em] font-bold uppercase hover:border-csk-yellow hover:bg-csk-yellow/20 transition-all flex items-center gap-2"
            data-cursor-hover
            data-cursor-text="THALA"
          >
            CSK YELLOW LEGACY
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <span className="font-display text-[10px] tracking-[0.35em] uppercase text-white/50 mb-2">
          SCROLL TO EXPERIENCE THE LEGACY
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}