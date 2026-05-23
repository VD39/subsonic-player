export function useAudioPlayer() {
  const { getStreamUrl } = useAPI();
  const { addErrorSnack } = useSnack();
  const { scrobble } = useMediaLibrary();
  const { createBookmark, deleteBookmark } = useBookmark();
  const { getDiscoverAlbums } = useAlbum();
  const {
    addTracks,
    currentQueueIndex,
    currentTrack,
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
    reorderTrack,
    restoreQueue,
    shuffleQueue,
    updateCurrentTrackPosition,
  } = useQueue();

  const audioPlayer = useState<InstanceType<typeof AudioPlayer> | null>(
    STATE_NAMES.playerAudioPlayer,
    () => AUDIO_PLAYER_DEFAULT_STATES.audioPlayer,
  );

  // Audio preloader for buffering upcoming tracks.
  const preloader = useState<AudioPreloader | null>(
    STATE_NAMES.playerAudioPreloader,
    () => AUDIO_PLAYER_DEFAULT_STATES.audioPreloader,
  );

  // Save interval state for syncing playback position.
  const saveInterval = useState<null | ReturnType<typeof setInterval>>(
    STATE_NAMES.playerSaveInterval,
    () => null,
  );

  // Ready state.
  const isBuffering = useState(
    STATE_NAMES.playerPlayLoading,
    () => AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
  );

  // Audio time state.
  const currentTime = useState(
    STATE_NAMES.playerCurrentTime,
    () => AUDIO_PLAYER_DEFAULT_STATES.currentTime,
  );

  const bufferedDuration = useState(
    STATE_NAMES.playerBufferedLength,
    () => AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
  );

  // Play/Pause state.
  const isPlaying = useState(
    STATE_NAMES.playerIsPlaying,
    () => AUDIO_PLAYER_DEFAULT_STATES.isPlaying,
  );

  // Playback rate state.
  const playbackRate = useState(
    STATE_NAMES.playerPlaybackRate,
    () => AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
  );

  // Volume state.
  const volume = useState(
    STATE_NAMES.playerVolume,
    () => AUDIO_PLAYER_DEFAULT_STATES.volume,
  );

  const previousVolume = useState(
    STATE_NAMES.previousVolume,
    () => AUDIO_PLAYER_DEFAULT_STATES.volume,
  );

  const isMuted = computed(() => !volume.value);

  // Repeat/Shuffle state.
  const repeat = useState(
    STATE_NAMES.playerRepeat,
    () => AUDIO_PLAYER_DEFAULT_STATES.repeat,
  );

  const shuffle = useState(
    STATE_NAMES.playerShuffle,
    () => AUDIO_PLAYER_DEFAULT_STATES.shuffle,
  );

  // Scrobble states.
  const trackHasScrobbled = useState(
    STATE_NAMES.playerTrackHasScrobbled,
    () => AUDIO_PLAYER_DEFAULT_STATES.trackHasScrobbled,
  );

  // Next/previous state.
  const hasNextTrack = computed(() => {
    return repeat.value === Number.POSITIVE_INFINITY || queueHasNextTrack.value;
  });

  const hasPreviousTrack = computed(() => {
    return (
      repeat.value === Number.POSITIVE_INFINITY || queueHasPreviousTrack.value
    );
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

    deleteLocalStorage(STATE_NAMES.playerState);
  }

  async function loadAudioPlayerState() {
    const SAVED_STATE = getLocalStorage(STATE_NAMES.playerState);

    if (!SAVED_STATE) {
      resetAudioPlayerState();

      return;
    }

    repeat.value = SAVED_STATE.repeat;
    shuffle.value = SAVED_STATE.shuffle;
    setVolume(SAVED_STATE.volume);
    setPlaybackRate(SAVED_STATE.playbackRate);

    if (hasCurrentTrack.value) {
      loadTrack(currentTrack.value);
      setMediaSessionMetadata();
      setupMediaSessionHandlers();

      const position = currentTrack.value.position;
      const savedTime = SAVED_STATE.currentTime;
      const timeToRestore =
        savedTime || (position ? Math.floor(position / 1000) : 0);

      setCurrentTime(timeToRestore);
    }

    prefetchUpcomingTracks();
  }

  function saveAudioPlayerState() {
    const STATE_TO_SAVE = {
      currentTime: currentTime.value,
      playbackRate: playbackRate.value,
      repeat: repeat.value,
      shuffle: shuffle.value,
      volume: volume.value,
    };

    setLocalStorage(STATE_NAMES.playerState, STATE_TO_SAVE);
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

  function loadTrack(track: MixedTrack) {
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

  async function changeTrack(track: MixedTrack) {
    trackHasScrobbled.value = false;

    stopSaveInterval();
    setMediaSessionMetadata();
    setupMediaSessionHandlers();
    loadTrack(track);

    if (track.position) {
      setCurrentTime(Math.floor(track.position / 1000));
    }

    setMediaSessionPositionState();
    await resumePlayback();

    if (isPodcastEpisode.value) {
      setPlaybackRate(playbackRate.value);
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  const {
    setMediaSessionMetadata,
    setMediaSessionPlaybackState,
    setMediaSessionPositionState,
    setupMediaSessionHandlers,
  } = useMediaSession({
    currentTime: computed(() => currentTime.value),
    currentTrack,
    hasCurrentTrack,
    hasNextTrack,
    hasPreviousTrack,
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

  function syncPlaybackPosition() {
    const positionMs = Math.floor(currentTime.value * 1000);

    updateCurrentTrackPosition(positionMs);

    if (isPodcastEpisode.value) {
      createBookmark(currentTrack.value.id, positionMs);
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
      case -1:
        repeat.value = Number.POSITIVE_INFINITY;
        break;
      case Number.POSITIVE_INFINITY:
        repeat.value = 1;
        break;
      default:
        repeat.value = -1;
        break;
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  async function replayCurrentTrack() {
    resetPlaybackTimes();
    await changeTrack(currentTrack.value);
  }

  function toggleShuffle() {
    shuffle.value = !shuffle.value;

    if (shuffle.value) {
      shuffleQueue();
    } else {
      restoreQueue();
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  async function shuffleTracks(tracks: MixedTrack[]) {
    const queueIndex = Math.floor(Math.random() * tracks.length) - 1;
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

  function setPlaybackRateWithIncrement(change: number) {
    const newPlaybackRateIndex = Math.max(
      0,
      Math.min(PLAYBACK_RATES.length - 1, playbackRate.value + change),
    );

    setPlaybackRate(newPlaybackRateIndex);
  }

  function setPlaybackRate(index: number) {
    playbackRate.value = index;
    audioPlayer.value?.changePlaybackRate(PLAYBACK_RATES[index].speed);
    saveAudioPlayerState();
  }

  function resetPlayer() {
    audioPlayer.value?.unload();
    preloader.value?.clear();
    resetPlaybackTimes();
    shuffle.value = AUDIO_PLAYER_DEFAULT_STATES.shuffle;
    repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
    saveAudioPlayerState();
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
      resetPlayer();
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
    reorderTrack(fromIndex, toIndex);
    prefetchUpcomingTracks();
  }

  async function addTracksToQueue(tracks: MixedTrack[]) {
    const queueListHasTrack = addTracks(tracks);

    if (!queueListHasTrack) {
      await playNextTrack();
      pausePlayback();
    }

    saveAudioPlayerState();
    prefetchUpcomingTracks();
  }

  async function addTrackToQueue(track: MixedTrack) {
    await addTracksToQueue([track]);
  }

  async function playTracks(
    tracks: MixedTrack[],
    queueIndex = QUEUE_DEFAULT_STATES.currentQueueIndex,
  ) {
    resetPlayer();
    addTracks(tracks, true);
    const track = navigateQueue(queueIndex + 1);
    await changeTrack(track);
  }

  function resetPlaybackTimes() {
    currentTime.value = AUDIO_PLAYER_DEFAULT_STATES.currentTime;
    bufferedDuration.value = AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration;
  }

  function resetAudioPlayer() {
    audioPlayer.value?.unload();
    preloader.value?.clear();
    resetAudioPlayerState();
    stopSaveInterval();
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
      await getDiscoverAlbums();

      if (isPodcastEpisode.value) {
        await deleteBookmark(currentTrack.value.id, false);
      }

      switch (repeat.value) {
        case 1:
          await replayCurrentTrack();
          break;
        case Number.POSITIVE_INFINITY:
          await playNextTrack();
          break;
        default:
          if (isLastTrack.value) {
            resetPlaybackTimes();
            const track = navigateQueue(0);
            await changeTrack(track);
            pausePlayback();

            return;
          }

          await playNextTrack();
          break;
      }
    });
  }

  async function initAudioPlayer() {
    setupAudioPlayer();
    await loadAudioPlayerState();
  }

  return {
    addTracksToQueue,
    addTrackToQueue,
    bufferedDuration,
    currentTime,
    cycleRepeat,
    fastForwardTrack,
    hasNextTrack,
    hasPreviousTrack,
    initAudioPlayer,
    isBuffering,
    isMuted,
    isPlaying,
    playbackRate,
    playFromQueue,
    playNextTrack,
    playPreviousTrack,
    playTracks,
    removeFromQueue,
    reorderQueueTrack,
    repeat,
    resetAudioPlayer,
    resetPlayer,
    rewindTrack,
    seekTo,
    setPlaybackRate,
    setPlaybackRateWithIncrement,
    setVolume,
    setVolumeWithIncrement,
    shuffle,
    shuffleTracks,
    toggleMute,
    togglePlay,
    toggleShuffle,
    volume,
  };
}
