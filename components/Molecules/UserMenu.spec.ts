import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import DropdownTitle from '@/components/Molecules/Dropdown/DropdownTitle.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

import UserMenu from './UserMenu.vue';

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
}));

const resolveAvatarUrlMock = vi.fn().mockResolvedValue('avatar-url');
const userName = ref<string | undefined>(undefined);

mockNuxtImport('useUser', () => () => ({
  resolveAvatarUrl: resolveAvatarUrlMock,
  user: ref({
    salt: 'salt',
    server: 'https://www.server.com',
    token: 'token',
    username: userName.value,
  }),
}));

const logoutAndRedirectMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  logoutAndRedirect: logoutAndRedirectMock,
}));

const startScanMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  startScan: startScanMock,
}));

const openAboutAppModalMock = vi.fn();

mockNuxtImport('useServerInfo', () => () => ({
  openAboutAppModal: openAboutAppModalMock,
}));

function factory() {
  return mount(UserMenu, {
    attachTo: document.body,
  });
}

describe('UserMenu', () => {
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

  describe('when the user username value is undefined', () => {
    it('does not call the resolveAvatarUrl function', () => {
      expect(resolveAvatarUrlMock).not.toHaveBeenCalled();
    });

    it('sets the correct image prop on the PreloadImage component', () => {
      expect(wrapper.findComponent(PreloadImage).props('image')).toBe(
        FALLBACK_ICON_BY_TYPE.user,
      );
    });

    it('shows the correct username in the DropdownTitle component', () => {
      expect(wrapper.findComponent(DropdownTitle).text()).toBe('');
    });
  });

  describe('when the user username value is defined', () => {
    beforeEach(() => {
      userName.value = 'username';
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('calls the resolveAvatarUrl function with the correct username', () => {
      expect(resolveAvatarUrlMock).toHaveBeenCalledWith('username');
    });

    it('sets the correct image prop on the PreloadImage component', () => {
      expect(wrapper.findComponent(PreloadImage).props('image')).toBe(
        'avatar-url',
      );
    });

    it('shows the correct username in the DropdownTitle component', () => {
      expect(wrapper.findComponent(DropdownTitle).text()).toBe('username');
    });
  });

  describe('when the scan DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'scanDropdownItem' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('calls the startScan function', () => {
      expect(startScanMock).toHaveBeenCalled();
    });
  });

  describe('when the logout DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'logoutDropdownItem' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('calls the logoutAndRedirect function', () => {
      expect(logoutAndRedirectMock).toHaveBeenCalled();
    });
  });

  describe('when the about app DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'aboutDropdownItem' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('calls the openAboutAppModal function', () => {
      expect(openAboutAppModalMock).toHaveBeenCalled();
    });
  });
});
