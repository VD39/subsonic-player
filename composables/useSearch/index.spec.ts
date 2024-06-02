import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { DataMock } from '@/test/types';
import { useSearch } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { search, searchResults } = useSearch();

describe('useSearch', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default searchResults value', () => {
    expect(searchResults.value).toEqual(DEFAULT_ALL_MEDIA);
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
            noLoading: false,
            query: 'query',
            songCount: '50',
            songOffset: 0,
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when offset is set', () => {
      describe('when offset is 0', () => {
        beforeEach(() => {
          search({
            query: 'query',
            offset: 0,
          } as SearchParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
            params: {
              albumCount: '50',
              albumOffset: 0,
              artistCount: '50',
              artistOffset: 0,
              noLoading: false,
              query: 'query',
              songCount: '50',
              songOffset: 0,
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is greater than 0', () => {
        beforeEach(() => {
          search({
            query: 'query',
            offset: 1,
          } as SearchParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
            params: {
              albumCount: '50',
              albumOffset: 1,
              artistCount: '50',
              artistOffset: 1,
              noLoading: true,
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

        search({} as SearchParams);
      });

      it('does not add to the searchResults value', () => {
        expect(searchResults.value).toEqual(DEFAULT_ALL_MEDIA);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            artist: [
              {
                id: 'album',
              },
            ],
            album: [
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

        search({} as SearchParams);
      });

      it('adds to the searchResults value', () => {
        expect(searchResults.value).toEqual({
          artist: [
            {
              id: 'album',
            },
          ],
          album: [
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
