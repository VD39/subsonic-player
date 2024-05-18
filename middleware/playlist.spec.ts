import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import playlistMiddleware from './playlist';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('playlist-middleware', () => {
  beforeEach(() => {
    playlistMiddleware(routeMock, routeMock);
  });

  describe('when to.params.id is not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/playlists');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      vi.clearAllMocks();
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
