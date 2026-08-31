import pytest
import numpy as np
from selene.matchers.lightglue_matcher import match_lightglue

def test_matcher_provenance(monkeypatch):
    # Mock torch import failure
    import sys
    monkeypatch.setitem(sys.modules, 'torch', None)
    
    img1 = np.random.rand(100, 100).astype(np.float32)
    img2 = np.random.rand(100, 100).astype(np.float32)
    
    # Should fall back to SIFT and return 'sift_fallback'
    pts1, pts2, scores, matcher = match_lightglue(img1, img2)
    assert matcher == "sift_fallback"
