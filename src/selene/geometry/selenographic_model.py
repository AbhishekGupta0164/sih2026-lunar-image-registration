"""FALLBACK geometry backend (Tier 3): project matched pixels onto a sphere
of radius 1737.4 km and solve a 3-DOF rotation (Kabsch/SVD) instead of a
planar homography.  Use when no DEM is available or the tile is far from
nadir.

Owner: P1
"""
from __future__ import annotations

import numpy as np


MOON_RADIUS_M: float = 1_737_400.0   # IAU 2000 mean radius in metres


def project_to_sphere(
    pts_px: np.ndarray,
    image_shape: tuple[int, int],
    gsd_m: float,
    radius: float = MOON_RADIUS_M,
) -> np.ndarray:
    """Project image pixel coordinates onto a sphere.

    Uses a nadir-pointing camera model: the image centre maps to the
    sub-satellite point, and each pixel is displaced by ``gsd_m`` metres
    tangentially on the sphere surface.

    Args:
        pts_px:      (N, 2) array of pixel coordinates as (col, row).
        image_shape: (height, width) of the image in pixels.
        gsd_m:       Ground sampling distance in metres per pixel.
        radius:      Sphere radius in metres (default = Moon radius).

    Returns:
        (N, 3) float64 XYZ array of points on the sphere surface.
    """
    h, w = image_shape
    cx, cy = w / 2.0, h / 2.0

    # Offset from image centre in metres (positive east, positive south)
    dx = (pts_px[:, 0] - cx) * gsd_m   # along-track
    dy = (pts_px[:, 1] - cy) * gsd_m   # cross-track

    # Small-angle longitude / latitude displacement
    lon_rad = dx / radius
    lat_rad = -dy / radius              # flip: row↓ = south

    x = radius * np.cos(lat_rad) * np.cos(lon_rad)
    y = radius * np.cos(lat_rad) * np.sin(lon_rad)
    z = radius * np.sin(lat_rad)
    return np.stack([x, y, z], axis=1)


def kabsch_rotation(
    src_xyz: np.ndarray,
    ref_xyz: np.ndarray,
) -> tuple[np.ndarray, float]:
    """Find the optimal 3-DOF rotation matrix via Kabsch / SVD algorithm.

    Minimises the RMSE between ``R @ src_xyz`` and ``ref_xyz`` subject to
    R being a proper rotation (det = +1).

    Args:
        src_xyz: (N, 3) source points on the sphere surface.
        ref_xyz: (N, 3) corresponding reference points.

    Returns:
        ``(R, rmse)`` where *R* is a (3, 3) rotation matrix and *rmse* is
        the residual in metres after applying R.
    """
    # Centre both clouds (Kabsch requires zero-mean)
    src_c = src_xyz - src_xyz.mean(axis=0)
    ref_c = ref_xyz - ref_xyz.mean(axis=0)

    H = src_c.T @ ref_c                         # cross-covariance
    U, _, Vt = np.linalg.svd(H)

    # Ensure a proper rotation (handle reflection)
    d = np.linalg.det(Vt.T @ U.T)
    D = np.diag([1.0, 1.0, d])
    R: np.ndarray = Vt.T @ D @ U.T

    rotated = (R @ src_xyz.T).T
    rmse = float(np.linalg.norm(rotated - ref_xyz, axis=1).mean())
    return R, rmse
