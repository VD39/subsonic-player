import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SpinningLoader from './SpinningLoader.vue';

function factory(props = {}) {
  return mount(SpinningLoader, {
    props: {
      ...props,
    },
  });
}

describe('SpinningLoader', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when size prop is not set', () => {
    it('sets the default size prop to PhCircleNotch component', () => {
      expect(
        wrapper.findComponent({ ref: 'phCircleNotch' }).attributes('size'),
      ).toBe(ICON_SIZE.medium.toString());
    });
  });

  describe('when fullWidth prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        size: ICON_SIZE.large,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the default size prop to PhCircleNotch component', () => {
      expect(
        wrapper.findComponent({ ref: 'phCircleNotch' }).attributes('size'),
      ).toBe(ICON_SIZE.large.toString());
    });
  });
});
