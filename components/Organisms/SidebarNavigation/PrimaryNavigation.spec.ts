import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import PrimaryNavigation from './PrimaryNavigation.vue';

function factory(props = {}) {
  return mount(PrimaryNavigation, {
    props: {
      collapsed: false,
      ...props,
    },
  });
}

describe('PrimaryNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
