'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import JourneySection from '@/components/JourneySection';
import CaptainTrophiesSection from '@/components/CaptainTrophiesSection';
import Moment2011Section from '@/components/Moment2011Section';
import CinematicVideoMashup from '@/components/CinematicVideoMashup';
import YellowLegacySection from '@/components/YellowLegacySection';
import BeyondTheGameSection from '@/components/BeyondTheGameSection';
import GallerySection from '@/components/GallerySection';
import LastWalkSection from '@/components/LastWalkSection';
import Footer from '@/components/Footer';
import AudioModal from '@/components/AudioModal';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);

  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-[#050505] text-white selection:bg-gold selection:text-black overflow-x-clip">
        {/* Film grain layer */}
        <div className="film-grain" />

        {/* Custom magnetic interactive cursor */}
        <CustomCursor />

        {/* Cinematic Preloader */}
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

        {/* Main interactive application content */}
        <div className={`transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <Navbar onOpenAudioSettings={() => setAudioSettingsOpen(true)} />
          
          <HeroSection />
          
          <JourneySection />
          
          <CaptainTrophiesSection />
          
          <Moment2011Section />
          
          <CinematicVideoMashup />
          
          <YellowLegacySection />
          
          <BeyondTheGameSection />
          
          <GallerySection />
          
          <LastWalkSection />
          
          <Footer />

          <AudioModal
            isOpen={audioSettingsOpen}
            onClose={() => setAudioSettingsOpen(false)}
          />
        </div>
      </main>
    </SmoothScroll>
  );
}
