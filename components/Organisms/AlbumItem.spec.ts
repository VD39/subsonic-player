import type { VueWrapper } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import { formattedAlbumMock } from '@/test/fixtures';
import { mount } from '@vue/test-utils';

import AlbumItem from './AlbumItem.vue';

function factory(props = {}) {
  return mount(AlbumItem, {
    props: {
      album: formattedAlbumMock,
      hideArtist: false,
      ...props,
    },
  });
}

describe('AlbumItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when album artist is not an empty array', () => {
    describe('when hideArtist prop is false', () => {
      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });

    describe('when hideArtist prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          hideArtist: true,
        });
      });

      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });
  });

  describe('when album artist is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        album: {
          ...formattedAlbumMock,
          artists: [],
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
    });
  });
});
