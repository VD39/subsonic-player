import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { cachesMock } from '@/test/browserMocks';
import { cookieMock } from '@/test/fixtures';
import { withSetup } from '@/test/withSetup';

import { useAuth } from './index';

const useCookieMock = ref<null | string>(null);

mockNuxtImport('useCookie', () => () => useCookieMock);

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: {},
    error: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const useUserMock = ref<null | User>(null);
const { clearUserMock, setUserMock } = vi.hoisted(() => ({
  clearUserMock: vi.fn(),
  setUserMock: vi.fn((cookie: string) => {
    useUserMock.value = loadSession(cookie);
  }),
}));

mockNuxtImport('useUser', (original) => () => ({
  ...original(),
  clearUser: clearUserMock,
  setUser: setUserMock,
  user: useUserMock,
}));

mockNuxtImport('generateRandomString', () => () => 'randomString');

const resetAllUserStateMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useStateReset', (original) => () => ({
  ...original(),
  resetAllUserState: resetAllUserStateMock,
}));

const clearNuxtDataMock = vi.hoisted(() => vi.fn());

mockNuxtImport('clearNuxtData', () => clearNuxtDataMock);

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { deleteMock, restore: restoreCachesMock } = cachesMock();

describe('useAuth', () => {
  let result: Awaited<ReturnType<typeof withSetup<ReturnType<typeof useAuth>>>>;

  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    restoreCachesMock();
  });

  describe('when cookie is undefined', () => {
    beforeEach(async () => {
      result = await withSetup(useAuth);
    });

    it('does not call the setUser function', () => {
      expect(setUserMock).not.toHaveBeenCalled();
    });

    describe('when the autoLogin function is called', () => {
      beforeEach(() => {
        result.composable.autoLogin();
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });

      it('sets the correct isAuthenticated value', () => {
        expect(result.composable.isAuthenticated.value).toBe(false);
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBeNull();
      });

      it('calls the resetAllUserState function', () => {
        expect(resetAllUserStateMock).toHaveBeenCalled();
      });

      it('does not call the clearNuxtData function', () => {
        expect(clearNuxtDataMock).not.toHaveBeenCalled();
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when cookie is defined', () => {
    beforeEach(async () => {
      useCookieMock.value = cookieMock;
      result = await withSetup(useAuth);
    });

    it('calls the setUser function with the cookie value', () => {
      expect(setUserMock).toHaveBeenCalledWith(cookieMock);
    });

    describe('when the autoLogin function is called', () => {
      beforeEach(() => {
        result.composable.autoLogin();
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/ping');
      });

      describe('when fetchData response returns is successful', () => {
        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(true);
        });

        it('does not call the navigateTo function', () => {
          expect(navigateToMock).not.toHaveBeenCalled();
        });
      });

      describe('when fetchData response returns is not successful', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
            error: new Error('Error message.'),
          });

          result.composable.autoLogin();
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(false);
        });

        it('sets the correct useCookie value', () => {
          expect(useCookieMock.value).toBeNull();
        });

        it('calls the resetAllUserState function', () => {
          expect(resetAllUserStateMock).toHaveBeenCalled();
        });

        it('does not call the clearNuxtData function', () => {
          expect(clearNuxtDataMock).not.toHaveBeenCalled();
        });

        it('does not call the navigateTo function', () => {
          expect(navigateToMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the login function is called', () => {
    describe('when authMethod is not set', () => {
      describe('when fetchData response returns is not successful', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: null,
            error: new Error('Error message.'),
          });

          result = await withSetup(useAuth);

          result.composable.login({
            password: 'password',
            server: 'https://www.server.com',
            username: 'username',
          });
        });

        it('sets the correct useCookie value', () => {
          expect(useCookieMock.value).toBeNull();
        });

        it('sets the correct error value', () => {
          expect(result.composable.error.value).toBe('Error message.');
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(false);
        });
      });

      describe('when fetchData response returns is successful', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: {},
            error: null,
          });

          result = await withSetup(useAuth);

          result.composable.login({
            password: 'password',
            server: 'https://www.server.com',
            username: 'username',
          });
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/rest/ping', {
            baseURL: 'https://www.server.com',
            query: {
              s: 'randomString',
              t: 'MD5',
              u: 'username',
            },
            skipSessionAuth: true,
            suppressErrorSnack: true,
          });
        });

        it('sets the correct useCookie value', () => {
          expect(useCookieMock.value).toBe(
            'authMethod=token&salt=randomString&server=https%3A%2F%2Fwww.server.com&token=MD5&username=username',
          );
        });

        it('calls the setUser function with the cookie value', () => {
          expect(setUserMock).toHaveBeenCalledWith(
            'authMethod=token&salt=randomString&server=https%3A%2F%2Fwww.server.com&token=MD5&username=username',
          );
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(true);
        });

        it('sets the correct error value', () => {
          expect(result.composable.error.value).toBeNull();
        });
      });
    });

    describe('when authMethod is legacy', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {},
          error: null,
        });

        result = await withSetup(useAuth);

        await result.composable.login({
          authMethod: 'legacy',
          password: 'password',
          server: 'https://www.server.com',
          username: 'username',
        });
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/rest/ping', {
          baseURL: 'https://www.server.com',
          query: {
            p: 'enc:70617373776f7264',
            u: 'username',
          },
          skipSessionAuth: true,
          suppressErrorSnack: true,
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(
          'authMethod=legacy&password=enc%3A70617373776f7264&server=https%3A%2F%2Fwww.server.com&username=username',
        );
      });

      it('sets the correct isAuthenticated value', () => {
        expect(result.composable.isAuthenticated.value).toBe(true);
      });
    });

    describe('when authMethod is apiKey', () => {
      describe('when fetchData response returns is not successful', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: null,
            error: new Error('Error message.'),
          });

          result = await withSetup(useAuth);

          await result.composable.login({
            apiKey: 'apiKey',
            authMethod: 'apiKey',
            server: 'https://www.server.com',
          });
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/rest/ping', {
            baseURL: 'https://www.server.com',
            query: {
              apiKey: 'apiKey',
            },
            skipSessionAuth: true,
            suppressErrorSnack: true,
          });
        });

        it('sets the correct error value', () => {
          expect(result.composable.error.value).toBe('Error message.');
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(false);
        });
      });

      describe('when fetchData response returns is successful', () => {
        beforeEach(async () => {
          fetchDataMock
            .mockResolvedValueOnce({
              data: {},
              error: null,
            })
            .mockResolvedValueOnce({
              data: 'tokenUsername',
              error: null,
            });

          result = await withSetup(useAuth);

          await result.composable.login({
            apiKey: 'apiKey',
            authMethod: 'apiKey',
            server: 'https://www.server.com',
          });
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/rest/ping', {
            baseURL: 'https://www.server.com',
            query: {
              apiKey: 'apiKey',
            },
            skipSessionAuth: true,
            suppressErrorSnack: true,
          });
          expect(fetchDataMock).toHaveBeenCalledWith('/rest/tokenInfo', {
            baseURL: 'https://www.server.com',
            query: {
              apiKey: 'apiKey',
            },
            skipSessionAuth: true,
            suppressErrorSnack: true,
            transform: expect.any(Function),
          });
        });

        it('sets the correct useCookie value', () => {
          expect(useCookieMock.value).toBe(
            'apiKey=apiKey&authMethod=apiKey&server=https%3A%2F%2Fwww.server.com&username=tokenUsername',
          );
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(true);
        });
      });

      describe('when tokenInfo fetchData response returns null', () => {
        beforeEach(async () => {
          fetchDataMock
            .mockResolvedValueOnce({
              data: {},
              error: null,
            })
            .mockResolvedValueOnce({
              data: null,
              error: new Error('Error message.'),
            });

          result = await withSetup(useAuth);

          await result.composable.login({
            apiKey: 'apiKey',
            authMethod: 'apiKey',
            server: 'https://www.server.com',
          });
        });

        it('sets the correct useCookie value', () => {
          expect(useCookieMock.value).toBe(
            'apiKey=apiKey&authMethod=apiKey&server=https%3A%2F%2Fwww.server.com',
          );
        });

        it('sets the correct isAuthenticated value', () => {
          expect(result.composable.isAuthenticated.value).toBe(true);
        });

        it('sets the correct error value', () => {
          expect(result.composable.error.value).toBeNull();
        });
      });
    });
  });

  describe('when the logoutAndRedirect function is called', () => {
    beforeEach(async () => {
      await result.composable.logoutAndRedirect();
    });

    it('sets the correct useCookie value', () => {
      expect(useCookieMock.value).toBeNull();
    });

    it('calls the clearUser function', () => {
      expect(clearUserMock).toHaveBeenCalled();
    });

    it('sets the correct isAuthenticated value', () => {
      expect(result.composable.isAuthenticated.value).toBe(false);
    });

    it('calls the clearNuxtData function', () => {
      expect(clearNuxtDataMock).toHaveBeenCalled();
    });

    it('calls the resetAllUserState function', () => {
      expect(resetAllUserStateMock).toHaveBeenCalled();
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.login,
      });
    });

    it('calls the caches.delete function with the correct parameters', () => {
      expect(deleteMock).toHaveBeenCalledWith(PWA_CACHE_NAMES.api);
    });

    describe('when the caches API is not available', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        delete (globalThis as Record<string, unknown>).caches;

        await result.composable.logoutAndRedirect();
      });

      it('does not call the caches.delete function', () => {
        expect(deleteMock).not.toHaveBeenCalled();
      });

      it('calls the navigateTo function with the correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.login,
        });
      });
    });
  });
});
