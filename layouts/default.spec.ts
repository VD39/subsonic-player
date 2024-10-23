import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import SearchForm from '@/components/Molecules/SearchForm.vue';
import MusicPlayer from '@/components/Organisms/MusicPlayer/MusicPlayer.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const userMock = vi.hoisted(() => vi.fn(() => ref<null | User>(null)));

mockNuxtImport('useUser', () => userMock);

const logoutMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  logout: logoutMock,
}));

const startScanMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  startScan: startScanMock,
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn().mockReturnValue({
    name: '',
  }),
}));

mockNuxtImport('useRoute', () => routeMock);

const { showMediaPlayerMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(DefaultLayout, {
    attachTo: document.body,
    global: {
      stubs: {
        MusicPlayer: true,
      },
    },
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('Default', () => {
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

  describe('when user is not defined', () => {
    it('does not show the user element', () => {
      expect(wrapper.find({ ref: 'userDetails' }).exists()).toBe(false);
    });
  });

  describe('when user is defined', () => {
    beforeEach(() => {
      userMock.mockReturnValue(
        ref({
          salt: 'salt',
          server: 'server',
          token: 'token',
          username: 'username',
        }),
      );
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the user element', () => {
      expect(wrapper.find({ ref: 'userDetails' }).exists()).toBe(true);
    });

    describe('when the DropdownMenu component emits a click event', () => {
      beforeEach(async () => {
        wrapper
          .findComponent(DropdownMenu)
          .findComponent(ButtonLink)
          .vm.$emit('click');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the DropdownItem components', () => {
        expect(wrapper.findAllComponents(DropdownItem).length).toBe(4);
      });

      describe('when the scan DropdownItem component emits a click event', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'scan' }).vm.$emit('click');
          await wrapper.vm.$nextTick();
        });

        it('calls the startScan function', () => {
          expect(startScanMock).toHaveBeenCalled();
        });
      });

      describe('when the logout DropdownItem component emits a click event', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'logoutButton' }).vm.$emit('click');
          await wrapper.vm.$nextTick();
        });

        it('calls the logout function', () => {
          expect(logoutMock).toHaveBeenCalled();
        });

        it('calls the navigateTo function', () => {
          expect(navigateToMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when showMediaPlayer value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(false);
    });
  });

  describe('when showMediaPlayer value is true', () => {
    beforeEach(async () => {
      showMediaPlayerMock.value = true;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(true);
    });
  });

  describe('when the SearchForm component emits a search event', () => {
    beforeEach(async () => {
      wrapper.findComponent(SearchForm).vm.$emit('submit', 'query');
      await wrapper.vm.$nextTick();
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/search/albums/query');
    });
  });

  describe('when route name is not in PAGE_NAVIGATION_ROUTES', () => {
    it('does not show the PageNavigation component', () => {
      expect(wrapper.findComponent(PageNavigation).exists()).toBe(false);
    });
  });

  describe.each([...PAGE_NAVIGATION_ROUTES])(
    'when route name is %s',
    (name) => {
      beforeEach(() => {
        routeMock.mockReturnValue({
          name,
        });

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the PageNavigation component', () => {
        expect(wrapper.findComponent(PageNavigation).exists()).toBe(true);
      });
    },
  );
});
