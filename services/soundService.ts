
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmEnabled: boolean = true;
  private bgmInterval: number | null = null;
  private currentStep: number = 0;
  private currentSpeed: number = 150; // Normal tempo in ms per step (~100bpm)

  // Retro frequencies for procedural melody and bass
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

  public setBGMSpeed(isFast: boolean) {
    const newSpeed = isFast ? 100 : 150; // Accelerates to ~150bpm for tension
    if (this.currentSpeed !== newSpeed) {
      this.currentSpeed = newSpeed;
      if (this.bgmEnabled && this.enabled) {
        this.stopBGM();
        this.startBGM();
      }
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
      const isFastMode = this.currentSpeed < 150;
      
      // Melody (Triangle wave for warmth)
      if (step % 2 === 0) {
        const freq = this.melody[(step / 2) % this.melody.length] * (isFastMode ? 1.5 : 1);
        this.playTone(freq, 'triangle', isFastMode ? 0.15 : 0.3, 0.02);
      }

      // Bassline (Sawtooth wave for crunchy low-end)
      if (step % 4 === 0) {
        const bFreq = this.bassline[(step / 4) % this.bassline.length];
        this.playTone(bFreq, 'sawtooth', 0.2, 0.03);
      }

      // High Hat (Short noise burst)
      if (step % 2 !== 0) {
        this.playNoise(0.05, 0.005);
      }

      // Snare (Noise burst on backbeat)
      if (step === 4 || step === 12) {
        this.playNoise(0.1, 0.02);
      }
      
      this.currentStep++;
    }, this.currentSpeed);
  }

  private stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public playClick() {
    this.playTone(800, 'square', 0.05, 0.05);
  }

  public playCorrect() {
    // Ascending major arpeggio
    this.playTone(523.25, 'square', 0.1, 0.1); 
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.1), 80); 
    setTimeout(() => this.playTone(783.99, 'square', 0.2, 0.1), 160); 
  }

  public playIncorrect() {
    // Descending slide
    this.playTone(150, 'sawtooth', 0.4, 0.1, 40);
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

  public playSkip() {
    this.playTone(400, 'sawtooth', 0.2, 0.1, 100);
  }

  public playPing() {
    this.playTone(880, 'triangle', 1.0, 0.05, 440);
  }

  public playConnection() {
    const freq = 400 + Math.random() * 800;
    this.playTone(freq, 'square', 0.05, 0.02);
  }
}

export const soundService = new SoundService();
