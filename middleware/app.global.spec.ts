import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import appGlobalMiddleware from './app.global';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const authenticated = ref(false);

mockNuxtImport('useAuth', () => () => ({
  authenticated,
  autoLogin: vi.fn(),
}));

const clearAllSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  clearAllSnack: clearAllSnackMock,
}));

describe('app-global-middleware', () => {
  beforeEach(() => {
    appGlobalMiddleware(routeMock, routeMock);
  });

  afterEach(() => {
    authenticated.value = false;
    vi.clearAllMocks();
  });

  it('calls the clearAllSnack function', () => {
    expect(clearAllSnackMock).toHaveBeenCalled();
  });

  describe('when route name is login', () => {
    describe('when authenticated is false', () => {
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

      it('calls the navigateTo function with correct URL', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('when route name is not login', () => {
    describe('when authenticated is true', () => {
      beforeEach(() => {
        authenticated.value = true;
        appGlobalMiddleware(
          {
            ...routeMock,
            name: 'about',
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when authenticated is false', () => {
      beforeEach(() => {
        appGlobalMiddleware(
          {
            ...routeMock,
            name: 'about',
            fullPath: 'about',
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
  });
});
