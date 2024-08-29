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

export const DATE = new Date(2000, 0, 1);

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
};

// Update to make artist and genres a const.
export const trackMock = {
  album: 'album',
  albumArtists: null,
  albumId: 'albumId',
  artist: 'artist',
  artists,
  bitRate: 15,
  contentType: 'contentType',
  coverArt: 'coverArt',
  created: DATE,
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
  replayGain: null,
  size: 16,
  suffix: 'suffix',
  title: 'title',
  track: 1,
  type: 'music',
  year: 2024,
} as Base;

export const albumMock = {
  album: 'album',
  artist: 'artist',
  artistId: 'id2',
  artists,
  coverArt: 'coverArt',
  created: DATE,
  duration: 12345,
  genre: 'genre',
  genres,
  id: 'id',
  name: 'name',
  playCount: 1,
  song: [trackMock],
  songCount: 4,
  starred: DATE,
  year: 2024,
} as AlbumID3;

export const artistMock = {
  album: [albumMock],
  albumCount: 0,
  artistImageUrl: 'artistImageUrl',
  coverArt: 'coverArt',
  id: 'id',
  name: 'name',
  starred: DATE,
} as ArtistWithAlbumsID3;

export const playlistMock = {
  changed: DATE,
  comment: '',
  created: DATE,
  duration: 1,
  entry: [trackMock],
  id: 'id',
  name: 'name',
  owner: 'owner',
  public: true,
  songCount: 1,
} as ResponsePlaylist;

export const podcastEpisodeMock = {
  id: 'id',
  description: 'description',
  duration: 19,
  channelId: 'channelId',
  image: 'image',
  isDir: false,
  name: 'name',
  publishDate: DATE,
  status: 'completed',
  streamUrl: 'streamUrl',
  title: 'title',
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
  image: 'coverArt',
  information: {
    bitRate: 15,
    contentType: 'contentType',
    path: 'path',
    playCount: 1,
    suffix: 'suffix',
    transcodedContentType: 'transcodedContentType',
    transcodedSuffix: 'transcodedSuffix',
  },
  size: '0.02 KB',
  streamUrl: 'streamUrl',
  name: 'name',
  track: 1,
  type: 'track',
  year: 2024,
} as Track;

export const formattedPlaylistMock = {
  duration: '00:01',
  id: 'id',
  images: [],
  information: {
    changed: DATE,
    comment: '',
    created: DATE,
    owner: 'owner',
    public: true,
  },
  name: 'name',
  songCount: 1,
  tracks: [formattedTrackMock],
  type: 'playlist',
} as Playlist;

export const formattedAlbumMock = {
  artists,
  created: 'id',
  duration: '03:25:45',
  favourite: true,
  genres,
  id: 'id',
  image: 'coverArt',
  information: {
    playCount: 1,
  },
  name: 'name',
  size: '0.02 KB',
  songCount: 4,
  tracks: [formattedTrackMock],
  type: 'album',
  year: 2024,
} as Album;

export const formattedArtistMock = {
  albums: [formattedAlbumMock],
  biography: undefined,
  favourite: true,
  genres,
  id: 'id',
  image: 'coverArt',
  lastFmUrl: undefined,
  musicBrainzUrl: undefined,
  name: 'name',
  totalAlbums: 0,
  totalTracks: 4,
  type: 'artist',
} as Artist;

export const formattedPodcastEpisodeMock = {
  description: 'description',
  duration: '00:19',
  downloaded: true,
  genres: [],
  id: 'id',
  image: 'image',
  name: 'title',
  publishDate: DATE,
  streamUrl: 'streamUrl',
  type: 'podcastEpisode',
};

export const formattedPodcastMock = {
  description: 'description',
  downloadedEpisodes: 1,
  episodes: [formattedPodcastEpisodeMock],
  id: 'id',
  image: 'image',
  lastUpdated: '01 Jan 2000',
  name: 'title',
  totalEpisodes: 1,
  type: 'podcast',
  url: 'url',
} as Podcast;

export const formattedRadioStationMock = {
  homePageUrl: 'homepageUrl',
  id: 'id',
  image: 'coverArt',
  name: 'name',
  streamUrl: 'streamUrl',
  type: 'radioStation',
} as RadioStation;
