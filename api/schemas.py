"""Pydantic request/response models for the job API.

Owner: P4
"""
from pydantic import BaseModel


class JobRequest(BaseModel):
    src_pair_id: str   # references a folder under data/samples/, or an uploaded pair


class JobStatus(BaseModel):
    job_id: str
    stage: str          # one of the Stage 0-8 names from docs/architecture.md
    progress: float      # 0.0-1.0
    done: bool
