import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import favouritesMiddleware from './favourites';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('favourites-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.mediaType are not defined', () => {
    beforeEach(() => {
      favouritesMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/favourites/albums');
    });
  });

  describe('when to.params.mediaType is defined', () => {
    describe('when to.params.mediaType is not albums/artists/tracks', () => {
      beforeEach(() => {
        favouritesMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'podcast',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/favourites/albums');
      });
    });

    describe.each([
      ROUTE_MEDIA_TYPE_PARAMS.Albums,
      ROUTE_MEDIA_TYPE_PARAMS.Artists,
      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
    ])('when when to.params.mediaType is %s', (mediaType) => {
      beforeEach(() => {
        favouritesMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType,
            },
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });
  });
});
