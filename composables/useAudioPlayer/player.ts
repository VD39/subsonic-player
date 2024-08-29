export class AudioPlayer {
  private audio: HTMLAudioElement;

  // eslint-disable-next-line no-undef
  private fadeTimer: NodeJS.Timeout | undefined = undefined;
  private currentVolume = 1;

  private timeupdateCallback: (currentTime: number) => void = () => ({});
  private bufferedCallback: (bufferedTime: number) => void = () => ({});
  private waitingCallback: () => void = () => ({});
  private loadedMetadataCallback: (duration: number) => void = () => ({});
  private endedCallback: () => void = () => ({});
  private canPlayCallback: () => void = () => ({});

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

  onTimeupdate(callback: (currentTime: number) => void) {
    this.timeupdateCallback = callback;
  }

  onLoadedMetadata(callback: (duration: number) => void) {
    this.loadedMetadataCallback = callback;
  }

  onBuffered(callback: (bufferedTime: number) => void) {
    this.bufferedCallback = callback;
  }

  onWaiting(callback: () => void) {
    this.waitingCallback = callback;
  }

  onCanPlay(callback: () => void) {
    this.canPlayCallback = callback;
  }

  onEnded(callback: () => void) {
    this.endedCallback = callback;
  }

  async play() {
    await this.audio.play();
    // this.audio.volume = 0;
    // this.fadeIn();
  }

  pause() {
    this.fadeOut();
  }

  load(source: string) {
    this.unload();
    this.audio.setAttribute('src', source);
    this.audio.load();
  }

  unload() {
    this.audio.pause();
    this.audio.removeAttribute('src');
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

  changePlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }
}
