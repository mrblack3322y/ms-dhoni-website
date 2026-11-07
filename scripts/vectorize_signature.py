import cv2
import numpy as np
import json

def trace_thinned_image(thinned_img):
    h, w = thinned_img.shape
    visited = np.zeros((h, w), dtype=bool)
    
    # 8-connected neighbors ordered
    neighbors = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    
    # Find all skeleton pixels
    y_coords, x_coords = np.nonzero(thinned_img)
    points = list(zip(x_coords, y_coords))
    
    # Order starting candidate points by x coordinate (left to right)
    points.sort(key=lambda p: (p[0], p[1]))
    
    paths = []
    
    for start_x, start_y in points:
        if visited[start_y, start_x]:
            continue
            
        current_path = [(start_x, start_y)]
        visited[start_y, start_x] = True
        
        curr_x, curr_y = start_x, start_y
        
        while True:
            next_pt = None
            # Look for unvisited neighbor
            for dx, dy in neighbors:
                nx, ny = curr_x + dx, curr_y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    if thinned_img[ny, nx] > 0 and not visited[ny, nx]:
                        next_pt = (nx, ny)
                        break
            if next_pt:
                curr_x, curr_y = next_pt
                visited[curr_y, curr_x] = True
                current_path.append(next_pt)
            else:
                break
                
        if len(current_path) >= 8:  # filter noise
            # Simplify path with approxPolyDP
            pts_array = np.array(current_path, dtype=np.int32).reshape((-1, 1, 2))
            epsilon = 1.2
            approx = cv2.approxPolyDP(pts_array, epsilon, False)
            simplified = [(int(p[0][0]), int(p[0][1])) for p in approx]
            paths.append(simplified)
            
    return paths

def generate_svg_paths():
    img = cv2.imread(r'C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images\dhoni_signature.png', cv2.IMREAD_UNCHANGED)
    alpha = img[:, :, 3]
    y_idx, x_idx = np.nonzero(alpha)
    crop = alpha[y_idx.min():y_idx.max(), x_idx.min():x_idx.max()]
    
    target_w, target_h = 700, 450
    h, w = crop.shape
    scale = min(target_w / w, target_h / h)
    nw, nh = int(w * scale), int(h * scale)
    resized = cv2.resize(crop, (nw, nh), interpolation=cv2.INTER_AREA)
    
    _, binary = cv2.threshold(resized, 70, 255, cv2.THRESH_BINARY)
    thinned = cv2.ximgproc.thinning(binary, thinningType=cv2.ximgproc.THINNING_ZHANGSUEN)
    
    paths = trace_thinned_image(thinned)
    print(f"Extracted {len(paths)} stroke segments.")
    
    # Sort paths generally by min_x
    paths.sort(key=lambda p: min(pt[0] for pt in p))
    
    svg_d_list = []
    for p in paths:
        if len(p) < 2: continue
        d = f"M {p[0][0]} {p[0][1]}"
        for pt in p[1:]:
            d += f" L {pt[0]} {pt[1]}"
        svg_d_list.append(d)
        
    return svg_d_list, nw, nh

if __name__ == '__main__':
    d_list, w, h = generate_svg_paths()
    with open(r'C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\scripts\signature_paths.json', 'w') as f:
        json.dump({'width': w, 'height': h, 'paths': d_list}, f)
    print(f"Saved {len(d_list)} paths to signature_paths.json (viewBox 0 0 {w} {h})")
