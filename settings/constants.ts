import type { MiddlewareKey } from '#build/types/middleware';

export const DEFAULT_VALUE = '--';

export const DEFAULT_ERROR_MESSAGE =
  'Sorry, something went wrong. Please try again.';

export const COOKIE_NAMES = {
  auth: 'auth-params',
} as const;

export const DAYS_COOKIE_EXPIRES = 60;

export const STATE_NAMES = {
  currentUser: 'current-user',
  favouriteIds: 'favourite-ids',
  favourites: 'favourites',
  genres: 'genres',
  infinityHasMore: 'infinity-has-more',
  infinityItems: 'infinity-items',
  infinityOffset: 'infinity-offset',
  modal: 'modal',
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
  queueListOpened: 'queue-list-opened',
  queuePlayerOpened: 'queue-player-opened',
  radioStations: 'radio-stations',
  sideBarCollapsed: 'sidebar-collapsed',
  sideBarWidth: 'sidebar-width',
  snacks: 'snacks',
  theme: 'theme',
  userAuthenticated: 'user-authenticated',
} as const;

export const STATES_TO_CLEAR = [
  STATE_NAMES.currentUser,
  STATE_NAMES.favouriteIds,
  STATE_NAMES.favourites,
  STATE_NAMES.genres,
  STATE_NAMES.playlist,
  STATE_NAMES.playlists,
  STATE_NAMES.radioStations,
  STATE_NAMES.userAuthenticated,
];

export const ASYNC_DATA_NAMES = {
  artists: 'artists',
  favourites: 'favourites',
  genres: 'genres',
  index: 'index',
  library: 'library',
  playlists: 'playlists',
  podcast: 'podcast',
  podcasts: 'podcasts',
  radioStations: 'radio-stations',
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
  search: 'search',
} as Record<string, MiddlewareKey>;

export const PAGE_NAVIGATION_ROUTES = [
  'index',
  'podcast-sortBy-id',
  'podcasts',
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
};

export const DEFAULT_ALL_MEDIA = {
  albums: [],
  artists: [],
  tracks: [],
};
