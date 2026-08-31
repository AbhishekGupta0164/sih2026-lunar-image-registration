import pytest
import numpy as np
import cv2
from selene.eval.metrics import compute_metrics

def test_ground_truth_rmse():
    # 4 points
    src = np.array([[10, 10], [10, 20], [20, 20], [20, 10]], dtype=np.float32)
    # Translate by (5, 5)
    dst = src + np.array([5, 5], dtype=np.float32)
    
    H_gt = np.array([
        [1, 0, 5],
        [0, 1, 5],
        [0, 0, 1]
    ], dtype=np.float32)
    
    H_fit = H_gt.copy()
    
    metrics = compute_metrics(
        pts_src=src, pts_dst=dst,
        H_fit=H_fit, H_gt=H_gt
    )
    
    # Self-consistency and GT RMSE should both be 0
    assert abs(metrics.rmse_px) < 1e-4
    assert abs(metrics.rmse_vs_gt_px) < 1e-4
