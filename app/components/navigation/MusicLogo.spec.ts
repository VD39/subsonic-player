import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MusicLogo from './MusicLogo.vue';

function factory(props = {}) {
  return mount(MusicLogo, {
    props: {
      ...props,
    },
  });
}

describe('MusicLogo', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
