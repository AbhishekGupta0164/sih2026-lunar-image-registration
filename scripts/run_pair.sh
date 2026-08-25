#!/usr/bin/env bash
# Convenience wrapper around `selene run` for a single named sample pair.
# Usage: ./scripts/run_pair.sh ohrc_nac_pair1
set -euo pipefail
PAIR="${1:?Usage: run_pair.sh <sample_pair_dir_name>}"
DIR="data/samples/${PAIR}"

selene run --src "${DIR}"/*src* --ref "${DIR}"/*ref* --out "products/${PAIR}"
selene eval --job "products/${PAIR}"
