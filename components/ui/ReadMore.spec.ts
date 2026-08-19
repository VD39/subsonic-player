import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ReadMore from './ReadMore.vue';

function factory(props = {}) {
  return mount(ReadMore, {
    props: {
      text: '<p><a href="#">Link</a> Text</p>',
      ...props,
    },
  });
}

describe('ReadMore', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
