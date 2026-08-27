"""Census transform for illumination-robust local structure representation.

Owner: P2
"""
from __future__ import annotations

import numpy as np


def census_transform(img: np.ndarray, window_size: int = 3) -> np.ndarray:
    """Compute non-parametric Census Transform on a 2D grayscale image.

    For each pixel, compares neighbours in a window with the central pixel:
    bit is 1 if neighbour >= center, 0 otherwise. Stores as integer bitmask.

    Args:
        img: 2D array (uint8 or float32).
        window_size: Odd integer size of window (3 or 5).

    Returns:
        uint64 or uint32 2D array of census bit codes.
    """
    if window_size % 2 == 0:
        raise ValueError("window_size must be odd")

    pad = window_size // 2
    padded = np.pad(img, pad, mode="reflect")
    h, w = img.shape
    dtype = np.uint64 if window_size > 3 else np.uint8
    census = np.zeros((h, w), dtype=dtype)

    center = padded[pad : pad + h, pad : pad + w]

    bit = 0
    for dy in range(window_size):
        for dx in range(window_size):
            if dy == pad and dx == pad:
                continue
            neighbor = padded[dy : dy + h, dx : dx + w]
            bit_mask = (neighbor >= center).astype(dtype)
            census |= bit_mask << dtype(bit)
            bit += 1

    return census


def census_hamming_distance(c1: np.ndarray, c2: np.ndarray) -> np.ndarray:
    """Compute element-wise Hamming distance between two census-transformed arrays.

    Args:
        c1: 2D array of census codes.
        c2: 2D array of census codes (same shape).

    Returns:
        float32 2D array of normalized Hamming distances in [0, 1].
    """
    xor_res = np.bitwise_xor(c1, c2)
    # Count set bits (Hamming distance)
    # vectorized bit count
    dist = np.zeros_like(xor_res, dtype=np.float32)
    temp = xor_res.copy()
    while np.any(temp > 0):
        dist += (temp & 1).astype(np.float32)
        temp >>= 1

    max_bits = 8 if c1.dtype == np.uint8 else 64
    return dist / float(max_bits)
