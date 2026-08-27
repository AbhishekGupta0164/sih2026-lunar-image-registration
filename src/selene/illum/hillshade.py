"""DEM hillshade relight using sun az/el.

Owner: P2
"""
from __future__ import annotations

import numpy as np


def compute_hillshade(
    dem: np.ndarray,
    sun_azimuth_deg: float,
    sun_elevation_deg: float,
    cell_size_m: float = 1.0,
) -> np.ndarray:
    """Compute synthetic hillshade from a digital elevation model (DEM).

    Args:
        dem: 2D float32 DEM array representing surface elevation in metres.
        sun_azimuth_deg: Solar azimuth in degrees (0=N, 90=E, 180=S, 270=W).
        sun_elevation_deg: Solar elevation above horizon in degrees (0-90).
        cell_size_m: Ground resolution in metres per pixel.

    Returns:
        float32 array normalized to [0, 1] representing shaded relief.
    """
    if dem.ndim != 2:
        raise ValueError("DEM must be a 2D array")

    dem = dem.astype(np.float32)

    # Gradients (finite differences)
    gy, gx = np.gradient(dem, cell_size_m)

    # Slope and aspect
    slope = np.arctan(np.sqrt(gx**2 + gy**2))
    aspect = np.arctan2(-gx, gy)

    # Illumination angles in radians
    # Convert azimuth to math angle (counter-clockwise from East)
    azimuth_rad = np.radians(360.0 - sun_azimuth_deg + 90.0) % (2 * np.pi)
    zenith_rad = np.radians(90.0 - sun_elevation_deg)

    # Lambertian shading formula
    shaded = np.cos(zenith_rad) * np.cos(slope) + np.sin(zenith_rad) * np.sin(slope) * np.cos(azimuth_rad - aspect)
    shaded = np.clip(shaded, 0.0, 1.0)
    return shaded.astype(np.float32)


def relight(
    img: np.ndarray,
    src_az: float,
    src_el: float,
    tgt_az: float,
    tgt_el: float,
    approx_dem: np.ndarray | None = None,
) -> np.ndarray:
    """Relight an image from src sun angle to tgt sun angle.

    If approx_dem is not provided, estimates surface normals from image gradients
    to adjust the photometric shading response.

    Args:
        img: 2D float32 or uint8 input image.
        src_az: Source sun azimuth in degrees.
        src_el: Source sun elevation in degrees.
        tgt_az: Target sun azimuth in degrees.
        tgt_el: Target sun elevation in degrees.
        approx_dem: Optional DEM array.

    Returns:
        float32 relit image in [0, 1].
    """
    img_f = img.astype(np.float32)
    if img_f.max() > 1.0:
        img_f = img_f / 255.0

    if approx_dem is not None:
        src_shade = compute_hillshade(approx_dem, src_az, src_el)
        tgt_shade = compute_hillshade(approx_dem, tgt_az, tgt_el)
        # Avoid divide-by-zero
        ratio = (tgt_shade + 0.1) / (src_shade + 0.1)
        relit = np.clip(img_f * ratio, 0.0, 1.0)
        return relit

    # Approximate pseudo-relighting via directional gradient rotation
    delta_az = np.radians(tgt_az - src_az)
    gy, gx = np.gradient(img_f)
    rot_gx = gx * np.cos(delta_az) - gy * np.sin(delta_az)
    rot_gy = gx * np.sin(delta_az) + gy * np.cos(delta_az)

    # Reconstitute intensity with adjusted directional shading
    relit = img_f + 0.5 * (rot_gx - gx + rot_gy - gy)
    relit = (relit - relit.min()) / (relit.max() - relit.min() + 1e-6)
    return np.clip(relit, 0.0, 1.0).astype(np.float32)
