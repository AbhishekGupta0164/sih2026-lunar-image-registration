"""8x8 grid occupancy, min-dist filter, GCP ranking for spatially uniform control point selection.

Owner: P3
"""
from __future__ import annotations

import numpy as np


def sample_uniform_gcps(
    pts_src: np.ndarray,
    pts_dst: np.ndarray,
    scores: np.ndarray | None = None,
    image_shape: tuple[int, int] = (1024, 1024),
    grid_cells: int = 8,
    min_dist_px: float = 15.0,
    max_pts_per_cell: int = 4,
    shadow_mask: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Sample spatially uniform Ground Control Points (GCPs) across an NxN spatial grid.

    Prevents feature clustering in high-texture areas (e.g. fresh crater rims)
    and guarantees well-distributed constraints for thin-plate spline warping.

    Args:
        pts_src: (N, 2) source coordinates.
        pts_dst: (N, 2) destination coordinates.
        scores: (N,) match quality / confidence scores.
        image_shape: (height, width) of the source image.
        grid_cells: Number of cells along each axis (default: 8 for 64 cells).
        min_dist_px: Minimum Euclidean distance between selected GCPs.
        max_pts_per_cell: Maximum GCPs retained per grid cell.
        shadow_mask: Optional binary mask (255 = shadow) to exclude shadow regions.

    Returns:
        (sampled_src, sampled_dst, selected_indices)
    """
    if len(pts_src) == 0:
        return np.empty((0, 2), dtype=np.float32), np.empty((0, 2), dtype=np.float32), np.array([], dtype=int)

    h, w = image_shape
    if scores is None:
        scores = np.ones(len(pts_src), dtype=np.float32)

    # Filter out shadow pixels if shadow mask is provided
    valid_mask = np.ones(len(pts_src), dtype=bool)
    if shadow_mask is not None:
        for i, (x, y) in enumerate(pts_src):
            ix, iy = int(round(x)), int(round(y))
            if 0 <= iy < shadow_mask.shape[0] and 0 <= ix < shadow_mask.shape[1]:
                if shadow_mask[iy, ix] > 0:
                    valid_mask[i] = False

    indices = np.where(valid_mask)[0]
    if len(indices) == 0:
        indices = np.arange(len(pts_src))

    # Sort candidates by score descending
    sorted_idx = indices[np.argsort(-scores[indices])]

    cell_h = h / float(grid_cells)
    cell_w = w / float(grid_cells)

    cell_counts = np.zeros((grid_cells, grid_cells), dtype=int)
    selected_indices: list[int] = []
    selected_pts: list[np.ndarray] = []

    for idx in sorted_idx:
        pt = pts_src[idx]
        x, y = pt[0], pt[1]

        # Determine cell index
        cx = min(int(x / cell_w), grid_cells - 1)
        cy = min(int(y / cell_h), grid_cells - 1)

        if cell_counts[cy, cx] >= max_pts_per_cell:
            continue

        # Check minimum spacing against already selected points
        if selected_pts:
            dists = np.linalg.norm(np.array(selected_pts) - pt, axis=1)
            if np.any(dists < min_dist_px):
                continue

        cell_counts[cy, cx] += 1
        selected_indices.append(idx)
        selected_pts.append(pt)

    sel_idx_arr = np.array(selected_indices, dtype=int)
    return pts_src[sel_idx_arr], pts_dst[sel_idx_arr], sel_idx_arr
