import pytest
from pathlib import Path
import numpy as np
import cv2
from selene.ingest.validator import validate_pair

def test_validation_empty(tmp_path):
    f1 = tmp_path / "1.png"
    f2 = tmp_path / "2.png"
    f1.touch()
    f2.touch()
    res = validate_pair(str(f1), str(f2))
    assert not res.valid
    assert res.code == "EMPTY_FILE"

def test_validation_too_small(tmp_path):
    f1 = tmp_path / "1.png"
    f2 = tmp_path / "2.png"
    cv2.imwrite(str(f1), np.zeros((32, 32), dtype=np.uint8))
    cv2.imwrite(str(f2), np.zeros((32, 32), dtype=np.uint8))
    res = validate_pair(str(f1), str(f2))
    assert not res.valid
    assert res.code == "TOO_SMALL"

def test_validation_flat(tmp_path):
    f1 = tmp_path / "1.png"
    f2 = tmp_path / "2.png"
    cv2.imwrite(str(f1), np.zeros((100, 100), dtype=np.uint8))
    cv2.imwrite(str(f2), np.zeros((100, 100), dtype=np.uint8))
    res = validate_pair(str(f1), str(f2))
    assert not res.valid
    assert res.code == "FLAT_IMAGE"

def test_validation_identical(tmp_path):
    f1 = tmp_path / "1.png"
    f2 = tmp_path / "2.png"
    img = np.random.randint(0, 256, (100, 100), dtype=np.uint8)
    cv2.imwrite(str(f1), img)
    cv2.imwrite(str(f2), img)
    res = validate_pair(str(f1), str(f2))
    assert not res.valid
    assert res.code == "IDENTICAL_PAIR"

def test_validation_success(tmp_path):
    f1 = tmp_path / "1.png"
    f2 = tmp_path / "2.png"
    img1 = np.random.randint(0, 256, (100, 100), dtype=np.uint8)
    img2 = np.random.randint(0, 256, (100, 100), dtype=np.uint8)
    cv2.imwrite(str(f1), img1)
    cv2.imwrite(str(f2), img2)
    res = validate_pair(str(f1), str(f2))
    assert res.valid
