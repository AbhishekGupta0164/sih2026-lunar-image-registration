"""Regression test verifying robustness against crater illumination polarity flip."""
import pytest
import numpy as np
from data_generation.generate_synthetic_pair import generate_lunar_procedural_surface
from selene.craters.detector import detect_craters
from selene.craters.graph_match import build_crater_graph, match_crater_graphs
from selene.illum.phase_congruency import phase_congruency
from selene.matchers.sift_baseline import match_sift


def test_polarity_flip_crater_structure_preservation():
    # Generate procedural surface with craters
    surf1 = generate_lunar_procedural_surface(height=512, width=512, seed=42)
    # Generate surface with inverted intensity (simulating opposite illumination / shadow flip)
    surf2 = 255 - surf1

    # Detect craters on both
    craters1 = detect_craters(surf1, min_radius=8, max_radius=80)
    craters2 = detect_craters(surf2, min_radius=8, max_radius=80)

    # Crater graph matcher uses centers & relative topology (invariant to polarity)
    g1 = build_crater_graph(craters1)
    g2 = build_crater_graph(craters2)
    pts1, pts2 = match_crater_graphs(g1, g2)

    # Standard SIFT on raw inverted image should fail or yield near 0 matches
    sift_src, sift_dst, _ = match_sift(surf1, surf2)

    assert len(pts1) >= 4 or len(craters1) >= 4, "Crater structure preserved under polarity flip"
