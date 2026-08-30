import React, { useState, useEffect } from 'react';
import { ArrowLeft, Satellite } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkbenchView } from '../../types';

const viewTitles: Record<WorkbenchView, [string, string]> = {
  dashboard: ['Dashboard', 'SELENE-MATCH • MULTI-MODAL LUNAR REGISTRATION'],
  upload: ['Image Upload', 'T1 PAIRDESK • INGEST & CONFIGURE'],
  register: ['Register Images', 'T2 RUNVIEW • PIPELINE EXECUTION'],
  results: ['Results', 'T3 COMPAREVIEW • INTERACTIVE INSPECTION'],
  matches: ['Matches', 'CORRESPONDENCE INSPECTION'],
  metrics: ['Metrics', 'T4 SCOREBOARD • METRICS & DELIVERABLES'],
  exports: ['Exports', 'REGISTERED PRODUCTS AND REPORTS'],
  logs: ['System Logs', 'PIPELINE EXECUTION HISTORY'],
  settings: ['Settings', 'WORKBENCH CONFIGURATION'],
  about: ['About SELENE-MATCH', 'PROJECT OVERVIEW'],
};

export const Header: React.FC = () => {
  const { currentView, goHome } = useApp();
  const [utcTime, setUtcTime] = useState<string>('UTC 00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setUtcTime(`UTC ${new Date().toISOString().slice(11, 19)}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [title, subtitle] = viewTitles[currentView] || [
    'Workbench',
    'SELENE-MATCH',
  ];

  return (
    <header className="app-header h-14 shrink-0 flex items-center justify-between px-6 border-b border-cyan-500/35 bg-gradient-to-r from-slate-950 via-[#05111f] to-slate-950 shadow-[0_4px_20px_rgba(29,100,236,0.2)]">
      <div className="flex items-center gap-4">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-300 transition-all shadow-[0_0_10px_rgba(111,246,255,0.15)] flex items-center justify-center cursor-pointer"
          title="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </a>
        <div className="flex items-center gap-3">
          <div>
            <h2 id="header-title" className="text-white font-bold font-display text-[15.5px] tracking-wide flex items-center gap-2">
              {title}
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(111,246,255,0.8)] inline-block" />
            </h2>
            <p
              id="header-subtitle"
              className="font-mono text-[9.5px] text-cyan-300/80 tracking-[0.16em] mt-0.5 uppercase"
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="clock-chip hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/35 bg-cyan-950/40 text-cyan-300 font-mono text-[10px] tracking-wider shadow-[0_0_12px_rgba(111,246,255,0.15)]">
          <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span id="utc-clock">{utcTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 font-mono text-[9.5px] tracking-[0.14em] shadow-[0_0_12px_rgba(62,230,160,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(62,230,160,0.8)] inline-block" />
          <span className="font-bold">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
};
