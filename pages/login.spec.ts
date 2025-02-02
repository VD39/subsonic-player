import type { VueWrapper } from '@vue/test-utils';

import LoginForm from '@/components/Organisms/LoginForm.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import Login from './login.vue';

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn().mockReturnValue({
    query: {},
  }),
}));

mockNuxtImport('useRoute', () => routeMock);

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const isAuthenticatedMock = ref(false);
const loginMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  isAuthenticated: isAuthenticatedMock,
  login: loginMock,
}));

function factory() {
  return mount(Login);
}

describe('Login', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the LoginForm emits the submit event', () => {
    beforeEach(() => {
      wrapper.findComponent(LoginForm).vm.$emit('submit', {
        password: 'password',
        server: 'server',
        username: 'username',
      });
    });

    it('calls the login function', () => {
      expect(loginMock).toHaveBeenCalledWith({
        password: 'password',
        server: 'server',
        username: 'username',
      });
    });

    describe('when isAuthenticated returns false', () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when isAuthenticated returns true', () => {
      beforeEach(() => {
        isAuthenticatedMock.value = true;

        wrapper = factory();
        wrapper.findComponent(LoginForm).vm.$emit('submit', {
          password: 'password',
          server: 'server',
          username: 'username',
        });
      });

      describe('when route does not have a query value', () => {
        it('calls the navigateTo function with correct route value', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/');
        });
      });

      describe('when route has a query value', () => {
        beforeEach(() => {
          routeMock.mockReturnValue({
            query: {
              redirect: '/about',
            },
          });

          wrapper = factory();
          wrapper.findComponent(LoginForm).vm.$emit('submit', {
            password: 'password',
            server: 'server',
            username: 'username',
          });
        });

        it('calls the navigateTo function with correct route value', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/about');
        });
      });
    });
  });
});
