import React from 'react';
import { Volume2, VolumeX, Monitor, Sparkles, Terminal, Cpu, FileText, Code2 } from 'lucide-react';
import { PhosphorTheme } from '../types';
import { sound } from '../utils/audioSynthesizer';

interface MainframeHeaderProps {
  theme: PhosphorTheme;
  setTheme: (t: PhosphorTheme) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  activeTab: 'seance' | 'punchcard' | 'devto' | 'ollama' | 'hardware';
  setActiveTab: (tab: 'seance' | 'punchcard' | 'devto' | 'ollama' | 'hardware') => void;
}

export const MainframeHeader: React.FC<MainframeHeaderProps> = ({
  theme,
  setTheme,
  crtEnabled,
  setCrtEnabled,
  isMuted,
  setIsMuted,
  activeTab,
  setActiveTab,
}) => {
  const getThemeColorClass = () => {
    switch (theme) {
      case 'amber':
        return 'text-amber-400 border-amber-800/80 bg-amber-950/20';
      case 'cyan':
        return 'text-cyan-400 border-cyan-800/80 bg-cyan-950/20';
      case 'red':
        return 'text-rose-400 border-rose-800/80 bg-rose-950/20';
      default:
        return 'text-emerald-400 border-emerald-800/80 bg-emerald-950/20';
    }
  };

  const handleTabClick = (tab: typeof activeTab) => {
    sound.playRelayClick();
    setActiveTab(tab);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleCrt = () => {
    sound.playRelayClick();
    setCrtEnabled(!crtEnabled);
  };

  return (
    <header className={`border-b ${getThemeColorClass()} px-4 py-3 select-none backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title and Hacktoberfest badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm border flex items-center justify-center font-bold text-lg animate-pulse border-current">
            85
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-widest uppercase font-mono-code flex items-center gap-2">
                THE SÉANCE OF COBOL-85
              </h1>
              <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-current font-semibold opacity-85">
                IBM 3090 / MVS
              </span>
            </div>
            <p className="text-xs tracking-wide opacity-80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-current animate-ping" />
              <span>Hacktoberfest Week 4: "Ghost in the Machine" • Offline Séance Architecture</span>
            </p>
          </div>
        </div>

        {/* System controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Phosphor Theme selector */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-current/40">
            <span className="text-[10px] uppercase px-1.5 opacity-60">Phosphor:</span>
            <button
              onClick={() => { sound.playRelayClick(); setTheme('green'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                theme === 'green' ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-emerald-950/60'
              }`}
              title="Green Phosphor (P1)"
            >
              P1 Green
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setTheme('amber'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                theme === 'amber' ? 'bg-amber-500 text-black font-bold' : 'hover:bg-amber-950/60'
              }`}
              title="Amber Phosphor (P3)"
            >
              P3 Amber
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setTheme('cyan'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                theme === 'cyan' ? 'bg-cyan-500 text-black font-bold' : 'hover:bg-cyan-950/60'
              }`}
              title="Monochrome Cyan (IBM 3270)"
            >
              3270 Cyan
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setTheme('red'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                theme === 'red' ? 'bg-rose-500 text-black font-bold' : 'hover:bg-rose-950/60'
              }`}
              title="ABEND Red Alert"
            >
              ABEND Red
            </button>
          </div>

          {/* CRT toggle */}
          <button
            onClick={handleToggleCrt}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              crtEnabled ? 'border-current bg-current/15' : 'border-current/30 opacity-60'
            }`}
            title="Toggle CRT Scanline and curvature filter"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>CRT {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              !isMuted ? 'border-current bg-current/15' : 'border-current/30 opacity-60'
            }`}
            title={isMuted ? 'Enable procedural audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'MUTED' : 'RELAY AUDIO'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation tabs */}
      <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-current/20 flex flex-wrap items-center gap-1">
        <button
          onClick={() => handleTabClick('seance')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs uppercase tracking-wider font-mono font-semibold transition-all ${
            activeTab === 'seance'
              ? 'bg-black border-t-2 border-x border-current text-white shadow-lg'
              : 'opacity-70 hover:opacity-100 hover:bg-current/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Séance Chamber (4 AI Rituals)</span>
        </button>

        <button
          onClick={() => handleTabClick('punchcard')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs uppercase tracking-wider font-mono font-semibold transition-all ${
            activeTab === 'punchcard'
              ? 'bg-black border-t-2 border-x border-current text-white shadow-lg'
              : 'opacity-70 hover:opacity-100 hover:bg-current/10'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>80-Col Punch Card Station</span>
        </button>

        <button
          onClick={() => handleTabClick('devto')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs uppercase tracking-wider font-mono font-semibold transition-all ${
            activeTab === 'devto'
              ? 'bg-black border-t-2 border-x border-current text-white shadow-lg'
              : 'opacity-70 hover:opacity-100 hover:bg-current/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DEV.to Submission Suite</span>
        </button>

        <button
          onClick={() => handleTabClick('ollama')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs uppercase tracking-wider font-mono font-semibold transition-all ${
            activeTab === 'ollama'
              ? 'bg-black border-t-2 border-x border-current text-white shadow-lg'
              : 'opacity-70 hover:opacity-100 hover:bg-current/10'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Local Python & Ollama Runner</span>
        </button>

        <button
          onClick={() => handleTabClick('hardware')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs uppercase tracking-wider font-mono font-semibold transition-all ${
            activeTab === 'hardware'
              ? 'bg-black border-t-2 border-x border-current text-white shadow-lg'
              : 'opacity-70 hover:opacity-100 hover:bg-current/10'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Tape Reels & Hardware Deck</span>
        </button>
      </div>
    </header>
  );
};
