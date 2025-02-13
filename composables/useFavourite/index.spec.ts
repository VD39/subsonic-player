import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useFavourite } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { addToFavouriteIds, favouriteIds, favourites, getFavourites } =
  useFavourite();

describe('useFavourite', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default favourites value', () => {
    expect(favourites.value).toEqual(DEFAULT_ALL_MEDIA);
  });

  it('sets the default favouriteIds value', () => {
    expect(favouriteIds.value).toEqual({});
  });

  describe('when the getFavourites function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await getFavourites();
      });

      it('sets the correct favourites value', () => {
        expect(favourites.value).toEqual(DEFAULT_ALL_MEDIA);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(async () => {
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

        await getFavourites();
      });

      it('sets the correct favourites value', () => {
        expect(favourites.value).toEqual({
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

  describe('when the addToFavouriteIds function is called', () => {
    beforeEach(() => {
      addToFavouriteIds('id', false);
    });

    it('updates the favouriteIds value', () => {
      expect(favouriteIds.value).toEqual({
        id: false,
      });
    });

    describe('when called without a isFavourite parameter', () => {
      beforeEach(() => {
        addToFavouriteIds('id');
      });

      it('updates the favouriteIds value', () => {
        expect(favouriteIds.value).toEqual({
          id: true,
        });
      });
    });
  });
});
