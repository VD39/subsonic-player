import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import genreMiddleware from './genre';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('genre-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.mediaType and to.params.genre are not defined', () => {
    beforeEach(() => {
      genreMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/genres');
    });
  });

  describe('when to.params.mediaType and to.params.genre are defined', () => {
    describe('when to.params.mediaType is not albums/artists/tracks', () => {
      beforeEach(() => {
        genreMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              genre: 'genre',
              mediaType: 'podcast',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/genres');
      });
    });

    describe.each([
      ROUTE_MEDIA_TYPE_PARAMS.Albums,
      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
    ])('when when to.params.mediaType is %s', (mediaType) => {
      beforeEach(() => {
        genreMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              genre: 'genre',
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
