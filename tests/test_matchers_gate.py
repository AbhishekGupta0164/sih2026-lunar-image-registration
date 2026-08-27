"""Tests for gated matcher decision routing."""
import pytest
from selene.config import PipelineConfig
from selene.ingest.pair import Pair
from selene.matchers.gate import select_matcher


def test_gate_routes_polar_opposite_azimuth():
    pair = Pair.from_paths(
        ref="ref.tif",
        mov="mov.tif",
        ref_label={"SOLAR_AZIMUTH": 30.0, "MAP_SCALE": 1.0},
        mov_label={"SOLAR_AZIMUTH": 210.0, "MAP_SCALE": 1.0},
    )
    # delta_az = 180° > 60°
    assert select_matcher(pair) == "crater_graph"


def test_gate_routes_cross_sensor_iirs():
    pair = Pair.from_paths(
        ref="ref.tif",
        mov="mov.tif",
        ref_label={"SOLAR_AZIMUTH": 40.0, "MAP_SCALE": 5.0, "INSTRUMENT_ID": "TMC2"},
        mov_label={"SOLAR_AZIMUTH": 50.0, "MAP_SCALE": 80.0, "INSTRUMENT_ID": "IIRS"},
    )
    assert select_matcher(pair) == "mutual_info"


def test_gate_routes_similar_illumination_lightglue():
    pair = Pair.from_paths(
        ref="ref.tif",
        mov="mov.tif",
        ref_label={"SOLAR_AZIMUTH": 45.0, "MAP_SCALE": 1.0, "INSTRUMENT_ID": "OHRC"},
        mov_label={"SOLAR_AZIMUTH": 55.0, "MAP_SCALE": 1.0, "INSTRUMENT_ID": "OHRC"},
    )
    assert select_matcher(pair) == "lightglue"
