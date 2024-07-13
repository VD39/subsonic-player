import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import GenreList from '@/components/TrackDetails/GenreList.vue';
import TrackInformation from './TrackInformation.vue';

const queueTrackMock = getFormattedQueueTracksMock()[0];

function factory(props = {}) {
  return mount(TrackInformation, {
    props: {
      track: queueTrackMock,
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

    it('does not show the else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
    });
  });

  describe('when artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
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

    it('shows the else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
    });
  });

  describe('when genres is not an empty array', () => {
    it('shows the GenreList component', () => {
      expect(wrapper.findComponent(GenreList).exists()).toBe(true);
    });

    it('does not show the else element', () => {
      expect(wrapper.find({ ref: 'genresElse' }).exists()).toBe(false);
    });
  });

  describe('when genres is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
          genres: [],
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the GenreList component', () => {
      expect(wrapper.findComponent(GenreList).exists()).toBe(false);
    });

    it('shows the else element', () => {
      expect(wrapper.find({ ref: 'genresElse' }).exists()).toBe(true);
    });
  });

  describe('when track information is defined', () => {
    it('shows the track information', () => {
      expect(wrapper.find({ ref: 'trackInformation' }).exists()).toBe(true);
    });
  });

  describe('when track information is not defined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
          information: undefined,
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the track information', () => {
      expect(wrapper.find({ ref: 'trackInformation' }).exists()).toBe(false);
    });
  });

  describe('when a track key is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
          title: undefined,
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the default value', () => {
      expect(wrapper.find({ ref: 'title' }).text()).toBe('-');
    });
  });
});
