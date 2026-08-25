#!/usr/bin/env bash
# Download free, public sample data for local development and demo.
#
# Sources (all free, registration-only where noted):
#   - ISSDC MapBrowse : https://chmapbrowse.issdc.gov.in/
#   - PRADAN          : https://pradan.issdc.gov.in/ch2/  (free ISRO login required)
#   - LROC NAC/WAC     : https://lroc.im-ldi.com/
#   - LROC QuickMap    : https://quickmap.lroc.im-ldi.com/
#   - SLDEM2015/LOLA   : PDS Geosciences Node (free, public)
#
# This script is a placeholder: PRADAN requires an authenticated session,
# so P1 should fill in the exact product IDs for the 4 chosen demo pairs
# here once accounts are set up (see README section 12 / Phase A).
set -euo pipefail

echo "TODO(P1): fill in curl/wget calls for the 4 chosen demo pairs:"
echo "  1) OHRC  <-> LRO NAC  (similar sun angle)"
echo "  2) TMC-2 <-> LRO NAC  (20x scale)"
echo "  3) IIRS  <-> LRO WAC  (cross-modal, ~320x scale vs OHRC)"
echo "  4) any pair with opposite sun azimuth (the 'why we exist' case)"
echo "Plus one clipped SLDEM2015/LOLA DEM tile covering all four footprints."
