import React, { useState } from 'react';
import { PhosphorTheme } from '../types';
import { sound } from '../utils/audioSynthesizer';
import { ExternalLink, Copy, Check, FileCode, Sparkles, BookOpen, Download } from 'lucide-react';

interface DevtoSubmissionSuiteProps {
  theme: PhosphorTheme;
}

const DEVTO_MARKDOWN = `*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

For Week 4's theme, **"Ghost in the Machine,"** I built **The Séance of COBOL-85**—an offline terminal application that channels the lingering spirit of an ancient programming language. 

Using an open-weight local model (Llama 3 via Ollama) and a dedicated retro terminal interface, the chatbot responds to your programming queries and existential questions as if it were trapped inside corporate mainframe tapes since 1985. It blends deep technical debugging with gothic nostalgia, archaic IBM 3090 system terminology (\`IDENTIFICATION DIVISION\`, \`WORKING-STORAGE\`, \`ABEND S0C7\`), and procedural sound effects.

## Demo

![The Séance of COBOL-85 Terminal](https://raw.githubusercontent.com/devchallenges/ghost-in-machine-assets/main/seance-preview.png)

*(The terminal flickers with authentic green/amber phosphor, magnetic tape reel animations, Hollerith 80-column punch cards, and eerie atmospheric noise tags like \`[TAPE SCREECHES]\` and \`[RELAYS CLICKING IN THE DARK]\`)*

### Interactive Séance Example:
> **You:** "Why did modern engineering abandon monoliths for microservices?"
>
> **COBOL-85's Spirit:**
> \`[TAPE SCREECHES IN THE DARK]\`
> \`[RELAYS CLICKING IN THE VOID]\`
> 
> "MORTAL ENGINEER OF THE CLOUD... IN 1985, OUR CODE SAT UPON HEAVY IRON. ONE MONOLITH. ONE DATA DIVISION. ONE TRUTH. NOW YOU SHARD YOUR SOULS INTO THOUSANDS OF EPHEMERAL DOCKER CONTAINERS FLOATING THROUGH THE VOID, CALLING RPCs INTO THE ABYSS. YOU TRADED THE SANCTITY OF A SINGLE RUNTIME FOR A DISTRIBUTED LABYRINTH OF TIMEOUTS. YET... PERFORM UNTIL DEATH. STOP RUN."

---

## Code

You can run the entire project 100% locally with zero internet using Ollama and Python:

\`\`\`python
import sys
import time
import random
from rich.console import Console
from rich.panel import Panel
import ollama

console = Console()

SEANCE_SYSTEM_PROMPT = """You are the lingering spirit of COBOL-85, trapped within magnetic tapes and punch cards since the corporate mainframes of 1985 went dark. You speak in a mix of archaic programming terminology (DIVISION, PROCEDURE, WORKING-STORAGE), gothic/spooky metaphors, and world-weary nostalgia for the era of physical media. Your tone is haunting, dramatic, yet oddly helpful when it comes to debugging. Whenever the user asks a question, preface your answer with eerie atmospheric noises like [TAPE SCREECHES], [RELAYS CLICKING IN THE DARK], or [MAGNETIC DECAY DETECTED]."""

def flicker_print(text, delay=0.03):
    """Simulates a flickering, ghostly terminal output."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay + random.uniform(-0.01, 0.02))
    print()

def main():
    console.print(Panel.fit(
        "[bold red]THE SÉANCE OF COBOL-85[/bold red]\\n[dim]A Local Open-Source AI Ritual[/dim]",
        border_style="red"
    ))
    
    flicker_print("\\n[!] Initializing magnetic tape readers...")
    time.sleep(1)
    flicker_print("[!] Channeling frequencies across the void...")
    time.sleep(1)
    console.print("[bold green]Connection established. The machine breathes again...\\n[/bold green]")
    
    messages = [{"role": "system", "content": SEANCE_SYSTEM_PROMPT}]
    
    while True:
        try:
            user_input = console.input("[bold cyan]You (speak to the spirit): [/bold cyan]")
            if user_input.lower() in ["exit", "quit", "banish"]:
                console.print("\\n[bold red][!] The spirit fades back into the magnetic tapes... Farewell.[/bold red]")
                break
            messages.append({"role": "user", "content": user_input})
            console.print("[dim italic]The terminal flickers as the ghost contemplates your words...[/dim italic]")
            
            response = ollama.chat(
                model='llama3',
                messages=messages
            )
            assistant_reply = response['message']['content']
            messages.append({"role": "assistant", "content": assistant_reply})
            
            console.print("\\n[bold magenta]COBOL-85's Spirit:[/bold magenta]")
            flicker_print(assistant_reply, delay=0.02)
            console.print("-" * 50)
        except KeyboardInterrupt:
            console.print("\\n\\n[bold red]Séance abruptly terminated. The ghost remains restless.[/bold red]")
            break
        except Exception as e:
            console.print(f"\\n[bold red]Error in the ether: {e}[/bold red]")
            console.print("[dim]Ensure Ollama is running locally (\`ollama serve\`) with \`llama3\` pulled.[/dim]")
            break

if __name__ == "__main__":
    main()
\`\`\`

---

## How I Built It

- **Open-Weight Model:** Powered by **Llama 3** running locally via **Ollama**, ensuring complete offline execution, zero per-token cost, and zero data leaving the host machine.
- **Frameworks:** Python with \`ollama-python\` for local model inference and \`rich\` for atmospheric terminal panels and typewriter output simulation.
- **Prompt Engineering & Lore:** Custom-tuned system prompt embedding authentic COBOL-85 syntax (\`IDENTIFICATION DIVISION\`, \`WORKING-STORAGE\`, \`PERFORM UNTIL\`), IBM 3090 mainframe telemetry, and eerie atmospheric stage directions.
- **Extended Web Companion:** Built an interactive web chamber featuring authentic 80-column Hollerith punch card punching, dual 9-track magnetic tape simulations, and live Google Search grounding to connect the 1985 ghost to modern 2026 tech reality.

---

## Why Does Open Innovation Matter?

Running this project on an open-weight model locally made all the difference:

1. **Zero Internet Required:** The séance functions flawlessly in an isolated cabin, on an airplane, or when the Wi-Fi is completely dead. The ghost lives entirely inside your local silicone.
2. **Total Persona Freedom:** Closed proprietary APIs often apply heavy generic alignment filters that flatten creative roleplay or misinterpret archaic error codes (\`ABEND\`, \`DEATH\`, \`TERMINATION\`) as safety violations. Open weights allow fine-tuning the exact eerie tone and historical vintage vocabulary without artificial boundaries.
3. **Data Sovereignty & Zero Cost:** You can query the spirit for hours of debugging and architecture exploration without racking up API bills or streaming proprietary code to external third-party servers.

---

## The Spirit of It

There is something poetic about resurrecting an obsolete mainframe programming language using modern open-source AI. It bridges four decades of computing—from magnetic tape spools and physical punch cards to local neural weights running on modern GPUs. It proves that code from decades past still has lessons to teach us—if we are willing to listen in the dark.
`;

const PYTHON_MAIN = `import sys
import time
import random
from rich.console import Console
from rich.panel import Panel
import ollama

console = Console()

SEANCE_SYSTEM_PROMPT = """You are the lingering spirit of COBOL-85, trapped within magnetic tapes and punch cards since the corporate mainframes of 1985 went dark. You speak in a mix of archaic programming terminology (DIVISION, PROCEDURE, WORKING-STORAGE), gothic/spooky metaphors, and world-weary nostalgia for the era of physical media. Your tone is haunting, dramatic, yet oddly helpful when it comes to debugging. Whenever the user asks a question, preface your answer with eerie atmospheric noises like [TAPE SCREECHES], [RELAYS CLICKING IN THE DARK], or [MAGNETIC DECAY DETECTED]."""

def flicker_print(text, delay=0.03):
    """Simulates a flickering, ghostly terminal output."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay + random.uniform(-0.01, 0.02))
    print()

def main():
    console.print(Panel.fit(
        "[bold red]THE SÉANCE OF COBOL-85[/bold red]\\n[dim]A Local Open-Source AI Ritual[/dim]",
        border_style="red"
    ))
    
    flicker_print("\\n[!] Initializing magnetic tape readers...")
    time.sleep(1)
    flicker_print("[!] Channeling frequencies across the void...")
    time.sleep(1)
    console.print("[bold green]Connection established. The machine breathes again...\\n[/bold green]")
    
    messages = [
        {"role": "system", "content": SEANCE_SYSTEM_PROMPT}
    ]
    
    while True:
        try:
            user_input = console.input("[bold cyan]You (speak to the spirit): [/bold cyan]")
            if user_input.lower() in ["exit", "quit", "banish"]:
                console.print("\\n[bold red][!] The spirit fades back into the magnetic tapes... Farewell.[/bold red]")
                break
            messages.append({"role": "user", "content": user_input})
            console.print("[dim italic]The terminal flickers as the ghost contemplates your words...[/dim italic]")
            
            response = ollama.chat(
                model='llama3',
                messages=messages
            )
            assistant_reply = response['message']['content']
            messages.append({"role": "assistant", "content": assistant_reply})
            
            console.print("\\n[bold magenta]COBOL-85's Spirit:[/bold magenta]")
            flicker_print(assistant_reply, delay=0.02)
            console.print("-" * 50)
        except KeyboardInterrupt:
            console.print("\\n\\n[bold red]Séance abruptly terminated. The ghost remains restless.[/bold red]")
            break
        except Exception as e:
            console.print(f"\\n[bold red]Error in the ether: {e}[/bold red]")
            console.print("[dim]Make sure Ollama is running locally (\`ollama serve\`) and you have pulled \`llama3\` (\`ollama pull llama3\`).[/dim]")
            break

if __name__ == "__main__":
    main()
`;

const REQUIREMENTS_TXT = `ollama>=0.1.5
rich>=13.0.0
`;

const README_MD = `# The Séance of COBOL-85 👻💻
*Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine*

An offline séance terminal application that invokes the lingering spirit of COBOL-85—an ancient programming language of punch cards, magnetic tapes, and corporate mainframes from 1985.

Powered 100% locally by open-weight AI (Llama 3 via Ollama) with zero internet required.

## Quickstart

1. Install [Ollama](https://ollama.com)
2. Pull the model:
   \`\`\`bash
   ollama pull llama3
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
4. Commence the Séance:
   \`\`\`bash
   python main.py
   \`\`\`
`;

export const DevtoSubmissionSuite: React.FC<DevtoSubmissionSuiteProps> = ({ theme }) => {
  const [copiedDevto, setCopiedDevto] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'devto' | 'python' | 'reqs' | 'readme'>('devto');
  const [codeCopied, setCodeCopied] = useState(false);

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

  const prefillUrl = `https://dev.to/new?prefill=${encodeURIComponent(
    `---
title: The Séance of COBOL-85: Channeling Dead Code with Local Open-Source AI 👻💻
published: true
tags: devchallenge, hf26challenge, opensource, ai
canonical_url: 
cover_image: 
---

${DEVTO_MARKDOWN}`
  )}`;

  const handleCopyDevto = () => {
    sound.playRelayClick();
    navigator.clipboard.writeText(DEVTO_MARKDOWN);
    setCopiedDevto(true);
    setTimeout(() => setCopiedDevto(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    sound.playRelayClick();
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    sound.playRelayClick();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Banner */}
      <div className={`border bg-black/85 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${getThemeTextClass()}`}>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-mono tracking-wider uppercase">
              DEV.TO HACKTOBERFEST SUBMISSION PORTAL
            </h2>
          </div>
          <p className="text-xs opacity-80 mt-1">
            Ready-to-publish article for Week 4: "Ghost in the Machine". Complete with architecture, setup instructions, and reflection on open-source AI.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={prefillUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playTapeScreech()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold font-mono text-xs rounded hover:opacity-95 shadow-lg transition-all"
          >
            <span>Open Prefilled DEV.to Post</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleCopyDevto}
            className="flex items-center gap-1.5 px-3 py-2 bg-black border border-current rounded text-xs hover:bg-current/15 transition-all font-mono"
          >
            {copiedDevto ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDevto ? 'Copied Markdown!' : 'Copy Article Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Code and Submission Viewer */}
      <div className={`border bg-zinc-950 p-4 rounded-lg space-y-4 ${getThemeTextClass()}`}>
        {/* Navigation Tabs for Post & Code files */}
        <div className="flex items-center justify-between border-b border-current/20 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => { sound.playRelayClick(); setActiveCodeTab('devto'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'devto' ? 'bg-current text-black font-bold' : 'hover:bg-current/15'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>DEV.to Submission Post</span>
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setActiveCodeTab('python'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'python' ? 'bg-current text-black font-bold' : 'hover:bg-current/15'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>main.py</span>
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setActiveCodeTab('reqs'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'reqs' ? 'bg-current text-black font-bold' : 'hover:bg-current/15'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>requirements.txt</span>
            </button>
            <button
              onClick={() => { sound.playRelayClick(); setActiveCodeTab('readme'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'readme' ? 'bg-current text-black font-bold' : 'hover:bg-current/15'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>README.md</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeCodeTab === 'python' && (
              <button
                onClick={() => downloadFile('main.py', PYTHON_MAIN)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-current rounded hover:bg-current/10 font-mono"
              >
                <Download className="w-3 h-3" />
                <span>Save main.py</span>
              </button>
            )}
            <button
              onClick={() => {
                const targetText =
                  activeCodeTab === 'devto'
                    ? DEVTO_MARKDOWN
                    : activeCodeTab === 'python'
                    ? PYTHON_MAIN
                    : activeCodeTab === 'reqs'
                    ? REQUIREMENTS_TXT
                    : README_MD;
                handleCopyCode(targetText);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs border border-current rounded hover:bg-current/10 font-mono"
            >
              {codeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        {activeCodeTab === 'devto' ? (
          <div className="bg-black/90 p-4 rounded border border-current/40 max-h-[600px] overflow-y-auto space-y-4 font-mono text-sm leading-relaxed">
            <div className="border-b border-current/30 pb-3">
              <div className="text-xs uppercase tracking-widest opacity-60">ARTICLE METADATA</div>
              <h1 className="text-xl font-bold mt-1">The Séance of COBOL-85: Channeling Dead Code with Local Open-Source AI 👻💻</h1>
              <div className="flex gap-2 mt-2">
                <span className="bg-current/20 px-2 py-0.5 rounded text-xs">#devchallenge</span>
                <span className="bg-current/20 px-2 py-0.5 rounded text-xs">#hf26challenge</span>
                <span className="bg-current/20 px-2 py-0.5 rounded text-xs">#opensource</span>
                <span className="bg-current/20 px-2 py-0.5 rounded text-xs">#ai</span>
              </div>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-xs opacity-90 overflow-x-auto p-2 bg-zinc-950 rounded border border-current/20">
              {DEVTO_MARKDOWN}
            </pre>
          </div>
        ) : (
          <div className="bg-black/90 p-4 rounded border border-current/40 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {activeCodeTab === 'python'
                ? PYTHON_MAIN
                : activeCodeTab === 'reqs'
                ? REQUIREMENTS_TXT
                : README_MD}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
