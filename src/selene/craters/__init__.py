"""Crater-structure package: the sun-angle-robust backbone for opposite-azimuth pairs.

Owner: P2
"""
from .detector import detect_craters, Crater
from .graph_match import build_crater_graph, match_crater_graphs

__all__ = [
    "detect_craters",
    "Crater",
    "build_crater_graph",
    "match_crater_graphs",
]
