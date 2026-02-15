import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import DropdownDivider from './DropdownDivider.vue';

function factory(props = {}) {
  return mount(DropdownDivider, {
    props: {
      ...props,
    },
  });
}

describe('DropdownDivider', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
