import React from 'react';
import { useApp } from '../../../context/AppContext';

export const MatchesView: React.FC = () => {
  const { results, isComplete } = useApp();

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
            {isComplete ? results.raw.toLocaleString() : '—'}
          </div>
        </div>

        <div className="card bracket p-4">
          <div className="mini-label">Inliers</div>
          <div
            id="match-inliers"
            className="metric-value text-success mt-1.5"
            style={{ textShadow: '0 0 22px rgba(62,230,160,.3)' }}
          >
            {isComplete ? results.inliers.toLocaleString() : '—'}
          </div>
        </div>

        <div className="card bracket p-4">
          <div className="mini-label">Matcher</div>
          <div
            id="match-method"
            className="text-[22px] text-brand-300 font-medium mt-2 tracking-tight"
            style={{ textShadow: '0 0 22px rgba(111,246,255,.3)' }}
          >
            {isComplete ? results.matcherUsed.toUpperCase() : 'Not run'}
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
              INLIER
            </span>
            <span
              className="badge text-warning"
              style={{ borderColor: 'rgba(255,182,92,0.35)' }}
            >
              OUTLIER
            </span>
          </div>
        </div>

        <div className="h-72 term relative overflow-hidden flex items-center justify-around">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(146,196,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(146,196,255,0.12) 1px,transparent 1px)',
              backgroundSize: '10% 20%',
            }}
          />
          <div className="w-44 h-32 border border-success/40 rounded-lg relative flex items-center justify-center">
            <span className="absolute -top-5 left-0 font-mono text-[8px] text-slate-500 tracking-[0.16em]">
              SOURCE · FRAME A
            </span>
            <span className="font-mono text-[10px] text-slate-400">OHRC</span>
          </div>

          <div className="w-44 h-32 border border-brand-500/40 rounded-lg relative flex items-center justify-center">
            <span className="absolute -top-5 left-0 font-mono text-[8px] text-slate-500 tracking-[0.16em]">
              REFERENCE · FRAME B
            </span>
            <span className="font-mono text-[10px] text-slate-400">LRO NAC</span>
          </div>
        </div>

        <p className="font-mono text-[9px] text-slate-600 mt-3 tracking-[0.08em]">
          ▸ MAGSAC++ REMOVES GEOMETRICALLY INCONSISTENT CORRESPONDENCES BEFORE FINAL TRANSFORMATION.
        </p>
      </div>
    </section>
  );
};
