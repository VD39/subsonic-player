import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import {
  getFormattedPodcastEpisodesMock,
  getFormattedRadioStationMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import MixedTracksListItem from './MixedTracksListItem.vue';

const isCurrentTrackMock = vi.fn().mockReturnValue(false);

mockNuxtImport('useAudioPlayer', () => () => ({
  isCurrentTrack: isCurrentTrackMock,
}));

const track = getFormattedTracksMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(MixedTracksListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
        TrackPlayPause: true,
      },
    },
    props: {
      index: 0,
      track,
      ...props,
    },
  });
}

describe('MixedTracksListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the track does have a favourite key', () => {
    it('shows the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
    });
  });

  describe('when the track does not have a favourite key', () => {
    beforeEach(() => {
      const track = getFormattedTracksMock()[0];

      delete (track as Partial<Track>).favourite;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the FavouriteButton component', () => {
      expect(wrapper.findComponent(FavouriteButton).exists()).toBe(false);
    });
  });

  describe('when track does not have an album key', () => {
    beforeEach(() => {
      const track = getFormattedTracksMock()[0];

      delete (track as Partial<Track>).album;

      wrapper = factory({
        track,
      });
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

  describe('when track does have an album key', () => {
    describe('when track.album is defined', () => {
      it('shows the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the MarqueeScroll component containing the podcast name', () => {
        expect(
          wrapper.findComponent({ ref: 'podcastNameMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('does not show the album else element', () => {
        expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(false);
      });
    });

    describe('when track.album is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedTracksMock(1, {
            album: undefined,
          })[0],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      describe('when track does not have a podcastName key', () => {
        beforeEach(() => {
          const track = getFormattedPodcastEpisodesMock(1)[0];

          delete (track as Partial<PodcastEpisode>).podcastName;

          wrapper = factory({
            track,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the MarqueeScroll component containing the album details', () => {
          expect(
            wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
          ).toBe(false);
        });

        it('does not show the MarqueeScroll component containing the podcast name', () => {
          expect(
            wrapper.findComponent({ ref: 'podcastNameMarqueeScroll' }).exists(),
          ).toBe(false);
        });

        it('shows the album else element', () => {
          expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(true);
        });
      });

      describe('when track does have a podcastName key', () => {
        describe('when track.podcastName is undefined', () => {
          beforeEach(() => {
            wrapper = factory({
              track: getFormattedPodcastEpisodesMock(1, {
                podcastName: undefined,
              })[0],
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the MarqueeScroll component containing the album details', () => {
            expect(
              wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
            ).toBe(false);
          });

          it('does not show the MarqueeScroll component containing the podcast name', () => {
            expect(
              wrapper
                .findComponent({ ref: 'podcastNameMarqueeScroll' })
                .exists(),
            ).toBe(false);
          });

          it('shows the album else element', () => {
            expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(true);
          });
        });

        describe('when track.podcastName is defined', () => {
          beforeEach(() => {
            wrapper = factory({
              track: getFormattedPodcastEpisodesMock(1)[0],
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the MarqueeScroll component containing the album details', () => {
            expect(
              wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
            ).toBe(false);
          });

          it('shows the MarqueeScroll component containing the podcast name', () => {
            expect(
              wrapper
                .findComponent({ ref: 'podcastNameMarqueeScroll' })
                .exists(),
            ).toBe(true);
          });

          it('does not show the album else element', () => {
            expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(false);
          });
        });
      });
    });
  });

  describe('when track does not have an artists key', () => {
    beforeEach(() => {
      const track = getFormattedTracksMock()[0];

      delete (track as Partial<Track>).artists;

      wrapper = factory({
        track,
      });
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

  describe('when track does have an artists key', () => {
    describe('when track.artists is not an empty array', () => {
      it('shows the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the MarqueeScroll component containing the author details', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('does not show the artists else element', () => {
        expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
      });
    });

    describe('when track.artists is an empty array', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedTracksMock(1, {
            artists: [],
          })[0],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      describe('when track does not have an author key', () => {
        beforeEach(() => {
          const track = getFormattedPodcastEpisodesMock(1)[0];

          delete (track as Partial<PodcastEpisode>).author;

          wrapper = factory({
            track,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the MarqueeScroll component containing the artists details', () => {
          expect(
            wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
          ).toBe(false);
        });

        it('does not show the MarqueeScroll component containing the author details', () => {
          expect(
            wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
          ).toBe(false);
        });

        it('shows the artists else element', () => {
          expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
        });
      });

      describe('when track does have an author key', () => {
        describe('when track.author is undefined', () => {
          beforeEach(() => {
            wrapper = factory({
              track: getFormattedPodcastEpisodesMock(1, {
                author: undefined,
              })[0],
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the MarqueeScroll component containing the artists details', () => {
            expect(
              wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
            ).toBe(false);
          });

          it('does not show the MarqueeScroll component containing the author details', () => {
            expect(
              wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
            ).toBe(false);
          });

          it('shows the artists else element', () => {
            expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
          });
        });

        describe('when track.author is defined', () => {
          beforeEach(() => {
            wrapper = factory({
              track: getFormattedPodcastEpisodesMock(1, {
                author: 'author',
              })[0],
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('does not show the MarqueeScroll component containing the artists details', () => {
            expect(
              wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
            ).toBe(false);
          });

          it('shows the MarqueeScroll component containing the author details', () => {
            expect(
              wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
            ).toBe(true);
          });

          it('does not show the artists else element', () => {
            expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
          });
        });
      });
    });
  });

  describe('when hideRemoveOption prop is false', () => {
    it('shows the remove DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'dropdownItemRemove' }).exists(),
      ).toBe(true);
    });

    it('shows the track remove row element', () => {
      expect(wrapper.find({ ref: 'trackRemoveRow' }).exists()).toBe(true);
    });
  });

  describe('when hideRemoveOption prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideRemoveOption: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the remove DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'dropdownItemRemove' }).exists(),
      ).toBe(false);
    });

    it('does not show the track remove row element', () => {
      expect(wrapper.find({ ref: 'trackRemoveRow' }).exists()).toBe(false);
    });
  });

  describe(`when track.type is not ${MEDIA_TYPE.radioStation}`, () => {
    it('shows the add to playlist DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
        true,
      );
    });

    it('shows the media information DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'mediaInformation' }).exists()).toBe(
        true,
      );
    });

    it('shows the download media DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'downloadMedia' }).exists()).toBe(
        true,
      );
    });
  });

  describe(`when track.type is ${MEDIA_TYPE.radioStation}`, () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedRadioStationMock(1)[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the add to playlist DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
        false,
      );
    });

    it('does not show the media information DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'mediaInformation' }).exists()).toBe(
        false,
      );
    });

    it('does not show the download media DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'downloadMedia' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when track does not have albumId key', () => {
    beforeEach(() => {
      const track = getFormattedTracksMock(1)[0];

      delete (track as Partial<Track>).albumId;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the go to album DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToAlbum' }).exists()).toBe(false);
    });
  });

  describe('when track does have albumId key', () => {
    describe('when track.albumId is defined', () => {
      it('shows the go to album DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'goToAlbum' }).exists()).toBe(true);
      });
    });

    describe('when track.albumId is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedTracksMock(1, {
            albumId: undefined,
          })[0],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the go to album DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'goToAlbum' }).exists()).toBe(
          false,
        );
      });
    });
  });

  describe('when track does not have podcastId key', () => {
    beforeEach(() => {
      const track = getFormattedPodcastEpisodesMock()[0];

      delete (track as Partial<PodcastEpisode>).podcastId;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the go to podcast DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when track does have podcastId key', () => {
    describe('when track.podcastId is defined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedPodcastEpisodesMock(1)[0],
        });
      });

      it('shows the go to podcast DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(
          true,
        );
      });
    });

    describe('when track.podcastId is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedPodcastEpisodesMock(1, {
            podcastId: undefined,
          })[0],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the go to podcast DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(
          false,
        );
      });
    });
  });

  describe('when track does not have homePageUrl key', () => {
    beforeEach(() => {
      const track = getFormattedRadioStationMock()[0];

      delete (track as Partial<RadioStation>).homePageUrl;

      wrapper = factory({
        track,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the visit station DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'visitStation' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when track does have homePageUrl key', () => {
    describe('when track.homePageUrl is defined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedRadioStationMock(1)[0],
        });
      });

      it('shows the visit station DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'visitStation' }).exists()).toBe(
          true,
        );
      });
    });

    describe('when track.homePageUrl is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
          track: getFormattedRadioStationMock(1, { homePageUrl: undefined })[0],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the visit station DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'visitStation' }).exists()).toBe(
          false,
        );
      });
    });
  });

  describe('when hasAddToQueueEvent prop is false', () => {
    it('does not show the add to queue DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(false);
    });
  });

  describe('when hasAddToQueueEvent prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        hasAddToQueueEvent: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the add to queue DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(true);
    });

    describe('when the add to queue DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'addToQueue' }).vm.$emit('click');
      });

      it('emits the addToQueue event', () => {
        expect(wrapper.emitted('addToQueue')).toEqual([[]]);
      });
    });
  });

  describe.each([
    ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
    ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
    ['play track DropdownItem', 'playTrack', 'playTrack'],
    ['remove DropdownItem', 'dropdownItemRemove', 'remove'],
    ['remove ButtonLink', 'removeButton', 'remove'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[]]);
      });
    },
  );

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(async () => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
    });

    it('emits the playTrack event', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[]]);
    });
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    describe('when isCurrentTrack is true', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('does not emit the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toBeUndefined();
      });
    });

    describe('when isCurrentTrack is false', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('emits the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[]]);
      });
    });
  });

  describe('when the InteractionWrapper component emits the dragStart event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(InteractionWrapper)
        .vm.$emit('dragStart', DragEvent);
    });

    it('emits the dragStart event', () => {
      expect(wrapper.emitted('dragStart')).toEqual([[DragEvent]]);
    });
  });

  describe('when the InteractionWrapper component emits the longPress event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('longPress');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });

  describe('when the InteractionWrapper component emits the contextMenu event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('contextMenu');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });
});
