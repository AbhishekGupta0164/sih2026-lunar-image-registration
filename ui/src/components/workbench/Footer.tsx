import React from 'react';
import { useApp } from '../../context/AppContext';
import { seleneApi } from '../../services/api';
import { Zap, Triangle, Layers, GitMerge } from 'lucide-react';

export const Footer: React.FC = () => {
  const { results, selectedMatcher, sourceSensor, isComplete, isProcessing } = useApp();

  const matcherKey = seleneApi.resolveMatcher(selectedMatcher, sourceSensor);
  const matcherLabel = seleneApi.getMatcherLabel(matcherKey).toUpperCase();

  const chips = [
    { label: 'PIPELINE', value: isProcessing ? 'RUNNING' : isComplete ? `${results.time}s` : '—', icon: Zap, highlight: isProcessing },
    { label: 'MATCHER',  value: matcherLabel, icon: GitMerge },
    { label: 'GEOMETRY', value: 'DEM + TPS',   icon: Triangle, hideSm: true },
    { label: 'REFINE',   value: 'IC-LK',        icon: Layers, hideSm: true },
  ];

  return (
    <footer className="app-footer h-9 shrink-0 flex items-center px-5 gap-4 border-t border-[rgba(146,196,255,0.07)] bg-[rgba(3,8,14,0.92)] backdrop-blur-sm">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {chips.map(({ label, value, icon: Icon, highlight, hideSm }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.12em] ${hideSm ? 'hidden lg:flex' : 'flex'}`}
          >
            <Icon className={`w-2.5 h-2.5 ${highlight ? 'text-amber-400' : 'text-slate-700'}`} />
            <span className="text-slate-700 uppercase">{label}</span>
            <span className={`font-semibold ${highlight ? 'text-amber-300' : 'text-slate-400'}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Right: version pill */}
      <span className="font-mono text-[8px] text-slate-700 tracking-[0.18em] shrink-0">
        BUILD v2.0 · SIH 2026 · PS-26166
      </span>
    </footer>
  );
};
