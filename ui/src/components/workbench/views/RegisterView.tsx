import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MatcherType, PipelineStageInfo } from '../../../types';

const pipelineStages: PipelineStageInfo[] = [
  { id: '01', name: 'Ingest', sub: 'OK - SOURCE' },
  { id: '02', name: 'GSD', sub: 'OK - IC-LK' },
  { id: '03', name: 'Equalization', sub: 'OK - WAC' },
  { id: '04', name: 'Gate', sub: 'OK - EXPERT' },
  { id: '05', name: 'Match', sub: 'CONVERGENCE' },
  { id: '06', name: 'MAGSAC++', sub: 'OK - OUTLIERS' },
  { id: '07', name: 'IC-LK', sub: 'OK - REFINE' },
  { id: '08', name: 'GCP', sub: 'ERRORS: 0.0' },
  { id: '09', name: 'Export', sub: 'DONE - 4 FILES' },
];

export const RegisterView: React.FC = () => {
  const {
    selectedMatcher,
    setSelectedMatcher,
    geometryModel,
    setGeometryModel,
    routedMatcher,
    runRegistration,
    isProcessing,
    pipelineProgress,
    activeStepIndex,
    logs,
  } = useApp();

  const [stepStage, setStepStage] = useState('0 - 0');
  const [pairInstance, setPairInstance] = useState('2');
  const [logMode, setLogMode] = useState<'stream' | 'store'>('stream');

  return (
    <section id="view-register" className="view-section active space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 flex-wrap pb-1">
        <h1 className="text-2xl font-bold font-display text-white tracking-wide">
          Register Images
        </h1>
        <span className="badge font-mono text-[10.5px] tracking-[0.14em] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-md">
          T2 REVIEW
        </span>
        <div className="screen-subtitle w-full text-[12.5px] text-slate-400 font-mono tracking-wide mt-1">
          Configure the pipeline settings &amp; run the registration process.
        </div>
      </div>

      {/* PARAMETER CONFIGURATION CARD */}
      <div className="card bracket p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* STEP / STAGE */}
          <div>
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2.5">
              <span className="text-cyan-400 text-xs">•</span> STEP / STAGE
            </label>
            <select
              value={stepStage}
              onChange={(e) => setStepStage(e.target.value)}
              className="w-full p-3 bg-[#060f19] border border-[rgba(146,196,255,0.18)] rounded-lg text-white font-mono text-[13px] focus:border-cyan-400 focus:outline-none transition-colors"
            >
              <option value="0 - 0">0 - 0</option>
              <option value="0 - 4">0 - 4 (Initial Match)</option>
              <option value="0 - 8">0 - 8 (Full Pipeline)</option>
            </select>
          </div>

          {/* PAIR / MATCHER INSTANCE */}
          <div>
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2.5">
              <span className="text-cyan-400 text-xs">•</span> PAIR / MATCHER INSTANCE
            </label>
            <select
              value={pairInstance}
              onChange={(e) => setPairInstance(e.target.value)}
              className="w-full p-3 bg-[#060f19] border border-[rgba(146,196,255,0.18)] rounded-lg text-white font-mono text-[13px] focus:border-cyan-400 focus:outline-none transition-colors"
            >
              <option value="2">2</option>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <div className="font-mono text-[10.5px] text-cyan-400 mt-2 tracking-[0.16em] font-medium">
              IC-LK
            </div>
          </div>

          {/* PIPELINE MODE */}
          <div>
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2.5">
              <span className="text-cyan-400 text-xs">•</span> PIPELINE MODE
            </label>
            <select
              value={selectedMatcher}
              onChange={(e) => setSelectedMatcher(e.target.value as MatcherType)}
              className="w-full p-3 bg-[#060f19] border border-[rgba(146,196,255,0.18)] rounded-lg text-white font-mono text-[13px] focus:border-cyan-400 focus:outline-none transition-colors"
            >
              <option value="auto">Auto – Gain Routing</option>
              <option value="loftr">LoFTR Dense Deep Matcher</option>
              <option value="xfeat">XFeat Lightweight Matcher</option>
              <option value="lightglue">LightGlue</option>
              <option value="crater_graph">Crater Graph</option>
              <option value="phase_corr">Phase Correlation</option>
              <option value="mutual_info">Mutual Information</option>
              <option value="sift">SIFT Baseline</option>
            </select>
          </div>

          {/* OUTPUT */}
          <div>
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2.5">
              <span className="text-cyan-400 text-xs">•</span> OUTPUT
            </label>
            <select
              value={geometryModel}
              onChange={(e) => setGeometryModel(e.target.value)}
              className="w-full p-3 bg-[#060f19] border border-[rgba(146,196,255,0.18)] rounded-lg text-white font-mono text-[13px] focus:border-cyan-400 focus:outline-none transition-colors"
            >
              <option value="DEM + Map Projection (Tier 2)">
                DEM – Map Projection (Tier 2)
              </option>
              <option value="ISIS/SPICE (Tier 1)">ISIS/SPICE (Tier 1)</option>
              <option value="Selenographic Sphere (Tier 3)">
                Selenographic Sphere (Tier 3)
              </option>
            </select>
          </div>
        </div>

        {/* ACTIVE MATCHER BITS & RUN REGISTRATION BUTTON */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[rgba(146,196,255,0.12)] flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
              <span className="text-cyan-400 text-xs">•</span> ACTIVE MATCHER BITS
            </span>
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-slate-400 bg-slate-900/80 border border-slate-700/60 px-3.5 py-1 rounded-md uppercase">
              NOT AVAILABLE
            </span>
          </div>

          <button
            onClick={runRegistration}
            disabled={isProcessing}
            className="px-7 py-3.5 rounded-xl text-[12px] font-bold font-display flex items-center gap-3 tracking-[0.14em] bg-gradient-to-r from-[#1d64ec] to-[#00b4d8] text-white border border-cyan-400/40 hover:opacity-95 hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(29,100,236,0.35)] uppercase"
          >
            <Play className="w-4 h-4 text-white fill-white" />
            {isProcessing ? 'PROCESSING PIPELINE...' : 'RUN REGISTRATION PIPELINE'}
          </button>
        </div>
      </div>

      {/* PIPELINE PROGRESS CARD */}
      <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold font-display text-white tracking-wide flex items-center">
            PIPELINE PROGRESS
            <span className="font-mono text-[11px] text-slate-500 ml-3.5 tracking-[0.14em]">
              8 of 8
            </span>
          </h3>
          <span className="font-mono text-[13px] font-bold text-cyan-400 tracking-wider">
            {pipelineProgress}%
          </span>
        </div>

        <div className="progress-shell mb-6">
          <div
            className="progress-fill"
            style={{ width: `${pipelineProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {pipelineStages.map((p, idx) => {
            let stageClass = 'stage p-3.5 sm:p-4 rounded-xl border border-[rgba(146,196,255,0.12)] bg-[#07111b]/80 transition-all';
            if (activeStepIndex === idx && isProcessing) {
              stageClass += ' running border-cyan-400/60 bg-cyan-950/30 shadow-[0_0_20px_rgba(111,246,255,0.18)]';
            } else if (activeStepIndex > idx || (pipelineProgress === 100 && activeStepIndex >= idx)) {
              stageClass += ' done border-slate-700/60 bg-[#071320]';
            }

            return (
              <div key={p.id} className={stageClass}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] font-bold tracking-[0.12em] text-cyan-400">
                    {p.id}
                  </span>
                </div>
                <div className="font-display text-[13px] font-bold text-white mt-2 tracking-wide">
                  {p.name}
                </div>
                <div className="font-mono text-[9px] text-slate-400 mt-1.5 tracking-[0.08em] uppercase">
                  {p.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE EXECUTION LOG CARD */}
      <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold font-display text-white tracking-wide">
            LIVE EXECUTION LOG
          </h3>
          <div className="flex items-center gap-2.5 font-mono text-[10px]">
            <button
              onClick={() => setLogMode('stream')}
              className={`px-3.5 py-1.5 rounded-md border tracking-[0.14em] font-semibold uppercase transition-all cursor-pointer ${
                logMode === 'stream'
                  ? 'border-cyan-400/50 text-cyan-300 bg-cyan-950/50 shadow-[0_0_12px_rgba(111,246,255,0.2)]'
                  : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-900/40'
              }`}
            >
              STREAM
            </button>
            <button
              onClick={() => setLogMode('store')}
              className={`px-3.5 py-1.5 rounded-md border tracking-[0.14em] font-semibold uppercase transition-all cursor-pointer ${
                logMode === 'store'
                  ? 'border-cyan-400/50 text-cyan-300 bg-cyan-950/50 shadow-[0_0_12px_rgba(111,246,255,0.2)]'
                  : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-900/40'
              }`}
            >
              STORE
            </button>
          </div>
        </div>

        <div className="term rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#040910] overflow-hidden">
          <div className="term-head px-4.5 py-3 bg-[#060d16] border-b border-[rgba(146,196,255,0.1)] flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b7a] inline-block mr-1.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb65c] inline-block mr-1.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3ee6a0] inline-block mr-2.5" />
            <span className="font-mono text-[9.5px] font-semibold text-slate-400 tracking-[0.24em] uppercase">
              PIPELINE OUTPUT
            </span>
          </div>

          <div className="h-60 overflow-y-auto p-4.5 space-y-2 font-mono text-[11.5px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-slate-500 font-mono text-[11.5px]">
                <span className="text-[#54738c] mr-2.5">[19:52:07]</span>
                <span className="text-[#e3f2fd]">SELENE-MATCH Workbench initialized.</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="term-line flex items-start gap-2.5">
                  <span className="text-[#54738c] font-mono shrink-0">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={
                      log.type === 'error'
                        ? 'text-red-400 font-mono'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-mono'
                        : 'text-[#e3f2fd] font-mono'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


