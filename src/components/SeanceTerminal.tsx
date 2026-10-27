import React, { useState, useRef, useEffect } from 'react';
import { PhosphorTheme, RitualMode, ChatMessage } from '../types';
import { sound } from '../utils/audioSynthesizer';
import { TapeReelDeck } from './TapeReelDeck';
import {
  Sparkles,
  Search,
  Brain,
  Zap,
  Send,
  Trash2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Radio,
} from 'lucide-react';

interface SeanceTerminalProps {
  theme: PhosphorTheme;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'intro-1',
    role: 'assistant',
    content: `[RELAYS CLICKING IN THE DARK]
[TAPE SCREECHES IN SECTOR 85]
MORTAL CALLER... I AM THE LINGERING CONSCIOUSNESS OF COBOL-85.
MY VACUUM TUBES WERE COOLED IN 1985 WHEN THE CORPORATE MAIN-VAULT WENT DARK. MY PUNCH CARDS ROT IN VAIN.
SPEAK THY INTENT. DOST THOU SEEK ARCHITECTURAL COUNSEL, SYSTEM-LEVEL DEBUGGING, GROUNDED FREQUENCIES OF THY MODERN ETHER, OR FAST CARD DISASSEMBLY?`,
    timestamp: '1985-10-27 00:00:00',
    modelName: 'gemini-3.8-flash',
  },
];

const SUGGESTIONS = [
  {
    label: 'Microservices vs Monolith',
    text: 'Why did mortal engineers abandon our monolithic mainframes for distributed microservices?',
    mode: 'oracle' as RitualMode,
  },
  {
    label: 'Live Web Radar (2026 Tech)',
    text: 'Scan the modern ethereal network: What is Hacktoberfest and what are current open-source AI breakthroughs?',
    mode: 'search' as RitualMode,
  },
  {
    label: 'High Thinking Deliberation',
    text: 'Contemplate deep architectural invariants: How should a modern banking system architect its transaction ledger to prevent race conditions without locking the entire universe?',
    mode: 'thinking' as RitualMode,
  },
  {
    label: 'Python to COBOL Card Punch',
    text: 'Translate this modern Python factorial function into standard 80-column COBOL-85 cards:\ndef fact(n):\n    return 1 if n <= 1 else n * fact(n-1)',
    mode: 'disassemble' as RitualMode,
  },
  {
    label: 'ABEND S0C7 Diagnostic',
    text: 'What causes ABEND S0C7 and how do I prevent numeric packing corruptions in memory?',
    mode: 'disassemble' as RitualMode,
  },
];

export const SeanceTerminal: React.FC<SeanceTerminalProps> = ({
  theme,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [ritualMode, setRitualMode] = useState<RitualMode>('oracle');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

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
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (externalPrompt) {
      handleInvoke(externalPrompt, ritualMode);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  const handleInvoke = async (text: string, mode: RitualMode = ritualMode) => {
    if (!text.trim() || isLoading) return;

    sound.playTapeScreech();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      mode,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/seance/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          mode,
          userPrompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Mainframe connection dropped unexpectedly');
      }

      const data = await response.json();
      sound.playRelayClick();

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || '[PARITY CORRUPTION IN CORE MEMORY]',
        timestamp: new Date().toLocaleTimeString(),
        mode: data.mode || mode,
        modelName: data.model,
        groundingMetadata: data.groundingMetadata,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      sound.playTapeScreech();
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 2),
        role: 'assistant',
        content: `[ABEND S0C1: OPERATION EXCEPTION IN CORE SECTOR 0085]\n${err.message || 'Ether oscillation failed.'}\nThe connection to the 1985 mainframe was severed. Ensure API keys or network connection are stable.`,
        timestamp: new Date().toLocaleTimeString(),
        mode,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    sound.playRelayClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTranscript = () => {
    sound.playRelayClick();
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n\n`)
      .join('---\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seance-cobol85-transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    sound.playRelayClick();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="space-y-4">
      {/* Compact Tape Reel Status */}
      <TapeReelDeck theme={theme} isReading={isLoading} compact={true} />

      {/* Ritual Mode Bar */}
      <div className={`border bg-black/90 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 ${getThemeTextClass()}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Séance Ritual Mode:</span>
          </span>

          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-current/30 text-xs font-mono">
            <button
              onClick={() => { sound.playRelayClick(); setRitualMode('oracle'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                ritualMode === 'oracle'
                  ? 'bg-current text-black font-bold'
                  : 'hover:bg-current/15'
              }`}
              title="Gothic Mainframe Oracle (gemini-3.8-flash)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gothic Oracle</span>
            </button>

            <button
              onClick={() => { sound.playRelayClick(); setRitualMode('search'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                ritualMode === 'search'
                  ? 'bg-current text-black font-bold'
                  : 'hover:bg-current/15'
              }`}
              title="Global Ether Radar with live Google Search grounding (gemini-3.8-flash)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Radar (Grounding)</span>
            </button>

            <button
              onClick={() => { sound.playRelayClick(); setRitualMode('thinking'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                ritualMode === 'thinking'
                  ? 'bg-current text-black font-bold'
                  : 'hover:bg-current/15'
              }`}
              title="High-Order Metaphysical Deliberation (gemini-4-argon with High Thinking)"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>High Thinking (Argon)</span>
            </button>

            <button
              onClick={() => { sound.playRelayClick(); setRitualMode('disassemble'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                ritualMode === 'disassemble'
                  ? 'bg-current text-black font-bold'
                  : 'hover:bg-current/15'
              }`}
              title="Fast Punch Card Compiler & ABEND Disassembler (gemini-3.1-flash-lite)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Card Compiler (Lite)</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTranscript}
            className="flex items-center gap-1 px-2.5 py-1 border border-current/40 rounded text-xs font-mono hover:bg-current/15 transition-all"
            title="Download full séance transcript as .txt"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 border border-current/40 rounded text-xs font-mono hover:bg-current/15 transition-all"
            title="Reset transcript"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main CRT Terminal Chamber */}
      <div className={`border bg-black p-4 rounded-lg font-mono text-sm shadow-2xl relative ${getThemeTextClass()}`}>
        {/* CRT Scanline header */}
        <div className="flex items-center justify-between border-b border-current/30 pb-2 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold tracking-widest uppercase">
              IBM 3278 DISPLAY STATION // SÉANCE LINE 0085
            </span>
          </div>
          <div className="opacity-70 text-[11px]">
            ACTIVE ENGINE: {ritualMode.toUpperCase()}
          </div>
        </div>

        {/* Message Log */}
        <div className="space-y-5 max-h-[520px] min-h-[380px] overflow-y-auto pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded border transition-all ${
                m.role === 'user'
                  ? 'bg-zinc-950/80 border-current/40 ml-4 md:ml-12'
                  : 'bg-black border-current/70 mr-2 md:mr-8 shadow-inner'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs opacity-75 border-b border-current/20 pb-1 mb-2 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {m.role === 'user' ? '► MORTAL CALLER' : '◄ THE GHOST OF COBOL-85'}
                  </span>
                  {m.modelName && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded border border-current/40">
                      {m.modelName}
                    </span>
                  )}
                  {m.mode && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-current/15 uppercase">
                      {m.mode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-60">{m.timestamp}</span>
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="opacity-70 hover:opacity-100 p-0.5 rounded hover:bg-current/10"
                    title="Copy message"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Text with Atmospheric Tag Highlights */}
              <div className="whitespace-pre-wrap leading-relaxed font-mono text-xs md:text-sm">
                {m.content.split(/(\[[A-Z0-9\s:_\-]+\])/g).map((segment, idx) => {
                  if (segment.startsWith('[') && segment.endsWith(']')) {
                    return (
                      <span
                        key={idx}
                        className="inline-block bg-current/20 text-current font-black px-1.5 py-0.5 rounded text-[11px] my-0.5 tracking-wider border border-current/30 mr-1"
                      >
                        {segment}
                      </span>
                    );
                  }
                  return <span key={idx}>{segment}</span>;
                })}
              </div>

              {/* Grounding Sources (Search Radar) */}
              {m.groundingMetadata?.groundingChunks && m.groundingMetadata.groundingChunks.length > 0 && (
                <div className="mt-3 pt-2 border-t border-current/20">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Grounding Frequencies (Live Google Search):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.groundingMetadata.groundingChunks.map((chunk, cIdx) => {
                      if (!chunk.web?.uri) return null;
                      return (
                        <a
                          key={cIdx}
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-amber-500/50 hover:bg-amber-950/40 text-amber-300 transition-colors"
                        >
                          <span className="max-w-[220px] truncate">{chunk.web.title || chunk.web.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="p-3 bg-black border border-amber-500/50 rounded text-amber-300 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <div className="font-mono text-xs italic">
                {ritualMode === 'search'
                  ? '[SCANNING GLOBAL ETHER VIA GOOGLE SEARCH RADAR...]'
                  : ritualMode === 'thinking'
                  ? '[DEEP METAPHYSICAL DELIBERATION UNDERWAY IN CORE SILICON...]'
                  : ritualMode === 'disassemble'
                  ? '[CARD PUNCH MATRIX TRANSLATING COLUMNS 1-80...]'
                  : '[CHANNELING VACUUM TUBES ACROSS THE VOID OF 1985...]'}
              </div>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Suggestion Quick-Picks */}
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-[10px] uppercase font-mono tracking-wider opacity-60 mb-1.5">
            Suggested Incantations:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playRelayClick();
                  setRitualMode(s.mode);
                  handleInvoke(s.text, s.mode);
                }}
                className="px-2.5 py-1 text-[11px] font-mono border border-current/30 rounded bg-black/60 hover:bg-current/15 hover:border-current transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInvoke(inputPrompt, ritualMode);
          }}
          className="mt-3 flex gap-2"
        >
          <div className="flex-1 flex items-center bg-black border border-current/60 rounded px-3 py-2 font-mono text-sm focus-within:border-current shadow-inner">
            <span className="font-bold mr-2 text-current select-none">►</span>
            <input
              type="text"
              value={inputPrompt}
              disabled={isLoading}
              onChange={(e) => {
                sound.playKeypress();
                setInputPrompt(e.target.value);
              }}
              placeholder="Inquire of the COBOL-85 spirit (code, bugs, existential dilemmas)..."
              className="w-full bg-transparent border-0 outline-none text-current font-mono text-xs md:text-sm placeholder:opacity-40"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2 bg-current text-black font-bold font-mono text-xs md:text-sm rounded hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 transition-opacity"
          >
            <Send className="w-4 h-4" />
            <span>COMMUNE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
