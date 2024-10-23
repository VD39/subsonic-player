import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import playlistMiddleware from './playlist';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('playlist-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.id is not defined', () => {
    beforeEach(() => {
      playlistMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/playlists');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      playlistMiddleware(
        {
          ...routeMock,
          params: {
            ...routeMock.params,
            id: 'id',
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
