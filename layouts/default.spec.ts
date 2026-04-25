import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import SearchForm from '@/components/Molecules/SearchForm.vue';

import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

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

  describe('when the SearchForm component emits a search event', () => {
    beforeEach(async () => {
      wrapper.findComponent(SearchForm).vm.$emit('submit', 'query');
      await wrapper.vm.$nextTick();
    });

    it('calls the navigateTo function with the correct parameters', () => {
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
