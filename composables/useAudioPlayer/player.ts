export class AudioPlayer {
  private audioContext: AudioContext | null = null;

  private audioElement: HTMLAudioElement;

  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  private crossfadeGainNode: GainNode | null = null;

  // Pending volume, applied to volumeNode once the context exists
  // (lazy init means setVolume() can run before the nodes are created).
  private currentVolume = 1;

  private ownsContext = true;

  private replayGainNode: GainNode | null = null;

  // Pending ReplayGain multiplier, applied to replayGainNode on creation.
  private replayGainValue = 1;

  private volumeNode: GainNode | null = null;

  // Event listeners for the audio element.
  private get eventListeners() {
    return [
      {
        handler: this.handleCanPlay,
        type: 'canplay',
      },
      {
        handler: this.handleCanPlayThrough,
        type: 'canplaythrough',
      },
      {
        handler: this.handleEnded,
        type: 'ended',
      },
      {
        handler: this.handleLoadedMetadata,
        type: 'loadedmetadata',
      },
      {
        handler: this.handlePause,
        type: 'pause',
      },
      {
        handler: this.handlePlay,
        type: 'play',
      },
      {
        handler: this.handleProgress,
        type: 'progress',
      },
      {
        handler: this.handleTimeupdate,
        type: 'timeupdate',
      },
      {
        handler: this.handleWaiting,
        type: 'waiting',
      },
    ];
  }

  constructor(audioCtx?: AudioContext) {
    this.audioElement = new Audio();
    // Required for createMediaElementSource(), without a CORS
    // request the browser blocks audio from flowing through the
    // Web Audio graph and outputs zeroes.
    this.audioElement.crossOrigin = 'anonymous';
    this.addEventListeners();

    if (audioCtx) {
      this.audioContext = audioCtx;
      this.ownsContext = false;
      this.createNodes();
    }
  }

  private static detachSource(audio: HTMLAudioElement) {
    audio.src = '';
    audio.removeAttribute('src');
    audio.load();
  }

  applyReplayGain(
    mode: ReplayGainMode,
    trackGain?: number,
    albumGain?: number,
    peak?: number,
  ) {
    if (mode === 'off') {
      this.replayGainValue = 1;
    } else {
      const gainDb = mode === 'album' ? albumGain : trackGain;
      const rawGain = Math.pow(10, (gainDb ?? 0) / 20);
      const maxGain = peak && peak > 0 ? 1 / peak : Infinity;
      this.replayGainValue = Math.min(rawGain, maxGain);
    }

    if (this.replayGainNode) {
      this.replayGainNode.gain.value = this.replayGainValue;
    }
  }

  changePlaybackRate(rate: number) {
    this.audioElement.playbackRate = rate;
  }

  destroy() {
    this.audioElement.pause();
    AudioPlayer.detachSource(this.audioElement);

    if (this.ownsContext) {
      void this.audioContext?.close();
    }

    this.audioContext = null;
    this.audioSourceNode = null;
    this.replayGainNode = null;
    this.crossfadeGainNode = null;
    this.volumeNode = null;
  }

  getCrossfadeGainNode() {
    return this.crossfadeGainNode;
  }

  load(source: string) {
    this.ensureAudioContext();

    const newAudio = new Audio();
    newAudio.crossOrigin = 'anonymous';
    newAudio.src = source;

    this.swapElement(newAudio);
  }

  loadFromElement(element: HTMLAudioElement) {
    this.ensureAudioContext();
    this.swapElement(element);
  }

  mute() {
    if (this.crossfadeGainNode) {
      this.crossfadeGainNode.gain.value = 0;
    }
  }

  onBuffered(callback: (bufferedTime: number) => void) {
    this.bufferedCallback = callback;
  }

  onCanPlay(callback: () => void) {
    this.canPlayCallback = callback;
  }

  onEnded(callback: () => void) {
    this.endedCallback = callback;
  }

  onLoadedMetadata(callback: (duration: number) => void) {
    this.loadedMetadataCallback = callback;
  }

  onPause(callback: () => void) {
    this.pauseCallback = callback;
  }

  onPlay(callback: () => void) {
    this.playCallback = callback;
  }

  onTimeupdate(callback: (currentTime: number) => void) {
    this.timeupdateCallback = callback;
  }

  onWaiting(callback: () => void) {
    this.waitingCallback = callback;
  }

  pause() {
    this.audioElement.pause();
  }

  async play() {
    this.ensureAudioContext();
    await this.audioContext?.resume();
    await this.audioElement.play();
  }

  resetCrossfadeGain() {
    if (this.crossfadeGainNode) {
      this.crossfadeGainNode.gain.value = 1;
    }
  }

  setCurrentTime(time: number) {
    this.audioElement.currentTime = time;
  }

  setVolume(volume: number) {
    const adjustedVolume = Math.max(0, Math.min(volume, 1));
    this.currentVolume = adjustedVolume;

    if (this.volumeNode) {
      this.volumeNode.gain.value = adjustedVolume;
    }
  }

  unload() {
    this.audioElement.pause();
    AudioPlayer.detachSource(this.audioElement);
  }

  private addEventListeners() {
    this.eventListeners.forEach(({ handler, type }) => {
      this.audioElement.addEventListener(type, handler);
    });
  }

  private bufferedCallback: (bufferedTime: number) => void = () => ({});

  private canPlayCallback: () => void = () => ({});

  private connectElement(element: HTMLAudioElement) {
    if (!this.audioContext || !this.replayGainNode) {
      return;
    }

    try {
      this.audioSourceNode =
        this.audioContext.createMediaElementSource(element);

      this.audioSourceNode.connect(this.replayGainNode);
    } catch {
      // Tear down the Web Audio graph so the element falls
      // back to direct playback.
      this.audioContext = null;
      this.audioSourceNode = null;
      this.replayGainNode = null;
      this.crossfadeGainNode = null;
      this.volumeNode = null;
    }
  }

  private createNodes() {
    if (!this.audioContext) {
      return;
    }

    this.replayGainNode = this.audioContext.createGain();
    this.crossfadeGainNode = this.audioContext.createGain();
    this.volumeNode = this.audioContext.createGain();

    this.replayGainNode.connect(this.crossfadeGainNode);
    this.crossfadeGainNode.connect(this.volumeNode);
    this.volumeNode.connect(this.audioContext.destination);

    this.replayGainNode.gain.value = this.replayGainValue;
    this.crossfadeGainNode.gain.value = 1;
    this.volumeNode.gain.value = this.currentVolume;
  }

  private endedCallback: () => void = () => ({});

  private ensureAudioContext() {
    if (this.audioContext) {
      return;
    }

    this.audioContext = new AudioContext();
    this.ownsContext = true;
    this.createNodes();
  }

  private readonly handleCanPlay = () => {
    this.canPlayCallback();
  };

  private readonly handleCanPlayThrough = () => {
    this.canPlayCallback();
  };

  private readonly handleEnded = () => {
    this.endedCallback();
  };

  private readonly handleLoadedMetadata = () => {
    this.loadedMetadataCallback(this.audioElement.duration);
  };

  private readonly handlePause = () => {
    this.pauseCallback();
  };

  private readonly handlePlay = () => {
    this.playCallback();
  };

  private readonly handleProgress = () => {
    this.setBufferProgress();
  };

  private readonly handleTimeupdate = () => {
    if (!this.audioElement.currentTime) {
      return;
    }

    // trunc value as current time is a decimal. This should prevent an
    // Uncaught TypeError of the position being more than the duration.
    this.timeupdateCallback(Math.trunc(this.audioElement.currentTime));
    this.setBufferProgress();
  };

  private readonly handleWaiting = () => {
    this.waitingCallback();
  };

  private loadedMetadataCallback: (duration: number) => void = () => ({});

  private pauseCallback: () => void = () => ({});

  private playCallback: () => void = () => ({});

  private removeEventListeners() {
    this.eventListeners.forEach(({ handler, type }) => {
      this.audioElement.removeEventListener(type, handler);
    });
  }

  private readonly setBufferProgress = () => {
    const duration = this.audioElement?.duration || 0;

    if (duration > 0) {
      for (let index = 0; index < this.audioElement.buffered.length; index++) {
        if (
          this.audioElement.buffered.start(
            this.audioElement.buffered.length - 1 - index,
          ) < this.audioElement.currentTime
        ) {
          const bufferedDuration = this.audioElement.buffered.end(
            this.audioElement.buffered.length - 1 - index,
          );
          this.bufferedCallback(bufferedDuration);
          break;
        }
      }
    }
  };

  private swapElement(newElement: HTMLAudioElement) {
    const oldAudio = this.audioElement;
    this.audioSourceNode?.disconnect();
    this.removeEventListeners();
    oldAudio.pause();
    this.audioElement = newElement;
    this.addEventListeners();
    this.connectElement(newElement);
    AudioPlayer.detachSource(oldAudio);
  }

  private timeupdateCallback: (currentTime: number) => void = () => ({});

  private waitingCallback: () => void = () => ({});
}
