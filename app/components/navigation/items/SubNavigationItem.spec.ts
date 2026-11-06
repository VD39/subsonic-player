import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SubNavigationItem from './SubNavigationItem.vue';

function factory(props = {}) {
  return mount(SubNavigationItem, {
    props: {
      collapsed: false,
      icon: ICONS.add,
      title: 'title',
      to: 'to',
      ...props,
    },
  });
}

describe('SubNavigationItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
