import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { formattedAlbumMock } from '@/test/fixtures';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import AlbumItem from './AlbumItem.vue';

function factory(props = {}) {
  return mount(AlbumItem, {
    props: {
      album: formattedAlbumMock,
      ...props,
    },
  });
}

describe('AlbumItem', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when album artist is not an empty array', () => {
    it('shows the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
    });
  });

  describe('when album artist is an empty array', () => {
    beforeAll(() => {
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
