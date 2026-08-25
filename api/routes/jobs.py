"""Job submission and status endpoints.

Owner: P4

    POST /jobs                 -> start a pipeline run on a src/ref pair
    GET  /jobs/{job_id}         -> poll stage/progress
    GET  /jobs/{job_id}/products -> list export bundle files
"""
from fastapi import APIRouter

router = APIRouter()

# TODO(P4): wire to src/selene/cli.py's run/eval/export functions
# once P1-P3's stage modules exist.
