import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import { useFavourite } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { updateQueueTrackFavouriteMock } = useAudioPlayerMock();

const {
  addToFavouriteIds,
  favouriteIds,
  favourites,
  getFavourites,
  resetFavourites,
  toggleFavourite,
} = useFavourite();

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

  describe('when the toggleFavourite function is called', () => {
    describe.each([
      [true, '/unstar'],
      [false, '/star'],
    ])('when isFavourite is %s', (isFavourite, fetchUrl) => {
      beforeEach(async () => {
        await toggleFavourite(
          {
            id: 'track-id',
            type: MEDIA_TYPE.track,
          },
          isFavourite,
        );
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(fetchUrl, {
          method: 'POST',
          query: {
            albumId: undefined,
            artistId: undefined,
            id: 'track-id',
          },
        });
      });

      it('calls the updateQueueTrackFavourite function with the correct parameters', () => {
        expect(updateQueueTrackFavouriteMock).toHaveBeenCalledWith(
          'track-id',
          !isFavourite,
        );
      });
    });
  });

  describe('when the resetFavourites function is called', () => {
    beforeEach(() => {
      resetFavourites();
    });

    it('sets the favourites value to the default value', () => {
      expect(favourites.value).toEqual(DEFAULT_ALL_MEDIA);
    });

    it('sets the favouriteIds value to the default value', () => {
      expect(favouriteIds.value).toEqual({});
    });
  });
});
