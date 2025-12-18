export function useAlbum() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  const newestAlbums = useState<Album[]>(STATE_NAMES.newestAlbums, () => []);
  const recentAlbums = useState<Album[]>(STATE_NAMES.recentAlbums, () => []);
  const frequentAlbums = useState<Album[]>(
    STATE_NAMES.frequentAlbums,
    () => [],
  );

  function resetAlbums() {
    newestAlbums.value = [];
    recentAlbums.value = [];
    frequentAlbums.value = [];
  }

  async function getAlbums(params: AlbumsParams) {
    const { data: albumsData } = await fetchData('/getAlbumList2', {
      query: {
        ...params,
        offset: params.offset || 0,
        size: params.size || Number(LOAD_SIZE),
        type: getSortType(params.type) || params.type || 'random',
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.albumList2.album || []).map(formatAlbum),
    });

    return albumsData || [];
  }

  async function getAlbum(id: string) {
    const { data: albumData } = await fetchData('/getAlbum', {
      query: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAlbum(response.album),
    });

    return albumData;
  }

  /* istanbul ignore next -- @preserve */
  function getFrequentAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'frequent',
    });
  }

  /* istanbul ignore next -- @preserve */
  function getNewestAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'newest',
    });
  }

  /* istanbul ignore next -- @preserve */
  function getRandomAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'random',
    });
  }

  /* istanbul ignore next -- @preserve */
  function getRecentAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'recent',
    });
  }

  async function getDiscoverAlbums() {
    const [frequentAlbumsData, newestAlbumsData, recentAlbumsData] =
      await Promise.all([
        getFrequentAlbums(),
        getNewestAlbums(),
        getRecentAlbums(),
      ]);

    frequentAlbums.value = frequentAlbumsData;
    newestAlbums.value = newestAlbumsData;
    recentAlbums.value = recentAlbumsData;
  }

  return {
    frequentAlbums,
    getAlbum,
    getAlbums,
    getDiscoverAlbums,
    getFrequentAlbums,
    getNewestAlbums,
    getRandomAlbums,
    getRecentAlbums,
    newestAlbums,
    recentAlbums,
    resetAlbums,
  };
}
