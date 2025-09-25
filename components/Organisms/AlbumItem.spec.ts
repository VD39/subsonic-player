import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import AlbumItem from './AlbumItem.vue';

const getAlbumMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  getAlbum: getAlbumMock,
}));

const { playTracksMock } = useAudioPlayerMock();

const album = getFormattedAlbumsMock()[0];

function factory(props = {}) {
  return mount(AlbumItem, {
    props: {
      album,
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
        album: getFormattedAlbumsMock(1, {
          artists: [],
        })[0],
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
    beforeEach(() => {
      wrapper.findComponent({ ref: 'playAlbumButtonLink' }).vm.$emit('click');
    });

    it('calls the getAlbum function with the correct parameters', () => {
      expect(getAlbumMock).toHaveBeenCalledWith(album.id);
    });

    describe('when useAlbum album returns null', () => {
      it('does not call the playTracks function', () => {
        expect(playTracksMock).not.toHaveBeenCalled();
      });
    });

    describe('when useAlbum album returns track data', () => {
      beforeEach(() => {
        getAlbumMock.mockResolvedValue(album);
        wrapper.findComponent({ ref: 'playAlbumButtonLink' }).vm.$emit('click');
      });

      it('calls the playTracks function with the correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks);
      });
    });
  });
});
