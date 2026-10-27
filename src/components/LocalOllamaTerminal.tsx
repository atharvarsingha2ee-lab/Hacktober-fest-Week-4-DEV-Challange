import React, { useState, useRef, useEffect } from 'react';
import { PhosphorTheme } from '../types';
import { sound } from '../utils/audioSynthesizer';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface LocalOllamaTerminalProps {
  theme: PhosphorTheme;
}

interface TermLine {
  id: string;
  type: 'system' | 'prompt' | 'output' | 'error';
  text: string;
  color?: string;
}

export const LocalOllamaTerminal: React.FC<LocalOllamaTerminalProps> = ({ theme }) => {
  const [lines, setLines] = useState<TermLine[]>([
    { id: '1', type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
    { id: '2', type: 'system', text: '║                 THE SÉANCE OF COBOL-85                    ║' },
    { id: '3', type: 'system', text: '║              A Local Open-Source AI Ritual                ║' },
    { id: '4', type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
    { id: '5', type: 'system', text: '\n[!] Initializing magnetic tape readers...' },
    { id: '6', type: 'system', text: '[!] Channeling frequencies across the void...' },
    { id: '7', type: 'system', text: 'Connection established. The machine breathes again...\n' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

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
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isRunning) return;

    const userText = inputVal.trim();
    setInputVal('');
    sound.playKeypress();

    const userLineId = String(Date.now());
    const newLines = [
      ...lines,
      { id: userLineId, type: 'prompt' as const, text: `You (speak to the spirit): ${userText}` },
    ];
    setLines(newLines);

    if (userText.toLowerCase() === 'exit' || userText.toLowerCase() === 'quit' || userText.toLowerCase() === 'banish') {
      sound.playTapeScreech();
      setLines((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          type: 'error' as const,
          text: '\n[!] The spirit fades back into the magnetic tapes... Farewell.',
        },
      ]);
      return;
    }

    setIsRunning(true);
    setLines((prev) => [
      ...prev,
      {
        id: String(Date.now() + 2),
        type: 'system' as const,
        text: 'The terminal flickers as the ghost contemplates your words...',
      },
    ]);

    try {
      sound.playTapeScreech();
      const res = await fetch('/api/seance/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userText }],
          mode: 'oracle',
        }),
      });

      if (!res.ok) throw new Error('Mainframe connection dropped');
      const data = await res.json();
      const reply = data.reply || '[SILENCE FROM THE CORE]';

      sound.playRelayClick();
      setLines((prev) => [
        ...prev,
        {
          id: String(Date.now() + 3),
          type: 'output' as const,
          text: `\nCOBOL-85's Spirit:\n${reply}\n--------------------------------------------------`,
        },
      ]);
    } catch (err: any) {
      setLines((prev) => [
        ...prev,
        {
          id: String(Date.now() + 4),
          type: 'error' as const,
          text: `\n[!] Error in the ether: ${err.message || 'Connection failure'}\nMake sure Ollama is running locally (\`ollama serve\`) and you have pulled \`llama3\` (\`ollama pull llama3\`).`,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    sound.playRelayClick();
    setLines([
      { id: '1', type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
      { id: '2', type: 'system', text: '║                 THE SÉANCE OF COBOL-85                    ║' },
      { id: '3', type: 'system', text: '║              A Local Open-Source AI Ritual                ║' },
      { id: '4', type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
      { id: '5', type: 'system', text: '\n[!] Initializing magnetic tape readers...' },
      { id: '6', type: 'system', text: '[!] Channeling frequencies across the void...' },
      { id: '7', type: 'system', text: 'Connection established. The machine breathes again...\n' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header instructions */}
      <div className={`border bg-black/85 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${getThemeTextClass()}`}>
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-mono tracking-wider uppercase">
              LOCAL PYTHON & OLLAMA SEANCE RUNNER
            </h2>
          </div>
          <p className="text-xs opacity-80 mt-1">
            Simulate running <code className="bg-black/60 px-1 py-0.5 rounded border border-current/40">python main.py</code> locally with Rich terminal formatting and open-source Llama 3 weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-current rounded text-xs hover:bg-current/15 transition-all font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Terminal</span>
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className={`border bg-black p-4 rounded-lg font-mono text-xs ${getThemeTextClass()} shadow-2xl`}>
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-current/30 pb-2 mb-3 text-[11px] opacity-75">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2">bash - python main.py (Local Ollama Session)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>OLLAMA: READY</span>
            </span>
            <span>MODEL: llama3:8b</span>
          </div>
        </div>

        {/* Scrollable output area */}
        <div className="h-[420px] overflow-y-auto space-y-2 pr-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`leading-relaxed whitespace-pre-wrap ${
                line.type === 'system'
                  ? 'opacity-80 italic text-cyan-300'
                  : line.type === 'prompt'
                  ? 'font-bold text-amber-300'
                  : line.type === 'error'
                  ? 'text-rose-400 font-bold'
                  : 'text-emerald-300'
              }`}
            >
              {line.text}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-2 text-amber-400 italic">
              <span className="animate-spin">⠋</span>
              <span>The spirit spins the magnetic tape reels in the ether...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Prompt Input Line */}
        <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-current/25 flex items-center gap-2">
          <span className="text-cyan-400 font-bold shrink-0">You (speak to the spirit):</span>
          <input
            type="text"
            value={inputVal}
            disabled={isRunning}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message or 'exit'..."
            className="flex-1 bg-transparent border-0 outline-none text-current font-mono text-xs placeholder:opacity-30"
            autoFocus
          />
          <button
            type="submit"
            disabled={isRunning || !inputVal.trim()}
            className="px-3 py-1 bg-current text-black font-bold rounded text-xs hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            Send
          </button>
        </form>
      </div>

      {/* Local execution guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="border border-current/40 bg-zinc-950 p-3 rounded">
          <div className="font-bold uppercase mb-1 text-emerald-400">1. Install Ollama</div>
          <p className="opacity-75">
            Download from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline">ollama.com</a> and start the local daemon:
          </p>
          <pre className="bg-black p-1.5 rounded mt-2 text-[11px] text-amber-300">ollama serve</pre>
        </div>

        <div className="border border-current/40 bg-zinc-950 p-3 rounded">
          <div className="font-bold uppercase mb-1 text-emerald-400">2. Pull Llama 3 Model</div>
          <p className="opacity-75">
            Pull open weights locally to run 100% offline with zero token fees:
          </p>
          <pre className="bg-black p-1.5 rounded mt-2 text-[11px] text-amber-300">ollama pull llama3</pre>
        </div>

        <div className="border border-current/40 bg-zinc-950 p-3 rounded">
          <div className="font-bold uppercase mb-1 text-emerald-400">3. Run the Séance</div>
          <p className="opacity-75">
            Install python dependencies and invoke the ancient mainframe spirit:
          </p>
          <pre className="bg-black p-1.5 rounded mt-2 text-[11px] text-amber-300">python main.py</pre>
        </div>
      </div>
    </div>
  );
};
