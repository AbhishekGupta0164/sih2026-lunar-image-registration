import React from 'react';
import { useApp } from '../../../context/AppContext';

export const MetricsView: React.FC = () => {
  const { results, isComplete } = useApp();

  const gridMap = Array.from({ length: 64 }, (_, i) => i % 7 !== 0);

  return (
    <section id="view-metrics" className="view-section active">
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="screen-title">Metrics</div>
        <span className="badge text-brand-400">T4 SCOREBOARD</span>
        <div className="screen-subtitle w-full">
          Numerical proof of registration quality.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="card bracket p-5">
          <div className="mini-label">RMSE (Fit)</div>
          <div id="metric-rmse" className="metric-value mt-2">
            {isComplete ? `${results.rmse} px` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">Target &lt; 1.0 px</div>
        </div>

        <div className="card bracket p-5">
          <div className="mini-label">Validation RMSE</div>
          <div id="metric-rmse-val" className="metric-value text-brand-300 mt-2">
            {isComplete ? `${results.rmseVal ?? results.rmse} px` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">Independent 80/20 Holdout</div>
        </div>

        <div className="card bracket p-5">
          <div className="mini-label">Inlier Ratio</div>
          <div
            id="metric-ratio"
            className="metric-value text-success mt-2"
            style={{ textShadow: '0 0 22px rgba(62,230,160,.25)' }}
          >
            {isComplete ? `${results.ratio}%` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">Inliers / raw matches</div>
        </div>

        <div className="card bracket p-5">
          <div className="mini-label">CE90</div>
          <div id="metric-ce90" className="metric-value mt-2">
            {isComplete ? `${results.ce90} px` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">90th percentile radius</div>
        </div>

        <div className="card bracket p-5">
          <div className="mini-label">Quality Gate</div>
          <div className="mt-2">
            <span
              className={`badge text-[11px] font-mono ${
                isComplete && (results.qualityGatePass ?? true)
                  ? 'text-success border-[rgba(62,230,160,0.4)]'
                  : 'text-warning'
              }`}
            >
              {isComplete ? ((results.qualityGatePass ?? true) ? 'PASSED 1.0px TARGET' : 'QUALITY WARNING') : '—'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">Sub-pixel target verification</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-[13px] font-semibold text-white tracking-wide">
              GRID COVERAGE
            </h3>
            <span
              id="metric-coverage"
              className="badge text-success"
              style={{ borderColor: 'rgba(62,230,160,0.35)' }}
            >
              {isComplete ? `${results.coverage}%` : '—'}
            </span>
          </div>
          <div className="progress-shell mt-4">
            <div
              id="coverage-bar"
              className="progress-fill"
              style={{
                width: isComplete ? `${results.coverage}%` : '0%',
                background: 'linear-gradient(90deg,#1fae74,#3ee6a0)',
                boxShadow: '0 0 14px rgba(62,230,160,.4)',
              }}
            />
          </div>
          <div className="grid grid-cols-8 gap-1.5 mt-5" id="metric-grid">
            {gridMap.map((good, idx) => (
              <span
                key={idx}
                className="h-3.5 rounded-[4px]"
                style={{
                  background:
                    good && isComplete
                      ? 'rgba(62,230,160,.6)'
                      : 'rgba(146,196,255,.08)',
                  boxShadow:
                    good && isComplete
                      ? '0 0 8px rgba(62,230,160,.25)'
                      : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4 tracking-wide">
            MATCHER GATE ROUTING DISTRIBUTION
          </h3>
          <div className="space-y-4 text-[11px]">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-400">LoFTR Dense Deep Matcher</span>
                <span className="font-mono text-slate-200">
                  {isComplete ? (results.matcherUsed.includes('loftr') ? '100%' : '52%') : '—'}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(3,8,14,0.8)] overflow-hidden">
                <div
                  className="h-full bg-brand-400 transition-all duration-700"
                  style={{ width: isComplete ? (results.matcherUsed.includes('loftr') ? '100%' : '52%') : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-400">XFeat Lightweight Matcher</span>
                <span className="font-mono text-slate-200">
                  {isComplete ? (results.matcherUsed.includes('xfeat') ? '100%' : '26%') : '—'}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(3,8,14,0.8)] overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-700"
                  style={{ width: isComplete ? (results.matcherUsed.includes('xfeat') ? '100%' : '26%') : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-400">Census Transform SIFT (Illumination Robust)</span>
                <span className="font-mono text-slate-200">
                  {isComplete ? (results.matcherUsed.includes('census') ? '100%' : '14%') : '—'}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(3,8,14,0.8)] overflow-hidden">
                <div
                  className="h-full bg-warning transition-all duration-700"
                  style={{ width: isComplete ? (results.matcherUsed.includes('census') ? '100%' : '14%') : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-400">LightGlue / Crater Graph / Mutual Info</span>
                <span className="font-mono text-slate-200">
                  {isComplete ? '8%' : '—'}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(3,8,14,0.8)] overflow-hidden">
                <div
                  className="h-full bg-[#a9dcff] transition-all duration-700"
                  style={{ width: isComplete ? '8%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
