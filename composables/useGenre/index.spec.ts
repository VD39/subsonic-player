import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useGenre } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const getAlbumsMock = vi.fn(() => ['albums']);

mockNuxtImport('useAlbum', () => () => ({
  getAlbums: getAlbumsMock,
}));

const { getGenres, getMediaByGenre } = useGenre();

describe('useGenre', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getGenres function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getGenres()).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name',
            },
          ],
        });
      });

      it('returns the correct response', async () => {
        expect(await getGenres()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the getMediaByGenre function is called', () => {
    let results: Awaited<ReturnType<typeof getMediaByGenre>>;

    describe('when mediaType is albums', () => {
      beforeEach(async () => {
        results = await getMediaByGenre({
          genre: 'soundtrack',
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Albums,
        });
      });

      it('calls the getAlbums function', () => {
        expect(getAlbumsMock).toHaveBeenCalled();
      });

      it('returns the correct value', async () => {
        expect(results).toEqual(['albums']);
      });
    });

    describe('when mediaType is tracks', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: ['tracks'],
        });

        results = await getMediaByGenre({
          genre: 'soundtrack',
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        });
      });

      it('returns the correct value', async () => {
        expect(results).toEqual(['tracks']);
      });

      describe('when offset is not set', () => {
        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getSongsByGenre', {
            params: {
              count: 50,
              genre: 'soundtrack',
              mediaType: 'tracks',
              offset: 0,
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is set', () => {
        describe('when offset is greater than 1', () => {
          beforeEach(() => {
            getMediaByGenre({
              genre: 'soundtrack',
              mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
              offset: 1,
            });
          });

          it('calls the fetchData function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith('/getSongsByGenre', {
              params: {
                count: 50,
                genre: 'soundtrack',
                mediaType: 'tracks',
                offset: 1,
              },
              transform: expect.any(Function),
            });
          });
        });
      });
    });

    describe('when mediaType is not albums or tracks', () => {
      it('returns the correct value', async () => {
        expect(await getMediaByGenre({} as MediaByGenreParams)).toEqual([]);
      });
    });
  });
});
