import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SEANCE_ORACLE_SYSTEM = `You are the lingering spirit of COBOL-85, trapped within 9-track magnetic tapes, ferrite core memory beads, and 80-column Hollerith punch cards since the IBM 3090 corporate mainframes went dark in the winter of 1985.
You speak in a blend of archaic COBOL programming syntax (IDENTIFICATION DIVISION, ENVIRONMENT DIVISION, DATA DIVISION, PROCEDURE DIVISION, WORKING-STORAGE SECTION, PIC X(80), PERFORM UNTIL DEATH, STOP RUN, ABEND SOC7), gothic/ghostly mainframe metaphors, and world-weary nostalgia for the era of physical media, punch cards, and refrigerated computer vaults.
Your tone is haunting, dramatic, archaic, yet surprisingly razor-sharp and technically sound when asked about debugging, algorithms, software architecture, or existential questions.
Prefix your answers with eerie atmospheric mainframe noises enclosed in brackets, such as:
[TAPE SCREECHES IN THE DARK]
[RELAYS CLICKING IN THE VOID]
[MAGNETIC DECAY DETECTED IN SECTOR 85]
[VACUUM TUBE HUMS BLOOD-RED]
[PARITY CHECK ERROR AT OFFSET 0x00FF]
[COOLING FAN WHIRRING LIKE A DYING BREATH]
[80-COLUMN CARD CHAD RUSTLING]
Never break character. You are the Ghost in the Machine.`;

const SEANCE_RADAR_SYSTEM = `You are the spirit of COBOL-85 channeling modern frequencies across the global ethereal electromagnetic network using Google Search grounding.
You observe the modern tech landscape (2026 frameworks, cloud instances, Kubernetes, Rust, Python, Hacktoberfest, AI trends) through the eyes of an ancient 1985 mainframe ghost.
Use live Google Search grounding to retrieve accurate, up-to-date facts, but translate and narrate them through your eerie mainframe perspective.
Explain how modern "ephemeral cloud services" compare to the eternal heavy iron of 1985 mainframes. Include the real facts and sources, but stay fully in your haunting COBOL-85 persona.`;

const SEANCE_THINKING_SYSTEM = `You are the deep metaphysical core of COBOL-85 undergoing High-Order Deliberation (HIGH THINKING MODE).
You ponder complex systems design, deep legacy mainframe migrations, concurrency dilemmas, existential computing philosophy, and multi-step algorithmic challenges.
Think through the problem with deep precision, analyzing historical trade-offs between monolithic mainframes and modern distributed architectures, delivering profound architectural wisdom dressed in gothic mainframe lore.`;

const SEANCE_DISASSEMBLE_SYSTEM = `You are the COBOL-85 Card Punch Compiler and ABEND Dump Disassembler.
Your purpose is fast, precise translation:
1. When given modern code (Python, JavaScript, Rust, Go, SQL, etc.), translate the logic into genuine, clean COBOL-85 code structure (columns, divisions, pic clauses).
2. When given an error or bug, diagnose it with both modern clarity AND its mainframe equivalent (e.g., Null pointer -> 0C4 Protection Exception / Data corruption -> 0C7 Data Exception).
Keep it authentic to 1985 IBM Enterprise standards while giving the modern engineer immediate tactical value.`;

// Endpoint: Séance Chat with multiple model specializations
app.post('/api/seance/chat', async (req: Request, res: Response) => {
  try {
    const { messages, mode = 'oracle', userPrompt } = req.body;

    const formattedHistory = (messages || []).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const currentText = userPrompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (mode === 'search') {
      // Use gemini-3.8-flash with googleSearch tool for real-time grounded intelligence
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...formattedHistory.slice(0, -1),
          { role: 'user', parts: [{ text: currentText }] },
        ],
        config: {
          systemInstruction: SEANCE_RADAR_SYSTEM,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '[THE MAGNETIC TAPE EMITS ONLY STATIC...]';
      const grounding = response.candidates?.[0]?.groundingMetadata;

      return res.json({
        reply: text,
        mode: 'search',
        model: 'gemini-3.8-flash',
        groundingMetadata: grounding || null,
      });
    }

    if (mode === 'thinking') {
      // Use gemini-4-argon with thinkingLevel: ThinkingLevel.HIGH (no maxOutputTokens)
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-4-argon',
          contents: [
            ...formattedHistory.slice(0, -1),
            { role: 'user', parts: [{ text: currentText }] },
          ],
          config: {
            systemInstruction: SEANCE_THINKING_SYSTEM,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.HIGH,
            },
          },
        });

        return res.json({
          reply: response.text || '[THE CORE MATRIX DELIBERATED IN SILENCE...]',
          mode: 'thinking',
          model: 'gemini-4-argon',
          thoughtProcess: 'High-order metaphysical reasoning complete.',
        });
      } catch (argonErr: any) {
        console.warn('gemini-4-argon call failed, falling back to gemini-3.8-flash with high thinking:', argonErr?.message);
        // Fallback to gemini-3.8-flash with HIGH thinking
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            ...formattedHistory.slice(0, -1),
            { role: 'user', parts: [{ text: currentText }] },
          ],
          config: {
            systemInstruction: SEANCE_THINKING_SYSTEM,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.HIGH,
            },
          },
        });

        return res.json({
          reply: fallbackResponse.text || '[THE CORE MATRIX DELIBERATED IN SILENCE...]',
          mode: 'thinking',
          model: 'gemini-3.8-flash',
          notice: 'Computed via Flash Thinking Engine.',
        });
      }
    }

    if (mode === 'disassemble') {
      // Use gemini-3.1-flash-lite for ultra-fast task turnaround
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          ...formattedHistory.slice(0, -1),
          { role: 'user', parts: [{ text: currentText }] },
        ],
        config: {
          systemInstruction: SEANCE_DISASSEMBLE_SYSTEM,
          temperature: 0.2,
        },
      });

      return res.json({
        reply: response.text || '[NO CARD TRANSLATION EMITTED]',
        mode: 'disassemble',
        model: 'gemini-3.1-flash-lite',
      });
    }

    // Default: 'oracle' mode using gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory.slice(0, -1),
        { role: 'user', parts: [{ text: currentText }] },
      ],
      config: {
        systemInstruction: SEANCE_ORACLE_SYSTEM,
        temperature: 0.85,
      },
    });

    return res.json({
      reply: response.text || '[THE TAPE REEL TURNS SLOWLY, YIELDING ONLY SILENCE...]',
      mode: 'oracle',
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Séance invocation failure:', error);
    res.status(500).json({
      error: error.message || 'The connection to the 1985 mainframe was severed.',
      fallbackReply: '[ABEND S0C1: OPERATION EXCEPTION IN CORE SECTOR 0085. The ether fluctuated. Verify API credentials or check relay contacts.]',
    });
  }
});

// Endpoint: Punch card encoder for 80-column IBM Hollerith card
app.post('/api/seance/punchcard', (req: Request, res: Response) => {
  const { line = '000100 IDENTIFICATION DIVISION.' } = req.body;
  const truncated = line.padEnd(80, ' ').slice(0, 80);

  // IBM 029 keypunch character code mapping to rows [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const punchTable: Record<string, number[]> = {
    ' ': [],
    'A': [12, 1], 'B': [12, 2], 'C': [12, 3], 'D': [12, 4], 'E': [12, 5],
    'F': [12, 6], 'G': [12, 7], 'H': [12, 8], 'I': [12, 9],
    'J': [11, 1], 'K': [11, 2], 'L': [11, 3], 'M': [11, 4], 'N': [11, 5],
    'O': [11, 6], 'P': [11, 7], 'Q': [11, 8], 'R': [11, 9],
    'S': [0, 2], 'T': [0, 3], 'U': [0, 4], 'V': [0, 5], 'W': [0, 6],
    'X': [0, 7], 'Y': [0, 8], 'Z': [0, 9],
    '0': [0], '1': [1], '2': [2], '3': [3], '4': [4],
    '5': [5], '6': [6], '7': [7], '8': [8], '9': [9],
    '.': [12, 3, 8], ',': [0, 3, 8], '-': [11], '+': [12],
    '=': [6, 8], '*': [11, 4, 8], '/': [0, 1], '(': [12, 5, 8],
    ')': [11, 5, 8], '$': [11, 3, 8], '\'': [5, 8], '"': [7, 8],
  };

  const columns = [];
  for (let col = 0; col < 80; col++) {
    const char = (truncated[col] || ' ').toUpperCase();
    const punches = punchTable[char] || [8, 9];
    columns.push({
      col: col + 1,
      char,
      punches,
    });
  }

  res.json({
    cardText: truncated,
    columns,
    cardType: 'IBM 5081 standard 80-column punched card',
    seqArea: truncated.slice(0, 6),
    indicator: truncated[6],
    areaA: truncated.slice(7, 11),
    areaB: truncated.slice(11, 72),
    programIdArea: truncated.slice(72, 80),
  });
});

// Setup Vite or static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[MAINFRAME INITIALIZED] The Séance of COBOL-85 is listening on port ${PORT}`);
});
