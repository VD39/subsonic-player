import type { VueWrapper } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { formattedAlbumMock } from '@/test/fixtures';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import AlbumItem from './AlbumItem.vue';

const albumMock = ref<Album | null>(null);
const getAlbumMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  album: albumMock,
  getAlbum: getAlbumMock,
}));

const { playTracksMock } = useAudioPlayerMock();

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

  describe('when ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent(ButtonLink).trigger('click');
    });

    it('calls the getAlbum function', () => {
      expect(getAlbumMock).toHaveBeenCalledWith(formattedAlbumMock.id, true);
    });

    describe('when useAlbum album returns null', () => {
      it('does not call the playTracks function', () => {
        expect(playTracksMock).not.toHaveBeenCalled();
      });
    });

    describe('when useAlbum album returns track data', () => {
      beforeEach(async () => {
        albumMock.value = formattedAlbumMock;
        await wrapper.findComponent(ButtonLink).trigger('click');
      });

      it('calls the playTracks function', () => {
        expect(playTracksMock).toHaveBeenCalledWith(formattedAlbumMock.tracks);
      });
    });
  });
});
