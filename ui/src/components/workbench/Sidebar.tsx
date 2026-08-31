import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Target,
  Layers,
  GitMerge,
  Activity,
  Download,
  Terminal,
  Settings,
  Info,
  Moon,
  PanelLeftClose,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkbenchView } from '../../types';

interface NavItemDef {
  key: WorkbenchView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const workspaceNav: NavItemDef[] = [
  { key: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { key: 'upload',     label: 'Image Upload',     icon: UploadCloud },
  { key: 'register',   label: 'Register',         icon: Target },
  { key: 'results',    label: 'Results',          icon: Layers },
  { key: 'matches',    label: 'Matches',          icon: GitMerge },
  { key: 'metrics',    label: 'Metrics',          icon: Activity },
  { key: 'exports',    label: 'Exports',          icon: Download },
];

const systemNav: NavItemDef[] = [
  { key: 'logs',     label: 'Logs',     icon: Terminal },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'about',    label: 'About',    icon: Info },
];

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, sidebarCollapsed, toggleSidebar, goHome, isComplete, isProcessing } = useApp();

  const renderNavItem = (item: NavItemDef) => {
    const Icon = item.icon;
    const isActive = currentView === item.key;

    return (
      <a
        key={item.key}
        href={`#/${item.key}`}
        onClick={(e) => { e.preventDefault(); navigateTo(item.key); }}
        title={sidebarCollapsed ? item.label : undefined}
        className={`nav-item group relative flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl text-[12.5px] font-medium transition-all duration-200 cursor-pointer select-none ${
          isActive
            ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/8 text-white border border-cyan-500/25 shadow-[0_0_18px_rgba(111,246,255,0.08)]'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
        }`}
      >
        {/* Active left bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full bg-cyan-400 shadow-[0_0_12px_rgba(111,246,255,0.9)]" />
        )}

        <Icon
          className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
            isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
          }`}
        />

        <span className="nav-text flex-1 whitespace-nowrap tracking-wide font-display">
          {item.label}
        </span>

        {isActive && !sidebarCollapsed && (
          <ChevronRight className="w-3 h-3 text-cyan-500/60 shrink-0" />
        )}
      </a>
    );
  };

  return (
    <aside
      id="main-sidebar"
      className={`flex flex-col shrink-0 h-full relative overflow-hidden ${
        sidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* ── LOGO HEADER ── */}
      <div className="shrink-0 relative border-b border-[rgba(146,196,255,0.10)] bg-gradient-to-b from-[rgba(10,22,36,0.6)] to-transparent">
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="absolute top-4 right-3 p-1.5 text-slate-600 hover:text-cyan-400 rounded-lg z-20 transition-all duration-200 hover:bg-cyan-500/10 cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); goHome(); }}
          className="p-4 flex items-center gap-3 logo-container group"
          title="Back to home"
        >
          <div className="logo-mark flex items-center justify-center shrink-0 relative">
            <Moon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="logo-text whitespace-nowrap overflow-hidden">
            <h1 className="text-[14px] font-bold font-display tracking-[0.12em] text-white leading-tight">
              SELENE<span className="text-cyan-400">-</span>MATCH
            </h1>
            <p className="font-mono text-[7.5px] tracking-[0.28em] text-slate-500 mt-0.5 uppercase">
              MISSION CONTROL · v2.0
            </p>
          </div>
        </a>
      </div>

      {/* ── PIPELINE STATUS STRIP ── */}
      {!sidebarCollapsed && (
        <div className="mx-3 my-2.5 px-3 py-2 rounded-xl bg-slate-950/50 border border-[rgba(146,196,255,0.08)] flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isProcessing
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(255,182,92,0.9)] animate-pulse'
                : isComplete
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(62,230,160,0.9)]'
                : 'bg-slate-600'
            }`}
          />
          <span className="font-mono text-[9px] tracking-[0.14em] text-slate-500 uppercase flex-1 min-w-0 truncate">
            {isProcessing ? 'PIPELINE RUNNING' : isComplete ? 'REGISTRATION DONE' : 'AWAITING INPUT'}
          </span>
        </div>
      )}

      {/* ── NAV ── */}
      <nav
        id="main-nav"
        className="flex-1 min-h-0 py-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className={`font-mono text-[8.5px] font-bold tracking-[0.24em] text-slate-600 uppercase mb-1 mt-3 ${sidebarCollapsed ? 'text-center px-1' : 'px-4'}`}>
          {sidebarCollapsed ? '—' : 'WORKSPACE'}
        </div>
        <div className="space-y-0.5">
          {workspaceNav.map(renderNavItem)}
        </div>

        <div className={`font-mono text-[8.5px] font-bold tracking-[0.24em] text-slate-600 uppercase mb-1 mt-5 ${sidebarCollapsed ? 'text-center px-1' : 'px-4'}`}>
          {sidebarCollapsed ? '—' : 'SYSTEM'}
        </div>
        <div className="space-y-0.5">
          {systemNav.map(renderNavItem)}
        </div>
      </nav>

      {/* ── MISSION CARD ── */}
      <div className="shrink-0 pt-2">
        <div className="project-info-panel p-3 mx-2.5 mb-2.5 rounded-xl bg-[rgba(6,14,24,0.7)] border border-[rgba(146,196,255,0.10)] backdrop-blur-md">
          <div className="font-mono text-[8px] font-bold text-slate-600 mb-2.5 uppercase tracking-[0.24em]">
            MISSION CARD
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">PS ID</span>
              <span className="font-bold text-cyan-300 tracking-wider">26166</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Org</span>
              <span className="text-white text-[9px]">ISRO / DoS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Team</span>
              <span className="text-white">5 Members</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-[rgba(146,196,255,0.07)] flex justify-between items-center">
              <span className="text-slate-500">Mode</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[8.5px] font-bold tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(62,230,160,0.9)]" />
                DEMO READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
