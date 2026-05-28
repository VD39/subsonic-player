function buildPageNavigation(key: string, params: Record<string, string>) {
  return Object.entries(params).reduce<PageNavigationMap>(
    (previousValue, [paramKey, value]) => {
      previousValue[paramKey] = {
        params: {
          [key]: value,
        },
      };

      return previousValue;
    },
    {},
  );
}

export const ALBUMS_NAVIGATION = buildPageNavigation(
  ROUTE_PARAM_KEYS.albums.sortBy,
  ROUTE_ALBUMS_SORT_BY_PARAMS,
);

export const FAVOURITES_NAVIGATION = buildPageNavigation(
  ROUTE_PARAM_KEYS.favourites.mediaType,
  ROUTE_MEDIA_TYPE_PARAMS,
);

export const GENRE_NAVIGATION = buildPageNavigation(
  ROUTE_PARAM_KEYS.genre.mediaType,
  {
    Albums: ROUTE_MEDIA_TYPE_PARAMS.Albums,
    Tracks: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
  },
);

export const PODCAST_NAVIGATION = buildPageNavigation(
  ROUTE_PARAM_KEYS.podcast.sortBy,
  ROUTE_PODCAST_FILTER_PARAMS,
);

export const SEARCH_NAVIGATION = buildPageNavigation(
  ROUTE_PARAM_KEYS.search.mediaType,
  ROUTE_MEDIA_TYPE_PARAMS,
);

export const MOBILE_PAGE_NAVIGATION: PageNavigationMap = {
  Discover: {
    name: ROUTE_NAMES.index,
  },
  Podcasts: {
    name: ROUTE_NAMES.podcasts,
  },
  'Radio Stations': {
    name: ROUTE_NAMES.radioStations,
  },
};
