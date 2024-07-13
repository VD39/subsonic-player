import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
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
  true: {
    color: 'var(--theme-color)',
    title: 'Switch shuffle on',
    weight: 'fill',
  },
  false: {
    color: 'currentColor',
    title: 'Switch shuffle off',
    weight: 'duotone',
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

    it('sets the correct color on IconButton component', () => {
      expect(wrapper.findComponent(IconButton).props('iconColor')).toBe(
        buttonProps.color,
      );
    });

    it('sets the correct weight on IconButton component', () => {
      expect(wrapper.findComponent(IconButton).props('iconWeight')).toBe(
        buttonProps.weight,
      );
    });

    it('sets the correct title on IconButton component', () => {
      const iconButton = wrapper.findComponent(IconButton);

      expect(iconButton.attributes('title')).toBe(buttonProps.title);
      expect(iconButton.text()).toBe(buttonProps.title);
    });
  });

  describe('when the shuffle button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(IconButton).vm.$emit('click');
    });

    it('calls the toggleShuffle function', () => {
      expect(toggleShuffleMock).toHaveBeenCalled();
    });
  });
});
