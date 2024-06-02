import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { DataMock } from '@/test/types';
import { useFavourite } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { favourites, getFavourites } = useFavourite();

describe('useFavourite', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default favourites value', () => {
    expect(favourites.value).toEqual(DEFAULT_ALL_MEDIA);
  });

  describe('when the getFavourites function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getFavourites();
      });

      it('does not add to the favourites value', () => {
        expect(favourites.value).toEqual(DEFAULT_ALL_MEDIA);
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

        getFavourites();
      });

      it('adds to the favourites value', () => {
        expect(favourites.value).toEqual({
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
