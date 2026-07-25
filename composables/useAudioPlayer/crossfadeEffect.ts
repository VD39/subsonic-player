export class CrossfadeEffect {
  private readonly context: AudioContext;

  constructor(context: AudioContext) {
    this.context = context;
  }

  fade(gainNode: GainNode, targetValue: number, duration: number) {
    const startTime = this.context.currentTime;

    gainNode.gain.setValueAtTime(gainNode.gain.value, startTime);
    gainNode.gain.linearRampToValueAtTime(targetValue, startTime + duration);
  }
}
