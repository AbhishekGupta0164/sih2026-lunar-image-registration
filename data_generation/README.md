# Data Generation & Baseline Verification Module

This directory contains the synthetic dataset generation and baseline evaluation pipeline for lunar image registration benchmarking.

## Features

1. **Synthetic Pair Generator (`generate_synthetic_pair.py`)**:
   - Takes raw Chandrayaan-2 OHRC / Lunar imagery (or generates procedural lunar terrain with crater distributions if no input image path is supplied).
   - Preprocesses & crops narrow regions, resizing to `1024x1024` benchmark standard.
   - Applies geometric transformation: Rotation ($7^\circ$), Scale ($0.92$), Translation ($dx=35\text{ px}, dy=20\text{ px}$).
   - Applies illumination variation via gamma correction ($\gamma = 0.7$) to simulate sun-angle shifts.
   - Exports `reference.png`, `synthetic_target.png`, and `ground_truth.json` containing exact transformation matrices (Affine 2x3, Homography 3x3, and inverse matrices).

2. **Baseline Evaluation Framework (`test_sift_baseline.py`)**:
   - Runs SIFT feature detection and FLANN matching with Lowe's ratio test.
   - Estimates Affine transformation matrix using RANSAC.
   - Evaluates Problem Statement (PS) metrics:
     - **RANSAC Inlier Ratio (%)**
     - **Sub-pixel Warp Grid RMSE (px)**
     - **Nearest Neighbor Index (NNI)** to quantify spatial distribution uniformity.
     - **4x4 Grid Coverage (%)** to ensure feature points are spread across the entire frame rather than concentrated in a single cluster.
   - Compares recovered parameters against Ground Truth and saves `sift_baseline_report.json` and visual diagnostic plot `sift_baseline_results.png`.

---

## Quick Start Commands

### 1. Generate Synthetic Dataset Pair

Run with default parameters (or procedural lunar terrain generator):
```bash
python -m data_generation.generate_synthetic_pair
```

Run with custom OHRC raw image input and transformation parameters:

**PowerShell (Multi-line):**
```powershell
python -m data_generation.generate_synthetic_pair `
  --image "C:\Users\veere\Desktop\Chandrayaan_IIR_raw_image\ch2_ohr_ncp_20210331T2033243734_b_brw_d18.png" `
  --rotation 7.0 `
  --scale 0.92 `
  --tx 35.0 `
  --ty 20.0 `
  --gamma 0.7 `
  --output_dir "data_generation/output"
```

**Single-line Command:**
```bash
python -m data_generation.generate_synthetic_pair --image "C:\Users\veere\Desktop\Chandrayaan_IIR_raw_image\ch2_ohr_ncp_20210331T2033243734_b_brw_d18.png" --rotation 7.0 --scale 0.92 --tx 35.0 --ty 20.0 --gamma 0.7 --output_dir "data_generation/output"
```

### 2. Evaluate Baseline SIFT + RANSAC Registration

```bash
python -m data_generation.test_sift_baseline --data_dir "data_generation/output"
```

---

## Generated Artifacts in `data_generation/output/`

| File | Description |
|---|---|
| [`reference.png`](file:///c:/Users/veere/Desktop/SIH%20Project/sih2026-lunar-image-registration/data_generation/output/reference.png) | Fixed reference lunar image (`1024x1024`) |
| [`synthetic_target.png`](file:///c:/Users/veere/Desktop/SIH%20Project/sih2026-lunar-image-registration/data_generation/output/synthetic_target.png) | Moving target image with applied geometric & illumination changes |
| [`ground_truth.json`](file:///c:/Users/veere/Desktop/SIH%20Project/sih2026-lunar-image-registration/data_generation/output/ground_truth.json) | Ground truth transformation matrices & parameter metadata |
| [`sift_baseline_report.json`](file:///c:/Users/veere/Desktop/SIH%20Project/sih2026-lunar-image-registration/data_generation/output/sift_baseline_report.json) | Quantitative evaluation metrics (RMSE, NNI, Inlier ratio, parameter errors) |
| [`sift_baseline_results.png`](file:///c:/Users/veere/Desktop/SIH%20Project/sih2026-lunar-image-registration/data_generation/output/sift_baseline_results.png) | 4-panel visual plot showing matches, spatial grid distribution, and residual difference |
