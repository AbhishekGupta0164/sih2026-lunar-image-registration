"""Robust low-DN percentile shadow mask. No downstream matcher or GCP sampler may vote inside this mask.

Owner: P2
"""
from __future__ import annotations

import numpy as np
import cv2


def detect_shadows(
    img: np.ndarray,
    threshold_percentile: float = 8.0,
    morph_kernel_size: int = 5,
) -> np.ndarray:
    """Identify cast shadows via dynamic percentile thresholding and morphological cleanup.

    Args:
        img: 2D float32 or uint8 image.
        threshold_percentile: Percentile of intensity below which pixels are marked shadow.
        morph_kernel_size: Kernel size for closing/opening operations.

    Returns:
        uint8 binary mask where 255 indicates shadow (exclusion zone), 0 indicates valid terrain.
    """
    img_f = img.astype(np.float32)
    if img_f.max() > 1.0:
        img_f = img_f / 255.0

    # Determine dynamic threshold based on bottom percentile
    thresh_val = np.percentile(img_f, threshold_percentile)
    # Also cap with absolute floor to avoid marking everything if high contrast
    thresh_val = min(thresh_val, 0.15)

    shadow_raw = (img_f <= thresh_val).astype(np.uint8) * 255

    # Morphological closing to fill small gaps, followed by opening to remove speckle noise
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (morph_kernel_size, morph_kernel_size))
    shadow_closed = cv2.morphologyEx(shadow_raw, cv2.MORPH_CLOSE, kernel)
    shadow_clean = cv2.morphologyEx(shadow_closed, cv2.MORPH_OPEN, kernel)

    return shadow_clean
