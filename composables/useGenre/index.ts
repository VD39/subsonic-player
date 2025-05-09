export function useGenre() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();
  const { getAlbums } = useAlbum();

  async function getGenres() {
    const { data: genresData } = await fetchData('/getGenres', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.genres.genre || []).map(formatGenre),
    });

    return genresData || [];
  }

  /* istanbul ignore next -- @preserve */
  function getAlbumsByGenre(params: AlbumsByGenreParams) {
    return getAlbums({
      ...params,
      size: Number(LOAD_SIZE),
      type: 'byGenre',
    });
  }

  async function getTracksByGenre(params: TracksByGenreParams) {
    const { data: tracksByGenreData } = await fetchData('/getSongsByGenre', {
      params: {
        ...params,
        count: Number(LOAD_SIZE),
        offset: params.offset || 0,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.songsByGenre.song || []).map(formatTrack),
    });

    return tracksByGenreData;
  }

  async function getMediaByGenre(params: MediaByGenreParams) {
    switch (params.mediaType) {
      case ROUTE_MEDIA_TYPE_PARAMS.Albums:
        return getAlbumsByGenre(params);
      case ROUTE_MEDIA_TYPE_PARAMS.Tracks:
        return getTracksByGenre(params);
      default:
        return [];
    }
  }

  return {
    getGenres,
    getMediaByGenre,
  };
}
