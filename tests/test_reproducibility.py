import pytest
import shutil
from pathlib import Path
from selene.cli import run_pipeline
from selene.config import PipelineConfig

def test_identical_input_gives_identical_metrics(tmp_path, monkeypatch):
    import sys
    monkeypatch.setitem(sys.modules, 'torch', None)
    
    # Dummy data (needs real or synthetic files, using something available if needed)
    # We will just write a simple synthetic test if we don't have files directly.
    # Actually let's just make a simple 64x64 black square as dummy since the pipeline might fail on black squares.
    import numpy as np
    import cv2
    
    src_path = tmp_path / "src.png"
    ref_path = tmp_path / "ref.png"
    
    # Create simple images with some features so matchers don't fail immediately
    np.random.seed(42)
    img = np.random.randint(0, 256, (128, 128), dtype=np.uint8)
    # add some strong corners
    cv2.rectangle(img, (20, 20), (60, 60), 255, -1)
    cv2.rectangle(img, (80, 80), (100, 100), 255, -1)
    
    cv2.imwrite(str(src_path), img)
    cv2.imwrite(str(ref_path), img)
    
    cfg = PipelineConfig()
    cfg.seed = 42
    
    r1 = run_pipeline(src_path, ref_path, out_dir=tmp_path / "repro_test_1", config=cfg)
    r2 = run_pipeline(src_path, ref_path, out_dir=tmp_path / "repro_test_2", config=cfg)
    
    assert r1["metrics"]["rmse_px"] == r2["metrics"]["rmse_px"]
    assert r1["metrics"]["n_inliers"] == r2["metrics"]["n_inliers"]
