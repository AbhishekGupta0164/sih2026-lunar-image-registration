import numpy as np
from pathlib import Path
import sys

# Add src to pythonpath
sys.path.insert(0, str(Path("src").resolve()))
from selene.eval.plots import plot_residual_heatmap

pts_src = np.array([[10, 10], [500, 500]])
pts_ref = np.array([[10, 15], [500, 501]])
try:
    plot_residual_heatmap(pts_src, pts_ref, "test_heatmap.png")
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
