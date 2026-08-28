import React from 'react';
import { TopNav } from './TopNav';
import { HeroSection } from './HeroSection';
import { Marquee } from './Marquee';
import { MissionSection } from './MissionSection';
import { WorkflowSection } from './WorkflowSection';
import { TechnologySection } from './TechnologySection';
import { ResultsSection } from './ResultsSection';
import { WorkbenchCta } from './WorkbenchCta';
import { LandingFooter } from './LandingFooter';
import { MoonBackground } from '../common/MoonBackground';

export const LandingPage: React.FC = () => {
  return (
    <div id="view-home" className="relative min-h-screen">
      {/* Fullscreen Fixed Moon Sequence Background Layer */}
      <MoonBackground frameCount={150} basePath="/sequence" />

      {/* Subtle Readability Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(2, 4, 9, 0.4) 0%, rgba(2, 4, 9, 0.75) 100%)',
        }}
      />

      {/* Website Content Layer */}
      <div className="relative z-10">
        <TopNav />
        <main>
          <HeroSection />
          <Marquee />
          <MissionSection />
          <WorkflowSection />
          <TechnologySection />
          <ResultsSection />
          <WorkbenchCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
};
