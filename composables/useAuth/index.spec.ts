import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { cookieMock } from '@/test/fixtures';
import { withSetup } from '@/test/withSetup';

import { useAuth } from './index';

const useCookieMock = ref<null | string>(null);

mockNuxtImport('useCookie', () => () => useCookieMock);

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: {},
  error: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const useUserMock = ref();

mockNuxtImport('useUser', () => () => useUserMock);

mockNuxtImport('generateRandomString', () => () => 'randomString');

const resetAllUserStateMock = vi.fn();

mockNuxtImport('useStateReset', () => () => ({
  resetAllUserState: resetAllUserStateMock,
}));

const clearNuxtDataMock = vi.hoisted(() => vi.fn());

mockNuxtImport('clearNuxtData', () => clearNuxtDataMock);

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('useAuth', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAuth>>>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when cookie is undefined', () => {
    beforeEach(() => {
      result = withSetup(useAuth);
    });

    it('sets the user value bases on cookie', () => {
      expect(useUserMock.value).toEqual({
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });

    describe('when the autoLogin function is called', () => {
      beforeEach(() => {
        result.composable.autoLogin();
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(null);
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
    });

    describe('when cookie is defined', () => {
      beforeEach(() => {
        useCookieMock.value = cookieMock;
        result = withSetup(useAuth);
      });

      it('sets the user value bases on cookie', () => {
        expect(useUserMock.value).toEqual({
          salt: 'salt',
          server: 'https://www.server.com',
          token: 'token',
          username: 'username',
        });
      });

      describe('when the autoLogin function is called', () => {
        beforeEach(() => {
          result.composable.autoLogin();
        });

        it('calls the fetchData function', () => {
          expect(fetchDataMock).toHaveBeenCalled();
        });

        describe('when fetchData response returns is successful', () => {
          it('sets the correct isAuthenticated value', () => {
            expect(result.composable.isAuthenticated.value).toBe(true);
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
          it('sets the correct useCookie value', () => {
            expect(useCookieMock.value).toBe(null);
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
        });
      });
    });
  });

  describe('when the login function is called', () => {
    describe('when fetchData response returns is not successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
          error: new Error('Error message.'),
        });

        result = withSetup(useAuth);

        result.composable.login({
          password: 'password',
          server: 'https://www.server.com',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(null);
      });

      it('sets the correct error value', () => {
        expect(result.composable.error.value).toBe('Error message.');
      });

      it('sets the correct isAuthenticated value', () => {
        expect(result.composable.isAuthenticated.value).toBe(false);
      });
    });

    describe('when fetchData response returns is successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {},
          error: null,
        });

        result = withSetup(useAuth);

        result.composable.login({
          password: 'password',
          server: 'https://www.server.com',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(
          'salt=randomString&server=https%253A%252F%252Fwww.server.com&token=MD5&username=username',
        );
      });

      it('sets the correct user value', () => {
        expect(useUserMock.value).toEqual({
          salt: 'randomString',
          server: 'https://www.server.com',
          token: 'MD5',
          username: 'username',
        });
      });

      it('sets the correct isAuthenticated value', () => {
        expect(result.composable.isAuthenticated.value).toBe(true);
      });

      it('sets the correct error value', () => {
        expect(result.composable.error.value).toBe(null);
      });
    });
  });

  describe('when the logoutAndRedirect function is called', () => {
    beforeEach(async () => {
      await result.composable.logoutAndRedirect();
    });

    it('sets the correct useCookie value', () => {
      expect(useCookieMock.value).toBe(null);
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
  });
});
