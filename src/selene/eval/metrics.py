"""RMSE_px, RMSE_m, N_raw, N_inlier, inlier ratio, CE90/P90 metrics computation.

Owner: P4
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
import numpy as np
from selene.eval.uniformity import nni_score, grid_coverage


@dataclass
class MetricsResult:
    """Core geometric alignment accuracy and reliability metrics."""
    n_raw: int
    n_inliers: int
    inlier_ratio: float
    rmse_px: float
    rmse_m: float
    ce90_px: float
    ce90_m: float
    mean_residual_px: float
    nni_index: float = 0.0
    grid_coverage_fraction: float = 0.0

    def to_dict(self) -> dict:
        return asdict(self)


def compute_metrics(
    pts_src: np.ndarray,
    pts_dst: np.ndarray,
    inlier_mask: np.ndarray | None = None,
    gsd_m: float = 1.0,
    H_fit: np.ndarray | None = None,
    image_shape: tuple[int, int] = (1024, 1024),
    shadow_mask: np.ndarray | None = None,
) -> MetricsResult:
    """Calculate geodetic accuracy metrics on matched point correspondences.

    Args:
        pts_src: (N, 2) Source points.
        pts_dst: (N, 2) Destination/Reference points.
        inlier_mask: (N,) Boolean inlier mask.
        gsd_m: Ground sampling distance in metres per pixel.
        H_fit: Optional fitted 3x3 Homography for residual calculation.
        image_shape: (height, width) of the image space.
        shadow_mask: Optional shadow exclusion mask.

    Returns:
        MetricsResult with pixel- and metre-scale statistics.
    """
    n_raw = len(pts_src)
    if n_raw == 0:
        return MetricsResult(0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

    if inlier_mask is None:
        inlier_mask = np.ones(n_raw, dtype=bool)

    n_inliers = int(np.sum(inlier_mask))
    inlier_ratio = float(n_inliers / n_raw) if n_raw > 0 else 0.0

    inliers_src = pts_src[inlier_mask]
    inliers_dst = pts_dst[inlier_mask]

    if len(inliers_src) == 0:
        return MetricsResult(n_raw, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

    if H_fit is not None:
        # Project source points through H
        ones = np.ones((len(inliers_src), 1), dtype=np.float32)
        homo_src = np.hstack([inliers_src, ones])
        proj = (H_fit @ homo_src.T).T
        proj_pts = proj[:, :2] / (proj[:, 2:] + 1e-8)
        residuals = np.linalg.norm(proj_pts - inliers_dst, axis=1)
    else:
        residuals = np.linalg.norm(inliers_src - inliers_dst, axis=1)

    rmse_px = float(np.sqrt(np.mean(residuals**2)))
    rmse_m = float(rmse_px * gsd_m)

    # CE90 (90th percentile error radius)
    ce90_px = float(np.percentile(residuals, 90))
    ce90_m = float(ce90_px * gsd_m)

    mean_res = float(np.mean(residuals))

    # Uniformity Metrics
    nni_val = nni_score(inliers_src, area_shape=image_shape)
    cov_val = grid_coverage(inliers_src, image_shape=image_shape)

    return MetricsResult(
        n_raw=n_raw,
        n_inliers=n_inliers,
        inlier_ratio=round(inlier_ratio, 4),
        rmse_px=round(rmse_px, 4),
        rmse_m=round(rmse_m, 4),
        ce90_px=round(ce90_px, 4),
        ce90_m=round(ce90_m, 4),
        mean_residual_px=round(mean_res, 4),
        nni_index=round(nni_val, 4),
        grid_coverage_fraction=round(cov_val, 4),
    )


def check_quality_gates(metrics: MetricsResult, subpixel_target: float = 1.0) -> dict[str, bool]:
    """Validate whether registration metrics meet PS target standards.

    Args:
        metrics: Computed MetricsResult instance.
        subpixel_target: Target RMSE in pixels (default 1.0 px).

    Returns:
        Dict of boolean pass/fail status flags for each quality gate requirement.
    """
    rmse_pass = metrics.rmse_px < subpixel_target and metrics.n_inliers >= 4
    inlier_pass = metrics.n_inliers >= 4 and metrics.inlier_ratio >= 0.10
    coverage_pass = metrics.grid_coverage_fraction >= 0.25

    return {
        "subpixel_target_met": rmse_pass,
        "inlier_target_met": inlier_pass,
        "coverage_target_met": coverage_pass,
        "overall_pass": rmse_pass and inlier_pass,
    }


