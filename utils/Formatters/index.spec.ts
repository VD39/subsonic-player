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
      totalDiscNumber: 1,
      trackCount: 4,
      tracks: expect.any(Array),
      tracksByDiscNumber: expect.any(Object),
      type: 'album',
      year: 2024,
    });
  });

  describe.each([
    [
      'coverArt',
      {
        image: IMAGE_DEFAULT_BY_TYPE.album,
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
        year: DEFAULT_VALUE,
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
          totalDiscNumber: 1,
          trackCount: 4,
          tracks: expect.any(Array),
          tracksByDiscNumber: expect.any(Object),
          type: 'album',
          year: 2024,
        },
      ],
      biography: undefined,
      favourite: true,
      genres: expect.any(Array),
      id: 'id',
      image: 'coverArt',
      lastFmUrl: undefined,
      musicBrainzUrl: undefined,
      name: 'name',
      similarArtist: [],
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
        name: DEFAULT_VALUE,
      },
    ],
    [
      'starred',
      {
        favourite: false,
      },
    ],
    [
      'similarArtist',
      {
        similarArtist: [],
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

  describe.each([
    [
      'musicBrainzId',
      'musicBrainzId',
      {
        musicBrainzUrl: 'https://musicbrainz.org/artist/musicBrainzId',
      },
    ],
    [
      'albumCount',
      8,
      {
        totalAlbums: 8,
      },
    ],
  ])('when %s is defined', (key, value, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          [key]: value,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });

  describe('when coverArt is undefined', () => {
    describe('when artistImageUrl is defined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            coverArt: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: 'artistImageUrl',
          }),
        );
      });
    });

    describe('when artistImageUrl is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            artistImageUrl: undefined,
            coverArt: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            image: IMAGE_DEFAULT_BY_TYPE.artist,
          }),
        );
      });
    });
  });

  describe('when similarArtist is defined', () => {
    describe('when coverArt is defined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            similarArtist: [
              {
                ...artistMock,
                coverArt: 'coverArt',
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            similarArtist: expect.arrayContaining([
              expect.objectContaining({
                image: 'coverArt',
              }),
            ]),
          }),
        );
      });
    });

    describe('when coverArt is undefined', () => {
      it('returns the correct values', () => {
        expect(
          formatArtist({
            ...artistMock,
            similarArtist: [
              {
                ...artistMock,
                artistImageUrl: undefined,
                coverArt: undefined,
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            similarArtist: expect.arrayContaining([
              expect.objectContaining({
                image: IMAGE_DEFAULT_BY_TYPE.artist,
              }),
            ]),
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
    expect(formatPodcastEpisode(podcastEpisodeMock)).toEqual({
      author: 'artist',
      description: 'description',
      downloaded: true,
      duration: '00:19',
      genres: [],
      id: 'id',
      image: 'coverArt',
      name: 'title',
      podcastId: 'channelId',
      podcastName: 'album',
      publishDate: '01/01/2000',
      streamUrlId: 'streamId',
      trackNumber: 0,
      type: 'podcastEpisode',
    });
  });

  describe.each([
    [
      'artist',
      {
        author: DEFAULT_VALUE,
      },
    ],
    [
      'streamId',
      {
        streamUrlId: 'id',
      },
    ],
    [
      'coverArt',
      {
        image: IMAGE_DEFAULT_BY_TYPE.podcastEpisode,
      },
    ],
    [
      'artist',
      {
        author: DEFAULT_VALUE,
      },
    ],
    [
      'album',
      {
        podcastName: DEFAULT_VALUE,
      },
    ],
  ])('when %s is undefined', (key, outcome) => {
    it('returns the correct values', () => {
      expect(
        formatPodcastEpisode({
          ...podcastEpisodeMock,
          [key]: undefined,
        }),
      ).toEqual(expect.objectContaining(outcome));
    });
  });

  describe('when streamId is defined', () => {
    it('returns the correct values', () => {
      expect(formatPodcastEpisode(podcastEpisodeMock)).toEqual(
        expect.objectContaining({
          streamUrlId: 'streamId',
        }),
      );
    });
  });
});

describe('formatPodcast', () => {
  it('returns the correct values', () => {
    expect(formatPodcast(podcastMock)).toEqual({
      description: 'description',
      episodes: {
        all: [
          {
            author: 'artist',
            description: 'description',
            downloaded: true,
            duration: '00:19',
            genres: [],
            id: 'id',
            image: 'coverArt',
            name: 'title',
            podcastId: 'channelId',
            podcastName: 'album',
            publishDate: '01/01/2000',
            streamUrlId: 'streamId',
            trackNumber: 0,
            type: 'podcastEpisode',
          },
        ],
        downloaded: [
          {
            author: 'artist',
            description: 'description',
            downloaded: true,
            duration: '00:19',
            genres: [],
            id: 'id',
            image: 'coverArt',
            name: 'title',
            podcastId: 'channelId',
            podcastName: 'album',
            publishDate: '01/01/2000',
            streamUrlId: 'streamId',
            trackNumber: 0,
            type: 'podcastEpisode',
          },
        ],
        'not-downloaded': [],
      },
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
        episodes: {
          all: [],
          downloaded: [],
          'not-downloaded': [],
        },
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
            image: IMAGE_DEFAULT_BY_TYPE.podcast,
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
      image: IMAGE_DEFAULT_BY_TYPE.radioStation,
      name: 'name',
      streamUrlId: 'streamUrl',
      trackNumber: 0,
      type: 'radioStation',
    });
  });

  describe.todo('when station has homePageUrl value', () => {
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
          image: IMAGE_DEFAULT_BY_TYPE.radioStation,
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
        album: DEFAULT_VALUE,
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
          contentType: DEFAULT_VALUE,
        }),
      },
    ],
    [
      'coverArt',
      {
        image: IMAGE_DEFAULT_BY_TYPE.track,
      },
    ],
    [
      'discNumber',
      {
        discNumber: DEFAULT_VALUE,
      },
    ],
    [
      'path',
      {
        information: expect.objectContaining({
          path: DEFAULT_VALUE,
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
        size: DEFAULT_VALUE,
      },
    ],
    [
      'suffix',
      {
        information: expect.objectContaining({
          suffix: DEFAULT_VALUE,
        }),
      },
    ],
    [
      'track',
      {
        trackNumber: DEFAULT_VALUE,
      },
    ],
    [
      'transcodedContentType',
      {
        information: expect.objectContaining({
          transcodedContentType: DEFAULT_VALUE,
        }),
      },
    ],
    [
      'transcodedSuffix',
      {
        information: expect.objectContaining({
          transcodedSuffix: DEFAULT_VALUE,
        }),
      },
    ],
    [
      'year',
      {
        year: DEFAULT_VALUE,
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

  describe('when station does not have an albumId value', () => {
    describe('when station has a parent value', () => {
      it('returns the correct values', () => {
        expect(
          formatTracks({
            ...trackMock,
            albumId: undefined,
            parent: 'parent',
          }),
        ).toEqual(
          expect.objectContaining({
            albumId: 'parent',
          }),
        );
      });
    });

    describe('when station does not have a parent value', () => {
      it('returns the correct values', () => {
        expect(
          formatTracks({
            ...trackMock,
            albumId: undefined,
            parent: undefined,
          }),
        ).toEqual(
          expect.objectContaining({
            albumId: undefined,
          }),
        );
      });
    });
  });
});

describe('formatPlaylist', () => {
  describe('when entry media type is a podcast episode', () => {
    it('returns the correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          entry: [podcastEpisodeMock],
        }),
      ).toEqual({
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
        tracks: expect.arrayContaining([
          expect.objectContaining({
            type: 'podcastEpisode',
          }),
        ]),
        type: 'playlist',
      });
    });
  });

  describe('when entry media type is not a podcast episode', () => {
    it('returns the correct values', () => {
      expect(formatPlaylist(playlistMock)).toEqual(
        expect.objectContaining({
          tracks: expect.arrayContaining([
            expect.objectContaining({
              type: 'track',
            }),
          ]),
        }),
      );
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
          owner: DEFAULT_VALUE,
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
