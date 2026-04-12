export class AudioPlayer {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.volume = 1;
    this.addEventListeners();
  }

  changePlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }

  load(source: string) {
    this.unload();
    this.audio.setAttribute('src', source);
    this.audio.load();
  }

  loadFromElement(element: HTMLAudioElement) {
    const currentVolume = this.audio.volume;
    this.removeEventListeners();
    this.unload();
    this.audio = element;
    this.audio.volume = currentVolume;
    this.addEventListeners();
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

  onTimeupdate(callback: (currentTime: number) => void) {
    this.timeupdateCallback = callback;
  }

  onWaiting(callback: () => void) {
    this.waitingCallback = callback;
  }

  pause() {
    this.audio.pause();
  }

  async play() {
    await this.audio.play();
  }

  setCurrentTime(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    const adjustedVolume = Math.max(0, Math.min(volume, 1));
    this.audio.volume = adjustedVolume;
  }

  unload() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  private addEventListeners() {
    this.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.addEventListener('progress', this.handleProgress);
    this.audio.addEventListener('timeupdate', this.handleTimeupdate);
    this.audio.addEventListener('canplay', this.handleCanPlay);
    this.audio.addEventListener('canplaythrough', this.handleCanPlayThrough);
    this.audio.addEventListener('waiting', this.handleWaiting);
    this.audio.addEventListener('ended', this.handleEnded);
  }

  private bufferedCallback: (bufferedTime: number) => void = () => ({});

  private canPlayCallback: () => void = () => ({});

  private endedCallback: () => void = () => ({});

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
    this.loadedMetadataCallback(this.audio.duration);
  };

  private readonly handleProgress = () => {
    this.setBufferProgress();
  };

  private readonly handleTimeupdate = () => {
    if (!this.audio.currentTime) {
      return;
    }

    // trunc value as current time is a decimal. This should prevent an
    // Uncaught TypeError of the position being more than the duration.
    this.timeupdateCallback(Math.trunc(this.audio.currentTime));
    this.setBufferProgress();
  };

  private readonly handleWaiting = () => {
    this.waitingCallback();
  };

  private loadedMetadataCallback: (duration: number) => void = () => ({});

  private removeEventListeners() {
    this.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.removeEventListener('progress', this.handleProgress);
    this.audio.removeEventListener('timeupdate', this.handleTimeupdate);
    this.audio.removeEventListener('canplay', this.handleCanPlay);
    this.audio.removeEventListener('canplaythrough', this.handleCanPlayThrough);
    this.audio.removeEventListener('waiting', this.handleWaiting);
    this.audio.removeEventListener('ended', this.handleEnded);
  }

  private readonly setBufferProgress = () => {
    const duration = this.audio?.duration || 0;

    if (duration > 0) {
      for (let index = 0; index < this.audio.buffered.length; index++) {
        if (
          this.audio.buffered.start(this.audio.buffered.length - 1 - index) <
          this.audio.currentTime
        ) {
          const bufferedDuration = this.audio.buffered.end(
            this.audio.buffered.length - 1 - index,
          );
          this.bufferedCallback(bufferedDuration);
          break;
        }
      }
    }
  };

  private timeupdateCallback: (currentTime: number) => void = () => ({});

  private waitingCallback: () => void = () => ({});
}
