import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import RepeatButton from '@/components/player/controls/RepeatButton.vue';
import ShuffleButton from '@/components/player/controls/ShuffleButton.vue';
import { useQueueMock } from '@/test/useQueueMock';

import PlayerControls from './PlayerControls.vue';

const { isRadioStationMock } = useQueueMock();

function factory(props = {}) {
  return mount(PlayerControls, {
    props: {
      ...props,
    },
  });
}

describe('PlayerControls', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the isRadioStation value is false', () => {
    it('shows the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(true);
    });

    it('shows the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(true);
    });
  });

  describe('when the isRadioStation value is true', () => {
    beforeEach(() => {
      isRadioStationMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(false);
    });

    it('does not show the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(false);
    });
  });
});
