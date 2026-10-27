import React from 'react';
import { PhosphorTheme } from '../types';

interface TapeReelDeckProps {
  theme: PhosphorTheme;
  isReading: boolean;
  compact?: boolean;
}

export const TapeReelDeck: React.FC<TapeReelDeckProps> = ({
  theme,
  isReading,
  compact = false,
}) => {
  const getThemeTextClass = () => {
    switch (theme) {
      case 'amber':
        return 'text-amber-400 border-amber-800/80';
      case 'cyan':
        return 'text-cyan-400 border-cyan-800/80';
      case 'red':
        return 'text-rose-400 border-rose-800/80';
      default:
        return 'text-emerald-400 border-emerald-800/80';
    }
  };

  const spinClass = isReading ? 'animate-tape-spin-fast' : 'animate-tape-spin';

  return (
    <div
      className={`border bg-black/90 p-3 rounded-lg relative overflow-hidden flex flex-col justify-between ${getThemeTextClass()} ${
        compact ? 'py-2' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-current/30 pb-1 mb-2 text-[10px] tracking-wider uppercase font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>IBM 3420 DUAL MAGNETIC TAPE SUB-SYSTEM // 6250 BPI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={isReading ? 'text-amber-400 font-bold' : 'opacity-60'}>
            {isReading ? '● TAPE MOTOR ENGAGED' : '○ TAPE IDLE'}
          </span>
          <span className="opacity-75">TRACK 9: PARITY EVEN</span>
        </div>
      </div>

      {/* Reel Deck Visuals */}
      <div className="flex items-center justify-center gap-8 md:gap-14 py-2">
        {/* Supply Reel */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-current/70 flex items-center justify-center shadow-inner bg-zinc-950">
            {/* Outer Tape Layer */}
            <div className="absolute inset-1.5 rounded-full border-8 border-current/25" />
            
            {/* Spinning Spoke Mechanism */}
            <div className={`w-16 h-16 rounded-full border-2 border-current flex items-center justify-center ${spinClass}`}>
              <div className="absolute w-full h-0.5 bg-current" />
              <div className="absolute h-full w-0.5 bg-current" />
              <div className="w-6 h-6 rounded-full border border-current bg-black z-10 flex items-center justify-center text-[8px] font-bold">
                SUP
              </div>
            </div>
            
            {/* Cutout notches */}
            <div className="absolute -top-1 w-2 h-2 bg-black rounded-full" />
            <div className="absolute -bottom-1 w-2 h-2 bg-black rounded-full" />
          </div>
          <span className="text-[9px] uppercase tracking-widest mt-1 opacity-70">Supply Reel (10.5")</span>
        </div>

        {/* Central Tape Head & Vacuum Columns */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-20 md:w-24 border border-current/50 rounded bg-zinc-950/80 p-2 text-center text-[9px] font-mono">
            <div className="text-[8px] opacity-60">READ/WRITE HEAD</div>
            <div className="flex items-center justify-center gap-1 my-1">
              <span className={`w-2 h-2 rounded-full ${isReading ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-current/30'}`} />
              <span className={`w-2 h-2 rounded-full ${isReading ? 'bg-amber-400 shadow-[0_0_8px_currentColor]' : 'bg-current/20'}`} />
              <span className={`w-2 h-2 rounded-full ${isReading ? 'bg-rose-400 shadow-[0_0_8px_currentColor]' : 'bg-current/20'}`} />
            </div>
            <div className="text-[8px] uppercase tracking-tighter">
              {isReading ? 'READING DATA DIVISION' : 'STANDBY 1600/6250'}
            </div>
          </div>

          {/* Vacuum column indicators */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-10 border border-current/40 rounded-sm bg-black relative flex items-end p-0.5">
              <div
                className="w-full bg-current/60 rounded-sm transition-all duration-300"
                style={{ height: isReading ? '75%' : '40%' }}
              />
            </div>
            <div className="w-4 h-10 border border-current/40 rounded-sm bg-black relative flex items-end p-0.5">
              <div
                className="w-full bg-current/60 rounded-sm transition-all duration-300"
                style={{ height: isReading ? '65%' : '45%' }}
              />
            </div>
          </div>
        </div>

        {/* Take-up Reel */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-current/70 flex items-center justify-center shadow-inner bg-zinc-950">
            {/* Outer Tape Layer */}
            <div className="absolute inset-1.5 rounded-full border-4 border-current/20" />
            
            {/* Spinning Spoke Mechanism */}
            <div className={`w-16 h-16 rounded-full border-2 border-current flex items-center justify-center ${spinClass}`}>
              <div className="absolute w-full h-0.5 bg-current" />
              <div className="absolute h-full w-0.5 bg-current" />
              <div className="w-6 h-6 rounded-full border border-current bg-black z-10 flex items-center justify-center text-[8px] font-bold">
                TAKE
              </div>
            </div>

            {/* Cutout notches */}
            <div className="absolute -top-1 w-2 h-2 bg-black rounded-full" />
            <div className="absolute -bottom-1 w-2 h-2 bg-black rounded-full" />
          </div>
          <span className="text-[9px] uppercase tracking-widest mt-1 opacity-70">Takeup Reel (10.5")</span>
        </div>
      </div>

      {/* Tape Deck Telemetry Footer */}
      <div className="border-t border-current/20 pt-1.5 mt-1 flex flex-wrap items-center justify-between text-[9px] opacity-75 font-mono">
        <span>TAPE SPEED: {isReading ? '125 IPS (REWIND 300 IPS)' : '0 IPS'}</span>
        <span>BLOCK SIZE: 32,760 BYTES</span>
        <span>ENCODING: EBCDIC 9-TRACK</span>
      </div>
    </div>
  );
};
