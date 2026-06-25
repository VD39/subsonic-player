import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import MainPlayerControls from './MainPlayerControls.vue';

const {
  fastForwardTrackMock,
  playNextTrackMock,
  playPreviousTrackMock,
  rewindTrackMock,
} = useAudioPlayerMock();
const { isPodcastEpisodeMock } = useQueueMock();

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
      beforeEach(async () => {
        await wrapper.findComponent({ ref: 'rewind' }).trigger('click');
      });

      it('calls the rewindTrack function', () => {
        expect(rewindTrackMock).toHaveBeenCalled();
      });
    });

    describe('when the fast forward ButtonLink component is clicked', () => {
      beforeEach(async () => {
        await wrapper.findComponent({ ref: 'fastForward' }).trigger('click');
      });

      it('calls the fastForwardTrack function', () => {
        expect(fastForwardTrackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the previous track ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'previousTrack' }).trigger('click');
    });

    it('calls the playPreviousTrack function', () => {
      expect(playPreviousTrackMock).toHaveBeenCalled();
    });
  });

  describe('when the next track ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'nextTrack' }).trigger('click');
    });

    it('calls the playNextTrack function', () => {
      expect(playNextTrackMock).toHaveBeenCalled();
    });
  });
});
