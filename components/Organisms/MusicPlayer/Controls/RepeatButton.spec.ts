import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

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
  all: {
    color: 'var(--theme-color)',
    icon: ICONS.repeat,
    title: 'Turn on repeat one',
    weight: 'fill',
  },
  off: {
    color: 'currentColor',
    icon: ICONS.repeat,
    title: 'Turn on repeat all',
    weight: 'duotone',
  },
  one: {
    color: 'var(--theme-color)',
    icon: ICONS.repeatOnce,
    title: 'Turn repeat off',
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

    it('sets the correct icon on ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        buttonProps.icon,
      );
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

    it('calls the setRepeat function', () => {
      expect(setRepeatMock).toHaveBeenCalled();
    });
  });
});
