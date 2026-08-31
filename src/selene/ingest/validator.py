from dataclasses import dataclass
from pathlib import Path
import numpy as np
from selene.cli import load_image_any

@dataclass
class ValidationResult:
    valid: bool
    code: str | None = None
    message: str | None = None

def validate_pair(ref_path: str, mov_path: str) -> ValidationResult:
    for p, name in [(ref_path, "reference"), (mov_path, "source")]:
        if not Path(p).exists() or Path(p).stat().st_size == 0:
            return ValidationResult(False, "EMPTY_FILE", f"{name} file missing or empty")
    try:
        ref_arr, _, _ = load_image_any(ref_path)
        mov_arr, _, _ = load_image_any(mov_path)
    except Exception as e:
        return ValidationResult(False, "UNREADABLE", f"Could not decode image: {e}")
    if min(ref_arr.shape[:2]) < 64 or min(mov_arr.shape[:2]) < 64:
        return ValidationResult(False, "TOO_SMALL", "Image below minimum 64x64")
    if np.std(ref_arr) < 1e-3 or np.std(mov_arr) < 1e-3:
        return ValidationResult(False, "FLAT_IMAGE", "Image appears blank/uniform")
    if ref_arr.shape == mov_arr.shape and np.array_equal(ref_arr, mov_arr):
        return ValidationResult(False, "IDENTICAL_PAIR", "Source and reference are identical")
    return ValidationResult(True)
