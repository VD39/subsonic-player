import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import MediaInformation from '@/components/Organisms/MusicPlayerAndQueue/Controls/MediaInformation.vue';
import PlaybackRateButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/PlaybackRateButton.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import PlayerOptions from './PlayerOptions.vue';

const { currentTrackMock, isPodcastEpisodeMock, isRadioStationMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlayerOptions, {
    props: {
      ...props,
    },
  });
}

describe('PlayerOptions', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isRadioStation value is true', () => {
    beforeEach(() => {
      isRadioStationMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(false);
    });

    it('does not show the time progress element', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(false);
    });
  });

  describe('when isRadioStation value is false', () => {
    beforeEach(() => {
      isRadioStationMock.value = false;
    });

    it('shows the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(true);
    });

    it('shows the time progress element', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(true);
    });
  });

  describe('when isPodcastEpisode value is false', () => {
    it('does not show the PlaybackRateButton component', () => {
      expect(wrapper.findComponent(PlaybackRateButton).exists()).toBe(false);
    });
  });

  describe('when isPodcastEpisode value is true', () => {
    beforeEach(() => {
      isPodcastEpisodeMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the PlaybackRateButton component', () => {
      expect(wrapper.findComponent(PlaybackRateButton).exists()).toBe(true);
    });
  });

  describe('when currentTrack value does have a favourite key', () => {
    it('shows the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
    });
  });

  describe('when currentTrack value does not have a favourite key', () => {
    beforeEach(() => {
      delete (currentTrackMock.value as Partial<Track>).favourite;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(false);
    });
  });
});
