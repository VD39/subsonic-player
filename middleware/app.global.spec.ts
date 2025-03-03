import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';

import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const isAuthenticated = ref(false);

mockNuxtImport('useAuth', () => () => ({
  autoLogin: vi.fn(),
  isAuthenticated,
}));

const playlists = ref([]);
const getPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists,
}));

describe('app-global-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when isAuthenticated is false', () => {
    beforeEach(async () => {
      isAuthenticated.value = false;

      appGlobalMiddleware(
        {
          ...routeMock,
          name: 'login',
        },
        routeMock,
      );

      await flushPromises();
    });

    describe('when route name is login', () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when route name is not login', () => {
      beforeEach(async () => {
        appGlobalMiddleware(
          {
            ...routeMock,
            fullPath: 'about',
            name: 'about',
          },
          routeMock,
        );

        await flushPromises();
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

  describe('when isAuthenticated is true', () => {
    beforeEach(() => {
      isAuthenticated.value = true;
    });

    describe('when route name is login', () => {
      beforeEach(async () => {
        appGlobalMiddleware(
          {
            ...routeMock,
            name: 'login',
          },
          routeMock,
        );

        await flushPromises();
      });

      it('calls the navigateTo function with correct URL', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/');
      });
    });

    describe('when route name is not login', () => {
      beforeEach(async () => {
        appGlobalMiddleware(
          {
            ...routeMock,
            fullPath: 'about',
            name: 'about',
          },
          routeMock,
        );

        await flushPromises();
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when playlists value is an empty array', () => {
      beforeEach(async () => {
        appGlobalMiddleware(
          {
            ...routeMock,
            name: 'login',
          },
          routeMock,
        );

        await flushPromises();
      });

      it('calls the getPlaylistsMock function', () => {
        expect(getPlaylistsMock).toHaveBeenCalled();
      });
    });

    describe('when playlists value is not an empty array', () => {
      beforeEach(async () => {
        playlists.value = [{} as never];

        appGlobalMiddleware(
          {
            ...routeMock,
            fullPath: 'about',
            name: 'about',
          },
          routeMock,
        );

        await flushPromises();
      });

      it('does not call the getPlaylistsMock function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });
    });
  });
});
