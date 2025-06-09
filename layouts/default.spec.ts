import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import SearchForm from '@/components/Molecules/SearchForm.vue';

import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const userMock = vi.hoisted(() => vi.fn(() => ref<null | User>(null)));

mockNuxtImport('useUser', () => userMock);

const logoutMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  logout: logoutMock,
}));

const resetAudioMock = vi.fn();

mockNuxtImport('useAudioPlayer', () => () => ({
  resetAudio: resetAudioMock,
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

function factory(props = {}) {
  return mount(DefaultLayout, {
    attachTo: document.body,
    global: {
      stubs: {
        MusicPlayerAndQueue: true,
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

    describe('when the DropdownMenu component is clicked', () => {
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
        expect(wrapper.findAllComponents(DropdownItem).length).toBe(5);
      });

      describe('when the scan DropdownItem component is clicked', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'scan' }).vm.$emit('click');
          await wrapper.vm.$nextTick();
        });

        it('calls the startScan function', () => {
          expect(startScanMock).toHaveBeenCalled();
        });
      });

      describe('when the logout DropdownItem component is clicked', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'logoutButton' }).vm.$emit('click');
          await wrapper.vm.$nextTick();
        });

        it('calls the logout function', () => {
          expect(logoutMock).toHaveBeenCalled();
        });

        it('calls the resetAudio function', () => {
          expect(resetAudioMock).toHaveBeenCalled();
        });

        it('calls the navigateTo function', () => {
          expect(navigateToMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the SearchForm component emits a search event', () => {
    beforeEach(async () => {
      wrapper.findComponent(SearchForm).vm.$emit('submit', 'query');
      await wrapper.vm.$nextTick();
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.search,
        params: {
          [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
          [ROUTE_PARAM_KEYS.search.query]: 'query',
        },
      });
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
