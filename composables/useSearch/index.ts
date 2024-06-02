export function useSearch() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  const searchResults = ref<AllMedia>(DEFAULT_ALL_MEDIA);

  async function search(params: SearchParams) {
    const { query, offset } = params;

    const { data: searchData } = await fetchData('/search3', {
      params: {
        albumCount: LOAD_SIZE,
        albumOffset: offset || 0,
        artistCount: LOAD_SIZE,
        artistOffset: offset || 0,
        noLoading: offset! > 0,
        query,
        songCount: LOAD_SIZE,
        songOffset: offset || 0,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.searchResult3),
    });

    if (searchData) {
      searchResults.value = searchData;
    }
  }

  return {
    search,
    searchResults,
  };
}
