import type { MiddlewareKey } from '#build/types/middleware';

export const ROUTE_NAMES = {
  album: 'album-id',
  albums: 'albums-sortBy',
  artist: 'artist-id',
  artists: 'artists',
  bookmarks: 'bookmarks',
  favourites: 'favourites-mediaType',
  files: 'files-id-slug',
  genre: 'genre-mediaType-genre',
  genres: 'genres',
  index: 'index',
  library: 'library',
  login: 'login',
  playlist: 'playlist-id',
  playlists: 'playlists',
  podcast: 'podcast-sortBy-id',
  podcasts: 'podcasts',
  queue: 'queue',
  radioStations: 'radio-stations',
  search: 'search-mediaType-query',
  userProfile: 'user-profile',
} as const;

export const ROUTE_PARAM_KEYS = {
  album: {
    id: 'id',
  },
  albums: {
    sortBy: 'sortBy',
  },
  artist: {
    id: 'id',
  },
  favourites: {
    mediaType: 'mediaType',
  },
  files: {
    id: 'id',
  },
  genre: {
    genre: 'genre',
    mediaType: 'mediaType',
  },
  playlist: {
    id: 'id',
  },
  podcast: {
    id: 'id',
    sortBy: 'sortBy',
  },
  search: {
    mediaType: 'mediaType',
    query: 'query',
  },
} as const;

export const PAGE_NAVIGATION_ROUTES: RouteName[] = [
  ROUTE_NAMES.index,
  ROUTE_NAMES.podcast,
  ROUTE_NAMES.podcasts,
  ROUTE_NAMES.radioStations,
];

export const ROUTE_MEDIA_TYPE_PARAMS = {
  Albums: 'albums',
  Artists: 'artists',
  Tracks: 'tracks',
} as const;

export const ROUTE_PODCAST_SORT_BY_PARAMS = {
  All: 'all',
  Downloaded: 'downloaded',
  'Not downloaded': 'not-downloaded',
} as const;

export const ROUTE_ALBUMS_SORT_BY_PARAMS = {
  'A-Z': 'a-z',
  'By artist': 'by-artist',
  'Most played': 'most-played',
  Random: 'random',
  'Recently added': 'recently-added',
  'Recently played': 'recently-played',
} as const;

export const MIDDLEWARE_NAMES: Record<string, MiddlewareKey> = {
  album: 'album',
  albums: 'albums',
  artist: 'artist',
  favourites: 'favourites',
  genre: 'genre',
  playlist: 'playlist',
  podcast: 'podcast',
  search: 'search',
} as const;
