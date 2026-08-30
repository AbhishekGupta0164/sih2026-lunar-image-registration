import React from 'react';
import {
  CheckCircle,
  Layers,
  Maximize2,
  Target,
  Clock,
  UploadCloud,
  Share2,
  CheckCircle2,
  Sun,
  Scale,
  Compass,
  KeyRound,
  Upload,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { navigateTo, isProcessing, isComplete, results } = useApp();

  return (
    <section id="view-dashboard" className="view-section active space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-end justify-between flex-wrap gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-wide">
            SELENE-MATCH Workbench
          </h1>
          <p className="screen-subtitle text-[12.5px] text-slate-400 font-mono tracking-wide mt-1.5">
            A single workspace for multi-modal lunar image registration. Each screen owns its dedicated functionality.
          </p>
        </div>
        <span className="badge font-mono text-[10.5px] tracking-[0.14em] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full flex items-center gap-2.5 shadow-[0_0_12px_rgba(62,230,160,0.15)]">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          ALL SYSTEMS NOMINAL
        </span>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* INPUT CARD */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex items-center justify-between transition-all hover:border-[rgba(146,196,255,0.3)] hover:shadow-[0_0_20px_rgba(111,246,255,0.06)]">
          <div className="flex flex-col justify-between h-full">
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-3">
              <span className="text-cyan-400 text-xs">•</span> INPUT
            </label>
            <div className="text-white font-bold font-display text-[16px] leading-snug">
              OHRC / TMC-2 / IIRS
            </div>
            <p className="text-[11.5px] text-slate-400 font-mono mt-2 tracking-wide">vs LRO NAC / WAC</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 shrink-0 ml-4 shadow-[0_0_15px_rgba(57,168,255,0.15)]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* SCALE RANGE CARD */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex items-center justify-between transition-all hover:border-[rgba(146,196,255,0.3)] hover:shadow-[0_0_20px_rgba(111,246,255,0.06)]">
          <div className="flex flex-col justify-between h-full">
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
              <span className="text-cyan-400 text-xs">•</span> SCALE RANGE
            </label>
            <div className="text-[28px] text-cyan-300 font-bold font-display my-1 tracking-tight drop-shadow-[0_0_18px_rgba(111,246,255,0.35)]">
              320×
            </div>
            <p className="text-[11.5px] text-slate-400 font-mono tracking-wide">GSD disparity handled</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shrink-0 ml-4 shadow-[0_0_15px_rgba(111,246,255,0.15)]">
            <Maximize2 className="w-6 h-6" />
          </div>
        </div>

        {/* ACCURACY TARGET CARD */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex items-center justify-between transition-all hover:border-[rgba(146,196,255,0.3)] hover:shadow-[0_0_20px_rgba(111,246,255,0.06)]">
          <div className="flex flex-col justify-between h-full">
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
              <span className="text-cyan-400 text-xs">•</span> ACCURACY TARGET
            </label>
            <div className="text-[28px] text-emerald-400 font-bold font-display my-1 tracking-tight drop-shadow-[0_0_18px_rgba(62,230,160,0.35)]">
              &lt; 1 px
            </div>
            <p className="text-[11.5px] text-slate-400 font-mono tracking-wide">Sub-pixel refinement</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 shrink-0 ml-4 shadow-[0_0_15px_rgba(62,230,160,0.15)]">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* PIPELINE CARD */}
        <div className="card bracket p-5 sm:p-6 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex items-center justify-between transition-all hover:border-[rgba(146,196,255,0.3)] hover:shadow-[0_0_20px_rgba(111,246,255,0.06)]">
          <div className="flex flex-col justify-between h-full">
            <label className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase mb-2">
              <span className="text-cyan-400 text-xs">•</span> PIPELINE
            </label>
            <div className="text-[28px] text-white font-bold font-display my-1 tracking-tight">
              {isProcessing ? 'Running' : isComplete ? 'Complete' : 'Idle'}
            </div>
            <p className="text-[11.5px] text-slate-400 font-mono tracking-wide">
              {isProcessing
                ? 'Processing S0-S8...'
                : isComplete
                ? results.method
                : 'Awaiting image pair'}
            </p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 shrink-0 ml-4">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOW SELENE-MATCH WORKS */}
        <div className="card p-6 sm:p-7 lg:col-span-2 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-[14px] font-bold font-display text-white mb-6 tracking-[0.12em] uppercase">
              HOW SELENE-MATCH WORKS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* STEP 01 */}
              <div className="p-5 rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#07111c]/80 flex flex-col items-center text-center relative group hover:border-cyan-400/40 transition-all hover:shadow-[0_0_20px_rgba(111,246,255,0.08)]">
                <span className="font-mono text-[12px] font-bold text-cyan-400 tracking-[0.14em] self-start mb-1">
                  01
                </span>
                <div className="my-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(57,168,255,0.15)]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-white text-[14px] font-bold font-display tracking-wide mt-1">
                  Ingest
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1.5 leading-relaxed max-w-[140px]">
                  Read image + metadata
                </div>
              </div>

              {/* STEP 02 */}
              <div className="p-5 rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#07111c]/80 flex flex-col items-center text-center relative group hover:border-cyan-400/40 transition-all hover:shadow-[0_0_20px_rgba(111,246,255,0.08)]">
                <span className="font-mono text-[12px] font-bold text-cyan-400 tracking-[0.14em] self-start mb-1">
                  02
                </span>
                <div className="my-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(57,168,255,0.15)]">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div className="text-white text-[14px] font-bold font-display tracking-wide mt-1">
                  Equalize
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1.5 leading-relaxed max-w-[140px]">
                  Common GSD pyramid
                </div>
              </div>

              {/* STEP 03 */}
              <div className="p-5 rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#07111c]/80 flex flex-col items-center text-center relative group hover:border-cyan-400/40 transition-all hover:shadow-[0_0_20px_rgba(111,246,255,0.08)]">
                <span className="font-mono text-[12px] font-bold text-cyan-400 tracking-[0.14em] self-start mb-1">
                  03
                </span>
                <div className="my-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(57,168,255,0.15)]">
                  <Share2 className="w-6 h-6" />
                </div>
                <div className="text-white text-[14px] font-bold font-display tracking-wide mt-1">
                  Match
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1.5 leading-relaxed max-w-[140px]">
                  Gate selects expert
                </div>
              </div>

              {/* STEP 04 */}
              <div className="p-5 rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#07111c]/80 flex flex-col items-center text-center relative group hover:border-cyan-400/40 transition-all hover:shadow-[0_0_20px_rgba(62,230,160,0.08)]">
                <span className="font-mono text-[12px] font-bold text-cyan-400 tracking-[0.14em] self-start mb-1">
                  04
                </span>
                <div className="my-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 shadow-[0_0_15px_rgba(62,230,160,0.15)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-white text-[14px] font-bold font-display tracking-wide mt-1">
                  Register
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1.5 leading-relaxed max-w-[140px]">
                  MAGSAC++ + IC-LK
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[rgba(146,196,255,0.12)]">
            <button
              className="px-6 py-3 rounded-lg text-[12px] font-bold font-display tracking-[0.14em] bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer shadow-[0_0_18px_rgba(57,168,255,0.3)]"
              onClick={() => navigateTo('upload')}
            >
              START WITH UPLOAD <Upload className="w-4 h-4" />
            </button>
            <button
              className="px-6 py-3 rounded-lg text-[12px] font-bold font-display tracking-[0.14em] border border-[rgba(146,196,255,0.25)] bg-slate-900/60 text-white flex items-center gap-2.5 hover:bg-slate-800/80 transition-all cursor-pointer"
              onClick={() => navigateTo('register')}
            >
              OPEN REGISTRATION <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CHALLENGE -> SOLUTION */}
        <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
          <h3 className="text-[14px] font-bold font-display text-white mb-6 tracking-[0.12em] uppercase">
            CHALLENGE → SOLUTION
          </h3>
          <div className="space-y-6">
            {/* ILLUMINATION */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 shadow-[0_0_12px_rgba(255,182,92,0.15)]">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-amber-400 font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
                  ILLUMINATION
                </div>
                <p className="text-slate-400 font-mono text-[11.5px] mt-1.5 leading-relaxed">
                  Phase congruency, shadow masks, relighting, crater graph.
                </p>
              </div>
            </div>

            {/* SCALE */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 shadow-[0_0_12px_rgba(255,182,92,0.15)]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-amber-400 font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
                  SCALE
                </div>
                <p className="text-slate-400 font-mono text-[11.5px] mt-1.5 leading-relaxed">
                  Common metres-per-pixel GSD pyramid.
                </p>
              </div>
            </div>

            {/* VIEWPOINT */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 shadow-[0_0_12px_rgba(255,182,92,0.15)]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-amber-400 font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
                  VIEWPOINT
                </div>
                <p className="text-slate-400 font-mono text-[11.5px] mt-1.5 leading-relaxed">
                  Robust affine/homography + TPS/piecewise geometry.
                </p>
              </div>
            </div>

            {/* PRECISION */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shrink-0 shadow-[0_0_12px_rgba(255,182,92,0.15)]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-amber-400 font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
                  PRECISION
                </div>
                <p className="text-slate-400 font-mono text-[11.5px] mt-1.5 leading-relaxed">
                  Native-resolution IC-LK sub-pixel refinement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


