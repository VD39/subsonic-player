import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import {
  artistDataMock,
  artistInfo2Mock,
  similarSongsMock,
} from '@/test/fixtures';
import {
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { useArtist } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

describe('useArtist', () => {
  let composable: ReturnType<typeof useArtist>;

  beforeEach(() => {
    composable = useArtist();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getArtists function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtists()).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      const artists = getFormattedArtistsMock(3);

      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: artists,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtists()).toEqual(artists);
      });
    });
  });

  describe('when the getArtist function is called', () => {
    describe('when getArtistInfo2 response returns null', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: null,
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
          });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtist('id')).toBeNull();
      });
    });

    describe('when getArtist response returns null', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: {
              artistInfo2: artistInfo2Mock,
            },
          })
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: {
              similarSongs2: similarSongsMock,
            },
          });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtist('id')).toBeNull();
      });
    });

    describe('when getSimilarSongs2 response returns null', () => {
      beforeEach(() => {
        fetchDataMock
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
          });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtist('id')).toEqual(
          expect.objectContaining({
            id: artistDataMock.id,
            similarTracks: [],
            topTracks: [],
          }),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      let artist: Artist | null;

      beforeEach(async () => {
        fetchDataMock
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
          });

        artist = await composable.getArtist('id');
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getArtistInfo2', {
          query: {
            id: 'id',
          },
        });
        expect(fetchDataMock).toHaveBeenCalledWith('/getArtist', {
          query: {
            id: 'id',
          },
        });
        expect(fetchDataMock).toHaveBeenCalledWith('/getSimilarSongs2', {
          query: {
            count: PREVIEW_TRACK_COUNT,
            id: 'id',
          },
        });
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledTimes(3);
      });

      it('returns the correct response', () => {
        expect(artist).toEqual(
          formatArtist({
            ...artistInfo2Mock,
            ...artistDataMock,
            similarSongs: similarSongsMock.song,
          }),
        );
      });
    });
  });

  describe('when the getTopSongs function is called', () => {
    describe('when artist is not set', () => {
      let tracks: Track[];

      beforeEach(async () => {
        tracks = await composable.getTopSongs('');
      });

      it('returns the correct response', () => {
        expect(tracks).toEqual([]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when artist is set', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.getTopSongs(artistDataMock.name);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getTopSongs', {
          query: {
            artist: artistDataMock.name,
            count: PREVIEW_TRACK_COUNT,
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getTopSongs(artistDataMock.name)).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      const tracks = getFormattedTracksMock(3);

      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: tracks,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getTopSongs(artistDataMock.name)).toEqual(
          tracks,
        );
      });
    });
  });
});
