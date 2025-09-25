import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import LoginForm from '@/components/Organisms/LoginForm.vue';
import { authDataMock } from '@/test/fixtures';
import { useHeadMock } from '@/test/useHeadMock';

import LoginPage from './login.vue';

const loginMock = vi.fn();
const isAuthenticatedMock = ref(false);

mockNuxtImport('useAuth', () => () => ({
  error: ref(null),
  isAuthenticated: isAuthenticatedMock,
  loading: ref(false),
  login: loginMock,
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn().mockReturnValue({
    query: {},
  }),
}));

mockNuxtImport('useRoute', () => routeMock);

const { useHeadTitleMock } = useHeadMock();

function factory(props = {}) {
  return mount(LoginPage, {
    props: {
      ...props,
    },
  });
}

describe('login', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
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
      });

      describe('and there is a redirect query parameter', () => {
        beforeEach(() => {
          routeMock.mockReturnValue({
            query: {
              redirect: '/albums',
            },
          });

          wrapper = factory();

          wrapper.findComponent(LoginForm).vm.$emit('submit', authDataMock);
        });

        it('calls the navigateTo function with the correct parameters', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/albums');
        });
      });
    });
  });
});
