import React, { useState, useEffect } from 'react';
import { PhosphorTheme, PunchCardData } from '../types';
import { sound } from '../utils/audioSynthesizer';
import { Play, Plus, Trash2, Download, Send, RefreshCw, Layers } from 'lucide-react';

interface PunchCardStationProps {
  theme: PhosphorTheme;
  onSendToSeance: (text: string) => void;
}

const DEFAULT_DECK = [
  '000100 IDENTIFICATION DIVISION.                                   SEANCE01',
  '000200 PROGRAM-ID. GHOST-IN-THE-MACHINE.                          SEANCE02',
  '000300 ENVIRONMENT DIVISION.                                      SEANCE03',
  '000400 DATA DIVISION.                                             SEANCE04',
  '000500 WORKING-STORAGE SECTION.                                   SEANCE05',
  '000600 01  WS-VOID-SIGNAL         PIC X(32) VALUE "FERRITE-CORE". SEANCE06',
  '000700 PROCEDURE DIVISION.                                        SEANCE07',
  '000800     DISPLAY "COMMUNING WITH MAINFRAME OF 1985...".         SEANCE08',
  '000900     PERFORM UNTIL WS-VOID-SIGNAL = "EXTINGUISHED".          SEANCE09',
  '001000     STOP RUN.                                              SEANCE10',
];

export const PunchCardStation: React.FC<PunchCardStationProps> = ({
  theme,
  onSendToSeance,
}) => {
  const [deck, setDeck] = useState<string[]>(DEFAULT_DECK);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentText, setCurrentText] = useState(DEFAULT_DECK[0]);
  const [cardData, setCardData] = useState<PunchCardData | null>(null);
  const [isPunching, setIsPunching] = useState(false);

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

  const fetchPunchCardData = async (text: string) => {
    try {
      const res = await fetch('/api/seance/punchcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setCardData(data);
      }
    } catch (e) {
      console.error('Failed to encode card:', e);
    }
  };

  useEffect(() => {
    fetchPunchCardData(currentText);
  }, [currentText]);

  const handleSelectCard = (index: number) => {
    sound.playRelayClick();
    setCardIndex(index);
    setCurrentText(deck[index] || '');
  };

  const handlePunchCustom = () => {
    setIsPunching(true);
    sound.playTapeScreech();

    let step = 0;
    const interval = setInterval(() => {
      sound.playCardPunch();
      step++;
      if (step > 4) {
        clearInterval(interval);
        setIsPunching(false);
        fetchPunchCardData(currentText);
      }
    }, 70);
  };

  const handleAddCard = () => {
    sound.playCardPunch();
    const seq = String((deck.length + 1) * 100).padStart(6, '0');
    const newCard = `${seq}     DISPLAY "A NEW GHOST JOINS THE DECK.".               SEANCE99`;
    setDeck([...deck, newCard]);
    setCardIndex(deck.length);
    setCurrentText(newCard);
  };

  const handleDeleteCard = () => {
    if (deck.length <= 1) return;
    sound.playRelayClick();
    const newDeck = deck.filter((_, i) => i !== cardIndex);
    setDeck(newDeck);
    const nextIdx = Math.max(0, cardIndex - 1);
    setCardIndex(nextIdx);
    setCurrentText(newDeck[nextIdx]);
  };

  const handleSendToChamber = () => {
    sound.playGhostWhisper();
    onSendToSeance(`Channeling punch card: "${currentText.trim()}"`);
  };

  const rows = [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-6">
      {/* Header / Intro Panel */}
      <div className={`border bg-black/80 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${getThemeTextClass()}`}>
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h2 className="text-lg font-bold font-mono tracking-wider uppercase">
              IBM 029 KEYPUNCH & 80-COLUMN HOLLERITH CARD STATION
            </h2>
          </div>
          <p className="text-xs opacity-80 mt-1">
            Before screens, software lived in rectangular holes punched into manila cardstock. Enter modern code or classic COBOL statements to punch authentic 80-column cards.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddCard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-current rounded text-xs hover:bg-current/15 transition-all font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Feed Blank Card</span>
          </button>
          <button
            onClick={handleDeleteCard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-rose-500/60 text-rose-400 rounded text-xs hover:bg-rose-950/40 transition-all font-mono"
            title="Discard current punch card"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Shred Card</span>
          </button>
          <button
            onClick={handleSendToChamber}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-current text-black font-bold rounded text-xs hover:opacity-90 transition-all font-mono"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Séance Chamber</span>
          </button>
        </div>
      </div>

      {/* Main Card Editor & Visualizer */}
      <div className={`border bg-zinc-950 p-4 rounded-lg space-y-4 ${getThemeTextClass()}`}>
        {/* Card input field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="uppercase tracking-wider font-semibold">
              CARD PUNCH BUFFER (MAX 80 COLUMNS):
            </label>
            <span className="opacity-70">
              Length: {currentText.length}/80 chars
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={80}
              value={currentText}
              onChange={(e) => {
                sound.playKeypress();
                setCurrentText(e.target.value);
                const updated = [...deck];
                updated[cardIndex] = e.target.value;
                setDeck(updated);
              }}
              className="flex-1 bg-black border border-current/50 px-3 py-2 rounded font-mono text-sm tracking-widest focus:outline-none focus:border-current"
              placeholder="000100 IDENTIFICATION DIVISION. ..."
            />
            <button
              onClick={handlePunchCustom}
              disabled={isPunching}
              className="px-4 py-2 bg-current text-black font-bold rounded font-mono text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              {isPunching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPunching ? 'PUNCHING...' : 'PUNCH HOLES'}</span>
            </button>
          </div>
        </div>

        {/* COBOL Standard 80-Column Layout Indicator */}
        <div className="grid grid-cols-12 gap-1 text-[9px] font-mono text-center opacity-80 pt-1 border-t border-current/20">
          <div className="col-span-1 bg-black/60 p-1 border border-current/20 rounded">
            <div>COLS 1-6</div>
            <div className="font-bold opacity-60">SEQUENCE</div>
          </div>
          <div className="col-span-1 bg-black/60 p-1 border border-current/20 rounded">
            <div>COL 7</div>
            <div className="font-bold opacity-60">INDICATOR</div>
          </div>
          <div className="col-span-2 bg-black/60 p-1 border border-current/20 rounded">
            <div>COLS 8-11</div>
            <div className="font-bold opacity-60">AREA A</div>
          </div>
          <div className="col-span-6 bg-black/60 p-1 border border-current/20 rounded">
            <div>COLS 12-72</div>
            <div className="font-bold opacity-60">AREA B (STATEMENTS)</div>
          </div>
          <div className="col-span-2 bg-black/60 p-1 border border-current/20 rounded">
            <div>COLS 73-80</div>
            <div className="font-bold opacity-60">IDENTIFICATION</div>
          </div>
        </div>

        {/* Authentic Vintage IBM 5081 Punched Card Graphical Representation */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[900px] bg-[#dfd3b8] text-zinc-900 p-4 rounded-md shadow-2xl relative select-none border-2 border-[#b8a685]">
            {/* Top Cutout Notch typical of punch cards (upper left corner clipped) */}
            <div
              className="absolute top-0 left-0 w-8 h-8 bg-zinc-950 pointer-events-none"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />

            {/* Card Brand Header */}
            <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#7a6a4d] border-b border-[#c8bba1] pb-1 mb-2">
              <span>IBM 5081 // STANDARD 80 COLUMN PUNCHED CARD</span>
              <span>CARD NO: {String(cardIndex + 1).padStart(3, '0')} / {String(deck.length).padStart(3, '0')}</span>
              <span>GHOST OF 1985 MAINFRAME</span>
            </div>

            {/* Printed Characters along the top margin */}
            <div className="flex font-mono text-[10px] tracking-tight font-black text-black bg-[#f2e9d2] p-1 rounded border border-[#c8bba1] mb-2 overflow-hidden">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[11.2px] text-center shrink-0 border-r border-[#e0d6be] last:border-0"
                >
                  {(currentText[i] || ' ') === ' ' ? '\u00A0' : currentText[i]}
                </div>
              ))}
            </div>

            {/* Punched Holes Grid */}
            <div className="space-y-1 font-mono text-[8px] text-[#8c7b5c]">
              {rows.map((row) => (
                <div key={row} className="flex items-center">
                  {/* Row Label */}
                  <div className="w-5 text-right pr-1 font-bold text-black shrink-0">
                    {row === 12 ? '12' : row === 11 ? '11' : row}
                  </div>

                  {/* Hole slots */}
                  <div className="flex flex-1">
                    {Array.from({ length: 80 }).map((_, colIdx) => {
                      const colData = cardData?.columns[colIdx];
                      const isPunched = colData?.punches.includes(row);

                      return (
                        <div
                          key={colIdx}
                          className="w-[11.2px] h-4 flex items-center justify-center shrink-0 relative"
                        >
                          {isPunched ? (
                            // Rectangular hole punched through the card showing black backdrop
                            <div className="w-2 h-3.5 bg-black rounded-[1px] shadow-inner ring-1 ring-black/40" />
                          ) : (
                            <span className="text-[7px] opacity-40">
                              {row >= 0 && row <= 9 ? row : ''}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Column Index Markers */}
            <div className="flex items-center pt-2 mt-2 border-t border-[#c8bba1] text-[7px] font-mono text-[#7a6a4d]">
              <div className="w-5" />
              <div className="flex flex-1">
                {Array.from({ length: 80 }).map((_, colIdx) => (
                  <div key={colIdx} className="w-[11.2px] text-center shrink-0">
                    {(colIdx + 1) % 10 === 0 ? colIdx + 1 : '·'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deck Navigation Carousel */}
        <div className="border-t border-current/20 pt-3">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-semibold uppercase">Punch Card Deck ({deck.length} Cards Loaded):</span>
            <span className="opacity-70">Click any card to load into keypunch read station</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {deck.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCard(idx)}
                className={`p-2 rounded text-left font-mono text-[11px] whitespace-nowrap shrink-0 border transition-all ${
                  idx === cardIndex
                    ? 'bg-current text-black font-bold border-current shadow-md'
                    : 'bg-black/60 border-current/30 hover:border-current hover:bg-current/10'
                }`}
              >
                <div className="text-[9px] opacity-75">CARD #{String(idx + 1).padStart(2, '0')}</div>
                <div className="max-w-[190px] truncate">{card.trim() || '[BLANK CARD]'}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
