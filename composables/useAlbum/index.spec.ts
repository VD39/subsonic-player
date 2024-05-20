import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { DataMock } from '@/test/types';
import { useAlbum } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { album, getAlbum, getAlbums } = useAlbum();

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
        ...Object.entries(SORT_BY_TYPES),
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
        expect(await getAlbums({} as AlbumsParams)).toEqual(null);
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
});
