import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export const ResultsView: React.FC = () => {
  const { referenceImage, sourceImage, isComplete, results } = useApp();
  const [activeTab, setActiveTab] = useState<'wipe' | 'checker' | 'gcp' | 'residual'>('wipe');
  const [wipeVal, setWipeVal] = useState<number>(50);

  // Generate 64 checkerboard cells
  const checkerCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return (row + col) % 2 === 0 ? 'cb-a' : 'cb-b';
  });

  // Generate 28 GCP dots & vectors
  const gcpPoints = Array.from({ length: 28 }, (_, i) => {
    const x = 8 + ((i * 37) % 84);
    const y = 8 + ((i * 61) % 84);
    return { x, y };
  });

  const refUrl = referenceImage?.previewUrl || '';
  const srcUrl = sourceImage?.previewUrl || '';

  return (
    <section id="view-results" className="view-section active">
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="screen-title">Results</div>
        <span className="badge text-brand-400">T3 COMPAREVIEW</span>
        <div className="screen-subtitle w-full">
          Inspect the registered raster against the reference with wipe, checkerboard, GCP and residual layers.
        </div>
      </div>

      <div
        className={`card p-4 mb-4 text-[11px] flex items-center gap-3 ${
          isComplete
            ? 'text-success border-[rgba(62,230,160,0.35)]'
            : 'text-warning'
        }`}
      >
        <span className={`led ${isComplete ? '' : 'amber'}`} />
        {isComplete ? (
          <span>
            Registration complete. Interactive comparison is now active for{' '}
            <b>{results.method}</b>.
          </span>
        ) : (
          <span>
            Run a registration first to populate live comparison. Demo placeholders are shown below.
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        {/* TABS */}
        <div className="flex flex-wrap border-b border-[rgba(146,196,255,0.13)] bg-[rgba(4,9,16,0.5)]">
          <button
            className={`result-tab ${activeTab === 'wipe' ? 'active' : ''}`}
            onClick={() => setActiveTab('wipe')}
          >
            WIPE / CURTAIN
          </button>
          <button
            className={`result-tab ${activeTab === 'checker' ? 'active' : ''}`}
            onClick={() => setActiveTab('checker')}
          >
            8×8 CHECKERBOARD
          </button>
          <button
            className={`result-tab ${activeTab === 'gcp' ? 'active' : ''}`}
            onClick={() => setActiveTab('gcp')}
          >
            GCP + QUIVER
          </button>
          <button
            className={`result-tab ${activeTab === 'residual' ? 'active' : ''}`}
            onClick={() => setActiveTab('residual')}
          >
            RESIDUAL HEATMAP
          </button>
        </div>

        <div className="p-5">
          {/* WIPE TAB */}
          {activeTab === 'wipe' && (
            <div className="result-pane">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-80">
                <div className="relative bg-black rounded-xl border border-[rgba(146,196,255,0.16)] overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 z-10 badge bg-[rgba(4,9,16,0.85)]">
                    REFERENCE (LRO NAC)
                  </span>
                  {refUrl ? (
                    <img
                      src={refUrl}
                      alt="Reference"
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-[11px] text-slate-500">
                      REFERENCE RASTER PREVIEW
                    </div>
                  )}
                </div>

                <div className="relative bg-black rounded-xl border border-[rgba(146,196,255,0.16)] overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 z-10 badge bg-[rgba(4,9,16,0.85)]">
                    REGISTERED SOURCE
                  </span>
                  {srcUrl ? (
                    <img
                      src={srcUrl}
                      alt="Registered"
                      className="w-full h-full object-cover opacity-90 transition-all"
                      style={{ clipPath: `inset(0 0 0 ${wipeVal}%)` }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-mono text-[11px] text-brand-300"
                      style={{ clipPath: `inset(0 0 0 ${wipeVal}%)` }}
                    >
                      REGISTERED RASTER PREVIEW
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="mini-label shrink-0">Curtain</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wipeVal}
                  onChange={(e) => setWipeVal(parseInt(e.target.value, 10))}
                  className="flex-1 mt-1"
                />
              </div>
            </div>
          )}

          {/* CHECKERBOARD TAB */}
          {activeTab === 'checker' && (
            <div className="result-pane">
              <div className="h-80 rounded-xl border border-[rgba(146,196,255,0.16)] grid grid-cols-8 grid-rows-8 overflow-hidden">
                {checkerCells.map((cls, idx) => (
                  <div key={idx} className={cls} />
                ))}
              </div>
            </div>
          )}

          {/* GCP TAB */}
          {activeTab === 'gcp' && (
            <div className="result-pane">
              <div className="h-80 bg-[rgba(2,6,10,0.7)] border border-[rgba(146,196,255,0.16)] rounded-xl relative overflow-hidden">
                <div className="absolute inset-0">
                  {gcpPoints.map((pt, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        className="absolute w-2 h-2 rounded-full gcp-dot"
                        style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      />
                      <span
                        className="absolute h-px gcp-vec"
                        style={{
                          left: `${pt.x}%`,
                          top: `${pt.y + 1.4}%`,
                          width: '18px',
                        }}
                      />
                    </React.Fragment>
                  ))}
                </div>
                <div className="absolute top-3 left-3 badge">
                  GCP POINTS + DISPLACEMENT VECTORS
                </div>
              </div>
            </div>
          )}

          {/* RESIDUAL TAB */}
          {activeTab === 'residual' && (
            <div className="result-pane">
              <div className="h-80 rounded-xl border border-[rgba(146,196,255,0.16)] overflow-hidden relative">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'radial-gradient(40% 55% at 22% 68%,rgba(59,130,246,.5),transparent 70%),radial-gradient(34% 46% at 48% 30%,rgba(16,185,129,.42),transparent 70%),radial-gradient(30% 42% at 76% 62%,rgba(239,68,68,.4),transparent 70%),linear-gradient(140deg,#050d14,#0a1520)',
                  }}
                />
                <span className="absolute top-3 left-3 badge">
                  RESIDUAL FIELD / RMSE {results.rmse} px
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
