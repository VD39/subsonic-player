import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import {
  getFormattedPodcastEpisodesMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import MixedTracksList from './MixedTracksList.vue';

let onAddToQueueMock: typeof vi.fn | undefined = undefined;
let onDragStartMock: typeof vi.fn | undefined = undefined;

vi.mock('vue', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...vue,
    getCurrentInstance: vi.fn(() => ({
      ...vue.getCurrentInstance(),
      vnode: {
        props: {
          onAddToQueue: onAddToQueueMock,
          onDragStart: onDragStartMock,
        },
      },
    })),
  };
});

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

async function factory(props = {}) {
  const wrapper = mount(MixedTracksList, {
    props: {
      tracks,
      ...props,
    },
  });

  await wrapper.vm.$nextTick();

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('MixedTracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    beforeEach(async () => {
      wrapper = await factory({
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
      beforeEach(async () => {
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).favourite;

        wrapper = await factory({
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
      beforeEach(async () => {
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).album;

        wrapper = await factory({
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
        beforeEach(async () => {
          wrapper = await factory({
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
          beforeEach(async () => {
            const tracks = getFormattedPodcastEpisodesMock(1);

            delete (tracks[0] as Partial<PodcastEpisode>).podcastName;

            wrapper = await factory({
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
            beforeEach(async () => {
              wrapper = await factory({
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
            beforeEach(async () => {
              wrapper = await factory({
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
      beforeEach(async () => {
        const tracks = getFormattedTracksMock(1);

        delete (tracks[0] as Partial<Track>).artists;

        wrapper = await factory({
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
        beforeEach(async () => {
          wrapper = await factory({
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
          beforeEach(async () => {
            const tracks = getFormattedPodcastEpisodesMock(1);

            delete (tracks[0] as Partial<PodcastEpisode>).author;

            wrapper = await factory({
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
            beforeEach(async () => {
              wrapper = await factory({
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
            beforeEach(async () => {
              wrapper = await factory({
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

    describe('when hideRemoveOption props is false', () => {
      it('shows the track options element in track header', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(true);
      });

      it('shows the remove DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'dropdownItemRemove' }).exists(),
        ).toBe(true);
      });

      it('shows the track options element in track row', () => {
        expect(wrapper.find({ ref: 'trackRemoveRow' }).exists()).toBe(true);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('when hideRemoveOption props is true', () => {
      beforeEach(async () => {
        wrapper = await factory({
          hideRemoveOption: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the track options element in track header', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(false);
      });

      it('does not show the remove DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'dropdownItemRemove' }).exists(),
        ).toBe(false);
      });

      it('does not show the track options element in track row', () => {
        expect(wrapper.find({ ref: 'trackRemoveRow' }).exists()).toBe(false);
      });
    });

    describe('when the onAddToQueue event is not attached', () => {
      it('does not show the add to queue DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(
          false,
        );
      });
    });

    describe('when the onAddToQueue event is attached', () => {
      beforeEach(async () => {
        onAddToQueueMock = vi.fn();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the add to queue DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(
          true,
        );
      });

      describe('when the add to queue DropdownItem component emits the click event', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'addToQueue' }).vm.$emit('click');
        });

        it('emits the addToQueue event with the correct value', () => {
          expect(wrapper.emitted('addToQueue')).toEqual([[tracks[0]]]);
        });
      });
    });

    describe.each([
      [
        'remove DropdownItem',
        'dropdownItemRemove',
        'remove',
        [
          {
            id: track.id,
            index: 0,
          },
        ],
      ],
      [
        'add to playlist DropdownItem',
        'addToPlaylist',
        'addToPlaylist',
        [track.id, 0],
      ],
      [
        'media information DropdownItem',
        'mediaInformation',
        'mediaInformation',
        [track],
      ],
      [
        'download media DropdownItem',
        'downloadMedia',
        'downloadMedia',
        [track],
      ],
      ['play track DropdownItem', 'playTrack', 'playTrack', [0]],
      [
        'remove ButtonLink',
        'removeButton',
        'remove',
        [
          {
            id: track.id,
            index: 0,
          },
        ],
      ],
    ])(
      'when the %s component emits the click event',
      (_text, ref, emitEventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent({ ref }).vm.$emit('click');
        });

        it(`emits the ${emitEventName} event with the correct value`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(async () => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with the correct value', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });

    describe('when the onDragStart event is not attached', () => {
      it('sets the correct draggable attribute on the track element', () => {
        expect(
          wrapper.find('[data-test-id="track"]').attributes('draggable'),
        ).toBe('false');
      });

      describe('when a track item is dragged', () => {
        beforeEach(async () => {
          await wrapper.find('[data-test-id="track"]').trigger('dragstart');
        });

        it('does not emit the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toBe(undefined);
        });
      });
    });

    describe('when the onDragStart event is attached', () => {
      beforeEach(async () => {
        onDragStartMock = vi.fn();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct draggable attribute on the track element', () => {
        expect(
          wrapper.find('[data-test-id="track"]').attributes('draggable'),
        ).toBe('true');
      });

      describe('when a track item is dragged', () => {
        beforeEach(async () => {
          await wrapper.find('[data-test-id="track"]').trigger('dragstart');
        });

        it('emits the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toEqual([
            [track, expect.any(DragEvent)],
          ]);
        });
      });
    });
  });
});
