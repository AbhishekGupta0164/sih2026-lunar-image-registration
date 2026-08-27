"""Eval package: evaluation metrics (RMSE, CE90, NNI), verification plots (checkerboard, quiver), and PDF summary report.

Owner: P4
"""
from .metrics import compute_metrics, MetricsResult
from .uniformity import nni_score, grid_coverage
from .plots import plot_checkerboard, plot_quiver, plot_coverage_heatmap
from .report_pdf import generate_pdf_report

__all__ = [
    "compute_metrics",
    "MetricsResult",
    "nni_score",
    "grid_coverage",
    "plot_checkerboard",
    "plot_quiver",
    "plot_coverage_heatmap",
    "generate_pdf_report",
]
