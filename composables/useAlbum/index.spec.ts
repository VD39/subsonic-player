import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useAlbum } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: {
      name: 'name',
    },
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

describe('useAlbum', () => {
  let composable: ReturnType<typeof useAlbum>;

  beforeAll(() => {
    composable = useAlbum();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default frequentAlbums value', () => {
    expect(composable.frequentAlbums.value).toEqual([]);
  });

  it('sets the default newestAlbums value', () => {
    expect(composable.newestAlbums.value).toEqual([]);
  });

  it('sets the default recentAlbums value', () => {
    expect(composable.recentAlbums.value).toEqual([]);
  });

  describe('when the getAlbums function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(() => {
        composable.getAlbums({} as AlbumsParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
          query: {
            offset: 0,
            size: 50,
            type: 'random',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when offset is set', () => {
      describe('when offset is 1', () => {
        beforeEach(() => {
          composable.getAlbums({
            offset: 1,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            query: {
              offset: 1,
              size: 50,
              type: 'random',
            },
            transform: expect.any(Function),
          });
        });
      });
    });

    describe('when size is not set', () => {
      beforeEach(() => {
        composable.getAlbums({} as AlbumsParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
          query: {
            offset: 0,
            size: 50,
            type: 'random',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when size is set', () => {
      describe('when size is 21', () => {
        beforeEach(() => {
          composable.getAlbums({
            size: 21,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            query: {
              offset: 0,
              size: 21,
              type: 'random',
            },
            transform: expect.any(Function),
          });
        });
      });
    });

    describe('when type is not set', () => {
      beforeEach(() => {
        composable.getAlbums({} as AlbumsParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
          query: {
            offset: 0,
            size: 50,
            type: 'random',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when type is set', () => {
      describe.each([
        ...Object.entries(ALBUMS_SORT_BY),
        ['sort-type-value', 'sort-type-value'],
      ])('when type is %s', (type, paramType) => {
        beforeEach(() => {
          composable.getAlbums({
            type,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            query: {
              offset: 0,
              size: 50,
              type: paramType,
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
        expect(await composable.getAlbums({} as AlbumsParams)).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getAlbums({} as AlbumsParams)).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getAlbum function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getAlbum('id')).toBeNull();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getAlbum('id')).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the loadDashboardAlbums function is called', () => {
    beforeEach(async () => {
      fetchDataMock
        .mockResolvedValueOnce({
          data: [
            {
              id: 'frequent-1',
              name: 'Frequent Album',
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 'newest-1',
              name: 'Newest Album',
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 'recent-1',
              name: 'Recent Album',
            },
          ],
        });

      await composable.loadDashboardAlbums();
    });

    it('calls fetchData for frequent albums with correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
        query: {
          offset: 0,
          size: 20,
          type: 'frequent',
        },
        transform: expect.any(Function),
      });
    });

    it('calls fetchData for newest albums with correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
        query: {
          offset: 0,
          size: 20,
          type: 'newest',
        },
        transform: expect.any(Function),
      });
    });

    it('calls fetchData for recent albums with correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
        query: {
          offset: 0,
          size: 20,
          type: 'recent',
        },
        transform: expect.any(Function),
      });
    });

    it('sets frequentAlbums value correctly', () => {
      expect(composable.frequentAlbums.value).toEqual([
        {
          id: 'frequent-1',
          name: 'Frequent Album',
        },
      ]);
    });

    it('sets newestAlbums value correctly', () => {
      expect(composable.newestAlbums.value).toEqual([
        {
          id: 'newest-1',
          name: 'Newest Album',
        },
      ]);
    });

    it('sets recentAlbums value correctly', () => {
      expect(composable.recentAlbums.value).toEqual([
        {
          id: 'recent-1',
          name: 'Recent Album',
        },
      ]);
    });
  });

  describe('when the resetAlbums function is called', () => {
    beforeEach(() => {
      composable.resetAlbums();
    });

    it('sets the frequentAlbums value to the default value', () => {
      expect(composable.frequentAlbums.value).toEqual([]);
    });

    it('sets the newestAlbums value to the default value', () => {
      expect(composable.newestAlbums.value).toEqual([]);
    });

    it('sets the recentAlbums value to the default value', () => {
      expect(composable.recentAlbums.value).toEqual([]);
    });
  });
});
