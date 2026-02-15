import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useSearch } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { search } = useSearch();

describe('useSearch', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the search function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(() => {
        search({
          mediaType: 'albums',
          query: 'query',
        } as SearchParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
          query: {
            albumCount: '50',
            albumOffset: 0,
            artistCount: '50',
            artistOffset: 0,
            query: 'query',
            songCount: '50',
            songOffset: 0,
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when offset is set', () => {
      describe('when offset is 1', () => {
        beforeEach(() => {
          search({
            mediaType: 'albums',
            offset: 1,
            query: 'query',
          } as SearchParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
            query: {
              albumCount: '50',
              albumOffset: 1,
              artistCount: '50',
              artistOffset: 1,
              query: 'query',
              songCount: '50',
              songOffset: 1,
            },
            transform: expect.any(Function),
          });
        });
      });
    });

    describe.each([
      [
        ROUTE_MEDIA_TYPE_PARAMS.Albums,
        {
          id: 'albums',
        },
      ],
      [
        ROUTE_MEDIA_TYPE_PARAMS.Artists,
        {
          id: 'artists',
        },
      ],
      [
        ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        {
          id: 'tracks',
        },
      ],
    ])(`when route mediaType is %s`, (mediaType, outcome) => {
      describe('when fetchData response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });
        });

        it('returns the correct response', async () => {
          expect(
            await search({
              mediaType,
              query: 'query',
            } as SearchParams),
          ).toEqual([]);
        });
      });

      describe('when fetchData response returns an array', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              albums: [
                {
                  id: 'albums',
                },
              ],
              artists: [
                {
                  id: 'artists',
                },
              ],
              tracks: [
                {
                  id: 'tracks',
                },
              ],
            },
          });
        });

        it('returns the correct response', async () => {
          expect(
            await search({
              mediaType,
              query: 'query',
            } as SearchParams),
          ).toEqual([outcome]);
        });
      });
    });
  });
});
