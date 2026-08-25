"""The single most important regression test in this repo.

Owner: P2. Render a synthetic DEM crater field under two opposite sun
azimuths (a real polarity flip: bright rim <-> dark rim). Assert:
  1. The SIFT baseline (matchers/sift_baseline.py) fails or collapses to a
     low inlier ratio.
  2. The crater-graph / hillshade path (craters/graph_match.py,
     illum/hillshade.py) still produces a usable set of inliers.

This is your strongest, most automatable piece of evidence for the
"why not just SIFT" slide -- keep it green.
"""
import pytest


@pytest.mark.skip(reason="Implement once illum/hillshade.py and craters/graph_match.py exist")
def test_sift_fails_crater_graph_succeeds_on_polarity_flip():
    ...
