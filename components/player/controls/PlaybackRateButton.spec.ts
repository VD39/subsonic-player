import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import PlaybackRateButton from './PlaybackRateButton.vue';

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
}));

const { playbackRateMock, setPlaybackRateMock } = useAudioPlayerMock();

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

  it('shows the correct number of the DropdownItem component', () => {
    expect(wrapper.findAllComponents(DropdownItem)).toHaveLength(
      PLAYBACK_RATES.length,
    );
  });

  describe('when playback speed matches the playbackRate', () => {
    it('sets the correct selected prop on the DropdownItem component', () => {
      expect(
        wrapper
          .findAllComponents(DropdownItem)
          [playbackRateMock.value].props('selected'),
      ).toBe(true);
    });
  });

  describe('when the DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findAllComponents(DropdownItem)[2].vm.$emit('click');
    });

    it('calls the setPlaybackRate function with the correct parameters', () => {
      expect(setPlaybackRateMock).toHaveBeenCalledWith(2);
    });
  });
});
