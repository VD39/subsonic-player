import {
  albumMock,
  artistMock,
  genreMock,
  playlistMock,
  podcastEpisodeMock,
  podcastMock,
  radioStationMock,
  trackMock,
} from '@/test/fixtures';

import {
  formatAlbum,
  formatAllMedia,
  formatArtist,
  formatGenre,
  formatPlaylist,
  formatPodcast,
  formatPodcastEpisode,
  formatRadioStation,
  formatTracks,
} from './index';

describe('formatAlbum', () => {
  it('returns the correct values', () => {
    expect(formatAlbum(albumMock)).toEqual({
      artists: expect.any(Array),
      created: '01 January 2000',
      duration: '03:25:45',
      favourite: true,
      genres: expect.any(Array),
      id: 'id',
      image: 'coverArt',
      information: {
        playCount: 1,
      },
      name: 'name',
      size: '0.02 KB',
      trackCount: 4,
      tracks: expect.any(Array),
      type: 'album',
      year: 2024,
    });
  });

  describe.each([
    [
      'coverArt',
      {
        image: 'PhVinylRecord',
      },
    ],
    [
      'playCount',
      {
        information: expect.objectContaining({
          playCount: 0,
        }),
      },
    ],
    [
      'starred',
      {
        favourite: false,
      },
    ],
    [
      'song',
      {
        tracks: [],
      },
    ],
    [
      'year',
      {
        year: '--',
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatAlbum({
          ...albumMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });
});

describe('formatAllMedia', () => {
  describe('when values are defined', () => {
    it('returns the correct values', () => {
      expect(
        formatAllMedia({
          album: [albumMock],
          artist: [artistMock],
          song: [trackMock],
        }),
      ).toEqual({
        albums: [
          expect.objectContaining({
            id: 'id',
          }),
        ],
        artists: [
          expect.objectContaining({
            id: 'id',
          }),
        ],
        tracks: [
          expect.objectContaining({
            id: 'id',
          }),
        ],
      });
    });
  });

  describe('when values are undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatAllMedia({
          album: undefined,
          artist: undefined,
          song: undefined,
        }),
      ).toEqual({
        albums: [],
        artists: [],
        tracks: [],
      });
    });
  });
});

describe('formatArtist', () => {
  it('returns the correct values', () => {
    expect(formatArtist(artistMock)).toEqual({
      albums: [
        {
          artists: expect.any(Array),
          created: '01 January 2000',
          duration: '03:25:45',
          favourite: true,
          genres: expect.any(Array),
          id: 'id',
          image: 'coverArt',
          information: {
            playCount: 1,
          },
          name: 'name',
          size: '0.02 KB',
          trackCount: 4,
          tracks: expect.any(Array),
          type: 'album',
          year: 2024,
        },
      ],
      biography: undefined,
      favourite: true,
      genres: expect.any(Array),
      id: 'id',
      image: 'artistImageUrl',
      lastFmUrl: undefined,
      musicBrainzUrl: undefined,
      name: 'name',
      totalAlbums: 0,
      totalTracks: 4,
      type: 'artist',
    });
  });

  describe.each([
    [
      'album',
      {
        albums: [],
      },
    ],
    [
      'albumCount',
      {
        totalAlbums: 0,
      },
    ],
    [
      'name',
      {
        name: '--',
      },
    ],
    [
      'starred',
      {
        favourite: false,
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });

  describe('when musicBrainzId is defined', () => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          musicBrainzId: 'musicBrainzId',
        }),
      ).toEqual(
        expect.objectContaining({
          musicBrainzUrl: 'https://musicbrainz.org/artist/musicBrainzId',
        }),
      );
    });
  });

  describe('when albumCount is defined', () => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          albumCount: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          totalAlbums: 0,
        }),
      );
    });
  });

  describe('when artistImageUrl is undefined', () => {
    describe('when coverArt is defined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            artistImageUrl: undefined,
            coverArt: 'coverArt',
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'coverArt',
          }),
        );
      });
    });

    describe('when coverArt is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            artistImageUrl: undefined,
            coverArt: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'PhUsersThree',
          }),
        );
      });
    });
  });
});

describe('formatGenre', () => {
  it('returns the correct values', () => {
    expect(formatGenre(genreMock)).toEqual({
      albumCount: 0,
      name: 'genre',
      trackCount: 0,
    });
  });

  describe('when name is defined', () => {
    it('returns the correct values', () => {
      expect(
        formatGenre({
          ...genreMock,
          name: 'nameGenre',
        }),
      ).toEqual({
        albumCount: 0,
        name: 'nameGenre',
        trackCount: 0,
      });
    });
  });
});

describe('formatPodcastEpisode', () => {
  it('returns the correct values', () => {
    expect(
      formatPodcastEpisode({
        image: 'image',
        name: 'name',
      })(podcastEpisodeMock),
    ).toEqual({
      description: 'description',
      downloaded: true,
      duration: '00:19',
      genres: [],
      id: 'id',
      image: 'image',
      name: 'title',
      podcastName: 'name',
      publishDate: '01/01/2000',
      streamUrlId: 'streamId',
      type: 'podcastEpisode',
    });
  });

  describe('when name is not defined', () => {
    it('returns the correct values', () => {
      expect(formatPodcastEpisode({})(podcastEpisodeMock)).toEqual(
        expect.objectContaining({
          podcastName: undefined,
        }),
      );
    });
  });

  describe('when image is not defined', () => {
    describe('when coverArt is defined', () => {
      it('returns the correct values', () => {
        expect(formatPodcastEpisode({})(podcastEpisodeMock)).toEqual(
          expect.objectContaining({
            image: 'coverArt',
          }),
        );
      });
    });

    describe('when coverArt is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcastEpisode({})({
            ...podcastEpisodeMock,
            coverArt: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'PhApplePodcastsLogo',
          }),
        );
      });
    });
  });

  describe('when status is not completed', () => {
    it('returns the correct values', () => {
      expect(
        formatPodcastEpisode({})({
          ...podcastEpisodeMock,
          status: 'skipped',
        }),
      ).toEqual(
        expect.objectContaining({
          streamUrlId: undefined,
        }),
      );
    });
  });

  describe('when status is completed', () => {
    describe('when streamId is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcastEpisode({})({
            ...podcastEpisodeMock,
            streamId: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            streamUrlId: undefined,
          }),
        );
      });
    });

    describe('when streamId is defined', () => {
      it('returns the correct values', () => {
        expect(formatPodcastEpisode({})(podcastEpisodeMock)).toEqual(
          expect.objectContaining({
            streamUrlId: 'streamId',
          }),
        );
      });
    });
  });
});

describe('formatPodcast', () => {
  it('returns the correct values', () => {
    expect(formatPodcast(podcastMock)).toEqual({
      description: 'description',
      episodes: [
        {
          description: 'description',
          downloaded: true,
          duration: '00:19',
          genres: [],
          id: 'id',
          image: 'image',
          name: 'title',
          podcastName: 'title',
          publishDate: '01/01/2000',
          streamUrlId: 'streamId',
          type: 'podcastEpisode',
        },
      ],
      id: 'id',
      image: 'image',
      lastUpdated: '01 January 2000',
      name: 'title',
      totalDownloadedEpisodes: 1,
      totalEpisodes: 1,
      type: 'podcast',
      url: 'url',
    });
  });

  describe.each([
    [
      'episode',
      {
        episodes: [],
      },
    ],
    [
      'title',
      {
        name: 'Podcast',
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatPodcast({
          ...podcastMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });

  describe('when originalImageUrl is undefined', () => {
    describe('when coverArt is defined', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcast({
            ...podcastMock,
            originalImageUrl: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'image',
          }),
        );
      });
    });

    describe('when coverArt is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcast({
            ...podcastMock,
            coverArt: undefined,
            originalImageUrl: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'PhApplePodcastsLogo',
          }),
        );
      });
    });
  });
});

describe('formatRadioStation', () => {
  it('returns the correct values', () => {
    expect(formatRadioStation(radioStationMock)).toEqual({
      duration: '',
      homePageUrl: 'homepageUrl',
      id: 'id',
      image:
        'https://besticon-demo.herokuapp.com/icon?url=homepageUrl&size=80..250..500',
      name: 'name',
      streamUrlId: 'streamUrl',
      type: 'radioStation',
    });
  });

  describe('when station has homePageUrl value', () => {
    it('returns the correct values', () => {
      expect(
        formatRadioStation({
          ...radioStationMock,
          homePageUrl: 'homePageValue',
        }),
      ).toEqual(
        expect.objectContaining({
          homePageUrl: 'homePageValue',
          image:
            'https://besticon-demo.herokuapp.com/icon?url=homePageValue&size=80..250..500',
        }),
      );
    });
  });

  describe('when both homePageUrl and homepageUrl are undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatRadioStation({
          ...radioStationMock,
          homepageUrl: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          homePageUrl: undefined,
          image: 'PhRadio',
        }),
      );
    });
  });
});

describe('formatTracks', () => {
  it('returns the correct values', () => {
    expect(formatTracks(trackMock)).toEqual({
      album: 'album',
      albumId: 'albumId',
      artists: expect.any(Array),
      discNumber: 1,
      duration: '00:19',
      favourite: true,
      genres: [],
      id: 'id',
      image: 'coverArt',
      information: {
        bitRate: '15 kbps',
        contentType: 'contentType',
        created: '01 January 2000',
        path: 'path',
        playCount: 0,
        suffix: 'suffix',
        transcodedContentType: 'transcodedContentType',
        transcodedSuffix: 'transcodedSuffix',
      },
      name: 'title',
      size: '0.02 KB',
      streamUrlId: 'id',
      trackNumber: 1,
      type: 'track',
      year: 2024,
    });
  });

  describe.each([
    [
      'album',
      {
        album: '--',
      },
    ],
    [
      'bitRate',
      {
        information: expect.objectContaining({
          bitRate: '0 kbps',
        }),
      },
    ],
    [
      'contentType',
      {
        information: expect.objectContaining({
          contentType: '--',
        }),
      },
    ],
    [
      'coverArt',
      {
        image: 'PhMusicNotes',
      },
    ],
    [
      'discNumber',
      {
        discNumber: '--',
      },
    ],
    [
      'path',
      {
        information: expect.objectContaining({
          path: '--',
        }),
      },
    ],
    [
      'playCount',
      {
        information: expect.objectContaining({
          playCount: 0,
        }),
      },
    ],
    [
      'size',
      {
        size: '--',
      },
    ],
    [
      'suffix',
      {
        information: expect.objectContaining({
          suffix: '--',
        }),
      },
    ],
    [
      'track',
      {
        trackNumber: '--',
      },
    ],
    [
      'transcodedContentType',
      {
        information: expect.objectContaining({
          transcodedContentType: '--',
        }),
      },
    ],
    [
      'transcodedSuffix',
      {
        information: expect.objectContaining({
          transcodedSuffix: '--',
        }),
      },
    ],
    [
      'year',
      {
        year: '--',
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatTracks({
          ...trackMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });
});

describe('formatPlaylist', () => {
  it('returns the correct values', () => {
    expect(formatPlaylist(playlistMock)).toEqual({
      duration: '1s',
      id: 'id',
      images: ['coverArt'],
      information: {
        changed: '01 January 2000',
        comment: '',
        created: '01 January 2000',
        owner: 'owner',
        public: true,
      },
      name: 'name',
      trackCount: 1,
      tracks: expect.any(Array),
      type: 'playlist',
    });
  });

  describe.each([
    [
      'name',
      {
        name: '(Unnamed)',
      },
    ],
    [
      'entry',
      {
        tracks: [],
      },
    ],
    [
      'owner',
      {
        information: expect.objectContaining({
          owner: '--',
        }),
      },
    ],
    [
      'public',
      {
        information: expect.objectContaining({
          public: false,
        }),
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });
});
