'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, Film, Tv, Sparkles, Volume2, VolumeX, Maximize2, Zap, Flame, RotateCcw } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { SplitTextReveal } from '@/components/CinematicTransition';

interface Channel {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  badge: string;
  statBadge: string;
  soundCue: 'bat_impact' | 'whoosh' | 'chepauk_whistle' | 'trophy_reveal';
  accentColor: string;
  hasNativeAudio?: boolean;
}

const CHANNELS: Channel[] = [
  {
    id: 'godmode',
    number: 'FEATURED 01',
    title: "DHONI'S GOD MODE",
    subtitle: "THE ULTIMATE FAN MASHUP • BRUTAL POWER, UNTOUCHABLE SWAG & CLUTCH FINISHES",
    videoSrc: '/assets/videos/dhoni_god_mode.mp4',
    badge: '🔥 4K GOD MODE MASHUP',
    statBadge: '03:25 MASTER CUT • ORIGINAL HARD-HITTING SOUNDTRACK',
    soundCue: 'bat_impact',
    accentColor: '#FF4500',
    hasNativeAudio: true,
  },
  {
    id: 'helicopter',
    number: 'MATCH REEL 02',
    title: 'THE HELICOPTER FURY',
    subtitle: 'REAL MATCH CLIPS: DEATH-OVERS CRUNCH, TRADEMARK WRIST TWIRL & CROWD ERUPTION',
    videoSrc: '/assets/videos/mashup_helicopter.mp4',
    badge: '⚡ REAL MATCH FOOTAGE',
    statBadge: 'LIVE COMMENTARY • ICONIC HELICOPTER STROKES',
    soundCue: 'bat_impact',
    accentColor: '#D4AF66',
    hasNativeAudio: true,
  },
  {
    id: 'lightning',
    number: 'MATCH REEL 03',
    title: '0.08s LIGHTNING MATRIX',
    subtitle: 'REAL MATCH CLIPS: THE 0.08s STUMPINGS THAT DEFIED HUMAN REACTION LIMITS',
    videoSrc: '/assets/videos/mashup_lightning.mp4',
    badge: '⚡ 0.08s SUPERSONIC',
    statBadge: 'LIVE WICKET SOUND • DRS REVIEWS & BAILS FLYING',
    soundCue: 'trophy_reveal',
    accentColor: '#00E5FF',
    hasNativeAudio: true,
  },
  {
    id: 'thala',
    number: 'MATCH REEL 04',
    title: 'CHEPAUK ROAR // CSK',
    subtitle: 'REAL STADIUM CLIPS: THE DEAFENING CHEPAUK DECIBEL ERUPTION WHEN NO. 7 WALKS OUT',
    videoSrc: '/assets/videos/mashup_thala.mp4',
    badge: '🦁 WHISTLE PODU LIVE',
    statBadge: '128.4 dB STADIUM ROAR • SEA OF YELLOW',
    soundCue: 'chepauk_whistle',
    accentColor: '#FDB913',
    hasNativeAudio: true,
  },
  {
    id: 'moment2011',
    number: 'MATCH REEL 05',
    title: '2011 WINNING SIX',
    subtitle: 'REAL BROADCAST: "DHONI FINISHES OFF IN STYLE!" — RAVI SHASTRI ICONIC COMMENTARY',
    videoSrc: '/assets/videos/moment_2011.mp4',
    badge: '🏆 WANKHEDE FINAL LIVE',
    statBadge: 'ORIGINAL BROADCAST AUDIO • RAVI SHASTRI COMMENTARY',
    soundCue: 'whoosh',
    accentColor: '#FFD700',
    hasNativeAudio: true,
  },
];

export default function CinematicVideoMashup() {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default for God Mode if user interacts
  const [volume, setVolume] = useState(1.0);
  const [speed, setSpeed] = useState<0.5 | 1.0 | 1.5>(1.0);
  const [cinemascope, setCinemascope] = useState(false);
  const [crtEffect, setCrtEffect] = useState(false);
  const [filmBurnActive, setFilmBurnActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(205); // ~3:25 for God Mode

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeChannel = CHANNELS[activeChannelIdx];

  // Auto-manage video audio and duck background ambient music when video audio plays
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    videoRef.current.volume = isMuted ? 0 : volume;

    if (!isMuted && activeChannel.hasNativeAudio) {
      // Duck site background music so mashup audio takes center stage
      soundManager.pauseMusic();
    } else {
      soundManager.resumeMusic();
    }
  }, [speed, isMuted, volume, activeChannel]);

  // Channel switch with film burn transition and sound cue
  const switchChannel = (idx: number) => {
    if (idx === activeChannelIdx) return;

    soundManager.playSfx(CHANNELS[idx].soundCue);
    setFilmBurnActive(true);

    setTimeout(() => {
      setActiveChannelIdx(idx);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        // Default to unmuted with audio for God Mode
        if (CHANNELS[idx].hasNativeAudio) {
          setIsMuted(false);
          videoRef.current.muted = false;
        } else {
          setIsMuted(true);
          videoRef.current.muted = true;
        }
        videoRef.current.play().catch(() => {});
      }
    }, 150);

    setTimeout(() => {
      setFilmBurnActive(false);
    }, 550);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    soundManager.playSfx('nav_hover');
  };

  const toggleAudio = () => {
    if (!videoRef.current) return;
    const nextState = !isMuted;
    setIsMuted(nextState);
    videoRef.current.muted = nextState;
    if (!nextState) {
      videoRef.current.volume = volume;
      soundManager.pauseMusic();
    } else {
      soundManager.resumeMusic();
    }
    soundManager.playSfx('nav_hover');
  };

  const cycleSpeed = () => {
    soundManager.playSfx('whoosh');
    if (speed === 1.0) setSpeed(0.5);
    else if (speed === 0.5) setSpeed(1.5);
    else setSpeed(1.0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section
      id="mashups"
      className="relative min-h-screen bg-gradient-to-b from-[#050505] via-[#090909] to-[#050505] text-white py-24 px-4 sm:px-8 md:px-14 overflow-hidden border-t border-white/5 select-none"
    >
      {/* Background Ambient Lighting Glow mapped to active channel */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: activeChannel.accentColor }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-[0.35em]">
            <Film className="w-4 h-4 text-gold animate-pulse" />
            <span>CINEMATIC ARCHIVE // MASHUP VAULT</span>
          </div>

          <div className="flex flex-col items-center">
            <SplitTextReveal
              text="THE CINEMATIC REELS."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white justify-center"
              delay={0.1}
            />
            <SplitTextReveal
              text="DHONI'S GOD MODE."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight gold-text-gradient justify-center"
              delay={0.25}
            />
          </div>

          <p className="font-editorial italic text-white/60 text-sm md:text-base max-w-2xl mx-auto tracking-wide pt-1">
            Experience the featured high-octane fan mashup with full original audio, celebrating the untouchable swagger, death-overs violence, and ice-cold finishes.
          </p>
        </div>

        {/* Channel Navigation Pills */}
        <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-8 z-20">
          {CHANNELS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => switchChannel(idx)}
              className={`relative py-3 px-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-start justify-between text-left ${
                activeChannelIdx === idx
                  ? 'bg-white/10 border-gold/70 shadow-[0_0_25px_rgba(212,175,102,0.25)] scale-[1.02]'
                  : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
              }`}
              data-cursor-hover
              data-cursor-text={ch.number}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase font-bold"
                  style={{ color: activeChannelIdx === idx ? ch.accentColor : '#888' }}
                >
                  {ch.number}
                </span>
                {activeChannelIdx === idx && (
                  <span className="flex h-2 w-2 relative">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: ch.accentColor }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: ch.accentColor }}
                    />
                  </span>
                )}
              </div>
              <h4 className="font-display text-xs sm:text-xs md:text-sm font-black uppercase tracking-wider text-white line-clamp-1">
                {ch.title}
              </h4>
            </button>
          ))}
        </div>

        {/* The Master Cinema Deck */}
        <div
          ref={containerRef}
          className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_0_90px_rgba(0,0,0,0.95)] group"
        >
          {/* Main Video Viewport */}
          <div className="relative w-full aspect-[16/9] overflow-hidden flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              key={activeChannel.videoSrc}
              src={activeChannel.videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.98]"
              onTimeUpdate={(e) => {
                const target = e.currentTarget;
                setCurrentTime(target.currentTime);
                if (target.duration) setDuration(target.duration);
              }}
              onLoadedMetadata={(e) => {
                const target = e.currentTarget;
                setDuration(target.duration);
                if (activeChannel.hasNativeAudio && !isMuted) {
                  target.muted = false;
                  target.volume = volume;
                }
              }}
            />

            {/* CRT TV Scanline Overlay (Optional Toggle) */}
            {crtEffect && (
              <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-70" />
            )}

            {/* Cinematic 2.39:1 Cinemascope Letterbox Bars */}
            <motion.div
              animate={{ height: cinemascope ? '8%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 bg-black z-30 pointer-events-none"
            />
            <motion.div
              animate={{ height: cinemascope ? '8%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 bg-black z-30 pointer-events-none"
            />

            {/* Film Burn Flash Transition Layer */}
            <AnimatePresence>
              {filmBurnActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.95, 0.4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-[#FFF5DC] via-[#D4AF66] to-[#FDB913] mix-blend-screen"
                />
              )}
            </AnimatePresence>

            {/* Top Video HUD Info Overlay */}
            <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full border border-white/20 bg-black/70 backdrop-blur-md font-mono text-[9px] md:text-[10px] tracking-widest text-gold uppercase flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-red-500 fill-current" />
                  <span>{activeChannel.badge}</span>
                </span>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md font-mono text-[9px] text-white/80 uppercase">
                  {activeChannel.statBadge}
                </span>
              </div>

              {/* Native Audio Badge & Quick Toggle */}
              <div className="flex items-center space-x-2 pointer-events-auto">
                <button
                  onClick={toggleAudio}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono tracking-widest uppercase backdrop-blur-md transition-all shadow-lg ${
                    !isMuted
                      ? 'border-green-400/80 bg-green-500/20 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'border-red-500/60 bg-red-500/20 text-red-300'
                  }`}
                  data-cursor-hover
                  data-cursor-text={isMuted ? 'UNMUTE' : 'MUTE'}
                >
                  {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-green-400" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
                  <span>{isMuted ? 'AUDIO: MUTED (CLICK TO HEAR)' : 'AUDIO: PLAYING'}</span>
                </button>
              </div>
            </div>

            {/* Center Big Play/Pause Action on Hover */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <div className="w-16 h-16 rounded-full border border-gold/60 bg-black/70 backdrop-blur-md flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,102,0.4)] transition-transform hover:scale-110">
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
              </div>
            </button>
          </div>

          {/* Interactive Scrub Progress Bar */}
          <div className="relative w-full bg-black/80 px-4 pt-3 pb-1 border-t border-white/5 z-30">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-gold tracking-widest uppercase font-bold">{activeChannel.title}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF66]"
            />
          </div>

          {/* Bottom Interactive Video Controller Deck */}
          <div className="relative z-30 bg-[#0d0d0d] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Active Channel Details */}
            <div className="w-full md:w-auto text-left space-y-0.5">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold"
                style={{ color: activeChannel.accentColor }}
              >
                {activeChannel.number} // {activeChannel.title}
              </span>
              <p className="text-xs text-white/70 font-editorial italic truncate max-w-md">
                {activeChannel.subtitle}
              </p>
            </div>

            {/* Right: Creative Controls (Audio / Speed / Cinemascope / Fullscreen) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Audio Volume Slider */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5">
                <button onClick={toggleAudio} className="text-gold hover:text-white transition-colors">
                  {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-white/50" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(v === 0);
                    if (videoRef.current) {
                      videoRef.current.volume = v;
                      videoRef.current.muted = v === 0;
                    }
                  }}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#D4AF66]"
                  title="Volume"
                />
              </div>

              {/* Speed Ramp */}
              <button
                onClick={cycleSpeed}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/90 text-xs font-mono tracking-wider transition-all"
                title="Toggle Speed Ramp (0.5x, 1.0x, 1.5x)"
                data-cursor-hover
                data-cursor-text="SPEED"
              >
                <FastForward className="w-3.5 h-3.5 text-gold" />
                <span>{speed}x</span>
              </button>

              {/* Cinemascope Toggle */}
              <button
                onClick={() => {
                  setCinemascope(!cinemascope);
                  soundManager.playSfx('nav_hover');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono tracking-wider transition-all ${
                  cinemascope
                    ? 'border-gold/50 bg-gold/15 text-gold'
                    : 'border-white/15 bg-white/5 text-white/60 hover:text-white'
                }`}
                title="Toggle 2.39:1 Cinemascope Anamorphic Bars"
                data-cursor-hover
                data-cursor-text="SCOPE"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">2.39:1</span>
              </button>

              {/* CRT Scanlines Toggle */}
              <button
                onClick={() => {
                  setCrtEffect(!crtEffect);
                  soundManager.playSfx('nav_hover');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono tracking-wider transition-all ${
                  crtEffect
                    ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-300'
                    : 'border-white/15 bg-white/5 text-white/60 hover:text-white'
                }`}
                title="Toggle Broadcast CRT Scanlines"
                data-cursor-hover
                data-cursor-text="CRT"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CRT</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                title="Fullscreen"
                data-cursor-hover
                data-cursor-text="EXPAND"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Play / Pause Pill */}
              <button
                onClick={togglePlay}
                className="px-4 py-1.5 rounded-xl bg-gold text-black font-display text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(212,175,102,0.3)]"
                data-cursor-hover
                data-cursor-text="PLAY"
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}