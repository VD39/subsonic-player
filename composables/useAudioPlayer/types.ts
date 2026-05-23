export interface MediaSessionActions {
  [MEDIA_SESSION_ACTION_DETAILS.nextTrack]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.pause]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.play]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.previousTrack]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.seekBackward]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.seekForward]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.seekTo]: (time: number) => void;
  currentTime: ComputedRef<number>;
  currentTrack: ComputedRef<MixedTrack>;
  hasCurrentTrack: ComputedRef<boolean>;
  hasNextTrack: ComputedRef<boolean>;
  hasPreviousTrack: ComputedRef<boolean>;
  isPodcastEpisode: ComputedRef<boolean>;
  isRadioStation: ComputedRef<boolean>;
  playbackRate: ComputedRef<number>;
}
