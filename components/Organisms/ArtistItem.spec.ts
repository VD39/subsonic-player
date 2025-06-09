import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { formattedArtistMock } from '@/test/fixtures';

import ArtistItem from './ArtistItem.vue';

function factory(props = {}) {
  return mount(ArtistItem, {
    props: {
      artist: formattedArtistMock,
      ...props,
    },
  });
}

describe('ArtistItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
