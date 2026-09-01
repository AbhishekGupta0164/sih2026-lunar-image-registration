import json
from pathlib import Path
from selene.eval.report_pdf import generate_pdf_report
from selene.eval.metrics import MetricsResult

metrics = MetricsResult(
    n_raw=100, n_inliers=50, inlier_ratio=0.5, rmse_px=0.5, rmse_m=0.5,
    ce90_px=0.5, ce90_m=0.5, mean_residual_px=0.5, max_residual_px=0.5,
    rmse_val_px=0.5, rmse_val_m=0.5, nni_index=1.0, grid_coverage_fraction=0.5,
    gsd_m=1.0, rmse_vs_gt_px=0.5, rmse_vs_gt_m=0.5, provenance={}
)

job_dir = Path("/tmp")
plots = [
    Path("/tmp/plot_checkerboard.png"),
    Path("/tmp/plot_quiver.png"),
    Path("/tmp/plot_coverage.png"),
]
# create dummy plots
for p in plots:
    with open(p, "wb") as f:
        f.write(b"")

generate_pdf_report(job_dir, metrics, "test_job", plots)
print("PDF generated successfully.")
