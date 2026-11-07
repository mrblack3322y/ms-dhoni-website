import os
import cv2
import numpy as np
import imageio_ffmpeg
import subprocess
from PIL import Image, ImageEnhance, ImageFilter

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
IMAGES_DIR = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images"
VIDEOS_DIR = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\videos"
os.makedirs(VIDEOS_DIR, exist_ok=True)

WIDTH, HEIGHT = 1280, 720
FPS = 30

def create_cinematic_video(image_path, output_mp4, duration_sec=6.0, effect_type="hero"):
    if not os.path.exists(image_path):
        print(f"Source image not found: {image_path}")
        return
        
    img = Image.open(image_path).convert("RGB")
    
    # Crop to 16:9 aspect ratio
    target_ratio = WIDTH / HEIGHT
    img_ratio = img.width / img.height
    if img_ratio > target_ratio:
        new_w = int(img.height * target_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        new_h = int(img.width / target_ratio)
        top = (img.height - new_h) // 2
        img = img.crop((0, top, img.width, top + new_h))
        
    base_w, base_h = int(WIDTH * 1.15), int(HEIGHT * 1.15)
    img = img.resize((base_w, base_h), Image.Resampling.LANCZOS)
    
    # Cinematic color grade
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.22)
    enhancer = ImageEnhance.Color(img)
    if effect_type == "csk":
        img = enhancer.enhance(1.35)
    else:
        img = enhancer.enhance(0.92)  # subtle desaturation for moody documentary look
        
    base_np = np.array(img)
    total_frames = int(duration_sec * FPS)
    
    # Particle generator
    num_particles = 65
    particles = []
    for _ in range(num_particles):
        particles.append({
            'x': np.random.uniform(0, WIDTH),
            'y': np.random.uniform(0, HEIGHT),
            'vx': np.random.uniform(-0.4, 0.4),
            'vy': np.random.uniform(-0.8, -0.2),
            'size': np.random.uniform(1.5, 4.5),
            'alpha': np.random.uniform(0.3, 0.85),
            'color': (212, 175, 102) if effect_type != "csk" else (253, 185, 19)
        })
        
    temp_raw = output_mp4.replace(".mp4", "_temp.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_raw, fourcc, FPS, (WIDTH, HEIGHT))
    
    # Pre-render vignette mask
    X = cv2.getGaussianKernel(WIDTH, WIDTH * 0.45)
    Y = cv2.getGaussianKernel(HEIGHT, HEIGHT * 0.45)
    vignette = (Y * X.T) / (Y * X.T).max()
    vignette = np.dstack([vignette ** 0.55] * 3)
    
    print(f"Rendering {output_mp4} ({total_frames} frames)...")
    
    for f in range(total_frames):
        t = f / total_frames
        # Smooth ease in-out zoom
        # Ping-pong loop
        loop_t = 0.5 - 0.5 * np.cos(2 * np.pi * t)
        scale = 1.0 + 0.08 * loop_t
        
        cur_w = int(WIDTH * scale)
        cur_h = int(HEIGHT * scale)
        
        # Center crop from base
        x1 = (base_w - cur_w) // 2
        y1 = (base_h - cur_h) // 2
        # Slight camera drift
        drift_x = int(np.sin(2 * np.pi * t) * 12.0)
        drift_y = int(np.cos(2 * np.pi * t) * 6.0)
        x1 = max(0, min(base_w - cur_w, x1 + drift_x))
        y1 = max(0, min(base_h - cur_h, y1 + drift_y))
        
        frame = base_np[y1:y1+cur_h, x1:x1+cur_w]
        frame = cv2.resize(frame, (WIDTH, HEIGHT), interpolation=cv2.INTER_LINEAR)
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        
        # Apply vignette
        frame_bgr = np.clip(frame_bgr.astype(np.float32) * vignette, 0, 255).astype(np.uint8)
        
        # Draw floating golden bokeh/particles
        particle_layer = np.zeros_like(frame_bgr)
        for p in particles:
            p['x'] = (p['x'] + p['vx']) % WIDTH
            p['y'] = (p['y'] + p['vy']) % HEIGHT
            
            # Particle flicker
            flicker = 0.7 + 0.3 * np.sin(t * 15.0 + p['x'])
            b, g, r = p['color'][2], p['color'][1], p['color'][0]
            radius = int(p['size'])
            cv2.circle(particle_layer, (int(p['x']), int(p['y'])), radius, (b, g, r), -1)
            # Soft glow
            if radius > 2:
                cv2.circle(particle_layer, (int(p['x']), int(p['y'])), radius * 2, (int(b*0.3), int(g*0.3), int(r*0.3)), -1)
                
        # Additive blend particles
        frame_bgr = cv2.add(frame_bgr, particle_layer)
        
        # Effect specific overlays
        if effect_type == "hero":
            # Subtle top-down floodlight beam
            beam_alpha = 0.15 + 0.05 * np.sin(t * 4 * np.pi)
            beam = np.zeros_like(frame_bgr, dtype=np.float32)
            cv2.line(beam, (WIDTH//2 - 100, 0), (WIDTH//2 + 300, HEIGHT), (200, 220, 255), 180)
            beam = cv2.GaussianBlur(beam, (121, 121), 0)
            frame_bgr = np.clip(frame_bgr.astype(np.float32) + beam * beam_alpha, 0, 255).astype(np.uint8)
            
        elif effect_type == "csk":
            # Yellow stadium floodlight glow
            yellow_glow = np.zeros_like(frame_bgr, dtype=np.float32)
            cv2.circle(yellow_glow, (WIDTH//2, -50), 600, (19, 185, 253), -1)
            yellow_glow = cv2.GaussianBlur(yellow_glow, (151, 151), 0)
            pulse = 0.18 + 0.08 * np.sin(t * 6 * np.pi)
            frame_bgr = np.clip(frame_bgr.astype(np.float32) + yellow_glow * pulse, 0, 255).astype(np.uint8)
            
        elif effect_type == "moment_2011":
            # Floodlights at Wankhede
            fl1 = np.zeros_like(frame_bgr, dtype=np.float32)
            cv2.circle(fl1, (int(WIDTH * 0.2), 40), 300, (255, 240, 200), -1)
            cv2.circle(fl1, (int(WIDTH * 0.8), 40), 300, (255, 240, 200), -1)
            fl1 = cv2.GaussianBlur(fl1, (131, 131), 0)
            frame_bgr = np.clip(frame_bgr.astype(np.float32) + fl1 * 0.16, 0, 255).astype(np.uint8)
            
        elif effect_type == "last_walk":
            # Moody fade at edges, deep darkness
            darken = 0.75 - 0.25 * loop_t
            frame_bgr = (frame_bgr.astype(np.float32) * darken).astype(np.uint8)
            
        # Subtle 35mm film grain
        grain = np.random.normal(0, 4.5, (HEIGHT, WIDTH, 3)).astype(np.float32)
        frame_bgr = np.clip(frame_bgr.astype(np.float32) + grain, 0, 255).astype(np.uint8)
        
        out.write(frame_bgr)
        
    out.release()
    
    # Re-encode with ffmpeg H.264 for universal web compatibility (Chrome, Safari, iOS, Firefox)
    cmd = [
        FFMPEG, "-y",
        "-i", temp_raw,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-profile:v", "high",
        "-preset", "fast",
        "-crf", "22",
        "-movflags", "+faststart",
        output_mp4
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(temp_raw):
        os.remove(temp_raw)
    print(f"Generated web video: {output_mp4} ({os.path.getsize(output_mp4)} bytes)")

if __name__ == '__main__':
    videos = [
        (os.path.join(IMAGES_DIR, "dhoni_hero_portrait.jpg"), os.path.join(VIDEOS_DIR, "hero_arrival.mp4"), 5.0, "hero"),
        (os.path.join(IMAGES_DIR, "wankhede_2011_final.jpg"), os.path.join(VIDEOS_DIR, "moment_2011.mp4"), 5.0, "moment_2011"),
        (os.path.join(IMAGES_DIR, "csk_chepauk_night.jpg"), os.path.join(VIDEOS_DIR, "csk_yellow_legacy.mp4"), 5.0, "csk"),
        (os.path.join(IMAGES_DIR, "dhoni_last_walk.jpg"), os.path.join(VIDEOS_DIR, "the_last_walk.mp4"), 5.0, "last_walk"),
    ]
    for img_path, out_mp4, dur, eff in videos:
        create_cinematic_video(img_path, out_mp4, dur, eff)
    print("All cinematic videos generated successfully!")
