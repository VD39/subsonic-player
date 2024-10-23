import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import LoadingData from './LoadingData.vue';

const loadingMock = ref(false);

mockNuxtImport('useLoading', () => () => loadingMock);

function factory(props = {}) {
  return mount(LoadingData, {
    attachTo: document.body,
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('LoadingData', () => {
  let wrapper: VueWrapper;

  describe('when loading is false', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MainLoader component', () => {
      expect(wrapper.find({ ref: 'mainLoader' }).isVisible()).toBe(false);
    });

    it('shows the main content', () => {
      expect(wrapper.find({ ref: 'mainContent' }).isVisible()).toBe(true);
    });
  });

  describe('when loading is true', () => {
    beforeEach(() => {
      loadingMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MainLoader component', () => {
      expect(wrapper.find({ ref: 'mainLoader' }).isVisible()).toBe(true);
    });

    it('does not show the main content', () => {
      expect(wrapper.find({ ref: 'mainContent' }).isVisible()).toBe(false);
    });
  });
});
