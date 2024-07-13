import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import InputRange from '@/components/FormFields/InputRange.vue';
import TrackSeeker from './TrackSeeker.vue';

const { durationMock, isRadioStationMock, setCurrentTimeMock } =
  useAudioPlayerMock();

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
    durationMock.value = 0;
    isRadioStationMock.value = true;
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when duration is 0', () => {
    it('does not show the InputRange component', () => {
      expect(wrapper.findComponent(InputRange).exists()).toBe(false);
    });
  });

  describe('when isRadioStation is true', () => {
    it('does not show the InputRange component', () => {
      expect(wrapper.findComponent(InputRange).exists()).toBe(false);
    });
  });

  describe('when duration greater than 0 and isRadioStation is false', () => {
    beforeEach(() => {
      durationMock.value = 10;
      isRadioStationMock.value = false;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the InputRange component', () => {
      expect(wrapper.findComponent(InputRange).exists()).toBe(true);
    });

    it('sets the correct aria-valuetext on the input range', () => {
      expect(
        wrapper.findComponent(InputRange).attributes('aria-valuetext'),
      ).toBe('00:05 of 00:10');
    });

    describe('when input range is changed', () => {
      beforeEach(() => {
        wrapper.findComponent(InputRange).vm.$emit('change', 10);
      });

      it('calls the setCurrentTime function', () => {
        expect(setCurrentTimeMock).toHaveBeenCalled();
      });
    });
  });
});
