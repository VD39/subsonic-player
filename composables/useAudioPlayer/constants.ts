export const REWIND_TRACK_TIME = 10;
export const FAST_FORWARD_TRACK_TIME = 30;
export const VOLUME_INCREASE = 0.02;
export const SAVE_INTERVAL = 2000;

export const AUDIO_PLAYER_DEFAULT_STATES = {
  audioPlayer: null,
  bufferedDuration: 0,
  currentQueueIndex: -1,
  currentTime: 0,
  isBuffering: false,
  isPlaying: false,
  originalQueueList: '',
  playbackRate: 1,
  queueList: [] as MixedTrack[],
  repeat: -1,
  shuffle: false,
  trackHasScrobbled: false,
  volume: 1,
};

export const MEDIA_SESSION_ACTION_DETAILS = {
  nextTrack: 'nexttrack',
  pause: 'pause',
  play: 'play',
  previousTrack: 'previoustrack',
  seekBackward: 'seekbackward',
  seekForward: 'seekforward',
  seekTo: 'seekto',
} as const;
