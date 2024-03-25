import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { route } from '@/test/fixtures';
import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const isLoggedIn = ref(false);

vi.mock('@/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    autoLogin: vi.fn(),
    isLoggedIn,
  })),
}));

describe('check-out-redirection', () => {
  afterEach(() => {
    isLoggedIn.value = false;
    vi.clearAllMocks();
  });

  describe('when route name is login', () => {
    describe('when isLoggedIn is false', () => {
      beforeEach(() => {
        appGlobalMiddleware(
          {
            ...route,
            name: 'login',
          },
          route,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when isLoggedIn is true', () => {
      beforeEach(() => {
        isLoggedIn.value = true;
        appGlobalMiddleware(
          {
            ...route,
            name: 'login',
          },
          route,
        );
      });

      it('calls the navigateTo function with correct URL', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('when route name is not login', () => {
    describe('when isLoggedIn is true', () => {
      beforeEach(() => {
        isLoggedIn.value = true;
        appGlobalMiddleware(
          {
            ...route,
            name: 'about',
          },
          route,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when isLoggedIn is false', () => {
      beforeEach(() => {
        appGlobalMiddleware(
          {
            ...route,
            name: 'about',
            fullPath: 'about',
          },
          route,
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
  });
});
