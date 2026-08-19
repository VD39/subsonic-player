import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import LoginForm from '@/components/auth/LoginForm.vue';
import { authDataMock } from '@/test/fixtures';
import { useHeadMock } from '@/test/useHeadMock';

import LoginPage from './login.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const loginMock = vi.hoisted(() => vi.fn());
const isAuthenticatedMock = ref(false);

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  error: ref(null),
  isAuthenticated: isAuthenticatedMock,
  loading: ref(false),
  login: loginMock,
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { useHeadTitleMock } = useHeadMock();

async function factory(props = {}, route = '/login') {
  return mountSuspended(LoginPage, {
    props: {
      ...props,
    },
    route,
  });
}

describe('login', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Login');
  });

  describe('when the LoginForm component emits the submit event', () => {
    beforeEach(() => {
      wrapper.findComponent(LoginForm).vm.$emit('submit', authDataMock);
    });

    it('calls the login function with the correct parameters', () => {
      expect(loginMock).toHaveBeenCalledWith(authDataMock);
    });

    describe('when user is not authenticated', () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when user is authenticated', () => {
      beforeEach(() => {
        isAuthenticatedMock.value = true;
        wrapper.findComponent(LoginForm).vm.$emit('submit', authDataMock);
      });

      describe('when there is no redirect query parameter', () => {
        it('calls the navigateTo function with the correct parameters', () => {
          expect(navigateToMock).toHaveBeenCalledWith({
            name: 'index',
          });
        });

        it('calls the setLocalStorage function with the correct parameters', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.login,
            expect.any(String),
          );
        });
      });

      describe('when there is a redirect query parameter', () => {
        beforeEach(async () => {
          wrapper = await factory({}, '/login?redirect=/albums');

          wrapper.findComponent(LoginForm).vm.$emit('submit', authDataMock);
        });

        it('calls the navigateTo function with the correct parameters', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/albums');
        });

        it('calls the setLocalStorage function with the correct parameters', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.login,
            expect.any(String),
          );
        });
      });
    });
  });
});
