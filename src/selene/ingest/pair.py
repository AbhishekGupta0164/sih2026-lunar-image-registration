"""The canonical ``Pair`` dataclass — the single frozen schema every other
stage reads.  Do not add fields without a 2-minute sync with P2/P3/P4
(see README architecture note).

Owner: P1
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from .metadata import ImageMetadata, extract_metadata


@dataclass(frozen=True)
class Pair:
    """Immutable descriptor for a (reference, moving) image pair.

    Every pipeline stage receives and returns a ``Pair``; it is the single
    data-contract between stages.

    Attributes:
        ref_path:  Absolute or relative path to the reference image.
        mov_path:  Absolute or relative path to the moving (source) image.
        ref_meta:  Sun-angle / GSD metadata for the reference image.
        mov_meta:  Sun-angle / GSD metadata for the moving image.
    """

    ref_path: Path
    mov_path: Path
    ref_meta: ImageMetadata = field(default_factory=ImageMetadata)
    mov_meta: ImageMetadata = field(default_factory=ImageMetadata)

    # ── Constructors ──────────────────────────────────────────────────────────

    @classmethod
    def from_paths(
        cls,
        ref: str | Path,
        mov: str | Path,
        ref_label: dict | None = None,
        mov_label: dict | None = None,
    ) -> "Pair":
        """Build a :class:`Pair` from file paths, optionally with raw PDS label dicts.

        Args:
            ref:       Path to reference image (GeoTIFF or PDS file).
            mov:       Path to moving image.
            ref_label: Optional raw PDS label dict for the reference.
            mov_label: Optional raw PDS label dict for the moving image.

        Returns:
            Frozen :class:`Pair` instance.
        """
        ref_meta = extract_metadata(ref_label or {})
        mov_meta = extract_metadata(mov_label or {})
        return cls(
            ref_path=Path(ref),
            mov_path=Path(mov),
            ref_meta=ref_meta,
            mov_meta=mov_meta,
        )

    # ── Derived properties ────────────────────────────────────────────────────

    @property
    def delta_sun_az(self) -> float:
        """Absolute sun-azimuth difference between reference and moving image (°)."""
        return abs(self.ref_meta.sun_azimuth - self.mov_meta.sun_azimuth)

    @property
    def gsd_ratio(self) -> float:
        """GSD ratio ≥ 1.0.  Large values mean very different spatial resolutions."""
        a, b = self.ref_meta.gsd_m, self.mov_meta.gsd_m
        if b == 0.0:
            return 1.0
        return max(a, b) / min(a, b)

    @property
    def is_cross_sensor(self) -> bool:
        """True when reference and moving images come from different instruments."""
        return self.ref_meta.sensor_id != self.mov_meta.sensor_id

    def __repr__(self) -> str:  # noqa: D105
        return (
            f"Pair(ref={self.ref_path.name!r}, mov={self.mov_path.name!r}, "
            f"Δaz={self.delta_sun_az:.1f}°, gsd_ratio={self.gsd_ratio:.2f})"
        )
