import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

import RefreshButton from './RefreshButton.vue';

function factory(props = {}) {
  return mount(RefreshButton, {
    props: {
      status: 'success',
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
    ['pending', buttonProps.loading],
    ['idle', buttonProps.notLoading],
    ['success', buttonProps.notLoading],
    ['error', buttonProps.notLoading],
  ])('when status prop is %s', (status, currentProps) => {
    beforeEach(() => {
      wrapper = factory({
        status,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
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
