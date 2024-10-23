export const ALBUMS_SORT_BY = {
  [ROUTE_ALBUMS_SORT_BY_PARAMS.Random]: 'random',
  [ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z']]: 'alphabeticalByName',
  [ROUTE_ALBUMS_SORT_BY_PARAMS['By artist']]: 'alphabeticalByArtist',
  [ROUTE_ALBUMS_SORT_BY_PARAMS['Most played']]: 'frequent',
  [ROUTE_ALBUMS_SORT_BY_PARAMS['Recently added']]: 'newest',
  [ROUTE_ALBUMS_SORT_BY_PARAMS['Recently played']]: 'recent',
} as Record<string, AlbumSortBy>;
