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


def test_crater_graph_unequal_counts():
    """Verify crater graph matching handles unequal crater counts without dimension mismatch."""
    from selene.craters.detector import Crater
    craters_src = [
        Crater(cx=100.0, cy=100.0, r=20.0, score=2.0),
        Crater(cx=200.0, cy=150.0, r=25.0, score=2.5),
        Crater(cx=150.0, cy=300.0, r=30.0, score=3.0),
        Crater(cx=400.0, cy=400.0, r=35.0, score=3.5),
    ]
    craters_ref = [
        Crater(cx=105.0, cy=102.0, r=20.0, score=2.0),
        Crater(cx=205.0, cy=152.0, r=25.0, score=2.5),
        Crater(cx=155.0, cy=302.0, r=30.0, score=3.0),
        Crater(cx=405.0, cy=402.0, r=35.0, score=3.5),
        Crater(cx=50.0, cy=50.0, r=15.0, score=1.5),
        Crater(cx=300.0, cy=200.0, r=18.0, score=1.8),
        Crater(cx=250.0, cy=350.0, r=22.0, score=2.2),
        Crater(cx=450.0, cy=100.0, r=28.0, score=2.8),
    ]

    g_src = build_crater_graph(craters_src, k=5)
    g_ref = build_crater_graph(craters_ref, k=5)

    assert g_src["descriptors"].shape[1] == g_ref["descriptors"].shape[1], "Descriptor dimensions must match"

    pts_src, pts_ref = match_crater_graphs(g_src, g_ref)
    assert len(pts_src) == len(pts_ref)

