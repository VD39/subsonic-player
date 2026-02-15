import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

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

    describe(`when route media type is ${ROUTE_MEDIA_TYPE_PARAMS.Albums}`, () => {
      beforeEach(async () => {
        results = await getMediaByGenre({
          genre: 'soundtrack',
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Albums,
        });
      });

      it('calls the getAlbums function', () => {
        expect(getAlbumsMock).toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(results).toEqual(['albums']);
      });
    });

    describe(`when route media type is ${ROUTE_MEDIA_TYPE_PARAMS.Tracks}`, () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: ['tracks'],
        });

        results = await getMediaByGenre({
          genre: 'soundtrack',
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        });
      });

      it('returns the correct value', () => {
        expect(results).toEqual(['tracks']);
      });

      describe('when offset is not set', () => {
        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getSongsByGenre', {
            query: {
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
              query: {
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

    describe(`when route media type is not ${ROUTE_MEDIA_TYPE_PARAMS.Albums} or ${ROUTE_MEDIA_TYPE_PARAMS.Tracks}`, () => {
      it('returns the correct value', async () => {
        expect(await getMediaByGenre({} as MediaByGenreParams)).toEqual([]);
      });
    });
  });
});
