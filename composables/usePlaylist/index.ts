export function usePlaylist() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const playlist = useState<Playlist | null>('playlist', () => null);
  const playlists = useState<Playlist[]>('playlists', () => []);

  async function getPlaylists() {
    const { data: playlistsData } = await fetchData('/getPlaylists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.playlists.playlist || [])
          .map(formatPlaylist)
          .sort((a, b) => b.songCount - a.songCount),
    });

    if (Array.isArray(playlistsData)) {
      playlists.value = playlistsData;
    }
  }

  async function getRandomTracks() {
    const { data: playlistData } = await fetchData('/getRandomSongs', {
      params: {
        size: Number(LOAD_SIZE),
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => {
        const playlistRes = {
          ...response.randomSongs,
          id: 'Random',
          name: 'Random',
          comment: '',
          entry: response.randomSongs.song || [],
          songCount: response.randomSongs.song?.length || 0,
          created: new Date(),
          changed: new Date(),
          duration: getRandomTracksDuration(response.randomSongs.song),
        };

        return formatPlaylist(playlistRes);
      },
    });

    playlist.value = playlistData;
  }

  async function getPlaylistTracks(id: string) {
    const { data: playlistData } = await fetchData('/getPlaylist', {
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlaylist(response.playlist),
    });

    playlist.value = playlistData;
  }

  async function getPlaylistTracksById(id = 'random') {
    if (id === 'random') {
      await getRandomTracks();
    } else {
      await getPlaylistTracks(id);
    }
  }

  async function createPlaylist(name: string) {
    const { data: playlistData } = await fetchData('/createPlaylist', {
      method: 'POST',
      params: {
        name,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlaylist(response.playlist),
    });

    if (playlistData) {
      playlists.value.unshift(playlistData);
      addSuccessSnack(`Successfully added playlist ${playlistData.name}.`);
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
    }
  }

  async function deletePlaylist(id: string) {
    const { data: playlistData } = await fetchData('/updatePlaylist', {
      method: 'DELETE',
      params: {
        id,
      },
    });

    if (playlistData) {
      addSuccessSnack('Successfully deleted playlist.');
    }
  }

  /* istanbul ignore next -- @preserve */
  async function addToPlaylist(params: PlaylistParam) {
    await updatePlaylist(params, 'Successfully added to playlist.');
  }

  /* istanbul ignore next -- @preserve */
  async function removeFromPlaylist(params: PlaylistParam) {
    await updatePlaylist(params, 'Successfully removed from playlist.');
  }

  return {
    addToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylists,
    getPlaylistTracksById,
    playlist,
    playlists,
    removeFromPlaylist,
    updatePlaylist,
  };
}
