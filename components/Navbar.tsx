'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sliders } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface NavbarProps {
  onOpenAudioSettings?: () => void;
}

export default function Navbar({ onOpenAudioSettings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Initial sound state
    setSoundEnabled(soundManager.getSoundState().enabled);

    const unsub = soundManager.subscribe(() => {
      setSoundEnabled(soundManager.getSoundState().enabled);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const toggleSound = () => {
    soundManager.toggleMasterSound();
  };

  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'JOURNEY', href: '#journey' },
    { label: 'THE CAPTAIN', href: '#captain' },
    { label: '2011', href: '#moment-2011' },
    { label: 'MASHUPS', href: '#mashups' },
    { label: 'YELLOW LEGACY', href: '#yellow-legacy' },
    { label: 'BEYOND', href: '#beyond' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'SIGNATURE', href: '#signature' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundManager.playSfx('nav_hover');
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(href);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent py-7'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center space-x-2.5 select-none"
            data-cursor-hover
          >
            <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 group-hover:border-gold transition-colors">
              <span className="font-display font-bold text-xs text-gold">7</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl font-black tracking-[0.25em] gold-text-gradient group-hover:opacity-90">
                MAHI
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.35em] text-white/50 -mt-1 font-mono">
                THE LEGACY
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                onMouseEnter={() => soundManager.playSfx('nav_hover')}
                className="font-display text-[11px] tracking-[0.25em] uppercase text-white/70 hover:text-gold transition-colors relative py-1 group"
                data-cursor-hover
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </nav>

          {/* Right Controls: Sound Pill + Mobile Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Audio Toggle Pill */}
            <button
              onClick={toggleSound}
              className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border text-[11px] font-display tracking-widest uppercase transition-all duration-300 ${
                soundEnabled
                  ? 'border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,102,0.25)]'
                  : 'border-white/15 bg-white/5 text-white/60 hover:text-white hover:border-white/30'
              }`}
              data-cursor-hover
              data-cursor-text={soundEnabled ? 'MUTE' : 'UNMUTE'}
              title={soundEnabled ? 'Disable audio experience' : 'Enable cinematic sound experience'}
            >
              {soundEnabled ? (
                <>
                  <div className="flex items-end space-x-0.5 h-3">
                    <span className="w-0.5 bg-gold h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-gold h-2 animate-[pulse_1.1s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-gold h-3 animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-gold h-1.5 animate-[pulse_0.9s_ease-in-out_infinite]" />
                  </div>
                  <span>SOUND: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>SOUND: OFF</span>
                </>
              )}
            </button>

            {/* Audio fine tuning settings icon */}
            {onOpenAudioSettings && (
              <button
                onClick={() => {
                  soundManager.playSfx('nav_hover');
                  onOpenAudioSettings();
                }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/40 transition-colors"
                title="Audio Settings"
                data-cursor-hover
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                soundManager.playSfx('nav_hover');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:border-white/30"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col justify-center px-10 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="font-display text-2xl font-bold tracking-[0.2em] text-white/80 hover:text-gold transition-colors py-1"
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                  EXPERIENCE PREFERENCE
                </span>
                <button
                  onClick={toggleSound}
                  className="flex items-center space-x-3 text-gold text-sm font-display tracking-widest uppercase"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>SOUND {soundEnabled ? 'ENABLED' : 'MUTED'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
