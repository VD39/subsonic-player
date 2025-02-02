import type { VueWrapper } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import QueueList from './QueueList.vue';

const tracks = getFormattedQueueTracksMock(5);

function factory(props = {}) {
  return mount(QueueList, {
    props: {
      tracks: [],
      ...props,
    },
  });
}

describe('QueueList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when tracks prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        tracks,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the track does have a favourite key', () => {
      it('shows the FavouriteButton component', () => {
        expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
      });
    });

    describe('when the track does not have a favourite key', () => {
      beforeEach(() => {
        const tracks = getFormattedQueueTracksMock(1);

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
        const tracks = getFormattedQueueTracksMock(1);

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

        it('does not show the LinkOrText component containing the podcast name link', () => {
          expect(
            wrapper.findComponent({ ref: 'podcastNameLinkOrText' }).exists(),
          ).toBe(false);
        });

        it('does not show the album else element', () => {
          expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(false);
        });
      });

      describe('when track.album is undefined', () => {
        beforeEach(() => {
          wrapper = factory({
            tracks: getFormattedQueueTracksMock(1, {
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
            const tracks = getFormattedQueueTracksMock(1);

            delete (tracks[0] as Partial<Track>).album;
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

          it('does not show the LinkOrText component containing the podcast name link', () => {
            expect(
              wrapper.findComponent({ ref: 'podcastNameLinkOrText' }).exists(),
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
                tracks: getFormattedQueueTracksMock(1, {
                  album: undefined,
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

            it('does not show the LinkOrText component containing the podcast name link', () => {
              expect(
                wrapper
                  .findComponent({ ref: 'podcastNameLinkOrText' })
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
                tracks: getFormattedQueueTracksMock(1, {
                  album: undefined,
                  podcastName: 'podcastName',
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

            it('shows the LinkOrText component containing the podcast name link', () => {
              expect(
                wrapper
                  .findComponent({ ref: 'podcastNameLinkOrText' })
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
        const tracks = getFormattedQueueTracksMock(1);

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
            tracks: getFormattedQueueTracksMock(1, {
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
            const tracks = getFormattedQueueTracksMock(1);

            delete (tracks[0] as Partial<Track>).artists;
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
                tracks: getFormattedQueueTracksMock(1, {
                  artists: [],
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
                tracks: getFormattedQueueTracksMock(1, {
                  artists: [],
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

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
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
