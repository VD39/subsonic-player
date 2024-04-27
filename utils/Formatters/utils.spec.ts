import { formatArtists, formatGenres, getImages } from './utils';

function setTracks(length = 1, coverArtId = '') {
  return Array(length)
    .fill('')
    .map((_item, index) => ({
      coverArt: coverArtId || `genre-${index}`,
    })) as unknown as ResponseSong[];
}

describe('formatArtists', () => {
  describe('when artist is an array', () => {
    it('returns correct values', () => {
      expect(
        formatArtists({
          artists: [
            {
              id: 'id',
              name: 'name',
            },
          ],
        } as unknown as ResponseAlbum),
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
      it('returns correct values', () => {
        expect(formatArtists({} as unknown as ResponseAlbum)).toEqual([]);
      });
    });

    describe('when artistId and artist are defined', () => {
      it('returns correct values', () => {
        expect(
          formatArtists({
            artist: 'artist',
            artistId: 'artistId',
          } as unknown as ResponseAlbum),
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

describe('formatGenres', () => {
  describe('when genre is an array', () => {
    it('returns correct values', () => {
      expect(
        formatGenres({
          genres: [
            {
              name: 'name',
            },
          ],
        } as unknown as ResponseAlbum),
      ).toEqual([
        {
          name: 'name',
        },
      ]);
    });
  });

  describe('when genre is not an array', () => {
    describe('when genre is undefined', () => {
      it('returns correct values', () => {
        expect(formatGenres({} as unknown as ResponseAlbum)).toEqual([]);
      });
    });

    describe('when genre is defined', () => {
      it('returns correct values', () => {
        expect(
          formatGenres({
            genre: 'genre',
          } as unknown as ResponseAlbum),
        ).toEqual([
          {
            name: 'genre',
          },
        ]);
      });
    });
  });
});

describe('getImages', () => {
  describe('when tracks length is less than 4', () => {
    it('returns correct values', () => {
      expect(getImages(setTracks())).toEqual(['genre-0']);
    });
  });

  describe('when tracks length is exactly 4', () => {
    it('returns correct values', () => {
      expect(getImages(setTracks(4))).toEqual([
        'genre-0',
        'genre-1',
        'genre-2',
        'genre-3',
      ]);
    });
  });

  describe('when tracks length is more than 4', () => {
    it('returns correct values', () => {
      expect(getImages(setTracks(10))).toEqual([
        'genre-0',
        'genre-1',
        'genre-2',
        'genre-3',
      ]);
    });
  });

  describe('When all values are the same', () => {
    it('returns correct values', () => {
      expect(getImages(setTracks(10, 'sameId'))).toEqual(['sameId']);
    });
  });
});
