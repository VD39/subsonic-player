import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';

import { routeMock } from '@/test/fixtures';

import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const isAuthenticatedMock = ref(false);

mockNuxtImport('useAuth', () => () => ({
  autoLogin: vi.fn(),
  isAuthenticated: isAuthenticatedMock,
}));

const playlistsMock = ref([]);
const getPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists: playlistsMock,
}));

describe('app-global-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when isAuthenticated is false', () => {
    beforeEach(async () => {
      isAuthenticatedMock.value = false;

      appGlobalMiddleware(
        {
          ...routeMock,
          name: ROUTE_NAMES.login,
        },
        routeMock,
      );

      await flushPromises();
    });

    describe(`when route.to.name is ${ROUTE_NAMES.login}`, () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe(`when route.to.name is not ${ROUTE_NAMES.login}`, () => {
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

      it('calls the navigateTo function with correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.login,
          query: {
            redirect: 'about',
          },
        });
      });
    });

    describe('when playlists value is an empty array', () => {
      it('does not call the getPlaylists function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when isAuthenticated is true', () => {
    beforeEach(() => {
      isAuthenticatedMock.value = true;
    });

    describe(`when route.to.name is ${ROUTE_NAMES.login}`, () => {
      beforeEach(async () => {
        appGlobalMiddleware(
          {
            ...routeMock,
            name: ROUTE_NAMES.login,
          },
          routeMock,
        );

        await flushPromises();
      });

      it('calls the navigateTo function with correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.index,
        });
      });
    });

    describe(`when route.to.name is not ${ROUTE_NAMES.login}`, () => {
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
            name: ROUTE_NAMES.login,
          },
          routeMock,
        );

        await flushPromises();
      });

      it('calls the getPlaylists function', () => {
        expect(getPlaylistsMock).toHaveBeenCalled();
      });
    });

    describe('when playlists value is not an empty array', () => {
      beforeEach(async () => {
        playlistsMock.value = [{} as never];

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

      it('does not call the getPlaylists function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });
    });
  });
});
