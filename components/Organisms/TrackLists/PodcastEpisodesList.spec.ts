import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';

import PodcastEpisodesList from './PodcastEpisodesList.vue';

let podcastEpisodes = getFormattedPodcastEpisodesMock(5);
const podcastEpisode = podcastEpisodes[0];

async function factory(props = {}) {
  const wrapper = mount(PodcastEpisodesList, {
    props: {
      podcastEpisodes,
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

describe('PodcastEpisodesList', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    podcastEpisodes = getFormattedPodcastEpisodesMock(5);
    wrapper = await factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when podcastEpisodes prop is an empty array', () => {
    beforeEach(async () => {
      wrapper = await factory({
        podcastEpisodes: [],
      });
    });

    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when podcastEpisodes prop is not an empty array', () => {
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

    describe('when the episode has a description', () => {
      it('shows the description element', () => {
        expect(wrapper.find({ ref: 'description' }).exists()).toBe(true);
      });
    });

    describe('when the episode has no description', () => {
      beforeEach(async () => {
        wrapper = await factory({
          podcastEpisodes: getFormattedPodcastEpisodesMock(1, {
            description: undefined,
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the description element', () => {
        expect(wrapper.find({ ref: 'description' }).exists()).toBe(false);
      });
    });

    describe('when the episode has an author', () => {
      it('shows the MarqueeScroll component containing the author', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(true);
      });
    });

    describe('when the episode has no author', () => {
      beforeEach(async () => {
        wrapper = await factory({
          podcastEpisodes: getFormattedPodcastEpisodesMock(1, {
            author: undefined,
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the author', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(false);
      });
    });

    describe('when episode is downloaded', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct draggable attribute value on track element', () => {
        expect(
          wrapper.find('[data-test-id="track"]').attributes('draggable'),
        ).toBe('true');
      });

      it('shows the TrackPlayPause component', () => {
        expect(wrapper.findComponent(TrackPlayPause).exists()).toBe(true);
      });

      it('does not show the DownloadPodcastEpisode component', () => {
        expect(wrapper.findComponent(DownloadPodcastEpisode).exists()).toBe(
          false,
        );
      });

      it('shows the delete episode DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'deleteEpisode' }).exists()).toBe(
          true,
        );
      });

      it('shows the download media DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'downloadMedia' }).exists()).toBe(
          true,
        );
      });

      it('shows the add to playlist DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
          true,
        );
      });

      it('shows the add to queue DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(
          true,
        );
      });

      it('shows the play episode DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'playEpisode' }).exists()).toBe(
          true,
        );
      });

      it('does not show the download episode DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'downloadEpisodeDropdownItem' })
            .exists(),
        ).toBe(false);
      });

      it('shows the downloaded icon component', () => {
        expect(wrapper.find({ ref: 'downloaded' }).exists()).toBe(true);
      });

      it('does not show the download episode ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'downloadEpisodeButton' }).exists(),
        ).toBe(false);
      });

      describe.each([
        [
          'delete episode DropdownItem',
          'deleteEpisode',
          'deleteEpisode',
          [podcastEpisode.id],
        ],
        [
          'download media DropdownItem',
          'downloadMedia',
          'downloadMedia',
          [podcastEpisode],
        ],
        [
          'add to playlist DropdownItem',
          'addToPlaylist',
          'addToPlaylist',
          [podcastEpisode.id],
        ],
        [
          'add to queue DropdownItem',
          'addToQueue',
          'addToQueue',
          [podcastEpisode],
        ],
        [
          'play episode DropdownItem',
          'playEpisode',
          'playEpisode',
          [podcastEpisode],
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

        it('emits the playEpisode event with the correct value', () => {
          expect(wrapper.emitted('playEpisode')).toEqual([[podcastEpisode]]);
        });
      });
    });

    describe('when episode is not downloaded', () => {
      beforeEach(async () => {
        podcastEpisodes = getFormattedPodcastEpisodesMock(1, {
          downloaded: false,
        });

        wrapper = await factory({
          podcastEpisodes,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct draggable attribute value on track element', () => {
        expect(
          wrapper.find('[data-test-id="track"]').attributes('draggable'),
        ).toBe('false');
      });

      it('does not show the TrackPlayPause component', () => {
        expect(wrapper.findComponent(TrackPlayPause).exists()).toBe(false);
      });

      it('shows the DownloadPodcastEpisode component', () => {
        expect(wrapper.findComponent(DownloadPodcastEpisode).exists()).toBe(
          true,
        );
      });

      it('does not show the delete episode DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'deleteEpisode' }).exists()).toBe(
          false,
        );
      });

      it('does not show the download media DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'downloadMedia' }).exists()).toBe(
          false,
        );
      });

      it('does not show the add to playlist DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
          false,
        );
      });

      it('does not show the add to queue DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(
          false,
        );
      });

      it('does not show the play episode DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'playEpisode' }).exists()).toBe(
          false,
        );
      });

      it('shows the download episode DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'downloadEpisodeDropdownItem' })
            .exists(),
        ).toBe(true);
      });

      it('does not show the downloaded icon component', () => {
        expect(wrapper.find({ ref: 'downloaded' }).exists()).toBe(false);
      });

      it('shows the download episode ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'downloadEpisodeButton' }).exists(),
        ).toBe(true);
      });

      describe.each([
        [
          'download episode ButtonLink',
          'downloadEpisodeButton',
          'downloadEpisode',
          [podcastEpisode.id],
        ],
        [
          'download episode DropdownItem',
          'downloadEpisodeDropdownItem',
          'downloadEpisode',
          [podcastEpisode.id],
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

      describe('when the DownloadPodcastEpisode component emits the click event', () => {
        beforeEach(async () => {
          wrapper
            .findComponent(DownloadPodcastEpisode)
            .vm.$emit('downloadEpisode');
        });

        it('emits the downloadEpisode event with the correct value id', () => {
          expect(wrapper.emitted('downloadEpisode')).toEqual([
            [podcastEpisode.id],
          ]);
        });
      });
    });

    describe.each([
      [
        'episode information ButtonLink',
        'episodeInformationButton',
        'episodeInformation',
        [podcastEpisode],
      ],
      [
        'episode information DropdownItem',
        'episodeInformationDropdownItem',
        'episodeInformation',
        [podcastEpisode],
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

    describe('when a track item is dragged', () => {
      beforeEach(async () => {
        await wrapper.find('[data-test-id="track"]').trigger('dragstart');
      });

      it('emits the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toEqual([
          [podcastEpisode, expect.any(DragEvent)],
        ]);
      });
    });
  });
});
