import numpy as np
import cv2
from selene.eval.metrics import compute_metrics, MetricsResult

pts_src_final = np.array([[10, 10], [20, 20]], dtype=np.float32)
pts_ref_final = np.array([[11, 11], [21, 21]], dtype=np.float32)
shadow_mask = np.zeros((1024, 1024), dtype=np.uint8)

print("Starting compute_metrics...")
metrics = compute_metrics(
    pts_src=pts_src_final,
    pts_dst=pts_ref_final,
    gsd_m=1.0,
    H_fit=np.eye(3),
    H_gt=np.eye(3),
    image_shape=(1024, 1024),
    shadow_mask=shadow_mask,
    provenance={}
)
print("compute_metrics done", metrics.rmse_px)
