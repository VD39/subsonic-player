import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import InputRange from '@/components/FormFields/InputRange.vue';
import VolumeControl from './VolumeControl.vue';

const { setVolumeMock, isMutedMock, toggleVolumeMock, volumeMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(VolumeControl, {
    props: {
      ...props,
    },
  });
}

describe('VolumeControl', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when volume button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(IconButton).vm.$emit('click');
    });

    it('calls the toggleVolume function', () => {
      expect(toggleVolumeMock).toHaveBeenCalled();
    });
  });

  describe('when input range is changed', () => {
    beforeEach(() => {
      wrapper.findComponent(InputRange).vm.$emit('change');
    });

    it('calls the setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalled();
    });
  });

  describe('when isMuted is false', () => {
    it('sets the correct title on button component', () => {
      expect(wrapper.findComponent(IconButton).attributes('title')).toBe(
        'Mute',
      );
    });
  });

  describe('when isMuted is true', () => {
    beforeEach(() => {
      isMutedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct title on button component', () => {
      expect(wrapper.findComponent(IconButton).attributes('title')).toBe(
        'Unmute',
      );
    });
  });

  describe.each([
    [0, 'PhSpeakerX'],
    [0.1, 'PhSpeakerNone'],
    [0.3, 'PhSpeakerLow'],
    [0.6, 'PhSpeakerHigh'],
  ])('when volume is %f', (volume, icon) => {
    beforeEach(() => {
      volumeMock.value = volume;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon on button component', () => {
      expect(wrapper.findComponent(IconButton).props('icon')).toBe(icon);
    });

    it('sets the correct aria-valuetext on the input range', () => {
      expect(
        wrapper.findComponent(InputRange).attributes('aria-valuetext'),
      ).toBe(`${volume} of 1`);
    });

    it('sets the correct current volume percentage', () => {
      expect(wrapper.find({ ref: 'currentVolume' }).text()).toBe(
        `Volume at ${volume * 100}%`,
      );
    });
  });
});
