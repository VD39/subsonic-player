export class AudioPlayer {
  private audioContext: AudioContext | null = null;

  private bufferedCallback: (bufferedTime: number) => void = () => ({});

  private canPlayCallback: () => void = () => ({});

  private crossfadeDurationCallback: () => number = () => 0;

  private crossfadeEffect: CrossfadeEffect | null = null;

  private crossfadeTriggerCallback: () => void = () => ({});

  private currentReplayGainValue = 1;

  private currentTrack: null | TrackInstance = null;

  // Pending volume, applied to volumeNode once the context exists
  // (lazy init means setVolume() can run before the nodes are created).
  private currentVolume = 1;

  private endedCallback: () => void = () => ({});

  private fadingTrack: null | TrackInstance = null;

  private readonly handleCanPlayThrough = () => {
    this.canPlayCallback();
  };

  private readonly handleEnded = () => {
    this.endedCallback();
  };

  private readonly handleFadingEnded = () => {
    this.fadingTrack?.destroy();
    this.fadingTrack = null;
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
    if (!this.currentTrack?.element.currentTime) {
      return;
    }

    const { currentTime, duration } = this.currentTrack.element;

    this.timeupdateCallback(Math.trunc(currentTime));
    this.setBufferProgress();
    this.transitionScheduler.monitor(
      currentTime,
      duration,
      this.crossfadeDurationCallback(),
    );
  };

  private readonly handleWaiting = () => {
    this.waitingCallback();
  };

  private masterVolumeNode: GainNode | null = null;

  private ownsContext = true;

  private pauseCallback: () => void = () => ({});

  private playCallback: () => void = () => ({});

  private readonly setBufferProgress = () => {
    const element = this.currentTrack?.element;
    const duration = element?.duration || 0;

    if (duration <= 0) {
      return;
    }

    for (let index = 0; index < element!.buffered.length; index++) {
      const bufferedIndex = element!.buffered.length - 1 - index;

      if (element!.buffered.start(bufferedIndex) < element!.currentTime) {
        this.bufferedCallback(element!.buffered.end(bufferedIndex));
        break;
      }
    }
  };

  private timeupdateCallback: (currentTime: number) => void = () => ({});

  private readonly transitionScheduler = new TransitionScheduler();

  private waitingCallback: () => void = () => ({});

  constructor(audioCtx?: AudioContext) {
    this.transitionScheduler.onTrigger(() => {
      this.crossfadeTriggerCallback();
    });

    if (audioCtx) {
      this.audioContext = audioCtx;
      this.ownsContext = false;
      this.createNodes();
    }
  }

  private addEventListeners(element: HTMLAudioElement) {
    this.eventListeners.forEach(({ handler, type }) => {
      element.addEventListener(type, handler);
    });
  }

  applyReplayGain(
    mode: ReplayGainMode,
    trackGain?: number,
    albumGain?: number,
    peak?: number,
  ) {
    this.currentReplayGainValue = calculateReplayGain(
      mode,
      trackGain,
      albumGain,
      peak,
    );

    this.currentTrack?.applyReplayGain(this.currentReplayGainValue);
  }

  changePlaybackRate(rate: number) {
    if (this.currentTrack) {
      this.currentTrack.element.playbackRate = rate;
    }
  }

  private createNodes() {
    if (!this.audioContext) {
      return;
    }

    this.masterVolumeNode = this.audioContext.createGain();
    this.masterVolumeNode.gain.value = this.currentVolume;
    this.masterVolumeNode.connect(this.audioContext.destination);

    this.crossfadeEffect = new CrossfadeEffect(this.audioContext);
  }

  crossfadeTo(source: string, knownDuration?: number) {
    this.ensureAudioContext();
    this.swapTrack(source, true, knownDuration);
  }

  crossfadeToElement(element: HTMLAudioElement, knownDuration?: number) {
    this.ensureAudioContext();
    this.swapTrack(element, true, knownDuration);
  }

  destroy() {
    if (this.currentTrack) {
      this.removeEventListeners(this.currentTrack.element);
      this.currentTrack.destroy();
      this.currentTrack = null;
    }

    if (this.fadingTrack) {
      this.fadingTrack.element.removeEventListener(
        'ended',
        this.handleFadingEnded,
      );
      this.fadingTrack.destroy();
      this.fadingTrack = null;
    }

    if (this.ownsContext) {
      void this.audioContext?.close();
    }

    this.audioContext = null;
    this.masterVolumeNode = null;
    this.crossfadeEffect = null;
    this.currentReplayGainValue = 1;
  }

  private ensureAudioContext() {
    if (this.audioContext) {
      return;
    }

    this.audioContext = new AudioContext();
    this.ownsContext = true;
    this.createNodes();
  }

  // Event listeners for the audio element.
  private get eventListeners() {
    return [
      {
        handler: this.handleCanPlayThrough,
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

  private instantSwap(track: TrackInstance) {
    if (this.currentTrack) {
      this.removeEventListeners(this.currentTrack.element);
      this.currentTrack.destroy();
    }

    this.currentTrack = track;
    this.addEventListeners(track.element);
    track.connect(this.currentReplayGainValue);
  }

  load(source: string, knownDuration?: number) {
    this.ensureAudioContext();
    this.swapTrack(source, false, knownDuration);
  }

  loadFromElement(element: HTMLAudioElement, knownDuration?: number) {
    this.ensureAudioContext();
    this.swapTrack(element, false, knownDuration);
  }

  onBuffered(callback: (bufferedTime: number) => void) {
    this.bufferedCallback = callback;
  }

  onCanPlay(callback: () => void) {
    this.canPlayCallback = callback;
  }

  onCrossfadeTrigger(callback: () => void) {
    this.crossfadeTriggerCallback = callback;
  }

  onEnded(callback: () => void) {
    this.endedCallback = callback;
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
    this.currentTrack?.element.pause();
  }

  async play() {
    this.ensureAudioContext();
    await this.audioContext?.resume();
    await this.currentTrack?.element.play();
  }

  private removeEventListeners(element: HTMLAudioElement) {
    this.eventListeners.forEach(({ handler, type }) => {
      element.removeEventListener(type, handler);
    });
  }

  setCrossfadeDuration(callback: () => number) {
    this.crossfadeDurationCallback = callback;
  }

  setCurrentTime(time: number) {
    if (this.currentTrack) {
      this.currentTrack.element.currentTime = time;
    }
  }

  setVolume(volume: number) {
    const adjusted = Math.max(0, Math.min(volume, 1));
    this.currentVolume = adjusted;

    if (this.masterVolumeNode) {
      this.masterVolumeNode.gain.value = adjusted;
    }
  }

  private startCrossfade(track: TrackInstance) {
    const outgoing = this.currentTrack!;
    this.removeEventListeners(outgoing.element);
    outgoing.element.addEventListener('ended', this.handleFadingEnded, {
      once: true,
    });
    this.fadingTrack = outgoing;

    if (outgoing.crossfadeGainNode && this.crossfadeEffect) {
      this.crossfadeEffect.fade(
        outgoing.crossfadeGainNode,
        0,
        this.crossfadeDurationCallback(),
      );
    }

    this.currentTrack = track;
    this.addEventListeners(track.element);
    track.connect(this.currentReplayGainValue);

    if (track.crossfadeGainNode && this.crossfadeEffect) {
      track.crossfadeGainNode.gain.value = 0;
      this.crossfadeEffect.fade(
        track.crossfadeGainNode,
        1,
        this.crossfadeDurationCallback(),
      );
    }
  }

  private swapTrack(
    source: HTMLAudioElement | string,
    crossfade: boolean,
    knownDuration?: number,
  ) {
    if (!this.audioContext || !this.masterVolumeNode) {
      return;
    }

    if (this.fadingTrack) {
      this.fadingTrack.element.removeEventListener(
        'ended',
        this.handleFadingEnded,
      );
      this.fadingTrack.destroy();
      this.fadingTrack = null;
    }

    const track = new TrackInstance(
      this.audioContext,
      source,
      this.masterVolumeNode,
    );

    const canCrossfade =
      crossfade &&
      !!this.currentTrack &&
      !!this.crossfadeEffect &&
      this.crossfadeDurationCallback() > 0;

    if (canCrossfade) {
      this.startCrossfade(track);
    } else {
      this.instantSwap(track);
    }

    this.transitionScheduler.reset();
    this.transitionScheduler.setKnownDuration(knownDuration ?? 0);
  }

  unload() {
    if (this.currentTrack) {
      this.currentTrack.element.pause();
      detachAudioSource(this.currentTrack.element);
    }
  }
}
