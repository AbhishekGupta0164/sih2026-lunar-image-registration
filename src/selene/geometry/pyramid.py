"""Build a GSD pyramid IN METRES (not raw pixel octaves) — e.g. 80/20/5/1/0.25 m —
so OHRC is never matched to IIRS natively.  Matching always starts at the
coarsest common level.

Owner: P1
"""
from __future__ import annotations

import numpy as np
import cv2


def build_gsd_pyramid(
    img: np.ndarray,
    gsd_m: float,
    target_gsds: list[float] | None = None,
    max_levels: int = 5,
) -> list[tuple[np.ndarray, float]]:
    """Build a multi-scale image pyramid with explicit GSD labels.

    Args:
        img:          2D float32 (or uint8) input image.
        gsd_m:        Native GSD of *img* in metres per pixel.
        target_gsds:  Explicit list of desired GSDs (metres).  If provided,
                      the pyramid is built to hit those scales exactly.
                      Values coarser than *gsd_m* are downsampled; finer
                      values are ignored (we never upscale artificially).
        max_levels:   Maximum number of pyramid levels (used when
                      *target_gsds* is None).

    Returns:
        ``List[(image, gsd)]`` ordered **coarsest first**, with the native
        resolution appended last.  All images are float32.
    """
    if img.dtype != np.float32:
        img = img.astype(np.float32)

    if target_gsds is not None:
        pyramid: list[tuple[np.ndarray, float]] = []
        # Only keep scales coarser than native; sort coarsest → finest
        valid_gsds = sorted(
            [g for g in target_gsds if g > gsd_m], reverse=True
        )
        for tgt_gsd in valid_gsds:
            scale_factor = tgt_gsd / gsd_m          # > 1 ⇒ downsample
            new_h = max(4, int(img.shape[0] / scale_factor))
            new_w = max(4, int(img.shape[1] / scale_factor))
            resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            pyramid.append((resized, tgt_gsd))
        pyramid.append((img, gsd_m))   # finest = native
        return pyramid

    # ── Default: halve resolution per level ───────────────────────────────────
    coarses: list[tuple[np.ndarray, float]] = []
    current = img
    current_gsd = gsd_m
    for _ in range(max_levels - 1):
        new_h = max(4, current.shape[0] // 2)
        new_w = max(4, current.shape[1] // 2)
        current = cv2.resize(current, (new_w, new_h), interpolation=cv2.INTER_AREA)
        current_gsd *= 2.0
        coarses.append((current, current_gsd))

    # coarses is finest→coarsest; reverse so output is coarsest→finest
    return list(reversed(coarses)) + [(img, gsd_m)]


def resample_to_gsd(
    img: np.ndarray,
    src_gsd_m: float,
    target_gsd_m: float,
) -> np.ndarray:
    """Resample an image from *src_gsd_m* to *target_gsd_m*.

    Only downsamples (coarsens).  If *target_gsd_m* ≤ *src_gsd_m* the
    original array is returned unchanged — we never fabricate detail by
    upscaling.

    Args:
        img:          2D float32 (or uint8) input image.
        src_gsd_m:    Native GSD of the image in metres/pixel.
        target_gsd_m: Desired output GSD in metres/pixel.

    Returns:
        Resampled float32 image at *target_gsd_m* resolution.
    """
    if img.dtype != np.float32:
        img = img.astype(np.float32)

    if target_gsd_m <= src_gsd_m:
        return img.copy()

    scale = target_gsd_m / src_gsd_m  # > 1 ⇒ downsample
    new_h = max(4, int(img.shape[0] / scale))
    new_w = max(4, int(img.shape[1] / scale))
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)


def upscale_coordinates(
    pts: np.ndarray,
    from_gsd_m: float,
    to_gsd_m: float,
) -> np.ndarray:
    """Map pixel coordinates from one GSD space to another.

    Example: a point at (10, 10) in a 5 m/px image corresponds to
    (100, 100) in a 0.5 m/px image.

    Args:
        pts:        (N, 2) array of (x, y) coordinates in *from_gsd_m* space.
        from_gsd_m: GSD of the coordinate system *pts* are currently in.
        to_gsd_m:   GSD of the target coordinate system.

    Returns:
        (N, 2) float32 array of rescaled coordinates.
    """
    if len(pts) == 0:
        return pts.copy()
    scale = from_gsd_m / to_gsd_m  # > 1 when going coarse → fine
    return (pts * scale).astype(np.float32)
