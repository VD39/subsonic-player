import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import PlaybackRateButton from './PlaybackRateButton.vue';

const { setPlaybackRateMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlaybackRateButton, {
    props: {
      ...props,
    },
  });
}

describe('PlaybackRateButton', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = factory();
    wrapper
      .findComponent(DropdownMenu)
      .findComponent(ButtonLink)
      .vm.$emit('click');
    await wrapper.vm.$nextTick();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the DropdownItem components', () => {
    expect(wrapper.findAllComponents(DropdownItem).length).toBe(6);
  });

  describe('when playback speed matches the playBackRate', () => {
    it('sets correct selected prop', () => {
      const dropdownItems = wrapper.findAllComponents(DropdownItem);
      expect(dropdownItems[0].props('selected')).toBe(false);
      expect(dropdownItems[1].props('selected')).toBe(false);
      expect(dropdownItems[2].props('selected')).toBe(true);
      expect(dropdownItems[3].props('selected')).toBe(false);
      expect(dropdownItems[4].props('selected')).toBe(false);
      expect(dropdownItems[5].props('selected')).toBe(false);
    });
  });

  describe('when the DropdownItem component emits a click event', () => {
    beforeEach(() => {
      wrapper.findAllComponents(DropdownItem)[2].vm.$emit('click');
    });

    it('calls the setPlaybackRate function', () => {
      expect(setPlaybackRateMock).toHaveBeenCalledWith(1);
    });
  });
});
