export const ALBUMS_NAVIGATION = {
  param: ROUTE_TYPES.sortBy,
  routes: ROUTE_ALBUMS_SORT_BY_PARAMS,
};

export const FAVOURITES_NAVIGATION = {
  param: ROUTE_TYPES.mediaType,
  routes: ROUTE_MEDIA_TYPE_PARAMS,
};

export const GENRE_NAVIGATION = {
  param: ROUTE_TYPES.mediaType,
  routes: {
    Albums: ROUTE_MEDIA_TYPE_PARAMS.Albums,
    Tracks: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
  },
};

export const PODCAST_NAVIGATION = {
  param: ROUTE_TYPES.sortBy,
  routes: ROUTE_PODCAST_SORT_BY_PARAMS,
};

export const PODCASTS_NAVIGATION = {
  param: ROUTE_TYPES.sortBy,
  routes: ROUTE_PODCASTS_SORT_BY_PARAMS,
};

export const SEARCH_NAVIGATION = {
  param: ROUTE_TYPES.mediaType,
  routes: ROUTE_MEDIA_TYPE_PARAMS,
};
