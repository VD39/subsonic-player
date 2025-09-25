import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import playlistMiddleware from './playlist';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('playlist-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.playlist.id} is not defined`, () => {
    beforeEach(() => {
      playlistMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.playlists,
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.playlist.id} is defined`, () => {
    beforeEach(() => {
      playlistMiddleware(
        {
          ...routeMock,
          params: {
            [ROUTE_PARAM_KEYS.playlist.id]: 'id',
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
