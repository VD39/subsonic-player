import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import searchMiddleware from './search';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('search-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.search.mediaType} and to.params.${ROUTE_PARAM_KEYS.search.query} are not defined`, () => {
    beforeEach(() => {
      searchMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.index,
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.search.mediaType} and to.params.${ROUTE_PARAM_KEYS.search.query} are defined`, () => {
    describe(`when to.params.${ROUTE_PARAM_KEYS.search.mediaType} is not a value of ROUTE_MEDIA_TYPE_PARAMS`, () => {
      beforeEach(() => {
        searchMiddleware(
          {
            ...routeMock,
            params: {
              [ROUTE_PARAM_KEYS.search.mediaType]: 'podcast',
              [ROUTE_PARAM_KEYS.search.query]: 'query',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function with the correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.index,
        });
      });
    });

    describe.each(Object.values(ROUTE_MEDIA_TYPE_PARAMS))(
      `when to.params.${ROUTE_PARAM_KEYS.search.mediaType} is %s`,
      (mediaType) => {
        beforeEach(() => {
          searchMiddleware(
            {
              ...routeMock,
              params: {
                [ROUTE_PARAM_KEYS.search.mediaType]: mediaType,
                [ROUTE_PARAM_KEYS.search.query]: 'query',
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
