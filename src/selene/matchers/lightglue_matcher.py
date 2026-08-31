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
) -> tuple[np.ndarray, np.ndarray, np.ndarray, str]:
    """Match image pairs using LightGlue neural feature matcher.

    Falls back cleanly to SIFT baseline if LightGlue / torch are not installed.

    Args:
        img_src: 2D array source image.
        img_ref: 2D array reference image.
        extractor: "superpoint" or "aliked" or "disk".
        device: "cpu" or "cuda".

    Returns:
        (pts_src, pts_ref, scores, matcher_used)
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

            # Unbatch dictionary outputs (batch size = 1)
            feats_src = {k: v[0] if isinstance(v, torch.Tensor) and v.ndim > 1 else v for k, v in feats_src.items()}
            feats_ref = {k: v[0] if isinstance(v, torch.Tensor) and v.ndim > 1 else v for k, v in feats_ref.items()}
            matches01 = {k: v[0] if isinstance(v, torch.Tensor) and v.ndim > 1 else v for k, v in matches01.items()}

            matches = matches01["matches"]
            if len(matches) < 4:
                pts_s, pts_r, scores = match_sift(img_src, img_ref)
                return pts_s, pts_r, scores, "sift_fallback"

            points0 = feats_src["keypoints"][matches[:, 0]]
            points1 = feats_ref["keypoints"][matches[:, 1]]
            scores = matches01["scores"]

            return (
                points0.cpu().numpy().astype(np.float32),
                points1.cpu().numpy().astype(np.float32),
                scores.cpu().numpy().astype(np.float32),
                "lightglue"
            )

    except (ImportError, RuntimeError) as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"LightGlue unavailable ({e}); falling back to SIFT")
        # Fallback gracefully to SIFT baseline
        pts_s, pts_r, scores = match_sift(img_src, img_ref)
        return pts_s, pts_r, scores, "sift_fallback"
