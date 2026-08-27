"""Job submission and status endpoints.

Owner: P4
"""
from __future__ import annotations

import json
import uuid
from pathlib import Path
from fastapi import APIRouter, HTTPException, BackgroundTasks
from api.schemas import JobRequest, JobStatus
from selene.cli import run_pipeline
from selene.config import PipelineConfig

router = APIRouter()

JOBS_DB: dict[str, dict] = {}


def _run_job_bg(job_id: str, src_path: str, ref_path: str, config_dict: dict | None):
    try:
        cfg = PipelineConfig(**(config_dict or {}))
        job_dir = Path("products") / job_id
        res = run_pipeline(src_path, ref_path, job_dir, cfg, job_id=job_id)
        JOBS_DB[job_id]["done"] = True
        JOBS_DB[job_id]["status"] = "success"
        JOBS_DB[job_id]["stage"] = "Stage 8: Completed"
        JOBS_DB[job_id]["progress"] = 1.0
        JOBS_DB[job_id]["metrics"] = res["metrics"]
    except Exception as e:
        JOBS_DB[job_id]["done"] = True
        JOBS_DB[job_id]["status"] = "failed"
        JOBS_DB[job_id]["error"] = str(e)


@router.post("", response_model=JobStatus)
def create_job(req: JobRequest, background_tasks: BackgroundTasks):
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    JOBS_DB[job_id] = {
        "job_id": job_id,
        "stage": "Stage 0: Initializing",
        "progress": 0.1,
        "done": False,
        "status": "running",
        "metrics": None,
        "error": None,
    }

    src = req.src_path or "data_generation/output/synthetic_target.png"
    ref = req.ref_path or "data_generation/output/reference.png"

    background_tasks.add_task(_run_job_bg, job_id, src, ref, req.config)
    return JobStatus(**JOBS_DB[job_id])


@router.get("/{job_id}", response_model=JobStatus)
def get_job_status(job_id: str):
    if job_id not in JOBS_DB:
        # Check if exists on filesystem
        metrics_p = Path("products") / job_id / "metrics.json"
        if metrics_p.exists():
            with open(metrics_p) as f:
                metrics = json.load(f)
            return JobStatus(
                job_id=job_id,
                stage="Stage 8: Completed",
                progress=1.0,
                done=True,
                status="success",
                metrics=metrics,
            )
        raise HTTPException(status_code=404, detail="Job not found")

    return JobStatus(**JOBS_DB[job_id])
