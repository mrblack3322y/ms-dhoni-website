import { Howl, Howler } from 'howler';

export type SoundType = 
  | 'bat_impact' 
  | 'whoosh' 
  | 'trophy_reveal' 
  | 'nav_hover' 
  | 'chepauk_whistle' 
  | 'csk_whistle_anthem'
  | 'dhoni_finishes_style'
  | 'dhoni_finishes_style_full'
  | 'bass_braam' 
  | 'bass_impact';

class SoundManager {
  private static instance: SoundManager;
  private musicHowl: Howl | null = null;
  private crowdHowl: Howl | null = null;
  private soundEffects: Map<SoundType, Howl> = new Map();
  
  private isSoundEnabled: boolean = false;
  private musicVolume: number = 0.45;
  private sfxVolume: number = 0.75;
  private isMusicMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private initialized: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('mahi_sound_enabled');
      this.isSoundEnabled = savedPreference === 'true';
      const savedMusicVol = localStorage.getItem('mahi_music_vol');
      if (savedMusicVol) this.musicVolume = parseFloat(savedMusicVol);
      const savedSfxVol = localStorage.getItem('mahi_sfx_vol');
      if (savedSfxVol) this.sfxVolume = parseFloat(savedSfxVol);
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Background cinematic music loop
    this.musicHowl = new Howl({
      src: ['/assets/audio/cinematic_theme.wav'],
      loop: true,
      volume: this.musicVolume,
      html5: true, // streams nicely
      preload: true,
    });

    // Stadium crowd ambience loop
    this.crowdHowl = new Howl({
      src: ['/assets/audio/stadium_crowd.wav'],
      loop: true,
      volume: this.musicVolume * 0.5,
      html5: true,
      preload: true,
    });

    // SFX map
    const sfxList: { type: SoundType; src: string; vol: number }[] = [
      { type: 'bat_impact', src: '/assets/audio/bat_impact.wav', vol: 0.9 },
      { type: 'whoosh', src: '/assets/audio/whoosh.wav', vol: 0.6 },
      { type: 'trophy_reveal', src: '/assets/audio/trophy_reveal.wav', vol: 0.75 },
      { type: 'nav_hover', src: '/assets/audio/nav_hover.wav', vol: 0.25 },
      { type: 'chepauk_whistle', src: '/assets/audio/chepauk_whistle.wav', vol: 0.95 },
      { type: 'csk_whistle_anthem', src: '/assets/audio/csk_whistle_anthem.wav', vol: 0.95 },
      { type: 'dhoni_finishes_style', src: '/assets/audio/dhoni_finishes_style.wav', vol: 1.0 },
      { type: 'dhoni_finishes_style_full', src: '/assets/audio/dhoni_finishes_style_full.wav', vol: 1.0 },
      { type: 'bass_braam', src: '/assets/audio/bass_braam.wav', vol: 0.85 },
      { type: 'bass_impact', src: '/assets/audio/bass_impact.wav', vol: 0.8 },
    ];

    sfxList.forEach(item => {
      this.soundEffects.set(
        item.type,
        new Howl({
          src: [item.src],
          volume: item.vol * this.sfxVolume,
          preload: true,
        })
      );
    });

    // If user previously opted in, they can resume on first click
    if (this.isSoundEnabled) {
      this.playBackgroundMusic();
    }
  }

  public toggleMasterSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahi_sound_enabled', String(this.isSoundEnabled));
    }

    if (!this.initialized) {
      this.init();
    }

    if (this.isSoundEnabled) {
      Howler.mute(false);
      this.playBackgroundMusic();
      this.playSfx('nav_hover');
    } else {
      this.stopBackgroundMusic();
      Howler.mute(true);
    }

    this.notify();
    return this.isSoundEnabled;
  }

  public playBackgroundMusic() {
    if (!this.isSoundEnabled || this.isMusicMuted) return;
    if (!this.musicHowl) this.init();

    if (this.musicHowl && !this.musicHowl.playing()) {
      this.musicHowl.fade(0, this.musicVolume, 1500);
      this.musicHowl.play();
    }
    if (this.crowdHowl && !this.crowdHowl.playing()) {
      this.crowdHowl.fade(0, this.musicVolume * 0.4, 2000);
      this.crowdHowl.play();
    }
  }

  public stopBackgroundMusic() {
    if (this.musicHowl && this.musicHowl.playing()) {
      this.musicHowl.fade(this.musicVolume, 0, 1000);
      setTimeout(() => this.musicHowl?.stop(), 1000);
    }
    if (this.crowdHowl && this.crowdHowl.playing()) {
      this.crowdHowl.fade(this.musicVolume * 0.4, 0, 1000);
      setTimeout(() => this.crowdHowl?.stop(), 1000);
    }
  }

  public pauseMusic() {
    if (this.musicHowl && this.musicHowl.playing()) {
      this.musicHowl.pause();
    }
    if (this.crowdHowl && this.crowdHowl.playing()) {
      this.crowdHowl.pause();
    }
  }

  public resumeMusic() {
    if (this.isSoundEnabled && !this.isMusicMuted) {
      if (this.musicHowl && !this.musicHowl.playing()) {
        this.musicHowl.play();
      }
      if (this.crowdHowl && !this.crowdHowl.playing()) {
        this.crowdHowl.play();
      }
    }
  }

  public duckMusicFor(ms: number) {
    if (this.musicHowl && this.musicHowl.playing()) {
      this.musicHowl.fade(this.musicVolume, this.musicVolume * 0.15, 300);
      setTimeout(() => {
        if (this.musicHowl && this.musicHowl.playing()) {
          this.musicHowl.fade(this.musicVolume * 0.15, this.musicVolume, 800);
        }
      }, ms);
    }
  }

  public playSfx(type: SoundType, forcePlay: boolean = false) {
    if ((!this.isSoundEnabled && !forcePlay) || this.isSfxMuted) {
      if (forcePlay) {
        this.isSoundEnabled = true;
        Howler.mute(false);
      } else {
        return;
      }
    }
    if (!this.initialized) this.init();

    const sfx = this.soundEffects.get(type);
    if (sfx) {
      if (type === 'dhoni_finishes_style' || type === 'dhoni_finishes_style_full') {
        const dur = type === 'dhoni_finishes_style' ? 5600 : 10000;
        this.duckMusicFor(dur);
      }
      sfx.play();
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahi_music_vol', String(this.musicVolume));
    }
    if (this.musicHowl) {
      this.musicHowl.volume(this.musicVolume);
    }
    if (this.crowdHowl) {
      this.crowdHowl.volume(this.musicVolume * 0.4);
    }
    this.notify();
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahi_sfx_vol', String(this.sfxVolume));
    }
    this.soundEffects.forEach(howl => {
      howl.volume(this.sfxVolume);
    });
    this.notify();
  }

  public toggleMusicMute() {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.isMusicMuted) {
      this.stopBackgroundMusic();
    } else if (this.isSoundEnabled) {
      this.playBackgroundMusic();
    }
    this.notify();
  }

  public toggleSfxMute() {
    this.isSfxMuted = !this.isSfxMuted;
    this.notify();
  }

  public getSoundState() {
    return {
      enabled: this.isSoundEnabled,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      musicMuted: this.isMusicMuted,
      sfxMuted: this.isSfxMuted,
    };
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }
}

export const soundManager = SoundManager.getInstance();
