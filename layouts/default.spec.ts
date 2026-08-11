import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import PageNavigation from '@/components/Molecules/PageNavigation.vue';

import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const showPageNavigationMock = ref(false);

mockNuxtImport('useNavigation', (original) => () => ({
  ...original(),
  mobileNavigation: MOBILE_NAVIGATION,
  mobilePageNavigation: MOBILE_PAGE_NAVIGATION,
  showPageNavigation: showPageNavigationMock,
  sidebarNavigation: SIDEBAR_DESKTOP_NAVIGATION,
}));

function factory(props = {}) {
  return mount(DefaultLayout, {
    attachTo: document.body,
    global: {
      stubs: {
        MusicPlayerAndQueue: true,
        UserMenu: true,
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

describe('DefaultLayout', () => {
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

  describe('when the showPageNavigation value is false', () => {
    it('does not show the PageNavigation component', () => {
      expect(wrapper.findComponent(PageNavigation).exists()).toBe(false);
    });
  });

  describe('when the showPageNavigation value is true', () => {
    beforeEach(() => {
      showPageNavigationMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the PageNavigation component', () => {
      expect(wrapper.findComponent(PageNavigation).exists()).toBe(true);
    });
  });
});
