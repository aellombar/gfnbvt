/**
 * Drives the session's felt rhythm.
 *
 * The pulse is deliberately a warm, filtered heartbeat rather than a metronome
 * tick: a low sine thump, a breath-like noise texture, and a per-character
 * accent tone. Beat timing comes from the AudioContext clock so the on-screen
 * hand and the audio can never drift apart.
 */

export interface PaceVolumes {
  pulse: number;
  ambient: number;
}

const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;

export class PaceEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private pulseBus: GainNode | null = null;
  private ambientBus: GainNode | null = null;
  private ambientVoices: OscillatorNode[] = [];

  private timer: ReturnType<typeof setInterval> | null = null;
  private nextBeatTime = 0;
  private lastBeatTime = 0;
  private beatDuration = 1;

  private bpmFrom = 60;
  private bpmTo = 60;
  private rampStart = 0;
  private rampEnd = 0;

  private accentHz = 220;
  private volumes: PaceVolumes = { pulse: 0.8, ambient: 0.4 };
  private running = false;

  /** Must be called from a user gesture so the browser lets audio play. */
  async init(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(ctx.destination);

    this.pulseBus = ctx.createGain();
    this.pulseBus.gain.value = this.volumes.pulse;
    this.pulseBus.connect(this.master);

    this.ambientBus = ctx.createGain();
    this.ambientBus.gain.value = 0;
    this.ambientBus.connect(this.master);

    if (ctx.state === "suspended") await ctx.resume();
  }

  setAccent(hz: number): void {
    this.accentHz = hz;
  }

  setVolumes(volumes: Partial<PaceVolumes>): void {
    this.volumes = { ...this.volumes, ...volumes };
    if (this.pulseBus) this.pulseBus.gain.value = this.volumes.pulse;
    if (this.ambientBus && this.running) {
      this.ambientBus.gain.value = this.volumes.ambient * 0.25;
    }
  }

  /** Ease toward a new tempo. Never jump — that breaks the trance. */
  setBpm(target: number, rampMs = 2500): void {
    if (!this.ctx) {
      this.bpmFrom = target;
      this.bpmTo = target;
      return;
    }
    const now = this.ctx.currentTime;
    this.bpmFrom = this.currentBpm();
    this.bpmTo = Math.max(20, target);
    this.rampStart = now;
    this.rampEnd = now + Math.max(0, rampMs) / 1000;
  }

  currentBpm(): number {
    if (!this.ctx) return this.bpmTo;
    const now = this.ctx.currentTime;
    if (now >= this.rampEnd || this.rampEnd <= this.rampStart) return this.bpmTo;
    const t = (now - this.rampStart) / (this.rampEnd - this.rampStart);
    return this.bpmFrom + (this.bpmTo - this.bpmFrom) * t;
  }

  start(): void {
    if (!this.ctx || this.running) return;
    this.running = true;
    this.nextBeatTime = this.ctx.currentTime + 0.08;
    this.lastBeatTime = this.nextBeatTime;
    this.startAmbient();
    this.timer = setInterval(() => this.schedule(), TICK_MS);
  }

  stop(): void {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.stopAmbient();
  }

  async dispose(): Promise<void> {
    this.stop();
    if (this.ctx) {
      await this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
  }

  /**
   * Continuous 0..1 position inside the current beat. Visual systems read this
   * every frame, which is what keeps her hand locked to the audio.
   */
  beatPhase(): number {
    if (!this.ctx || !this.running) return 0;
    const elapsed = this.ctx.currentTime - this.lastBeatTime;
    if (this.beatDuration <= 0) return 0;
    return Math.min(1, Math.max(0, elapsed / this.beatDuration));
  }

  /** One full stroke down and back per beat, eased at both ends. */
  strokePosition(): number {
    return (1 - Math.cos(this.beatPhase() * Math.PI * 2)) / 2;
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;

    while (this.nextBeatTime < ctx.currentTime + LOOKAHEAD_S) {
      const bpm = this.currentBpm();
      this.beatDuration = 60 / bpm;
      this.playPulse(this.nextBeatTime, bpm);
      this.lastBeatTime = this.nextBeatTime;
      this.nextBeatTime += this.beatDuration;
    }
  }

  private playPulse(at: number, bpm: number): void {
    const ctx = this.ctx;
    const bus = this.pulseBus;
    if (!ctx || !bus) return;

    // Faster tempo gets a shorter, tighter thump so it never turns to mud.
    const intensity = Math.min(1, Math.max(0, (bpm - 45) / 105));
    const decay = 0.26 - intensity * 0.12;

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(74, at);
    thump.frequency.exponentialRampToValueAtTime(44, at + decay);

    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.0001, at);
    thumpGain.gain.exponentialRampToValueAtTime(0.9, at + 0.012);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

    const warm = ctx.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 220;

    thump.connect(thumpGain).connect(warm).connect(bus);
    thump.start(at);
    thump.stop(at + decay + 0.05);

    // Breath / satin texture so it reads organic rather than clinical.
    const texture = ctx.createBufferSource();
    texture.buffer = this.noiseBuffer(ctx);
    const textureFilter = ctx.createBiquadFilter();
    textureFilter.type = "bandpass";
    textureFilter.frequency.value = 620 + intensity * 500;
    textureFilter.Q.value = 0.8;
    const textureGain = ctx.createGain();
    textureGain.gain.setValueAtTime(0.0001, at);
    textureGain.gain.exponentialRampToValueAtTime(
      0.05 + intensity * 0.05,
      at + 0.02,
    );
    textureGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    texture.connect(textureFilter).connect(textureGain).connect(bus);
    texture.start(at);
    texture.stop(at + 0.2);

    // Her signature accent tone.
    const accent = ctx.createOscillator();
    accent.type = "triangle";
    accent.frequency.value = this.accentHz;
    const accentGain = ctx.createGain();
    accentGain.gain.setValueAtTime(0.0001, at);
    accentGain.gain.exponentialRampToValueAtTime(0.035, at + 0.03);
    accentGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
    accent.connect(accentGain).connect(bus);
    accent.start(at);
    accent.stop(at + 0.36);
  }

  private cachedNoise: AudioBuffer | null = null;

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.cachedNoise) return this.cachedNoise;
    const length = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      // Soft-shaped noise reads closer to breath than raw white noise.
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 1.5;
    }
    this.cachedNoise = buffer;
    return buffer;
  }

  private startAmbient(): void {
    const ctx = this.ctx;
    const bus = this.ambientBus;
    if (!ctx || !bus || this.ambientVoices.length) return;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.connect(bus);

    [1, 1.005, 1.5].forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 2 ? "triangle" : "sine";
      osc.frequency.value = (this.accentHz / 4) * ratio;
      const gain = ctx.createGain();
      gain.gain.value = index === 2 ? 0.06 : 0.12;
      osc.connect(gain).connect(filter);
      osc.start();
      this.ambientVoices.push(osc);
    });

    bus.gain.setTargetAtTime(this.volumes.ambient * 0.25, ctx.currentTime, 1.2);
  }

  private stopAmbient(): void {
    this.ambientVoices.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Already stopped.
      }
    });
    this.ambientVoices = [];
    if (this.ambientBus && this.ctx) this.ambientBus.gain.value = 0;
  }
}
