import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import searchMiddleware from './search';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('search-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.mediaType and to.params.query are not defined', () => {
    beforeEach(() => {
      searchMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/');
    });
  });

  describe('when to.params.mediaType and to.params.query are defined', () => {
    describe('when to.params.mediaType is not albums/artists/tracks', () => {
      beforeEach(() => {
        searchMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'podcast',
              query: 'query',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/');
      });
    });

    describe.each([
      ROUTE_MEDIA_TYPE_PARAMS.Albums,
      ROUTE_MEDIA_TYPE_PARAMS.Artists,
      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
    ])('when when to.params.mediaType is %s', (mediaType) => {
      beforeEach(() => {
        searchMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType,
              query: 'query',
            },
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toBeCalled();
      });
    });
  });
});
