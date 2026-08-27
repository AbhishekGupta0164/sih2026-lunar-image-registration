"""ALIKED/SuperPoint + LightGlue matcher with graceful fallback to SIFT baseline.

Owner: P3
"""
from __future__ import annotations

import numpy as np
from .sift_baseline import match_sift


def match_lightglue(
    img_src: np.ndarray,
    img_ref: np.ndarray,
    extractor: str = "superpoint",
    device: str = "cpu",
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Match image pairs using LightGlue neural feature matcher.

    Falls back cleanly to SIFT baseline if LightGlue / torch are not installed.

    Args:
        img_src: 2D array source image.
        img_ref: 2D array reference image.
        extractor: "superpoint" or "aliked" or "disk".
        device: "cpu" or "cuda".

    Returns:
        (pts_src, pts_ref, scores)
    """
    try:
        import torch
        from lightglue import LightGlue, SuperPoint, ALIKED, DISK
        from lightglue.utils import numpy_image_to_torch

        # Prepare images for torch
        def _prepare(im):
            if im.ndim == 2:
                im_rgb = np.stack([im, im, im], axis=-1)
            else:
                im_rgb = im
            im_f = (im_rgb.astype(np.float32) - im_rgb.min()) / (im_rgb.max() - im_rgb.min() + 1e-6)
            return numpy_image_to_torch(im_f).to(device)

        t_src = _prepare(img_src)
        t_ref = _prepare(img_ref)

        if extractor.lower() == "aliked":
            fe = ALIKED(max_num_keypoints=2048).eval().to(device)
            matcher = LightGlue(features="aliked").eval().to(device)
        elif extractor.lower() == "disk":
            fe = DISK(max_num_keypoints=2048).eval().to(device)
            matcher = LightGlue(features="disk").eval().to(device)
        else:
            fe = SuperPoint(max_num_keypoints=2048).eval().to(device)
            matcher = LightGlue(features="superpoint").eval().to(device)

        with torch.inference_mode():
            feats_src = fe.extract(t_src)
            feats_ref = fe.extract(t_ref)
            matches01 = matcher({"image0": feats_src, "image1": feats_ref})

            feats_src, feats_ref, matches01 = [
                rb.squeeze(0) for rb in [feats_src, feats_ref, matches01]
            ]
            matches = matches01["matches"]
            points0 = feats_src["keypoints"][matches[..., 0]]
            points1 = feats_ref["keypoints"][matches[..., 1]]
            scores = matches01["scores"]

            return (
                points0.cpu().numpy().astype(np.float32),
                points1.cpu().numpy().astype(np.float32),
                scores.cpu().numpy().astype(np.float32),
            )

    except (ImportError, Exception):
        # Fallback gracefully to SIFT baseline
        return match_sift(img_src, img_ref)
