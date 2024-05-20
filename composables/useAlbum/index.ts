export function useAlbum() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  const album = ref<Album | null>(null);

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

    return albumsData;
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

  return {
    album,
    getAlbum,
    getAlbums,
  };
}
