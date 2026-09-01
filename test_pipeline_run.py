from selene.cli import run_pipeline
from selene.config import PipelineConfig

src = "data_generation/output/synthetic_target.png"
ref = "data_generation/output/reference.png"

res = run_pipeline(src, ref, "/tmp/out_job", PipelineConfig(), "test_job_123")
print("Success!", res["metrics"])
