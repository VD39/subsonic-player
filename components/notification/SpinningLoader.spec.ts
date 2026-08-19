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

  describe('when the size prop is not set', () => {
    it('sets the correct size attribute on the icon component', () => {
      expect(wrapper.find({ ref: 'spinnerIcon' }).attributes('size')).toBe(
        ICON_SIZE.medium.toString(),
      );
    });
  });

  describe('when the fullWidth prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        size: ICON_SIZE.large,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct size attribute on the icon component', () => {
      expect(wrapper.find({ ref: 'spinnerIcon' }).attributes('size')).toBe(
        ICON_SIZE.large.toString(),
      );
    });
  });
});
