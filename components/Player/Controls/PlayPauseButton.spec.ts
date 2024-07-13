import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import ButtonLoader from '@/components/Loaders/ButtonLoader.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import PlayPauseButton from './PlayPauseButton.vue';

const { togglePlayMock, trackCanPlayMock, trackIsPlayingMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlayPauseButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  true: {
    icon: 'PhPause',
    title: 'Pause current track.',
  },
  false: {
    icon: 'PhPlay',
    title: 'Play current track.',
  },
};

describe('PlayPauseButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when trackCanPlay is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the IconButton component', () => {
      expect(wrapper.findComponent(IconButton).exists()).toBe(false);
    });

    it('shows the ButtonLoader component', () => {
      expect(wrapper.findComponent(ButtonLoader).exists()).toBe(true);
    });
  });

  describe('when trackCanPlay is true', () => {
    beforeEach(() => {
      trackCanPlayMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ButtonLoader component', () => {
      expect(wrapper.findComponent(ButtonLoader).exists()).toBe(false);
    });

    it('shows the IconButton component', () => {
      expect(wrapper.findComponent(IconButton).exists()).toBe(true);
    });

    describe.each([
      [false, buttonProps.false],
      [true, buttonProps.true],
    ])('when shuffle is set to %s', (shuffle, buttonProps) => {
      beforeEach(() => {
        trackIsPlayingMock.value = shuffle;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct color on IconButton component', () => {
        expect(wrapper.findComponent(IconButton).props('icon')).toBe(
          buttonProps.icon,
        );
      });

      it('sets the correct title on IconButton component', () => {
        const iconButton = wrapper.findComponent(IconButton);

        expect(iconButton.attributes('title')).toBe(buttonProps.title);
        expect(iconButton.text()).toBe(buttonProps.title);
      });

      describe('when the togglePlay button is clicked', () => {
        beforeEach(() => {
          wrapper.findComponent(IconButton).vm.$emit('click');
        });

        it('calls the togglePlay function', () => {
          expect(togglePlayMock).toHaveBeenCalled();
        });
      });
    });
  });
});
