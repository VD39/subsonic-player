import {
  getAlbumsMock,
  getFormattedPodcastEpisodesMock,
  getFormattedTracksMock,
  getPodcastEpisodesMock,
  getTracksMock,
} from '@/test/helpers';

import {
  getAlbumSize,
  getArtists,
  getDownloadedEpisodesLength,
  getEarliestDate,
  getGenres,
  getRandomTracksDuration,
  getSortedPodcastEpisodes,
  getTracksTotal,
  getUniqueGenres,
  getUniqueImages,
  groupTracksByDiscNumber,
  sortPodcastEpisodes,
} from './utils';

const downloadedPodcastEpisodes = getFormattedPodcastEpisodesMock(2, {
  downloaded: true,
});

const nonDownloadedPodcastEpisodes = getFormattedPodcastEpisodesMock(3, {
  downloaded: false,
});

const podcastEpisodes = [
  ...downloadedPodcastEpisodes,
  ...nonDownloadedPodcastEpisodes,
];

describe('getArtists', () => {
  describe('when artist is an array', () => {
    it('returns the correct values', () => {
      expect(
        getArtists({
          artists: [
            {
              id: 'id',
              name: 'name',
            },
          ],
        } as AlbumWithSongsID3),
      ).toEqual([
        {
          id: 'id',
          name: 'name',
        },
      ]);
    });
  });

  describe('when artist is not an array', () => {
    describe('when artistId and artist are undefined', () => {
      it('returns the correct values', () => {
        expect(getArtists({} as AlbumWithSongsID3)).toEqual([]);
      });
    });

    describe('when artistId and artist are defined', () => {
      it('returns the correct values', () => {
        expect(
          getArtists({
            artist: 'artist',
            artistId: 'artistId',
          } as AlbumWithSongsID3),
        ).toEqual([
          {
            id: 'artistId',
            name: 'artist',
          },
        ]);
      });
    });
  });
});

describe('getGenres', () => {
  describe('when genre is an array', () => {
    it('returns the correct values', () => {
      expect(
        getGenres({
          genres: [
            {
              name: 'name',
            },
          ],
        } as Base),
      ).toEqual([
        {
          name: 'name',
        },
      ]);
    });
  });

  describe('when genre is not an array', () => {
    describe('when genre is undefined', () => {
      it('returns the correct values', () => {
        expect(getGenres({} as Base)).toEqual([]);
      });
    });

    describe('when genre is defined', () => {
      it('returns the correct values', () => {
        expect(
          getGenres({
            genre: 'genre',
          } as Base),
        ).toEqual([
          {
            name: 'genre',
          },
        ]);
      });
    });
  });
});

describe('getUniqueImages', () => {
  describe('when tracks is undefined', () => {
    it('returns the correct values', () => {
      expect(getUniqueImages()).toEqual([ICONS.playlist]);
    });
  });

  describe('when tracks is defined', () => {
    describe('when tracks length is less than 4', () => {
      it('returns the correct values', () => {
        expect(getUniqueImages(getFormattedTracksMock(1))).toEqual(['image-0']);
      });
    });

    describe('when tracks length is exactly 4', () => {
      it('returns the correct values', () => {
        expect(getUniqueImages(getFormattedTracksMock(4))).toEqual([
          'image-0',
          'image-1',
          'image-2',
          'image-3',
        ]);
      });
    });

    describe('when tracks length is more than 4', () => {
      it('returns the correct values', () => {
        expect(getUniqueImages(getFormattedTracksMock(10))).toEqual([
          'image-0',
          'image-1',
          'image-2',
          'image-3',
        ]);
      });
    });

    describe('When all values are the same', () => {
      it('returns the correct values', () => {
        expect(
          getUniqueImages(getFormattedTracksMock(10, { image: 'image' })),
        ).toEqual(['image']);
      });
    });
  });
});

describe('getUniqueGenres', () => {
  describe('when albums is undefined', () => {
    it('returns the correct values', () => {
      expect(getUniqueGenres()).toEqual([]);
    });
  });

  describe('when albums is defined', () => {
    describe('when genres is undefined', () => {
      it('returns the correct values', () => {
        expect(
          getUniqueGenres(
            getAlbumsMock(5, {
              genres: undefined,
            }),
          ),
        ).toEqual([]);
      });
    });

    describe('when genres contains different values', () => {
      it('returns the correct values', () => {
        expect(getUniqueGenres(getAlbumsMock(5))).toEqual([
          {
            name: 'genre',
          },
          {
            name: 'genre1',
          },
        ]);
      });
    });

    describe('When all genres values are the same', () => {
      it('returns the correct values', () => {
        expect(
          getUniqueGenres([
            ...getAlbumsMock(2, {
              genres: [
                {
                  name: 'genre',
                },
                {
                  name: 'another-genre',
                },
              ],
            }),
            ...getAlbumsMock(2, {
              genres: [
                {
                  name: 'genre',
                },
                {
                  name: 'another-genre',
                },
              ],
            }),
          ]),
        ).toEqual([
          {
            name: 'genre',
          },
          {
            name: 'another-genre',
          },
        ]);
      });
    });
  });
});

describe('getAlbumSize', () => {
  describe('when tracks is undefined', () => {
    it('returns the correct values', () => {
      expect(getAlbumSize()).toEqual(0);
    });
  });

  describe('when tracks is defined', () => {
    describe('when size is undefined', () => {
      it('returns the correct values', () => {
        expect(
          getAlbumSize(
            getTracksMock(5, {
              size: undefined,
            }),
          ),
        ).toEqual(0);
      });
    });

    describe('when size is defined', () => {
      it('returns the correct values', () => {
        expect(getAlbumSize(getTracksMock(5))).toEqual(80);
      });
    });
  });
});

describe('getTracksTotal', () => {
  describe('when albums is undefined', () => {
    it('returns the correct values', () => {
      expect(getTracksTotal()).toEqual(0);
    });
  });

  describe('when albums is defined', () => {
    it('returns the correct values', () => {
      expect(getTracksTotal(getAlbumsMock(5))).toEqual(20);
    });
  });
});

describe('getEarliestDate', () => {
  describe('when podcast episodes is undefined', () => {
    it('returns the correct values', () => {
      expect(getEarliestDate()).toEqual(undefined);
    });
  });

  describe('when podcast episodes is defined', () => {
    describe('when podcast episodes is an empty array', () => {
      it('returns the correct values', () => {
        expect(getEarliestDate([])).toEqual(undefined);
      });
    });

    describe('when podcast episodes is not an empty array', () => {
      describe('when podcast episodes does not contain published dates', () => {
        it('returns the correct values', () => {
          expect(
            getEarliestDate([
              ...getPodcastEpisodesMock(1, {
                publishDate: undefined,
              }),
            ]),
          ).toEqual(undefined);
        });
      });

      describe('when podcast episodes contains published dates', () => {
        it('returns the correct values', () => {
          expect(
            getEarliestDate([
              ...getPodcastEpisodesMock(1, {
                publishDate: new Date(2024, 0, 1),
              }),
              ...getPodcastEpisodesMock(1, {
                publishDate: new Date(2024, 0, 2),
              }),
              ...getPodcastEpisodesMock(1, {
                publishDate: new Date(2024, 0, 3),
              }),
              ...getPodcastEpisodesMock(1, {
                publishDate: new Date(2023, 0, 3),
              }),
            ]),
          ).toEqual(new Date(2024, 0, 3));
        });
      });
    });
  });
});

describe('getDownloadedEpisodesLength', () => {
  describe('when podcast episodes is undefined', () => {
    it('returns the correct values', () => {
      expect(getDownloadedEpisodesLength()).toEqual(0);
    });
  });

  describe('when podcast episodes is defined', () => {
    describe('when podcast episodes is an empty array', () => {
      it('returns the correct values', () => {
        expect(getDownloadedEpisodesLength([])).toEqual(0);
      });
    });

    describe('when podcast episodes is not an empty array', () => {
      describe('when podcast episodes does not contain downloaded episodes', () => {
        it('returns the correct values', () => {
          expect(
            getDownloadedEpisodesLength([
              ...getPodcastEpisodesMock(2, {
                status: 'downloading',
              }),
            ]),
          ).toEqual(0);
        });
      });

      describe('when podcast episodes contains downloaded episodes', () => {
        it('returns the correct values', () => {
          expect(
            getDownloadedEpisodesLength([...getPodcastEpisodesMock(5)]),
          ).toEqual(5);
        });
      });
    });
  });
});

describe('getRandomTracksDuration', () => {
  describe('when tracks is undefined', () => {
    it('returns the correct values', () => {
      expect(getRandomTracksDuration()).toEqual(0);
    });
  });

  describe('when tracks is defined', () => {
    describe('when duration is undefined', () => {
      it('returns the correct values', () => {
        expect(
          getRandomTracksDuration(
            getTracksMock(5, {
              duration: undefined,
            }),
          ),
        ).toEqual(0);
      });
    });

    describe('when duration is defined', () => {
      it('returns the correct values', () => {
        expect(getRandomTracksDuration(getTracksMock(10))).toEqual(190);
      });
    });
  });
});

describe('groupTracksByDiscNumber', () => {
  describe('when tracks is undefined', () => {
    it('returns the correct values', () => {
      expect(groupTracksByDiscNumber()).toEqual({});
    });
  });

  describe('when tracks is not undefined', () => {
    it('returns the correct values', () => {
      expect(
        groupTracksByDiscNumber([
          ...getFormattedTracksMock(4),
          ...getFormattedTracksMock(2, {
            discNumber: 2,
          }),
          ...getFormattedTracksMock(3, {
            discNumber: 3,
          }),
          ...getFormattedTracksMock(5, {
            discNumber: 4,
          }),
        ]),
      ).toEqual({
        'Disc 1': [
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        ],
        'Disc 2': [expect.any(Object), expect.any(Object)],
        'Disc 3': [expect.any(Object), expect.any(Object), expect.any(Object)],
        'Disc 4': [
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        ],
      });
    });
  });
});

describe('sortPodcastEpisodes', () => {
  describe.each([
    [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded, [], []],
    [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'], [], []],
    [ROUTE_PODCAST_SORT_BY_PARAMS.All, [], []],
    [
      ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded,
      podcastEpisodes,
      downloadedPodcastEpisodes,
    ],
    [
      ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'],
      podcastEpisodes,
      nonDownloadedPodcastEpisodes,
    ],
    [ROUTE_PODCAST_SORT_BY_PARAMS.All, podcastEpisodes, podcastEpisodes],
  ])('when status is %s', (status, podcastEpisodes, output) => {
    it('returns the correct sorted values', () => {
      expect(sortPodcastEpisodes(podcastEpisodes, status)).toEqual(output);
    });
  });
});

describe('getSortedPodcastEpisodes', () => {
  describe('when podcast episodes is undefined', () => {
    it('returns the correct response', () => {
      expect(getSortedPodcastEpisodes(undefined)).toEqual({
        [ROUTE_PODCAST_SORT_BY_PARAMS.All]: [],
        [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded]: [],
        [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']]: [],
      });
    });
  });

  describe('when podcast episodes is an empty array', () => {
    it('returns the correct response', () => {
      expect(getSortedPodcastEpisodes([])).toEqual({
        [ROUTE_PODCAST_SORT_BY_PARAMS.All]: [],
        [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded]: [],
        [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']]: [],
      });
    });
  });

  describe('when podcast episodes is not an empty array', () => {
    it('returns the correct response', () => {
      expect(getSortedPodcastEpisodes(podcastEpisodes)).toEqual({
        [ROUTE_PODCAST_SORT_BY_PARAMS.All]: podcastEpisodes,
        [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded]: downloadedPodcastEpisodes,
        [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']]:
          nonDownloadedPodcastEpisodes,
      });
    });
  });
});
