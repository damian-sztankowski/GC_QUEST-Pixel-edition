
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

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

  public playClick() {
    this.playTone(800, 'square', 0.1, 0.05);
  }

  public playCorrect() {
    const now = this.ctx?.currentTime || 0;
    // Ascending arpeggio
    this.playTone(523.25, 'square', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.3, 0.1), 200); // G5
  }

  public playIncorrect() {
    // Descending buzz
    this.playTone(200, 'sawtooth', 0.4, 0.1, 50);
  }

  public playLevelComplete() {
    // Victory Fanfare
    const notes = [523.25, 523.25, 523.25, 698.46]; // C5 C5 C5 F5
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.2, 0.1), i * 150);
    });
  }

  public playPowerUp() {
    this.playTone(100, 'square', 0.5, 0.1, 1000);
  }
}

export const soundService = new SoundService();
