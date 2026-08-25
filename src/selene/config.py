"""Central pydantic settings for the SELENE-MATCH pipeline.

Owner: P1 (Geometry & Ingest), consumed by every stage.
Freeze this schema early — every module below imports from here.
"""
from pydantic import BaseModel


class PipelineConfig(BaseModel):
    """Knobs that get written to products/<job>/config.yaml for reproducibility."""

    grid_cells: int = 8              # uniformity grid, Stage 6
    min_gcp_spacing_px: float = 15.0
    magsac_threshold_m: float = 5.0
    max_pyramid_levels: int = 5
    sun_azimuth_flip_deg: float = 60.0   # gate threshold, Stage 5
    overlap_min_fraction: float = 0.15   # Stage 0 pair-validity screen
