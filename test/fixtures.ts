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
  value: 'genre',
  songCount: 0,
  albumCount: 0,
};

export const radioStationMock = {
  id: 'id',
  name: 'name',
  streamUrl: 'streamUrl',
  homepageUrl: 'homepageUrl',
};

export const trackMock = {
  album: 'album',
  albumArtists: null,
  artist: 'artist',
  artists: [
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
  ],
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
  artists: [
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
  ],
  coverArt: 'coverArt',
  created: DATE,
  duration: 12345,
  genre: 'genre',
  genres: [
    {
      name: 'genre',
    },
    {
      name: 'genre1',
    },
  ],
  id: 'id',
  name: 'name',
  playCount: 1,
  songCount: 4,
  starred: DATE,
  year: 2024,
  song: [trackMock],
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
  channelId: 'channelId',
  description: 'description',
  id: 'id',
  image: 'image',
  isDir: false,
  name: 'name',
  publishDate: DATE,
  status: 'completed',
  streamId: 'streamId',
  title: 'title',
} as ResponsePodcastEpisode;

export const podcastMock = {
  description: 'description',
  id: 'id',
  url: 'url',
  coverArt: 'image',
  originalImageUrl: 'image',
  status: 'completed',
  title: 'title',
  episode: [podcastEpisodeMock],
} as PodcastChannel;

export const formattedPlaylistMock = {
  changed: DATE,
  comment: '',
  created: DATE,
  duration: 1,
  entry: [trackMock],
  id: 'id',
  images: [],
  information: {},
  name: 'name',
  owner: 'owner',
  public: true,
  songCount: 1,
  tracks: [],
} as Playlist;
