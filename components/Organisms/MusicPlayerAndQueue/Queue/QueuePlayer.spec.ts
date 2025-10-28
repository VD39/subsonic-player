import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import MediaInformation from '@/components/Organisms/MusicPlayerAndQueue/Controls/MediaInformation.vue';
import PlaybackRateButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/PlaybackRateButton.vue';
import RepeatButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/RepeatButton.vue';
import ShuffleButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/ShuffleButton.vue';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import QueuePlayer from './QueuePlayer.vue';

vi.useFakeTimers();

const toggleQueueListMock = vi.fn();
const toggleQueuePlayerMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  toggleQueueList: toggleQueueListMock,
  toggleQueuePlayer: toggleQueuePlayerMock,
}));

const {
  currentTrackMock,
  fastForwardTrackMock,
  isPodcastEpisodeMock,
  isRadioStationMock,
  isTrackMock,
  rewindTrackMock,
} = useAudioPlayerMock();

function factory(props = {}) {
  return mount(QueuePlayer, {
    attachTo: document.body,
    props: {
      ...props,
    },
  });
}

describe('QueuePlayer', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isTrack value is false', () => {
    it('does not show the MarqueeScroll component containing the album details', () => {
      expect(
        wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
      ).toBe(false);
    });

    it('does not show the MarqueeScroll component containing the artists details', () => {
      expect(
        wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
      ).toBe(false);
    });
  });

  describe('when isTrack value is true', () => {
    beforeEach(() => {
      isTrackMock.value = true;
    });

    describe('when the track does not have an album key', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock()[0];

        delete (currentTrackMock.value as Partial<Track>).album;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrackMock.album is undefined', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock(1, {
          album: undefined,
        })[0];
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrackMock.album is defined', () => {
      beforeEach(async () => {
        currentTrackMock.value = getFormattedQueueTracksMock()[0];
        wrapper = factory();
        await wrapper.vm.$nextTick();
      });

      it('shows the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(true);
      });
    });

    describe('when the track does not have an artists key', () => {
      beforeEach(() => {
        delete (currentTrackMock.value as Partial<Track>).artists;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrackMock.artists is an empty array', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock(1, {
          artists: [],
        })[0];
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrackMock.artists is not an empty array', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock()[0];
      });

      it('shows the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(true);
      });
    });
  });

  describe('when isRadioStation value is false', () => {
    it('shows the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(true);
    });

    it('shows the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(true);
    });

    it('shows the MediaInformation component', () => {
      expect(wrapper.findComponent(MediaInformation).exists()).toBe(true);
    });

    it('shows the time progress element', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(true);
    });
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

    it('does not show the RepeatButton component', () => {
      expect(wrapper.findComponent(RepeatButton).exists()).toBe(false);
    });

    it('does not show the ShuffleButton component', () => {
      expect(wrapper.findComponent(ShuffleButton).exists()).toBe(false);
    });

    it('does not show the time progress element', () => {
      expect(wrapper.find({ ref: 'timeProgress' }).exists()).toBe(false);
    });
  });

  describe('when isPodcastEpisode value is false', () => {
    it('does not show the MarqueeScroll component containing the podcast name link', () => {
      expect(
        wrapper.findComponent({ ref: 'podcastIdMarqueeScroll' }).exists(),
      ).toBe(false);
    });

    it('does not show the MarqueeScroll component containing the author details', () => {
      expect(
        wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
      ).toBe(false);
    });

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

    describe('when currentTrack value does not have an podcastId key', () => {
      beforeEach(() => {
        delete (currentTrackMock.value as PodcastEpisode).podcastId;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the podcast name link', () => {
        expect(
          wrapper.findComponent({ ref: 'podcastIdMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrack value does have a podcastId key', () => {
      describe('when currentTrack.podcastId is undefined', () => {
        beforeEach(() => {
          currentTrackMock.value = getFormattedQueueTracksMock(1, {
            podcastId: undefined,
            podcastName: 'podcastName',
          })[0];
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the MarqueeScroll component containing the podcast name link', () => {
          expect(
            wrapper.findComponent({ ref: 'podcastIdMarqueeScroll' }).exists(),
          ).toBe(false);
        });
      });

      describe('when currentTrack.podcastId is defined', () => {
        beforeEach(() => {
          currentTrackMock.value = getFormattedQueueTracksMock(1, {
            podcastId: 'podcastId',
            podcastName: 'podcastName',
          })[0];
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the MarqueeScroll component containing the podcast name link', () => {
          expect(
            wrapper.findComponent({ ref: 'podcastIdMarqueeScroll' }).exists(),
          ).toBe(true);
        });
      });
    });

    describe('when currentTrack value does not have an author key', () => {
      beforeEach(() => {
        delete (currentTrackMock.value as Partial<PodcastEpisode>).author;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the author details', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when currentTrack value contain author', () => {
      describe('when currentTrack.author is undefined', () => {
        beforeEach(() => {
          currentTrackMock.value = getFormattedQueueTracksMock(1, {
            author: undefined,
          })[0];
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the MarqueeScroll component containing the author details', () => {
          expect(
            wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
          ).toBe(false);
        });
      });

      describe('when currentTrack.author is defined', () => {
        beforeEach(() => {
          currentTrackMock.value = getFormattedQueueTracksMock(1, {
            author: 'author',
          })[0];
        });

        it('shows the MarqueeScroll component containing the author details', () => {
          expect(
            wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
          ).toBe(true);
        });
      });
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

  describe('when the rewind button is clicked once', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'rewindButton' }).trigger('click');
    });

    it('does not call the rewindTrack function', () => {
      expect(rewindTrackMock).not.toHaveBeenCalled();
    });
  });

  describe('when the rewind button is clicked twice rapidly', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'rewindButton' }).trigger('click');
      await wrapper.find({ ref: 'rewindButton' }).trigger('click');
      vi.advanceTimersByTime(300);
    });

    it('calls the rewindTrack function', () => {
      expect(rewindTrackMock).toHaveBeenCalled();
    });
  });

  describe('when the fast forward button is clicked once', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'fastForwardButton' }).trigger('click');
    });

    it('does not call the fastForwardTrack function', () => {
      expect(fastForwardTrackMock).not.toHaveBeenCalled();
    });
  });

  describe('when the fast forward button is clicked twice rapidly', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'fastForwardButton' }).trigger('click');
      await wrapper.find({ ref: 'fastForwardButton' }).trigger('click');
    });

    it('calls the fastForwardTrack function', () => {
      expect(fastForwardTrackMock).toHaveBeenCalled();
    });
  });

  describe('when the close queue menu ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'closeQueueMenu' }).vm.$emit('click');
    });

    it('calls the toggleQueuePlayer function', () => {
      expect(toggleQueuePlayerMock).toHaveBeenCalled();
    });
  });

  describe('when the open queue list ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'openQueueList' }).vm.$emit('click');
    });

    it('calls the toggleQueueList function', () => {
      expect(toggleQueueListMock).toHaveBeenCalled();
    });
  });
});
