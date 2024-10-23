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

const { genres, getGenres, getMediaByGenre } = useGenre();

describe('useGenre', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default genres value', () => {
    expect(genres.value).toEqual([]);
  });

  describe('when the getGenres function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getGenres();
      });

      it('does not add to the genres value', () => {
        expect(genres.value).toEqual([]);
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

        getGenres();
      });

      it('adds to the genres value', () => {
        expect(genres.value).toEqual([
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
              noLoading: false,
              offset: 0,
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is set', () => {
        describe('when offset is 0', () => {
          beforeEach(() => {
            getMediaByGenre({
              genre: 'soundtrack',
              mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
              offset: 0,
            });
          });

          it('calls the fetchData function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith('/getSongsByGenre', {
              params: {
                count: 50,
                genre: 'soundtrack',
                mediaType: 'tracks',
                noLoading: false,
                offset: 0,
              },
              transform: expect.any(Function),
            });
          });
        });

        describe('when offset is greater than 0', () => {
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
                noLoading: true,
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
