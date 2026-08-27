"""Classical SIFT + FLANN/BF + Lowe ratio test. Kept ONLY as 'Baseline A' for comparison.

Owner: P3
"""
from __future__ import annotations

import numpy as np
import cv2


def match_sift(
    img_src: np.ndarray,
    img_ref: np.ndarray,
    ratio_thresh: float = 0.75,
    max_features: int = 2000,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Extract and match SIFT keypoints with Lowe's ratio test.

    Args:
        img_src: Source image (2D uint8 or float32).
        img_ref: Reference image (2D uint8 or float32).
        ratio_thresh: Lowe's second nearest neighbor ratio threshold.
        max_features: Maximum SIFT keypoints to detect.

    Returns:
        (pts_src, pts_ref, scores) as float32 arrays.
    """
    def _to_u8(img):
        if img.dtype == np.uint8:
            return img
        norm = (img - img.min()) / (img.max() - img.min() + 1e-6)
        return (norm * 255.0).astype(np.uint8)

    src_u8 = _to_u8(img_src)
    ref_u8 = _to_u8(img_ref)

    sift = cv2.SIFT_create(nfeatures=max_features)
    kp1, des1 = sift.detectAndCompute(src_u8, None)
    kp2, des2 = sift.detectAndCompute(ref_u8, None)

    if des1 is None or des2 is None or len(kp1) < 2 or len(kp2) < 2:
        return np.empty((0, 2), dtype=np.float32), np.empty((0, 2), dtype=np.float32), np.empty((0,), dtype=np.float32)

    matcher = cv2.BFMatcher(cv2.NORM_L2)
    knn_matches = matcher.knnMatch(des1, des2, k=2)

    good_src, good_ref, scores = [], [], []
    for m_tuple in knn_matches:
        if len(m_tuple) == 2:
            m, n = m_tuple
            if m.distance < ratio_thresh * n.distance:
                good_src.append(kp1[m.queryIdx].pt)
                good_ref.append(kp2[m.trainIdx].pt)
                # Confidence score inversely proportional to distance ratio
                scores.append(1.0 - (m.distance / (n.distance + 1e-6)))

    if not good_src:
        return np.empty((0, 2), dtype=np.float32), np.empty((0, 2), dtype=np.float32), np.empty((0,), dtype=np.float32)

    return (
        np.array(good_src, dtype=np.float32),
        np.array(good_ref, dtype=np.float32),
        np.array(scores, dtype=np.float32),
    )
