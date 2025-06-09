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
          query: 'query',
        } as SearchParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
          params: {
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
            offset: 1,
            query: 'query',
          } as SearchParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
            params: {
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

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await search({} as SearchParams)).toEqual(DEFAULT_ALL_MEDIA);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            album: [
              {
                id: 'album',
              },
            ],
            artist: [
              {
                id: 'album',
              },
            ],
            song: [
              {
                id: 'album',
              },
            ],
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await search({} as SearchParams)).toEqual({
          album: [
            {
              id: 'album',
            },
          ],
          artist: [
            {
              id: 'album',
            },
          ],
          song: [
            {
              id: 'album',
            },
          ],
        });
      });
    });
  });
});
