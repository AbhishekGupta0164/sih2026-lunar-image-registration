import React from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const LogsView: React.FC = () => {
  const { logs, clearLogs } = useApp();

  return (
    <section id="view-logs" className="view-section active space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 flex-wrap pb-1">
        <h1 className="text-2xl font-bold font-display text-white tracking-wide">
          System Logs
        </h1>
        <span className="badge font-mono text-[10.5px] tracking-[0.14em] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-md">
          STDOUT / STDERR
        </span>
        <div className="screen-subtitle w-full text-[12.5px] text-slate-400 font-mono tracking-wide mt-1">
          Pipeline execution logs, diagnostic outputs, and user activity history.
        </div>
      </div>

      {/* TERMINAL LOG CARD */}
      <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-bold font-display text-white tracking-wide uppercase">
            EXECUTION LOG CONSOLE
          </h3>
          <button
            onClick={clearLogs}
            className="px-4 py-2 rounded-lg text-[11px] font-bold font-display tracking-[0.12em] border border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-600 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            CLEAR LOGS
          </button>
        </div>

        <div className="term rounded-xl border border-[rgba(146,196,255,0.14)] bg-[#040910] overflow-hidden">
          <div className="term-head px-4.5 py-3 bg-[#060d16] border-b border-[rgba(146,196,255,0.1)] flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b7a] inline-block mr-1.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb65c] inline-block mr-1.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3ee6a0] inline-block mr-2.5" />
            <span className="font-mono text-[9.5px] font-semibold text-slate-400 tracking-[0.24em] uppercase">
              SYSTEM.LOG
            </span>
          </div>

          <div className="min-h-[460px] max-h-[600px] p-5 overflow-y-auto space-y-2 font-mono text-[11.5px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-slate-500 font-mono text-[11.5px]">
                <span className="text-[#54738c] mr-2.5">[19:52:07]</span>
                <span className="text-[#e3f2fd]">SELENE-MATCH Workbench initialized. Log stream empty.</span>
              </div>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="term-line flex items-start gap-2.5">
                  <span className="text-[#54738c] font-mono shrink-0">
                    [{l.timestamp}]
                  </span>
                  <span
                    className={
                      l.type === 'error'
                        ? 'text-red-400 font-mono'
                        : l.type === 'success'
                        ? 'text-emerald-400 font-mono'
                        : 'text-[#e3f2fd] font-mono'
                    }
                  >
                    {l.message}
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

