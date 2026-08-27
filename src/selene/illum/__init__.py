"""Illumination package: normalises source/reference appearance so matchers
aren't fooled by sun-angle-driven crater polarity reversal.

Owner: P2
"""
from .hillshade import compute_hillshade, relight
from .phase_congruency import phase_congruency
from .census import census_transform, census_hamming_distance
from .shadow_mask import detect_shadows

__all__ = [
    "compute_hillshade",
    "relight",
    "phase_congruency",
    "census_transform",
    "census_hamming_distance",
    "detect_shadows",
]
