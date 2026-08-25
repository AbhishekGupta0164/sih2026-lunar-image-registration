"""Partitions the overlap into an n x n grid (default 8x8), keeps the best 2-5 inliers per cell with a minimum spacing constraint, and reports empty cells as 'no-texture/shadow' rather than pipeline failure. This is what satisfies the PS's 'uniform distribution' requirement.

Owner: P3
"""
