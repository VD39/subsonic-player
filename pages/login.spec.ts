import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import LoginForm from '@/components/Forms/LoginForm.vue';
import Login from './login.vue';

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn().mockReturnValue({
    query: {},
  }),
}));

mockNuxtImport('useRoute', () => routeMock);

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const authenticatedMock = ref(false);
const loginMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  authenticated: authenticatedMock,
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
        server: 'server',
        username: 'username',
        password: 'password',
      });
    });

    it('calls the login function', () => {
      expect(loginMock).toHaveBeenCalledWith({
        server: 'server',
        username: 'username',
        password: 'password',
      });
    });

    describe('when authenticated returns false', () => {
      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('when authenticated returns true', () => {
      beforeEach(() => {
        authenticatedMock.value = true;

        wrapper = factory();
        wrapper.findComponent(LoginForm).vm.$emit('submit', {
          server: 'server',
          username: 'username',
          password: 'password',
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
            server: 'server',
            username: 'username',
            password: 'password',
          });
        });

        it('calls the navigateTo function with correct route value', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/about');
        });
      });
    });
  });
});
