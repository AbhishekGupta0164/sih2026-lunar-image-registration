# SELENE-MATCH — Layer Contracts

This is the frozen schema document. Everyone codes against these three
object shapes; nobody changes a field without a 2-minute sync with the
other three team members (see README §5 note).

## `Pair` (owner: P1, produced by `src/selene/ingest/pair.py`)
- `source`: array or COG path
- `reference`: array or COG path
- `source_gsd_m`, `reference_gsd_m`
- `sun_azimuth_deg`, `sun_elevation_deg` (source)
- `footprint`: polygon (lon/lat)
- `crs`
- `modality`: one of `OHRC | TMC2 | IIRS | NAC | WAC`

## `Match` (owner: P2/P3, produced by `src/selene/matchers/*`)
- `x_src`, `y_src` (grid px)
- `x_ref`, `y_ref` (grid px)
- `method`: which expert produced it (`sift | lightglue | phase_corr | mutual_info | crater_graph`)
- `score`
- `inlier`: bool, set after `robust/magsac.py`

## `Product` (owner: P4, produced by `src/selene/warp` + `src/selene/eval`)
- `registered_tif`: path
- `matches_csv`: path
- `metrics_json`: path (RMSE_px, RMSE_m, N_inlier, inlier_ratio, coverage, method_mix)
- `residual_png`, `checkerboard_png`
- `report_pdf`: path

See the full PDF blueprint (`docs/SELENE-MATCH_PS26166_Final_Blueprint.pdf`) for the complete
stage-by-stage algorithm design that produces these objects.
