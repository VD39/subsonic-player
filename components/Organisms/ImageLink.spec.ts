import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ImageLink from './ImageLink.vue';

function factory(props = {}) {
  return mount(ImageLink, {
    props: {
      image: 'image',
      title: 'title',
      to: '/to',
      ...props,
    },
  });
}

describe('ImageLink', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
