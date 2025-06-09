import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import MainPlayerControls from './MainPlayerControls.vue';

const {
  fastForwardTrackMock,
  isPodcastEpisodeMock,
  playNextTrackMock,
  playPreviousTrackMock,
  rewindTrackMock,
} = useAudioPlayerMock();

function factory(props = {}) {
  return mount(MainPlayerControls, {
    props: {
      ...props,
    },
  });
}

describe('MainPlayerControls', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isPodcastEpisode value is false', () => {
    it('does not show the rewind button component', () => {
      expect(wrapper.findComponent({ ref: 'rewind' }).exists()).toBe(false);
    });

    it('does not show the fast forward button component', () => {
      expect(wrapper.findComponent({ ref: 'fastForward' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when isPodcastEpisode value is true', () => {
    beforeEach(() => {
      isPodcastEpisodeMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the rewind button component', () => {
      expect(wrapper.findComponent({ ref: 'rewind' }).exists()).toBe(true);
    });

    it('shows the fast forward button component', () => {
      expect(wrapper.findComponent({ ref: 'fastForward' }).exists()).toBe(true);
    });

    describe('when the rewind ButtonLink component is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'rewind' }).vm.$emit('click');
      });

      it('calls the rewindTrack function', () => {
        expect(rewindTrackMock).toHaveBeenCalled();
      });
    });

    describe('when the fast forward ButtonLink component is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'fastForward' }).vm.$emit('click');
      });

      it('calls the fastForwardTrack function', () => {
        expect(fastForwardTrackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the previous track ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'previousTrack' }).vm.$emit('click');
    });

    it('calls the playPreviousTrack function', () => {
      expect(playPreviousTrackMock).toHaveBeenCalled();
    });
  });

  describe('when the next track ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'nextTrack' }).vm.$emit('click');
    });

    it('calls the playNextTrack function', () => {
      expect(playNextTrackMock).toHaveBeenCalled();
    });
  });
});
