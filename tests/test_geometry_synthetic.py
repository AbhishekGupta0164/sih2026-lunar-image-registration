"""Synthetic geometry recovery test.

Owner: P1. Apply a known affine transform to a real TMC crop and confirm
the Tier-2 map-projection + matching pipeline recovers it to < 0.2 px.
Run this BEFORE touching real Chandrayaan-2 data.
"""
import pytest


@pytest.mark.skip(reason="Implement once geometry/mapproject_tier2.py exists")
def test_known_affine_recovered():
    ...
