export function useAudioPlayer() {
  const { getImageUrl, getStreamUrl } = useAPI();
  const { resetQueueState } = useQueue();
  const { addErrorSnack } = useSnack();
  const { scrobble } = useMediaLibrary();

  const audioPlayer = useState<InstanceType<typeof AudioPlayer> | null>(
    STATE_NAMES.playerAudioPlayer,
    () => AUDIO_PLAYER_DEFAULT_STATES.audioPlayer,
  );

  const saveInterval = useState<null | ReturnType<typeof setInterval>>(
    STATE_NAMES.playerInterval,
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

  const duration = useState(
    STATE_NAMES.playerDuration,
    () => AUDIO_PLAYER_DEFAULT_STATES.duration,
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

  const isMuted = computed(() => !volume.value);

  // Queue state.
  const queueList = useState<QueueTrack[]>(
    STATE_NAMES.playerQueueList,
    () => AUDIO_PLAYER_DEFAULT_STATES.queueList,
  );

  const originalQueueList = useState(
    STATE_NAMES.playerOriginalQueueList,
    () => AUDIO_PLAYER_DEFAULT_STATES.originalQueueList,
  );

  const currentQueueIndex = useState(
    STATE_NAMES.playerCurrentQueueIndex,
    () => AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex,
  );

  // Repeat/Shuffle state.
  const repeat = useState(
    STATE_NAMES.playerRepeat,
    () => AUDIO_PLAYER_DEFAULT_STATES.repeat,
  );

  const shuffle = useState(
    STATE_NAMES.playerShuffle,
    () => AUDIO_PLAYER_DEFAULT_STATES.shuffle,
  );

  const showMediaPlayer = computed(() => !!queueList.value.length);

  // Scrobble states.
  const trackHasScrobbled = useState(
    STATE_NAMES.playerTrackHasScrobbled,
    () => AUDIO_PLAYER_DEFAULT_STATES.trackHasScrobbled,
  );

  // Track states.
  const currentTrack = computed<QueueTrack>(
    () => queueList.value[currentQueueIndex.value] || ({} as QueueTrack),
  );

  const isLastTrack = computed(
    () => currentQueueIndex.value === queueList.value.length - 1,
  );

  const isTrack = computed(() => currentTrack.value.type === MEDIA_TYPE.track);

  const isPodcastEpisode = computed(
    () => currentTrack.value.type === MEDIA_TYPE.podcastEpisode,
  );

  const isRadioStation = computed(
    () => currentTrack.value.type === MEDIA_TYPE.radioStation,
  );

  // Save states.
  function setDefaultState() {
    bufferedDuration.value = AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration;
    currentQueueIndex.value = AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex;
    currentTime.value = AUDIO_PLAYER_DEFAULT_STATES.currentTime;
    duration.value = AUDIO_PLAYER_DEFAULT_STATES.duration;
    isBuffering.value = AUDIO_PLAYER_DEFAULT_STATES.isBuffering;
    isPlaying.value = false;
    originalQueueList.value = AUDIO_PLAYER_DEFAULT_STATES.originalQueueList;
    playbackRate.value = AUDIO_PLAYER_DEFAULT_STATES.playbackRate;
    queueList.value = AUDIO_PLAYER_DEFAULT_STATES.queueList;
    repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
    shuffle.value = AUDIO_PLAYER_DEFAULT_STATES.shuffle;
    volume.value = AUDIO_PLAYER_DEFAULT_STATES.volume;

    deleteLocalStorage(STATE_NAMES.playerState);
  }

  function setState() {
    const SAVED_STATE = getLocalStorage(STATE_NAMES.playerState);

    if (!SAVED_STATE) {
      return;
    }

    currentQueueIndex.value = SAVED_STATE.currentQueueIndex;
    duration.value = SAVED_STATE.duration;
    queueList.value = SAVED_STATE.queueList;
    originalQueueList.value = SAVED_STATE.originalQueueList;
    repeat.value = SAVED_STATE.repeat;
    shuffle.value = SAVED_STATE.shuffle;

    loadTrack(currentTrack.value);
    setVolume(SAVED_STATE.volume);
    setCurrentTime(SAVED_STATE.currentTime);
    setPlaybackRate(SAVED_STATE.playbackRate);
  }

  function saveState() {
    const STATE_TO_SAVE = {
      currentQueueIndex: currentQueueIndex.value,
      currentTime: currentTime.value,
      duration: duration.value,
      originalQueueList: originalQueueList.value,
      playbackRate: playbackRate.value,
      queueList: queueList.value,
      repeat: repeat.value,
      shuffle: shuffle.value,
      volume: volume.value,
    };

    setLocalStorage(STATE_NAMES.playerState, STATE_TO_SAVE);
  }

  /* istanbul ignore next -- @preserve */
  function saveStateInterval() {
    saveState();

    if (
      isTrack.value &&
      !trackHasScrobbled.value &&
      currentTime.value / duration.value > 0.8
    ) {
      scrobble(currentTrack.value.id);
      trackHasScrobbled.value = true;
    }
  }

  function clearSaveInterval() {
    clearInterval(saveInterval.value!);
  }

  function setSaveInterval() {
    clearSaveInterval();
    saveInterval.value = setInterval(saveStateInterval, 2000);
  }

  function isCurrentTrack(id: string) {
    return currentTrack.value.id === id;
  }

  // Media meta data for browsers.
  function setMediaSessionPlaybackState(state: MediaSession['playbackState']) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }

  function setMediaSessionPositionState() {
    if (
      !('setPositionState' in navigator.mediaSession && !isRadioStation.value)
    ) {
      return;
    }

    navigator.mediaSession.setPositionState({
      duration: duration.value,
      playbackRate: playbackRate.value,
      position: currentTime.value,
    });
  }

  function setMediaMetadata() {
    if (!('mediaSession' in navigator && currentTrack.value)) {
      return;
    }

    let mediaData = {};

    if (isTrack.value) {
      mediaData = {
        album: (currentTrack.value as Track).album,
        artist: (currentTrack.value as Track).artists
          .map((artist) => artist.name)
          .join(', '),
      };
    }

    if (isPodcastEpisode.value) {
      mediaData = {
        album: (currentTrack.value as PodcastEpisode).podcastName,
        artist: (currentTrack.value as PodcastEpisode).author,
      };
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      artwork: ['96', '128', '192', '256', '384', '512'].map((size) => ({
        sizes: `${size}x${size}`,
        src: getImageUrl(currentTrack.value.image, size),
        type: 'image/jpeg',
      })),
      title: currentTrack.value.name,
      ...mediaData,
    });

    /* istanbul ignore next -- @preserve */
    async function handleMediaSessionActionDetails(
      details: Parameters<
        NonNullable<Parameters<MediaSession['setActionHandler']>['1']>
      >['0'],
    ) {
      switch (details.action) {
        case MEDIA_SESSION_ACTION_DETAILS.nextTrack:
          await playNextTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.pause:
          pauseTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.play:
          await playTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.previousTrack:
          await playPreviousTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.seekBackward:
          rewindTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.seekForward:
          fastForwardTrack();
          break;
        case MEDIA_SESSION_ACTION_DETAILS.seekTo:
          setCurrentTime(details.seekTime!);
          break;
      }
    }

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.pause,
      handleMediaSessionActionDetails,
    );

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.play,
      handleMediaSessionActionDetails,
    );

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.seekTo,
      handleMediaSessionActionDetails,
    );

    const nextTrackHandler = hasNextTrack.value
      ? handleMediaSessionActionDetails
      : null;

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.nextTrack,
      nextTrackHandler,
    );

    const previousTrackHandler = hasPreviousTrack.value
      ? handleMediaSessionActionDetails
      : null;

    navigator.mediaSession.setActionHandler(
      MEDIA_SESSION_ACTION_DETAILS.previousTrack,
      previousTrackHandler,
    );

    const podcastEpisodeHandler = isPodcastEpisode.value
      ? handleMediaSessionActionDetails
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

  // Play/Pause actions.
  async function playTrack() {
    try {
      await audioPlayer.value?.play();
      isPlaying.value = true;
      setSaveInterval();
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
          `The track ${currentTrack.value.name} was not found on the server and removed from queue.`,
        );

        removeTrackFromQueueList(currentTrack.value.id);
      }
    }
  }

  function pauseTrack() {
    isPlaying.value = false;
    audioPlayer.value?.pause();
    clearSaveInterval();
    setMediaSessionPlaybackState('paused');
  }

  async function togglePlay() {
    if (isPlaying.value) {
      pauseTrack();
    } else {
      await playTrack();
    }
  }

  function loadTrack(track: QueueTrack) {
    const url = getStreamUrl(track.streamUrlId!);
    audioPlayer.value?.load(url);
    setMediaMetadata();
  }

  async function changeTrack(track: QueueTrack) {
    trackHasScrobbled.value = false;

    loadTrack(track);
    await playTrack();

    if (isPodcastEpisode.value) {
      setPlaybackRate(playbackRate.value);
    }

    saveState();
  }

  // Next/previous state.
  const hasNextTrack = computed(() => {
    return (
      repeat.value === Number.POSITIVE_INFINITY ||
      currentQueueIndex.value < queueList.value.length - 1
    );
  });

  const hasPreviousTrack = computed(() => {
    return (
      repeat.value === Number.POSITIVE_INFINITY || currentQueueIndex.value > 0
    );
  });

  // Next/previous actions.
  async function playNextTrack() {
    resetAudioStates();

    currentQueueIndex.value = isLastTrack.value
      ? 0
      : currentQueueIndex.value + 1;

    const track = queueList.value[currentQueueIndex.value];

    await changeTrack(track);
  }

  async function playPreviousTrack() {
    resetAudioStates();

    currentQueueIndex.value =
      currentQueueIndex.value === 0
        ? queueList.value.length - 1
        : currentQueueIndex.value - 1;

    const track = queueList.value[currentQueueIndex.value];
    await changeTrack(track);
  }

  async function playCurrentTrack(track: QueueTrack) {
    currentQueueIndex.value = getIndex(queueList.value, track.id);
    await changeTrack(track);
  }

  // Audio time actions.
  function setCurrentTime(time: number) {
    audioPlayer.value?.setCurrentTime(time);
    saveState();
  }

  function rewindTrack() {
    if (currentTime.value <= REWIND_TRACK_TIME) {
      return;
    }

    setCurrentTime(currentTime.value - REWIND_TRACK_TIME);
  }

  function fastForwardTrack() {
    if (currentTime.value >= duration.value - FAST_FORWARD_TRACK_TIME) {
      return;
    }

    setCurrentTime(currentTime.value + FAST_FORWARD_TRACK_TIME);
  }

  // Repeat/Shuffle actions.
  function setRepeat() {
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

    saveState();
  }

  async function replayCurrent() {
    resetAudioStates();
    await changeTrack(currentTrack.value);
  }

  function toggleShuffle() {
    shuffle.value = !shuffle.value;

    if (shuffle.value) {
      shuffleQueueTracks();
    } else {
      resetQueueTracks();
    }

    saveState();
  }

  function resetQueueTracks() {
    const tempCurrentTrackId = currentTrack.value.id;
    queueList.value = [...JSON.parse(originalQueueList.value)];
    originalQueueList.value = AUDIO_PLAYER_DEFAULT_STATES.originalQueueList;
    const index = getIndex(queueList.value, tempCurrentTrackId);
    currentQueueIndex.value = index;
  }

  function shuffleQueueTracks() {
    const queueClone = [...queueList.value];
    originalQueueList.value = JSON.stringify(queueClone);
    const index = getIndex(queueList.value, currentTrack.value.id);
    queueList.value = shuffleArray(queueClone, index);
    currentQueueIndex.value = 0;
  }

  async function shuffleTracks(tracks: QueueTrack[]) {
    const queueIndex = Math.floor(Math.random() * tracks.length) - 1;
    playTracks(tracks, queueIndex);
    toggleShuffle();
  }

  // Volume actions.
  function setVolume(newVolume: number) {
    audioPlayer.value?.setVolume(newVolume);
    volume.value = newVolume;
    saveState();
  }

  function unmuteVolume(previousVolume: number) {
    const newVolume = previousVolume > 0 ? previousVolume : 0.1;
    setVolume(newVolume);
  }

  function toggleVolume(previousVolume: number) {
    if (isMuted.value) {
      unmuteVolume(previousVolume);
    } else {
      setVolume(0);
    }
  }

  function setPlaybackRate(newPlaybackRate: number) {
    playbackRate.value = newPlaybackRate;
    audioPlayer.value?.changePlaybackRate(newPlaybackRate);
    saveState();
  }

  // Queue actions.
  function clearQueueList() {
    audioPlayer.value?.unload();
    resetAudioStates();
    queueList.value = [];
    currentQueueIndex.value = AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex;
    shuffle.value = AUDIO_PLAYER_DEFAULT_STATES.shuffle;
    repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
    resetQueueState();
    saveState();
  }

  async function playTrackFromQueueList(index: number) {
    currentQueueIndex.value = index - 1;
    await playNextTrack();
  }

  async function removeTrackFromQueueList(id: string) {
    const tempCurrentTrackId = currentTrack.value.id;

    if (queueList.value.length === 1) {
      clearQueueList();
      return;
    }

    const index = getIndex(queueList.value, id);

    // If index not found.
    if (index === -1) {
      return;
    }

    if (index < currentQueueIndex.value || isLastTrack.value) {
      currentQueueIndex.value -= 1;
    }

    queueList.value.splice(index, 1);

    // Check if the selected track was the current playing track.
    if (tempCurrentTrackId === id) {
      audioPlayer.value?.unload();
      currentQueueIndex.value -= 1;
      await playNextTrack();
    }

    saveState();
  }

  function addTracksToQueueList(tracks: QueueTrack[]) {
    queueList.value.push(...tracks);
  }

  async function addTracksToQueue(tracks: QueueTrack[]) {
    const tempQueueLength = queueList.value.length;

    addTracksToQueueList(tracks);

    if (!tempQueueLength) {
      await playNextTrack();
      pauseTrack();
    }

    saveState();
  }

  async function addTrackToQueue(track: QueueTrack) {
    await addTracksToQueue([track]);
  }

  async function playTracks(
    tracks: QueueTrack[],
    queueIndex = AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex,
  ) {
    clearQueueList();
    addTracksToQueueList(tracks);
    currentQueueIndex.value = queueIndex;
    await playNextTrack();
  }

  function resetAudioStates() {
    currentTime.value = AUDIO_PLAYER_DEFAULT_STATES.currentTime;
    bufferedDuration.value = AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration;
    duration.value = AUDIO_PLAYER_DEFAULT_STATES.duration;
  }

  /* istanbul ignore next -- @preserve */
  function resetAudio() {
    audioPlayer.value?.unload();
    setDefaultState();
  }

  function setAudioPlayer() {
    audioPlayer.value = new AudioPlayer();

    // Audio actions.
    audioPlayer.value.onTimeupdate((newCurrentTime: number) => {
      currentTime.value = newCurrentTime;
      setMediaSessionPositionState();
    });

    audioPlayer.value.onCanPlay(() => {
      isBuffering.value = false;
    });

    audioPlayer.value.onLoadedMetadata((newDuration: number) => {
      const durationToNumber = Number(newDuration);
      duration.value = Number.isFinite(durationToNumber) ? durationToNumber : 0;
      setMediaSessionPositionState();
    });

    audioPlayer.value.onBuffered((newBufferedDuration: number) => {
      bufferedDuration.value = newBufferedDuration;
    });

    audioPlayer.value.onWaiting(() => {
      isBuffering.value = true;
    });

    audioPlayer.value.onEnded(async () => {
      switch (repeat.value) {
        case 1:
          replayCurrent();
          break;
        case Number.POSITIVE_INFINITY:
          if (isLastTrack.value) {
            // set to -1 as playNextTrack will + 1 to currentQueueIndex
            currentQueueIndex.value =
              AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex;
          }

          await playNextTrack();
          break;
        default:
          if (isLastTrack.value) {
            currentQueueIndex.value =
              AUDIO_PLAYER_DEFAULT_STATES.currentQueueIndex;
            await playNextTrack();
            pauseTrack();

            return;
          }

          await playNextTrack();
          break;
      }
    });
  }

  function updateQueueTrackFavourite(id: string, isFavourite: boolean) {
    const track = queueList.value.find((track) => track.id === id) as Track;

    if (track) {
      track.favourite = isFavourite;
      saveState();
    }
  }

  onMounted(() => {
    callOnce(() => {
      setAudioPlayer();
      setState();
    });
  });

  /* istanbul ignore next -- @preserve */
  onBeforeUnmount(() => {
    if (!isPlaying.value) {
      clearSaveInterval();
    }
  });

  return {
    addTracksToQueue,
    addTrackToQueue,
    bufferedDuration,
    clearQueueList,
    currentTime,
    currentTrack,
    duration,
    fastForwardTrack,
    hasNextTrack,
    hasPreviousTrack,
    isBuffering,
    isCurrentTrack,
    isMuted,
    isPlaying,
    isPodcastEpisode,
    isRadioStation,
    isTrack,
    playbackRate,
    playCurrentTrack,
    playNextTrack,
    playPreviousTrack,
    playTrackFromQueueList,
    playTracks,
    queueList,
    removeTrackFromQueueList,
    repeat,
    resetAudio,
    rewindTrack,
    setCurrentTime,
    setPlaybackRate,
    setRepeat,
    setVolume,
    showMediaPlayer,
    shuffle,
    shuffleTracks,
    togglePlay,
    toggleShuffle,
    toggleVolume,
    updateQueueTrackFavourite,
    volume,
  };
}
