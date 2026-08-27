"""Extract sun azimuth/elevation, incidence angle, footprint polygon,
instrument id from PDS labels.  Fallback estimators are applied when a
field is absent (common with early ISSDC PRADAN releases).

Owner: P1
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ImageMetadata:
    """All per-image metadata needed by every downstream stage."""

    sun_azimuth: float = 90.0       # degrees, clockwise from North
    sun_elevation: float = 45.0     # degrees above horizon
    gsd_m: float = 5.0              # ground sampling distance (metres / pixel)
    sensor_id: str = "UNKNOWN"      # e.g. "OHRC", "TMC2", "LRO_NAC", "IIRS"
    footprint_wkt: str = ""         # WKT POLYGON of image footprint (lon/lat)
    incidence_angle: float = 45.0   # solar incidence angle (degrees from nadir)


def extract_metadata(label: dict[str, Any]) -> ImageMetadata:
    """Extract sun geometry, GSD and sensor from a PDS label dict.

    Handles both PVL ``Quantity`` objects (which carry a ``.value`` attribute)
    and plain Python scalars.  Falls back to sensible defaults when a field
    is missing — this is deliberately permissive so the pipeline does not
    abort on incomplete early-release labels.

    Args:
        label: Raw label dict as returned by ``pvl.load()`` or similar.

    Returns:
        Populated :class:`ImageMetadata`.
    """

    def _get(key: str, fallback: Any) -> Any:
        """Case-insensitive lookup with PVL Quantity unwrapping."""
        for k in (key, key.upper(), key.lower()):
            v = label.get(k)
            if v is not None:
                return v.value if hasattr(v, "value") else v
        return fallback

    # ── Sun geometry ──────────────────────────────────────────────────────────
    sun_az = float(_get("SOLAR_AZIMUTH", _get("SUB_SOLAR_AZIMUTH", 90.0)))
    sun_el = float(_get("SOLAR_ELEVATION", _get("SUB_SOLAR_ELEVATION", 45.0)))
    incidence = float(_get("INCIDENCE_ANGLE", round(90.0 - sun_el, 2)))

    # ── Ground sampling distance ───────────────────────────────────────────────
    # Priority: MAP_SCALE > PIXEL_SCALE > IMAGE_SCALE (all in m/px or km/px)
    gsd_raw = _get("MAP_SCALE", _get("PIXEL_SCALE", _get("IMAGE_SCALE", 5.0)))
    gsd = float(gsd_raw)
    if gsd > 1000:          # value was in km/px — convert to m/px
        gsd *= 1_000.0

    # ── Sensor identifier ──────────────────────────────────────────────────────
    sensor_raw = _get("INSTRUMENT_ID", _get("SENSOR_ID", "UNKNOWN"))
    sensor = str(sensor_raw).strip().strip('"').strip("'")

    # ── Footprint (best-effort; many labels lack this) ─────────────────────────
    footprint = str(_get("FOOTPRINT_GEOMETRY", _get("FOOTPRINT_POINT_LATITUDE", "")))

    return ImageMetadata(
        sun_azimuth=sun_az,
        sun_elevation=sun_el,
        gsd_m=gsd,
        sensor_id=sensor,
        footprint_wkt=footprint,
        incidence_angle=incidence,
    )
