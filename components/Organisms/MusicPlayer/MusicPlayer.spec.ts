import type { VueWrapper } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import TrackSeeker from './Controls/TrackSeeker.vue';
import MusicPlayer from './MusicPlayer.vue';

const { currentTrackMock, durationMock, isRadioStationMock, isTrackMock } =
  useAudioPlayerMock();

function factory(props = {}) {
  return mount(MusicPlayer, {
    props: {
      ...props,
    },
  });
}

describe('MusicPlayer', () => {
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

    it('does not show the TrackSeeker component', () => {
      expect(wrapper.findComponent(TrackSeeker).exists()).toBe(false);
    });
  });

  describe('when isRadioStation value is false', () => {
    beforeEach(() => {
      isRadioStationMock.value = false;
    });

    describe('when duration is 0', () => {
      it('does not show the TrackSeeker component', () => {
        expect(wrapper.findComponent(TrackSeeker).exists()).toBe(false);
      });
    });

    describe('when duration value is greater than 0', () => {
      beforeEach(() => {
        durationMock.value = 10;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the TrackSeeker component', () => {
        expect(wrapper.findComponent(TrackSeeker).exists()).toBe(true);
      });
    });
  });

  describe('when isTrack value is false', () => {
    it('does not show the ImageLink component', () => {
      expect(wrapper.findComponent(ImageLink).exists()).toBe(false);
    });
  });

  describe('when isTrack value is true', () => {
    beforeEach(() => {
      isTrackMock.value = true;
    });

    describe('when currentTrack value does not contain albumId', () => {
      beforeEach(() => {
        delete (currentTrackMock.value as Track).albumId;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ImageLink component', () => {
        expect(wrapper.findComponent(ImageLink).exists()).toBe(false);
      });
    });

    describe('when currentTrack value contain albumId', () => {
      describe('when currentTrack.albumId is undefined', () => {
        beforeEach(() => {
          currentTrackMock.value = {
            ...currentTrackMock.value,
            albumId: undefined,
          };
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the ImageLink component', () => {
          expect(wrapper.findComponent(ImageLink).exists()).toBe(false);
        });
      });

      describe('when currentTrack.albumId is defined', () => {
        beforeEach(() => {
          currentTrackMock.value = getFormattedQueueTracksMock()[0];
        });

        it('shows the ImageLink component', () => {
          expect(wrapper.findComponent(ImageLink).exists()).toBe(true);
        });
      });
    });
  });

  describe('when currentTrack value does not contain artists', () => {
    beforeEach(() => {
      delete (currentTrackMock.value as Partial<Track>).artists;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
    });
  });

  describe('when currentTrack value contain artists', () => {
    describe('when currentTrack.artists is an empty array', () => {
      beforeEach(() => {
        currentTrackMock.value = {
          ...currentTrackMock.value,
          artists: [],
        };
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });

    describe('when currentTrack.artists is not an empty array', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock()[0];
      });

      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });
  });
});
