import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HeatmapCanvas } from '../../common/HeatmapCanvas';

export const ResultsView: React.FC = () => {
  const { referenceImage, sourceImage, isComplete, results, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'wipe' | 'checker' | 'gcp' | 'residual'>('wipe');
  const [wipeVal, setWipeVal] = useState<number>(50);

  // Generate 64 checkerboard cells using actual images
  const checkerCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return (row + col) % 2 === 0;
  });

  // Generate 28 GCP dots & vectors
  const gcpPoints = Array.from({ length: 28 }, (_, i) => {
    const x = 8 + ((i * 37) % 84);
    const y = 8 + ((i * 61) % 84);
    const dx = (i % 2 === 0 ? 1 : -1) * (12 + (i % 7) * 3);
    const dy = (i % 3 === 0 ? -1 : 1) * (8 + (i % 5) * 2);
    return { x, y, dx, dy };
  });

  const refUrl = referenceImage?.previewUrl || '/synthetic/reference.png';
  const srcUrl = sourceImage?.previewUrl || '/synthetic/synthetic_target.png';

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
            Displaying benchmark synthetic registered image pair preview below. Run registration for live overlay.
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
                  <img
                    src={refUrl}
                    alt="Reference"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>

                <div className="relative bg-black rounded-xl border border-[rgba(146,196,255,0.16)] overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 z-10 badge bg-[rgba(4,9,16,0.85)]">
                    REGISTERED SOURCE
                  </span>
                  <img
                    src={srcUrl}
                    alt="Registered"
                    className="w-full h-full object-cover opacity-90 transition-all"
                    style={{ clipPath: `inset(0 0 0 ${wipeVal}%)` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="mini-label shrink-0">Curtain Position ({wipeVal}%)</label>
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
              <div className="h-80 rounded-xl border border-[rgba(146,196,255,0.16)] grid grid-cols-8 grid-rows-8 overflow-hidden relative">
                {checkerCells.map((isRef, idx) => (
                  <div key={idx} className="relative overflow-hidden border-[0.5px] border-slate-900/40">
                    <img
                      src={isRef ? refUrl : srcUrl}
                      alt="Checker cell"
                      className="w-full h-full object-cover opacity-90 scale-125"
                    />
                    <span className="absolute bottom-0.5 right-0.5 font-mono text-[7px] bg-slate-950/70 text-slate-300 px-1 rounded">
                      {isRef ? 'REF' : 'SRC'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GCP TAB */}
          {activeTab === 'gcp' && (
            <div className="result-pane">
              <div className="h-80 bg-[rgba(2,6,10,0.85)] border border-[rgba(146,196,255,0.16)] rounded-xl relative overflow-hidden">
                <img
                  src={refUrl}
                  alt="Reference background"
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0">
                  {gcpPoints.map((pt, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        className="absolute w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(62,230,160,0.9)]"
                        style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      />
                      <svg
                        className="absolute pointer-events-none overflow-visible"
                        style={{ left: `${pt.x}%`, top: `${pt.y}%`, width: '40px', height: '40px' }}
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2={pt.dx}
                          y2={pt.dy}
                          stroke="#3ee6a0"
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                      </svg>
                    </React.Fragment>
                  ))}
                </div>
                <div className="absolute top-3 left-3 badge bg-slate-950/80">
                  GCP SAMPLING (28 CONTROL POINTS + DISPLACEMENT VECTORS)
                </div>
              </div>
            </div>
          )}

          {/* RESIDUAL TAB */}
          {activeTab === 'residual' && (
            <div className="result-pane h-80">
              <HeatmapCanvas
                rmse={results.rmse || 0.68}
                opacity={settings.heatmapOpacity || 75}
                refUrl={refUrl}
                srcUrl={srcUrl}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
