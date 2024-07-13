import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
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

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when DropdownMenu button is clicked', () => {
    beforeEach(async () => {
      wrapper
        .findComponent(DropdownMenu)
        .findComponent(IconButton)
        .vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the DropdownItem components', () => {
      expect(wrapper.findAllComponents(DropdownItem).length).toBe(4);
    });

    describe('when playback speed matches the playBackRate', () => {
      it('sets correct selected prop', () => {
        const dropdownItems = wrapper.findAllComponents(DropdownItem);
        expect(dropdownItems[0].props('selected')).toBe(false);
        expect(dropdownItems[1].props('selected')).toBe(true);
        expect(dropdownItems[2].props('selected')).toBe(false);
        expect(dropdownItems[3].props('selected')).toBe(false);
      });
    });

    describe('when the DropdownItem button is clicked', () => {
      beforeEach(() => {
        wrapper.findAllComponents(DropdownItem)[2].vm.$emit('click');
      });

      it('calls the setPlaybackRate function', () => {
        expect(setPlaybackRateMock).toHaveBeenCalledWith(1.5);
      });
    });
  });
});
