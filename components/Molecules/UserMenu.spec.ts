import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import UserMenu from './UserMenu.vue';

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
}));

const getAvatarMock = vi.fn().mockResolvedValue('avatar-url');

mockNuxtImport('useUser', () => () => ({
  getAvatar: getAvatarMock,
  user: ref({
    salt: 'salt',
    server: 'server',
    token: 'token',
    username: 'username',
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

  it('calls the getAvatar function with the correct username', () => {
    expect(getAvatarMock).toHaveBeenCalledWith('username');
  });

  describe('when the scan DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'scanButton' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('calls the startScan function', () => {
      expect(startScanMock).toHaveBeenCalled();
    });
  });

  describe('when the logoutAndRedirect DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'logoutButton' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('calls the logoutAndRedirect function', () => {
      expect(logoutAndRedirectMock).toHaveBeenCalled();
    });
  });
});
