import json
from pathlib import Path
import numpy as np
import cv2
import matplotlib.pyplot as plt

def compute_change_detection(
    registered_mov: np.ndarray,
    reference: np.ndarray,
    out_dir: str | Path,
    threshold: float = 0.15
) -> dict:
    """Register two same-sensor passes of one site -> diff -> threshold."""
    out_dir = Path(out_dir)
    
    if registered_mov.dtype == np.uint8:
        rm = registered_mov.astype(np.float32) / 255.0
    else:
        rm = registered_mov
        
    if reference.dtype == np.uint8:
        rf = reference.astype(np.float32) / 255.0
    else:
        rf = reference
        
    diff = np.abs(rm - rf)
    change_mask = (diff > threshold).astype(np.uint8)
    
    cv2.imwrite(str(out_dir / "change_map.png"), change_mask * 255)
    
    # Overlay plot
    plt.figure(figsize=(10, 10))
    plt.imshow(reference, cmap='gray')
    # highlight change in cyan
    overlay = np.zeros((*change_mask.shape, 4), dtype=np.float32)
    overlay[change_mask == 1] = [0.0, 1.0, 1.0, 0.6]
    plt.imshow(overlay)
    plt.axis('off')
    plt.title("Two-Epoch Change Detection (New Craters / Surface Disturbance)")
    plt.savefig(out_dir / "plot_change_overlay.png", bbox_inches='tight', dpi=150)
    plt.close()
    
    stats = {
        "change_fraction": float(np.mean(change_mask)),
        "threshold_used": threshold,
        "mean_absolute_difference": float(np.mean(diff))
    }
    
    with open(out_dir / "change_stats.json", "w") as f:
        json.dump(stats, f, indent=2)
        
    return stats
