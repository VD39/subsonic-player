import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import GenreList from '@/components/artist/GenreList.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';

import AlbumDetails from './AlbumDetails.vue';

function factory(props = {}) {
  return mount(AlbumDetails, {
    props: {
      album: getFormattedAlbumsMock()[0],
      ...props,
    },
  });
}

describe('AlbumDetails', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists is not an empty array', () => {
    it('shows the ArtistLinkList component', () => {
      expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(true);
    });

    it('does not show the artists else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
    });
  });

  describe('when artists is an empty array', () => {
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

    it('does not show the ArtistLinkList component', () => {
      expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(false);
    });

    it('shows the artists else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
    });
  });

  describe('when genres is not an empty array', () => {
    it('shows the GenreList component', () => {
      expect(wrapper.findComponent(GenreList).exists()).toBe(true);
    });

    it('does not show the genres else element', () => {
      expect(wrapper.find({ ref: 'genresElse' }).exists()).toBe(false);
    });
  });

  describe('when genres is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        album: getFormattedAlbumsMock(1, {
          genres: [],
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the GenreList component', () => {
      expect(wrapper.findComponent(GenreList).exists()).toBe(false);
    });

    it('shows the genres else element', () => {
      expect(wrapper.find({ ref: 'genresElse' }).exists()).toBe(true);
    });
  });
});
