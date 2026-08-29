import React, { useEffect, useRef } from 'react';

interface CorrespondenceMatchesCanvasProps {
  refUrl?: string;
  srcUrl?: string;
  inliersCount: number;
  rawMatchesCount: number;
  matcherName: string;
}

export const CorrespondenceMatchesCanvas: React.FC<CorrespondenceMatchesCanvasProps> = ({
  refUrl = '/synthetic/reference.png',
  srcUrl = '/synthetic/synthetic_target.png',
  inliersCount,
  rawMatchesCount,
  matcherName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const halfWidth = width / 2 - 10;

    const imgA = new Image();
    const imgB = new Image();

    let loaded = 0;
    const onImgLoad = () => {
      loaded++;
      if (loaded < 2) return;

      // Draw frames
      ctx.clearRect(0, 0, width, height);

      // Frame A (Source)
      ctx.drawImage(imgA, 10, 30, halfWidth, height - 40);
      // Frame B (Reference)
      ctx.drawImage(imgB, halfWidth + 20, 30, halfWidth, height - 40);

      // Draw Frame Labels & Borders
      ctx.strokeStyle = 'rgba(111, 246, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 30, halfWidth, height - 40);

      ctx.strokeStyle = 'rgba(62, 230, 160, 0.4)';
      ctx.strokeRect(halfWidth + 20, 30, halfWidth, height - 40);

      // Generate 24 correspondence match vectors
      const numLines = 24;
      for (let i = 0; i < numLines; i++) {
        const isInlier = i % 5 !== 0; // 80% inliers

        const ax = 10 + 20 + ((i * 31) % (halfWidth - 40));
        const ay = 30 + 20 + ((i * 47) % (height - 80));

        // Affine transformed corresponding point in Frame B
        const bx = halfWidth + 20 + 20 + ((i * 31) % (halfWidth - 40)) + 6;
        const by = 30 + 20 + ((i * 47) % (height - 80)) + 4;

        // Draw interest point dots
        ctx.fillStyle = isInlier ? '#3ee6a0' : '#ffb65c';
        ctx.beginPath();
        ctx.arc(ax, ay, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw correspondence vector line
        ctx.strokeStyle = isInlier ? 'rgba(62, 230, 160, 0.65)' : 'rgba(255, 182, 92, 0.55)';
        ctx.lineWidth = isInlier ? 1.2 : 0.9;
        ctx.setLineDash(isInlier ? [] : [3, 3]);

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.bezierCurveTo(
          ax + halfWidth * 0.4,
          ay - 15,
          bx - halfWidth * 0.4,
          by - 15,
          bx,
          by
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    imgA.crossOrigin = 'anonymous';
    imgB.crossOrigin = 'anonymous';
    imgA.onload = onImgLoad;
    imgB.onload = onImgLoad;

    imgA.src = srcUrl;
    imgB.src = refUrl;
  }, [refUrl, srcUrl, inliersCount, rawMatchesCount, matcherName]);

  return (
    <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-[rgba(146,196,255,0.18)] shadow-2xl">
      <div className="absolute top-2.5 left-3.5 z-10 flex items-center gap-3">
        <span className="badge font-mono text-[9px] bg-slate-900/80 text-brand-300">
          SOURCE FRAME (MOVING)
        </span>
        <span className="text-[10px] font-mono text-slate-500">→</span>
        <span className="badge font-mono text-[9px] bg-slate-900/80 text-success">
          REFERENCE FRAME (FIXED)
        </span>
      </div>

      <canvas ref={canvasRef} width={840} height={320} className="w-full h-full object-contain" />

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
