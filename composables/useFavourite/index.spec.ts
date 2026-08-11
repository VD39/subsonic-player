import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useQueueMock } from '@/test/useQueueMock';

import { useFavourite } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const { updateTrackFavouriteMock: updateQueueTrackFavouriteMock } =
  useQueueMock();

describe('useFavourite', () => {
  let composable: ReturnType<typeof useFavourite>;

  beforeAll(() => {
    composable = useFavourite();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default favourites value', () => {
    expect(composable.favourites.value).toEqual(DEFAULT_ALL_MEDIA);
  });

  it('sets the default favouriteIds value', () => {
    expect(composable.favouriteIds.value).toEqual({});
  });

  describe('when the getFavourites function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.getFavourites();
      });

      it('sets the correct favourites value', () => {
        expect(composable.favourites.value).toEqual(DEFAULT_ALL_MEDIA);
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

        await composable.getFavourites();
      });

      it('sets the correct favourites value', () => {
        expect(composable.favourites.value).toEqual({
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

  describe('when the setFavouriteId function is called', () => {
    beforeEach(() => {
      composable.setFavouriteId('id', false);
    });

    it('updates the favouriteIds value', () => {
      expect(composable.favouriteIds.value).toEqual({
        id: false,
      });
    });

    describe('when called without a isFavourite parameter', () => {
      beforeEach(() => {
        composable.setFavouriteId('id');
      });

      it('updates the favouriteIds value', () => {
        expect(composable.favouriteIds.value).toEqual({
          id: true,
        });
      });
    });
  });

  describe('when the addFavourite function is called', () => {
    describe('when id parameter is defined', () => {
      beforeEach(async () => {
        await composable.addFavourite({
          id: 'track-id',
          type: MEDIA_TYPE.track,
        });
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/star', {
          method: 'POST',
          query: {
            albumId: undefined,
            artistId: undefined,
            id: 'track-id',
          },
        });
      });

      describe('when fetchData response returns an error', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: null,
            error: new Error('Error message.'),
          });

          await composable.addFavourite({
            id: 'error-test-id',
            type: MEDIA_TYPE.track,
          });
        });

        it('does not add to favouriteIds', () => {
          expect(
            composable.favouriteIds.value['error-test-id'],
          ).toBeUndefined();
        });

        it('does not call the getFavourites function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith('/getStarred2', {
            transform: expect.any(Function),
          });
        });
      });
    });

    describe('when id parameter is not defined', () => {
      beforeEach(async () => {
        await composable.addFavourite({
          type: MEDIA_TYPE.track,
        });
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the removeFavourite function is called', () => {
    describe('when id parameter is defined', () => {
      beforeEach(async () => {
        await composable.removeFavourite({
          id: 'track-id',
          type: MEDIA_TYPE.track,
        });
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/unstar', {
          method: 'POST',
          query: {
            albumId: undefined,
            artistId: undefined,
            id: 'track-id',
          },
        });
      });

      describe('when fetchData response returns an error', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: null,
            error: new Error('Error message.'),
          });

          await composable.removeFavourite({
            id: 'track-id',
            type: MEDIA_TYPE.track,
          });
        });

        it('does not modify favouriteIds', () => {
          expect(composable.favouriteIds.value['track-id']).toBe(true);
        });

        it('does not call the getFavourites function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith('/getStarred2', {
            transform: expect.any(Function),
          });
        });
      });
    });

    describe('when id parameter is not defined', () => {
      beforeEach(async () => {
        await composable.removeFavourite({
          type: MEDIA_TYPE.track,
        });
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the toggleFavourite function is called', () => {
    describe('when id parameter is defined', () => {
      describe.each([
        [true, '/unstar'],
        [false, '/star'],
      ])('when the isFavourite value is %s', (isFavourite, fetchUrl) => {
        beforeEach(() => {
          composable.toggleFavourite(
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

    describe('when id parameter is not defined', () => {
      beforeEach(() => {
        composable.toggleFavourite(
          {
            type: MEDIA_TYPE.track,
          },
          false,
        );
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });

      it('does not call the updateQueueTrackFavourite function', () => {
        expect(updateQueueTrackFavouriteMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the resetFavourites function is called', () => {
    beforeEach(() => {
      composable.resetFavourites();
    });

    it('sets the favourites value to the default value', () => {
      expect(composable.favourites.value).toEqual(DEFAULT_ALL_MEDIA);
    });

    it('sets the favouriteIds value to the default value', () => {
      expect(composable.favouriteIds.value).toEqual({});
    });
  });
});
