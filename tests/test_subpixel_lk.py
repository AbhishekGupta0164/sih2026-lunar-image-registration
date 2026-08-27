"""Tests for subpixel Lucas-Kanade refinement."""
import pytest
import numpy as np
import cv2
from selene.warp.subpixel_lk import refine_subpixel_lk


def test_subpixel_lk_convergence():
    # Create smooth synthetic texture
    img_ref = np.zeros((200, 200), dtype=np.float32)
    cv2.circle(img_ref, (100, 100), 30, 1.0, -1)
    img_ref = cv2.GaussianBlur(img_ref, (15, 15), 3.0)

    # Shift by known subpixel amount (dx=0.4, dy=-0.3)
    M = np.array([[1.0, 0.0, 0.4], [0.0, 1.0, -0.3]], dtype=np.float32)
    img_mov = cv2.warpAffine(img_ref, M, (200, 200))

    pts_ref = np.array([[100.0, 100.0]], dtype=np.float32)
    pts_mov = np.array([[100.0, 100.0]], dtype=np.float32)  # Initial unrefined position

    refined_mov, valid = refine_subpixel_lk(
        img_ref, img_mov, pts_ref, pts_mov, patch_size=31, max_iters=30
    )

    assert valid[0] is True
    # The refined moving point should align back with the shifted position
    assert np.isclose(refined_mov[0, 0], 100.4, atol=0.1)
    assert np.isclose(refined_mov[0, 1], 99.7, atol=0.1)
