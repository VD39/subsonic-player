import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import RepeatButton from './Controls/RepeatButton.vue';
import ShuffleButton from './Controls/ShuffleButton.vue';
import PlayerControls from './PlayerControls.vue';

const {
  fastForwardTrackMock,
  isPodcastMock,
  isRadioStationMock,
  playNextTrackMock,
  playPreviousTrackMock,
  rewindTrackMock,
} = useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlayerControls, {
    props: {
      ...props,
    },
  });
}

describe('PlayerControls', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isRadioStation is false', () => {
    it('shows the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(true);
    });

    it('shows the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(true);
    });
  });

  describe('when isRadioStation is true', () => {
    beforeEach(() => {
      isRadioStationMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(false);
    });

    it('does not show the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(false);
    });
  });

  describe('when isPodcast is false', () => {
    it('does not show the rewind button component', () => {
      expect(wrapper.findComponent({ ref: 'rewind' }).exists()).toBe(false);
    });

    it('does not show the fast forward button component', () => {
      expect(wrapper.findComponent({ ref: 'fastForward' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when isPodcast is true', () => {
    beforeEach(() => {
      isPodcastMock.value = true;
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

    describe('when the rewind button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'rewind' }).vm.$emit('click');
      });

      it('calls the rewindTrack function', () => {
        expect(rewindTrackMock).toHaveBeenCalled();
      });
    });

    describe('when the fast forward button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'fastForward' }).vm.$emit('click');
      });

      it('calls the fastForwardTrack function', () => {
        expect(fastForwardTrackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the previous track button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'previousTrack' }).vm.$emit('click');
    });

    it('calls the playPreviousTrack function', () => {
      expect(playPreviousTrackMock).toHaveBeenCalled();
    });
  });

  describe('when the next track button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'nextTrack' }).vm.$emit('click');
    });

    it('calls the playNextTrack function', () => {
      expect(playNextTrackMock).toHaveBeenCalled();
    });
  });
});
