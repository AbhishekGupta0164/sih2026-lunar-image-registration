import time
import json
import sys
from pathlib import Path

# Add src to sys.path so selene is discoverable
sys.path.insert(0, str(Path("src").resolve()))

from selene.cli import run_pipeline
from selene.config import load_config

def run_bench():
    config = load_config()
    src = Path("data/samples/hard_pair/source.tif")
    ref = Path("data/samples/hard_pair/reference.tif")
    
    results = []
    for method in ["sift", "xfeat", "loftr", "lightglue"]:
        config.matcher = method
        start_time = time.time()
        print(f"Running {method}...")
        try:
            res = run_pipeline(src, ref, Path(f"results/bench_{method}"), config, f"bench_{method}")
            elapsed = time.time() - start_time
            m = res["metrics"]
            results.append({
                "Algorithm": method.upper(),
                "Inlier_Ratio": f"{m.inlier_ratio*100:.1f}%",
                "Time_ms": f"{int(elapsed*1000)} ms",
                "RMSE_px": f"{m.rmse_px:.2f} px"
            })
            print(f"Success {method}")
        except Exception as e:
            print(f"Failed {method}: {e}")
            results.append({
                "Algorithm": method.upper(),
                "Inlier_Ratio": "Failed",
                "Time_ms": "-",
                "RMSE_px": "-"
            })
    
    with open("benchmark_results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("Benchmark complete. Saved to benchmark_results.json")
        
if __name__ == "__main__":
    run_bench()
