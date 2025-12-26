
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmEnabled: boolean = true;
  private bgmInterval: number | null = null;
  private currentStep: number = 0;

  // Retro chords and melodies
  private melody = [261.63, 329.63, 392.00, 246.94, 220.00, 261.63, 293.66, 196.00];
  private bassline = [65.41, 65.41, 82.41, 98.00, 55.00, 55.00, 65.41, 49.00];

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) this.initContext();
    if (!enabled) this.stopBGM();
    else if (this.bgmEnabled) this.startBGM();
  }

  public setBGMEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (enabled && this.enabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, slideTo?: number) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.05) {
    if (!this.enabled || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  private startBGM() {
    if (this.bgmInterval) return;
    this.initContext();
    
    this.bgmInterval = window.setInterval(() => {
      if (!this.enabled || !this.bgmEnabled || !this.ctx) return;
      
      const step = this.currentStep % 16;
      
      // Melody (every 2 steps)
      if (step % 2 === 0) {
        const freq = this.melody[(step / 2) % this.melody.length];
        this.playTone(freq, 'triangle', 0.4, 0.02);
      }

      // Bassline (on every beat)
      if (step % 4 === 0) {
        const bFreq = this.bassline[(step / 4) % this.bassline.length];
        this.playTone(bFreq, 'sawtooth', 0.2, 0.03);
      }

      // High Hat (every off-beat)
      if (step % 2 !== 0) {
        this.playNoise(0.05, 0.01);
      }

      // Snare (on 4 and 12)
      if (step === 4 || step === 12) {
        this.playNoise(0.1, 0.03);
      }
      
      this.currentStep++;
    }, 150); // High energy tempo
  }

  private stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public playClick() {
    this.playTone(800, 'square', 0.1, 0.05);
  }

  public playCorrect() {
    this.playTone(523.25, 'square', 0.1, 0.1); 
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.1), 100); 
    setTimeout(() => this.playTone(783.99, 'square', 0.3, 0.1), 200); 
  }

  public playIncorrect() {
    this.playTone(150, 'sawtooth', 0.5, 0.1, 40);
  }

  public playLevelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.15, 0.1), i * 100);
    });
  }

  public playPowerUp() {
    this.playTone(100, 'square', 0.5, 0.1, 1500);
  }

  public playSiren() {
    this.playTone(300, 'triangle', 0.4, 0.05, 600);
    setTimeout(() => this.playTone(600, 'triangle', 0.4, 0.05, 300), 400);
  }

  public playBlip() {
    this.playTone(1500, 'sine', 0.05, 0.05);
  }
}

export const soundService = new SoundService();
