'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Sparkles, Filter } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { TiltCard, SplitTextReveal, AnamorphicDivider } from '@/components/CinematicTransition';

type Category = 'ALL' | 'INTERNATIONAL' | 'WORLD CUP' | 'CSK' | 'OFF FIELD';

interface GalleryItem {
  id: string;
  title: string;
  category: Category;
  year: string;
  src: string;
  caption: string;
  impact: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'THE CAPTAIN IN BLUES',
    category: 'INTERNATIONAL',
    year: '2016',
    src: '/assets/images/dhoni_hero_portrait.jpg',
    caption: 'Official portrait of Indian captain Mahendra Singh Dhoni in the iconic Nike Team India kit.',
    impact: 'Led India across 332 international matches, the most by any cricket captain in history.',
  },
  {
    id: 'g2',
    title: 'THE WANKHEDE ROAR',
    category: 'WORLD CUP',
    year: '2011',
    src: '/assets/images/wankhede_2011_final.jpg',
    caption: 'The view from Marine Drive towards the electrified Wankhede Stadium as fireworks erupt.',
    impact: 'Ended a 28-year drought for India, becoming the first host nation to win the Cricket World Cup.',
  },
  {
    id: 'g3',
    title: 'THE CHEPAUK YELLOW SEA',
    category: 'CSK',
    year: '2023',
    src: '/assets/images/csk_chepauk_night.jpg',
    caption: 'MA Chidambaram Stadium glowing in intense yellow floodlights for a Chennai Super Kings clash.',
    impact: 'Chepauk holds the undisputed world record for stadium crowd decibels (128+ dB) upon Dhoni’s entry.',
  },
  {
    id: 'g4',
    title: 'LIGHTNING BEHIND THE STUMPS',
    category: 'INTERNATIONAL',
    year: '2015',
    src: '/assets/images/dhoni_behind_stumps.jpg',
    caption: 'Dhoni in his trademark crouch behind the wickets, anticipating the batsman’s foot movement.',
    impact: 'Recorded 0.08-second stumpings and holds the world record for 195 international stumpings.',
  },
  {
    id: 'g5',
    title: 'THE ICC WORLD CUP TROPHY',
    category: 'WORLD CUP',
    year: '2011',
    src: '/assets/images/cwc_trophy.jpg',
    caption: 'The glittering golden globe of the ICC Cricket World Cup trophy.',
    impact: 'Dhoni hit the winning six to secure the cup and was named Player of the Match in the final.',
  },
  {
    id: 'g6',
    title: 'PADMA BHUSHAN INVESTITURE',
    category: 'OFF FIELD',
    year: '2018',
    src: '/assets/images/journey_2018_padma.jpg',
    caption: 'Honorary Lt. Colonel MS Dhoni marching in full military dress at Rashtrapati Bhavan to receive the Padma Bhushan from President Ram Nath Kovind.',
    impact: 'Conferred India’s third-highest civilian honor exactly 7 years to the day after the 2011 World Cup victory.',
  },
  {
    id: 'g7',
    title: 'PRIME MINISTERIAL HONORS',
    category: 'INTERNATIONAL',
    year: '2007',
    src: '/assets/images/journey_2007_t20_wc.jpg',
    caption: 'Young captain Dhoni with Prime Minister Dr. Manmohan Singh presenting the first T20 World Cup trophy in New Delhi.',
    impact: 'Sparked the global revolution of Twenty20 cricket and led to the creation of the Indian Premier League.',
  },
  {
    id: 'g8',
    title: 'PRESIDENTIAL RECEPTION',
    category: 'WORLD CUP',
    year: '2011',
    src: '/assets/images/journey_2011_wc.jpg',
    caption: 'President Pratibha Patil greeting captain MS Dhoni at Maharashtra Raj Bhavan the morning after the 2011 victory.',
    impact: 'A historic morning when the entire subcontinent awoke as world champions.',
  },
  {
    id: 'g9',
    title: 'MATCH WEAPONS & WILLOW',
    category: 'OFF FIELD',
    year: '2011',
    src: '/assets/images/dhoni_bat_kit.jpg',
    caption: 'Dhoni’s actual match-used wicketkeeping kit, helmet, and bat preserved at Blades of Glory Cricket Museum in Pune.',
    impact: 'The bat used to strike the iconic winning six in the 2011 final was auctioned for £100,000 for charity.',
  },
];

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories: Category[] = ['ALL', 'INTERNATIONAL', 'WORLD CUP', 'CSK', 'OFF FIELD'];

  const filteredItems = selectedCategory === 'ALL'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleCategoryChange = (cat: Category) => {
    soundManager.playSfx('nav_hover');
    setSelectedCategory(cat);
  };

  const openLightbox = (item: GalleryItem) => {
    soundManager.playSfx('nav_hover');
    setActivePhoto(item);
  };

  const closeLightbox = () => {
    soundManager.playSfx('nav_hover');
    setActivePhoto(null);
  };

  return (
    <section id="gallery" className="relative min-h-screen bg-[#050505] text-white py-28 px-6 md:px-12 overflow-hidden border-t border-white/5">
      <AnamorphicDivider color="#D4AF66" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-gold font-mono text-xs uppercase tracking-[0.35em] block">
            VISUAL ARCHIVE
          </span>
          <div className="flex flex-col items-center">
            <SplitTextReveal
              text="INTERACTIVE"
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight justify-center"
              delay={0.1}
            />
            <SplitTextReveal
              text="GALLERY."
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight gold-text-gradient justify-center"
              delay={0.3}
            />
          </div>
          <p className="font-editorial italic text-white/60 text-sm md:text-base max-w-xl mx-auto tracking-wide pt-2">
            High-resolution visual retrospective spanning two decades of Indian cricket history.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full font-display text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                selectedCategory === cat
                  ? 'border border-gold bg-gold text-[#050505] font-bold shadow-[0_0_20px_rgba(212,175,102,0.35)]'
                  : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
              }`}
              data-cursor-hover
              data-cursor-text={cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid with 3D Tilt Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <TiltCard>
                  <div
                    onClick={() => openLightbox(item)}
                    className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e0e] cursor-pointer shadow-lg hover:border-gold/50 transition-all duration-500"
                    data-cursor-hover
                    data-cursor-text="EXPAND"
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover object-center filter brightness-[0.75] contrast-[1.1] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700 ease-out"
                      sizes="400px"
                    />

                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full border border-gold/40 bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-widest text-gold uppercase">
                        {item.year}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-widest text-white/70 uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom Meta */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/70 font-sans line-clamp-1">
                        {item.caption}
                      </p>
                    </div>

                    {/* Expand Hover Icon */}
                    <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 group-hover:text-gold group-hover:border-gold transition-colors">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-gold transition-colors z-50 bg-black/50"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-8 bg-[#0a0a0a] border border-white/15 rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl"
            >
              {/* Full Image */}
              <div className="relative w-full lg:w-3/5 h-[450px] md:h-[540px] rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  fill
                  className="object-cover object-center"
                  sizes="800px"
                  priority
                />
              </div>

              {/* Lightbox Metadata */}
              <div className="w-full lg:w-2/5 space-y-5">
                <div className="flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-[0.3em]">
                  <Sparkles className="w-4 h-4" />
                  <span>{activePhoto.year} • {activePhoto.category}</span>
                </div>

                <h3 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                  {activePhoto.title}
                </h3>

                <p className="text-sm text-white/85 leading-relaxed font-sans">
                  {activePhoto.caption}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-gold font-bold block">
                    HISTORICAL IMPACT
                  </span>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {activePhoto.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
