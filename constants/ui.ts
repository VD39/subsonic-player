export const DEFAULT_VALUE = '--';

export const DEFAULT_ERROR_MESSAGE =
  'Sorry, something went wrong. Please try again.';

export const PREVIEW_TRACK_COUNT = 8;
export const PREVIEW_PLAYLIST_COUNT = 8;
export const PREVIEW_ALBUM_COUNT = 15;
export const PREVIEW_ARTIST_COUNT = 15;
export const PREVIEW_GENRES_COUNT = 10;

export const DEFAULT_ALL_MEDIA = {
  albums: [],
  artists: [],
  tracks: [],
};

export const TRACK_HEADER_NAMES = {
  albumTracks: ['Track', 'Artists', 'Duration'],
  bookmarkTracks: ['Episode', 'Podcast', 'Author', 'Current/Duration'],
  mix: ['Track', 'Album/Podcast', 'Artists/Author', 'Duration'],
  podcastEpisodes: ['Episodes'],
  radioStations: ['Stations'],
  tracks: ['Track', 'Album', 'Artists', 'Duration'],
} as const;
