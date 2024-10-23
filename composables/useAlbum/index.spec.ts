import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAlbum } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: {
    name: 'name',
  },
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const {
  album,
  frequentAlbums,
  getAlbum,
  getAlbums,
  getFrequentAlbums,
  getNewestAlbums,
  getRandomAlbums,
  getRecentAlbums,
  newestAlbums,
  randomAlbums,
  recentAlbums,
} = useAlbum();

describe('useAlbum', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default album value', () => {
    expect(album.value).toEqual(null);
  });

  describe('when the getAlbums function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(() => {
        getAlbums({} as AlbumsParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
          params: {
            noLoading: false,
            offset: 0,
            size: 50,
            type: 'random',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when offset is set', () => {
      describe('when offset is 0', () => {
        beforeEach(() => {
          getAlbums({
            offset: 0,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            params: {
              noLoading: false,
              offset: 0,
              size: 50,
              type: 'random',
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is greater than 0', () => {
        beforeEach(() => {
          getAlbums({
            offset: 1,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            params: {
              noLoading: true,
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
          params: {
            noLoading: false,
            offset: 0,
            size: 50,
            type: 'random',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when size is set', () => {
      describe('when offset is 0', () => {
        beforeEach(() => {
          getAlbums({
            size: 21,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            params: {
              noLoading: false,
              offset: 0,
              size: 21,
              type: 'random',
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is greater than 0', () => {
        beforeEach(() => {
          getAlbums({
            offset: 1,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            params: {
              noLoading: true,
              offset: 1,
              size: 50,
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
          params: {
            noLoading: false,
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
            params: {
              noLoading: false,
              offset: 0,
              size: 50,
              type: paramType,
            },
            transform: expect.any(Function),
          });
        });
      });

      describe('when offset is greater than 0', () => {
        beforeEach(() => {
          getAlbums({
            offset: 1,
          } as AlbumsParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/getAlbumList2', {
            params: {
              noLoading: true,
              offset: 1,
              size: 50,
              type: 'random',
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

      it('returns the correct value', async () => {
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

      it('returns the correct value', async () => {
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

        getAlbum('id');
      });

      it('sets the correct album value', () => {
        expect(album.value).toEqual(null);
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        getAlbum('id');
      });

      it('sets the correct album value', () => {
        expect(album.value).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getFrequentAlbums function is called', () => {
    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        getFrequentAlbums();
      });

      it('sets the correct frequentAlbums value', () => {
        expect(frequentAlbums.value).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getNewestAlbums function is called', () => {
    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        getNewestAlbums();
      });

      it('sets the correct newestAlbums value', () => {
        expect(newestAlbums.value).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getRecentAlbums function is called', () => {
    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        getRecentAlbums();
      });

      it('sets the correct recentAlbums value', () => {
        expect(recentAlbums.value).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getRandomAlbums function is called', () => {
    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        getRandomAlbums();
      });

      it('sets the correct randomAlbums value', () => {
        expect(randomAlbums.value).toEqual({
          name: 'name',
        });
      });
    });
  });
});
