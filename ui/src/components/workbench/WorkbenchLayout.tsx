import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

import { DashboardView } from './views/DashboardView';
import { UploadView } from './views/UploadView';
import { RegisterView } from './views/RegisterView';
import { ResultsView } from './views/ResultsView';
import { MatchesView } from './views/MatchesView';
import { MetricsView } from './views/MetricsView';
import { ExportsView } from './views/ExportsView';
import { LogsView } from './views/LogsView';
import { SettingsView } from './views/SettingsView';
import { AboutView } from './views/AboutView';

export const WorkbenchLayout: React.FC = () => {
  const { currentView } = useApp();
  const mainScrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentView]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'upload':    return <UploadView />;
      case 'register':  return <RegisterView />;
      case 'results':   return <ResultsView />;
      case 'matches':   return <MatchesView />;
      case 'metrics':   return <MetricsView />;
      case 'exports':   return <ExportsView />;
      case 'logs':      return <LogsView />;
      case 'settings':  return <SettingsView />;
      case 'about':     return <AboutView />;
      default:          return <DashboardView />;
    }
  };

  return (
    <div
      id="view-app"
      className="h-screen w-full flex overflow-hidden text-sm app-open"
      style={{ background: 'var(--bg0)' }}
    >
      {/* Ambient background layers */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(55% 40% at 80% 10%, rgba(29,100,236,0.08), transparent 65%),
            radial-gradient(40% 35% at 5%  80%, rgba(69,60,180,0.07), transparent 65%),
            radial-gradient(30% 28% at 50% 120%, rgba(111,246,255,0.04), transparent 65%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(96,160,220,1) 1px, transparent 1px), linear-gradient(90deg, rgba(96,160,220,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(70% 60% at 50% 30%, black, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, black, transparent 90%)',
        }}
      />

      {/* App shell */}
      <Sidebar />
      <main
        id="app-main"
        className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative z-10"
      >
        <Header />
        <div
          ref={mainScrollRef}
          id="workbench-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-5 pb-16"
        >
          {renderActiveView()}
        </div>
        <Footer />
      </main>
    </div>
  );
};

