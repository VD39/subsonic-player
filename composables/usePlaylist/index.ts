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

  async function getPlaylistTracksById(id = 'random', resetPlaylist = true) {
    if (resetPlaylist) {
      playlist.value = null;
    }

    if (id === 'random') {
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
      addSuccessSnack(`Successfully added playlist ${playlistData.name}.`);
      return playlistData;
    }
  }

  async function updatePlaylist(
    params: PlaylistParam,
    successMessage = 'Successfully updated playlist.',
  ) {
    const { data: playlistData } = await fetchData('/updatePlaylist', {
      method: 'POST',
      params,
    });

    if (playlistData) {
      addSuccessSnack(successMessage);
      await getPlaylists();
    }
  }

  async function deletePlaylist(id: string) {
    const { data: playlistData } = await fetchData('/deletePlaylist', {
      params: {
        id,
      },
    });

    if (playlistData) {
      addSuccessSnack('Successfully deleted playlist.');
      await getPlaylists();
    }
  }

  /* istanbul ignore next -- @preserve */
  async function addToPlaylist(params: PlaylistParam) {
    await updatePlaylist(params, 'Successfully added to playlist.');
  }

  /* istanbul ignore next -- @preserve */
  async function removeFromPlaylist(params: PlaylistParam) {
    await updatePlaylist(params, 'Successfully removed from playlist.');
    await getPlaylistTracksById(params.playlistId, false);
  }

  /* istanbul ignore next -- @preserve */
  function addPlaylistModal() {
    openModal(MODAL_TYPE.addPlaylistModal, {
      /* istanbul ignore next -- @preserve */
      async onSubmit(playlistName: string) {
        await addPlaylist(playlistName);
        await getPlaylists();
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
        await getPlaylistTracksById(currentPlaylist.id);
        closeModal();
      },
      playlist: currentPlaylist,
    });
  }

  /* istanbul ignore next -- @preserve */
  function addToPlaylistModal(trackId: string) {
    const loading = ref(false);

    openModal(MODAL_TYPE.addToPlaylistModal, {
      loading,
      /* istanbul ignore next -- @preserve */
      async onAddToPlaylist(params: PlaylistParam) {
        loading.value = true;

        await addToPlaylist({
          playlistId: params.playlistId,
          songIdToAdd: trackId,
        });

        loading.value = false;
      },
      /* istanbul ignore next -- @preserve */
      async onRemoveFromPlaylist(params: PlaylistParam) {
        loading.value = true;

        const foundPlaylist = playlists.value.find(
          (playlist) => playlist.id === params.playlistId,
        );

        if (foundPlaylist) {
          await removeFromPlaylist({
            playlistId: params.playlistId,
            songIndexToRemove: foundPlaylist.trackCount - 1,
          });
        }

        loading.value = false;
      },
      /* istanbul ignore next -- @preserve */
      async onSubmit(playlistName: string) {
        loading.value = true;

        const playlistResponse = await addPlaylist(playlistName);

        if (playlistResponse?.id) {
          await addToPlaylist({
            playlistId: playlistResponse.id,
            songIdToAdd: trackId,
          });
        }

        loading.value = false;
      },
      playlists,
      trackId,
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
