"""loguru-based structured logging setup, shared across all stages for
consistent job logs in the UI run view.

Owner: all
"""
from __future__ import annotations

import sys
from pathlib import Path

from loguru import logger


def setup_logging(
    job_id: str | None = None,
    log_dir: Path | None = None,
    level: str = "INFO",
) -> None:
    """Configure loguru sinks.

    Always adds a colourised console (stderr) sink.
    If *job_id* and *log_dir* are given, also writes JSON-lines to
    ``<log_dir>/<job_id>.jsonl`` for structured log ingestion.

    Args:
        job_id:  Unique identifier for the current pipeline run.
        log_dir: Directory to place the per-job log file.
        level:   Minimum log level for the console sink.
    """
    logger.remove()  # drop the default sink

    # ── Console (rich colours) ────────────────────────────────────────────────
    logger.add(
        sys.stderr,
        level=level,
        colorize=True,
        format=(
            "<green>{time:HH:mm:ss}</green> | "
            "<level>{level:<8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{line}</cyan> — "
            "<level>{message}</level>"
        ),
    )

    # ── Per-job JSON-lines file ────────────────────────────────────────────────
    if job_id and log_dir:
        log_dir = Path(log_dir)
        log_dir.mkdir(parents=True, exist_ok=True)
        log_path = log_dir / f"{job_id}.jsonl"
        logger.add(
            str(log_path),
            level="DEBUG",
            serialize=True,   # writes JSON objects
            rotation="50 MB",
            enqueue=True,     # thread-safe
        )


def get_logger(name: str = "selene"):
    """Return a loguru logger bound to a module name context.

    Usage::

        log = get_logger(__name__)
        log.info("Stage 1 complete")
    """
    return logger.bind(module=name)
