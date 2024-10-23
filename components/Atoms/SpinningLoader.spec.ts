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
});
