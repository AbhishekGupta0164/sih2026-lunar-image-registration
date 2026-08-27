"""Robust-fitting package: turns raw matcher output into a small set of trustworthy, well-spread ground control points.

Owner: P3
"""
from .magsac import find_homography_magsac, estimate_affine_magsac
from .uniform_sampler import sample_uniform_gcps

__all__ = [
    "find_homography_magsac",
    "estimate_affine_magsac",
    "sample_uniform_gcps",
]
