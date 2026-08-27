"""Detect crater centres + radii on an image (or its hillshade). Only needs centres/radii, not pixel-perfect rim masks. OK to skip gracefully on smooth mare with no craters.

Owner: P2
"""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np
import cv2


@dataclass
class Crater:
    """Detected impact crater geometry."""
    cx: float
    cy: float
    r: float
    score: float = 1.0


def detect_craters(
    img: np.ndarray,
    min_radius: int = 10,
    max_radius: int = 150,
    param1: float = 50.0,
    param2: float = 30.0,
    max_craters: int = 100,
) -> list[Crater]:
    """Detect circular crater rims using Hough Circle Transform.

    Args:
        img: 2D input array (uint8 or float32).
        min_radius: Minimum crater radius in pixels.
        max_radius: Maximum crater radius in pixels.
        param1: Higher threshold for internal Canny detector.
        param2: Accumulator threshold for circle centers.
        max_craters: Maximum number of craters to return.

    Returns:
        List of Crater instances sorted by radius/score.
    """
    if img.dtype != np.uint8:
        img_u8 = (img * 255.0 / (img.max() + 1e-6)).clip(0, 255).astype(np.uint8)
    else:
        img_u8 = img

    # Blur to reduce high frequency regolith noise
    blurred = cv2.GaussianBlur(img_u8, (7, 7), 1.5)

    circles = cv2.HoughCircles(
        blurred,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=float(min_radius * 1.5),
        param1=param1,
        param2=param2,
        minRadius=min_radius,
        maxRadius=max_radius,
    )

    if circles is None or len(circles) == 0:
        return []

    circles = np.round(circles[0, :]).astype(np.float32)
    craters: list[Crater] = []

    for x, y, r in circles:
        craters.append(Crater(cx=float(x), cy=float(y), r=float(r), score=float(r)))

    # Sort largest craters first
    craters.sort(key=lambda c: c.r, reverse=True)
    return craters[:max_craters]
