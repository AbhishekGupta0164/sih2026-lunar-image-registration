"""FastAPI application entrypoint.

Owner: P4
Run: uvicorn api.main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SELENE-MATCH API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server, local only
    allow_methods=["*"],
    allow_headers=["*"],
)

# from api.routes import jobs, samples
# app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
# app.include_router(samples.router, prefix="/samples", tags=["samples"])


@app.get("/health")
def health():
    return {"status": "ok"}
