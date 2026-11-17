import type { VueWrapper } from '@vue/test-utils';

import { useAudioPlayerMock } from '@@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/ui/ButtonLink.vue';

import RepeatButton from './RepeatButton.vue';

const { cycleRepeatMock, repeatMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(RepeatButton, {
    props: {
      ...props,
    },
  });
}

const buttonProps = {
  all: {
    icon: ICONS.repeat,
    stroke: 'var(--theme-color)',
    text: 'Turn on repeat one',
  },
  off: {
    icon: ICONS.repeat,
    stroke: 'currentColor',
    text: 'Turn on repeat all',
  },
  one: {
    icon: ICONS.repeatOnce,
    stroke: 'var(--theme-color)',
    text: 'Turn repeat off',
  },
};

describe('RepeatButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    [REPEAT_MODE.off, buttonProps.off],
    [REPEAT_MODE.one, buttonProps.one],
    [REPEAT_MODE.all, buttonProps.all],
  ])('when shuffle is set to %s', (repeat, buttonProps) => {
    beforeEach(() => {
      repeatMock.value = repeat;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        buttonProps.icon,
      );
    });

    it('sets the correct iconStroke prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('iconStroke')).toBe(
        buttonProps.stroke,
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
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent(ButtonLink).trigger('click');
    });

    it('calls the cycleRepeat function', () => {
      expect(cycleRepeatMock).toHaveBeenCalled();
    });
  });
});
