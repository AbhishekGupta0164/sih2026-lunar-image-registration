"""Moon-body CRS definitions: selenographic equirectangular (mid-latitude
default) and polar stereographic (for high-latitude IIRS pairs).

Owner: P1
"""
from __future__ import annotations


# ── IAU Moon 2000 body-fixed equirectangular ───────────────────────────────
MOON_EQUIRECT: str = (
    'PROJCRS["Moon_Equidistant_Cylindrical",'
    'BASEGEOGCRS["GCS_Moon",'
    'DATUM["D_Moon",'
    'ELLIPSOID["Moon_2000_IAU_IAG",1737400,0,'
    'LENGTHUNIT["metre",1]]],'
    'PRIMEM["Reference_Meridian",0,'
    'ANGLEUNIT["degree",0.0174532925199433]],'
    'ID["IAU",30100]],'
    'CONVERSION["Equidistant Cylindrical",'
    'METHOD["Equidistant Cylindrical",'
    'ID["EPSG",1028]],'
    'PARAMETER["Latitude of 1st standard parallel",0,'
    'ANGLEUNIT["degree",0.0174532925199433]],'
    'PARAMETER["Longitude of natural origin",0,'
    'ANGLEUNIT["degree",0.0174532925199433]],'
    'PARAMETER["False easting",0,LENGTHUNIT["metre",1]],'
    'PARAMETER["False northing",0,LENGTHUNIT["metre",1]]],'
    'CS[Cartesian,2],'
    'AXIS["easting",east,ORDER[1],LENGTHUNIT["metre",1]],'
    'AXIS["northing",north,ORDER[2],LENGTHUNIT["metre",1]]]'
)

# ── North-pole stereographic ───────────────────────────────────────────────
MOON_STEREO_NORTH: str = (
    'PROJCRS["Moon_North_Pole_Stereographic",'
    'BASEGEOGCRS["GCS_Moon",'
    'DATUM["D_Moon",'
    'ELLIPSOID["Moon_2000_IAU_IAG",1737400,0,'
    'LENGTHUNIT["metre",1]]],'
    'PRIMEM["Reference_Meridian",0,'
    'ANGLEUNIT["degree",0.0174532925199433]]],'
    'CONVERSION["Stereographic",'
    'METHOD["Polar Stereographic (variant B)",'
    'ID["EPSG",9829]],'
    'PARAMETER["Latitude of standard parallel",90,'
    'ANGLEUNIT["degree",0.0174532925199433]],'
    'PARAMETER["Longitude of origin",0,'
    'ANGLEUNIT["degree",0.0174532925199433]],'
    'PARAMETER["False easting",0,LENGTHUNIT["metre",1]],'
    'PARAMETER["False northing",0,LENGTHUNIT["metre",1]]],'
    'CS[Cartesian,2],'
    'AXIS["easting",east,ORDER[1],LENGTHUNIT["metre",1]],'
    'AXIS["northing",north,ORDER[2],LENGTHUNIT["metre",1]]]'
)

# ── South-pole stereographic ───────────────────────────────────────────────
MOON_STEREO_SOUTH: str = (
    MOON_STEREO_NORTH
    .replace("North_Pole_Stereographic", "South_Pole_Stereographic")
    .replace('"Latitude of standard parallel",90,', '"Latitude of standard parallel",-90,')
)


def get_crs(lat: float) -> str:
    """Return the appropriate Moon CRS WKT string based on centre latitude.

    Args:
        lat: Centre latitude of the image in degrees (−90 … +90).

    Returns:
        WKT string for the recommended projection.
    """
    if lat > 70.0:
        return MOON_STEREO_NORTH
    if lat < -70.0:
        return MOON_STEREO_SOUTH
    return MOON_EQUIRECT
