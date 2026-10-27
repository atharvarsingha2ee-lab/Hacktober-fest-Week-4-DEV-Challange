import React, { useState } from 'react';
import { PhosphorTheme } from './types';
import { MainframeHeader } from './components/MainframeHeader';
import { SeanceTerminal } from './components/SeanceTerminal';
import { PunchCardStation } from './components/PunchCardStation';
import { DevtoSubmissionSuite } from './components/DevtoSubmissionSuite';
import { LocalOllamaTerminal } from './components/LocalOllamaTerminal';
import { HardwareMonitor } from './components/HardwareMonitor';

export default function App() {
  const [theme, setTheme] = useState<PhosphorTheme>('green');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'seance' | 'punchcard' | 'devto' | 'ollama' | 'hardware'
  >('seance');
  const [externalPrompt, setExternalPrompt] = useState<string | undefined>(undefined);

  const getGlowClass = () => {
    switch (theme) {
      case 'amber':
        return 'crt-glow-amber text-amber-400';
      case 'cyan':
        return 'crt-glow-cyan text-cyan-400';
      case 'red':
        return 'crt-glow-red text-rose-400';
      default:
        return 'crt-glow-green text-emerald-400';
    }
  };

  const handleSendToSeance = (text: string) => {
    setExternalPrompt(text);
    setActiveTab('seance');
  };

  return (
    <div
      className={`min-h-screen bg-black transition-colors duration-300 font-mono-code relative ${
        crtEnabled ? 'crt-screen crt-scanlines crt-curvature' : ''
      } ${getGlowClass()}`}
    >
      {/* Top Mainframe Navigation & Phosphor Control */}
      <MainframeHeader
        theme={theme}
        setTheme={setTheme}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Chamber */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === 'seance' && (
          <SeanceTerminal
            theme={theme}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(undefined)}
          />
        )}

        {activeTab === 'punchcard' && (
          <PunchCardStation
            theme={theme}
            onSendToSeance={handleSendToSeance}
          />
        )}

        {activeTab === 'devto' && (
          <DevtoSubmissionSuite theme={theme} />
        )}

        {activeTab === 'ollama' && (
          <LocalOllamaTerminal theme={theme} />
        )}

        {activeTab === 'hardware' && (
          <HardwareMonitor theme={theme} />
        )}
      </main>

      {/* Bottom Footer Telemetry */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-current/20 text-xs opacity-70 flex flex-col md:flex-row items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <span>COBOL-85 REVISION 3.2</span>
          <span>•</span>
          <span>EBCDIC CODEPAGE 037</span>
          <span>•</span>
          <span>PARITY: ODD</span>
          <span>•</span>
          <span>SYSTEM 370/XA</span>
        </div>
        <div>
          Hacktoberfest 2026 Week 4: "Ghost in the Machine" • Powered by Gemini & Open Weights
        </div>
      </footer>
    </div>
  );
}
