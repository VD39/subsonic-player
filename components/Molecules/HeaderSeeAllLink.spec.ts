import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import HeaderSeeAllLink from './HeaderSeeAllLink.vue';

function factory(props = {}) {
  return mount(HeaderSeeAllLink, {
    props: {
      to: '/to',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('HeaderSeeAllLink', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
