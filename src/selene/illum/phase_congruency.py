"""Phase congruency via log-Gabor filter bank for illumination-invariant feature extraction.

Owner: P2
"""
from __future__ import annotations

import numpy as np


def phase_congruency(
    img: np.ndarray,
    nscale: int = 3,
    norient: int = 4,
    min_wave_length: float = 3.0,
    mult: float = 2.1,
    sigma_on_f: float = 0.55,
) -> np.ndarray:
    """Compute 2D Phase Congruency using Log-Gabor filter banks.

    Phase congruency provides an illumination- and contrast-invariant representation
    of feature boundaries, crucial for cross-illumination lunar matching.

    Args:
        img: 2D input image (float32 or uint8).
        nscale: Number of wavelet scales.
        norient: Number of filter orientations.
        min_wave_length: Wavelength of smallest scale filter.
        mult: Scaling factor between successive filters.
        sigma_on_f: Ratio of the standard deviation of Gaussian describing
                    the log-Gabor filter's transfer function in frequency domain.

    Returns:
        float32 2D array in [0, 1] representing phase congruency energy.
    """
    img_f = img.astype(np.float32)
    if img_f.max() > 1.0:
        img_f = img_f / 255.0

    rows, cols = img_f.shape
    imagefft = np.fft.fft2(img_f)

    # Construct frequency grid
    u, v = np.meshgrid(
        np.fft.fftfreq(cols),
        np.fft.fftfreq(rows)
    )
    radius = np.sqrt(u**2 + v**2)
    theta = np.arctan2(-v, u)

    # Avoid zero division at origin
    radius[0, 0] = 1.0

    total_energy = np.zeros((rows, cols), dtype=np.float32)
    total_sum_an = np.zeros((rows, cols), dtype=np.float32)

    for o in range(norient):
        angle = o * np.pi / norient
        # Angular filter component
        dtheta = np.abs(theta - angle)
        dtheta = np.minimum(dtheta, np.pi - dtheta)
        spread = np.cos(dtheta) ** 2

        sum_e = np.zeros((rows, cols), dtype=np.float32)
        sum_o = np.zeros((rows, cols), dtype=np.float32)
        sum_an = np.zeros((rows, cols), dtype=np.float32)

        for s in range(nscale):
            wavelength = min_wave_length * (mult ** s)
            fo = 1.0 / wavelength
            # Log-Gabor filter
            log_gabor = np.exp(-((np.log(radius / fo)) ** 2) / (2 * (np.log(sigma_on_f)) ** 2))
            log_gabor[0, 0] = 0.0  # Zero DC component

            filt = log_gabor * spread
            # Filter in frequency domain
            f_img = np.fft.ifft2(imagefft * filt)
            even = np.real(f_img)
            odd = np.imag(f_img)

            sum_e += even
            sum_o += odd
            sum_an += np.sqrt(even**2 + odd**2)

        # Local energy for orientation o
        energy = np.sqrt(sum_e**2 + sum_o**2)
        total_energy += energy
        total_sum_an += sum_an

    # Phase congruency = Energy / (Sum of Amplitudes + epsilon)
    pc = total_energy / (total_sum_an + 1e-4)
    pc = (pc - pc.min()) / (pc.max() - pc.min() + 1e-6)
    return np.clip(pc, 0.0, 1.0).astype(np.float32)
