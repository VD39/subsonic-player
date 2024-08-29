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
      default: 'Default slot',
    },
  });
}

describe('HeaderSeeAllLink', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the slot content', () => {
    expect(wrapper.html()).toContain('Default slot');
  });
});
