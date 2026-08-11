import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

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

describe('useAuth', () => {
  let result: Awaited<ReturnType<typeof withSetup<ReturnType<typeof useAuth>>>>;

  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(
          'salt=randomString&server=https%253A%252F%252Fwww.server.com&token=MD5&username=username',
        );
      });

      it('calls the setUser function with the cookie value', () => {
        expect(setUserMock).toHaveBeenCalledWith(
          'salt=randomString&server=https%253A%252F%252Fwww.server.com&token=MD5&username=username',
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
  });
});
