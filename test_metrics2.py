import json
import numpy as np
from pathlib import Path
from selene.eval.metrics import compute_metrics

gt_candidate = Path("data_generation/output/ground_truth.json")
with open(gt_candidate) as f:
    gt_data = json.load(f)
H_gt = np.array(gt_data["homography_matrix_3x3"], dtype=np.float64)

pts_src_final = np.array([[10, 10], [20, 20]], dtype=np.float32)
pts_ref_final = np.array([[11, 11], [21, 21]], dtype=np.float32)

print("Running compute_metrics...")
compute_metrics(
    pts_src=pts_src_final,
    pts_dst=pts_ref_final,
    gsd_m=0.5,
    H_fit=np.eye(3),
    H_gt=H_gt,
    image_shape=(1024, 1024),
    shadow_mask=np.zeros((1024, 1024), dtype=np.uint8)
)
print("Success!")
