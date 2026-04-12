import {
  artistDataMock,
  artistInfo2Mock,
  similarSongsMock,
  topSongsMock,
} from '@/test/fixtures';

import { fetchAndMergeArtistData } from './artist';

const fetchFnMock = vi.fn();

describe('fetchAndMergeArtistData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when getArtistInfo2 returns null', () => {
    beforeEach(() => {
      fetchFnMock
        .mockResolvedValueOnce({
          data: null,
        })
        .mockResolvedValueOnce({
          data: {
            artist: {
              name: 'name',
            },
          },
        });
    });

    it('returns the correct response', async () => {
      expect(await fetchAndMergeArtistData('id', fetchFnMock)).toBe(null);
    });
  });

  describe('when getArtist returns null', () => {
    beforeEach(() => {
      fetchFnMock
        .mockResolvedValueOnce({
          data: {
            artistInfo2: {
              id: 'id',
            },
          },
        })
        .mockResolvedValueOnce({
          data: null,
        });
    });

    it('returns the correct response', async () => {
      expect(await fetchAndMergeArtistData('id', fetchFnMock)).toBe(null);
    });
  });

  describe('when getArtistInfo2 and getArtist return a value', () => {
    describe('when getSimilarSongs2 and getTopSongs return null', () => {
      beforeEach(() => {
        fetchFnMock
          .mockResolvedValueOnce({
            data: {
              artistInfo2: artistInfo2Mock,
            },
          })
          .mockResolvedValueOnce({
            data: {
              artist: artistDataMock,
            },
          })
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: null,
          });
      });

      it('returns the correct response', async () => {
        expect(await fetchAndMergeArtistData('id', fetchFnMock)).toEqual(
          expect.objectContaining({
            id: 'id',
            musicBrainzUrl: 'https://musicbrainz.org/artist/musicBrainzId',
            name: 'name',
            similarTracks: [],
            topTracks: [],
          }),
        );
      });
    });

    describe('when getSimilarSongs2 returns a value', () => {
      beforeEach(() => {
        fetchFnMock
          .mockResolvedValueOnce({
            data: {
              artistInfo2: artistInfo2Mock,
            },
          })
          .mockResolvedValueOnce({
            data: {
              artist: artistDataMock,
            },
          })
          .mockResolvedValueOnce({
            data: {
              similarSongs2: similarSongsMock,
            },
          })
          .mockResolvedValueOnce({
            data: null,
          });
      });

      it('returns the correct response', async () => {
        expect(await fetchAndMergeArtistData('id', fetchFnMock)).toEqual(
          expect.objectContaining({
            similarTracks: [
              expect.objectContaining({
                id: 'id',
                name: 'title',
              }),
            ],
          }),
        );
      });
    });

    describe('when getTopSongs returns a value', () => {
      beforeEach(() => {
        fetchFnMock
          .mockResolvedValueOnce({
            data: {
              artistInfo2: artistInfo2Mock,
            },
          })
          .mockResolvedValueOnce({
            data: {
              artist: artistDataMock,
            },
          })
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: {
              topSongs: topSongsMock,
            },
          });
      });

      it('returns the correct response', async () => {
        expect(await fetchAndMergeArtistData('id', fetchFnMock)).toEqual(
          expect.objectContaining({
            topTracks: [
              expect.objectContaining({
                id: 'id',
                name: 'title',
              }),
            ],
          }),
        );
      });
    });
  });
});
