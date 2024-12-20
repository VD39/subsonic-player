import type { VueWrapper } from '@vue/test-utils';

import { getFormattedQueueTracksMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import TrackMeta from './TrackMeta.vue';

const track = getFormattedQueueTracksMock(1, {
  podcastName: 'podcastName',
})[0] as Track;

function factory(props = {}) {
  return mount(TrackMeta, {
    props: {
      track,
      ...props,
    },
  });
}

describe('TrackMeta', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the track does not have an album key', () => {
    beforeEach(() => {
      const track = getFormattedQueueTracksMock(1)[0];

      delete (track as Partial<Track>).album;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the album name', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(false);
    });
  });

  describe('when track.album is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
          album: undefined,
        }),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the album name', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(false);
    });
  });

  describe('when track.album is not undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track,
      });
    });

    it('shows the album name', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(true);
    });
  });

  describe('when the track does not have a podcastName key', () => {
    beforeEach(() => {
      const track = getFormattedQueueTracksMock(1)[0];

      delete (track as Partial<PodcastEpisode>).podcastName;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the podcast name', () => {
      expect(wrapper.find({ ref: 'podcastName' }).exists()).toBe(false);
    });
  });

  describe('when track.podcastName is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
          podcastName: undefined,
        }),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the podcast name', () => {
      expect(wrapper.find({ ref: 'podcastName' }).exists()).toBe(false);
    });
  });

  describe('when track.podcastName is not undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track,
      });
    });

    it('shows the podcast name', () => {
      expect(wrapper.find({ ref: 'podcastName' }).exists()).toBe(true);
    });
  });

  describe('when the track does not have an artists key', () => {
    beforeEach(() => {
      const track = getFormattedQueueTracksMock(1)[0];

      delete (track as Partial<Track>).artists;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the artists details', () => {
      expect(wrapper.find({ ref: 'artists' }).exists()).toBe(false);
    });
  });

  describe('when track.artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
          artists: [],
        }),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the artists details', () => {
      expect(wrapper.find({ ref: 'artists' }).exists()).toBe(false);
    });
  });

  describe('when track.artists is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track,
      });
    });

    it('shows the artists details', () => {
      expect(wrapper.find({ ref: 'artists' }).exists()).toBe(true);
    });
  });

  describe('when track.duration is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
          duration: undefined,
        }),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the duration', () => {
      expect(wrapper.find({ ref: 'duration' }).exists()).toBe(false);
    });
  });

  describe('when track.duration is not undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track,
      });
    });

    it('shows the duration', () => {
      expect(wrapper.find({ ref: 'duration' }).exists()).toBe(true);
    });
  });
});
