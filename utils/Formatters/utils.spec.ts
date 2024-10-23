import {
  getAlbumsMock,
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
  getTracksTotal,
  getUniqueGenres,
  getUniqueImages,
} from './utils';

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
        } as AlbumID3),
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
        expect(getArtists({} as AlbumID3)).toEqual([]);
      });
    });

    describe('when artistId and artist are defined', () => {
      it('returns the correct values', () => {
        expect(
          getArtists({
            artist: 'artist',
            artistId: 'artistId',
          } as AlbumID3),
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
        expect(getUniqueImages(getTracksMock())).toEqual(['genre-0']);
      });
    });

    describe('when tracks length is exactly 4', () => {
      it('returns the correct values', () => {
        expect(getUniqueImages(getTracksMock(4))).toEqual([
          'genre-0',
          'genre-1',
          'genre-2',
          'genre-3',
        ]);
      });
    });

    describe('when tracks length is more than 4', () => {
      it('returns the correct values', () => {
        expect(getUniqueImages(getTracksMock(10))).toEqual([
          'genre-0',
          'genre-1',
          'genre-2',
          'genre-3',
        ]);
      });
    });

    describe('When all values are the same', () => {
      it('returns the correct values', () => {
        expect(
          getUniqueImages(getTracksMock(10, { coverArt: 'sameId' })),
        ).toEqual(['sameId']);
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
