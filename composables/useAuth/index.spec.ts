import type { DataMock } from '@/test/types';

import { withSetup } from '@/test/withSetup';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

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

const resetAudioMock = vi.fn();

mockNuxtImport('useAudioPlayer', () => () => ({
  resetAudio: resetAudioMock,
}));

const useUserMock = ref();

mockNuxtImport('useUser', () => () => useUserMock);

mockNuxtImport('generateRandomString', () => () => 'randomString');

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

      it('sets the authenticated value to false', () => {
        expect(result.composable.authenticated.value).toBe(false);
      });
    });

    describe('when cookie is defined', () => {
      beforeEach(() => {
        useCookieMock.value =
          'token=token&salt=salt&server=server&username=username';
        result = withSetup(useAuth);
      });

      it('sets the user value bases on cookie', () => {
        expect(useUserMock.value).toEqual({
          salt: 'salt',
          server: 'server',
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
          it('sets the correct authenticated value', () => {
            expect(result.composable.authenticated.value).toBe(true);
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

          it('sets the correct authenticated value', () => {
            expect(result.composable.authenticated.value).toBe(undefined);
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
          server: 'server',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(null);
      });

      it('sets the correct error value', () => {
        expect(result.composable.error.value).toBe('Error message.');
      });

      it('sets the correct authenticated value', () => {
        expect(result.composable.authenticated.value).toBe(false);
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
          server: 'server',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(
          'salt=randomString&server=server&token=MD5&username=username',
        );
      });

      it('sets the correct user value', () => {
        expect(useUserMock.value).toEqual({
          salt: 'randomString',
          server: 'server',
          token: 'MD5',
          username: 'username',
        });
      });

      it('sets the correct authenticated value', () => {
        expect(result.composable.authenticated.value).toBe(true);
      });

      it('sets the correct error value', () => {
        expect(result.composable.error.value).toBe(null);
      });
    });
  });

  describe('when the logout function is called', () => {
    beforeEach(() => {
      result.composable.logout();
    });

    it('sets the correct useCookie value', () => {
      expect(useCookieMock.value).toBe(null);
    });

    it('sets the correct authenticated value', () => {
      expect(result.composable.authenticated.value).toBe(undefined);
    });

    it('calls the resetAudio function', () => {
      expect(resetAudioMock).toHaveBeenCalled();
    });
  });
});
