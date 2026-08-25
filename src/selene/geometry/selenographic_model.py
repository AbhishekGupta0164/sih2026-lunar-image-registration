"""FALLBACK geometry backend (Tier 3): project matched pixels onto a sphere of radius 1737.4 km and solve a 3-DOF rotation (Kabsch/SVD) instead of a planar homography. Use when no DEM is available or the tile is far from nadir.

Owner: P1
"""
