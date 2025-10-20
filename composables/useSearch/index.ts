export function useSearch() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  async function search(params: SearchParams) {
    const { mediaType, offset, query } = params;

    const { data: searchData } = await fetchData('/search3', {
      params: {
        albumCount: LOAD_SIZE,
        albumOffset: offset || 0,
        artistCount: LOAD_SIZE,
        artistOffset: offset || 0,
        query,
        songCount: LOAD_SIZE,
        songOffset: offset || 0,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.searchResult3),
    });

    return searchData?.[mediaType] || DEFAULT_ALL_MEDIA[mediaType];
  }

  return {
    search,
  };
}
