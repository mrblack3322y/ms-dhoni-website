'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Volume2, Award, Zap, Flame } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { TiltCard, SplitTextReveal, AnamorphicDivider } from '@/components/CinematicTransition';

const CSK_ACHIEVEMENTS = [
  {
    title: 'THE FINAL BOW — RETIRED TODAY',
    years: '2008 — 2026 • THE IMMORTAL THALA',
    description: 'Today, MS Dhoni officially bids farewell to the IPL and the iconic yellow No. 7 jersey. 5 IPL trophies, 2 Champions League crowns, 264 games, and an unconditional bond of Yellove with millions worldwide.',
  },
  {
    title: '5X IPL CHAMPIONS',
    years: '2010 • 2011 • 2018 • 2021 • 2023',
    description: 'Joint most successful franchise in IPL history. Led to 10 finals in 14 seasons played — an unprecedented 71% finals conversion rate.',
  },
  {
    title: '2X CHAMPIONS LEAGUE T20',
    years: '2010 (SOUTH AFRICA) • 2014 (INDIA)',
    description: 'Conquered the globe twice in international franchise competition, defeating top T20 teams from Australia, South Africa, and England.',
  },
  {
    title: 'THE 2018 FAIRYTALE COMEBACK',
    years: 'THE RETURN OF "DAD’S ARMY"',
    description: 'After a two-year hiatus, Dhoni led an experienced squad mocked as "Dad’s Army" to an emotional, Hollywood-style championship victory.',
  },
];

export default function YellowLegacySection() {
  const [whistleActive, setWhistleActive] = useState(false);
  const [anthemActive, setAnthemActive] = useState(false);
  const [decibels, setDecibels] = useState(115);
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerChepaukWhistle = () => {
    soundManager.playSfx('chepauk_whistle');
    setWhistleActive(true);
    setDecibels(128.4);
    setTimeout(() => {
      setWhistleActive(false);
      setDecibels(115);
    }, 7500);
  };

  const triggerWhistleAnthem = () => {
    soundManager.playSfx('csk_whistle_anthem');
    setAnthemActive(true);
    setDecibels(130.2);
    setTimeout(() => {
      setAnthemActive(false);
      setDecibels(115);
    }, 16000);
  };

  return (
    <section
      id="yellow-legacy"
      className="relative min-h-screen bg-[#080808] text-white py-28 px-6 md:px-12 overflow-hidden transition-colors duration-1000 border-t border-csk-yellow/20"
    >
      {/* Background CSK Stadium Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          ref={videoRef}
          src="/assets/videos/csk_yellow_legacy.mp4"
          poster="/assets/images/csk_chepauk_night.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(253,185,19,0.18)_0%,transparent_75%)]" />
      </div>

      {/* Animated CSK Yellow Light Streaks */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(253,185,19,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(253,185,19,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl animate-pulse" />

      {/* Laser Light Divider */}
      <AnamorphicDivider color="#FDB913" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center space-x-2 text-csk-yellow font-mono text-xs uppercase tracking-[0.35em] bg-csk-yellow/10 border border-csk-yellow/30 px-4 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-csk-yellow" />
              <span>CHENNAI SUPER KINGS DYNASTY</span>
            </div>
            <div className="inline-flex items-center space-x-2 text-white font-mono text-xs uppercase tracking-[0.2em] bg-csk-yellow/20 border border-csk-yellow/60 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(253,185,19,0.35)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-csk-yellow" />
              <span className="text-csk-yellow font-bold">RETIRED FROM IPL TODAY</span>
              <span>💛</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <SplitTextReveal
              text="WHISTLE PODU."
              className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white justify-center"
              delay={0.1}
            />
            <SplitTextReveal
              text="THALA FOREVER."
              className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight csk-text-gradient glow-yellow justify-center"
              delay={0.3}
            />
          </div>

          <p className="font-editorial italic text-white/70 text-sm md:text-lg max-w-2xl mx-auto tracking-wide pt-2">
            Not just a cricket team, but an emotion for millions. At MA Chidambaram Stadium, Chepauk, when No. 7 walks out, the decibels shatter records.
          </p>

          {/* Interactive Chepauk Decibel / Whistle Triggers */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={triggerChepaukWhistle}
              className={`px-7 py-3.5 rounded-full font-display text-xs md:text-sm tracking-[0.25em] uppercase font-extrabold flex items-center space-x-2.5 transition-all duration-300 shadow-2xl ${
                whistleActive
                  ? 'bg-white text-black scale-105 shadow-[0_0_35px_rgba(253,185,19,0.8)]'
                  : 'bg-gradient-to-r from-csk-yellow to-yellow-500 text-black hover:scale-105 hover:shadow-[0_0_25px_rgba(253,185,19,0.5)]'
              }`}
              data-cursor-hover
              data-cursor-text="WHISTLE"
            >
              <Volume2 className={`w-4 h-4 ${whistleActive ? 'animate-bounce text-yellow-600' : ''}`} />
              <span>{whistleActive ? 'WHISTLE PODU BLASTING!' : 'BLOW WHISTLE PODU'}</span>
            </button>

            <button
              onClick={triggerWhistleAnthem}
              className={`px-7 py-3.5 rounded-full font-display text-xs md:text-sm tracking-[0.25em] uppercase font-bold border transition-all duration-300 flex items-center space-x-2.5 ${
                anthemActive
                  ? 'border-csk-yellow bg-csk-yellow/30 text-csk-yellow shadow-[0_0_30px_rgba(253,185,19,0.5)] scale-105'
                  : 'border-csk-yellow/40 bg-csk-yellow/10 text-csk-yellow hover:bg-csk-yellow/20 hover:border-csk-yellow'
              }`}
              data-cursor-hover
              data-cursor-text="ANTHEM"
            >
              <Zap className={`w-4 h-4 ${anthemActive ? 'animate-spin' : ''}`} />
              <span>{anthemActive ? 'ANTHEM PLAYING (16s)...' : 'PLAY FULL WHISTLE ANTHEM'}</span>
            </button>

            {/* Live Decibel Meter Indicator */}
            <div className="flex items-center space-x-2 text-xs font-mono text-white/60 tracking-widest sm:pl-2">
              <span>STADIUM ROAR:</span>
              <span className={`font-bold transition-colors ${whistleActive || anthemActive ? 'text-csk-yellow text-sm' : 'text-white'}`}>
                {decibels} dB
              </span>
              <span className="text-[10px] text-white/40">(CHEPAUK RECORD)</span>
            </div>
          </div>
        </div>

        {/* 4 Dynasty Achievement Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {CSK_ACHIEVEMENTS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <TiltCard>
                <div
                  className="rounded-2xl border border-csk-yellow/30 bg-[#0f0e08]/90 backdrop-blur-xl p-8 hover:border-csk-yellow transition-all duration-500 shadow-xl group h-full"
                  data-cursor-hover
                  data-cursor-text="CSK"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-csk-yellow tracking-widest uppercase">
                      {card.years}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-csk-yellow/40 flex items-center justify-center text-csk-yellow bg-csk-yellow/10">
                      <Shield className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wide text-white group-hover:text-csk-yellow transition-colors mb-3">
                    {card.title}
                  </h3>

                  <p className="text-sm text-white/75 font-sans leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner: 2023 Last-over thriller */}
        <TiltCard>
          <div className="rounded-3xl border border-csk-yellow/40 bg-gradient-to-r from-[#121005] via-[#1a1608] to-[#121005] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(circle_at_right,rgba(253,185,19,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-2xl space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-csk-yellow block">
                AHMEDABAD • MAY 29, 2023 • 01:30 AM
              </span>
              <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                10 RUNS OFF 2 BALLS.<br />
                <span className="csk-text-gradient">TITLE NUMBER FIVE.</span>
              </h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-sans">
                With eyes closed in prayer in the dugout, Dhoni waited as Ravindra Jadeja smashed a six and a four off the final two deliveries to clinch the 5th IPL title. When Jadeja ran to the dugout, Dhoni scooped him into his arms with tears in his eyes — the rarest emotional display from the coolest captain to ever walk the earth.
              </p>
              <div className="pt-2">
                <blockquote className="font-editorial italic text-xs md:text-sm text-csk-yellow/90 border-l border-csk-yellow/50 pl-4 py-1">
                  "The easiest thing for me is to say ‘Thank you very much and retire’. But the tough thing is to work hard for 9 months and try to play another season. The amount of love I have received, this is a gift for them." — MS Dhoni
                </blockquote>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
