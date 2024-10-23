import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import ShuffleButton from './ShuffleButton.vue';

const { shuffleMock, toggleShuffleMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(ShuffleButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  false: {
    color: 'currentColor',
    title: 'Switch shuffle off',
    weight: 'duotone',
  },
  true: {
    color: 'var(--theme-color)',
    title: 'Switch shuffle on',
    weight: 'fill',
  },
};

describe('ShuffleButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe.each([
    [false, buttonProps.false],
    [true, buttonProps.true],
  ])('when shuffle is set to %s', (shuffle, buttonProps) => {
    beforeEach(() => {
      shuffleMock.value = shuffle;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct color on ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
        buttonProps.color,
      );
    });

    it('sets the correct weight on ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
        buttonProps.weight,
      );
    });

    it('sets the correct title on ButtonLink component', () => {
      const buttonLink = wrapper.findComponent(ButtonLink);

      expect(buttonLink.attributes('title')).toBe(buttonProps.title);
      expect(buttonLink.text()).toBe(buttonProps.title);
    });
  });

  describe('when the ButtonLink component emits a click event', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('calls the toggleShuffle function', () => {
      expect(toggleShuffleMock).toHaveBeenCalled();
    });
  });
});
