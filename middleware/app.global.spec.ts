import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const authenticated = ref(false);

mockNuxtImport('useAuth', () => () => ({
  authenticated,
  autoLogin: vi.fn(),
}));

const playlists = ref([]);
const getPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists,
}));

describe('app-global-middleware', () => {
  beforeEach(() => {
    appGlobalMiddleware(routeMock, routeMock);
  });

  afterEach(() => {
    authenticated.value = false;
    vi.clearAllMocks();
  });

  describe('when authenticated is false', () => {
    describe('when route name is login', () => {
      beforeEach(() => {
        appGlobalMiddleware(
          {
            ...routeMock,
            name: 'login',
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when route name is not login', () => {
      beforeEach(() => {
        appGlobalMiddleware(
          {
            ...routeMock,
            fullPath: 'about',
            name: 'about',
          },
          routeMock,
        );
      });

      it('calls the navigateTo function with correct URL', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          path: '/login',
          query: {
            redirect: 'about',
          },
        });
      });
    });

    describe('when playlists value is an empty array', () => {
      it('does not call the getPlaylistsMock function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when authenticated is true', () => {
    beforeEach(() => {
      authenticated.value = true;

      appGlobalMiddleware(
        {
          ...routeMock,
          name: 'login',
        },
        routeMock,
      );
    });

    describe('when route name is login', () => {
      it('calls the navigateTo function with correct URL', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/');
      });
    });

    describe('when route name is not login', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        appGlobalMiddleware(
          {
            ...routeMock,
            fullPath: 'about',
            name: 'about',
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when playlists value is an empty array', () => {
      it('calls the getPlaylistsMock function', () => {
        expect(getPlaylistsMock).toHaveBeenCalled();
      });
    });
  });
});
