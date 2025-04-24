import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import genreMiddleware from './genre';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('genre-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.genre.mediaType} and to.params.${ROUTE_PARAM_KEYS.genre.genre} are not defined`, () => {
    beforeEach(() => {
      genreMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.genres,
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.genre.mediaType} and to.params.${ROUTE_PARAM_KEYS.genre.genre} are defined`, () => {
    describe(`when to.params.${ROUTE_PARAM_KEYS.genre.mediaType} is not a value of ROUTE_MEDIA_TYPE_PARAMS`, () => {
      beforeEach(() => {
        genreMiddleware(
          {
            ...routeMock,
            params: {
              [ROUTE_PARAM_KEYS.genre.genre]: 'genre',
              [ROUTE_PARAM_KEYS.genre.mediaType]: 'podcast',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.genres,
        });
      });
    });

    describe.each([
      ROUTE_MEDIA_TYPE_PARAMS.Albums,
      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
    ])(
      `when when to.params.${ROUTE_PARAM_KEYS.genre.mediaType} is %s`,
      (mediaType) => {
        beforeEach(() => {
          genreMiddleware(
            {
              ...routeMock,
              params: {
                [ROUTE_PARAM_KEYS.genre.genre]: 'genre',
                [ROUTE_PARAM_KEYS.genre.mediaType]: mediaType,
              },
            },
            routeMock,
          );
        });

        it('does not call the navigateTo function', () => {
          expect(navigateToMock).not.toHaveBeenCalled();
        });
      },
    );
  });
});
