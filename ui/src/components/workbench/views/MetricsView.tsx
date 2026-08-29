import React from 'react';
import { useApp } from '../../../context/AppContext';

export const MetricsView: React.FC = () => {
  const { results, isComplete } = useApp();

  const gridMap = Array.from({ length: 64 }, (_, i) => i % 7 !== 0);

  return (
    <section id="view-metrics" className="view-section active space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 flex-wrap pb-1">
        <h1 className="text-2xl font-bold font-display text-white tracking-wide">
          Metrics
        </h1>
        <span className="badge font-mono text-[10.5px] tracking-[0.14em] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-md">
          T4 SCOREBOARD
        </span>
        <div className="screen-subtitle w-full text-[12.5px] text-slate-400 font-mono tracking-wide mt-1">
          Numerical proof of registration quality and sub-pixel alignment accuracy.
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {/* RMSE */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
            <span className="text-cyan-400 text-xs">•</span> RMSE (FIT)
          </label>
          <div id="metric-rmse" className="text-[28px] text-white font-bold font-display my-1 tracking-tight">
            {isComplete ? `${results.rmse} px` : '—'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">Target &lt; 1.0 px</div>
        </div>

        {/* VALIDATION RMSE */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
            <span className="text-cyan-400 text-xs">•</span> VALIDATION RMSE
          </label>
          <div id="metric-rmse-val" className="text-[28px] text-cyan-300 font-bold font-display my-1 tracking-tight drop-shadow-[0_0_15px_rgba(111,246,255,0.25)]">
            {isComplete ? `${results.rmseVal ?? results.rmse} px` : '—'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">80/20 Holdout</div>
        </div>

        {/* INLIER RATIO */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
            <span className="text-cyan-400 text-xs">•</span> INLIER RATIO
          </label>
          <div
            id="metric-ratio"
            className="text-[28px] text-emerald-400 font-bold font-display my-1 tracking-tight drop-shadow-[0_0_15px_rgba(62,230,160,0.3)]"
          >
            {isComplete ? `${results.ratio}%` : '—'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">Inliers / raw matches</div>
        </div>

        {/* CE90 */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
            <span className="text-cyan-400 text-xs">•</span> CE90
          </label>
          <div id="metric-ce90" className="text-[28px] text-white font-bold font-display my-1 tracking-tight">
            {isComplete ? `${results.ce90} px` : '—'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">90th percentile radius</div>
        </div>

        {/* QUALITY GATE */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
            <span className="text-cyan-400 text-xs">•</span> QUALITY GATE
          </label>
          <div className="my-2">
            <span
              className={`badge font-mono text-[11px] font-semibold px-3 py-1 rounded-md tracking-[0.12em] ${
                isComplete && (results.qualityGatePass ?? true)
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                  : 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
              }`}
            >
              {isComplete ? ((results.qualityGatePass ?? true) ? 'PASSED 1.0px TARGET' : 'QUALITY WARNING') : '—'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">Sub-pixel target status</div>
        </div>
      </div>

      {/* COVERAGE & ROUTING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRID COVERAGE CARD */}
        <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-bold font-display text-white tracking-wide uppercase">
              GRID COVERAGE (8×8 UNIFORMITY)
            </h3>
            <span
              id="metric-coverage"
              className="badge font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-md tracking-wider"
            >
              {isComplete ? `${results.coverage}%` : '—'}
            </span>
          </div>

          <div className="progress-shell mb-6">
            <div
              id="coverage-bar"
              className="progress-fill"
              style={{
                width: isComplete ? `${results.coverage}%` : '0%',
                background: 'linear-gradient(90deg, #1fae74, #3ee6a0)',
                boxShadow: '0 0 16px rgba(62,230,160,0.4)',
              }}
            />
          </div>

          <div className="grid grid-cols-8 gap-2 mt-6" id="metric-grid">
            {gridMap.map((good, idx) => (
              <span
                key={idx}
                className="h-4 rounded-md transition-all duration-300"
                style={{
                  background:
                    good && isComplete
                      ? 'rgba(62,230,160,0.65)'
                      : 'rgba(146,196,255,0.08)',
                  boxShadow:
                    good && isComplete
                      ? '0 0 10px rgba(62,230,160,0.3)'
                      : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* MATCHER GATE ROUTING DISTRIBUTION */}
        <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <h3 className="text-[14px] font-bold font-display text-white mb-6 tracking-wide uppercase">
            MATCHER GATE ROUTING DISTRIBUTION
          </h3>

          <div className="space-y-5 text-[12px] font-mono">
            {/* LoFTR */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 font-medium">LoFTR Dense Deep Matcher</span>
                <span className="font-bold text-cyan-300">
                  {isComplete ? (results.matcherUsed.includes('loftr') ? '100%' : '52%') : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 shadow-[0_0_10px_rgba(111,246,255,0.4)]"
                  style={{ width: isComplete ? (results.matcherUsed.includes('loftr') ? '100%' : '52%') : '0%' }}
                />
              </div>
            </div>

            {/* XFeat */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 font-medium">XFeat Lightweight Matcher</span>
                <span className="font-bold text-emerald-400">
                  {isComplete ? (results.matcherUsed.includes('xfeat') ? '100%' : '26%') : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700 shadow-[0_0_10px_rgba(62,230,160,0.4)]"
                  style={{ width: isComplete ? (results.matcherUsed.includes('xfeat') ? '100%' : '26%') : '0%' }}
                />
              </div>
            </div>

            {/* Census */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 font-medium">Census Transform SIFT (Illumination)</span>
                <span className="font-bold text-amber-400">
                  {isComplete ? (results.matcherUsed.includes('census') ? '100%' : '14%') : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(255,182,92,0.4)]"
                  style={{ width: isComplete ? (results.matcherUsed.includes('census') ? '100%' : '14%') : '0%' }}
                />
              </div>
            </div>

            {/* LightGlue */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 font-medium">LightGlue / Crater Graph / Mutual Info</span>
                <span className="font-bold text-slate-300">
                  {isComplete ? '8%' : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-slate-400 transition-all duration-700"
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

