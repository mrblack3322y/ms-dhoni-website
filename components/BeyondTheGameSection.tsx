'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Compass, Heart, Award } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { TiltCard, SplitTextReveal, AnamorphicDivider } from '@/components/CinematicTransition';

const EDITORIAL_PIECES = [
  {
    title: 'THE MOTORCYCLE OBSESSION',
    category: 'VINTAGE & SPEED',
    description:
      'Dhoni’s legendary multi-storey bike garage in Ranchi houses over 70 rare machines. From his first beloved Rajdoot 350 to the exotic Confederate Hellcat X132, Kawasaki Ninja H2, and Yamaha RD350, engines and speed remain his ultimate therapeutic escape.',
    image: '/assets/images/journey_2004_debut.jpg',
    badge: '70+ SUPERBIKES',
  },
  {
    title: 'HONORARY LT. COLONEL',
    category: 'PARACHUTE REGIMENT (TERRITORIAL ARMY)',
    description:
      'Conferred the rank of Honorary Lieutenant Colonel in the Parachute Regiment in 2011, Dhoni underwent grueling para-training in Agra, completing five parachute jumps to earn his coveted para-wings. In 2019, he served a 15-day patrolling stint in Jammu & Kashmir.',
    image: '/assets/images/journey_2018_padma.jpg',
    badge: '106 PARA TA BATTALION',
  },
  {
    title: 'FOOTBALL ROOTS',
    category: 'FROM GOALKEEPER TO WICKETKEEPER',
    description:
      'Long before touching a cricket bat, young Mahi was a football goalkeeper for DAV Jawahar Vidya Mandir school team in Shyamali, Ranchi. His coach Keshav Ranjan Banerjee spotted his uncanny reflexes and hand-eye coordination, urging him to stand behind the stumps.',
    image: '/assets/images/dhoni_behind_stumps.jpg',
    badge: 'REFLEX ORIGINS',
  },
  {
    title: 'KAILASHPATI — RANCHI SIMPLICITY',
    category: 'FARMING, DOGS & TRANQUILITY',
    description:
      'At his sprawling 7-acre farmhouse Kailashpati on the outskirts of Ranchi, Dhoni drives tractors, grows organic strawberries and watermelons, and trains his beloved Belgian Malinois and Dutch Shepherds away from the spotlight of fame.',
    image: '/assets/images/dhoni_hero_portrait.jpg',
    badge: '7-ACRE SANCTUARY',
  },
];

export default function BeyondTheGameSection() {
  return (
    <section id="beyond" className="relative min-h-screen bg-[#050505] text-white py-28 px-6 md:px-12 overflow-hidden">
      <AnamorphicDivider color="#D4AF66" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-20">
          <span className="text-gold font-mono text-xs uppercase tracking-[0.35em] block">
            EDITORIAL SPOTLIGHT
          </span>
          <div className="flex flex-col items-center">
            <SplitTextReveal
              text="THE MAN BEHIND"
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight justify-center"
              delay={0.1}
            />
            <SplitTextReveal
              text="THE LEGEND."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight gold-text-gradient justify-center"
              delay={0.3}
            />
          </div>
          <p className="font-editorial italic text-white/60 text-sm md:text-lg max-w-2xl mx-auto tracking-wide pt-2">
            Away from stadium floodlights and screaming millions, discover the passions, service, and unshakeable simplicity that define Mahendra Singh Dhoni.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {EDITORIAL_PIECES.map((piece, idx) => (
            <motion.div
              key={piece.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className={`h-full ${idx === 1 || idx === 2 ? 'md:translate-y-6' : ''}`}
            >
              <TiltCard className="h-full">
                <div
                  onMouseEnter={() => soundManager.playSfx('nav_hover')}
                  className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl hover:border-gold/40 transition-all duration-500 group h-full"
                  data-cursor-hover
                  data-cursor-text="EXPLORE"
                >
                  {/* Image Preview Container */}
                  <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden mb-8 border border-white/5">
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      className="object-cover object-center filter brightness-[0.65] contrast-[1.1] group-hover:scale-105 group-hover:brightness-90 transition-all duration-700"
                      sizes="600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full border border-gold/40 bg-black/60 backdrop-blur-md text-gold text-[10px] font-mono tracking-widest uppercase">
                      {piece.badge}
                    </span>
                  </div>

                  {/* Text Meta */}
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold/80 block">
                      {piece.category}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wide text-white group-hover:text-gold transition-colors">
                      {piece.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed font-sans">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
