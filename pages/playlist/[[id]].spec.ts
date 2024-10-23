import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import Playlist from './[[id]].vue';

function factory(props = {}) {
  return mount(Playlist, {
    props: {
      ...props,
    },
  });
}

describe('Playlist', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('renders', () => {
    expect(wrapper).toBeDefined();
  });
});
