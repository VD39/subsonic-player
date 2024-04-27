import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import Playlists from './playlists.vue';

function factory(props = {}) {
  return mount(Playlists, {
    props: {
      ...props,
    },
  });
}

describe('Playlists', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('renders', () => {
    expect(wrapper).toBeDefined();
  });
});
