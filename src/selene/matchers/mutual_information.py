"""SimpleITK Mattes mutual-information registration for cross-modal pairs (e.g. IIRS <-> WAC/TMC).

Owner: P3
"""
from __future__ import annotations

import numpy as np
from .sift_baseline import match_sift


def match_mutual_information(
    img_src: np.ndarray,
    img_ref: np.ndarray,
    grid_points: int = 16,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Perform Mutual Information registration for cross-spectral / cross-sensor pairs.

    Uses SimpleITK Mattes Mutual Information registration method if installed;
    falls back gracefully to SIFT baseline.

    Args:
        img_src: Source image.
        img_ref: Reference image.
        grid_points: Number of grid points along each axis for correspondence generation.

    Returns:
        (pts_src, pts_ref, scores)
    """
    try:
        import SimpleITK as sitk

        sitk_src = sitk.GetImageFromArray(img_src.astype(np.float32))
        sitk_ref = sitk.GetImageFromArray(img_ref.astype(np.float32))

        # Setup registration method
        reg = sitk.ImageRegistrationMethod()
        reg.SetMetricAsMattesMutualInformation(numberOfHistogramBins=50)
        reg.SetMetricSamplingStrategy(reg.RANDOM)
        reg.SetMetricSamplingPercentage(0.20)
        reg.SetInterpolator(sitk.sitkLinear)

        # Affine or Translation transform
        initial_tx = sitk.CenteredTransformInitializer(
            sitk_ref,
            sitk_src,
            sitk.Euler2DTransform(),
            sitk.CenteredTransformInitializerFilter.GEOMETRY,
        )
        reg.SetInitialTransform(initial_tx)
        reg.SetOptimizerAsGradientDescent(
            learningRate=1.0,
            numberOfIterations=100,
            convergenceMinimumValue=1e-6,
            convergenceWindowSize=10,
        )

        final_tx = reg.Execute(sitk_ref, sitk_src)

        # Generate correspondences across grid
        h, w = img_src.shape[:2]
        ys = np.linspace(h * 0.1, h * 0.9, grid_points, dtype=np.float32)
        xs = np.linspace(w * 0.1, w * 0.9, grid_points, dtype=np.float32)
        gx, gy = np.meshgrid(xs, ys)

        pts_src = np.stack([gx.ravel(), gy.ravel()], axis=1)
        pts_ref_list = []
        for pt in pts_src:
            # TransformPoint maps from fixed (ref) to moving (src) or vice-versa
            t_pt = final_tx.TransformPoint((float(pt[0]), float(pt[1])))
            pts_ref_list.append(t_pt)

        pts_ref = np.array(pts_ref_list, dtype=np.float32)
        metric_val = float(reg.GetMetricValue())
        scores = np.full(len(pts_src), max(0.5, 1.0 / (1.0 + abs(metric_val))), dtype=np.float32)

        return pts_src, pts_ref, scores

    except (ImportError, Exception):
        return match_sift(img_src, img_ref)
