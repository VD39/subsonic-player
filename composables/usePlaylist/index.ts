export function usePlaylist() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const playlist = useState<null | Playlist>(STATE_KEYS.playlist, () => null);
  const playlists = useState<Playlist[]>(STATE_KEYS.playlists, () => []);

  function resetPlaylists() {
    playlist.value = null;
    playlists.value = [];
  }

  async function getPlaylists() {
    const { data: playlistsData } = await fetchData('/getPlaylists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.playlists.playlist || []).map(formatPlaylist),
    });

    if (Array.isArray(playlistsData)) {
      playlistsData.unshift(RANDOM_PLAYLIST as unknown as Playlist);

      playlists.value = playlistsData;
    }
  }

  async function fetchRandomPlaylist() {
    const { data: playlistData } = await fetchData('/getRandomSongs', {
      query: {
        size: RANDOM_SIZE,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => {
        const song = response.randomSongs.song || [];

        const playlistRes = {
          ...response.randomSongs,
          ...RANDOM_PLAYLIST,
          duration: getTotalTracksDuration(song),
          entry: song,
          songCount: song.length || 0,
        };

        return formatPlaylist(playlistRes);
      },
    });

    return playlistData;
  }

  async function fetchPlaylist(id: string) {
    const { data: playlistData } = await fetchData('/getPlaylist', {
      query: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        response?.playlist && formatPlaylist(response.playlist),
    });

    return playlistData;
  }

  async function loadPlaylistTracksById(
    id = RANDOM_PLAYLIST.id,
    resetPlaylist = true,
  ) {
    if (resetPlaylist) {
      playlist.value = null;
    }

    if (id === RANDOM_PLAYLIST.id) {
      playlist.value = await fetchRandomPlaylist();
    } else {
      playlist.value = await fetchPlaylist(id);
    }
  }

  async function addPlaylist(name: string) {
    const { data: playlistData } = await fetchData('/createPlaylist', {
      method: 'POST',
      query: {
        name,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlaylist(response.playlist),
    });

    if (playlistData) {
      await getPlaylists();
      addSuccessSnack(`Successfully added playlist ${name}.`);
      return playlistData;
    }
  }

  async function updatePlaylist(
    query: PlaylistParam,
    successMessage = 'Successfully updated playlist.',
    showMessage = true,
  ) {
    const { data: playlistData } = await fetchData('/updatePlaylist', {
      method: 'POST',
      query,
    });

    if (playlistData) {
      await getPlaylists();

      if (showMessage) {
        addSuccessSnack(successMessage);
      }
    }
  }

  async function deletePlaylist(id: string) {
    const { data: playlistData } = await fetchData('/deletePlaylist', {
      query: {
        id,
      },
    });

    if (playlistData) {
      await getPlaylists();
      addSuccessSnack('Successfully deleted playlist.');
    }
  }

  async function addToPlaylist(
    query: PlaylistParam,
    fetchPlaylistTracks = true,
    showMessage = true,
  ) {
    await updatePlaylist(query, 'Successfully added to playlist.', showMessage);

    if (fetchPlaylistTracks) {
      await loadPlaylistTracksById(query.playlistId, false);
    }
  }

  async function removeFromPlaylist(
    query: PlaylistParam,
    fetchPlaylistTracks = true,
  ) {
    await updatePlaylist(query, 'Successfully removed from playlist.');

    if (fetchPlaylistTracks) {
      await loadPlaylistTracksById(query.playlistId, false);
    }
  }

  /* istanbul ignore next -- @preserve */
  function addPlaylistModal() {
    openModal(MODAL_TYPE.addPlaylistModal, {
      /* istanbul ignore next -- @preserve */
      async onSubmit(playlistName: string) {
        await addPlaylist(playlistName);
        closeModal();
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  function updatePlaylistModal(currentPlaylist: Playlist) {
    openModal(MODAL_TYPE.updatePlaylistModal, {
      /* istanbul ignore next -- @preserve */
      async onSubmit(newPlaylistName: string) {
        await updatePlaylist({
          ...currentPlaylist,
          name: newPlaylistName,
          playlistId: currentPlaylist.id,
        });
        await loadPlaylistTracksById(currentPlaylist.id, false);
        closeModal();
      },
      playlist: currentPlaylist,
    });
  }

  function addToPlaylistModal(trackId: string | string[], index?: number) {
    const loading = ref(false);
    const newlyCreatedPlaylistId = ref<null | string>(null);

    openModal(MODAL_TYPE.addToPlaylistModal, {
      loading,
      newlyCreatedPlaylistId,
      async onAddToPlaylist(playlistId: string) {
        loading.value = true;
        newlyCreatedPlaylistId.value = null;

        // Update playlist only if on the playlist page.
        const isMatchingPlaylist = playlist.value?.id === playlistId;

        await addToPlaylist(
          {
            playlistId,
            songIdToAdd: trackId,
          },
          isMatchingPlaylist,
        );

        loading.value = false;
      },
      async onRemoveFromPlaylist(playlistId: string) {
        loading.value = true;
        newlyCreatedPlaylistId.value = null;

        const foundPlaylist = playlists.value.find(
          (playlist) => playlist.id === playlistId,
        );

        if (foundPlaylist) {
          // Update playlist only if on the playlist page.
          const isMatchingPlaylist = playlist.value?.id === playlistId;

          const songIndexToRemove = isMatchingPlaylist
            ? index
            : foundPlaylist.trackCount - 1;

          await removeFromPlaylist(
            {
              playlistId,
              songIndexToRemove,
            },
            isMatchingPlaylist,
          );
        }

        loading.value = false;
      },
      async onSubmit(playlistName: string) {
        loading.value = true;

        const playlistResponse = await addPlaylist(playlistName);

        if (playlistResponse?.id) {
          await addToPlaylist(
            {
              playlistId: playlistResponse.id,
              songIdToAdd: trackId,
            },
            false,
          );

          newlyCreatedPlaylistId.value = playlistResponse.id;
        }

        loading.value = false;
      },
      playlists,
    });
  }

  return {
    addPlaylist,
    addPlaylistModal,
    addToPlaylist,
    addToPlaylistModal,
    deletePlaylist,
    getPlaylists,
    loadPlaylistTracksById,
    playlist,
    playlists,
    removeFromPlaylist,
    resetPlaylists,
    updatePlaylist,
    updatePlaylistModal,
  };
}
