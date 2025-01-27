export class AudioPlayer {
  private audio: HTMLAudioElement;

  private bufferedCallback: (bufferedTime: number) => void = () => ({});
  private canPlayCallback: () => void = () => ({});

  private currentVolume = 1;
  private endedCallback: () => void = () => ({});
  private fadeTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  private loadedMetadataCallback: (duration: number) => void = () => ({});
  private timeupdateCallback: (currentTime: number) => void = () => ({});
  private waitingCallback: () => void = () => ({});

  constructor() {
    this.audio = new Audio();
    this.audio.volume = 1;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.loadedMetadataCallback(this.audio.duration);
    });

    this.audio.addEventListener('progress', this.setBufferProgress);

    this.audio.addEventListener('timeupdate', () => {
      this.timeupdateCallback(this.audio.currentTime);
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

  private fadeIn() {
    // clearTimeout(this.fadeTimer);
    // if (this.audio.volume < this.currentVolume - VOLUME_INCREASE) {
    //   this.audio.volume += VOLUME_INCREASE;
    //   this.fadeTimer = setTimeout(() => this.fadeIn(), 10);
    // } else {
    //   this.audio.volume = this.currentVolume;
    // }
  }

  private fadeOut() {
    // clearTimeout(this.fadeTimer);

    // if (this.audio.volume > VOLUME_INCREASE) {
    //   this.audio.volume -= VOLUME_INCREASE;
    //   this.fadeTimer = setTimeout(() => this.fadeOut(), 10);
    // } else {
    //   this.audio.volume = 0;
    this.audio.pause();
    // }
  }

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
    this.fadeOut();
  }

  async play() {
    await this.audio.play();
    // this.audio.volume = 0;
    // this.fadeIn();
  }

  setCurrentTime(time: number) {
    // this.fadeOut();
    // this.audio.volume = 0;
    this.audio.currentTime = time;
    // this.fadeIn();
  }

  setVolume(volume: number) {
    let adjustedVolume = volume >= 0 ? volume : 0;
    adjustedVolume = adjustedVolume <= 1 ? adjustedVolume : 1;
    this.audio.volume = adjustedVolume;
    this.currentVolume = adjustedVolume;
  }

  stop() {
    this.stop();
  }

  unload() {
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.audio.load();
  }
}
