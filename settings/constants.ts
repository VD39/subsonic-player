import type { MiddlewareKey } from '#build/types/middleware';

export const DEFAULT_VALUE = '--';

export const DEFAULT_ERROR_MESSAGE =
  'Sorry, something went wrong. Please try again.';

export const COOKIE_NAMES = {
  auth: 'auth-params',
} as const;

export const STATE_NAMES = {
  artists: 'artists',
  currentUser: 'current-user',
  favourites: 'favourites',
  genres: 'genres',
  globalLoading: 'global-loading',
  infinityHasMore: 'infinity-has-more',
  infinityItems: 'infinity-items',
  infinityOffset: 'infinity-offset',
  latestPodcasts: 'latest-podcasts',
  modal: 'modal',
  playerAudioPlayer: 'player-audio-player',
  playerBufferedLength: 'player-buffered-length',
  playerCurrentQueueIndex: 'player-current-queue-index',
  playerCurrentTime: 'player-current-time',
  playerDuration: 'player-duration',
  playerPlaybackRate: 'player-playback-rate',
  playerPlayLoading: 'player-play-loading',
  playerQueueList: 'player-queue-list',
  playerQueueOriginal: 'player-queue-original',
  playerRepeat: 'player-repeat',
  playerShuffle: 'player-shuffle',
  playerTrackIsPlaying: 'player-track-is-playing',
  playerVolume: 'player-volume',
  playlist: 'playlist',
  playlists: 'playlists',
  podcast: 'podcast',
  podcastEpisodes: 'podcast-episodes',
  podcasts: 'podcasts',
  queueListOpened: 'queue-list-opened',
  queuePlayerOpened: 'queue-player-opened',
  radioStations: 'radio-stations',
  sideBarCollapsed: 'sidebar-collapsed',
  sideBarWidth: 'sidebar-width',
  snacks: 'snacks',
  theme: 'theme',
  userAuthenticated: 'user-authenticated',
} as const;

export const ASYNC_DATA_NAMES = {
  album: 'album',
  albums: 'albums',
  artist: 'artist',
  artists: 'artists',
  favourites: 'favourites',
  genres: 'genres',
  index: 'index',
  library: 'library',
  playlist: 'playlist',
  playlists: 'playlists',
  podcast: 'podcast',
  podcasts: 'podcasts',
  radioStations: 'radio-stations',
  searchResults: 'search-results',
} as const;

export const ROUTE_TYPES = {
  mediaType: 'mediaType',
  sortBy: 'sortBy',
} as const;

export const MIDDLEWARE_NAMES = {
  album: 'album',
  albums: 'albums',
  artist: 'artist',
  favourites: 'favourites',
  genre: 'genre',
  playlist: 'playlist',
  podcast: 'podcast',
  podcasts: 'podcasts',
  search: 'search',
} as Record<string, MiddlewareKey>;

export const PAGE_NAVIGATION_ROUTES = [
  'index',
  'podcast-sortBy-id',
  'podcasts-sortBy',
  'radio-stations',
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

export const ROUTE_PODCASTS_SORT_BY_PARAMS = {
  'A-Z': 'a-z',
  Recent: 'recent',
} as const;

export const ROUTE_ALBUMS_SORT_BY_PARAMS = {
  'A-Z': 'a-z',
  'By artist': 'by-artist',
  'Most played': 'most-played',
  Random: 'random',
  'Recently added': 'recently-added',
  'Recently played': 'recently-played',
} as const;

export const ICONS = {
  add: 'PhPlusCircle',
  album: 'PhVinylRecord',
  artist: 'PhUsersThree',
  clear: 'PhTrash',
  close: 'PhX',
  darkTheme: 'PhSun',
  discover: 'PhCompass',
  download: 'PhDownload',
  dropdownMenu: 'PhDotsThreeVertical',
  fastForward: 'PhFastForward',
  favourite: 'PhHeart',
  genre: 'PhWaveform',
  information: 'PhInfo',
  lastFm: 'PhLastfmLogo',
  lightTheme: 'PhMoon',
  logo: 'PhWaveSine',
  music: 'PhMusicNotes',
  musicBrainz: 'PhVinylRecord',
  next: 'PhCaretDoubleRight',
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
};

export const DEFAULT_ALL_MEDIA = {
  albums: [],
  artists: [],
  tracks: [],
};
