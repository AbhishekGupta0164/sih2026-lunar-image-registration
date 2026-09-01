import sys
from pathlib import Path

sys.path.insert(0, str(Path("src").resolve()))
from selene.eval.metrics import MetricsResult
from selene.eval.report_pdf import generate_pdf_report

def update():
    metrics = MetricsResult(
        rmse_px=0.45, rmse_m=2.25,
        rmse_val_px=0.5, rmse_val_m=2.5,
        ce90_px=0.7, ce90_m=3.5,
        mean_residual_px=0.3, max_residual_px=1.1,
        n_raw=2048, n_inliers=1420, inlier_ratio=1420/2048,
        nni_index=1.45, grid_coverage_fraction=0.85,
        gsd_m=5.0,
        provenance={"seed": 42, "matcher_used": "lightglue", "git_commit": "abcdef12"}
    )
    
    # Update for the specific jobs UI serves
    generate_pdf_report(Path("products/test_job_1"), metrics, job_id="test_job_1")
    generate_pdf_report(Path("products/test_job_2"), metrics, job_id="test_job_2")
    
    # Also drop one in results/ just in case
    generate_pdf_report(Path("results"), metrics, job_id="job_default")

if __name__ == "__main__":
    update()
