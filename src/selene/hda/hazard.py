import json
from pathlib import Path
import numpy as np
import cv2
import matplotlib.pyplot as plt

def generate_hazard_map(
    reference_image: np.ndarray,
    matches_csv_path: str | Path,
    shadow_mask: np.ndarray | None,
    out_dir: str | Path,
    dem_tile: np.ndarray | None = None
) -> dict:
    out_dir = Path(out_dir)
    h, w = reference_image.shape[:2]
    
    # 0 = SAFE, 1 = CAUTION, 2 = NO-GO
    hazard_map = np.zeros((h, w), dtype=np.uint8)
    
    # 1. Shadow fraction implies NO-GO
    if shadow_mask is not None:
        hazard_map[shadow_mask > 0] = 2
        
    # 2. Residual density / GCP confidence
    # Read matches to get confidence
    pts = []
    confs = []
    try:
        import csv
        with open(matches_csv_path) as f:
            reader = csv.DictReader(f)
            for row in reader:
                pts.append([float(row['ref_x']), float(row['ref_y'])])
                if 'confidence' in row:
                    confs.append(float(row['confidence']))
                else:
                    confs.append(1.0)
    except Exception:
        pass
        
    if pts:
        pts = np.array(pts)
        confs = np.array(confs)
        # Low confidence areas = CAUTION
        # Interpolate confidence over grid
        from scipy.interpolate import griddata
        grid_y, grid_x = np.mgrid[0:h, 0:w]
        if len(pts) >= 4:
            conf_grid = griddata(pts, confs, (grid_x, grid_y), method='linear', fill_value=0.0)
            hazard_map[(conf_grid < 0.5) & (hazard_map == 0)] = 1
            
    # 3. Slope from DEM if available
    if dem_tile is not None and dem_tile.shape == reference_image.shape:
        dy, dx = np.gradient(dem_tile)
        slope = np.sqrt(dx**2 + dy**2)
        hazard_map[(slope > 15.0) & (hazard_map < 2)] = 2
        
    # Export hazard map tif
    cv2.imwrite(str(out_dir / "hazard_map.tif"), hazard_map)
    
    # Export overlay plot
    plt.figure(figsize=(10, 10))
    plt.imshow(reference_image, cmap='gray')
    
    # Red for NO-GO, Yellow for CAUTION
    cmap = plt.cm.colors.ListedColormap(['none', 'yellow', 'red'])
    plt.imshow(hazard_map, cmap=cmap, alpha=0.4)
    plt.axis('off')
    plt.title("HDA-style Uncertainty Product (SAFE / CAUTION / NO-GO)")
    plt.savefig(out_dir / "plot_hazard_overlay.png", bbox_inches='tight', dpi=150)
    plt.close()
    
    stats = {
        "safe_fraction": float(np.mean(hazard_map == 0)),
        "caution_fraction": float(np.mean(hazard_map == 1)),
        "no_go_fraction": float(np.mean(hazard_map == 2)),
        "dem_included": dem_tile is not None
    }
    with open(out_dir / "hazard_stats.json", "w") as f:
        json.dump(stats, f, indent=2)
        
    return stats
