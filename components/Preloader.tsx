'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealingLogo, setIsRevealingLogo] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Track asset readiness
    const assetsToLoad = [
      '/assets/images/dhoni_hero_portrait.jpg',
      '/assets/images/wankhede_2011_final.jpg',
      '/assets/images/csk_chepauk_night.jpg',
      '/assets/images/dhoni_signature.png',
      '/assets/audio/cinematic_theme.wav',
    ];

    let loadedCount = 0;
    const totalAssets = assetsToLoad.length;

    const updateRealProgress = () => {
      loadedCount++;
      const targetPercent = Math.min(95, Math.floor((loadedCount / totalAssets) * 100));
      setProgress(prev => Math.max(prev, targetPercent));
    };

    // Preload key images
    assetsToLoad.forEach(src => {
      if (src.endsWith('.jpg') || src.endsWith('.png')) {
        const img = new Image();
        img.src = src;
        img.onload = updateRealProgress;
        img.onerror = updateRealProgress;
      } else {
        // simulate audio probe
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = updateRealProgress;
        audio.onerror = updateRealProgress;
      }
    });

    // Steady interval to ensure smooth progression from 0 to 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRevealingLogo(true);
            setTimeout(() => {
              setIsDone(true);
              setTimeout(onComplete, 900);
            }, 1200);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.15,
            filter: 'blur(10px)',
            transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          {/* Subtle background ambient pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,102,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Central Golden Loader / Logo Container */}
          <div className="relative flex flex-col items-center justify-center">
            {!isRevealingLogo ? (
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Golden circular spinner track */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-[#1a1a1a]"
                    strokeWidth="2.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-gold"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * progress) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                  />
                </svg>

                {/* Percentage Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold tracking-widest text-white">
                    {progress}%
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-gold/70 mt-0.5">
                    No. 07
                  </span>
                </div>
              </div>
            ) : (
              /* Logo Reveal Mask */
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-[0.2em] gold-text-gradient">
                    MAHI
                  </h1>
                  <motion.div
                    className="h-[2px] bg-gold w-full mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  />
                </div>
                <motion.span
                  className="text-xs uppercase tracking-[0.4em] text-white/70 mt-3 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  THE LEGEND
                </motion.span>
              </motion.div>
            )}

            {/* Subtext */}
            {!isRevealingLogo && (
              <motion.div
                className="mt-8 flex flex-col items-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-display text-xs tracking-[0.3em] uppercase text-white/80">
                  THE LEGEND IS LOADING...
                </p>
                <div className="flex items-center space-x-1.5 text-[10px] text-gold/60 font-mono tracking-widest">
                  <span>MAHENDRA SINGH DHONI</span>
                  <span>•</span>
                  <span>#7</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
