const artists = [
  {
    albumCount: 12,
    id: 'id',
    name: 'name',
  },
  {
    albumCount: 12,
    id: 'id1',
    name: 'name1',
  },
];

const genres = [
  {
    name: 'genre',
  },
  {
    name: 'genre1',
  },
];

export const API_DATE = new Date(2000, 0, 1);

export const routeMock = {
  fullPath: 'login?param=param&param1=param1',
  hash: '',
  matched: [],
  meta: {},
  name: 'login',
  params: {},
  path: 'login',
  query: {
    param: 'param',
    param1: 'param1',
  },
  redirectedFrom: undefined,
  token: '',
};

export const genreMock = {
  albumCount: 0,
  songCount: 0,
  value: 'genre',
};

export const radioStationMock = {
  homepageUrl: 'homepageUrl',
  id: 'id',
  name: 'name',
  streamUrl: 'streamUrl',
} as InternetRadioStation;

export const trackMock = {
  album: 'album',
  albumArtists: null,
  albumId: 'albumId',
  artist: 'artist',
  artists,
  bitRate: 15,
  contentType: 'contentType',
  coverArt: 'coverArt',
  created: API_DATE,
  discNumber: 1,
  displayAlbumArtist: 'displayAlbumArtist',
  displayArtist: 'displayArtist',
  duration: 19,
  id: 'id',
  isDir: false,
  isVideo: false,
  musicBrainzId: '',
  parent: 'parent',
  path: 'path',
  playCount: 0,
  replayGain: null,
  size: 16,
  starred: API_DATE,
  suffix: 'suffix',
  title: 'title',
  track: 1,
  transcodedContentType: 'transcodedContentType',
  transcodedSuffix: 'transcodedSuffix',
  type: 'music',
  year: 2024,
} as Base;

export const albumMock = {
  album: 'album',
  artist: 'artist',
  artistId: 'id2',
  artists,
  coverArt: 'coverArt',
  created: API_DATE,
  duration: 12345,
  genre: 'genre',
  genres,
  id: 'id',
  name: 'name',
  playCount: 1,
  song: [trackMock],
  songCount: 4,
  starred: API_DATE,
  year: 2024,
} as AlbumID3;

export const artistMock = {
  album: [albumMock],
  albumCount: 0,
  artistImageUrl: 'artistImageUrl',
  coverArt: 'coverArt',
  id: 'id',
  name: 'name',
  starred: API_DATE,
} as ArtistWithAlbumsID3;

export const playlistMock = {
  changed: API_DATE,
  comment: '',
  created: API_DATE,
  duration: 1,
  entry: [trackMock],
  id: 'id',
  name: 'name',
  owner: 'owner',
  public: true,
  songCount: 1,
} as ResponsePlaylist;

export const podcastEpisodeMock = {
  album: 'album',
  artist: 'artist',
  channelId: 'channelId',
  coverArt: 'coverArt',
  description: 'description',
  duration: 19,
  id: 'id',
  isDir: false,
  name: 'name',
  publishDate: API_DATE,
  status: 'completed',
  streamId: 'streamId',
  title: 'title',
  type: 'podcastepisode',
} as ResponsePodcastEpisode;

export const podcastMock = {
  coverArt: 'image',
  description: 'description',
  episode: [podcastEpisodeMock],
  id: 'id',
  originalImageUrl: 'image',
  status: 'completed',
  title: 'title',
  url: 'url',
} as PodcastChannel;

export const formattedTrackMock = {
  album: 'album',
  albumId: 'albumId',
  artists,
  description: 'Description',
  discNumber: 1,
  duration: '00:19',
  favourite: false,
  genres,
  id: 'id',
  image: 'image',
  information: {
    bitRate: '15 kbps',
    contentType: 'contentType',
    created: 'created',
    path: 'path',
    playCount: 1,
    suffix: 'suffix',
    transcodedContentType: 'transcodedContentType',
    transcodedSuffix: 'transcodedSuffix',
  },
  name: 'name',
  size: '0.02 KB',
  streamUrlId: 'streamUrlId',
  trackNumber: 1,
  type: MEDIA_TYPE.track,
  year: 2024,
} as Track;

export const formattedPlaylistMock = {
  duration: '00:01',
  id: 'id',
  images: ['image'],
  information: {
    changed: '01 January 2000',
    comment: '',
    created: '01 January 2000',
    owner: 'owner',
    public: true,
  },
  name: 'name',
  trackCount: 1,
  tracks: [formattedTrackMock],
  type: MEDIA_TYPE.playlist,
} as Playlist;

export const formattedAlbumMock = {
  artists,
  created: '01 January 2000',
  duration: '03:25:45',
  favourite: true,
  genres,
  id: 'id',
  image: 'image',
  information: {
    playCount: 1,
  },
  name: 'name',
  size: '0.02 KB',
  totalDiscNumber: 1,
  trackCount: 4,
  tracks: [formattedTrackMock],
  tracksByDiscNumber: {
    'Disc 1': [formattedTrackMock],
  },
  type: MEDIA_TYPE.album,
  year: 2024,
} as Album;

export const formattedArtistMock = {
  albums: [formattedAlbumMock],
  biography: undefined,
  favourite: true,
  genres,
  id: 'id',
  image: 'image',
  lastFmUrl: undefined,
  musicBrainzUrl: undefined,
  name: 'name',
  totalAlbums: 0,
  totalTracks: 4,
  type: MEDIA_TYPE.artist,
} as Artist;

export const formattedPodcastEpisodeMock = {
  author: 'author',
  description: 'description',
  downloaded: true,
  duration: '00:19',
  genres: [],
  id: 'id',
  image: 'image',
  name: 'title',
  podcastId: 'podcastId',
  podcastName: 'podcastName',
  publishDate: '01/01/2000',
  streamUrlId: 'streamUrlId',
  trackNumber: 1,
  type: MEDIA_TYPE.podcastEpisode,
} as PodcastEpisode;

export const formattedPodcastMock = {
  description: 'description',
  episodes: {
    [ROUTE_PODCAST_SORT_BY_PARAMS.All]: [formattedPodcastEpisodeMock],
    [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded]: [formattedPodcastEpisodeMock],
    [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']]: [
      formattedPodcastEpisodeMock,
    ],
  },
  id: 'id',
  image: 'image',
  lastUpdated: '01 January 2000',
  name: 'title',
  totalDownloadedEpisodes: 1,
  totalEpisodes: 1,
  type: MEDIA_TYPE.podcast,
  url: 'url',
} as Podcast;

export const formattedRadioStationMock = {
  homePageUrl: 'homepageUrl',
  id: 'id',
  image: 'image',
  name: 'name',
  streamUrlId: 'streamUrlId',
  type: MEDIA_TYPE.radioStation,
} as RadioStation;

export const usePodcastPodcastValueMock = [
  {
    lastUpdated: new Date(2000, 0, 5).toString(),
    name: 'Z',
  },
  {
    lastUpdated: new Date(2000, 0, 10).toString(),
    name: 'H',
  },
  {
    lastUpdated: new Date(2000, 0, 1).toString(),
    name: 'A',
  },
] as Podcast[];
