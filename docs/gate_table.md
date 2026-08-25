# Stage 5 Matcher Gate Table

| Condition | Expert |
|---|---|
| Same modality, |delta az| < 40 deg, GSD ratio < 4 | ALIKED/SuperPoint + LightGlue |
| Same modality, low texture (mare) | Dense matcher (GPU, optional) or phase congruency |
| |delta az| > 60 deg (polarity risk) | Hillshade or crater-graph ONLY — never raw-DN appearance matchers |
| IIRS <-> WAC/TMC | Mutual information + SIFT-on-stretched-band baseline |
| OHRC <-> TMC (20x scale) | Match at coarser common GSD first, propagate down |

Implemented in `src/selene/matchers/gate.py`. Keep this file and the code in sync.
