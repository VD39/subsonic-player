export function useAlbum() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  const album = ref<Album | null>(null);
  const frequentAlbums = ref<Album[]>([]);
  const newestAlbums = ref<Album[]>([]);
  const randomAlbums = ref<Album[]>([]);
  const recentAlbums = ref<Album[]>([]);

  async function getAlbums(params: AlbumsParams) {
    const { data: albumsData } = await fetchData('/getAlbumList2', {
      params: {
        ...params,
        noLoading: params.offset! > 0,
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
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAlbum(response.album),
    });

    album.value = albumData;
  }

  async function getFrequentAlbums(size = 20) {
    frequentAlbums.value = await getAlbums({
      size,
      type: 'frequent',
    });
  }

  async function getNewestAlbums(size = 20) {
    newestAlbums.value = await getAlbums({
      size,
      type: 'newest',
    });
  }

  async function getRandomAlbums(size = 20) {
    randomAlbums.value = await getAlbums({
      size,
      type: 'random',
    });
  }

  async function getRecentAlbums(size = 20) {
    recentAlbums.value = await getAlbums({
      size,
      type: 'recent',
    });
  }

  return {
    album,
    frequentAlbums,
    getAlbum,
    getAlbums,
    getFrequentAlbums,
    getNewestAlbums,
    getRandomAlbums,
    getRecentAlbums,
    newestAlbums,
    randomAlbums,
    recentAlbums,
  };
}
