export type PhosphorTheme = 'green' | 'amber' | 'cyan' | 'red';

export type RitualMode = 'oracle' | 'search' | 'thinking' | 'disassemble';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: RitualMode;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      };
    }>;
  };
  modelName?: string;
}

export interface PunchCardData {
  cardText: string;
  columns: Array<{
    col: number;
    char: string;
    punches: number[];
  }>;
  seqArea: string;
  indicator: string;
  areaA: string;
  areaB: string;
  programIdArea: string;
}
