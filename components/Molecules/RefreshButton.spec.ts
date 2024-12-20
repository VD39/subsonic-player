import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import RefreshButton from './RefreshButton.vue';

const loadingMock = ref(false);

mockNuxtImport('useLoading', () => () => loadingMock);

function factory(props = {}) {
  return mount(RefreshButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  loading: {
    icon: SpinningLoader,
    text: 'Refreshing page data',
  },
  notLoading: {
    icon: ICONS.refresh,
    text: 'Refresh page data',
  },
};

describe('RefreshButton', () => {
  let wrapper: VueWrapper;

  describe.each([
    [true, buttonProps.loading],
    [false, buttonProps.notLoading],
  ])('when loading is %s', (loading, currentProps) => {
    beforeEach(() => {
      wrapper = factory();
      loadingMock.value = loading;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        currentProps.icon,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        currentProps.text,
      );
    });

    it('sets the correct slot data on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain(
        currentProps.text,
      );
    });
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('emits the refresh event', () => {
      expect(wrapper.emitted('refresh')).toEqual([[]]);
    });
  });
});
