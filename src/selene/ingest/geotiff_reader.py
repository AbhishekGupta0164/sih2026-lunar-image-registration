"""Read LRO NAC/WAC GeoTIFF reference mosaics via rasterio; expose CRS,
transform, nodata.

Owner: P1
"""
from __future__ import annotations

from pathlib import Path

import numpy as np


def read_geotiff(
    path: str | Path,
) -> tuple[np.ndarray, object, object, float | None]:
    """Load a single-band GeoTIFF and return its data plus geospatial metadata.

    The returned array is **float32 normalised to [0, 1]**.  For multi-band
    files, band 1 is used.  Nodata pixels are set to 0.

    Args:
        path: Path to the GeoTIFF file.

    Returns:
        Tuple of ``(array, CRS, Affine transform, nodata_value)``.
        *CRS* and *Affine* are :mod:`rasterio` objects; *nodata* may be None.

    Raises:
        ImportError: If rasterio is not installed.
        FileNotFoundError: If the file does not exist.
    """
    try:
        import rasterio
    except ImportError as exc:
        raise ImportError(
            "rasterio is required: conda install -c conda-forge rasterio"
        ) from exc

    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"GeoTIFF not found: {path}")

    with rasterio.open(str(path)) as src:
        crs = src.crs
        transform = src.transform
        nodata = src.nodata

        array = src.read(1).astype(np.float32)

        # Zero-out nodata pixels before normalisation
        if nodata is not None:
            array[array == nodata] = 0.0

        lo, hi = float(array.min()), float(array.max())
        if hi > lo:
            array = (array - lo) / (hi - lo)

    return array, crs, transform, nodata


def read_geotiff_clahe(
    path: str | Path,
    clip_limit: float = 2.0,
    tile_grid: tuple[int, int] = (8, 8),
) -> np.ndarray:
    """Load a GeoTIFF and apply CLAHE contrast enhancement.

    Useful for scenes with extreme dynamic range (deep craters, polar ice).

    Args:
        path:       Path to the GeoTIFF.
        clip_limit: CLAHE clip limit (higher = more contrast).
        tile_grid:  Tile grid size for CLAHE.

    Returns:
        uint8 array in [0, 255] after CLAHE.
    """
    import cv2  # opencv-python-headless

    array, *_ = read_geotiff(path)
    uint8 = (array * 255).clip(0, 255).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid)
    return clahe.apply(uint8)
