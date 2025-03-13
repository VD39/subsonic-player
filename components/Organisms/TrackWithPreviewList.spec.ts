import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import {
  getFormattedPodcastEpisodesMock,
  getFormattedTracksMock,
} from '@/test/helpers';
import { mount } from '@vue/test-utils';

import TrackWithPreviewList from './TrackWithPreviewList.vue';

const tracks = getFormattedTracksMock(5);

function factory(props = {}) {
  const wrapper = mount(TrackWithPreviewList, {
    props: {
      tracks,
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('TrackWithPreviewList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        tracks: [],
      });
    });

    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when tracks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaArtistsListMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the track does have a favourite key', () => {
      it('shows the FavouriteButton component', () => {
        expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
      });
    });

    describe('when the track does not have a favourite key', () => {
      beforeEach(() => {
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).favourite;

        wrapper = factory({
          tracks,
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
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).album;

        wrapper = factory({
          tracks,
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
            tracks: getFormattedTracksMock(1, {
              album: undefined,
            }),
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

        describe('when track does not have an podcastName key', () => {
          beforeEach(() => {
            const tracks = getFormattedPodcastEpisodesMock(1);

            delete (tracks[0] as Partial<PodcastEpisode>).podcastName;

            wrapper = factory({
              tracks,
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

        describe('when track does have an podcastName key', () => {
          describe('when track.podcastName is undefined', () => {
            beforeEach(() => {
              wrapper = factory({
                tracks: getFormattedPodcastEpisodesMock(1, {
                  podcastName: undefined,
                }),
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
                tracks: getFormattedPodcastEpisodesMock(1),
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
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).artists;

        wrapper = factory({
          tracks,
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
        it('shows the MarqueeScroll component containing the album details', () => {
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
            tracks: getFormattedTracksMock(1, {
              artists: [],
            }),
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
            const tracks = getFormattedPodcastEpisodesMock(1);

            delete (tracks[0] as Partial<PodcastEpisode>).author;

            wrapper = factory({
              tracks,
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
                tracks: getFormattedPodcastEpisodesMock(1, {
                  author: undefined,
                }),
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
                tracks: getFormattedPodcastEpisodesMock(1, {
                  author: 'author',
                }),
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

    describe('when inQueue prop is false', () => {
      it('does not show the remove from queue ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'removeFromQueue' }).exists()).toBe(
          false,
        );
      });

      it('shows the DropdownMenu component', () => {
        expect(wrapper.findComponent(DropdownMenu).exists()).toBe(true);
      });

      describe('when the media information DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'mediaInformation' }).vm.$emit('click');
        });

        it('emits the mediaInformation event with track', () => {
          expect(wrapper.emitted('mediaInformation')).toEqual([[tracks[0]]]);
        });
      });

      describe('when the download media DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'downloadMedia' }).vm.$emit('click');
        });

        it('emits the downloadMedia event with track', () => {
          expect(wrapper.emitted('downloadMedia')).toEqual([[tracks[0].id]]);
        });
      });

      describe('when the add to queue DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'addToQueue' }).vm.$emit('click');
        });

        it('emits the addToQueue event with track', () => {
          expect(wrapper.emitted('addToQueue')).toEqual([[tracks[0]]]);
        });
      });

      describe('when the play track DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'playTrack' }).vm.$emit('click');
        });

        it('emits the playTrack event with track', () => {
          expect(wrapper.emitted('playTrack')).toEqual([[0]]);
        });
      });

      describe('when the TrackPlayPause component emits the playTrack event', () => {
        beforeEach(() => {
          wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
        });

        it('emits the playTrack event with track', () => {
          expect(wrapper.emitted('playTrack')).toEqual([[0]]);
        });
      });

      describe('when inPlaylist prop is false', () => {
        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the remove from playlist DropdownItem component', () => {
          expect(
            wrapper.findComponent({ ref: 'removeFromPlaylist' }).exists(),
          ).toBe(false);
        });

        it('shows the add to playlist DropdownItem component', () => {
          expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
            true,
          );
        });

        describe('when the add to playlist DropdownItem component emits the click event', () => {
          beforeEach(() => {
            wrapper.findComponent({ ref: 'addToPlaylist' }).vm.$emit('click');
          });

          it('emits the addToPlaylist event with track', () => {
            expect(wrapper.emitted('addToPlaylist')).toEqual([[tracks[0].id]]);
          });
        });
      });

      describe('when inPlaylist prop is true', () => {
        beforeEach(() => {
          wrapper = factory({
            inPlaylist: true,
            tracks,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the remove from playlist DropdownItem component', () => {
          expect(
            wrapper.findComponent({ ref: 'removeFromPlaylist' }).exists(),
          ).toBe(true);
        });

        it('does not show the add to playlist DropdownItem component', () => {
          expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
            false,
          );
        });

        describe('when the remove from playlist DropdownItem component emits the click event', () => {
          beforeEach(() => {
            wrapper
              .findComponent({ ref: 'removeFromPlaylist' })
              .vm.$emit('click');
          });

          it('emits the removeFromPlaylist event with track', () => {
            expect(wrapper.emitted('removeFromPlaylist')).toEqual([[0]]);
          });
        });
      });
    });

    describe('when inQueue prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          inQueue: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the remove from queue ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'removeFromQueue' }).exists()).toBe(
          true,
        );
      });

      it('does not show the DropdownMenu component', () => {
        expect(wrapper.findComponent(DropdownMenu).exists()).toBe(false);
      });

      describe('when the remove from queue ButtonLink component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'removeFromQueue' }).vm.$emit('click');
        });

        it('emits the removeFromQueue event with track', () => {
          expect(wrapper.emitted('removeFromQueue')).toEqual([[tracks[0].id]]);
        });
      });
    });
  });
});
