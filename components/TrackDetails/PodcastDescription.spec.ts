import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import PodcastDescription from './PodcastDescription.vue';

function factory(props = {}) {
  return mount(PodcastDescription, {
    props: {
      description: '<p><a href="#">Link</a> Description</p>',
      ...props,
    },
  });
}

describe('PodcastDescription', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
