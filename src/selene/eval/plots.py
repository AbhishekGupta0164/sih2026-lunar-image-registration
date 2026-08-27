"""Residual quiver plot, checkerboard overlay, coverage-grid heatmap using matplotlib.

Owner: P4
"""
from __future__ import annotations

from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt


def plot_checkerboard(
    img_ref: np.ndarray,
    img_warped: np.ndarray,
    out_path: str | Path,
    num_squares: int = 8,
) -> Path:
    """Generate checkerboard overlay of reference and registered/warped image.

    Args:
        img_ref: Reference image array.
        img_warped: Warped/registered image array.
        out_path: Output PNG path.
        num_squares: Number of checkerboard tiles per dimension.

    Returns:
        Path to saved PNG.
    """
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    h, w = img_ref.shape[:2]
    # Resize warped to match ref if needed
    if img_warped.shape[:2] != (h, w):
        import cv2
        img_warped = cv2.resize(img_warped, (w, h))

    sq_h = h // num_squares
    sq_w = w // num_squares

    checker = img_ref.copy().astype(np.float32)
    for i in range(num_squares):
        for j in range(num_squares):
            if (i + j) % 2 == 1:
                checker[i * sq_h : (i + 1) * sq_h, j * sq_w : (j + 1) * sq_w] = (
                    img_warped[i * sq_h : (i + 1) * sq_h, j * sq_w : (j + 1) * sq_w]
                )

    fig, ax = plt.subplots(figsize=(8, 8), dpi=150)
    ax.imshow(checker, cmap="gray")
    ax.set_title(f"Checkerboard Registration Overlay ({num_squares}x{num_squares})")
    ax.axis("off")
    plt.tight_layout()
    plt.savefig(str(out_path), bbox_inches="tight")
    plt.close(fig)
    return out_path


def plot_quiver(
    pts_src: np.ndarray,
    pts_ref: np.ndarray,
    out_path: str | Path,
    image_shape: tuple[int, int] = (1024, 1024),
    scale: float = 1.0,
) -> Path:
    """Plot displacement vector field (quiver plot) between correspondences."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    fig, ax = plt.subplots(figsize=(8, 8), dpi=150)
    h, w = image_shape

    if len(pts_src) > 0:
        dx = pts_ref[:, 0] - pts_src[:, 0]
        dy = pts_ref[:, 1] - pts_src[:, 1]
        ax.quiver(
            pts_src[:, 0],
            pts_src[:, 1],
            dx,
            dy,
            angles="xy",
            scale_units="xy",
            scale=scale,
            color="lime",
            width=0.003,
        )
        ax.scatter(pts_src[:, 0], pts_src[:, 1], c="red", s=10, label="GCPs")

    ax.set_xlim(0, w)
    ax.set_ylim(h, 0)  # Invert Y for image coordinate system
    ax.set_title("GCP Residual Vectors (Quiver Plot)")
    ax.set_xlabel("X (pixels)")
    ax.set_ylabel("Y (pixels)")
    plt.tight_layout()
    plt.savefig(str(out_path), bbox_inches="tight")
    plt.close(fig)
    return out_path


def plot_coverage_heatmap(
    pts: np.ndarray,
    out_path: str | Path,
    image_shape: tuple[int, int] = (1024, 1024),
    grid_cells: int = 8,
) -> Path:
    """Plot 2D spatial histogram heatmap of GCP coverage."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    h, w = image_shape
    fig, ax = plt.subplots(figsize=(8, 8), dpi=150)

    if len(pts) > 0:
        counts, xedges, yedges, img = ax.hist2d(
            pts[:, 0],
            pts[:, 1],
            bins=grid_cells,
            range=[[0, w], [0, h]],
            cmap="viridis",
        )
        plt.colorbar(img, ax=ax, label="GCP Count")

    ax.set_xlim(0, w)
    ax.set_ylim(h, 0)
    ax.set_title(f"GCP Uniformity & Density Heatmap ({grid_cells}x{grid_cells} Grid)")
    plt.tight_layout()
    plt.savefig(str(out_path), bbox_inches="tight")
    plt.close(fig)
    return out_path
