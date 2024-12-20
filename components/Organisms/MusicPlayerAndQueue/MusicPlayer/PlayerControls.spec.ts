import type { VueWrapper } from '@vue/test-utils';

import RepeatButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/RepeatButton.vue';
import ShuffleButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/ShuffleButton.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import PlayerControls from './PlayerControls.vue';

const { isRadioStationMock } = useAudioPlayerMock();

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

  describe('when isRadioStation value is false', () => {
    it('shows the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(true);
    });

    it('shows the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(true);
    });
  });

  describe('when isRadioStation value is true', () => {
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
