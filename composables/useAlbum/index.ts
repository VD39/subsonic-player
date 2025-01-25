export function useAlbum() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  async function getAlbums(params: AlbumsParams) {
    const { data: albumsData } = await fetchData('/getAlbumList2', {
      params: {
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
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAlbum(response.album),
    });

    return albumData;
  }

  function getFrequentAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'frequent',
    });
  }

  function getNewestAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'newest',
    });
  }

  function getRandomAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'random',
    });
  }

  function getRecentAlbums(size = 20) {
    return getAlbums({
      size,
      type: 'recent',
    });
  }

  return {
    getAlbum,
    getAlbums,
    getFrequentAlbums,
    getNewestAlbums,
    getRandomAlbums,
    getRecentAlbums,
  };
}
