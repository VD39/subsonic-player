export const REWIND_TRACK_TIME = 10;
export const FAST_FORWARD_TRACK_TIME = 30;
export const VOLUME_INCREASE = 0.02;
export const SAVE_INTERVAL = 2000;

export const PLAYBACK_RATES = [
  {
    speed: 0.5,
    title: '0.5x',
  },
  {
    speed: 0.75,
    title: '0.75x',
  },
  {
    speed: 1,
    title: 'Normal',
  },
  {
    speed: 1.5,
    title: '1.5x',
  },
  {
    speed: 2,
    title: '2x',
  },
  {
    speed: 2.5,
    title: '2.5x',
  },
] as const;

export const AUDIO_PLAYER_DEFAULT_STATES = {
  audioPlayer: null,
  bufferedDuration: 0,
  currentQueueIndex: -1,
  currentTime: 0,
  isBuffering: false,
  isPlaying: false,
  originalQueueList: '',
  playbackRate: PLAYBACK_RATES.findIndex((rate) => rate.title === 'Normal'),
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

export const REWIND_FAST_FORWARD_TITLES = {
  fastForward: `Fast forward back ${FAST_FORWARD_TRACK_TIME} seconds`,
  rewind: `Rewind back ${REWIND_TRACK_TIME} seconds`,
} as const;
