# Evaluation Metrics — Definitions

- **RMSE_px / RMSE_m**: RMS residual on a HELD-OUT split of GCPs (never the fit set), in source
  pixels and metres.
- **N_raw / N_inlier**: match counts before/after MAGSAC++.
- **Inlier ratio**: N_inlier / N_raw.
- **CE90 / P90**: 90th-percentile residual (m) — robust to one bad point.
- **Coverage / Uniformity U**: 8x8 grid occupancy + normalised nearest-neighbour spacing,
  shadow-aware (empty shadow cells excluded from the denominator).
- **Method mix**: % of inliers contributed by each expert (crater graph / LightGlue /
  phase congruency / mutual information) — proves the ensemble is real.

Honest demo targets: see `docs/SELENE-MATCH_PS26166_Final_Blueprint.pdf`, section 7.
