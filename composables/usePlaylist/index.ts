export function usePlaylist() {
  const { fetchData } = useAPI();
  const { addErrorSnack, addSuccessSnack } = useSnack();

  const playlist = useState<Playlist | null>('playlist', () => null);
  const playlists = useState<Playlist[]>('playlists', () => []);

  async function getPlaylists() {
    const { data: playlistsData, error } = await fetchData('/getPlaylists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.playlists.playlist || [])
          .map(formatPlaylist)
          .sort((a, b) => b.songCount - a.songCount),
    });

    if (error.value?.message) {
      return addErrorSnack(error.value.message);
    }

    if (Array.isArray(playlistsData.value)) {
      playlists.value = playlistsData.value;
    }
  }

  async function getRandomSongs() {
    const { data: playlistData, error } = await fetchData('/getRandomSongs', {
      params: {
        size: 50,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => {
        const playlistRes = {
          ...response.randomSongs,
          id: 'Random',
          name: 'Random',
          comment: '',
          entry: response.randomSongs?.song || [],
          owner: 'string',
          songCount: response.randomSongs?.song?.length || 0,
          created: '',
          changed: '',
          duration: 0,
          public: false,
        };

        return formatPlaylist(playlistRes);
      },
    });

    if (error.value?.message) {
      playlist.value = null;
      return addErrorSnack(error.value.message);
    }

    playlist.value = playlistData.value;
  }

  async function getPlaylist(id: string) {
    const { data: playlistData, error } = await fetchData('/getPlaylist', {
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlaylist(response.playlist),
    });

    if (error.value?.message) {
      playlist.value = null;
      return addErrorSnack(error.value.message);
    }

    playlist.value = playlistData.value;
  }

  async function getPlaylistById(id = 'random') {
    if (id === 'random') {
      await getRandomSongs();
    } else {
      await getPlaylist(id);
    }
  }

  async function createPlaylist(name: string) {
    const { data: playlistData, error } = await fetchData('/createPlaylist', {
      method: 'POST',
      params: {
        name,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatPlaylist(response.playlist),
    });

    if (error.value?.message) {
      return addErrorSnack(error.value.message);
    }

    if (!playlistData.value) {
      return addErrorSnack();
    }

    playlists.value.unshift(playlistData.value);

    addSuccessSnack(`Successfully added playlist ${playlistData.value?.name}`);
  }

  return {
    createPlaylist,
    getPlaylistById,
    getPlaylists,
    playlist,
    playlists,
  };
}
