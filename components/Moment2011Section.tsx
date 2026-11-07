'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface StoryStep {
  step: number;
  time: string;
  title: string;
  headline: string;
  description: string;
  quote?: string;
  triggerAudio?: () => void;
}

export default function Moment2011Section() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const steps: StoryStep[] = [
    {
      step: 1,
      time: '14:30 IST • WANKHEDE STADIUM',
      title: 'THE ELECTRIC CAULDRON',
      headline: 'A BILLION DREAMS UNDER THE FLOODLIGHTS',
      description:
        'April 2, 2011. The air in Mumbai is thick with anticipation. Sri Lanka posts a challenging 274 on the back of Mahela Jayawardene’s sublime century. The target: 275. India has waited 28 long years since Kapil Dev lifted Prudential Cup in 1983.',
      quote: '"The noise at Wankhede was so deafening that the coin toss had to be done twice."',
      triggerAudio: () => soundManager.playSfx('whoosh'),
    },
    {
      step: 2,
      time: 'OVER 6.1 • DISASTER STRIKES',
      title: 'SILENCE AT THE CREASE',
      headline: 'SEHWAG GONE. TENDULKAR FALLS FOR 18.',
      description:
        'Lasith Malinga traps Virender Sehwag for a second-ball duck, then induces an edge from Sachin Tendulkar. 31/2. An eerie hush blankets the 42,000 in the stands. The weight of an entire nation rests on the shoulders of the middle order.',
      quote: '"When Sachin walked off, you could hear a pin drop across 1.2 billion people."',
      triggerAudio: () => soundManager.playSfx('bass_impact'),
    },
    {
      step: 3,
      time: 'OVER 21.4 • THE MASTERSTROKE',
      title: 'WALKING AHEAD OF YUVRAJ',
      headline: 'THE CAPTAIN TAKES CENTER STAGE',
      description:
        'When Virat Kohli is brilliantly caught-and-bowled for 35, everyone expects in-form Yuvraj Singh to walk out. Instead, MS Dhoni — averaging just 21 in the tournament — ascends the pavilion steps. He knows Muttiah Muralitharan and Suraj Randiv are operating. He wants to neutralize the off-spin.',
      quote: '"I told Gary Kirsten: If I go in now, I can handle Murali. Gary just nodded."',
      triggerAudio: () => soundManager.playSfx('whoosh'),
    },
    {
      step: 4,
      time: 'OVER 48.2 • 4 RUNS NEEDED',
      title: 'THE HELICOPTER SHOT',
      headline: 'THE MOMENT OF GLORY',
      description:
        'Nuwan Kulasekara runs in. Full length on middle stump. Dhoni winds his heavy bat, uncoils his wrists, and launches a thunderous strike high over long-on. He twirls the willow, watching the white sphere sail into the jubilant stands.',
      quote: '"Dhoni finishes off in style! A magnificent strike into the crowd! India lift the World Cup after 28 years!" — Ravi Shastri',
      triggerAudio: () => {
        soundManager.playSfx('bat_impact');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800);
        setTimeout(() => soundManager.playSfx('bass_braam'), 120);
        // Golden confetti explosion
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#D4AF66', '#FDB913', '#FFFFFF', '#AA8535'],
        });
      },
    },
    {
      step: 5,
      time: 'MIDNIGHT • THE AFTERMATH',
      title: 'BECOMING IMMORTAL',
      headline: 'A QUIET SMILE IN THE SHADOWS',
      description:
        'While the stadium erupts, tears of ecstasy stream down Yuvraj’s cheeks, and Sachin is carried on youthful shoulders around Wankhede, Dhoni quietly steps back, hands the coveted cup to the youngsters, and watches with a peaceful smile.',
      quote: '"Tendulkar has carried the burden of the nation for 21 years. It is time we carried him on our shoulders." — Virat Kohli',
      triggerAudio: () => {
        soundManager.playSfx('trophy_reveal');
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#D4AF66', '#FDB913', '#FFE482'],
        });
      },
    },
  ];

  const handleNextStep = (index: number) => {
    setCurrentStep(index);
    if (steps[index].triggerAudio) {
      steps[index].triggerAudio!();
    }
  };

  return (
    <section id="moment-2011" className="relative min-h-screen bg-[#050505] text-white py-28 px-6 md:px-12 overflow-hidden">
      {/* Background Cinematic Video of 2011 Final Atmosphere */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          ref={videoRef}
          src="/assets/videos/moment_2011.mp4"
          poster="/assets/images/wankhede_2011_final.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/65 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_90%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-[0.35em]">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>THE DEFINING MASTERPIECE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight">
            28 YEARS OF WAITING.<br />
            <span className="gold-text-gradient">ONE MOMENT OF GLORY.</span>
          </h2>
          <p className="font-editorial italic text-white/60 text-sm md:text-lg max-w-2xl mx-auto tracking-wide">
            Follow the dramatic progression of the 2011 World Cup final. Click each milestone to relive the tension and the triumph.
          </p>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {steps.map((st, idx) => (
            <button
              key={st.step}
              onClick={() => handleNextStep(idx)}
              className={`px-4 py-2 rounded-full font-display text-xs tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 ${
                currentStep === idx
                  ? 'border border-gold bg-gold text-[#050505] font-bold shadow-[0_0_20px_rgba(212,175,102,0.4)]'
                  : 'border border-white/15 bg-white/5 text-white/70 hover:border-gold/50 hover:text-white'
              }`}
              data-cursor-hover
              data-cursor-text={`0${idx + 1}`}
            >
              <span>SCENE 0{st.step}</span>
            </button>
          ))}
        </div>

        {/* Story Interactive Card Container with Camera Shake Dynamics */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={
              isShaking
                ? { x: [-12, 12, -8, 8, -4, 4, 0], y: [-6, 6, -4, 4, 0], opacity: 1, scale: 1.02 }
                : { opacity: 1, y: 0, scale: 1, x: 0 }
            }
            exit={{ opacity: 0, y: -25, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto rounded-3xl border border-gold/30 bg-[#0e0e0e]/90 backdrop-blur-xl p-8 md:p-14 shadow-[0_0_50px_rgba(212,175,102,0.15)] relative overflow-hidden"
          >
            {/* Top Scene Marker */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <span className="font-mono text-xs text-gold uppercase tracking-[0.3em]">
                {steps[currentStep].time}
              </span>
              <span className="px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] font-mono tracking-widest uppercase">
                SCENE 0{steps[currentStep].step} OF 05
              </span>
            </div>

            {/* Scene Content */}
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 block">
                {steps[currentStep].title}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {steps[currentStep].headline}
              </h3>
              <p className="text-sm md:text-lg text-white/80 leading-relaxed font-sans pt-2">
                {steps[currentStep].description}
              </p>

              {steps[currentStep].quote && (
                <div className="pt-4">
                  <blockquote className="font-editorial italic text-base md:text-xl text-gold/90 border-l-2 border-gold pl-5 py-2 bg-gold/5 rounded-r-xl leading-relaxed">
                    {steps[currentStep].quote}
                  </blockquote>
                </div>
              )}
            </div>

            {/* Bottom Scene Trigger Actions */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => steps[currentStep].triggerAudio && steps[currentStep].triggerAudio!()}
                className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gold hover:text-white transition-colors"
                data-cursor-hover
              >
                <Volume2 className="w-4 h-4" />
                <span>REPLAY CLIMAX AUDIO</span>
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => handleNextStep(currentStep + 1)}
                  className="px-6 py-2.5 rounded-full bg-gold text-[#050505] font-display text-xs tracking-widest uppercase font-bold hover:bg-gold-light transition-colors"
                  data-cursor-hover
                >
                  NEXT SCENE →
                </button>
              ) : (
                <span className="font-display text-xs uppercase tracking-widest text-gold font-bold">
                  THE SIX THAT BECAME HISTORY.
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <p className="font-display text-lg md:text-2xl tracking-[0.4em] uppercase text-white/40 font-bold">
            THE SIX THAT BECAME HISTORY.
          </p>
        </div>
      </div>
    </section>
  );
}
