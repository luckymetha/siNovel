import type { BGMTrack } from '../types';

class BGMAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private synthNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    noiseNode?: AudioBufferSourceNode;
    masterGain: GainNode;
  } | null = null;
  private currentTrack: BGMTrack | null = null;
  private volume: number = 0.35;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private usingSynthFallback: boolean = false;
  private fadeInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.volume = this.volume;

      // Handle audio errors gracefully by falling back to generative synth
      this.audioElement.addEventListener('error', () => {
        if (this.isPlaying && this.currentTrack) {
          console.warn('Audio streaming source unavailable, switching to real-time generative soundscape synthesizer');
          this.playSynthFallback(this.currentTrack);
        }
      });
    }
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async playTrack(track: BGMTrack, targetVolume: number = this.volume) {
    this.currentTrack = track;
    this.isPlaying = true;
    this.volume = targetVolume;
    this.stopSynth();

    if (this.audioElement && track.audioUrl) {
      try {
        this.audioElement.src = track.audioUrl;
        this.audioElement.volume = 0; // start at 0 for fade-in
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.fadeIn(targetVolume);
          this.usingSynthFallback = false;
          return;
        }
      } catch (err) {
        console.warn('Direct audio play failed, using ambient synth mode:', err);
      }
    }

    // Fallback to generative ambient synthesis
    this.playSynthFallback(track);
  }

  public pause(autoFade: boolean = true) {
    if (!this.isPlaying) return;

    if (autoFade) {
      this.fadeOut(() => {
        this.isPlaying = false;
        if (this.audioElement) {
          this.audioElement.pause();
        }
        this.stopSynth();
      });
    } else {
      this.isPlaying = false;
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.stopSynth();
    }
  }

  public resume() {
    if (this.currentTrack) {
      this.playTrack(this.currentTrack, this.volume);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    const effectiveVol = this.isMuted ? 0 : this.volume;

    if (this.audioElement && !this.usingSynthFallback) {
      this.audioElement.volume = effectiveVol;
    }
    if (this.synthNodes) {
      this.synthNodes.masterGain.gain.setValueAtTime(
        effectiveVol * 0.4,
        this.audioCtx ? this.audioCtx.currentTime : 0
      );
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): BGMTrack | null {
    return this.currentTrack;
  }

  // Smooth fade-in
  private fadeIn(targetVolume: number) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 15;
    const stepDuration = 30; // ms
    let currentStep = 0;
    const effectiveTarget = this.isMuted ? 0 : targetVolume;

    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      const currentVol = (currentStep / steps) * effectiveTarget;
      if (this.audioElement && !this.usingSynthFallback) {
        this.audioElement.volume = Math.min(1, Math.max(0, currentVol));
      }
      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, stepDuration);
  }

  // Smooth fade-out
  private fadeOut(callback: () => void) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 15;
    const stepDuration = 25; // ms
    const startingVol = this.audioElement ? this.audioElement.volume : this.volume;
    let currentStep = 0;

    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      const currentVol = startingVol * (1 - currentStep / steps);
      if (this.audioElement && !this.usingSynthFallback) {
        this.audioElement.volume = Math.max(0, currentVol);
      }
      if (this.synthNodes && this.audioCtx) {
        this.synthNodes.masterGain.gain.setValueAtTime(
          Math.max(0, currentVol * 0.4),
          this.audioCtx.currentTime
        );
      }
      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        callback();
      }
    }, stepDuration);
  }

  // Generative Ambient Synth Soundscape Fallback
  private playSynthFallback(track: BGMTrack) {
    this.initAudioContext();
    if (!this.audioCtx) return;
    this.usingSynthFallback = true;
    this.stopSynth();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const effectiveVol = this.isMuted ? 0 : this.volume * 0.4;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(effectiveVol, now + 1.5);
    masterGain.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Ambient chords based on track genre
    let baseFrequencies = [220, 261.63, 329.63, 392]; // A minor 7 (Relaxed / Chill)

    if (track.genre === 'epic') {
      baseFrequencies = [130.81, 196.0, 261.63, 392.0]; // C Major majestic
    } else if (track.genre === 'sad') {
      baseFrequencies = [174.61, 220.0, 261.63, 329.63]; // Fmaj7 melancholy
    } else if (track.genre === 'mystery') {
      baseFrequencies = [110.0, 155.56, 220.0, 293.66]; // D-sharp diminished / dark
    }

    // Create warm soothing oscillators with gentle LFO modulation
    baseFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle detuning for lush stereo pad effect
      osc.detune.setValueAtTime((idx - 1.5) * 8, now);

      noteGain.gain.setValueAtTime(0.12, now);
      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start(now);

      oscillators.push(osc);
      gains.push(noteGain);
    });

    // Add soft rain / ocean pink noise for focus & chill
    let noiseNode: AudioBufferSourceNode | undefined = undefined;
    if (track.genre === 'focus' || track.synthPreset === 'lofi-rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
      noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseNode.start(now);
    }

    this.synthNodes = {
      oscillators,
      gains,
      noiseNode,
      masterGain
    };
  }

  private stopSynth() {
    if (this.synthNodes) {
      try {
        this.synthNodes.oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
        });
        if (this.synthNodes.noiseNode) {
          try { this.synthNodes.noiseNode.stop(); this.synthNodes.noiseNode.disconnect(); } catch { /* ignore */ }
        }
        this.synthNodes.masterGain.disconnect();
      } catch {
        // ignore
      }
      this.synthNodes = null;
    }
  }

  public cleanup() {
    this.pause(false);
    if (this.audioElement) {
      this.audioElement.src = '';
    }
  }
}

export const bgmAudioEngine = new BGMAudioEngine();
