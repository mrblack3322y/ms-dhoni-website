import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageOps
import imageio_ffmpeg
import subprocess

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
IMG_DIR = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images"
VID_DIR = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\videos"

src_path = os.path.join(IMG_DIR, "dhoni_long_hair_2007.jpg")
img = Image.open(src_path).convert("RGB")

# 1. Enhance base quality
enhancer = ImageEnhance.Sharpness(img)
img = enhancer.enhance(1.4)
enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.18)

# 2. Generate Landscape Version (1920x1080, 16:9)
target_w, target_h = 1920, 1080
landscape_bg = Image.new("RGB", (target_w, target_h), (5, 5, 5))

# Scale to fit height nicely
scale = target_h / img.height
scaled_w = int(img.width * scale)
img_scaled = img.resize((scaled_w, target_h), Image.Resampling.LANCZOS)

# Position slightly to the right to leave negative space for massive typography
pos_x = target_w - scaled_w
landscape_bg.paste(img_scaled, (pos_x, 0))

# Apply dark gradient on left edge for typography legibility
np_land = np.array(landscape_bg)
for x in range(target_w):
    fade = min(1.0, max(0.0, (x - 250) / 900))
    np_land[:, x] = (np_land[:, x] * fade).astype(np.uint8)

out_land = Image.fromarray(np_land)
out_land.save(os.path.join(IMG_DIR, "dhoni_long_hair_landscape.jpg"), quality=95)
print("Saved dhoni_long_hair_landscape.jpg")

# 3. Generate Portrait Version (1080x1440, optimized for mobile screens)
target_pw, target_ph = 1080, 1440
portrait_bg = Image.new("RGB", (target_pw, target_ph), (5, 5, 5))

# Crop centered on Dhoni's face and long hair
# img original is 1024x768
crop_scale = target_pw / img.width * 1.35
pw_s = int(img.width * crop_scale)
ph_s = int(img.height * crop_scale)
img_port = img.resize((pw_s, ph_s), Image.Resampling.LANCZOS)

# Paste with hair and face in upper 1/3
px_offset = (target_pw - pw_s) // 2
py_offset = 60
portrait_bg.paste(img_port, (px_offset, py_offset))

# Darken bottom for mobile typography
np_port = np.array(portrait_bg)
for y in range(target_ph):
    if y > target_ph * 0.45:
        fade = 1.0 - min(0.9, (y - target_ph * 0.45) / (target_ph * 0.55))
        np_port[y, :] = (np_port[y, :] * fade).astype(np.uint8)

out_port = Image.fromarray(np_port)
out_port.save(os.path.join(IMG_DIR, "dhoni_long_hair_portrait.jpg"), quality=95)
print("Saved dhoni_long_hair_portrait.jpg")

# 4. Generate Hero Cinematic MP4 from the long-hair landscape image
hero_vid_out = os.path.join(VID_DIR, "hero_arrival.mp4")
filter_str = "zoom=zoom+0.0012:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1280x720"
cmd = [
    ffmpeg, "-y", "-loop", "1", "-i", os.path.join(IMG_DIR, "dhoni_long_hair_landscape.jpg"),
    "-vf", f"scale=1920:1080,zoompan={filter_str},fps=30,format=yuv420p",
    "-t", "5", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    "-movflags", "+faststart", hero_vid_out
]
subprocess.run(cmd, check=True)
print("Updated hero_arrival.mp4 with long-haired Dhoni!")
