import React, { useState, useEffect } from 'react';
import { ArrowLeft, Satellite, Radio, Cpu, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkbenchView } from '../../types';

const viewMeta: Record<WorkbenchView, { title: string; sub: string; tier?: string }> = {
  dashboard: { title: 'Dashboard',         sub: 'SELENE-MATCH · MULTI-MODAL LUNAR REGISTRATION' },
  upload:    { title: 'Image Upload',       sub: 'T1 PAIRDESK · INGEST & CONFIGURE SENSOR PAIR',    tier: 'T1' },
  register:  { title: 'Register Images',    sub: 'T2 RUNVIEW · PIPELINE EXECUTION & GATE ROUTING',   tier: 'T2' },
  results:   { title: 'Results',            sub: 'T3 COMPAREVIEW · INTERACTIVE INSPECTION',          tier: 'T3' },
  matches:   { title: 'Matches',            sub: 'CORRESPONDENCE INSPECTION · KEYPOINT OVERLAYS' },
  metrics:   { title: 'Metrics',            sub: 'T4 SCOREBOARD · RMSE / INLIER RATIO / CE90',       tier: 'T4' },
  exports:   { title: 'Exports',            sub: 'REGISTERED PRODUCTS · REPORT & DELIVERABLES' },
  logs:      { title: 'System Logs',        sub: 'PIPELINE EXECUTION HISTORY · LIVE FEED' },
  settings:  { title: 'Settings',           sub: 'WORKBENCH CONFIGURATION' },
  about:     { title: 'About SELENE-MATCH', sub: 'PROJECT OVERVIEW · SIH 2026 · PROBLEM ID 26166' },
};

export const Header: React.FC = () => {
  const { currentView, goHome, isProcessing, isComplete, results } = useApp();
  const [utcTime, setUtcTime] = useState<string>('00:00:00');

  useEffect(() => {
    const tick = () => setUtcTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const meta = viewMeta[currentView] ?? { title: 'Workbench', sub: 'SELENE-MATCH' };

  return (
    <header className="app-header h-14 shrink-0 flex items-center justify-between px-5 border-b border-[rgba(111,246,255,0.12)] bg-gradient-to-r from-[rgba(5,12,22,0.98)] via-[rgba(8,18,32,0.96)] to-[rgba(5,12,22,0.98)] backdrop-blur-xl shadow-[0_1px_0_rgba(111,246,255,0.06),0_4px_24px_rgba(0,0,0,0.4)]">

      {/* LEFT: Back + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={(e) => { e.preventDefault(); goHome(); }}
          className="p-1.5 rounded-lg border border-[rgba(146,196,255,0.15)] text-slate-500 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/8 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
          title="Back to landing"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-600 tracking-[0.14em] shrink-0 hidden sm:flex">
          <span className="text-slate-700">SELENE</span>
          <ChevronRight className="w-2.5 h-2.5" />
          {meta.tier && (
            <>
              <span className="text-cyan-600">{meta.tier}</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </>
          )}
        </div>

        {/* Title Block */}
        <div className="min-w-0">
          <h2
            id="header-title"
            className="text-white font-bold font-display text-[14.5px] tracking-wide flex items-center gap-2 leading-tight"
          >
            <span className="truncate">{meta.title}</span>
            {isProcessing && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(255,182,92,0.9)] animate-pulse shrink-0" />
            )}
            {isComplete && !isProcessing && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(62,230,160,0.9)] shrink-0" />
            )}
          </h2>
          <p
            id="header-subtitle"
            className="font-mono text-[8.5px] text-slate-600 tracking-[0.16em] mt-0.5 uppercase truncate"
          >
            {meta.sub}
          </p>
        </div>
      </div>

      {/* RIGHT: Telemetry chips */}
      <div className="flex items-center gap-2 shrink-0">
        {/* RMSE chip — shown only when done */}
        {isComplete && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-950/30 font-mono text-[9px] tracking-[0.1em] text-emerald-400">
            <Cpu className="w-3 h-3" />
            RMSE&nbsp;<span className="font-bold text-emerald-300">{results.rmse}px</span>
          </div>
        )}

        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[rgba(146,196,255,0.12)] bg-[rgba(111,246,255,0.03)] font-mono text-[9px] tracking-[0.12em] text-slate-500">
          <Satellite className="w-3 h-3 text-slate-600 animate-pulse" />
          <span>UTC</span>
          <span id="utc-clock" className="text-slate-300 font-semibold tabular-nums">{utcTime}</span>
        </div>

        {/* Online indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[rgba(62,230,160,0.18)] bg-[rgba(62,230,160,0.04)] font-mono text-[9px] tracking-[0.12em] text-emerald-500">
          <Radio className="w-3 h-3" />
          <span className="hidden sm:inline font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
