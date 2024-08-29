import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import ImageLink from './ImageLink.vue';

function factory(props = {}) {
  return mount(ImageLink, {
    props: {
      to: '/to',
      title: 'title',
      image: 'image',
      ...props,
    },
  });
}

describe('ImageLink', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct title attribute', () => {
    expect(wrapper.findComponent({ ref: 'link' }).attributes('title')).toBe(
      'Go to title',
    );
  });
});
