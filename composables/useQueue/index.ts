export function useQueue() {
  const config = useRuntimeConfig();
  const { ENABLE_QUEUE_SYNC } = config.public;

  const { fetchData } = useAPI();
  const { lockScroll, unlockScroll } = useScrollLock('queue');
  const { bookmarks, getBookmarkPosition, getBookmarks } = useBookmark();

  const isQueueListOpened = useState(STATE_KEYS.queueListOpened, () => false);

  const isQueuePlayerOpened = useState(
    STATE_KEYS.queuePlayerOpened,
    () => false,
  );

  const queueStateRestored = useState(
    STATE_KEYS.queueStateRestored,
    () => false,
  );

  const queueList = useState<PlayableTrack[]>(
    STATE_KEYS.playerQueueList,
    () => [...QUEUE_DEFAULT_STATES.queueList],
  );

  const originalQueueSnapshot = useState(
    STATE_KEYS.playerOriginalQueueList,
    () => QUEUE_DEFAULT_STATES.originalQueueSnapshot,
  );

  const currentQueueIndex = useState(
    STATE_KEYS.playerCurrentQueueIndex,
    () => QUEUE_DEFAULT_STATES.currentQueueIndex,
  );

  const currentTrack = computed<PlayableTrack>(
    () => queueList.value[currentQueueIndex.value] || ({} as PlayableTrack),
  );

  const hasCurrentTrack = computed(
    () => !!Object.keys(currentTrack.value).length,
  );

  const isLastTrack = computed(
    () => currentQueueIndex.value === queueList.value.length - 1,
  );

  const hasNextTrack = computed(
    () => currentQueueIndex.value < queueList.value.length - 1,
  );

  const hasPreviousTrack = computed(() => currentQueueIndex.value > 0);

  const hasQueueTracks = computed(() => !!queueList.value.length);

  const isPodcastEpisode = computed(
    () => currentTrack.value.type === MEDIA_TYPE.podcastEpisode,
  );

  const isRadioStation = computed(
    () => currentTrack.value.type === MEDIA_TYPE.radioStation,
  );

  const isTrack = computed(() => currentTrack.value.type === MEDIA_TYPE.track);

  function addTracks(tracks: PlayableTrack[], clearExisting = false) {
    if (clearExisting) {
      clearQueue();
    }

    const hadTracksBeforeAdd = !!queueList.value.length;

    queueList.value.push(...tracks);
    saveQueueState();

    return hadTracksBeforeAdd;
  }

  function clearQueue() {
    queueList.value = [...QUEUE_DEFAULT_STATES.queueList];
    currentQueueIndex.value = QUEUE_DEFAULT_STATES.currentQueueIndex;
    originalQueueSnapshot.value = QUEUE_DEFAULT_STATES.originalQueueSnapshot;
  }

  async function clearServerQueue() {
    await fetchData('/savePlayQueue', {
      method: 'POST',
    });
  }

  function closeQueuePanels() {
    isQueueListOpened.value = false;
    isQueuePlayerOpened.value = false;

    unlockScroll();
  }

  function getQueueIndexById(id: string) {
    return queueList.value.findIndex((item) => item.id === id);
  }

  function isCurrentTrack(id: string) {
    return currentTrack.value.id === id;
  }

  function navigateQueue(target: 'next' | 'previous' | number) {
    switch (target) {
      case 'next':
        currentQueueIndex.value = isLastTrack.value
          ? 0
          : currentQueueIndex.value + 1;
        break;
      case 'previous':
        currentQueueIndex.value =
          currentQueueIndex.value === 0
            ? queueList.value.length - 1
            : currentQueueIndex.value - 1;
        break;
      default:
        currentQueueIndex.value = target;
        break;
    }

    saveQueueState();

    return currentTrack.value;
  }

  function removeTrack(id: string) {
    const isCurrentTrackRemoved = isCurrentTrack(id);

    if (queueList.value.length === 1) {
      resetQueue();

      return 1;
    }

    const index = getQueueIndexById(id);

    if (index === -1) {
      return false;
    }

    if (index < currentQueueIndex.value || isLastTrack.value) {
      currentQueueIndex.value -= 1;
    }

    queueList.value.splice(index, 1);
    saveQueueState();

    return isCurrentTrackRemoved;
  }

  function reorderQueueTracks(fromIndex: number, toIndex: number) {
    if (
      fromIndex < 0 ||
      fromIndex >= queueList.value.length ||
      toIndex < 0 ||
      toIndex >= queueList.value.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const [movedTrack] = queueList.value.splice(fromIndex, 1);
    queueList.value.splice(toIndex, 0, movedTrack);

    if (currentQueueIndex.value === fromIndex) {
      currentQueueIndex.value = toIndex;
    } else if (
      fromIndex < currentQueueIndex.value &&
      toIndex >= currentQueueIndex.value
    ) {
      currentQueueIndex.value -= 1;
    } else if (
      fromIndex > currentQueueIndex.value &&
      toIndex <= currentQueueIndex.value
    ) {
      currentQueueIndex.value += 1;
    }

    saveQueueState();
  }

  function resetQueue(syncServer = true) {
    clearQueue();
    deleteLocalStorage(LOCAL_STORAGE_KEYS.queue);
    closeQueuePanels();
    queueStateRestored.value = false;

    if (syncServer) {
      syncToServer();
    }
  }

  function unshuffleQueue() {
    const SAVED_STATE = getLocalStorage(LOCAL_STORAGE_KEYS.queue);
    const snapshot =
      originalQueueSnapshot.value || SAVED_STATE?.originalQueueSnapshot;

    if (!snapshot) {
      return;
    }

    const currentTrackIdBeforeRestore = currentTrack.value.id;
    queueList.value = pruneOriginalQueue(
      [...queueList.value],
      [...JSON.parse(snapshot)],
    );

    originalQueueSnapshot.value = QUEUE_DEFAULT_STATES.originalQueueSnapshot;
    const index = getQueueIndexById(currentTrackIdBeforeRestore);
    currentQueueIndex.value = index;
    saveQueueState();
  }

  function restoreQueueStateFromLocal() {
    if (ENABLE_QUEUE_SYNC || queueStateRestored.value) {
      return;
    }

    const SAVED_STATE = getLocalStorage(LOCAL_STORAGE_KEYS.queue);

    if (!SAVED_STATE) {
      clearQueue();

      return;
    }

    currentQueueIndex.value = SAVED_STATE.currentQueueIndex;
    originalQueueSnapshot.value = SAVED_STATE.originalQueueSnapshot;
    queueList.value = SAVED_STATE.queueList;

    queueStateRestored.value = true;
  }

  async function restoreQueueStateFromServer() {
    if (!ENABLE_QUEUE_SYNC || queueStateRestored.value) {
      return;
    }

    queueStateRestored.value = true;

    const { data: playQueueData } = await fetchData('/getPlayQueue', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlayQueue(response.playQueue),
    });

    if (!playQueueData?.tracks.length) {
      return;
    }

    queueList.value = playQueueData.tracks;

    currentQueueIndex.value = 0;

    if (playQueueData.current) {
      const foundIndex = playQueueData.tracks.findIndex(
        (track) => track.id === String(playQueueData.current),
      );

      currentQueueIndex.value = foundIndex === -1 ? 0 : foundIndex;
    }

    if (playQueueData.position) {
      queueList.value[currentQueueIndex.value].position = Math.floor(
        playQueueData.position / 1000,
      );
    }
  }

  function restoreLocalState() {
    const SAVED_STATE = getLocalStorage(LOCAL_STORAGE_KEYS.queue);

    if (!SAVED_STATE) {
      return;
    }

    if (SAVED_STATE.queueList) {
      for (const track of queueList.value) {
        const savedTrack = SAVED_STATE.queueList.find(
          (saved: PlayableTrack) => saved.id === track.id,
        );

        if (savedTrack?.position) {
          track.position = savedTrack.position;
        }
      }
    }

    originalQueueSnapshot.value = SAVED_STATE.originalQueueSnapshot;
  }

  async function enrichTracksWithPositions(tracks: PlayableTrack[]) {
    const podcastTracks = tracks.filter(
      (track) => track.type === MEDIA_TYPE.podcastEpisode,
    );

    if (!podcastTracks.length) {
      return;
    }

    if (!bookmarks.value.length) {
      await getBookmarks();
    }

    for (const track of podcastTracks) {
      const queuePosition = queueList.value
        .filter((playableTrack) => playableTrack.id === track.id)
        .reduce(
          (max, playableTrack) => Math.max(max, playableTrack.position || 0),
          0,
        );

      if (queuePosition > 0) {
        // Use queue position as it is more recent.
        track.position = queuePosition;
      } else {
        // Fall back to server bookmark.
        const bookmarkPosition = getBookmarkPosition(track.id);

        if (bookmarkPosition) {
          track.position = bookmarkPosition;
        }
      }
    }
  }

  async function mergeBookmarksToCurrentQueue() {
    await enrichTracksWithPositions(queueList.value);
    saveQueueState();
  }

  function saveQueueState() {
    const STATE_TO_SAVE = {
      currentQueueIndex: currentQueueIndex.value,
      originalQueueSnapshot: originalQueueSnapshot.value,
      queueList: queueList.value,
    };

    setLocalStorage(LOCAL_STORAGE_KEYS.queue, STATE_TO_SAVE);
    syncToServer();
  }

  function shuffleQueue() {
    const queueClone = [...queueList.value];
    originalQueueSnapshot.value = JSON.stringify(queueClone);
    const index = getQueueIndexById(currentTrack.value.id);
    queueList.value = shuffleTrackInQueue(queueClone, index);
    currentQueueIndex.value = 0;
    saveQueueState();
  }

  function syncScrollLock() {
    if (isQueueListOpened.value || isQueuePlayerOpened.value) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  async function syncToServer() {
    if (!ENABLE_QUEUE_SYNC || isRadioStation.value) {
      return;
    }

    if (!queueList.value.length) {
      clearServerQueue();

      return;
    }

    const ids = queueList.value
      .filter((track) => track.type !== MEDIA_TYPE.radioStation)
      .map((track) => track.id);

    if (!ids.length) {
      clearServerQueue();

      return;
    }

    const current =
      currentTrack.value.type === MEDIA_TYPE.radioStation
        ? undefined
        : currentTrack.value.id;

    await fetchData('/savePlayQueue', {
      method: 'POST',
      query: {
        current,
        id: ids,
        position: Math.floor((currentTrack.value.position || 0.1) * 1000), // Save at least 0.1 millisecond.
      },
    });
  }

  function toggleQueueList() {
    isQueueListOpened.value = !isQueueListOpened.value;
    syncScrollLock();
  }

  function toggleQueuePlayer() {
    isQueuePlayerOpened.value = !isQueuePlayerOpened.value;
    syncScrollLock();
  }

  function updateCurrentTrackPosition(position: number) {
    const trackId = queueList.value[currentQueueIndex.value]?.id;

    if (!trackId) {
      return;
    }

    for (const track of queueList.value) {
      if (track.id === trackId) {
        track.position = position;
      }
    }

    saveQueueState();
  }

  function updateTrackFavourite(id: string, isFavourite: boolean) {
    const track = queueList.value.find((track) => track.id === id) as Track;

    if (track) {
      track.favourite = isFavourite;
      saveQueueState();
    }
  }

  return {
    addTracks,
    closeQueuePanels,
    currentQueueIndex,
    currentTrack,
    enrichTracksWithPositions,
    hasCurrentTrack,
    hasNextTrack,
    hasPreviousTrack,
    hasQueueTracks,
    isCurrentTrack,
    isLastTrack,
    isPodcastEpisode,
    isQueueListOpened,
    isQueuePlayerOpened,
    isRadioStation,
    isTrack,
    mergeBookmarksToCurrentQueue,
    navigateQueue,
    originalQueueSnapshot,
    queueList,
    removeTrack,
    reorderQueueTracks,
    resetQueue,
    restoreLocalState,
    restoreQueueStateFromLocal,
    restoreQueueStateFromServer,
    shuffleQueue,
    toggleQueueList,
    toggleQueuePlayer,
    unshuffleQueue,
    updateCurrentTrackPosition,
    updateTrackFavourite,
  };
}
