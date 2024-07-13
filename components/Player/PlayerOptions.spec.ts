import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import PlaybackRateButton from './Controls/PlaybackRateButton.vue';
import MediaInformation from './Controls/MediaInformation.vue';
import PlayerOptions from './PlayerOptions.vue';

const { isPodcastMock, isRadioStationMock, isTrackMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(PlayerOptions, {
    props: {
      ...props,
    },
    global: {
      stubs: {
        teleport: true,
      },
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

  describe('when isRadioStation is false', () => {
    it('shows the time progress component', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(true);
    });
  });

  describe('when isRadioStation is true', () => {
    beforeEach(() => {
      isRadioStationMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the time progress component', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(false);
    });
  });

  describe('when isPodcast is false', () => {
    it('does not show the PlaybackRateButton component', () => {
      expect(wrapper.findComponent(PlaybackRateButton).exists()).toBe(false);
    });
  });

  describe('when isPodcast is true', () => {
    beforeEach(() => {
      isPodcastMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the PlaybackRateButton component', () => {
      expect(wrapper.findComponent(PlaybackRateButton).exists()).toBe(true);
    });

    it('shows the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(true);
    });
  });

  describe('when isTrack is false', () => {
    it('does not show the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(false);
    });
  });

  describe('when isTrack is true', () => {
    beforeEach(() => {
      isTrackMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
    });

    it('shows the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(true);
    });
  });

  describe('when isPodcast and isTrack are false', () => {
    beforeEach(() => {
      isTrackMock.value = false;
      isPodcastMock.value = false;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(false);
    });
  });
});
