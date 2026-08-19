import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import DropdownTitle from './DropdownTitle.vue';

function factory(props = {}) {
  return mount(DropdownTitle, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('DropdownTitle', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
