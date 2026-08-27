"""FFT-based phase correlation for translation priors and coarse alignment.

Owner: P3
"""
from __future__ import annotations

import numpy as np
from skimage.registration import phase_cross_correlation


def match_phase_correlation(
    img_src: np.ndarray,
    img_ref: np.ndarray,
    upsample_factor: int = 10,
    grid_points: int = 16,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Compute sub-pixel translation offset using FFT Phase Cross-Correlation.

    Generates synthetic grid correspondence pairs shifted by the detected global translation (dy, dx).

    Args:
        img_src: Source image.
        img_ref: Reference image.
        upsample_factor: Sub-pixel upsampling factor.
        grid_points: Number of regular points along each dimension to sample correspondences.

    Returns:
        (pts_src, pts_ref, scores)
    """
    src_f = img_src.astype(np.float32)
    ref_f = img_ref.astype(np.float32)

    # Calculate global shift: shift = (dy, dx)
    shift, error, diffphase = phase_cross_correlation(
        ref_f,
        src_f,
        upsample_factor=upsample_factor
    )
    dy, dx = float(shift[0]), float(shift[1])

    # Sample regular grid points on src and project to ref
    h, w = img_src.shape[:2]
    ys = np.linspace(h * 0.1, h * 0.9, grid_points, dtype=np.float32)
    xs = np.linspace(w * 0.1, w * 0.9, grid_points, dtype=np.float32)
    gx, gy = np.meshgrid(xs, ys)

    pts_src = np.stack([gx.ravel(), gy.ravel()], axis=1)
    pts_ref = pts_src + np.array([dx, dy], dtype=np.float32)

    # Filter out points that fall outside reference boundaries
    valid = (
        (pts_ref[:, 0] >= 0)
        & (pts_ref[:, 0] < w)
        & (pts_ref[:, 1] >= 0)
        & (pts_ref[:, 1] < h)
    )

    pts_src = pts_src[valid]
    pts_ref = pts_ref[valid]
    confidence = float(max(0.0, 1.0 - error))
    scores = np.full(len(pts_src), confidence, dtype=np.float32)

    return pts_src, pts_ref, scores
