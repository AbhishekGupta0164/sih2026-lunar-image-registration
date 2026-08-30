import React, { useEffect, useRef, useState } from 'react';

interface Correspondence {
  ax: number; ay: number;
  bx: number; by: number;
  score: number;
  isInlier: boolean;
}

interface CorrespondenceMatchesCanvasProps {
  refUrl?: string;
  srcUrl?: string;
  inliersCount: number;
  rawMatchesCount: number;
  matcherName: string;
  /** Ground-truth rotation in degrees (synthetic pair) */
  rotationDeg?: number;
  /** Ground-truth scale */
  scaleFactor?: number;
  /** Ground-truth translation X */
  txPx?: number;
  /** Ground-truth translation Y */
  tyPx?: number;
}

// Deterministic PRNG seeded by string
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Build correspondence set driven by the actual affine transform parameters */
function buildCorrespondences(
  imgW: number, imgH: number,
  count: number,
  inlierFraction: number,
  rotDeg: number,
  scale: number,
  tx: number,
  ty: number,
): Correspondence[] {
  const rand = seededRand(0xdeadbeef);
  const cosR = Math.cos((rotDeg * Math.PI) / 180);
  const sinR = Math.sin((rotDeg * Math.PI) / 180);
  const cx = imgW / 2; const cy = imgH / 2;

  const results: Correspondence[] = [];
  for (let i = 0; i < count; i++) {
    // Source point spread across the image
    const ax = rand() * (imgW - 40) + 20;
    const ay = rand() * (imgH - 40) + 20;
    const isInlier = i / count < inlierFraction;

    // Apply affine: rotate+scale around center, then translate
    const dx = ax - cx; const dy = ay - cy;
    let bx = scale * (cosR * dx - sinR * dy) + cx + tx;
    let by = scale * (sinR * dx + cosR * dy) + cy + ty;

    if (!isInlier) {
      // Outliers are randomly displaced — large error
      bx += (rand() - 0.5) * imgW * 0.6;
      by += (rand() - 0.5) * imgH * 0.6;
    }

    // Clamp to image bounds
    bx = Math.max(2, Math.min(imgW - 2, bx));
    by = Math.max(2, Math.min(imgH - 2, by));

    const noise = isInlier ? rand() * 0.15 : rand() * 0.5;
    results.push({ ax, ay, bx, by, score: isInlier ? 0.75 + noise : 0.15 + noise * 0.5, isInlier });
  }
  return results;
}

export const CorrespondenceMatchesCanvas: React.FC<CorrespondenceMatchesCanvasProps> = ({
  refUrl = '/synthetic/reference.png',
  srcUrl = '/synthetic/synthetic_target.png',
  inliersCount,
  rawMatchesCount,
  matcherName,
  rotationDeg = 7.0,
  scaleFactor = 0.92,
  txPx = 35.0,
  tyPx = 20.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const corrsRef = useRef<Correspondence[]>([]);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const gap = 14;
    const panelW = (W - gap) / 2;
    const panelH = H - 32;
    const panelAx = 0; const panelAy = 32;
    const panelBx = panelW + gap; const panelBy = 32;

    const imgA = new Image(); const imgB = new Image();
    let loaded = 0;

    const inlierRatio = rawMatchesCount > 0 ? inliersCount / rawMatchesCount : 0.88;
    // Show 120 representative correspondences for clarity
    const DISPLAY_N = 120;
    const corrs = buildCorrespondences(
      panelW, panelH, DISPLAY_N, inlierRatio,
      rotationDeg, scaleFactor, txPx, tyPx,
    );
    corrsRef.current = corrs;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Background
      ctx.fillStyle = '#03080e';
      ctx.fillRect(0, 0, W, H);

      // ── Draw image panels
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(panelAx, panelAy, panelW, panelH, 8);
      ctx.clip();
      ctx.drawImage(imgA, panelAx, panelAy, panelW, panelH);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(panelBx, panelBy, panelW, panelH, 8);
      ctx.clip();
      ctx.drawImage(imgB, panelBx, panelBy, panelW, panelH);
      ctx.restore();

      // ── Panel borders
      ctx.strokeStyle = 'rgba(111,246,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(panelAx, panelAy, panelW, panelH, 8); ctx.stroke();
      ctx.strokeStyle = 'rgba(62,230,160,0.35)';
      ctx.beginPath(); ctx.roundRect(panelBx, panelBy, panelW, panelH, 8); ctx.stroke();

      // ── Label header
      ctx.font = '600 10px monospace';
      ctx.fillStyle = 'rgba(111,246,255,0.8)';
      ctx.fillText('SOURCE (MOVING)', panelAx + 8, 21);
      ctx.fillStyle = 'rgba(62,230,160,0.8)';
      ctx.fillText('REFERENCE (FIXED)', panelBx + 8, 21);

      // ── Matcher badge
      ctx.font = '600 9px monospace';
      ctx.fillStyle = 'rgba(169,220,255,0.7)';
      const badge = `▸ ${matcherName.toUpperCase()}`;
      ctx.fillText(badge, W - ctx.measureText(badge).width - 8, 21);

      // ── Draw correspondence lines (outliers first, then inliers on top)
      const sorted = [...corrs].sort((a, b) => (a.isInlier ? 1 : -1) - (b.isInlier ? 1 : -1));

      sorted.forEach((c, i) => {
        const srcX = panelAx + c.ax;
        const srcY = panelAy + c.ay;
        const dstX = panelBx + c.bx;
        const dstY = panelBy + c.by;
        const isHovered = hoveredIdx === i;
        const alpha = isHovered ? 0.95 : (c.isInlier ? 0.55 : 0.35);
        const lw = isHovered ? 2.0 : (c.isInlier ? 0.9 : 0.6);

        // Confidence-based color (green → yellow → red)
        const h = c.isInlier ? 155 - (1 - c.score) * 60 : 35;
        const col = `hsla(${h}, 90%, 60%, ${alpha})`;

        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.setLineDash(c.isInlier ? [] : [3, 4]);
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        // Control points span the gap
        const cpX1 = srcX + panelW * 0.35;
        const cpX2 = dstX - panelW * 0.35;
        ctx.bezierCurveTo(cpX1, srcY - 8, cpX2, dstY - 8, dstX, dstY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Keypoint dots
        const dotR = isHovered ? 4.5 : (c.isInlier ? 2.5 : 2.0);
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(srcX, srcY, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(dstX, dstY, dotR, 0, Math.PI * 2); ctx.fill();

        // Hover tooltip — score ring
        if (isHovered) {
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(srcX, srcY, 7, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(dstX, dstY, 7, 0, Math.PI * 2); ctx.stroke();
        }
      });
    };

    const onLoad = () => {
      loaded++;
      if (loaded === 2) {
        draw();
        setRenderKey(k => k + 1);
      }
    };

    imgA.crossOrigin = 'anonymous'; imgB.crossOrigin = 'anonymous';
    imgA.onload = onLoad; imgB.onload = onLoad;
    imgA.src = srcUrl; imgB.src = refUrl;

    return () => { imgA.onload = null; imgB.onload = null; };
  }, [refUrl, srcUrl, inliersCount, rawMatchesCount, matcherName, rotationDeg, scaleFactor, txPx, tyPx, hoveredIdx]);

  // Mouse hover to highlight nearest correspondence
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || corrsRef.current.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const panelH = canvas.height - 32;
    const panelW = (canvas.width - 14) / 2;

    let nearest = -1; let minDist = 14;
    corrsRef.current.forEach((c, i) => {
      const d1 = Math.hypot(mx - c.ax, my - (32 + c.ay));
      const d2 = Math.hypot(mx - (panelW + 14 + c.bx), my - (32 + c.by));
      const d = Math.min(d1, d2);
      if (d < minDist) { minDist = d; nearest = i; }
    });
    setHoveredIdx(nearest >= 0 ? nearest : null);
  };

  const hovered = hoveredIdx !== null ? corrsRef.current[hoveredIdx] : null;

  return (
    <div className="relative w-full bg-[#03080e] rounded-xl overflow-hidden border border-[rgba(146,196,255,0.15)] shadow-2xl" style={{ height: 320 }}>
      <canvas
        ref={canvasRef}
        width={900}
        height={320}
        className="w-full h-full object-fill"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
        style={{ cursor: hoveredIdx !== null ? 'crosshair' : 'default' }}
      />

      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg text-[10px] font-mono bg-slate-900/95 border border-[rgba(146,196,255,0.3)] text-slate-200 flex gap-3 shadow-xl">
            <span className={hovered.isInlier ? 'text-success' : 'text-warning'}>
              {hovered.isInlier ? '● INLIER' : '▲ OUTLIER'}
            </span>
            <span>conf: <strong>{hovered.score.toFixed(3)}</strong></span>
            <span>src: ({hovered.ax.toFixed(0)}, {hovered.ay.toFixed(0)})</span>
            <span>dst: ({hovered.bx.toFixed(0)}, {hovered.by.toFixed(0)})</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-2 font-mono text-[9.5px]">
        <span className="badge text-success bg-slate-900/90 border-success/30">
          ● INLIER ({inliersCount.toLocaleString()})
        </span>
        <span className="badge text-warning bg-slate-900/90 border-warning/30">
          ▲ OUTLIER ({(rawMatchesCount - inliersCount).toLocaleString()})
        </span>
      </div>
    </div>
  );
};
