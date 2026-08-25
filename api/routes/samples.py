"""Lists the pre-cleared demo pairs for the Pair Desk UI screen.

Owner: P4

    GET /samples -> [{ id, modality_src, modality_ref, sun_delta_deg, gsd_ratio }, ...]
"""
from fastapi import APIRouter

router = APIRouter()

# TODO(P4): read data/samples/*/ directory + metadata.json per pair
