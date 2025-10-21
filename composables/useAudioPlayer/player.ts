export class AudioPlayer {
  private readonly audio: HTMLAudioElement;

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
    this.audio.addEventListener('loadedmetadata', () => {
      this.loadedMetadataCallback(this.audio.duration);
    });

    this.audio.addEventListener('progress', this.setBufferProgress);

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio.currentTime) {
        return;
      }

      // trunc value as current time is a decimal. This should prevent an
      // Uncaught TypeError of the position being more than the duration.
      this.timeupdateCallback(Math.trunc(this.audio.currentTime));
      this.setBufferProgress();
    });

    this.audio.addEventListener('canplay', () => {
      this.canPlayCallback();
    });

    this.audio.addEventListener('canplaythrough', () => {
      this.canPlayCallback();
    });

    this.audio.addEventListener('waiting', () => {
      this.waitingCallback();
    });

    this.audio.addEventListener('ended', () => {
      this.endedCallback();
    });
  }

  private bufferedCallback: (bufferedTime: number) => void = () => ({});

  private canPlayCallback: () => void = () => ({});

  private endedCallback: () => void = () => ({});

  private loadedMetadataCallback: (duration: number) => void = () => ({});

  private setBufferProgress() {
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
  }

  private timeupdateCallback: (currentTime: number) => void = () => ({});

  private waitingCallback: () => void = () => ({});
}
