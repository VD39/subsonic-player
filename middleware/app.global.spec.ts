import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';

import { routeMock } from '@/test/fixtures';
import {
  getFormattedBookmarksMock,
  getFormattedPlaylistsMock,
} from '@/test/helpers';

import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const isAuthenticatedMock = ref(false);

mockNuxtImport('useAuth', () => () => ({
  autoLogin: vi.fn(),
  isAuthenticated: isAuthenticatedMock,
}));

const playlistsMock = ref<Playlist[]>([]);
const getPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists: playlistsMock,
}));

const bookmarksMock = ref<Bookmark[]>([]);
const getBookmarksMock = vi.fn();

mockNuxtImport('useBookmark', () => () => ({
  bookmarks: bookmarksMock,
  getBookmarks: getBookmarksMock,
}));

const bookmarks = getFormattedBookmarksMock(5);
const playlists = getFormattedPlaylistsMock(5);

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

    it('does not call the getPlaylists function', () => {
      expect(getPlaylistsMock).not.toHaveBeenCalled();
    });

    it('does not call the getBookmarks function', () => {
      expect(getBookmarksMock).not.toHaveBeenCalled();
    });

    describe(`when route.to.name is ${ROUTE_NAMES.login}`, () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });

      it('does not call the getPlaylists function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });

      it('does not call the getBookmarks function', () => {
        expect(getBookmarksMock).not.toHaveBeenCalled();
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

      it('does not call the getPlaylists function', () => {
        expect(getPlaylistsMock).not.toHaveBeenCalled();
      });

      it('does not call the getBookmarks function', () => {
        expect(getBookmarksMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when isAuthenticated is true', () => {
    beforeEach(() => {
      isAuthenticatedMock.value = true;
    });

    describe(`when route.to.name is ${ROUTE_NAMES.login}`, () => {
      describe('when there is no redirect query parameter', () => {
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

        it('does not call the getPlaylists function', () => {
          expect(getPlaylistsMock).not.toHaveBeenCalled();
        });

        it('does not call the getBookmarks function', () => {
          expect(getBookmarksMock).not.toHaveBeenCalled();
        });
      });

      describe('when there is a redirect query parameter', () => {
        beforeEach(async () => {
          appGlobalMiddleware(
            {
              ...routeMock,
              name: ROUTE_NAMES.login,
              query: {
                redirect: '/albums',
              },
            },
            routeMock,
          );

          await flushPromises();
        });

        it('calls the navigateTo function with correct parameters', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/albums');
        });

        it('does not call the getPlaylists function', () => {
          expect(getPlaylistsMock).not.toHaveBeenCalled();
        });

        it('does not call the getBookmarks function', () => {
          expect(getBookmarksMock).not.toHaveBeenCalled();
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

    describe('when playlists and bookmarks are empty arrays', () => {
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

      it('calls the getPlaylists function', () => {
        expect(getPlaylistsMock).toHaveBeenCalled();
      });

      it('calls the getBookmarks function', () => {
        expect(getBookmarksMock).toHaveBeenCalled();
      });
    });

    describe('when playlists is not empty', () => {
      beforeEach(async () => {
        playlistsMock.value = playlists;

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

      it('calls the getBookmarks function', () => {
        expect(getBookmarksMock).toHaveBeenCalled();
      });
    });

    describe('when bookmarks is not empty', () => {
      beforeEach(async () => {
        bookmarksMock.value = bookmarks;
        playlistsMock.value = [];

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

      it('calls the getPlaylists function', () => {
        expect(getPlaylistsMock).toHaveBeenCalled();
      });

      it('does not call the getBookmarks function', () => {
        expect(getBookmarksMock).not.toHaveBeenCalled();
      });
    });

    describe('when playlists and bookmarks are both not empty', () => {
      beforeEach(async () => {
        playlistsMock.value = playlists;
        bookmarksMock.value = bookmarks;

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

      it('does not call the getBookmarks function', () => {
        expect(getBookmarksMock).not.toHaveBeenCalled();
      });
    });
  });
});
