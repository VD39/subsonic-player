export class TrackInstance {
  readonly audioContext: AudioContext;

  crossfadeGainNode: GainNode | null = null;

  private readonly destination: AudioNode;

  readonly element: HTMLAudioElement;

  private replayGainNode: GainNode | null = null;

  private sourceNode: MediaElementAudioSourceNode | null = null;

  constructor(
    audioContext: AudioContext,
    source: HTMLAudioElement | string,
    destination: AudioNode,
  ) {
    this.audioContext = audioContext;
    this.destination = destination;

    if (source instanceof HTMLAudioElement) {
      this.element = source;
    } else {
      this.element = new Audio();
      this.element.crossOrigin = 'anonymous';
      this.element.preload = 'auto';
      this.element.src = source;
    }
  }

  applyReplayGain(value: number) {
    if (this.replayGainNode) {
      this.replayGainNode.gain.value = value;
    }
  }

  connect(replayGainValue: number) {
    if (this.sourceNode) {
      return;
    }

    try {
      this.replayGainNode = this.audioContext.createGain();
      this.crossfadeGainNode = this.audioContext.createGain();

      this.replayGainNode.gain.value = replayGainValue;
      this.crossfadeGainNode.gain.value = 1;

      this.sourceNode = this.audioContext.createMediaElementSource(
        this.element,
      );

      this.sourceNode.connect(this.replayGainNode);
      this.replayGainNode.connect(this.crossfadeGainNode);
      this.crossfadeGainNode.connect(this.destination);
    } catch {
      this.sourceNode = null;
      this.replayGainNode = null;
      this.crossfadeGainNode = null;
    }
  }

  destroy() {
    this.element.pause();
    detachAudioSource(this.element);
    this.sourceNode?.disconnect();
    this.replayGainNode?.disconnect();
    this.crossfadeGainNode?.disconnect();
    this.sourceNode = null;
    this.replayGainNode = null;
    this.crossfadeGainNode = null;
  }
}
