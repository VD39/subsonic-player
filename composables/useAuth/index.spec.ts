import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { withSetup } from '@/test/withSetup';
import { useAuth } from './index';

const useCookieMock = ref<null | string>(null);

mockNuxtImport('useCookie', () => () => useCookieMock);

const fetchDataMock = vi.fn(() => ({
  data: ref<null | Record<string, string>>({}),
  error: ref<null | Error>(null),
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const userMock = ref();

mockNuxtImport('useState', () => {
  return <T>(key: string, init: () => T) => {
    if (key === 'user') {
      userMock.value = init();
      return userMock;
    }

    return ref(init());
  };
});

mockNuxtImport('generateRandomString', () => () => 'randomString');

describe('useAuth', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAuth>>>;

  afterEach(() => {
    useCookieMock.value = null;
    vi.clearAllMocks();
  });

  describe('when cookie is undefined', () => {
    beforeEach(() => {
      result = withSetup(useAuth);
    });

    it('sets the user value bases on cookie', () => {
      expect(userMock.value).toEqual({
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });

    describe('when the autoLogin function is called', () => {
      beforeEach(() => {
        result.autoLogin();
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });

      it('sets the authenticated value to false', () => {
        expect(result.authenticated.value).toBe(false);
      });
    });

    describe('when cookie is defined', () => {
      beforeEach(() => {
        useCookieMock.value =
          'token=token&salt=salt&server=server&username=username';
        result = withSetup(useAuth);
      });

      it('sets the user value bases on cookie', () => {
        expect(userMock.value).toEqual({
          salt: 'salt',
          server: 'server',
          token: 'token',
          username: 'username',
        });
      });

      describe('when the autoLogin function is called', () => {
        beforeEach(() => {
          result.autoLogin();
        });

        it('calls the fetchData function', () => {
          expect(fetchDataMock).toHaveBeenCalled();
        });

        describe('when fetchData response is successful', () => {
          it('sets the correct authenticated value', () => {
            expect(result.authenticated.value).toBe(true);
          });
        });

        describe('when fetchData response is not successful', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref(null),
              error: ref(new Error('Error message.')),
            });
            result.autoLogin();
          });

          it('sets the correct authenticated value', () => {
            expect(result.authenticated.value).toBe(false);
          });
        });
      });
    });
  });

  describe('when the login function is called', () => {
    describe('when fetchData response is successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: ref({}),
          error: ref(null),
        });

        result = withSetup(useAuth);
        result.login({
          password: 'password',
          server: 'server',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(
          'token=MD5&salt=randomString&server=server&username=username',
        );
      });

      it('sets the correct user value', () => {
        expect(userMock.value).toEqual({
          salt: 'randomString',
          server: 'server',
          token: 'MD5',
          username: 'username',
        });
      });

      it('sets the correct authenticated value', () => {
        expect(result.authenticated.value).toBe(true);
      });

      it('sets the correct error value', () => {
        expect(result.error.value).toBe(null);
      });
    });

    describe('when fetchData response is not successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: ref(null),
          error: ref(new Error('Error message.')),
        });

        result = withSetup(useAuth);
        result.login({
          password: 'password',
          server: 'server',
          username: 'username',
        });
      });

      it('sets the correct useCookie value', () => {
        expect(useCookieMock.value).toBe(null);
      });

      it('sets the correct error value', () => {
        expect(result.error.value).toBe('Error message.');
      });

      it('sets the correct authenticated value', () => {
        expect(result.authenticated.value).toBe(false);
      });
    });
  });

  describe('when the logout function is called', () => {
    beforeEach(() => {
      result.logout();
    });

    it('sets the correct useCookie value', () => {
      expect(useCookieMock.value).toBe(null);
    });

    it('sets the correct authenticated value', () => {
      expect(result.authenticated.value).toBe(false);
    });
  });
});
