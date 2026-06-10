type BgmHandle = { stop: () => void };

const BGM_VOLUME = 0.13;
const SFX_VOLUME = 0.38;

let shared: CaroAudioEngine | null = null;

export function getCaroAudio(): CaroAudioEngine {
  if (!shared) shared = new CaroAudioEngine();
  return shared;
}

export class CaroAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private bgm: GainNode | null = null;
  private bgmHandle: BgmHandle | null = null;
  private muted = false;
  private unlocked = false;

  get isMuted() {
    return this.muted;
  }

  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.bgm = this.ctx.createGain();
      this.sfx.gain.value = SFX_VOLUME;
      this.bgm.gain.value = BGM_VOLUME;
      this.sfx.connect(this.master);
      this.bgm.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    if (!this.unlocked) {
      this.unlocked = true;
      this.startBgm();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 1,
        this.ctx?.currentTime ?? 0,
        0.05
      );
    }
    if (!muted && this.unlocked && !this.bgmHandle) {
      this.startBgm();
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playClick() {
    this.playTone({
      freq: 520,
      endFreq: 680,
      type: "triangle",
      duration: 0.045,
      gain: 0.22,
    });
  }

  playPlace(player: "human" | "ai") {
    const base = player === "human" ? 280 : 220;
    this.playTone({
      freq: base,
      endFreq: base * 0.7,
      type: "sine",
      duration: 0.09,
      gain: 0.35,
    });
    this.playTone({
      freq: base * 2.2,
      endFreq: base * 1.6,
      type: "triangle",
      duration: 0.06,
      gain: 0.12,
      delay: 0.01,
    });
  }

  playDraw() {
    this.playTone({
      freq: 360,
      endFreq: 880,
      type: "sine",
      duration: 0.12,
      gain: 0.28,
    });
    this.playTone({
      freq: 520,
      endFreq: 1040,
      type: "triangle",
      duration: 0.16,
      gain: 0.18,
      delay: 0.06,
    });
  }

  playSkill() {
    this.playTone({
      freq: 180,
      endFreq: 420,
      type: "sawtooth",
      duration: 0.14,
      gain: 0.15,
    });
  }

  private playTone(opts: {
    freq: number;
    endFreq?: number;
    type: OscillatorType;
    duration: number;
    gain: number;
    delay?: number;
  }) {
    if (!this.ctx || !this.sfx || this.muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.freq, t0);
    osc.frequency.exponentialRampToValueAtTime(
      opts.endFreq ?? opts.freq,
      t0 + opts.duration
    );
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(opts.gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);
    osc.connect(g);
    g.connect(this.sfx);
    osc.start(t0);
    osc.stop(t0 + opts.duration + 0.02);
  }

  startBgm() {
    if (!this.ctx || !this.bgm || this.bgmHandle || this.muted) return;

    const ctx = this.ctx;
    const out = this.bgm;
    let stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Am → F → C → G — chill lo-fi, ~76 BPM
    const chords = [
      { root: 220.0, third: 261.63, fifth: 329.63 },
      { root: 174.61, third: 220.0, fifth: 261.63 },
      { root: 261.63, third: 329.63, fifth: 392.0 },
      { root: 196.0, third: 246.94, fifth: 293.66 },
    ];

    const melody = [440, 392, 349.23, 392, 440, 523.25, 440, 392];

    const beat = 0.78;

    const playChord = (chord: (typeof chords)[0], when: number) => {
      for (const freq of [chord.root, chord.third, chord.fifth]) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        filter.type = "lowpass";
        filter.frequency.value = 720;
        filter.Q.value = 0.6;
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(0.055, when + 0.12);
        g.gain.linearRampToValueAtTime(0.028, when + beat * 2.8);
        g.gain.exponentialRampToValueAtTime(0.0001, when + beat * 3.2);
        osc.connect(filter);
        filter.connect(g);
        g.connect(out);
        osc.start(when);
        osc.stop(when + beat * 3.3);
      }
    };

    const playMelody = (freq: number, when: number) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(0.045, when + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, when + beat * 0.85);
      osc.connect(filter);
      filter.connect(g);
      g.connect(out);
      osc.start(when);
      osc.stop(when + beat * 0.9);
    };

    const playHat = (when: number) => {
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      src.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.value = 6000;
      g.gain.setValueAtTime(0.018, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
      src.connect(filter);
      filter.connect(g);
      g.connect(out);
      src.start(when);
    };

    const loop = () => {
      if (stopped) return;
      const start = ctx.currentTime + 0.05;

      chords.forEach((chord, ci) => {
        const chordStart = start + ci * beat * 4;
        playChord(chord, chordStart);
        for (let b = 0; b < 4; b++) {
          playHat(chordStart + b * beat);
        }
        for (let m = 0; m < 2; m++) {
          const note = melody[(ci * 2 + m) % melody.length];
          playMelody(note, chordStart + beat * (1 + m * 2));
        }
      });

      const id = setTimeout(loop, chords.length * beat * 4 * 1000 - 200);
      timers.push(id);
    };

    loop();

    this.bgmHandle = {
      stop: () => {
        stopped = true;
        timers.forEach(clearTimeout);
        this.bgmHandle = null;
      },
    };
  }

  stopBgm() {
    this.bgmHandle?.stop();
  }
}
