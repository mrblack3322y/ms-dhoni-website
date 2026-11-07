'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, ChevronRight, X, Play } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { TiltCard, SplitTextReveal, AnamorphicDivider } from '@/components/CinematicTransition';
import * as THREE from 'three';

interface TrophyData {
  id: string;
  year: string;
  name: string;
  tournament: string;
  venue: string;
  scorecard: string;
  image: string;
  masterstroke: string;
  quote: string;
  details: string;
}

const TROPHIES: TrophyData[] = [
  {
    id: 't20-2007',
    year: '2007',
    name: 'ICC WORLD TWENTY20',
    tournament: 'INNAUGURAL ICC T20 WORLD CUP',
    venue: 'Wanderers Stadium, Johannesburg, South Africa',
    scorecard: 'India 157/5 beat Pakistan 152 all out by 5 runs',
    image: '/assets/images/journey_2007_t20_wc.jpg',
    masterstroke: 'Trusting Joginder Sharma with 13 runs to defend in the 20th over instead of Harbhajan Singh.',
    quote: '"I thought of giving the ball to Paaji (Harbhajan), but he wasn’t feeling confident after conceding runs earlier. Joginder had a calm head. It was about trusting a human being under pressure."',
    details: 'With senior stalwarts missing the tournament, Dhoni led an underdog squad of youngsters. From the bowl-out victory against Pakistan in the group stage to beating Australia in the semi-final and defending 157 in the tense final, Dhoni changed Indian cricket’s destiny forever.',
  },
  {
    id: 'cwc-2011',
    year: '2011',
    name: 'ICC CRICKET WORLD CUP',
    tournament: 'THE 50-OVER WORLD CUP GLORY',
    venue: 'Wankhede Stadium, Mumbai, India',
    scorecard: 'India 277/4 beat Sri Lanka 274/6 by 6 wickets',
    image: '/assets/images/cwc_trophy.jpg',
    masterstroke: 'Promoting himself to No. 5 ahead of Player of the Tournament Yuvraj Singh to tackle Muttiah Muralitharan.',
    quote: '"Dhoni finishes off in style. A magnificent strike into the crowd! India lift the World Cup after 28 years! The party has started in the dressing room, and it’s an Indian captain who has been magnificent in the night of the final!"',
    details: 'Chasing 275 in front of a breathless home crowd after Sehwag and Tendulkar fell early, Dhoni forged a match-winning partnership with Gautam Gambhir (97) before blasting an imperious 91* off 79 balls. The iconic helicopter six off Nuwan Kulasekara remains the most celebrated shot in cricket history.',
  },
  {
    id: 'ct-2013',
    year: '2013',
    name: 'ICC CHAMPIONS TROPHY',
    tournament: 'THE WHITE-BALL TRIPLE CROWN',
    venue: 'Edgbaston, Birmingham, United Kingdom',
    scorecard: 'India 129/7 beat England 124/8 by 5 runs (20 overs)',
    image: '/assets/images/icc_trophy_case.jpg',
    masterstroke: 'Bringing Ishant Sharma back for the 18th over after he had conceded 27 in his first 3 overs — Ishant struck twice on consecutive balls.',
    quote: '"I told the boys: Look at the sky, God isn’t coming down to save us. We have to fight for each other. 130 in 20 overs is defensible if we field like tigers."',
    details: 'In a tournament plagued by torrential English rain, India remained undefeated. With this triumph at Edgbaston, Dhoni achieved the mythical feat: the FIRST AND ONLY CAPTAIN to win all three ICC limited-overs trophies (T20 World Cup, Cricket World Cup, Champions Trophy).',
  },
];

// Interactive 3D Golden Particle & Pedestal Canvas
function ThreeTrophyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Golden Pedestal Cylinder
    const pedestalGeo = new THREE.CylinderGeometry(2.5, 3.2, 0.6, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x221a08,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.5;
    scene.add(pedestal);

    // Glowing Rings
    const ringGeo = new THREE.TorusGeometry(2.8, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xD4AF66 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.2;
    scene.add(ring);

    // Golden Floating Particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xD4AF66,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const goldSpotLight = new THREE.SpotLight(0xD4AF66, 3, 20, Math.PI / 4, 0.5);
    goldSpotLight.position.set(0, 8, 4);
    scene.add(goldSpotLight);

    const blueRimLight = new THREE.PointLight(0x4466aa, 1.5, 10);
    blueRimLight.position.set(-4, -1, -3);
    scene.add(blueRimLight);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow rotation
      pedestal.rotation.y += 0.003;
      ring.rotation.z += 0.005;

      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.008;
        if (pos[i * 3 + 1] > 6) {
          pos[i * 3 + 1] = -2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function CaptainTrophiesSection() {
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyData | null>(null);

  const openStory = (trophy: TrophyData) => {
    soundManager.playSfx('trophy_reveal');
    setSelectedTrophy(trophy);
  };

  const closeStory = () => {
    soundManager.playSfx('nav_hover');
    setSelectedTrophy(null);
  };

  return (
    <section id="captain" className="relative min-h-screen bg-[#050505] py-28 px-6 md:px-12 overflow-hidden">
      {/* 3D Golden WebGL Canvas in Background */}
      <ThreeTrophyCanvas />

      {/* Dramatic Top Spotlight gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,102,0.18)_0%,transparent_75%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header with Split Text Reveal */}
        <div className="text-center space-y-3 mb-20">
          <div className="inline-flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-[0.35em]">
            <Trophy className="w-4 h-4 text-gold" />
            <span>THE ICC TRINITY</span>
          </div>

          <div className="flex flex-col items-center">
            <SplitTextReveal
              text="THREE TROPHIES."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white justify-center"
              delay={0.1}
            />
            <SplitTextReveal
              text="ONE LEGACY."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight gold-text-gradient justify-center"
              delay={0.3}
            />
          </div>

          <p className="font-editorial italic text-white/60 text-sm md:text-lg max-w-2xl mx-auto tracking-wide pt-2">
            The only captain in international cricket history to hold all three major ICC limited-overs trophies. Click any trophy to inspect the masterclass.
          </p>
        </div>

        {/* 3 Trophies Showcase Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {TROPHIES.map((trophy, index) => (
            <motion.div
              key={trophy.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.18 }}
              className="h-full"
            >
              <TiltCard className="h-full">
                <div
                  onClick={() => openStory(trophy)}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#111111]/90 to-[#080808]/90 p-8 flex flex-col justify-between h-[520px] transition-all duration-500 hover:border-gold/60 hover:shadow-[0_0_35px_rgba(212,175,102,0.2)]"
                  data-cursor-hover
                  data-cursor-text="INSPECT"
                >
                  {/* Golden corner badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-black text-gold/90 group-hover:text-gold transition-colors">
                      {trophy.year}
                    </span>
                    <span className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold bg-gold/5 group-hover:bg-gold group-hover:text-black transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </div>

                  {/* Center Trophy Visual Feature */}
                  <div className="relative w-full h-52 my-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,102,0.15)_0%,transparent_70%)] group-hover:scale-125 transition-transform duration-700" />
                    <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-gold/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={trophy.image}
                        alt={trophy.name}
                        fill
                        className="object-cover object-center filter brightness-[0.8] contrast-[1.1] group-hover:brightness-100 transition-all duration-500"
                        sizes="200px"
                      />
                    </div>
                  </div>

                  {/* Card Meta */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 block">
                      {trophy.tournament}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white group-hover:text-gold transition-colors">
                      {trophy.name}
                    </h3>
                    <p className="text-xs text-white/70 font-sans line-clamp-2">
                      {trophy.masterstroke}
                    </p>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gold tracking-widest">
                      <span>CLICK FOR MASTERCLASS</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Trophy Story Modal */}
      <AnimatePresence>
        {selectedTrophy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={closeStory}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#0d0d0d] border border-gold/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(212,175,102,0.25)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeStory}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-gold transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-gold font-mono text-xs uppercase tracking-[0.3em]">
                  <Trophy className="w-4 h-4" />
                  <span>{selectedTrophy.year} VICTORY CHRONICLE</span>
                </div>

                <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                  {selectedTrophy.name}
                </h3>

                <div className="bg-[#141414] rounded-xl p-4 border border-white/5 space-y-1 font-mono text-xs text-white/80">
                  <p><span className="text-gold font-bold">VENUE:</span> {selectedTrophy.venue}</p>
                  <p><span className="text-gold font-bold">SCORE:</span> {selectedTrophy.scorecard}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-display text-sm tracking-[0.25em] uppercase text-gold font-bold">
                    THE CAPTAIN’S MASTERSTROKE
                  </h4>
                  <p className="text-sm md:text-base text-white/90 leading-relaxed font-sans">
                    {selectedTrophy.masterstroke}
                  </p>
                </div>

                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans">
                  {selectedTrophy.details}
                </p>

                <blockquote className="font-editorial italic text-sm md:text-base text-gold/90 border-l-2 border-gold pl-4 py-1 bg-gold/5 rounded-r-lg">
                  {selectedTrophy.quote}
                </blockquote>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
