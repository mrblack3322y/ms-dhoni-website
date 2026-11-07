'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { soundManager } from '@/lib/audio';
import { Calendar, Award, Sparkles, ChevronRight, ArrowDown } from 'lucide-react';
import { TiltCard, SplitTextReveal } from '@/components/CinematicTransition';

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: string;
  quote?: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '2004',
    title: 'INTERNATIONAL DEBUT',
    subtitle: 'THE LONG-HAIRED SENSATION FROM RANCHI',
    description:
      'From a ticket collector in Kharagpur with fiery long hair and sheer raw power, MS Dhoni broke onto the international stage against Bangladesh. Within months, his blistering 148 vs Pakistan at Vizag and a record-shattering 183* vs Sri Lanka in Jaipur redefined modern wicketkeeper-batsmanship.',
    image: '/assets/images/journey_2004_debut.jpg',
    stats: '183* RUNS — HIGHEST BY A WICKETKEEPER IN ODI HISTORY',
    quote: '"I have seen the God of cricket bat at number four. But I have seen MS Dhoni bat at number seven and win matches from nowhere."',
  },
  {
    year: '2007',
    title: 'T20 WORLD CUP CHAMPION',
    subtitle: 'THE BIRTH OF CAPTAIN COOL AT JOHANNESBURG',
    description:
      'Handed captaincy of a young, untested squad with legends opting out, Dhoni orchestrated a miracle in South Africa. From the historic bowl-out vs Pakistan to daringly tossing the final over to Joginder Sharma with Misbah-ul-Haq breathing down their necks, Dhoni made the world believe.',
    image: '/assets/images/journey_2007_t20_wc.jpg',
    stats: 'INDIA CROWNED FIRST-EVER ICC WORLD T20 CHAMPIONS',
    quote: '"I told Joginder: whatever happens, don’t worry about the result. Just bowl the ball you know."',
  },
  {
    year: '2011',
    title: 'ICC WORLD CUP CHAMPION',
    subtitle: '28 YEARS OF WAIT ENDS AT WANKHEDE',
    description:
      'Promoting himself ahead of in-form Yuvraj Singh in the high-stakes final against Sri Lanka at a roaring Wankhede Stadium, Dhoni struck an unbeaten 91*. The final helicopter stroke into the Mumbai night sky etched his name into eternal folklore.',
    image: '/assets/images/journey_2011_wc.jpg',
    stats: '91* OFF 79 BALLS — MAN OF THE MATCH IN WORLD CUP FINAL',
    quote: '"Dhoni finishes off in style. A magnificent strike into the crowd! India lift the World Cup after 28 years!" — Ravi Shastri',
  },
  {
    year: '2013',
    title: 'ICC CHAMPIONS TROPHY',
    subtitle: 'THE UNPARALLELED ICC TROPHY TRIFECTA',
    description:
      'In a rain-shortened 20-over shootout against hosts England at Edgbaston, Dhoni masterminded a 5-run defense from the jaws of defeat. With this victory, he became the FIRST AND ONLY CAPTAIN IN CRICKET HISTORY to win all three ICC white-ball trophies.',
    image: '/assets/images/icc_trophy_case.jpg',
    stats: 'ONLY CAPTAIN TO WIN T20 WC, ODI WC & CHAMPIONS TROPHY',
    quote: '"When Dhoni is at the crease, panic belongs to the opposition, never to him."',
  },
  {
    year: '2014',
    title: 'TEST RETIREMENT',
    subtitle: 'WALKING AWAY WITH QUIET DIGNITY AT MELBOURNE',
    description:
      'After 90 Test matches, leading India to the ICC Test Mace and the World No. 1 ranking for the first time in history, Dhoni quietly drew the curtains on his Test career after the Boxing Day Test at the Melbourne Cricket Ground, handing the mantle to Virat Kohli.',
    image: '/assets/images/journey_2014_test.jpg',
    stats: 'NO. 1 TEST TEAM IN THE WORLD • 4,876 RUNS • 294 DISMISSALS',
    quote: '"He didn’t ask for a farewell lap. He simply folded his gloves and let the game continue."',
  },
  {
    year: '2017',
    title: 'PASSING THE MANTLE',
    subtitle: 'THE ULTIMATE LEADER, MENTOR & STUMP MASTER',
    description:
      'Dhoni stepped down as captain of India’s limited-overs sides, seamlessly transitioning into senior mentor. Behind the stumps, his lightning 0.08-second stumpings and DRS masterclasses ("Dhoni Review System") remained unmatched on the global stage.',
    image: '/assets/images/dhoni_behind_stumps.jpg',
    stats: '0.08 SECONDS — FASTEST RECORDED STUMPING IN CRICKET',
    quote: '"If Dhoni says it is out, you might as well start walking to the pavilion."',
  },
  {
    year: '2020',
    title: 'THE IMMORTAL FAREWELL',
    subtitle: '1929 HOURS — "CONSIDER ME AS RETIRED"',
    description:
      'On India’s 74th Independence Day at 19:29 hours, with a humble video set to the tune of "Main Pal Do Pal Ka Shaayar Hoon", the legend bid goodbye to international cricket. A nation wept, cricket celebrated, and a boy from Ranchi became immortal.',
    image: '/assets/images/journey_2018_padma.jpg',
    stats: '15,000+ RUNS • 829 DISMISSALS • 332 MATCHES AS CAPTAIN',
    quote: '"Thanks a lot for ur love and support throughout. from 1929 hrs consider me as Retired."',
  },
];

export default function JourneySection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(4400);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Measure exact horizontal overflow distance so scrolling down lands right on 2020 and frees page
  useEffect(() => {
    const calculateDistance = () => {
      if (trackRef.current) {
        const fullTrackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Total travel so the last card aligns and finishes right at scroll end
        const dist = Math.max(0, fullTrackWidth - viewportWidth + 60);
        setScrollDistance(dist);
      }
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(calculateDistance);
      ro.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculateDistance);
      if (ro) ro.disconnect();
    };
  }, []);

  // Vertical scroll progress controls the horizontal translation
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Exactly map scroll down [0, 1] to horizontal translation [0, -scrollDistance]
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  // Track active milestone index as user scrolls down
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const idx = Math.min(
        MILESTONES.length - 1,
        Math.floor(latest * (MILESTONES.length + 0.3))
      );
      if (idx !== currentEventIdx) {
        setCurrentEventIdx(idx);
      }
      setIsFinished(latest >= 0.95);
    });
  }, [scrollYProgress, currentEventIdx]);

  // Click on a year scrubber pill scrolls smoothly to that milestone's vertical offset
  const scrollToMilestone = (idx: number) => {
    soundManager.playSfx('whoosh');
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionStart = rect.top + scrollTop;
    const sectionHeight = rect.height - window.innerHeight;
    const targetY = sectionStart + (idx / MILESTONES.length) * sectionHeight;
    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(targetY, { duration: 1 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const goToNextSection = () => {
    soundManager.playSfx('whoosh');
    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.scrollTo('#captain', { duration: 1.2 });
    } else {
      const target = document.querySelector('#captain');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="journey"
      className="relative bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505] text-white select-none border-t border-white/5"
    >
      {/* Calibrated 340vh container allows comfortable scrolling through all 7 events, then immediately frees the page to #captain */}
      <div ref={targetRef} className="relative h-[340vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden px-6 md:px-14 py-8 z-20">
          
          {/* Top Header */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-30">
            <div>
              <div className="flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-[0.3em] mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>CHRONICLES OF GLORY</span>
              </div>
              <SplitTextReveal
                text="EVERY LEGEND HAS A BEGINNING."
                className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight"
                delay={0.1}
              />
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2 justify-end">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                  EVENT 0{currentEventIdx + 1} OF 07
                </span>
                <span className={`w-2 h-2 rounded-full ${isFinished ? 'bg-green-400' : 'bg-gold'} animate-pulse`} />
              </div>
              <p className="font-display text-xs md:text-sm text-gold tracking-widest mt-0.5">
                {isFinished ? 'JOURNEY COMPLETE • SCROLL DOWN FOR THE CAPTAIN' : 'SCROLL DOWN TO ADVANCE TIMELINE'}
              </p>
            </div>
          </div>

          {/* Interactive Year Scrubber Pills */}
          <div className="max-w-7xl mx-auto w-full z-30 my-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 overflow-x-auto gap-2 no-scrollbar">
              {MILESTONES.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => scrollToMilestone(idx)}
                  className={`flex flex-col items-center flex-1 min-w-[70px] py-1 transition-all ${
                    currentEventIdx === idx
                      ? 'text-gold scale-105'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                  data-cursor-hover
                  data-cursor-text={m.year}
                >
                  <span className={`font-display text-xs md:text-sm font-bold tracking-widest ${currentEventIdx === idx ? 'gold-text-gradient font-black' : ''}`}>
                    {m.year}
                  </span>
                  <div className={`h-[2px] w-full mt-1.5 transition-all duration-300 rounded-full ${currentEventIdx === idx ? 'bg-gold shadow-[0_0_10px_#D4AF66]' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Track driven by Vertical Scroll Down */}
          <div className="relative w-full overflow-hidden flex-1 flex items-center z-20 my-auto min-h-[460px]">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex space-x-8 md:space-x-12 items-center w-max pl-4 pr-12 will-change-transform"
            >
              {MILESTONES.map((item, idx) => (
                <div
                  key={item.year}
                  className="w-[84vw] max-w-[740px] h-[460px] md:h-[480px] flex-shrink-0"
                >
                  <TiltCard className="w-full h-full">
                    <div
                      onMouseEnter={() => soundManager.playSfx('nav_hover')}
                      className={`relative w-full h-full rounded-3xl overflow-hidden border bg-[#0d0d0d] shadow-2xl flex flex-col md:flex-row justify-between transition-all duration-500 ${
                        currentEventIdx === idx
                          ? 'border-gold/60 shadow-[0_0_35px_rgba(212,175,102,0.15)]'
                          : 'border-white/10'
                      }`}
                      data-cursor-hover
                      data-cursor-text={item.year}
                    >
                      {/* Left Photography Section */}
                      <div className="relative w-full md:w-1/2 h-48 md:h-full flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-center filter brightness-[0.6] contrast-[1.15]"
                          sizes="700px"
                          priority={idx < 2}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#0d0d0d]/40 to-[#0d0d0d]" />

                        {/* Large Watermark Year */}
                        <div className="absolute top-4 left-6 font-display text-5xl md:text-7xl font-black text-white/10 select-none pointer-events-none">
                          {item.year}
                        </div>
                      </div>

                      {/* Right Details Section */}
                      <div className="relative z-10 p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="font-display text-3xl md:text-4xl font-black text-gold tracking-widest">
                              {item.year}
                            </span>
                            <span className="px-3 py-0.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] font-mono tracking-widest uppercase">
                              PHASE 0{idx + 1}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/50 block">
                              {item.subtitle}
                            </span>
                            <h3 className="font-display text-lg md:text-2xl font-black uppercase tracking-wide text-white">
                              {item.title}
                            </h3>
                            <p className="text-xs md:text-sm text-white/75 leading-relaxed font-sans line-clamp-4">
                              {item.description}
                            </p>

                            {item.quote && (
                              <blockquote className="font-editorial italic text-xs text-gold/85 border-l-2 border-gold pl-3 py-1 bg-gold/5 rounded-r-md mt-2">
                                {item.quote}
                              </blockquote>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gold tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Award className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                            <span className="text-[10px] md:text-[11px] text-white/80 truncate">{item.stats}</span>
                          </div>
                          {idx === MILESTONES.length - 1 && (
                            <button
                              onClick={goToNextSection}
                              className="px-3 py-1 rounded-full bg-gold text-black font-display text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(212,175,102,0.4)]"
                            >
                              <span>NEXT CHAPTER</span>
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              ))}

              {/* End of Journey Release Banner */}
              <div className="w-[340px] h-[460px] md:h-[480px] rounded-3xl border border-gold/40 bg-gradient-to-b from-[#14120a] to-[#0a0a0a] p-8 flex flex-col justify-between flex-shrink-0 shadow-2xl">
                <div>
                  <span className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] block mb-2">
                    CHAPTER COMPLETED
                  </span>
                  <h4 className="font-display text-2xl font-black uppercase text-white">
                    THREE TROPHIES.<br />
                    <span className="gold-text-gradient">ONE LEGACY.</span>
                  </h4>
                  <p className="text-xs text-white/70 mt-3 leading-relaxed">
                    You have experienced the 2004–2020 timeline. Continue scrolling down to enter the 3D ICC Trophy Showcase.
                  </p>
                </div>

                <button
                  onClick={goToNextSection}
                  className="w-full py-3.5 rounded-2xl bg-gold text-black font-display text-xs font-bold tracking-widest uppercase hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,102,0.3)]"
                  data-cursor-hover
                  data-cursor-text="CAPTAIN"
                >
                  <span>ENTER THE CAPTAIN</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Completion Progress Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-white/40 z-30 pt-3">
            <span className="text-gold font-bold">2004 DEBUT</span>
            <div className="flex-1 mx-6 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-y-0 left-0 bg-gold w-full origin-left"
              />
            </div>
            <button
              onClick={goToNextSection}
              className="text-gold hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider"
            >
              <span>{isFinished ? 'PROCEED TO NEXT SECTION' : '2020 FAREWELL'}</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
