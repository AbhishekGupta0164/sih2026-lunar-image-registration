from typing import Any
import random
import numpy as np
import cv2

def set_reproducible_seed(seed: int) -> dict[str, Any]:
    """Set all project-relevant random seeds without requiring PyTorch."""
    random.seed(seed)
    np.random.seed(seed)
    cv2.setRNGSeed(seed)
    result: dict[str, Any] = {"seed": seed, "torch_seeded": False, "torch_deterministic": False}
    try:
        import torch

        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)
        # Benchmarking must not silently select non-deterministic cuDNN paths.
        torch.backends.cudnn.benchmark = False
        torch.backends.cudnn.deterministic = True
        result["torch_seeded"] = True
        result["torch_deterministic"] = True
    except ImportError:
        pass
    return result
