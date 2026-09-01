import numpy as np
from pathlib import Path
from selene.eval.plots import plot_checkerboard, plot_quiver, plot_coverage_heatmap, plot_residual_heatmap
from selene.eval.report_pdf import generate_pdf_report
from selene.eval.metrics import MetricsResult

metrics = MetricsResult(
    n_raw=100, n_inliers=50, inlier_ratio=0.5, rmse_px=0.5, rmse_m=0.5,
    ce90_px=0.5, ce90_m=0.5, mean_residual_px=0.5, max_residual_px=0.5,
    rmse_val_px=0.5, rmse_val_m=0.5, nni_index=1.0, grid_coverage_fraction=0.5,
    gsd_m=1.0, rmse_vs_gt_px=0.5, rmse_vs_gt_m=0.5, provenance={}
)

img_ref = np.zeros((1024, 1024), dtype=np.float32)
img_warped = np.zeros((1024, 1024), dtype=np.float32)
pts_src_final = np.array([[10, 10], [20, 20]], dtype=np.float32)
pts_ref_final = np.array([[11, 11], [21, 21]], dtype=np.float32)

out_path = Path("/tmp")
p_checker = plot_checkerboard(img_ref, img_warped, out_path / "plot_checkerboard.png")
print("plot_checkerboard done")
p_quiver = plot_quiver(pts_src_final, pts_ref_final, out_path / "plot_quiver.png")
print("plot_quiver done")
p_heatmap = plot_coverage_heatmap(pts_ref_final, out_path / "plot_coverage.png")
print("plot_coverage done")
p_residual = plot_residual_heatmap(pts_src_final, pts_ref_final, out_path / "plot_residual_heatmap.png")
print("plot_residual done")

pdf_report = generate_pdf_report(
    job_dir=out_path,
    metrics=metrics,
    job_id="test_job",
    plots=[p_checker, p_quiver, p_heatmap],
)
print("PDF done")
