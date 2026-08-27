"""FastAPI application entrypoint.

Owner: P4
Run: uvicorn api.main:app --reload --port 8000
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.routes import jobs, samples, register

app = FastAPI(
    title="SELENE-MATCH API",
    version="0.1.0",
    description="Multi-modal, sun-angle and scale-invariant lunar image registration service.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(samples.router, prefix="/samples", tags=["samples"])
app.include_router(register.router, tags=["register"])

# Mount products directory as static files for download/viewing
products_path = Path("products")
products_path.mkdir(parents=True, exist_ok=True)
app.mount("/products", StaticFiles(directory=str(products_path)), name="products")


@app.get("/health")
def health():
    return {"status": "ok", "service": "SELENE-MATCH"}
