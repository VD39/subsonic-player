import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import RepeatButton from './RepeatButton.vue';

const { repeatMock, setRepeatMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(RepeatButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  off: {
    color: 'currentColor',
    icon: 'PhRepeat',
    title: 'Turn on repeat all.',
    weight: 'duotone',
  },
  one: {
    color: 'var(--theme-color)',
    icon: 'PhRepeatOnce',
    title: 'Turn repeat off.',
    weight: 'fill',
  },
  all: {
    color: 'var(--theme-color)',
    icon: 'PhRepeat',
    title: 'Turn on repeat one.',
    weight: 'fill',
  },
};

describe('RepeatButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe.each([
    [-1, buttonProps.off],
    [1, buttonProps.one],
    [Number.POSITIVE_INFINITY, buttonProps.all],
  ])('when shuffle is set to %s', (repeat, buttonProps) => {
    beforeEach(() => {
      repeatMock.value = repeat;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon on IconButton component', () => {
      expect(wrapper.findComponent(IconButton).props('icon')).toBe(
        buttonProps.icon,
      );
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

  describe('when the repeat button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(IconButton).vm.$emit('click');
    });

    it('calls the setRepeat function', () => {
      expect(setRepeatMock).toHaveBeenCalled();
    });
  });
});
