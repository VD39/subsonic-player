export function useAudioPlayer() {
  const { getStreamUrl } = useAPI();

  const audioPlayer = useState<null | InstanceType<typeof AudioPlayer>>(
    'audio-player',
    () => null,
  );

  // Ready state.
  const trackCanPlay = useState('player-play-loading', () => false);

  // Audio time state.
  const currentTime = useState('player-current-time', () => 0);
  const bufferedDuration = useState('player-buffered-length', () => 0);
  const duration = useState('player-duration', () => 0);

  // Play/Pause state.
  const trackIsPlaying = useState('player-is-playing', () => false);

  // Playback rate state.
  const playBackRate = useState('player-playback-rate', () => 1);

  // Volume state.
  const volume = useState('player-volume', () => 1);
  const isMuted = computed(() => !volume.value);

  // Queue state.
  const queueList = useState<QueueTrack[]>('player-queue-list', () => []);
  const queueOriginal = useState('player-queue-original', () => '');
  const currentQueueIndex = useState('player-current-queue-index', () => -1);

  // Repeat/Shuffle state.
  const repeat = useState('player-repeat', () => -1);
  const shuffle = useState('player-shuffle', () => false);

  const showMediaPlayer = computed(() => !!queueList.value.length);

  // Track states.
  const currentTrack = computed<QueueTrack>(
    () => queueList.value[currentQueueIndex.value] || ({} as QueueTrack),
  );

  const isLastTrack = computed(
    () => currentQueueIndex.value === queueList.value.length - 1,
  );

  const isTrack = computed(() => currentTrack.value.type === 'track');

  const isPodcast = computed(
    () => currentTrack.value.type === 'podcastEpisode',
  );

  const isRadioStation = computed(
    () => currentTrack.value.type === 'radioStation',
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
    audioPlayer.value?.pause();
  }

  async function togglePlay() {
    if (trackIsPlaying.value) {
      pauseTrack();
    } else {
      await playTrack();
    }
  }

  async function changeTrack(track: QueueTrack) {
    const url = getStreamUrl(track.streamUrl!);
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

  function setAudioPlayer() {
    audioPlayer.value = new AudioPlayer();

    // Audio actions.
    audioPlayer.value.onTimeupdate((newCurrentTime: number) => {
      currentTime.value = newCurrentTime;
    });

    audioPlayer.value.onCanPlay(() => {
      trackCanPlay.value = true;
    });

    audioPlayer.value.onLoadedMetadata((newDuration: number) => {
      duration.value = newDuration;
    });

    audioPlayer.value.onBuffered((newBufferedDuration: number) => {
      bufferedDuration.value = newBufferedDuration;
    });

    audioPlayer.value.onWaiting(() => {
      trackCanPlay.value = false;
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
    isPodcast,
    isRadioStation,
    isTrack,
    playBackRate,
    playCurrentTrack,
    playNextTrack,
    playPreviousTrack,
    playTracks,
    queueList,
    removeTrackFromQueueList,
    repeat,
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
    trackCanPlay,
    trackIsPlaying,
    volume,
  };
}
