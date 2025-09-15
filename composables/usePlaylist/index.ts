export function usePlaylist() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const playlist = useState<null | Playlist>(STATE_NAMES.playlist, () => null);
  const playlists = useState<Playlist[]>(STATE_NAMES.playlists, () => []);

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

  async function getRandomTracks() {
    const { data: playlistData } = await fetchData('/getRandomSongs', {
      params: {
        size: RANDOM_SIZE,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => {
        const song = response.randomSongs.song || [];

        const playlistRes = {
          ...response.randomSongs,
          ...RANDOM_PLAYLIST,
          duration: getRandomTracksDuration(song),
          entry: song,
          songCount: song.length || 0,
        };

        return formatPlaylist(playlistRes);
      },
    });

    return playlistData;
  }

  async function getPlaylistTracks(id: string) {
    const { data: playlistData } = await fetchData('/getPlaylist', {
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        response?.playlist && formatPlaylist(response.playlist),
    });

    return playlistData;
  }

  async function getPlaylistTracksById(
    id = RANDOM_PLAYLIST.id,
    resetPlaylist = true,
  ) {
    if (resetPlaylist) {
      playlist.value = null;
    }

    if (id === RANDOM_PLAYLIST.id) {
      playlist.value = await getRandomTracks();
    } else {
      playlist.value = await getPlaylistTracks(id);
    }
  }

  async function addPlaylist(name: string) {
    const { data: playlistData } = await fetchData('/createPlaylist', {
      method: 'POST',
      params: {
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
    params: PlaylistParam,
    successMessage = 'Successfully updated playlist.',
    showMessage = true,
  ) {
    const { data: playlistData } = await fetchData('/updatePlaylist', {
      method: 'POST',
      params,
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
      params: {
        id,
      },
    });

    if (playlistData) {
      await getPlaylists();
      addSuccessSnack('Successfully deleted playlist.');
    }
  }

  async function addToPlaylist(
    params: PlaylistParam,
    fetchPlaylistTracks = true,
    showMessage = true,
  ) {
    await updatePlaylist(
      params,
      'Successfully added to playlist.',
      showMessage,
    );

    if (fetchPlaylistTracks) {
      await getPlaylistTracksById(params.playlistId, false);
    }
  }

  async function removeFromPlaylist(
    params: PlaylistParam,
    fetchPlaylistTracks = true,
  ) {
    await updatePlaylist(params, 'Successfully removed from playlist.');

    if (fetchPlaylistTracks) {
      await getPlaylistTracksById(params.playlistId, false);
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
        await getPlaylistTracksById(currentPlaylist.id, false);
        closeModal();
      },
      playlist: currentPlaylist,
    });
  }

  function addToPlaylistModal(trackId: string, index?: number) {
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
    getPlaylistTracksById,
    playlist,
    playlists,
    removeFromPlaylist,
    updatePlaylist,
    updatePlaylistModal,
  };
}
