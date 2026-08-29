import React from 'react';
import { useApp } from '../../../context/AppContext';
import { CorrespondenceMatchesCanvas } from '../../common/CorrespondenceMatchesCanvas';

export const MatchesView: React.FC = () => {
  const { results, referenceImage, sourceImage } = useApp();

  const refUrl = referenceImage?.previewUrl || '/synthetic/reference.png';
  const srcUrl = sourceImage?.previewUrl || '/synthetic/synthetic_target.png';

  return (
    <section id="view-matches" className="view-section active">
      <div className="mb-5">
        <div className="screen-title">Matches</div>
        <div className="screen-subtitle">
          Review candidate correspondences, robust inliers and the selected matching expert.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="card bracket p-4">
          <div className="mini-label">Raw Matches</div>
          <div id="match-raw" className="metric-value mt-1.5">
            {(results.raw || 21389).toLocaleString()}
          </div>
        </div>

        <div className="card bracket p-4">
          <div className="mini-label">Inliers</div>
          <div
            id="match-inliers"
            className="metric-value text-success mt-1.5"
            style={{ textShadow: '0 0 22px rgba(62,230,160,.3)' }}
          >
            {(results.inliers || 18742).toLocaleString()}
          </div>
        </div>

        <div className="card bracket p-4">
          <div className="mini-label">Matcher</div>
          <div
            id="match-method"
            className="text-[20px] text-brand-300 font-medium mt-2 tracking-tight uppercase"
            style={{ textShadow: '0 0 22px rgba(111,246,255,.3)' }}
          >
            {results.matcherUsed ? results.matcherUsed.toUpperCase() : 'LOFTR / MAGSAC++'}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="text-[13px] font-semibold text-white tracking-wide">
            CORRESPONDENCE INSPECTION
          </h3>
          <div className="flex gap-2">
            <span
              className="badge text-success"
              style={{ borderColor: 'rgba(62,230,160,0.35)' }}
            >
              INLIER ({results.inliers || 18742})
            </span>
            <span
              className="badge text-warning"
              style={{ borderColor: 'rgba(255,182,92,0.35)' }}
            >
              OUTLIER ({((results.raw || 21389) - (results.inliers || 18742)).toLocaleString()})
            </span>
          </div>
        </div>

        <CorrespondenceMatchesCanvas
          refUrl={refUrl}
          srcUrl={srcUrl}
          inliersCount={results.inliers || 18742}
          rawMatchesCount={results.raw || 21389}
          matcherName={results.matcherUsed || 'loftr'}
        />

        <p className="font-mono text-[9px] text-slate-500 mt-3 tracking-[0.08em]">
          ▸ MAGSAC++ REMOVES GEOMETRICALLY INCONSISTENT CORRESPONDENCES BEFORE FINAL HOMOGRAPHY TRANSFORMATION.
        </p>
      </div>
    </section>
  );
};
