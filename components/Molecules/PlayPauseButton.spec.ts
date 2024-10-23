import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import PlayPauseButton from './PlayPauseButton.vue';

const { togglePlayMock, trackIsBufferingMock, trackIsPlayingMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlayPauseButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  false: {
    icon: ICONS.play,
    title: 'Play current track',
  },
  true: {
    icon: ICONS.pause,
    title: 'Pause current track',
  },
};

describe('PlayPauseButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when trackIsBuffering value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(false);
    });

    it('shows the SpinningLoader component', () => {
      expect(wrapper.findComponent(SpinningLoader).exists()).toBe(true);
    });
  });

  describe('when trackIsBuffering value is true', () => {
    beforeEach(() => {
      trackIsBufferingMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the SpinningLoader component', () => {
      expect(wrapper.findComponent(SpinningLoader).exists()).toBe(false);
    });

    it('shows the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(true);
    });

    describe.each([
      [false, buttonProps.false],
      [true, buttonProps.true],
    ])('when shuffle value is set to %s', (shuffle, buttonProps) => {
      beforeEach(() => {
        trackIsPlayingMock.value = shuffle;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct color on ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.icon,
        );
      });

      it('sets the correct title on ButtonLink component', () => {
        const buttonLink = wrapper.findComponent(ButtonLink);

        expect(buttonLink.attributes('title')).toBe(buttonProps.title);
        expect(buttonLink.text()).toBe(buttonProps.title);
      });

      describe('when the ButtonLink component emits a click event', () => {
        beforeEach(() => {
          wrapper.findComponent(ButtonLink).vm.$emit('click');
        });

        it('calls the togglePlay function', () => {
          expect(togglePlayMock).toHaveBeenCalled();
        });
      });
    });
  });
});
