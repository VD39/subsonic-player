import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MobileNavigation from './MobileNavigation.vue';

function factory(props = {}) {
  return mount(MobileNavigation, {
    props: {
      ...props,
    },
  });
}

describe('MobileNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
