import type { VueWrapper } from '@vue/test-utils';

import { useAudioPlayerMock } from '@@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/ui/ButtonLink.vue';

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
    stroke: 'currentColor',
    text: 'Switch shuffle on',
  },
  true: {
    stroke: 'var(--theme-color)',
    text: 'Switch shuffle off',
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

    it('calls the toggleShuffle function', () => {
      expect(toggleShuffleMock).toHaveBeenCalled();
    });
  });
});
