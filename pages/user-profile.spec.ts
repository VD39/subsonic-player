import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import { useHeadMock } from '@/test/useHeadMock';

import UserProfilePage from './user-profile.vue';

const useUserMock = ref<null | User>(null);

mockNuxtImport('useUser', () => () => useUserMock);

const { useHeadTitleMock } = useHeadMock();

function factory(props = {}) {
  return mount(UserProfilePage, {
    props: {
      ...props,
    },
  });
}

describe('user-profile', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when currentUser is undefined', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the title', () => {
      expect(wrapper.find({ ref: 'title' }).exists()).toBe(false);
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('User Profile');
    });
  });

  describe('when currentUser is defined', () => {
    beforeEach(() => {
      useUserMock.value = {
        salt: 'salt',
        server: 'server',
        token: 'token',
        username: 'username',
      };

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the title with correct username', () => {
      const title = wrapper.find({ ref: 'title' });
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe('Hello username');
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('username - User Profile');
    });
  });
});
