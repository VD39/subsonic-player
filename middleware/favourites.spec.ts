import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import favouritesMiddleware from './favourites';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('favourites-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.favourites.mediaType} is not defined`, () => {
    beforeEach(() => {
      favouritesMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.favourites,
        params: {
          [ROUTE_PARAM_KEYS.favourites.mediaType]:
            ROUTE_MEDIA_TYPE_PARAMS.Albums,
        },
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.favourites.mediaType} is defined`, () => {
    describe(`when to.params.${ROUTE_PARAM_KEYS.favourites.mediaType} is not a value of ROUTE_MEDIA_TYPE_PARAMS`, () => {
      beforeEach(() => {
        favouritesMiddleware(
          {
            ...routeMock,
            params: {
              [ROUTE_PARAM_KEYS.favourites.mediaType]: 'podcast',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function with the correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.favourites,
          params: {
            [ROUTE_PARAM_KEYS.favourites.mediaType]:
              ROUTE_MEDIA_TYPE_PARAMS.Albums,
          },
        });
      });
    });

    describe.each([...Object.values(ROUTE_MEDIA_TYPE_PARAMS)])(
      `when to.params.${ROUTE_PARAM_KEYS.favourites.mediaType} is %s`,
      (mediaType) => {
        beforeEach(() => {
          favouritesMiddleware(
            {
              ...routeMock,
              params: {
                [ROUTE_PARAM_KEYS.favourites.mediaType]: mediaType,
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
