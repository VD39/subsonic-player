import type { MiddlewareKey } from '#build/types/middleware';

export const DEFAULT_VALUE = '--';

export const DEFAULT_ERROR_MESSAGE =
  'Sorry, something went wrong. Please try again.';

export const PREVIEW_TRACK_COUNT = 8;
export const PREVIEW_PLAYLIST_COUNT = 8;
export const PREVIEW_ALBUM_COUNT = 15;

export const STATE_NAMES = {
  bookmarks: 'bookmarks',
  currentUser: 'current-user',
  favouriteIds: 'favourite-ids',
  favourites: 'favourites',
  frequentAlbums: 'frequent-albums',
  genres: 'genres',
  hotKeyListOpened: 'hot-key-list-opened',
  infinityHasMore: 'infinity-has-more',
  infinityItems: 'infinity-items',
  infinityOffset: 'infinity-offset',
  modal: 'modal',
  newestAlbums: 'newest-albums',
  newestPodcastEpisodes: 'newest-podcast-episodes',
  playerAudioPlayer: 'player-audio-player',
  playerBufferedLength: 'player-buffered-length',
  playerCurrentQueueIndex: 'player-current-queue-index',
  playerCurrentTime: 'player-current-time',
  playerDuration: 'player-duration',
  playerInterval: 'player-interval',
  playerIsPlaying: 'player-is-playing',
  playerOriginalQueueList: 'player-original-queue-list',
  playerPlaybackRate: 'player-playback-rate',
  playerPlayLoading: 'player-play-loading',
  playerQueueList: 'player-queue-list',
  playerRepeat: 'player-repeat',
  playerShuffle: 'player-shuffle',
  playerState: 'player-state',
  playerTrackHasScrobbled: 'player-track-has-scrobbled',
  playerVolume: 'player-volume',
  playlist: 'playlist',
  playlists: 'playlists',
  podcast: 'podcast',
  podcasts: 'podcasts',
  previousVolume: 'player-previous-volume',
  queueListOpened: 'queue-list-opened',
  queuePlayerOpened: 'queue-player-opened',
  radioStations: 'radio-stations',
  recentAlbums: 'recent-albums',
  sideBarCollapsed: 'sidebar-collapsed',
  sideBarWidth: 'sidebar-width',
  snacks: 'snacks',
  theme: 'theme',
  userAuthenticated: 'user-authenticated',
} as const;

export const ASYNC_DATA_NAMES = {
  artists: 'artists',
  bookmarks: 'bookmarks',
  favourites: 'favourites',
  genres: 'genres',
  index: 'index',
  library: 'library',
  playlists: 'playlists',
  podcast: 'podcast',
  podcasts: 'podcasts',
  radioStations: 'radio-stations',
} as const;

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

export const ICONS = {
  add: 'PhPlusCircle',
  album: 'PhVinylRecord',
  artist: 'PhUsersThree',
  bookmark: 'PhBookmarks',
  clear: 'PhTrash',
  close: 'PhX',
  darkTheme: 'PhSun',
  discover: 'PhCompass',
  download: 'PhDownload',
  downloaded: 'PhCheckCircle',
  dropdownMenu: 'PhDotsThreeVertical',
  fastForward: 'PhFastForward',
  favourite: 'PhHeart',
  folder: 'PhFolder',
  folderBack: 'PhArrowURightUp',
  genre: 'PhWaveform',
  information: 'PhInfo',
  lastFm: 'PhLastfmLogo',
  lightTheme: 'PhMoon',
  logo: 'PhWaveSine',
  more: 'PhCaretDoubleRight',
  music: 'PhMusicNotes',
  musicBrainz: 'PhVinylRecord',
  next: 'PhCaretDoubleRight',
  noFolder: 'PhInfo',
  noMedia: 'PhWaveformSlash',
  notDownloaded: 'PhXCircle',
  pause: 'PhPause',
  play: 'PhPlay',
  playlist: 'PhPlaylist',
  playlistAdd: 'PhListPlus',
  podcast: 'PhApplePodcastsLogo',
  podcastEpisode: 'PhApplePodcastsLogo',
  previous: 'PhCaretDoubleLeft',
  queue: 'PhQueue',
  queueClose: 'PhCaretDown',
  radioStation: 'PhRadio',
  refresh: 'PhArrowsClockwise',
  remove: 'PhMinusCircle',
  repeat: 'PhRepeat',
  repeatOnce: 'PhRepeatOnce',
  rewind: 'PhRewind',
  search: 'PhMagnifyingGlass',
  setting: 'PhGear',
  shuffle: 'PhShuffle',
  sidebarCollapsed: 'PhTextIndent',
  sidebarNotCollapsed: 'PhTextOutdent',
  signOut: 'PhSignOut',
  skipBack: 'PhSkipBack',
  skipForward: 'PhSkipForward',
  spinner: 'PhCircleNotch',
  track: 'PhMusicNotes',
  volume0: 'PhSpeakerNone',
  volume02: 'PhSpeakerLow',
  volume05: 'PhSpeakerHigh',
  volumeDefault: 'PhSpeakerX',
} as const;

export const ICON_SIZE = {
  large: 32,
  medium: 24,
  small: 18,
} as const;

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
