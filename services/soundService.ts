
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmEnabled: boolean = true;
  private bgmInterval: number | null = null;
  private currentStep: number = 0;

  // Simple retro melody: C4, E4, G4, B3, A3, C4, D4, G3
  private melody = [261.63, 329.63, 392.00, 246.94, 220.00, 261.63, 293.66, 196.00];

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

  private startBGM() {
    if (this.bgmInterval) return;
    this.initContext();
    
    // Low pass filter for BGM to keep it subtle
    this.bgmInterval = window.setInterval(() => {
      if (!this.enabled || !this.bgmEnabled || !this.ctx) return;
      
      const freq = this.melody[this.currentStep % this.melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle'; // Softer retro sound for BGM
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
      
      this.currentStep++;
    }, 500); // 120 BPM
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
    this.playTone(200, 'sawtooth', 0.4, 0.1, 50);
  }

  public playLevelComplete() {
    const notes = [523.25, 523.25, 523.25, 698.46, 783.99, 1046.50];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.2, 0.1), i * 120);
    });
  }

  public playPowerUp() {
    this.playTone(100, 'square', 0.5, 0.1, 1000);
  }

  public playSiren() {
    this.playTone(440, 'triangle', 0.5, 0.05, 880);
    setTimeout(() => this.playTone(880, 'triangle', 0.5, 0.05, 440), 500);
  }

  public playBlip() {
    this.playTone(1200, 'sine', 0.05, 0.03);
  }
}

export const soundService = new SoundService();
