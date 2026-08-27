"""Grid-occupancy + spacing based Coverage / Uniformity score U, shadow-aware.

Owner: P4
"""
from __future__ import annotations

import numpy as np
from scipy.spatial import KDTree


def nni_score(pts: np.ndarray, area_shape: tuple[int, int] = (1024, 1024)) -> float:
    """Compute Clark-Evans Nearest-Neighbour Index (NNI) for spatial dispersion.

    NNI = 1.0 indicates random Poisson distribution.
    NNI > 1.0 indicates uniform/regular spread (desired for robust GCPs).
    NNI < 1.0 indicates clustering.

    Args:
        pts: (N, 2) GCP coordinates.
        area_shape: (height, width) of the bounding area.

    Returns:
        NNI float value.
    """
    n = len(pts)
    if n < 3:
        return 0.0

    tree = KDTree(pts)
    dists, _ = tree.query(pts, k=2)
    # dist to nearest neighbor (k=2 query returns self at index 0 and 1st NN at index 1)
    nn_dists = dists[:, 1]
    r_observed = float(np.mean(nn_dists))

    area = float(area_shape[0] * area_shape[1])
    density = n / area
    r_expected = 0.5 / np.sqrt(density + 1e-8)

    return float(r_observed / r_expected)


def grid_coverage(
    pts: np.ndarray,
    image_shape: tuple[int, int] = (1024, 1024),
    grid_cells: int = 8,
) -> float:
    """Calculate fraction of grid cells containing at least one GCP.

    Args:
        pts: (N, 2) GCP coordinates.
        image_shape: (height, width) of image.
        grid_cells: Grid size per axis (e.g. 8 for 64 cells).

    Returns:
        Fraction in [0.0, 1.0] of occupied cells.
    """
    if len(pts) == 0:
        return 0.0

    h, w = image_shape
    cell_h = h / float(grid_cells)
    cell_w = w / float(grid_cells)

    occupied = set()
    for x, y in pts:
        cx = min(int(x / cell_w), grid_cells - 1)
        cy = min(int(y / cell_h), grid_cells - 1)
        occupied.add((cx, cy))

    total_cells = grid_cells * grid_cells
    return float(len(occupied) / total_cells)
