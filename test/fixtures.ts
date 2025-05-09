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

export const COOKIE_MOCK =
  'token=token&salt=salt&server=https://www.server.com&username=username';

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

export const radioStationMock: InternetRadioStation = {
  homepageUrl: 'homepageUrl',
  id: 'id',
  name: 'name',
  streamUrl: 'streamUrl',
};

export const trackMock: Base = {
  album: 'album',
  albumId: 'albumId',
  artist: 'artist',
  artists,
  bitRate: 15,
  contentType: 'contentType',
  coverArt: 'coverArt',
  created: API_DATE,
  discNumber: 1,
  duration: 19,
  id: 'id',
  isDir: false,
  isVideo: false,
  parent: 'parent',
  path: 'path',
  playCount: 0,
  size: 16,
  starred: API_DATE,
  suffix: 'suffix',
  title: 'title',
  track: 1,
  transcodedContentType: 'transcodedContentType',
  transcodedSuffix: 'transcodedSuffix',
  type: 'music',
  year: 2024,
};

export const albumMock: AlbumWithSongsID3 = {
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
};

export const artistMock: ArtistWithAlbumsID3 = {
  album: [albumMock],
  albumCount: 0,
  artistImageUrl: 'artistImageUrl',
  coverArt: 'coverArt',
  id: 'id',
  name: 'name',
  starred: API_DATE,
};

export const playlistMock: PlaylistWithSongs = {
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
};

export const podcastEpisodeMock: ResponsePodcastEpisode = {
  album: 'album',
  artist: 'artist',
  channelId: 'channelId',
  coverArt: 'coverArt',
  description: 'description',
  duration: 19,
  id: 'id',
  isDir: false,
  publishDate: API_DATE,
  status: 'completed',
  streamId: 'streamId',
  title: 'title',
  type: 'podcastepisode',
};

export const podcastMock: PodcastChannel = {
  coverArt: 'image',
  description: 'description',
  episode: [podcastEpisodeMock],
  id: 'id',
  originalImageUrl: 'image',
  status: 'completed',
  title: 'title',
  url: 'url',
};

export const formattedTrackMock: Track = {
  album: 'album',
  albumId: 'albumId',
  artists,
  discNumber: 1,
  duration: 120,
  favourite: false,
  formattedDuration: '02:00',
  genres,
  id: 'id',
  image: 'image',
  index: 0,
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
};

export const formattedPlaylistMock: Playlist = {
  duration: 1,
  formattedDuration: '00:01',
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
};

export const formattedAlbumMock: Album = {
  artists,
  created: '01 January 2000',
  duration: 150,
  favourite: true,
  formattedDuration: '03:25:45',
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
};

export const formattedArtistMock: Artist = {
  albums: [formattedAlbumMock],
  biography: undefined,
  favourite: true,
  genres,
  id: 'id',
  image: 'image',
  lastFmUrl: undefined,
  musicBrainzUrl: undefined,
  name: 'name',
  similarArtist: [],
  similarTracks: [],
  topTracks: [],
  totalAlbums: 0,
  totalTracks: 4,
  type: MEDIA_TYPE.artist,
};

export const formattedPodcastEpisodeMock: PodcastEpisode = {
  author: 'author',
  description: 'description',
  downloaded: true,
  duration: 19,
  formattedDuration: '00:19',
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
};

export const formattedBookmarkMock: Bookmark = {
  ...formattedPodcastEpisodeMock,
  formattedPosition: '1',
  position: 1,
};

export const formattedPodcastMock: Podcast = {
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
};

export const formattedRadioStationMock: RadioStation = {
  duration: 0,
  formattedDuration: '00:00',
  homePageUrl: 'homepageUrl',
  id: 'id',
  image: 'image',
  name: 'name',
  streamUrlId: 'streamUrlId',
  trackNumber: 0,
  type: MEDIA_TYPE.radioStation,
};
