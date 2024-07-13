import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import TrackDetail from './TrackDetail.vue';

const queueTrackMock = getFormattedQueueTracksMock()[0];

function factory(props = {}) {
  return mount(TrackDetail, {
    props: {
      track: queueTrackMock,
      ...props,
    },
  });
}

describe('TrackDetail', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when inMediaPlayer prop is not set', () => {
    it('does not add the mediaPlayer class to the wrapper', () => {
      expect(wrapper.classes()).not.toContain('mediaPlayer');
    });

    it('shows the media options', () => {
      expect(wrapper.find({ ref: 'mediaOptions' }).exists()).toBe(true);
    });
  });

  describe('when inMediaPlayer prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        inMediaPlayer: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the mediaPlayer class to the wrapper', () => {
      expect(wrapper.classes()).toContain('mediaPlayer');
    });

    it('does not show the media options', () => {
      expect(wrapper.find({ ref: 'mediaOptions' }).exists()).toBe(false);
    });
  });

  describe('when isCurrentTrack prop is not set', () => {
    it('does not show the current track', () => {
      expect(wrapper.find({ ref: 'currentTrack' }).exists()).toBe(false);
    });

    it('shows the play button', () => {
      expect(wrapper.findComponent({ ref: 'play' }).exists()).toBe(true);
    });

    describe('when play button emits a click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'play' }).vm.$emit('click');
      });

      it('emits playCurrentTrack event with track values', () => {
        expect(wrapper.emitted('playCurrentTrack')).toEqual([[]]);
      });
    });
  });

  describe('when isCurrentTrack prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        isCurrentTrack: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the current track', () => {
      expect(wrapper.find({ ref: 'currentTrack' }).exists()).toBe(true);
    });

    it('does not show the play button', () => {
      expect(wrapper.findComponent({ ref: 'play' }).exists()).toBe(false);
    });

    describe('when trackCanPlay prop is not set', () => {
      it('does not add the trackCanPlay class to current track', () => {
        expect(wrapper.find({ ref: 'currentTrack' }).classes()).not.toContain(
          'trackCanPlay',
        );
      });
    });

    describe('when trackCanPlay prop is set to true', () => {
      beforeEach(() => {
        wrapper = factory({
          isCurrentTrack: true,
          trackCanPlay: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the trackCanPlay class to current track', () => {
        expect(wrapper.find({ ref: 'currentTrack' }).classes()).toContain(
          'trackCanPlay',
        );
      });
    });

    describe('when isCurrentTrackPlaying prop is not set', () => {
      it('does not add the playing class to current track', () => {
        expect(wrapper.find({ ref: 'currentTrack' }).classes()).not.toContain(
          'playing',
        );
      });
    });

    describe('when isCurrentTrackPlaying prop is set to true', () => {
      beforeEach(() => {
        wrapper = factory({
          isCurrentTrack: true,
          isCurrentTrackPlaying: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the playing class to current track', () => {
        expect(wrapper.find({ ref: 'currentTrack' }).classes()).toContain(
          'playing',
        );
      });
    });
  });

  describe('when track album is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
          album: undefined,
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not shows the track album link', () => {
      expect(wrapper.find({ ref: 'trackAlbum' }).exists()).toBe(false);
    });
  });

  describe('when track albumId is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: {
          ...queueTrackMock,
          albumId: undefined,
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not shows the track album link', () => {
      expect(wrapper.find({ ref: 'trackAlbum' }).exists()).toBe(false);
    });
  });

  describe('when track album and albumId are defined', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the track album link', () => {
      expect(wrapper.find({ ref: 'trackAlbum' }).exists()).toBe(true);
    });
  });

  describe('when track artists is an empty array', () => {
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
  });

  describe('when track artist is not an empty array', () => {
    it('shows the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
    });
  });
});
