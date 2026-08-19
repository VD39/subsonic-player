import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import DropdownTitle from '@/components/dropdown/DropdownTitle.vue';
import PreloadImage from '@/components/media/PreloadImage.vue';

import UserMenu from './UserMenu.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
}));

const resolveAvatarUrlMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue('avatar-url'),
);
const userName = ref<string | undefined>(undefined);

mockNuxtImport('useUser', (original) => () => ({
  ...original(),
  resolveAvatarUrl: resolveAvatarUrlMock,
  user: ref({
    salt: 'salt',
    server: 'https://www.server.com',
    token: 'token',
    username: userName.value,
  }),
}));

const { logoutAndRedirectMock, setLocalStorageMock } = vi.hoisted(() => ({
  logoutAndRedirectMock: vi.fn(),
  setLocalStorageMock: vi.fn(),
}));

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  logoutAndRedirect: logoutAndRedirectMock,
}));

const startScanMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
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

      await nextTick();
    });

    it('calls the startScan function', () => {
      expect(startScanMock).toHaveBeenCalled();
    });
  });

  describe('when the logout DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'logoutDropdownItem' }).vm.$emit('click');

      await nextTick();
    });

    it('calls the logoutAndRedirect function', () => {
      expect(logoutAndRedirectMock).toHaveBeenCalled();
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.logout,
        expect.any(String),
      );
    });
  });
});
