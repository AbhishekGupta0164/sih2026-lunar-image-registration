import os
import json
import argparse
import numpy as np
import cv2
import matplotlib.pyplot as plt


def calculate_nni(points: np.ndarray, width: float, height: float) -> float:
    """
    Computes Nearest Neighbor Index (NNI) for spatial point distribution analysis.
    NNI ~ 1.0 -> Uniform distribution
    NNI > 1.0 -> Well-dispersed across frame
    NNI < 0.6 -> Clustered in a small region
    """
    N = len(points)
    if N < 2:
        return 0.0
    
    # Calculate distance matrix
    diff = points[:, np.newaxis, :] - points[np.newaxis, :, :]
    dist_matrix = np.sqrt(np.sum(diff ** 2, axis=-1))
    
    # Fill diagonal with infinity to exclude self-distance
    np.fill_diagonal(dist_matrix, np.inf)
    
    # Minimum distance to nearest neighbor for each point
    min_dists = np.min(dist_matrix, axis=1)
    d_obs = np.mean(min_dists)
    
    # Expected mean distance for random spatial distribution
    area = float(width * height)
    d_exp = 0.5 / np.sqrt(N / area)
    
    return float(d_obs / (d_exp + 1e-8))


def calculate_grid_coverage(points: np.ndarray, width: float, height: float, grid_size: tuple = (4, 4)) -> dict:
    """
    Calculates percentage of spatial grid cells occupied by inlier feature matches.
    """
    if len(points) == 0:
        return {"occupied_cells": 0, "total_cells": grid_size[0] * grid_size[1], "coverage_pct": 0.0}
    
    gx, gy = grid_size
    cell_w = width / float(gx)
    cell_h = height / float(gy)
    
    occupied = set()
    for pt in points:
        ix = int(min(pt[0] // cell_w, gx - 1))
        iy = int(min(pt[1] // cell_h, gy - 1))
        occupied.add((ix, iy))
        
    total_cells = gx * gy
    coverage = (len(occupied) / float(total_cells)) * 100.0
    
    return {
        "occupied_cells": len(occupied),
        "total_cells": total_cells,
        "coverage_pct": float(coverage)
    }


def compute_grid_rmse(H_gt: np.ndarray, H_est: np.ndarray, width: int, height: int, grid_steps: int = 15) -> float:
    """
    Computes mean pixel warp displacement RMSE across a uniform grid between GT and Estimated Homography.
    """
    xs = np.linspace(0, width - 1, grid_steps)
    ys = np.linspace(0, height - 1, grid_steps)
    grid_x, grid_y = np.meshgrid(xs, ys)
    
    pts = np.vstack([grid_x.ravel(), grid_y.ravel(), np.ones(grid_x.size)])
    
    # Warp with GT
    pts_gt = H_gt @ pts
    pts_gt = pts_gt[:2] / pts_gt[2]
    
    # Warp with Estimated
    pts_est = H_est @ pts
    pts_est = pts_est[:2] / pts_est[2]
    
    # Compute Euclidean displacement error per grid point
    errors = np.linalg.norm(pts_gt - pts_est, axis=0)
    rmse = np.sqrt(np.mean(errors ** 2))
    return float(rmse)


def decompose_affine_matrix(M_2x3: np.ndarray, width: int = 1024, height: int = 1024) -> dict:
    """
    Decomposes a 2x3 affine transformation matrix into rotation (deg), scale factor,
    and translation shift (tx, ty) relative to image center (w/2, h/2).
    """
    a, b, m02 = M_2x3[0, 0], M_2x3[0, 1], M_2x3[0, 2]
    c, d, m12 = M_2x3[1, 0], M_2x3[1, 1], M_2x3[1, 2]
    
    scale_x = np.sqrt(a * a + c * c)
    scale_y = np.sqrt(b * b + d * d)
    scale = float((scale_x + scale_y) / 2.0)
    
    # In OpenCV getRotationMatrix2D: M[1,0] = -sin(theta)*scale, M[0,0] = cos(theta)*scale
    rot_rad = np.arctan2(-c, a)
    rot_deg = float(np.degrees(rot_rad))
    
    # Calculate center displacement: tx = M * center_x - center_x
    cx, cy = width / 2.0, height / 2.0
    tx_center = float(a * cx + b * cy + m02 - cx)
    ty_center = float(c * cx + d * cy + m12 - cy)
    
    return {
        "rotation_deg": rot_deg,
        "scale": scale,
        "tx_px": tx_center,
        "ty_px": ty_center
    }


def run_sift_baseline(data_dir: str = "data_generation/output") -> dict:
    """
    Evaluates SIFT + RANSAC baseline registration on synthetic target vs reference image pair.
    """
    ref_path = os.path.join(data_dir, "reference.png")
    target_path = os.path.join(data_dir, "synthetic_target.png")
    gt_path = os.path.join(data_dir, "ground_truth.json")
    
    if not os.path.exists(ref_path) or not os.path.exists(target_path) or not os.path.exists(gt_path):
        raise FileNotFoundError(f"Missing required dataset files in {data_dir}. Run generate_synthetic_pair first.")
        
    img_ref = cv2.imread(ref_path, cv2.IMREAD_GRAYSCALE)
    img_target = cv2.imread(target_path, cv2.IMREAD_GRAYSCALE)
    
    with open(gt_path, "r") as f:
        gt_data = json.load(f)
        
    H_gt = np.array(gt_data["homography_matrix_3x3"], dtype=np.float64)
    gt_params = gt_data["ground_truth_params"]
    h, w = img_ref.shape
    
    print("[INFO] Running SIFT feature detector & extractor...")
    sift = cv2.SIFT_create(nfeatures=3000)
    
    kp_ref, des_ref = sift.detectAndCompute(img_ref, None)
    kp_target, des_target = sift.detectAndCompute(img_target, None)
    
    print(f"[INFO] Reference SIFT keypoints: {len(kp_ref)}, Target SIFT keypoints: {len(kp_target)}")
    
    # Matching using FLANN Matcher with Lowe's Ratio Test
    FLANN_INDEX_KDTREE = 1
    index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)
    
    matches = flann.knnMatch(des_ref, des_target, k=2)
    
    good_matches = []
    pts_ref = []
    pts_target = []
    
    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            good_matches.append(m)
            pts_ref.append(kp_ref[m.queryIdx].pt)
            pts_target.append(kp_target[m.trainIdx].pt)
            
    pts_ref = np.float32(pts_ref)
    pts_target = np.float32(pts_target)
    
    print(f"[INFO] Raw matches passing Lowe's ratio test: {len(good_matches)}")
    
    if len(good_matches) < 4:
        raise RuntimeError("Too few matches to compute transformation matrix.")
        
    # Estimate Transformation Matrix using RANSAC (pts_ref -> pts_target)
    M_est_2x3, inlier_mask = cv2.estimateAffinePartial2D(pts_ref, pts_target, method=cv2.RANSAC, ransacReprojThreshold=3.0)
    inliers = inlier_mask.ravel().astype(bool)
    
    n_inliers = int(np.sum(inliers))
    inlier_ratio = (n_inliers / len(good_matches)) * 100.0 if len(good_matches) > 0 else 0.0
    
    # 3x3 estimated homography
    H_est = np.eye(3, dtype=np.float64)
    H_est[0:2, :] = M_est_2x3
    
    # Parameter decomposition
    rec_params = decompose_affine_matrix(M_est_2x3, width=w, height=h)
    
    # Parameter errors
    rot_err = abs(rec_params["rotation_deg"] - gt_params["rotation_deg"])
    scale_err = abs(rec_params["scale"] - gt_params["scale"])
    tx_err = abs(rec_params["tx_px"] - gt_params["translation_x_px"])
    ty_err = abs(rec_params["ty_px"] - gt_params["translation_y_px"])
    
    # Grid Displacement RMSE
    rmse_px = compute_grid_rmse(H_gt, H_est, width=w, height=h)
    
    # Spatial Distribution Evaluation (NNI & Grid Coverage on inliers)
    inlier_pts_ref = pts_ref[inliers]
    nni_score = calculate_nni(inlier_pts_ref, width=w, height=h)
    grid_cov = calculate_grid_coverage(inlier_pts_ref, width=w, height=h, grid_size=(4, 4))
    
    print("\n" + "="*60)
    print("           SIFT + RANSAC BASELINE EVALUATION METRICS          ")
    print("="*60)
    print(f" Detected Matches        : {len(good_matches)}")
    print(f" RANSAC Inliers          : {n_inliers}")
    print(f" Inlier Ratio            : {inlier_ratio:.2f}%")
    print(f" Warp Grid RMSE          : {rmse_px:.3f} px")
    print(f" Spatial Uniformity (NNI): {nni_score:.3f}")
    print(f" Grid Cell Coverage (4x4): {grid_cov['occupied_cells']}/16 cells ({grid_cov['coverage_pct']:.1f}%)")
    print("-" * 60)
    print(f" Ground Truth Rotation   : {gt_params['rotation_deg']}° | Recovered: {rec_params['rotation_deg']:.3f}° | Err: {rot_err:.3f}°")
    print(f" Ground Truth Scale      : {gt_params['scale']}   | Recovered: {rec_params['scale']:.3f}   | Err: {scale_err:.4f}")
    print(f" Ground Truth Shift X    : {gt_params['translation_x_px']} px | Recovered: {rec_params['tx_px']:.2f} px | Err: {tx_err:.2f} px")
    print(f" Ground Truth Shift Y    : {gt_params['translation_y_px']} px | Recovered: {rec_params['ty_px']:.2f} px | Err: {ty_err:.2f} px")
    print("="*60 + "\n")
    
    # Save Report Summary JSON
    report_data = {
        "metrics": {
            "total_matches": len(good_matches),
            "ransac_inliers": n_inliers,
            "inlier_ratio_pct": float(inlier_ratio),
            "warp_rmse_px": float(rmse_px),
            "nni_spatial_score": float(nni_score),
            "grid_occupied_cells": grid_cov["occupied_cells"],
            "grid_coverage_pct": grid_cov["coverage_pct"]
        },
        "ground_truth": gt_params,
        "recovered_params": rec_params,
        "errors": {
            "rotation_err_deg": float(rot_err),
            "scale_err": float(scale_err),
            "translation_x_err_px": float(tx_err),
            "translation_y_err_px": float(ty_err)
        }
    }
    
    report_json_path = os.path.join(data_dir, "sift_baseline_report.json")
    with open(report_json_path, "w") as f:
        json.dump(report_data, f, indent=4)
    print(f"[SUCCESS] Saved evaluation report JSON: {report_json_path}")
    
    # Step 6: Generate Visualization Figure
    fig, axes = plt.subplots(2, 2, figsize=(14, 12))
    
    # Plot 1: Keypoint Matches
    img_matches = cv2.drawMatches(
        img_ref, kp_ref, img_target, kp_target,
        [m for idx, m in enumerate(good_matches) if inliers[idx]],
        None,
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )
    axes[0, 0].imshow(cv2.cvtColor(img_matches, cv2.COLOR_BGR2RGB))
    axes[0, 0].set_title(f"SIFT + RANSAC Inlier Matches ({n_inliers} / {len(good_matches)})", fontsize=11, fontweight='bold')
    axes[0, 0].axis('off')
    
    # Plot 2: Inlier Spatial Distribution (Reference Frame)
    axes[0, 1].imshow(img_ref, cmap='gray')
    axes[0, 1].scatter(inlier_pts_ref[:, 0], inlier_pts_ref[:, 1], c='lime', s=12, alpha=0.8, label='RANSAC Inliers')
    
    # Draw 4x4 Grid lines
    for i in range(1, 4):
        axes[0, 1].axvline(i * (w / 4), color='cyan', linestyle='--', alpha=0.5)
        axes[0, 1].axhline(i * (h / 4), color='cyan', linestyle='--', alpha=0.5)
        
    axes[0, 1].set_title(f"Inlier Spatial Distribution (NNI: {nni_score:.2f} | Cov: {grid_cov['coverage_pct']:.0f}%)", fontsize=11, fontweight='bold')
    axes[0, 1].legend(loc='upper right')
    axes[0, 1].set_xlim(0, w)
    axes[0, 1].set_ylim(h, 0)
    
    # Plot 3: Difference Image before registration vs warped
    warped_target = cv2.warpAffine(img_target, cv2.invertAffineTransform(M_est_2x3), (w, h), borderMode=cv2.BORDER_REFLECT)
    diff_before = cv2.absdiff(img_ref, img_target)
    diff_after = cv2.absdiff(img_ref, warped_target)
    
    axes[1, 0].imshow(diff_after, cmap='magma')
    axes[1, 0].set_title(f"Post-Registration Residual Difference (RMSE: {rmse_px:.2f} px)", fontsize=11, fontweight='bold')
    axes[1, 0].axis('off')
    
    # Plot 4: Metrics Summary Card
    axes[1, 1].axis('off')
    summary_text = (
        "SIFT + RANSAC REGISTRATION SUMMARY\n"
        "====================================\n\n"
        f"• Total Matches Detected : {len(good_matches)}\n"
        f"• RANSAC Inlier Count    : {n_inliers}\n"
        f"• Inlier Ratio           : {inlier_ratio:.1f}%\n"
        f"• Spatial Uniformity NNI : {nni_score:.3f} (Ideal >= 1.0)\n"
        f"• Grid Cell Occupancy    : {grid_cov['occupied_cells']}/16 ({grid_cov['coverage_pct']:.0f}%)\n"
        f"• Pixel Warp RMSE        : {rmse_px:.3f} px\n\n"
        "PARAMETER RECOVERY ERROR\n"
        "------------------------\n"
        f"• Rotation Error         : {rot_err:.3f}°\n"
        f"• Scale Error            : {scale_err:.4f}\n"
        f"• Translation X Error    : {tx_err:.2f} px\n"
        f"• Translation Y Error    : {ty_err:.2f} px\n"
    )
    axes[1, 1].text(0.05, 0.95, summary_text, transform=axes[1, 1].transAxes,
                    fontsize=11, family='monospace', verticalalignment='top',
                    bbox=dict(boxstyle='round,pad=0.8', facecolor='#1e1e2e', alpha=0.9, edgecolor='#89b4fa'))
    
    plt.tight_layout()
    viz_path = os.path.join(data_dir, "sift_baseline_results.png")
    plt.savefig(viz_path, dpi=150)
    plt.close()
    print(f"[SUCCESS] Saved evaluation visualization plot: {viz_path}")
    
    return report_data


def main():
    parser = argparse.ArgumentParser(description="Evaluate SIFT + RANSAC Baseline on Synthetic Lunar Pair")
    parser.add_argument("--data_dir", type=str, default="data_generation/output", help="Directory containing dataset files")
    args = parser.parse_args()
    
    run_sift_baseline(data_dir=args.data_dir)


if __name__ == "__main__":
    main()
