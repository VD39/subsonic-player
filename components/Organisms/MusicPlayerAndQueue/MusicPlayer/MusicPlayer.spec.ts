import type { VueWrapper } from '@vue/test-utils';

import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mount } from '@vue/test-utils';

import MusicPlayer from './MusicPlayer.vue';

const { currentTrackMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(MusicPlayer, {
    global: {
      stubs: {
        TrackSeeker: true,
      },
    },
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

  describe('when currentTrack value does not have an albumId key', () => {
    beforeEach(() => {
      delete (currentTrackMock.value as Track).albumId;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ImageLink component containing the album link', () => {
      expect(wrapper.findComponent({ ref: 'albumImageLink' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when currentTrack value does have an albumId key', () => {
    describe('when currentTrack.albumId is defined', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock()[0];
      });

      it('shows the ImageLink component containing the album link', () => {
        expect(wrapper.findComponent({ ref: 'albumImageLink' }).exists()).toBe(
          true,
        );
      });

      it('does not show the ImageLink component containing the podcast name link', () => {
        expect(
          wrapper.findComponent({ ref: 'podcastImageLink' }).exists(),
        ).toBe(false);
      });

      it('does not show the PreloadImage component', () => {
        expect(wrapper.findComponent(PreloadImage).exists()).toBe(true);
      });
    });

    describe('when currentTrack.albumId is undefined', () => {
      beforeEach(() => {
        currentTrackMock.value = getFormattedQueueTracksMock(1, {
          albumId: undefined,
        })[0];
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ImageLink component containing the album link', () => {
        expect(wrapper.findComponent({ ref: 'albumImageLink' }).exists()).toBe(
          false,
        );
      });

      describe('when currentTrack value does not have an podcastId key', () => {
        beforeEach(() => {
          delete (currentTrackMock.value as PodcastEpisode).podcastId;
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the ImageLink component containing the album link', () => {
          expect(
            wrapper.findComponent({ ref: 'albumImageLink' }).exists(),
          ).toBe(false);
        });

        it('does not show the ImageLink component containing the podcast name link', () => {
          expect(
            wrapper.findComponent({ ref: 'podcastImageLink' }).exists(),
          ).toBe(false);
        });

        it('shows the PreloadImage component', () => {
          expect(wrapper.findComponent(PreloadImage).exists()).toBe(true);
        });
      });

      describe('when currentTrack value does have an podcastId key', () => {
        describe('when currentTrack.podcastId is undefined', () => {
          beforeEach(() => {
            currentTrackMock.value = getFormattedQueueTracksMock(1, {
              albumId: undefined,
              podcastId: undefined,
            })[0];
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the ImageLink component containing the album link', () => {
            expect(
              wrapper.findComponent({ ref: 'albumImageLink' }).exists(),
            ).toBe(false);
          });

          it('does not show the ImageLink component containing the podcast name link', () => {
            expect(
              wrapper.findComponent({ ref: 'podcastImageLink' }).exists(),
            ).toBe(false);
          });

          it('shows the PreloadImage component', () => {
            expect(wrapper.findComponent(PreloadImage).exists()).toBe(true);
          });
        });

        describe('when currentTrack.podcastId is defined', () => {
          beforeEach(() => {
            currentTrackMock.value = getFormattedQueueTracksMock(1, {
              albumId: undefined,
              podcastId: 'podcastId',
            })[0];
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the ImageLink component containing the album link', () => {
            expect(
              wrapper.findComponent({ ref: 'albumImageLink' }).exists(),
            ).toBe(false);
          });

          it('shows the ImageLink component containing the podcast name link', () => {
            expect(
              wrapper.findComponent({ ref: 'podcastImageLink' }).exists(),
            ).toBe(true);
          });

          it('does not show the PreloadImage component', () => {
            expect(wrapper.findComponent(PreloadImage).exists()).toBe(true);
          });
        });
      });
    });
  });

  describe('when currentTrack value does not have an artists key', () => {
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

  describe('when currentTrack value contain artists', () => {
    describe('when currentTrack.artists is an empty array', () => {
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

    describe('when currentTrack.artists is not an empty array', () => {
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
