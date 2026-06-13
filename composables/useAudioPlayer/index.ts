export function useAudioPlayer() {
  const { getStreamUrl } = useAPI();
  const { addErrorSnack } = useSnack();
  const { scrobble } = useMediaLibrary();
  const { createBookmark, deleteBookmark } = useBookmark();
  const { loadDashboardAlbums } = useAlbum();
  const {
    addTracks,
    currentQueueIndex,
    currentTrack,
    enrichTracksWithPositions,
    hasCurrentTrack,
    hasNextTrack: queueHasNextTrack,
    hasPreviousTrack: queueHasPreviousTrack,
    isLastTrack,
    isPodcastEpisode,
    isRadioStation,
    isTrack,
    navigateQueue,
    queueList,
    removeTrack,
    reorderQueueTracks,
    shuffleQueue,
    unshuffleQueue,
    updateCurrentTrackPosition,
  } = useQueue();

  const playerStateRestored = useState(
    STATE_KEYS.playerStateRestored,
    () => false,
  );

  const audioPlayer = useState<InstanceType<typeof AudioPlayer> | null>(
    STATE_KEYS.playerAudioPlayer,
    () => AUDIO_PLAYER_DEFAULT_STATES.audioPlayer,
  );

  // Audio preloader for buffering upcoming tracks.
  const preloader = useState<AudioPreloader | null>(
    STATE_KEYS.playerAudioPreloader,
    () => AUDIO_PLAYER_DEFAULT_STATES.audioPreloader,
  );

  // Save interval state for syncing playback position.
  const saveInterval = useState<null | ReturnType<typeof setInterval>>(
    STATE_KEYS.playerSaveInterval,
    () => null,
  );

  // Ready state.
  const isBuffering = useState(
    STATE_KEYS.playerPlayLoading,
    () => AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
  );

  // Audio time state.
  const currentTime = useState(
    STATE_KEYS.playerCurrentTime,
    () => AUDIO_PLAYER_DEFAULT_STATES.currentTime,
  );

  const bufferedDuration = useState(
    STATE_KEYS.playerBufferedLength,
    () => AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
  );

  // Play/Pause state.
  const isPlaying = useState(
    STATE_KEYS.playerIsPlaying,
    () => AUDIO_PLAYER_DEFAULT_STATES.isPlaying,
  );

  const pausedExternally = useState(
    STATE_KEYS.playerPausedExternally,
    () => false,
  );

  // Playback rate state.
  const playbackRate = useState(
    STATE_KEYS.playerPlaybackRate,
    () => AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
  );

  // Volume state.
  const volume = useState(
    STATE_KEYS.playerVolume,
    () => AUDIO_PLAYER_DEFAULT_STATES.volume,
  );

  const previousVolume = useState(
    STATE_KEYS.previousVolume,
    () => AUDIO_PLAYER_DEFAULT_STATES.volume,
  );

  const isMuted = computed(() => !volume.value);

  // Repeat/Shuffle state.
  const repeat = useState(
    STATE_KEYS.playerRepeat,
    () => AUDIO_PLAYER_DEFAULT_STATES.repeat,
  );

  const shuffle = useState(
    STATE_KEYS.playerShuffle,
    () => AUDIO_PLAYER_DEFAULT_STATES.shuffle,
  );

  // Scrobble states.
  const trackHasScrobbled = useState(
    STATE_KEYS.playerTrackHasScrobbled,
    () => AUDIO_PLAYER_DEFAULT_STATES.trackHasScrobbled,
  );

  // Next/previous state.
  const canPlayNext = computed(() => {
    return repeat.value === REPEAT_MODE.all || queueHasNextTrack.value;
  });

  const canPlayPrevious = computed(() => {
    return repeat.value === REPEAT_MODE.all || queueHasPreviousTrack.value;
  });

  // Save states.
  function resetAudioPlayerState() {
    bufferedDuration.value = AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration;
    currentTime.value = AUDIO_PLAYER_DEFAULT_STATES.currentTime;
    isBuffering.value = AUDIO_PLAYER_DEFAULT_STATES.isBuffering;
    isPlaying.value = false;
    playbackRate.value = AUDIO_PLAYER_DEFAULT_STATES.playbackRate;
    repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
    shuffle.value = AUDIO_PLAYER_DEFAULT_STATES.shuffle;
    volume.value = AUDIO_PLAYER_DEFAULT_STATES.volume;
    previousVolume.value = AUDIO_PLAYER_DEFAULT_STATES.volume;

    deleteLocalStorage(LOCAL_STORAGE_KEYS.player);
  }

  async function restoreAudioPlayerState() {
    if (playerStateRestored.value) {
      return;
    }

    setupAudioPlayer();

    const SAVED_STATE = getLocalStorage(LOCAL_STORAGE_KEYS.player);

    if (SAVED_STATE) {
      repeat.value = SAVED_STATE.repeat;
      shuffle.value = SAVED_STATE.shuffle;
      setVolume(SAVED_STATE.volume);
      setPlaybackRate(SAVED_STATE.playbackRate);
    }

    if (hasCurrentTrack.value) {
      loadTrack(currentTrack.value);
      setMediaSessionMetadata();
      setupMediaSessionHandlers();

      const position = currentTrack.value.position;
      const savedTime = SAVED_STATE?.currentTime;
      const timeToRestore = savedTime || position || 0;

      setCurrentTime(timeToRestore);
    }

    prefetchUpcomingTracks();

    playerStateRestored.value = true;
  }

  function saveAudioPlayerState() {
    const STATE_TO_SAVE = {
      currentTime: currentTime.value,
      playbackRate: playbackRate.value,
      repeat: repeat.value,
      shuffle: shuffle.value,
      volume: volume.value,
    };

    setLocalStorage(LOCAL_STORAGE_KEYS.player, STATE_TO_SAVE);
  }

  function onSaveInterval() {
    saveAudioPlayerState();
    syncPlaybackPosition();

    if (
      isTrack.value &&
      !trackHasScrobbled.value &&
      currentTime.value / currentTrack.value.duration > 0.8
    ) {
      scrobble(currentTrack.value.id);
      trackHasScrobbled.value = true;
    }
  }

  function stopSaveInterval() {
    clearInterval(saveInterval.value!);
  }

  function startSaveInterval() {
    stopSaveInterval();
    saveInterval.value = setInterval(onSaveInterval, SAVE_INTERVAL);
  }

  // Play/Pause actions.
  async function resumePlayback() {
    try {
      await audioPlayer.value?.play();
      isPlaying.value = true;
      startSaveInterval();
      setMediaSessionPlaybackState('playing');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error : new Error(error as string);

      // Error can throw when user is offline.
      // Only remove if we know they are online and media is not on the server.
      if (
        navigator.onLine &&
        errorMessage.message.includes('no supported source')
      ) {
        addErrorSnack(
          `The track ${currentTrack.value.id} was not found on the server and removed from queue.`,
        );

        await removeFromQueue(currentTrack.value.id);
      }
    }
  }

  function pausePlayback() {
    isPlaying.value = false;
    audioPlayer.value?.pause();
    stopSaveInterval();
    setMediaSessionPlaybackState('paused');
  }

  async function togglePlay() {
    if (isPlaying.value) {
      pausePlayback();
    } else {
      await resumePlayback();
    }
  }

  function loadTrack(track: PlayableTrack) {
    const url = getStreamUrl(track.streamUrlId!);
    const preloadedElement = preloader.value?.consume(url);

    if (preloadedElement) {
      audioPlayer.value?.loadFromElement(preloadedElement);
      isBuffering.value = false;
    } else {
      audioPlayer.value?.load(url);
    }
  }

  function prefetchUpcomingTracks() {
    const urlsToKeep = new Set<string>();

    const tracks = getTracksToPreload(
      queueList.value,
      currentQueueIndex.value,
      repeat.value,
    );

    for (const track of tracks) {
      const url = getStreamUrl(track.streamUrlId!);
      urlsToKeep.add(url);
      preloader.value?.preload(url);
    }

    preloader.value?.prune(urlsToKeep);
  }

  async function changeTrack(track: PlayableTrack) {
    trackHasScrobbled.value = false;

    stopSaveInterval();
    setMediaSessionMetadata();
    setupMediaSessionHandlers();
    loadTrack(track);

    if (isPodcastEpisode.value && track.position) {
      setCurrentTime(track.position);
    }

    setMediaSessionPositionState();
    await resumePlayback();

    if (isPodcastEpisode.value) {
      setPlaybackRate(playbackRate.value);
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
    syncPlaybackPosition();
  }

  const {
    setMediaSessionMetadata,
    setMediaSessionPlaybackState,
    setMediaSessionPositionState,
    setupMediaSessionHandlers,
  } = useMediaSession({
    canPlayNext,
    canPlayPrevious,
    currentTime: computed(() => currentTime.value),
    currentTrack,
    hasCurrentTrack,
    isPodcastEpisode,
    isRadioStation,
    [MEDIA_SESSION_ACTION_DETAILS.nextTrack]: playNextTrack,
    [MEDIA_SESSION_ACTION_DETAILS.pause]: pausePlayback,
    [MEDIA_SESSION_ACTION_DETAILS.play]: resumePlayback,
    [MEDIA_SESSION_ACTION_DETAILS.previousTrack]: playPreviousTrack,
    [MEDIA_SESSION_ACTION_DETAILS.seekBackward]: rewindTrack,
    [MEDIA_SESSION_ACTION_DETAILS.seekForward]: fastForwardTrack,
    [MEDIA_SESSION_ACTION_DETAILS.seekTo]: seekTo,
    playbackRate: computed(() => playbackRate.value),
  });

  // Next/previous actions.
  async function playNextTrack() {
    resetPlaybackTimes();
    const track = navigateQueue('next');
    await changeTrack(track);
  }

  async function playPreviousTrack() {
    resetPlaybackTimes();
    const track = navigateQueue('previous');
    await changeTrack(track);
  }

  // Audio time actions.
  function setCurrentTime(time: number) {
    // Trunc value as current time is a decimal. This should prevent an
    // Uncaught TypeError of the position being more than the duration.
    const truncTime = Math.trunc(time);

    audioPlayer.value?.setCurrentTime(truncTime);
    currentTime.value = truncTime;
    saveAudioPlayerState();
  }

  function syncPlaybackPosition(currentSyncTime = currentTime.value) {
    updateCurrentTrackPosition(currentSyncTime);

    if (isPodcastEpisode.value && currentSyncTime > 0) {
      createBookmark(currentTrack.value.id, currentSyncTime);
    }
  }

  function seekTo(time: number) {
    setCurrentTime(time);
    syncPlaybackPosition();
  }

  function rewindTrack() {
    const time = Math.max(0, currentTime.value - REWIND_TRACK_TIME);
    seekTo(time);
  }

  function fastForwardTrack() {
    if (
      currentTime.value >=
      currentTrack.value.duration - FAST_FORWARD_TRACK_TIME
    ) {
      return;
    }

    seekTo(currentTime.value + FAST_FORWARD_TRACK_TIME);
  }

  // Repeat/Shuffle actions.
  function cycleRepeat() {
    switch (repeat.value) {
      case REPEAT_MODE.all:
        repeat.value = REPEAT_MODE.one;
        break;
      case REPEAT_MODE.off:
        repeat.value = REPEAT_MODE.all;
        break;
      default:
        repeat.value = REPEAT_MODE.off;
        break;
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  function toggleShuffle() {
    shuffle.value = !shuffle.value;

    if (shuffle.value) {
      shuffleQueue();
    } else {
      unshuffleQueue();
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  async function playTracksShuffled(tracks: PlayableTrack[]) {
    const queueIndex = Math.floor(Math.random() * tracks.length);
    await playTracks(tracks, queueIndex);
    toggleShuffle();
  }

  // Volume actions.
  function setVolume(newVolume: number) {
    previousVolume.value = volume.value;
    audioPlayer.value?.setVolume(newVolume);
    volume.value = newVolume;
    saveAudioPlayerState();
  }

  function setVolumeWithIncrement(change: number) {
    const newVolume = Math.max(0, Math.min(1, volume.value + change));
    setVolume(newVolume);
  }

  function unmuteVolume() {
    const newVolume = Math.max(previousVolume.value, 0.1);
    setVolume(newVolume);
  }

  function toggleMute() {
    if (isMuted.value) {
      unmuteVolume();
    } else {
      setVolume(0);
    }
  }

  function setPlaybackRateWithIncrement(rateIndexDelta: number) {
    const newPlaybackRateIndex = Math.max(
      0,
      Math.min(PLAYBACK_RATES.length - 1, playbackRate.value + rateIndexDelta),
    );

    setPlaybackRate(newPlaybackRateIndex);
  }

  function setPlaybackRate(index: number) {
    playbackRate.value = index;
    audioPlayer.value?.changePlaybackRate(PLAYBACK_RATES[index].speed);
    saveAudioPlayerState();
  }

  function resetPlayerSession() {
    audioPlayer.value?.unload();
    preloader.value?.clear();
    shuffle.value = AUDIO_PLAYER_DEFAULT_STATES.shuffle;
    repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
    resetPlaybackTimes();
  }

  // Queue actions.
  async function playFromQueue(index: number) {
    resetPlaybackTimes();
    const track = navigateQueue(index);
    await changeTrack(track);
  }

  async function removeFromQueue(id: string) {
    const removedTrackWasPlaying = isPlaying.value;

    const removedTrackLastOrSingle = removeTrack(id);

    if (removedTrackLastOrSingle === 1) {
      resetPlayerSession();
      return;
    }

    if (removedTrackLastOrSingle) {
      audioPlayer.value?.unload();
      await changeTrack(currentTrack.value);

      if (!removedTrackWasPlaying) {
        pausePlayback();
      }
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  function reorderQueueTrack(fromIndex: number, toIndex: number) {
    reorderQueueTracks(fromIndex, toIndex);
    prefetchUpcomingTracks();
  }

  async function addTracksToQueue(tracks: PlayableTrack[]) {
    await enrichTracksWithPositions(tracks);
    const queueListHasTrack = addTracks(tracks);

    if (!queueListHasTrack) {
      await playNextTrack();
      pausePlayback();
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  async function addTrackToQueue(track: PlayableTrack) {
    await addTracksToQueue([track]);
  }

  async function playTracks(tracks: PlayableTrack[], queueOffset = 0) {
    await enrichTracksWithPositions(tracks);
    resetPlayerSession();
    addTracks(tracks, true);
    const track = navigateQueue(queueOffset);
    await changeTrack(track);
  }

  function resetPlaybackState() {
    currentTime.value = AUDIO_PLAYER_DEFAULT_STATES.currentTime;
    bufferedDuration.value = AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration;
    saveAudioPlayerState();
  }

  function resetPlaybackTimes() {
    // Store actual position for podcasts to sync with bookmark before resetting.
    const bookmarkTimeToSync = currentTime.value;

    resetPlaybackState();
    syncPlaybackPosition(bookmarkTimeToSync);
  }

  function resetAudioPlayer() {
    audioPlayer.value?.unload();
    preloader.value?.clear();
    resetAudioPlayerState();
    stopSaveInterval();
    playerStateRestored.value = false;
  }

  function setupAudioPlayer() {
    audioPlayer.value = new AudioPlayer();
    preloader.value = new AudioPreloader();

    // Audio actions.
    audioPlayer.value.onTimeupdate((newCurrentTime: number) => {
      currentTime.value = newCurrentTime;
      setMediaSessionPositionState();
    });

    audioPlayer.value.onCanPlay(() => {
      isBuffering.value = false;
    });

    audioPlayer.value.onBuffered((newBufferedDuration: number) => {
      bufferedDuration.value = newBufferedDuration;
    });

    audioPlayer.value.onWaiting(() => {
      isBuffering.value = true;
    });

    audioPlayer.value.onEnded(async () => {
      loadDashboardAlbums();

      if (isPodcastEpisode.value) {
        deleteBookmark(currentTrack.value.id, false);
      }

      resetPlaybackState();
      updateCurrentTrackPosition(0);

      switch (repeat.value) {
        case REPEAT_MODE.all: {
          const track = navigateQueue('next');
          await changeTrack(track);
          break;
        }
        case REPEAT_MODE.one:
          await changeTrack(currentTrack.value);
          break;
        default: {
          if (isLastTrack.value) {
            const track = navigateQueue(0);
            await changeTrack(track);
            pausePlayback();

            return;
          }

          const track = navigateQueue('next');
          await changeTrack(track);
        }
      }
    });

    audioPlayer.value.onPause(() => {
      if (isPlaying.value) {
        pausedExternally.value = true;
        pausePlayback();
      }
    });

    audioPlayer.value.onPlay(async () => {
      if (pausedExternally.value) {
        pausedExternally.value = false;
        audioPlayer.value?.pause();
        await resumePlayback();
      }
    });
  }

  return {
    addTracksToQueue,
    addTrackToQueue,
    bufferedDuration,
    canPlayNext,
    canPlayPrevious,
    currentTime,
    cycleRepeat,
    fastForwardTrack,
    isBuffering,
    isMuted,
    isPlaying,
    playbackRate,
    playFromQueue,
    playNextTrack,
    playPreviousTrack,
    playTracks,
    playTracksShuffled,
    removeFromQueue,
    reorderQueueTrack,
    repeat,
    resetAudioPlayer,
    resetPlayerSession,
    restoreAudioPlayerState,
    rewindTrack,
    seekTo,
    setPlaybackRate,
    setPlaybackRateWithIncrement,
    setVolume,
    setVolumeWithIncrement,
    shuffle,
    toggleMute,
    togglePlay,
    toggleShuffle,
    volume,
  };
}
