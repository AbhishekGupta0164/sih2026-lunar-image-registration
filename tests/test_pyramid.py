"""Tests for multi-scale GSD pyramid builder."""
import pytest
import numpy as np
from selene.geometry.pyramid import build_gsd_pyramid


def test_gsd_pyramid_halving():
    img = np.ones((512, 512), dtype=np.float32)
    pyramid = build_gsd_pyramid(img, gsd_m=0.5, max_levels=3)

    assert len(pyramid) == 3
    # coarsest level first
    assert pyramid[0][1] == 2.0  # 0.5 * 2 * 2
    assert pyramid[0][0].shape == (128, 128)
    # native resolution last
    assert pyramid[-1][1] == 0.5
    assert pyramid[-1][0].shape == (512, 512)
