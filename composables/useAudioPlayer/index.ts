export function useAudioPlayer() {
  const { getStreamUrl } = useAPI();
  const { resetQueueState } = useQueue();

  const audioPlayer = useState<InstanceType<typeof AudioPlayer> | null>(
    STATE_NAMES.playerAudioPlayer,
    () => null,
  );

  // Ready state.
  const trackIsBuffering = useState(STATE_NAMES.playerPlayLoading, () => false);

  // Audio time state.
  const currentTime = useState(STATE_NAMES.playerCurrentTime, () => 0);
  const bufferedDuration = useState(STATE_NAMES.playerBufferedLength, () => 0);
  const duration = useState(STATE_NAMES.playerDuration, () => 0);

  // Play/Pause state.
  const trackIsPlaying = useState(
    STATE_NAMES.playerTrackIsPlaying,
    () => false,
  );

  // Playback rate state.
  const playBackRate = useState(STATE_NAMES.playerPlaybackRate, () => 1);

  // Volume state.
  const volume = useState(STATE_NAMES.playerVolume, () => 1);
  const isMuted = computed(() => !volume.value);

  // Queue state.
  const queueList = useState<QueueTrack[]>(
    STATE_NAMES.playerQueueList,
    () => [],
  );
  const queueOriginal = useState(STATE_NAMES.playerQueueOriginal, () => '');
  const currentQueueIndex = useState(
    STATE_NAMES.playerCurrentQueueIndex,
    () => -1,
  );

  // Repeat/Shuffle state.
  const repeat = useState(STATE_NAMES.playerRepeat, () => -1);
  const shuffle = useState(STATE_NAMES.playerShuffle, () => false);

  const showMediaPlayer = computed(() => !!queueList.value.length);

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

  function isCurrentTrack(id: string) {
    return currentTrack.value.id === id;
  }

  // Play/Pause actions.
  async function playTrack() {
    await audioPlayer.value?.play();
    trackIsPlaying.value = true;
  }

  function pauseTrack() {
    trackIsPlaying.value = false;
    if (isRadioStation.value) {
      audioPlayer.value?.stop();
    } else {
      audioPlayer.value?.pause();
    }
  }

  async function togglePlay() {
    if (trackIsPlaying.value) {
      pauseTrack();
    } else {
      await playTrack();
    }
  }

  async function changeTrack(track: QueueTrack) {
    const url = getStreamUrl(track.streamUrlId!);
    audioPlayer.value?.load(url);
    await playTrack();
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
  }

  function resetQueueTracks() {
    const tempCurrentTrackId = currentTrack.value.id;
    queueList.value = [...JSON.parse(queueOriginal.value)];
    const index = getIndex(queueList.value, tempCurrentTrackId);
    currentQueueIndex.value = index;
  }

  function shuffleQueueTracks() {
    const queueClone = [...queueList.value];
    queueOriginal.value = JSON.stringify(queueClone);
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

  function setPlaybackRate(playbackRate: number) {
    playBackRate.value = playbackRate;
    audioPlayer.value?.changePlaybackRate(playbackRate);
  }

  // Queue actions.
  function clearQueueList() {
    audioPlayer.value?.unload();
    resetAudioStates();
    currentQueueIndex.value = -1;
    queueList.value = [];
    resetQueueState();
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

    if (index === -1) {
      return;
    }

    queueList.value.splice(index, 1);

    if (tempCurrentTrackId === id) {
      audioPlayer.value?.unload();
      currentQueueIndex.value -= 1;
      await playNextTrack();
    }
  }

  async function addTrackToQueue(tracks: QueueTrack) {
    queueList.value.push(tracks);

    if (queueList.value.length === 1) {
      await playNextTrack();
    }
  }

  function addTracksToQueue(tracks: QueueTrack[]) {
    queueList.value.push(...tracks);
  }

  async function playTracks(tracks: QueueTrack[], queueIndex = -1) {
    clearQueueList();
    addTracksToQueue(tracks);
    currentQueueIndex.value = queueIndex;
    await playNextTrack();
  }

  function resetAudioStates() {
    currentTime.value = 0;
    bufferedDuration.value = 0;
    duration.value = 0;
  }

  /* istanbul ignore next -- @preserve */
  function resetAudio() {
    pauseTrack();
    clearQueueList();
  }

  function setAudioPlayer() {
    audioPlayer.value = new AudioPlayer();

    // Audio actions.
    audioPlayer.value.onTimeupdate((newCurrentTime: number) => {
      currentTime.value = newCurrentTime;
    });

    audioPlayer.value.onCanPlay(() => {
      trackIsBuffering.value = true;
    });

    audioPlayer.value.onLoadedMetadata((newDuration: number) => {
      duration.value = newDuration;
    });

    audioPlayer.value.onBuffered((newBufferedDuration: number) => {
      bufferedDuration.value = newBufferedDuration;
    });

    audioPlayer.value.onWaiting(() => {
      trackIsBuffering.value = false;
    });

    audioPlayer.value.onEnded(async () => {
      switch (repeat.value) {
        case 1:
          replayCurrent();
          break;
        case Number.POSITIVE_INFINITY:
          if (isLastTrack.value) {
            // set to -1 as playNextTrack will + 1 to currentQueueIndex
            currentQueueIndex.value = -1;
          }

          await playNextTrack();
          break;
        default:
          if (isLastTrack.value) {
            currentQueueIndex.value = -1;
            await playNextTrack();
            pauseTrack();

            return;
          }

          await playNextTrack();
          break;
      }
    });
  }

  onMounted(() => {
    callOnce(() => {
      setAudioPlayer();
    });
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
    isCurrentTrack,
    isMuted,
    isPodcastEpisode,
    isRadioStation,
    isTrack,
    playBackRate,
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
    trackIsBuffering,
    trackIsPlaying,
    volume,
  };
}
