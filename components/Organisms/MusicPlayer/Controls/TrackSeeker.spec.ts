import type { VueWrapper } from '@vue/test-utils';

import InputRange from '@/components/Atoms/InputRange.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import TrackSeeker from './TrackSeeker.vue';

const { setCurrentTimeMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(TrackSeeker, {
    props: {
      ...props,
    },
  });
}

describe('TrackSeeker', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the correct aria-valuetext attribute on the input range', () => {
    expect(wrapper.findComponent(InputRange).attributes('aria-valuetext')).toBe(
      '00:00 of 00:00',
    );
  });

  describe('when the InputRange component emits a change event', () => {
    beforeEach(() => {
      wrapper.findComponent(InputRange).vm.$emit('change', 10);
    });

    it('calls the setCurrentTime function', () => {
      expect(setCurrentTimeMock).toHaveBeenCalled();
    });
  });
});
