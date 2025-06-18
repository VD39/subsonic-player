import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import TrackPlayPause from './TrackPlayPause.vue';

const { isBufferingMock, isCurrentTrackMock, isPlayingMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(TrackPlayPause, {
    props: {
      image: 'image',
      trackId: 'trackId',
      trackNumber: 1,
      ...props,
    },
  });
}

describe('TrackPlayPause', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when large prop is false', () => {
    it('does not add the large class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('large');
    });
  });

  describe('when large prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        large: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the large class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('large');
    });
  });

  describe('when hideImage prop is not set', () => {
    it('adds the withImage class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('withImage');
    });

    it('adds the visuallyHidden class to the track number element', () => {
      expect(wrapper.find({ ref: 'trackNumber' }).classes()).toContain(
        'visuallyHidden',
      );
    });

    it('does not add the visuallyHidden class to the PreloadImage component', () => {
      expect(wrapper.findComponent(PreloadImage).classes()).not.toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when hideImage prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideImage: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not add the withImage class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('withImage');
    });

    it('does not add the visuallyHidden class to the track number element', () => {
      expect(wrapper.find({ ref: 'trackNumber' }).classes()).not.toContain(
        'visuallyHidden',
      );
    });

    it('adds the visuallyHidden class to the PreloadImage component', () => {
      expect(wrapper.findComponent(PreloadImage).classes()).toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when isCurrentTrack value is false', () => {
    it('does not add the currentTrack class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('currentTrack');
    });

    it('does not show the play pause wrapper element', () => {
      expect(wrapper.find({ ref: 'playPauseWrapper' }).exists()).toBe(false);
    });

    it('shows the ButtonLink component', () => {
      expect(wrapper.findComponent({ ref: 'play' }).exists()).toBe(true);
    });

    describe('when the ButtonLink component is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'play' }).vm.$emit('click');
      });

      it('emits the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[]]);
      });
    });
  });

  describe('when isCurrentTrack value is true', () => {
    beforeEach(() => {
      isCurrentTrackMock.mockReturnValue(true);
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the currentTrack class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('currentTrack');
    });

    it('shows the play pause wrapper element', () => {
      expect(wrapper.find({ ref: 'playPauseWrapper' }).exists()).toBe(true);
    });

    it('does not show the ButtonLink component', () => {
      expect(wrapper.findComponent({ ref: 'play' }).exists()).toBe(false);
    });

    describe('when isBuffering value is false', () => {
      it('does not add the buffering class to the play pause wrapper element', () => {
        expect(
          wrapper.find({ ref: 'playPauseWrapper' }).classes(),
        ).not.toContain('buffering');
      });
    });

    describe('when isBuffering value is true', () => {
      beforeEach(() => {
        isBufferingMock.value = true;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the buffering class to the play pause wrapper element', () => {
        expect(wrapper.find({ ref: 'playPauseWrapper' }).classes()).toContain(
          'buffering',
        );
      });
    });

    describe('when isPlaying value is false', () => {
      it('adds the paused class to the play pause wrapper element', () => {
        expect(wrapper.find({ ref: 'playPauseWrapper' }).classes()).toContain(
          'paused',
        );
      });

      it('does not add the playing class to the play pause wrapper element', () => {
        expect(
          wrapper.find({ ref: 'playPauseWrapper' }).classes(),
        ).not.toContain('playing');
      });
    });

    describe('when isPlaying value is true', () => {
      beforeEach(() => {
        isPlayingMock.value = true;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the playing class to the play pause wrapper element', () => {
        expect(wrapper.find({ ref: 'playPauseWrapper' }).classes()).toContain(
          'playing',
        );
      });

      it('does not add the paused class to the play pause wrapper element', () => {
        expect(
          wrapper.find({ ref: 'playPauseWrapper' }).classes(),
        ).not.toContain('paused');
      });
    });
  });
});
