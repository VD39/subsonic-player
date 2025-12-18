import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useAlbum } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: {
    name: 'name',
  },
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { getAlbum, getAlbums } = useAlbum();

describe('useAlbum', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getAlbums function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(() => {
        getAlbums({} as AlbumsParams);
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
          getAlbums({
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
        getAlbums({} as AlbumsParams);
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
          getAlbums({
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
        getAlbums({} as AlbumsParams);
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
          getAlbums({
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
        expect(await getAlbums({} as AlbumsParams)).toEqual([]);
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
        expect(await getAlbums({} as AlbumsParams)).toEqual({
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
        expect(await getAlbum('id')).toEqual(null);
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
        expect(await getAlbum('id')).toEqual({
          name: 'name',
        });
      });
    });
  });
});
