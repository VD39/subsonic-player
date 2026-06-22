export function useSearch() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const { fetchData } = useAPI();

  async function search(params: SearchParams) {
    const { loadSize = LOAD_SIZE, offset = 0, query } = params;

    const { data: searchData } = await fetchData('/search3', {
      query: {
        albumCount: loadSize,
        albumOffset: offset,
        artistCount: loadSize,
        artistOffset: offset,
        query,
        songCount: loadSize,
        songOffset: offset,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.searchResult3),
    });

    return searchData;
  }

  async function fetchSearchResult(params: SearchParams) {
    const searchData = await search(params);

    return (
      searchData?.[params.mediaType!] || DEFAULT_ALL_MEDIA[params.mediaType!]
    );
  }

  async function fetchSearchSuggestions(query: string) {
    const searchData = await search({
      loadSize: MAX_SEARCH_SUGGESTION,
      query,
    });

    if (!searchData) {
      return [];
    }

    const groups: SuggestionGroup[] = [];

    if (searchData.artists.length) {
      groups.push({
        items: searchData.artists.map(toArtistSuggestion),
        searchType: ROUTE_MEDIA_TYPE_PARAMS.Artists,
        title: 'Artists',
      });
    }

    if (searchData.albums.length) {
      groups.push({
        items: searchData.albums.map(toAlbumSuggestion),
        searchType: ROUTE_MEDIA_TYPE_PARAMS.Albums,
        title: 'Albums',
      });
    }

    if (searchData.tracks.length) {
      groups.push({
        items: searchData.tracks.map((track) =>
          toTrackSuggestion(track, query),
        ),
        searchType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        title: 'Tracks',
      });
    }

    return groups;
  }

  return {
    fetchSearchResult,
    fetchSearchSuggestions,
  };
}
