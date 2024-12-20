import type { VueWrapper } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import TrackInformation from './TrackInformation.vue';

function factory(props = {}) {
  return mount(TrackInformation, {
    props: {
      track: getFormattedQueueTracksMock()[0] as Track,
      ...props,
    },
  });
}

describe('TrackInformation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists is not an empty array', () => {
    it('shows the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
    });

    it('does not show the artists else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
    });
  });

  describe('when artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
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
        track: getFormattedQueueTracksMock(1, {
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
