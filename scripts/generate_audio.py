import wave
import struct
import math
import random
import os

SAMPLE_RATE = 44100

def write_wav(filename, samples, sample_rate=SAMPLE_RATE):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(2)  # Stereo
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        raw_data = bytearray()
        for left, right in samples:
            # clamp to [-1.0, 1.0]
            left = max(-1.0, min(1.0, left))
            right = max(-1.0, min(1.0, right))
            i_left = int(left * 32767.0)
            i_right = int(right * 32767.0)
            raw_data.extend(struct.pack('<hh', i_left, i_right))
        wav_file.writeframes(raw_data)
    print(f"Generated: {filename} ({len(samples)/sample_rate:.2f}s)")

# 1. Cinematic Ambient Loop (16s seamless loop)
def generate_cinematic_theme(duration=16.0):
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    # D minor chords: D2 (73.4), A2 (110.0), D3 (146.8), F3 (174.6), A3 (220.0), C4 (261.6)
    freqs = [73.416, 110.00, 146.83, 174.61, 220.00, 261.63, 349.23]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Loop envelope for seamless looping
        loop_phase = (2 * math.pi * t) / duration
        # Breathing modulation
        mod = 0.75 + 0.25 * math.sin(loop_phase * 2)
        
        # Bass pulse (heartbeat-like, every 2 seconds)
        beat_phase = (t % 2.0)
        pulse = math.exp(-beat_phase * 3.5) * math.sin(2 * math.pi * 55.0 * t) if beat_phase < 0.6 else 0
        
        left_acc = pulse * 0.35
        right_acc = pulse * 0.35
        
        for idx, f in enumerate(freqs):
            detune_l = f * (1.0 + 0.002 * math.sin(0.4 * t + idx))
            detune_r = f * (1.0 - 0.002 * math.cos(0.4 * t + idx))
            sub_amp = 0.25 / (idx + 1)
            # Add harmonic warmth
            val_l = math.sin(2 * math.pi * detune_l * t) + 0.3 * math.sin(4 * math.pi * detune_l * t)
            val_r = math.sin(2 * math.pi * detune_r * t) + 0.3 * math.sin(4 * math.pi * detune_r * t)
            
            left_acc += val_l * sub_amp * mod
            right_acc += val_r * sub_amp * mod
            
        # Subtle analog tape air / warm noise
        noise = (random.random() * 2.0 - 1.0) * 0.008
        left_acc += noise
        right_acc += noise
        
        # Soft master limiter
        samples.append((left_acc * 0.45, right_acc * 0.45))
        
    return samples

# 2. Stadium Crowd Ambience (12s seamless loop)
def generate_stadium_crowd(duration=12.0):
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Filter state
    prev_l = 0.0
    prev_r = 0.0
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        loop_phase = (2 * math.pi * t) / duration
        # Waves of crowd cheer
        crowd_swell = 0.6 + 0.4 * (0.5 * math.sin(loop_phase) + 0.3 * math.sin(loop_phase * 3) + 0.2 * math.cos(loop_phase * 2))
        
        # Multi-layered bandpass noise (stadium roar)
        raw_nl = random.random() * 2.0 - 1.0
        raw_nr = random.random() * 2.0 - 1.0
        
        # Low pass filter for crowd rumble
        prev_l = prev_l * 0.92 + raw_nl * 0.08
        prev_r = prev_r * 0.92 + raw_nr * 0.08
        
        # Distant horn / chant resonance at 440Hz and 660Hz
        horn = (math.sin(2 * math.pi * 320 * t) * 0.03 + math.sin(2 * math.pi * 480 * t) * 0.02) * (0.5 + 0.5 * math.sin(loop_phase * 4))
        
        out_l = (prev_l * 2.2 + horn) * crowd_swell * 0.35
        out_r = (prev_r * 2.2 + horn) * crowd_swell * 0.35
        samples.append((out_l, out_r))
        
    return samples

# 3. Bat Impact Sound (0.8s) - Legendary willow strike
def generate_bat_impact():
    duration = 0.9
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Transient attack
        transient = math.exp(-t * 90.0)
        # Resonant wooden frequencies: 1250Hz, 680Hz, 280Hz
        wood1 = math.sin(2 * math.pi * 1280.0 * t) * math.exp(-t * 35.0)
        wood2 = math.sin(2 * math.pi * 640.0 * t) * math.exp(-t * 22.0)
        thump = math.sin(2 * math.pi * 140.0 * t) * math.exp(-t * 14.0)
        sub = math.sin(2 * math.pi * 65.0 * t) * math.exp(-t * 8.0)
        
        # Ball pop friction noise
        noise = (random.random() * 2.0 - 1.0) * math.exp(-t * 120.0) * 0.8
        
        # Reverb tail
        reverb = (random.random() * 2.0 - 1.0) * 0.08 * math.exp(-t * 3.5) if t > 0.03 else 0
        
        strike = (transient * 0.7 + wood1 * 0.4 + wood2 * 0.3 + thump * 0.5 + sub * 0.4 + noise + reverb) * 0.85
        samples.append((strike, strike))
        
    return samples

# 4. Trophy Reveal Sound (2.2s shimmering golden chord)
def generate_trophy_reveal():
    duration = 2.4
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    # Golden chord: D major 9 (D4, F#4, A4, C#5, E5)
    chord = [293.66, 369.99, 440.00, 554.37, 659.25, 880.00]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 1.8) * (1.0 - math.exp(-t * 40.0))
        acc_l = 0.0
        acc_r = 0.0
        
        for idx, freq in enumerate(chord):
            # Arpeggiated entry
            st = max(0.0, t - idx * 0.04)
            note_env = math.exp(-st * 2.2) * (1.0 - math.exp(-st * 50.0)) if t >= idx * 0.04 else 0
            pan = (idx / (len(chord) - 1)) * 0.6 - 0.3
            val = math.sin(2 * math.pi * freq * t) + 0.35 * math.sin(4 * math.pi * freq * t)
            acc_l += val * note_env * (0.5 - pan)
            acc_r += val * note_env * (0.5 + pan)
            
        # Shimmer sparkle
        sparkle = math.sin(2 * math.pi * 1760.0 * (1 + 0.02 * math.sin(30 * t)) * t) * math.exp(-t * 2.0) * 0.15
        out_l = (acc_l * 0.3 + sparkle) * 0.7
        out_r = (acc_r * 0.3 + sparkle) * 0.7
        samples.append((out_l, out_r))
        
    return samples

# 5. UI Nav Click / Hover
def generate_nav_hover():
    duration = 0.08
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 60.0)
        val = math.sin(2 * math.pi * 880.0 * (1.0 - t * 5.0) * t) * env * 0.3
        samples.append((val, val))
    return samples

# 6. Chepauk Whistle
def generate_chepauk_whistle():
    duration = 1.4
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Whistle chirp: rising frequency 2200Hz to 3100Hz with vibrato
        vib = math.sin(2 * math.pi * 8.0 * t) * 60.0
        freq = 2100.0 + (t / duration) * 900.0 + vib
        env = math.sin(math.pi * (t / duration)) ** 0.8
        val = math.sin(2 * math.pi * freq * t) * env * 0.35
        # Add slight breathiness
        breath = (random.random() * 2.0 - 1.0) * env * 0.06
        samples.append((val + breath, val + breath))
    return samples

# 7. Deep Sub-Bass Braam
def generate_bass_braam():
    duration = 2.8
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 1.2) * (1.0 - math.exp(-t * 50.0))
        pitch_drop = 48.0 * (1.0 / (1.0 + t * 0.8))
        f_sub = max(28.0, pitch_drop)
        sub = math.sin(2 * math.pi * f_sub * t)
        distortion = math.tanh(sub * 2.5) * 0.7
        val = distortion * env * 0.65
        samples.append((val, val))
    return samples

if __name__ == '__main__':
    base_dir = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\audio"
    write_wav(os.path.join(base_dir, "cinematic_theme.wav"), generate_cinematic_theme())
    write_wav(os.path.join(base_dir, "stadium_crowd.wav"), generate_stadium_crowd())
    write_wav(os.path.join(base_dir, "bat_impact.wav"), generate_bat_impact())
    write_wav(os.path.join(base_dir, "trophy_reveal.wav"), generate_trophy_reveal())
    write_wav(os.path.join(base_dir, "nav_hover.wav"), generate_nav_hover())
    write_wav(os.path.join(base_dir, "chepauk_whistle.wav"), generate_chepauk_whistle())
    write_wav(os.path.join(base_dir, "bass_braam.wav"), generate_bass_braam())
    print("All audio assets generated successfully!")
