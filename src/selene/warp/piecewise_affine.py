"""Per-tile / triangulated piecewise-affine warp — used for long OHRC strips where a single global model is invalid.

Owner: P3/P4
"""
from __future__ import annotations

import numpy as np
from scipy.spatial import Delaunay
import cv2


def piecewise_affine_warp(
    img: np.ndarray,
    src_pts: np.ndarray,
    dst_pts: np.ndarray,
    output_shape: tuple[int, int] | None = None,
) -> np.ndarray:
    """Warp image using Delaunay Triangulation and per-triangle Affine transformation.

    Args:
        img: Input image.
        src_pts: (N, 2) GCPs in source image.
        dst_pts: (N, 2) corresponding GCPs in target/reference image.
        output_shape: (height, width) of output image.

    Returns:
        Warped image array.
    """
    h, w = output_shape if output_shape is not None else img.shape[:2]
    warped = np.zeros((h, w), dtype=img.dtype)

    if len(dst_pts) < 4:
        # Fallback to single global affine
        M, _ = cv2.estimateAffine2D(src_pts, dst_pts)
        if M is None:
            return img
        return cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=0)

    # Add corner boundary points to avoid unmapped borders
    corners_dst = np.array([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]], dtype=np.float32)
    # Estimate global affine to place boundary points on src
    M_init, _ = cv2.estimateAffine2D(dst_pts, src_pts)
    if M_init is not None:
        corners_src = cv2.transform(corners_dst.reshape(-1, 1, 2), M_init).reshape(-1, 2)
    else:
        corners_src = corners_dst.copy()

    all_dst = np.vstack([dst_pts, corners_dst])
    all_src = np.vstack([src_pts, corners_src])

    # Triangulate on destination reference plane
    tri = Delaunay(all_dst)

    for simplex in tri.simplices:
        tri_dst = all_dst[simplex].astype(np.float32)
        tri_src = all_src[simplex].astype(np.float32)

        # Bounding box of destination triangle
        r_dst = cv2.boundingRect(tri_dst)
        if r_dst[2] <= 0 or r_dst[3] <= 0:
            continue

        # Offset points by ROI top-left
        tri_dst_cropped = tri_dst - np.array([r_dst[0], r_dst[1]])

        # Affine transform from src triangle to dst triangle
        M_tri = cv2.getAffineTransform(tri_src, tri_dst_cropped)

        # Warp whole src image or cropped patch to the ROI size
        warped_patch = cv2.warpAffine(
            img,
            M_tri,
            (r_dst[2], r_dst[3]),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_REFLECT_101,
        )

        # Create triangle mask
        mask = np.zeros((r_dst[3], r_dst[2]), dtype=np.uint8)
        cv2.fillConvexPoly(mask, np.int32(tri_dst_cropped), 255)

        # Copy inside mask to output
        y1, y2 = r_dst[1], min(r_dst[1] + r_dst[3], h)
        x1, x2 = r_dst[0], min(r_dst[0] + r_dst[2], w)
        patch_h, patch_w = y2 - y1, x2 - x1

        if patch_h > 0 and patch_w > 0:
            roi_out = warped[y1:y2, x1:x2]
            roi_patch = warped_patch[:patch_h, :patch_w]
            roi_mask = mask[:patch_h, :patch_w] == 255
            roi_out[roi_mask] = roi_patch[roi_mask]

    return warped
