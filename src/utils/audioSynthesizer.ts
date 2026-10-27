/**
 * Procedural Web Audio API sound synthesizer for 1980s mainframe relay clicks,
 * magnetic tape whir, card punches, and eerie vacuum tube hums.
 * Zero external audio files required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopHum();
    } else {
      this.startHum();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Mechanical solenoid punch sound for Hollerith punch cards
  public playCardPunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Sharp metal click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.04);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);

    // Mechanical thud
    const oscLow = this.ctx.createOscillator();
    const gainLow = this.ctx.createGain();
    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(120, t);
    oscLow.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    gainLow.gain.setValueAtTime(0.25, t);
    gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    oscLow.connect(gainLow);
    gainLow.connect(this.ctx.destination);
    oscLow.start(t);
    oscLow.stop(t + 0.09);
  }

  // Mechanical relay click
  public playRelayClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.015);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Typewriter key clatter
  public playKeypress() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500 + Math.random() * 300, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.025);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  // Magnetic tape screech / rewind sound
  public playTapeScreech() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(950, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.55);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.62);
  }

  // Eerie ghost theremin wave when séance awakens
  public playGhostWhisper() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(440, t + 0.3);
    osc.frequency.linearRampToValueAtTime(290, t + 0.7);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  // Low frequency background CRT & transformer hum (60Hz)
  public startHum() {
    if (this.isMuted || this.humOsc) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(60, t); // 60Hz mains hum

      this.humGain.gain.setValueAtTime(0.001, t);
      this.humGain.gain.linearRampToValueAtTime(0.035, t + 1.5);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      this.humOsc.start(t);
    } catch {
      // Audio context might be blocked until user gesture
    }
  }

  public stopHum() {
    if (this.humOsc && this.humGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.humGain.gain.linearRampToValueAtTime(0.001, t + 0.3);
        setTimeout(() => {
          this.humOsc?.stop();
          this.humOsc?.disconnect();
          this.humOsc = null;
          this.humGain = null;
        }, 350);
      } catch {
        this.humOsc = null;
        this.humGain = null;
      }
    }
  }
}

export const sound = new SoundEngine();
