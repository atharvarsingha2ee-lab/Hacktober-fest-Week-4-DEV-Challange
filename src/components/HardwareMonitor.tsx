import React, { useState, useEffect } from 'react';
import { PhosphorTheme } from '../types';
import { TapeReelDeck } from './TapeReelDeck';
import { sound } from '../utils/audioSynthesizer';
import { Cpu, Activity, Disc, Radio, Sliders } from 'lucide-react';

interface HardwareMonitorProps {
  theme: PhosphorTheme;
}

export const HardwareMonitor: React.FC<HardwareMonitorProps> = ({ theme }) => {
  const [pc, setPc] = useState(0x0085a0);
  const [acc, setAcc] = useState(0x3f12);
  const [coolantTemp, setCoolantTemp] = useState(58.4);
  const [tapeSpinning, setTapeSpinning] = useState(false);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setPc((prev) => (prev + 4 > 0x0085ff ? 0x008500 : prev + 4));
      setAcc((prev) => (prev ^ 0x0421) + 1);
      setCoolantTemp(58.0 + Math.random() * 0.8);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const handleTestAudio = (type: 'relay' | 'punch' | 'tape' | 'ghost' | 'hum') => {
    switch (type) {
      case 'relay':
        sound.playRelayClick();
        break;
      case 'punch':
        sound.playCardPunch();
        break;
      case 'tape':
        sound.playTapeScreech();
        setTapeSpinning(true);
        setTimeout(() => setTapeSpinning(false), 2000);
        break;
      case 'ghost':
        sound.playGhostWhisper();
        break;
      case 'hum':
        sound.toggleMute();
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tape Subsystem Deck */}
      <TapeReelDeck theme={theme} isReading={tapeSpinning} />

      {/* Mainframe CPU & Memory Hardware Panel */}
      <div className={`border bg-zinc-950 p-4 rounded-lg space-y-4 ${getThemeTextClass()}`}>
        <div className="flex items-center justify-between border-b border-current/25 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider">
              IBM 3090-600E CENTRAL PROCESSING COMPLEX // SYSTEM TELEMETRY
            </h2>
          </div>
          <span className="text-xs font-mono opacity-80">CLOCK: 14.5 NANOSECONDS</span>
        </div>

        {/* Hex Registers Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="border border-current/30 bg-black/60 p-2.5 rounded">
            <div className="opacity-60 text-[10px]">PROGRAM COUNTER (PC)</div>
            <div className="text-base font-bold tracking-widest text-emerald-400">
              0x{pc.toString(16).toUpperCase().padStart(6, '0')}
            </div>
            <div className="text-[9px] opacity-50 mt-1">INSTRUCTION FETCHED</div>
          </div>

          <div className="border border-current/30 bg-black/60 p-2.5 rounded">
            <div className="opacity-60 text-[10px]">ACCUMULATOR (ACC)</div>
            <div className="text-base font-bold tracking-widest text-amber-400">
              0x{acc.toString(16).toUpperCase().padStart(4, '0')}
            </div>
            <div className="text-[9px] opacity-50 mt-1">EBCDIC ARITHMETIC REG</div>
          </div>

          <div className="border border-current/30 bg-black/60 p-2.5 rounded">
            <div className="opacity-60 text-[10px]">PROGRAM STATUS WORD (PSW)</div>
            <div className="text-xs font-bold tracking-wider text-cyan-300">
              078D1000 80004F20
            </div>
            <div className="text-[9px] opacity-50 mt-1">PROBLEM STATE: ACTIVE</div>
          </div>

          <div className="border border-current/30 bg-black/60 p-2.5 rounded">
            <div className="opacity-60 text-[10px]">CHILLER COOLANT TEMP</div>
            <div className="text-base font-bold tracking-widest text-emerald-300">
              {coolantTemp.toFixed(1)}°F (FLOW 42 GPM)
            </div>
            <div className="text-[9px] opacity-50 mt-1">LIQUID NITROGEN LOOP: NOMINAL</div>
          </div>
        </div>

        {/* General Purpose Registers R0 - R15 */}
        <div className="border border-current/20 bg-black/40 p-3 rounded space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-between">
            <span>GENERAL PURPOSE REGISTERS (R0 - R7)</span>
            <span className="opacity-60 text-[10px]">32-BIT HIGH SPEED ECL BIPOLAR</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 font-mono text-[11px]">
            {['R0: 00000000', 'R1: 000280F4', 'R2: 0000000A', 'R3: 7FFF1000', 'R4: 000085C0', 'R5: 00000001', 'R6: 0012A4F0', 'R7: 000000FF'].map(
              (reg, i) => (
                <div key={i} className="bg-black/80 border border-current/25 p-1 text-center rounded">
                  <div className="text-[9px] opacity-60">REG {i}</div>
                  <div className="font-bold">{reg.split(': ')[1]}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Audio Synthesizer Manual Test Controls */}
        <div className="border-t border-current/25 pt-3">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase">
            <Radio className="w-4 h-4" />
            <span>Procedural Sound Synthesizer Diagnostics:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => handleTestAudio('relay')}
              className="px-3 py-1.5 bg-black border border-current rounded hover:bg-current/15 transition-all"
            >
              Test Relay Click
            </button>
            <button
              onClick={() => handleTestAudio('punch')}
              className="px-3 py-1.5 bg-black border border-current rounded hover:bg-current/15 transition-all"
            >
              Test Solenoid Punch
            </button>
            <button
              onClick={() => handleTestAudio('tape')}
              className="px-3 py-1.5 bg-black border border-current rounded hover:bg-current/15 transition-all"
            >
              Test Tape Screech
            </button>
            <button
              onClick={() => handleTestAudio('ghost')}
              className="px-3 py-1.5 bg-black border border-current rounded hover:bg-current/15 transition-all"
            >
              Test Ghost Whisper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
