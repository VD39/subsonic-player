export interface MediaSessionActions {
  [MEDIA_SESSION_ACTION_DETAILS.nextTrack]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.pause]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.play]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.previousTrack]: () => Promise<void>;
  [MEDIA_SESSION_ACTION_DETAILS.seekBackward]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.seekForward]: () => void;
  [MEDIA_SESSION_ACTION_DETAILS.seekTo]: (time: number) => void;
  canPlayNext: ComputedRef<boolean>;
  canPlayPrevious: ComputedRef<boolean>;
  currentTime: ComputedRef<number>;
  currentTrack: ComputedRef<PlayableTrack>;
  hasCurrentTrack: ComputedRef<boolean>;
  isPodcastEpisode: ComputedRef<boolean>;
  isRadioStation: ComputedRef<boolean>;
  playbackRate: ComputedRef<number>;
}
