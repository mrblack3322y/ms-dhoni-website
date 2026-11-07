import cv2
import numpy as np

img = cv2.imread(r'C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images\dhoni_signature_gold.png', cv2.IMREAD_UNCHANGED)
alpha = img[:, :, 3]
h, w = alpha.shape

# Threshold to binary
_, binary = cv2.threshold(alpha, 25, 255, cv2.THRESH_BINARY)

# Skeletonize
skeleton = cv2.ximgproc.thinning(binary, thinningType=cv2.ximgproc.THINNING_ZHANGSUEN)

# Find contours of the dilated skeleton to get smooth multi-stroke paths
# We can find connected paths from left to right
contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
print(f"Main components: {len(contours)}")

# Sort contours by x position
contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])

svg_paths = []
test_mask = np.zeros((h, w), dtype=np.uint8)

for idx, c in enumerate(contours):
    if cv2.contourArea(c) < 50:
        continue
    # Approximate contour
    epsilon = 0.003 * cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, epsilon, True)
    pts = approx.reshape((-1, 2))
    
    # Trace along boundary or midline
    d = f"M {pts[0][0]} {pts[0][1]}"
    for p in pts[1:]:
        d += f" L {p[0]} {p[1]}"
    d += " Z"
    svg_paths.append(d)
    cv2.drawContours(test_mask, [approx], -1, 255, -1)

coverage = np.count_nonzero((test_mask > 0) & (binary > 0)) / np.count_nonzero(binary > 0)
print(f"Contour coverage: {coverage * 100:.2f}% with {len(svg_paths)} paths")
