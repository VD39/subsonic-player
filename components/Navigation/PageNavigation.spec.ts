import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import PageNavigation from './PageNavigation.vue';

function factory(props = {}) {
  return mount(PageNavigation, {
    props: {
      navigation: [
        {
          title: 'title',
          to: '/to',
        },
        {
          title: 'title1',
          to: '/to1',
        },
      ],
      ...props,
    },
  });
}

describe('PageNavigation', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of links', () => {
    expect(wrapper.findAll('[data-test-id="item"]').length).toBe(2);
  });
});
