import os
import json
import cv2
import numpy as np
from pathlib import Path

def prepare_hard_pair():
    out_dir = Path("data/samples/hard_pair")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    img = cv2.imread("data/apollo11_nac.png", cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Failed to load image")
        
    h, w = img.shape
    # Ensure it's large enough, BROWSE.PNG might not be huge.
    # We will just pad or tile if it's too small, but let's assume it's big enough.
    # BROWSE.PNG is probably around 1024x1024 to 2048x2048.
    
    # Actually let's resize the base image to 4000x4000 so we have plenty of pixels
    img = cv2.resize(img, (4000, 4000), interpolation=cv2.INTER_CUBIC)
    
    # Crop center 2000x2000 for reference
    cx, cy = 2000, 2000
    ref_crop = img[cy-1000:cy+1000, cx-1000:cx+1000].copy()
    
    # We want a GSD ratio of ~5x. This means moving image has 5x larger pixels (i.e. is zoomed out or lower resolution).
    # But wait, if moving is lower resolution, we should downscale reference by 5x to get moving.
    # Let's define the homography from Source (moving) to Reference.
    # If source is 5x lower resolution, scaling from Source -> Reference is 5.0.
    
    scale = 5.0
    angle_deg = 15.0
    
    center_ref = (1000.0, 1000.0)
    
    # Rotation matrix around center of reference
    R = cv2.getRotationMatrix2D(center_ref, angle_deg, 1.0)
    
    # Affine matrix: maps from Reference coordinates to an intermediate space
    # Wait, we want H_gt to map from SOURCE to REFERENCE.
    # H_gt * pts_src = pts_ref.
    # So pts_src = inv(H_gt) * pts_ref.
    # Let's define H_gt (Source -> Reference):
    # Scale source by 5.0, rotate by 15 deg, and translate so centers align.
    
    center_src = (400.0, 400.0) # Moving image will be 800x800
    
    # Transform: 
    # 1. Translate source center to origin: T(-400, -400)
    # 2. Scale by 5.0
    # 3. Rotate by 15 deg
    # 4. Translate origin to reference center: T(1000, 1000)
    
    T1 = np.array([[1, 0, -center_src[0]], [0, 1, -center_src[1]], [0, 0, 1]])
    S = np.array([[scale, 0, 0], [0, scale, 0], [0, 0, 1]])
    
    rad = np.deg2rad(angle_deg)
    R_mat = np.array([
        [np.cos(rad), -np.sin(rad), 0],
        [np.sin(rad),  np.cos(rad), 0],
        [0, 0, 1]
    ])
    
    T2 = np.array([[1, 0, center_ref[0]], [0, 1, center_ref[1]], [0, 0, 1]])
    
    H_gt = T2 @ R_mat @ S @ T1
    H_inv = np.linalg.inv(H_gt)
    
    # Warp reference to create source
    # warpPerspective takes transformation from destination to source, but cv2.warpPerspective 
    # maps from src to dst.
    # Here, we want to map ref_crop (which is "destination") to src_crop (which is "source").
    # So we use H_inv to map ref_crop -> src_crop.
    src_crop = cv2.warpPerspective(ref_crop, H_inv, (800, 800), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    
    # Add noise to simulate cross-sensor
    noise = np.random.normal(0, 15, src_crop.shape).astype(np.float32)
    src_crop = np.clip(src_crop.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    # Adjust contrast/brightness
    src_crop = cv2.convertScaleAbs(src_crop, alpha=1.2, beta=-20)
    
    cv2.imwrite(str(out_dir / "reference.tif"), ref_crop)
    cv2.imwrite(str(out_dir / "source.tif"), src_crop)
    
    # Hand-label GT by mapping a grid of points from Source to Reference
    # Choose 16 points in source image (e.g. 4x4 grid)
    y, x = np.mgrid[200:600:4j, 200:600:4j]
    pts_src = np.column_stack([x.ravel(), y.ravel()]).astype(np.float64)
    
    # Map to reference
    pts_src_hom = np.column_stack([pts_src, np.ones(len(pts_src))])
    pts_ref_hom = (H_gt @ pts_src_hom.T).T
    pts_ref = pts_ref_hom[:, :2] / pts_ref_hom[:, 2:]
    
    matches = []
    for (sx, sy), (rx, ry) in zip(pts_src, pts_ref):
        matches.append({
            "source_x": float(sx),
            "source_y": float(sy),
            "reference_x": float(rx),
            "reference_y": float(ry)
        })
        
    gt_data = {
        "dataset_info": {
            "reference_image": "reference.tif",
            "synthetic_target_image": "source.tif",
            "gsd_ratio": scale
        },
        "homography_matrix_3x3": H_gt.tolist(),
        "homography_matrix_inv_3x3": H_inv.tolist(),
        "hand_labeled_matches": matches
    }
    
    with open(out_dir / "ground_truth.json", "w") as f:
        json.dump(gt_data, f, indent=2)
        
    print("Prepared hard pair successfully at data/samples/hard_pair")
    
if __name__ == "__main__":
    prepare_hard_pair()
