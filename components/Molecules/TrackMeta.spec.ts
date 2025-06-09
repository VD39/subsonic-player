import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import {
  getFormattedBookmarksMock,
  getFormattedPodcastEpisodesMock,
  getFormattedQueueTracksMock,
} from '@/test/helpers';

import TrackMeta from './TrackMeta.vue';

const track = getFormattedQueueTracksMock(1, {
  podcastId: 'podcastId',
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

  describe('when the track prop does not have an album key', () => {
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

    it('does not show the album', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(false);
    });
  });

  describe('when track.album is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedQueueTracksMock(1, {
          album: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the album', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(false);
    });
  });

  describe('when track.album is defined', () => {
    it('shows the album', () => {
      expect(wrapper.find({ ref: 'album' }).exists()).toBe(true);
    });
  });

  describe('when the track prop does not have a podcastName key', () => {
    beforeEach(() => {
      const track = getFormattedPodcastEpisodesMock(1)[0];

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
        track: getFormattedPodcastEpisodesMock(1, {
          podcastName: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the podcast name', () => {
      expect(wrapper.find({ ref: 'podcastName' }).exists()).toBe(false);
    });
  });

  describe('when track.podcastName is defined', () => {
    it('shows the podcast name', () => {
      expect(wrapper.find({ ref: 'podcastName' }).exists()).toBe(true);
    });
  });

  describe('when the track prop does not have a author key', () => {
    beforeEach(() => {
      const track = getFormattedPodcastEpisodesMock(1)[0];

      delete (track as Partial<PodcastEpisode>).author;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the author', () => {
      expect(wrapper.find({ ref: 'author' }).exists()).toBe(false);
    });
  });

  describe('when track.author is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedPodcastEpisodesMock(1, {
          author: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the author', () => {
      expect(wrapper.find({ ref: 'author' }).exists()).toBe(false);
    });
  });

  describe('when track.author is defined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedPodcastEpisodesMock(1)[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the author', () => {
      expect(wrapper.find({ ref: 'author' }).exists()).toBe(true);
    });
  });

  describe('when the track prop does not have an artists key', () => {
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
        })[0],
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
    it('shows the artists details', () => {
      expect(wrapper.find({ ref: 'artists' }).exists()).toBe(true);
    });
  });

  describe('when the track prop does not have a formattedPosition key', () => {
    beforeEach(() => {
      const track = getFormattedBookmarksMock(1)[0];

      delete (track as Partial<Bookmark>).formattedPosition;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the formattedPosition', () => {
      expect(wrapper.find({ ref: 'formattedPosition' }).exists()).toBe(false);
    });
  });

  describe('when track.formattedPosition is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedBookmarksMock(1, {
          formattedPosition: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the formattedPosition', () => {
      expect(wrapper.find({ ref: 'formattedPosition' }).exists()).toBe(false);
    });
  });

  describe('when track.formattedPosition is defined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedBookmarksMock(1)[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the formattedPosition', () => {
      expect(wrapper.find({ ref: 'formattedPosition' }).exists()).toBe(true);
    });
  });
});
