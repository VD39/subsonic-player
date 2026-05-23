export function useMediaSession(actions: MediaSessionActions) {
  const { getImageUrl } = useAPI();

  const hasMediaSession =
    typeof navigator !== 'undefined' && 'mediaSession' in navigator;

  /* istanbul ignore next -- @preserve */
  async function onMediaSessionAction(
    details: Parameters<
      NonNullable<Parameters<MediaSession['setActionHandler']>['1']>
    >['0'],
  ) {
    switch (details.action) {
      case MEDIA_SESSION_ACTION_DETAILS.nextTrack:
        await actions[MEDIA_SESSION_ACTION_DETAILS.nextTrack]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.pause:
        actions[MEDIA_SESSION_ACTION_DETAILS.pause]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.play:
        await actions[MEDIA_SESSION_ACTION_DETAILS.play]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.previousTrack:
        await actions[MEDIA_SESSION_ACTION_DETAILS.previousTrack]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.seekBackward:
        actions[MEDIA_SESSION_ACTION_DETAILS.seekBackward]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.seekForward:
        actions[MEDIA_SESSION_ACTION_DETAILS.seekForward]();
        break;
      case MEDIA_SESSION_ACTION_DETAILS.seekTo:
        if (details.seekTime != null) {
          actions[MEDIA_SESSION_ACTION_DETAILS.seekTo](details.seekTime);
        }

        break;
    }
  }

  function setMediaSessionMetadata() {
    if (!(hasMediaSession && actions.hasCurrentTrack.value)) {
      return;
    }

    const { album, artist, title } = getTrackDisplayMetadata(
      actions.currentTrack.value,
    );

    navigator.mediaSession.metadata = new MediaMetadata({
      artwork: MEDIA_SESSION_ARTWORK_SIZES.map((size) => ({
        sizes: `${size}x${size}`,
        src: getImageUrl(actions.currentTrack.value.image, size),
        type: 'image/jpeg',
      })),
      title,
      ...(album && {
        album,
      }),
      ...(artist && {
        artist,
      }),
    });
  }

  function setupMediaSessionHandlers() {
    if (!hasMediaSession) {
      return;
    }

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.pause,
      onMediaSessionAction,
    );

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.play,
      onMediaSessionAction,
    );

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.seekTo,
      onMediaSessionAction,
    );

    const nextTrackHandler = actions.hasNextTrack.value
      ? onMediaSessionAction
      : null;

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.nextTrack,
      nextTrackHandler,
    );

    const previousTrackHandler = actions.hasPreviousTrack.value
      ? onMediaSessionAction
      : null;

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.previousTrack,
      previousTrackHandler,
    );

    const podcastEpisodeHandler = actions.isPodcastEpisode.value
      ? onMediaSessionAction
      : null;

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.seekBackward,
      podcastEpisodeHandler,
    );

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.seekForward,
      podcastEpisodeHandler,
    );
  }

  function setMediaSessionPlaybackState(state: MediaSession['playbackState']) {
    if (!hasMediaSession) {
      return;
    }

    navigator.mediaSession.playbackState = state;
  }

  function setMediaSessionPositionState() {
    if (
      !(
        hasMediaSession &&
        actions.hasCurrentTrack.value &&
        !actions.isRadioStation.value
      )
    ) {
      return;
    }

    navigator.mediaSession.setPositionState({
      duration: actions.currentTrack.value.duration,
      playbackRate: PLAYBACK_RATES[actions.playbackRate.value].speed,
      position: actions.currentTime.value,
    });
  }

  return {
    setMediaSessionMetadata,
    setMediaSessionPlaybackState,
    setMediaSessionPositionState,
    setupMediaSessionHandlers,
  };
}
