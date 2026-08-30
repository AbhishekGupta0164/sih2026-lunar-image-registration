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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkbenchView } from '../../types';

interface NavItemDef {
  key: WorkbenchView;
  label: string;
  icon: React.ElementType;
}

const workspaceNav: NavItemDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'upload', label: 'Image Upload', icon: UploadCloud },
  { key: 'register', label: 'Register Images', icon: Target },
  { key: 'results', label: 'Results', icon: Layers },
  { key: 'matches', label: 'Matches', icon: GitMerge },
  { key: 'metrics', label: 'Metrics', icon: Activity },
  { key: 'exports', label: 'Exports', icon: Download },
];

const systemNav: NavItemDef[] = [
  { key: 'logs', label: 'Logs', icon: Terminal },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'about', label: 'About', icon: Info },
];

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, sidebarCollapsed, toggleSidebar, goHome } = useApp();

  return (
    <aside
      id="main-sidebar"
      className={`flex flex-col shrink-0 h-full relative overflow-hidden ${
        sidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <div className="shrink-0 relative border-b border-[rgba(146,196,255,0.13)]">
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="absolute top-3.5 right-3 p-1.5 text-slate-500 hover:text-cyan-400 rounded z-20 transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          className="p-5 flex items-center gap-3 logo-container group"
          title="Back to home"
        >
          <div className="logo-mark flex items-center justify-center">
            <Moon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="logo-text whitespace-nowrap">
            <h1 className="text-[15px] font-bold font-display tracking-[0.1em] text-white leading-tight">
              SELENE-MATCH
            </h1>
            <p className="font-mono text-[8px] tracking-[0.24em] text-slate-400 mt-0.5 uppercase">
              MISSION CONTROL
            </p>
          </div>
        </a>
      </div>

      <nav id="main-nav" className="flex-1 min-h-0 p-3 overflow-y-auto overflow-x-hidden space-y-1 overscroll-contain">
        <div className="font-mono text-[9px] font-bold tracking-[0.22em] text-slate-500 px-3 pt-2 pb-1.5 uppercase">
          WORKSPACE
        </div>
        {workspaceNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.key;
          return (
            <a
              key={item.key}
              href={`#/${item.key}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.key);
              }}
              className={`nav-item font-display font-medium text-[13px] ${
                isActive ? 'nav-active text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-cyan-400/80" />
              <span className="nav-text tracking-wide">{item.label}</span>
            </a>
          );
        })}

        <div className="font-mono text-[9px] font-bold tracking-[0.22em] text-slate-500 px-3 pt-4 pb-1.5 uppercase">
          SYSTEM
        </div>
        {systemNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.key;
          return (
            <a
              key={item.key}
              href={`#/${item.key}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.key);
              }}
              className={`nav-item font-display font-medium text-[13px] ${
                isActive ? 'nav-active text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-cyan-400/80" />
              <span className="nav-text tracking-wide">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* MISSION CARD FOOTER */}
      <div className="shrink-0 mt-auto pt-2">
        <div className="p-3.5 mx-3 mb-3 rounded-xl project-info-panel bg-slate-950/40 border border-[rgba(146,196,255,0.12)] backdrop-blur-md">
          <h3 className="font-mono text-[9px] font-bold text-slate-400 mb-2.5 uppercase tracking-[0.22em]">
            MISSION CARD
          </h3>
          <div className="space-y-2 font-mono text-[10.5px]">
            <div className="flex justify-between">
              <span className="text-slate-400">PS ID</span>
              <span className="font-bold text-white">26166</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400">Organisation</span>
              <span className="font-bold text-white text-[10px]">ISRO / Dept. of Space</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Team Size</span>
              <span className="text-white">5 Members</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[rgba(146,196,255,0.08)]">
              <span className="text-slate-400">Mode</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9.5px] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(62,230,160,0.8)] inline-block" />
                DEMO READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

