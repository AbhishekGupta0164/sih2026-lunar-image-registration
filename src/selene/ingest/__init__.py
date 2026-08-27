"""Ingest package: PDS3/PDS4/GeoTIFF readers → canonical Pair objects.

Owner: P1
"""
from .pair import Pair
from .metadata import ImageMetadata, extract_metadata
from .geotiff_reader import read_geotiff, read_geotiff_clahe
from .pds_reader import read_pds3, read_pds4

__all__ = [
    "Pair",
    "ImageMetadata",
    "extract_metadata",
    "read_geotiff",
    "read_geotiff_clahe",
    "read_pds3",
    "read_pds4",
]
