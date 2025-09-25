import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import albumMiddleware from './album';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('album-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.album.id} is not defined`, () => {
    beforeEach(() => {
      albumMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.albums,
        params: {
          [ROUTE_PARAM_KEYS.albums.sortBy]: ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'],
        },
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.album.id} is defined`, () => {
    beforeEach(() => {
      albumMiddleware(
        {
          ...routeMock,
          params: {
            [ROUTE_PARAM_KEYS.album.id]: 'id',
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
