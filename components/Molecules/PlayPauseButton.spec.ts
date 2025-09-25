import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import PlayPauseButton from './PlayPauseButton.vue';

const { isBufferingMock, isPlayingMock, togglePlayMock } = useAudioPlayerMock();

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
    text: 'Play current track',
  },
  true: {
    icon: ICONS.pause,
    text: 'Pause current track',
  },
};

describe('PlayPauseButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when isBuffering value is false', () => {
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
        isPlayingMock.value = shuffle;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.icon,
        );
      });

      it('sets the correct title attribute on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          buttonProps.text,
        );
      });

      it('sets the correct slot data on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain(
          buttonProps.text,
        );
      });

      describe('when the ButtonLink component is clicked', () => {
        beforeEach(() => {
          wrapper.findComponent(ButtonLink).vm.$emit('click');
        });

        it('calls the togglePlay function', () => {
          expect(togglePlayMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when isBuffering value is true', () => {
    beforeEach(() => {
      isBufferingMock.value = true;
    });

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
});
