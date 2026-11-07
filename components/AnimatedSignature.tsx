'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, RotateCcw, Award, CheckCircle2, Palette, Volume2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  color: string;
}

type InkStyle = 'gold' | 'csk' | 'india' | 'silver';

export default function AnimatedSignature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-60px' });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [inkStyle, setInkStyle] = useState<InkStyle>('gold');

  // References for 60fps rendering buffers
  const goldImgDataRef = useRef<ImageData | null>(null);
  const timeMapDataRef = useRef<Uint8ClampedArray | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const penTipRef = useRef<{ x: number; y: number } | null>(null);

  const DURATION_MS = 5200; // 5.2s sync with "Dhoni finishes off in style..." commentary

  // Preload and cache raw RGBA buffers
  useEffect(() => {
    let active = true;

    const goldImg = new Image();
    const timeImg = new Image();

    goldImg.src = '/assets/images/dhoni_signature_gold.png';
    timeImg.src = '/assets/images/signature_timemap.png';

    let loadedCount = 0;
    const onBothLoaded = () => {
      loadedCount++;
      if (loadedCount === 2 && active) {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return;

        offCanvas.width = 800;
        offCanvas.height = 858;

        // Extract signature pixels
        offCtx.drawImage(goldImg, 0, 0, 800, 858);
        goldImgDataRef.current = offCtx.getImageData(0, 0, 800, 858);

        // Extract smooth time-map pixels
        offCtx.clearRect(0, 0, 800, 858);
        offCtx.drawImage(timeImg, 0, 0, 800, 858);
        const timeData = offCtx.getImageData(0, 0, 800, 858);
        timeMapDataRef.current = timeData.data;

        setIsLoaded(true);
      }
    };

    goldImg.onload = onBothLoaded;
    timeImg.onload = onBothLoaded;

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Main 60fps Ink Flow Rendering Loop
  const renderFrame = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !goldImgDataRef.current || !timeMapDataRef.current) return;

    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;
    const rawProgress = Math.min(1.0, elapsed / DURATION_MS);

    // Natural handwriting easing (swift downstrokes, graceful flourishes)
    const easedProgress = rawProgress < 0.5
      ? 2 * rawProgress * rawProgress
      : -1 + (4 - 2 * rawProgress) * rawProgress;

    setProgressVal(Math.round(easedProgress * 100));

    const threshold = easedProgress * 255;
    const width = 800;
    const height = 858;

    const frameData = ctx.createImageData(width, height);
    const outPixels = frameData.data;
    const goldPixels = goldImgDataRef.current.data;
    const timePixels = timeMapDataRef.current;

    let tipXAcc = 0;
    let tipYAcc = 0;
    let tipCount = 0;

    for (let i = 0; i < timePixels.length; i += 4) {
      const pixelTime = timePixels[i];
      const origAlpha = goldPixels[i + 3];

      if (origAlpha > 15 && pixelTime <= threshold) {
        const distFromLeadingEdge = threshold - pixelTime;

        if (distFromLeadingEdge < 16) {
          // Hot incandescent leading edge (white-gold pen contact point)
          outPixels[i] = 255;
          outPixels[i + 1] = 248;
          outPixels[i + 2] = 220;
          outPixels[i + 3] = origAlpha;

          const pxIdx = i / 4;
          tipXAcc += pxIdx % width;
          tipYAcc += Math.floor(pxIdx / width);
          tipCount++;
        } else {
          // Flowing ink
          outPixels[i] = goldPixels[i];
          outPixels[i + 1] = goldPixels[i + 1];
          outPixels[i + 2] = goldPixels[i + 2];
          outPixels[i + 3] = origAlpha;
        }
      }
    }

    ctx.putImageData(frameData, 0, 0);

    // Draw traveling pen nib glow & emit sparks
    if (tipCount > 0 && rawProgress < 0.99) {
      const avgX = tipXAcc / tipCount;
      const avgY = tipYAcc / tipCount;
      penTipRef.current = { x: avgX, y: avgY };

      // Spawn gold spark embers
      for (let p = 0; p < 3; p++) {
        particlesRef.current.push({
          x: avgX + (Math.random() - 0.5) * 10,
          y: avgY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2.5 - 0.5,
          size: Math.random() * 2.5 + 1,
          alpha: 1.0,
          life: 1.0,
          color: Math.random() > 0.4 ? '#FDB913' : '#FFF5DC',
        });
      }

      // Incandescent pen nib radiant flare
      const grad = ctx.createRadialGradient(avgX, avgY, 1, avgX, avgY, 28);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.25, 'rgba(253, 185, 19, 0.85)');
      grad.addColorStop(0.65, 'rgba(212, 175, 102, 0.35)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(avgX, avgY, 28, 0, Math.PI * 2);
      ctx.fill();
    } else {
      penTipRef.current = null;
    }

    // Render floating embers
    for (let p = particlesRef.current.length - 1; p >= 0; p--) {
      const pt = particlesRef.current[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.03;
      pt.alpha = Math.max(0, pt.life);

      if (pt.life <= 0) {
        particlesRef.current.splice(p, 1);
        continue;
      }

      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.alpha;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    if (rawProgress < 1.0) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    } else {
      setIsPlaying(false);
      setIsComplete(true);
      // Final crisp repaint of exact authentic gold signature
      if (goldImgDataRef.current) {
        ctx.putImageData(goldImgDataRef.current, 0, 0);
      }
    }
  }, [DURATION_MS]);

  // Start / replay animation with iconic Ravi Shastri commentary SFX
  const startAnimation = useCallback((mode: 'style' | 'full' = 'style') => {
    if (!isLoaded) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    // Play iconic Ravi Shastri commentary audio SFX!
    if (mode === 'full') {
      soundManager.playSfx('dhoni_finishes_style_full', true);
    } else {
      soundManager.playSfx('dhoni_finishes_style', true);
    }

    particlesRef.current = [];
    startTimeRef.current = 0;
    setIsPlaying(true);
    setIsComplete(false);

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [isLoaded, renderFrame]);

  // Trigger when scrolled into view
  useEffect(() => {
    if (isInView && isLoaded && !isPlaying && !isComplete) {
      startAnimation();
    }
  }, [isInView, isLoaded, isPlaying, isComplete, startAnimation]);

  // CSS filter classes for ink style studio
  const getFilterStyle = () => {
    switch (inkStyle) {
      case 'csk':
        return 'hue-rotate-[-10deg] saturate-[220%] brightness-[1.1] drop-shadow-[0_0_25px_rgba(253,185,19,0.7)]';
      case 'india':
        return 'hue-rotate-[185deg] saturate-[180%] brightness-[1.1] drop-shadow-[0_0_25px_rgba(0,180,255,0.6)]';
      case 'silver':
        return 'grayscale brightness-[1.3] drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]';
      case 'gold':
      default:
        return 'drop-shadow-[0_0_25px_rgba(212,175,102,0.6)]';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none w-full max-w-2xl mx-auto py-8"
    >
      {/* Background Soft Gold Ambient Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,102,0.18)_0%,transparent_75%)] pointer-events-none filter blur-2xl" />

      {/* Main Canvas Frame */}
      <div className="relative w-full aspect-[800/858] max-w-[460px] md:max-w-[520px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={858}
          className={`w-full h-full object-contain transition-all duration-700 hover:scale-[1.02] ${getFilterStyle()}`}
        />

        {/* Live Writing HUD Overlay */}
        {isPlaying && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-gold/50 bg-black/75 backdrop-blur-md flex items-center space-x-2 text-[10px] font-mono text-gold tracking-widest uppercase shadow-xl">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span>FLOWING INK... {progressVal}%</span>
          </div>
        )}

        {/* Live Commentary Subtitle Pill during Flow */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 right-4 mx-auto max-w-md px-4 py-2 rounded-full border border-gold/60 bg-black/90 backdrop-blur-md flex items-center justify-center space-x-2.5 text-[10px] sm:text-xs font-mono text-gold tracking-wide uppercase shadow-[0_0_30px_rgba(212,175,102,0.4)] animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-gold shrink-0 animate-bounce" />
            <span className="truncate">&ldquo;DHONI FINISHES OFF IN STYLE...&rdquo;</span>
            <div className="flex items-center space-x-0.5 shrink-0">
              <span className="w-1 h-2.5 bg-gold animate-pulse" />
              <span className="w-1 h-3.5 bg-gold animate-pulse delay-75" />
              <span className="w-1 h-2 bg-gold animate-pulse delay-150" />
            </div>
          </div>
        )}

        {/* Shimmer Sheen sweep when complete */}
        {isComplete && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
        )}
      </div>

      {/* Interactive Ink Studio & Controls */}
      <div className="flex flex-col items-center gap-4 mt-6 z-10 w-full max-w-lg">
        
        {/* Ink Style Selector Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => { setInkStyle('gold'); soundManager.playSfx('nav_hover'); }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              inkStyle === 'gold' ? 'bg-gold text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            <span>24K GOLD</span>
          </button>

          <button
            onClick={() => { setInkStyle('csk'); soundManager.playSfx('chepauk_whistle'); }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              inkStyle === 'csk' ? 'bg-csk-yellow text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-csk-yellow inline-block" />
            <span>CSK YELLOW</span>
          </button>

          <button
            onClick={() => { setInkStyle('india'); soundManager.playSfx('nav_hover'); }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              inkStyle === 'india' ? 'bg-cyan-400 text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span>TEAM INDIA</span>
          </button>

          <button
            onClick={() => { setInkStyle('silver'); soundManager.playSfx('nav_hover'); }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              inkStyle === 'silver' ? 'bg-white text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>SILVER</span>
          </button>
        </div>

        {/* Certificate Tagline */}
        <div className="flex items-center space-x-1.5 text-gold font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
          <span>AUTHENTICATED AUTOGRAPH • CAPTAIN OF INDIA • #7</span>
        </div>

        {/* Commentary SFX Replay Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => startAnimation('style')}
            className="flex items-center space-x-2 px-5 py-2 rounded-full border border-gold/60 bg-gold/20 hover:bg-gold/35 text-gold text-[10px] md:text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(212,175,102,0.3)] hover:scale-105 active:scale-95"
            data-cursor-hover
            data-cursor-text="SHASTRI"
            title="Replay signature flow with Ravi Shastri 'Dhoni finishes off in style' commentary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>FLOW &ldquo;FINISH OFF IN STYLE&rdquo; SFX</span>
          </button>

          <button
            onClick={() => startAnimation('full')}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-[10px] md:text-xs font-mono tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
            data-cursor-hover
            data-cursor-text="FULL CALL"
            title="Play full 10-second 2011 World Cup broadcast commentary"
          >
            <Volume2 className="w-3.5 h-3.5 text-gold" />
            <span>FULL 2011 CALL (10s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}