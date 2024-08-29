import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import MediaDescription from './MediaDescription.vue';

function factory(props = {}) {
  return mount(MediaDescription, {
    props: {
      description: '<p><a href="#">Link</a> Description</p>',
      ...props,
    },
  });
}

describe('MediaDescription', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
