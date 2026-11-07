import cv2
import numpy as np

img = cv2.imread(r'C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images\dhoni_signature_gold.png', cv2.IMREAD_UNCHANGED)
alpha = img[:, :, 3]
h, w = alpha.shape

# Let's define the guide stroke keypoints for MS Dhoni's signature across (w=1119, h=1200):
# Stroke 1: Initial 'M' loop and flourish (top left, down, up, down)
s1 = [
    (140, 480), (100, 360), (140, 220), (220, 140), (320, 180),
    (310, 380), (260, 600), (240, 780), (250, 620), (290, 400),
    (360, 260), (420, 380), (400, 580), (380, 720)
]

# Stroke 2: Connecting loop and middle name 'S' / 'Dhoni'
s2 = [
    (380, 680), (440, 520), (490, 380), (540, 240), (590, 160),
    (640, 260), (620, 420), (580, 560), (540, 680), (620, 580),
    (700, 480), (760, 380), (820, 480), (860, 600), (920, 680),
    (980, 740), (1040, 780)
]

# Stroke 3: Grand underline flourish (sweeping from left to far right)
s3 = [
    (120, 840), (220, 910), (360, 960), (520, 990), (680, 1000),
    (840, 980), (960, 930), (1050, 850), (1080, 760)
]

# Stroke 4: Upper loop & accent flourish
s4 = [
    (480, 180), (530, 110), (600, 80), (680, 120), (740, 210), (710, 300)
]

# Test coverage with brush radius 65 (stroke width 130)
test_mask = np.zeros((h, w), dtype=np.uint8)
strokes = [s1, s2, s3, s4]
for s in strokes:
    pts = np.array(s, dtype=np.int32).reshape((-1, 1, 2))
    cv2.polylines(test_mask, [pts], False, 255, thickness=130, lineType=cv2.LINE_AA)
    for pt in s:
        cv2.circle(test_mask, pt, 65, 255, -1)

# Check how many signature pixels are covered
sig_pixels = alpha > 20
covered = (test_mask > 0) & sig_pixels
coverage = np.count_nonzero(covered) / np.count_nonzero(sig_pixels)
print(f"Coverage of original signature: {coverage * 100:.1f}%")
