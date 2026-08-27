"""OPTIONAL geometry backend: thin wrapper around ISIS3 (``isisimport``,
``spiceinit``, ``cam2map`` / ``mapproject``) and/or NASA Ames Stereo
Pipeline.  Feature-flagged; the pipeline must run correctly with this
disabled.

Owner: P1
"""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


class ISIS3NotAvailableError(RuntimeError):
    """Raised when ISIS3 binaries are not found on the system PATH."""


def _require_isis3(binary: str = "cam2map") -> None:
    """Assert that an ISIS3 binary is accessible; raise otherwise."""
    if shutil.which(binary) is None:
        raise ISIS3NotAvailableError(
            f"ISIS3 '{binary}' not found on PATH.  "
            "Install ISIS3 via conda-forge and activate the isis3 environment:\n"
            "  conda install -c conda-forge -c usgs-astrogeology isis\n"
            "  conda activate isis3\n"
            "  python -c 'import isisconverter'  # optional Python bindings"
        )


def run_spiceinit(cub_path: str | Path) -> None:
    """Attach SPICE kernels to an ISIS3 cube.

    Args:
        cub_path: Path to the ISIS3 ``.cub`` file.

    Raises:
        ISIS3NotAvailableError: If ``spiceinit`` is not installed.
        RuntimeError: If ``spiceinit`` exits with a non-zero return code.
    """
    _require_isis3("spiceinit")
    result = subprocess.run(
        ["spiceinit", f"from={cub_path}"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"spiceinit failed:\n{result.stderr}")


def run_cam2map(
    img_path: str | Path,
    out_path: str | Path,
    map_file: str | None = None,
    pixres: float | None = None,
) -> Path:
    """Map-project an ISIS3 cube using ``cam2map``.

    Args:
        img_path:  Input ISIS3 cube (``.cub``), must have SPICE attached.
        out_path:  Output map-projected cube path.
        map_file:  Optional ISIS3 map template (``.map``).  Defaults to the
                   camera model's native projection if not given.
        pixres:    Desired output pixel resolution (metres).  Passed as
                   ``pixres=mpp`` to ``cam2map`` when supplied.

    Returns:
        :class:`~pathlib.Path` to the output projected cube.

    Raises:
        ISIS3NotAvailableError: If ``cam2map`` is not installed.
        RuntimeError: If ``cam2map`` exits with a non-zero return code.
    """
    _require_isis3("cam2map")
    cmd: list[str] = ["cam2map", f"from={img_path}", f"to={out_path}"]
    if map_file:
        cmd.append(f"map={map_file}")
    if pixres is not None:
        cmd.extend(["pixres=mpp", f"resolution={pixres}"])

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"cam2map failed:\n{result.stderr}")
    return Path(out_path)
