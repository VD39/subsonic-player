import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import artistMiddleware from './artist';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('artist-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.artist.id} is not defined`, () => {
    beforeEach(() => {
      artistMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.artists,
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.artist.id} is defined`, () => {
    beforeEach(() => {
      artistMiddleware(
        {
          ...routeMock,
          params: {
            [ROUTE_PARAM_KEYS.artist.id]: 'id',
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
