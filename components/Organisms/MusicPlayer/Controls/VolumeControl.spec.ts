import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputRange from '@/components/Atoms/InputRange.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import VolumeControl from './VolumeControl.vue';

const { isMutedMock, setVolumeMock, toggleVolumeMock, volumeMock } =
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

  describe('when the ButtonLink component emits a click event', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('calls the toggleVolume function', () => {
      expect(toggleVolumeMock).toHaveBeenCalled();
    });
  });

  describe('when the InputRange component emits a change event', () => {
    beforeEach(() => {
      wrapper.findComponent(InputRange).vm.$emit('change');
    });

    it('calls the setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalled();
    });
  });

  describe('when isMuted value is false', () => {
    it('sets the correct title on button component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        'Mute',
      );
    });
  });

  describe('when isMuted value is true', () => {
    beforeEach(() => {
      isMutedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct title on button component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        'Unmute',
      );
    });
  });

  describe.each([
    [0, ICONS.volumeDefault],
    [0.1, ICONS.volume0],
    [0.3, ICONS.volume02],
    [0.6, ICONS.volume05],
  ])('when volume value is %f', (volume, icon) => {
    beforeEach(() => {
      volumeMock.value = volume;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon on button component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(icon);
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
