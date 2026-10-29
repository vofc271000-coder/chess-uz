// Web Audio API Sound Synthesizer for GrandMaster Chess
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.5;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playMove() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  playCapture() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.09);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.12);
      osc2.stop(now + 0.12);
    } catch {}
  }

  playCastle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // First piece tap
      this.playTap(now, 480, 160, 0.06);
      // Second piece tap quickly after
      this.playTap(now + 0.08, 420, 140, 0.07);
    } catch {}
  }

  playTap(time, startFreq, endFreq, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(0.2 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  playCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.07); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now); // D6
      osc2.frequency.setValueAtTime(1760, now + 0.07); // A6

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {}
  }

  playPromote() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const time = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.22 * this.volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.22);
      });
    } catch {}
  }

  playLowTime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  playGameOver(isWin = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (isWin) {
        // Triumphant fanfare
        const chords = [523.25, 659.25, 783.99, 1046.5]; // C major
        chords.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.09;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.25 * this.volume, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.4);
        });
      } else {
        // Defeat melancholic chord
        const chords = [392.0, 311.13, 261.63]; // G4, Eb4, C4
        chords.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.15;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.22 * this.volume, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.5);
        });
      }
    } catch {}
  }

  playNotify() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.playTap(now, 659.25, 659.25, 0.08); // E5
      this.playTap(now + 0.1, 880, 880, 0.12); // A5
    } catch {}
  }

  playInvalid() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }
}

export const soundManager = new SoundFX();
