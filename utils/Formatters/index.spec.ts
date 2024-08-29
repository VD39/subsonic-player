import {
  albumMock,
  artistMock,
  DATE,
  genreMock,
  playlistMock,
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
  formatRadioStation,
  formatTracks,
} from './index';

describe('formatAlbum', () => {
  it('returns the correct values', () => {
    expect(formatAlbum(albumMock)).toEqual({
      artists: expect.any(Array),
      created: 'id',
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
      songCount: 4,
      tracks: expect.any(Array),
      type: 'album',
      year: 2024,
    });
  });

  describe('when starred is not undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatAlbum({
          ...albumMock,
          starred: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: false,
        }),
      );
    });
  });

  describe('when starred is not defined', () => {
    it('returns the correct values', () => {
      expect(
        formatAlbum({
          ...albumMock,
          starred: DATE,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: true,
        }),
      );
    });
  });

  describe('when song is undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatAlbum({
          ...albumMock,
          song: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          tracks: [],
        }),
      );
    });
  });

  describe('when song is defined', () => {
    it('returns the correct values', () => {
      expect(formatAlbum(albumMock)).toEqual(
        expect.objectContaining({
          tracks: [
            expect.objectContaining({
              id: 'id',
            }),
          ],
        }),
      );
    });
  });
});

describe('formatAllMedia', () => {
  describe('when values are undefined', () => {
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

  describe('when values are defined', () => {
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
          created: 'id',
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
          songCount: 4,
          tracks: expect.any(Array),
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
      totalAlbums: 0,
      totalTracks: 4,
      type: 'artist',
    });
  });

  describe('when starred is not undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          starred: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: false,
        }),
      );
    });
  });

  describe('when starred is not defined', () => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          starred: DATE,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: true,
        }),
      );
    });
  });

  describe('when album is undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatArtist({
          ...artistMock,
          album: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          albums: [],
        }),
      );
    });
  });

  describe('when album is defined', () => {
    it('returns the correct values', () => {
      expect(formatArtist(artistMock)).toEqual(
        expect.objectContaining({
          albums: [
            expect.objectContaining({
              id: 'id',
            }),
          ],
        }),
      );
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

  describe('when coverArt is defined', () => {
    it('returns the correct values', () => {
      expect(formatArtist(artistMock)).toEqual(
        expect.objectContaining({
          image: 'coverArt',
        }),
      );
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
            coverArt: undefined,
            artistImageUrl: undefined,
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
      name: 'genre',
      songCount: 0,
      albumCount: 0,
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
        name: 'nameGenre',
        songCount: 0,
        albumCount: 0,
      });
    });
  });
});

describe('formatPodcast', () => {
  it('returns the correct values', () => {
    expect(formatPodcast(podcastMock)).toEqual({
      description: 'description',
      downloadedEpisodes: 1,
      episodes: [
        {
          description: 'description',
          duration: '00:19',
          downloaded: true,
          genres: [],
          id: 'id',
          image: 'image',
          name: 'title',
          publishDate: '01 Jan 2000',
          streamUrl: 'streamUrl',
          type: 'podcastEpisode',
        },
      ],
      id: 'id',
      image: 'image',
      lastUpdated: '01 Jan 2000',
      name: 'title',
      totalEpisodes: 1,
      type: 'podcast',
      url: 'url',
    });
  });

  describe('when title is undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatPodcast({
          ...podcastMock,
          title: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          name: 'Podcast',
        }),
      );
    });
  });

  describe('when episode is undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatPodcast({
          ...podcastMock,
          episode: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          episodes: [],
        }),
      );
    });
  });

  describe('when episode is defined', () => {
    describe('when episode is not downloaded and has no a streamID', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcast({
            ...podcastMock,
            episode: [
              {
                status: 'downloading',
                streamUrl: undefined,
              } as ResponsePodcastEpisode,
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            episodes: [
              expect.objectContaining({
                streamUrl: undefined,
              }),
            ],
          }),
        );
      });
    });

    describe('when episode is downloaded and has a streamID', () => {
      it('returns the correct values', () => {
        expect(
          formatPodcast({
            ...podcastMock,
            episode: [
              {
                status: 'completed',
                streamUrl: 'streamUrl',
              } as ResponsePodcastEpisode,
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            episodes: [
              expect.objectContaining({
                streamUrl: 'streamUrl',
              }),
            ],
          }),
        );
      });
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
            originalImageUrl: undefined,
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
      streamUrl: 'streamUrl',
      type: 'radioStation',
    });
  });

  describe('when station has homePageUrl value', () => {
    it('returns the correct values', () => {
      expect(
        formatRadioStation({
          ...radioStationMock,
          homePageUrl: 'homepageValue',
        }),
      ).toEqual(
        expect.objectContaining({
          homePageUrl: 'homepageValue',
          image:
            'https://besticon-demo.herokuapp.com/icon?url=homepageValue&size=80..250..500',
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
      favourite: false,
      genres: [],
      id: 'id',
      image: 'coverArt',
      information: {
        bitRate: 15,
        contentType: 'contentType',
        created: DATE,
        path: 'path',
        playCount: undefined,
        suffix: 'suffix',
        transcodedContentType: undefined,
        transcodedSuffix: undefined,
      },
      size: '0.02 KB',
      streamUrl: 'id',
      name: 'title',
      trackNumber: 1,
      type: 'track',
      year: 2024,
    });
  });

  describe('when starred is not undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatTracks({
          ...trackMock,
          starred: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: false,
        }),
      );
    });
  });

  describe('when starred is not defined', () => {
    it('returns the correct values', () => {
      expect(
        formatTracks({
          ...trackMock,
          starred: DATE,
        }),
      ).toEqual(
        expect.objectContaining({
          favourite: true,
        }),
      );
    });
  });
});

describe('formatPlaylist', () => {
  it('returns the correct values', () => {
    expect(formatPlaylist(playlistMock)).toEqual({
      duration: '00:01',
      id: 'id',
      images: ['coverArt'],
      information: {
        changed: DATE,
        comment: '',
        created: DATE,
        owner: 'owner',
        public: true,
      },
      name: 'name',
      songCount: 1,
      tracks: expect.any(Array),
      type: 'playlist',
    });
  });

  describe('when name is not defined', () => {
    it('returns the correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          name: '',
        }),
      ).toEqual(
        expect.objectContaining({
          name: '(Unnamed)',
        }),
      );
    });
  });

  describe('when entry is undefined', () => {
    it('returns the correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          entry: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          tracks: [],
        }),
      );
    });
  });

  describe('when entry is defined', () => {
    it('returns the correct values', () => {
      expect(formatPlaylist(playlistMock)).toEqual(
        expect.objectContaining({
          tracks: [
            expect.objectContaining({
              id: 'id',
            }),
          ],
        }),
      );
    });
  });
});
