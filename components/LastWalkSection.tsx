'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedSignature from '@/components/AnimatedSignature';
import { SplitTextReveal, AnamorphicDivider } from '@/components/CinematicTransition';

export default function LastWalkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="signature"
      ref={containerRef}
      className="relative min-h-[150vh] bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden px-6 select-none"
    >
      {/* Background Video of the Last Walk */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <video
          src="/assets/videos/the_last_walk.mp4"
          poster="/assets/images/dhoni_last_walk.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]" />
      </motion.div>

      {/* Laser Light Divider */}
      <AnamorphicDivider color="#D4AF66" />

      {/* Poetic Line by Line Reveal */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10 my-auto py-24">
        <div>
          <SplitTextReveal
            text="SOME PLAYERS MAKE HISTORY."
            className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-white/70 justify-center"
            delay={0.2}
          />
        </div>

        <div>
          <SplitTextReveal
            text="SOME PLAYERS CHANGE THE GAME."
            className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-white/85 justify-center"
            delay={0.5}
          />
        </div>

        <div>
          <SplitTextReveal
            text="AND SOME..."
            className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-gold/80 tracking-wide justify-center"
            delay={0.8}
          />
        </div>

        <div>
          <SplitTextReveal
            text="BECOME IMMORTAL."
            className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight gold-text-gradient glow-gold pt-4 justify-center"
            delay={1.1}
          />
        </div>

        {/* Final Climax: THALA. FOREVER. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="pt-12 flex flex-col items-center justify-center space-y-6"
        >
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-gold to-transparent" />
          
          <h2 className="font-display text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-white">
            THALA.<br />
            <span className="gold-text-gradient">FOREVER.</span>
          </h2>

          {/* Retirement from IPL Tribute Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 px-6 py-2.5 rounded-full border border-csk-yellow/50 bg-gradient-to-r from-csk-yellow/20 via-black/80 to-csk-yellow/20 text-csk-yellow font-mono text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(253,185,19,0.35)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-csk-yellow" />
            <span>THE FINAL BOW • RETIRED FROM IPL TODAY</span>
            <span className="text-white/40">•</span>
            <span>5X CHAMPION • 264 MATCHES • CHEPAUK HERO 💛</span>
          </div>

          {/* Animated Flowing Ink Signature of MS Dhoni */}
          <div className="w-full pt-4">
            <AnimatedSignature />
          </div>

          <div className="flex items-center space-x-3 pt-6 font-mono text-xs uppercase tracking-[0.4em] text-white/40">
            <span>MAHENDRA SINGH DHONI</span>
            <span>•</span>
            <span className="text-gold font-bold">#7</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
