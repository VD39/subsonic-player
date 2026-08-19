import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MainLoader from './MainLoader.vue';

function factory(props = {}) {
  return mount(MainLoader, {
    props: {
      ...props,
    },
  });
}

describe('MainLoader', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
