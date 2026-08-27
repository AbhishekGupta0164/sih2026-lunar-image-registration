"""Registration endpoint for direct multipart file upload and processing.

Owner: P4
"""
from __future__ import annotations

import shutil
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from selene.cli import run_pipeline
from selene.config import PipelineConfig

router = APIRouter()


@router.post("/register")
async def register_endpoint(
    ref_image: UploadFile = File(...),
    mov_image: UploadFile = File(...),
    config_json: str | None = Form(None),
):
    """Register moving image to reference image and return metrics + product URLs."""
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    job_dir = Path("products") / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    ref_save = job_dir / f"input_ref_{ref_image.filename}"
    mov_save = job_dir / f"input_mov_{mov_image.filename}"

    with open(ref_save, "wb") as f:
        shutil.copyfileobj(ref_image.file, f)
    with open(mov_save, "wb") as f:
        shutil.copyfileobj(mov_image.file, f)

    cfg = PipelineConfig()
    try:
        res = run_pipeline(
            src_path=mov_save,
            ref_path=ref_save,
            out_dir=job_dir,
            config=cfg,
            job_id=job_id,
        )
        return JSONResponse({
            "job_id": job_id,
            "status": "success",
            "metrics": res["metrics"],
            "registered_geotiff": f"/products/{job_id}/registered.tif",
            "matches_csv": f"/products/{job_id}/matches.csv",
            "pdf_report": f"/products/{job_id}/registration_report.pdf",
            "checkerboard": f"/products/{job_id}/plot_checkerboard.png",
            "quiver": f"/products/{job_id}/plot_quiver.png",
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
