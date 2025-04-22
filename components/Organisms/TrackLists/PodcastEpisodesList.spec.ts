import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import PodcastEpisodesList from './PodcastEpisodesList.vue';

let podcastEpisodes = getFormattedPodcastEpisodesMock(5);

function factory(props = {}) {
  const wrapper = mount(PodcastEpisodesList, {
    props: {
      podcastEpisodes: [],
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('PodcastEpisodesList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when podcastEpisodes prop is an empty array', () => {
    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when podcastEpisodes prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        podcastEpisodes,
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

    describe('when the episode has a description', () => {
      it('shows the description element', () => {
        expect(wrapper.find({ ref: 'description' }).exists()).toBe(true);
      });
    });

    describe('when the episode has no description', () => {
      beforeEach(async () => {
        wrapper = factory({
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
        wrapper = factory({
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
      beforeEach(() => {
        wrapper = factory({
          podcastEpisodes,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
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

      describe('when the TrackPlayPause component emits the playTrack event', () => {
        beforeEach(() => {
          wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
        });

        it('emits the playEpisode event with track', () => {
          expect(wrapper.emitted('playEpisode')).toEqual([
            [podcastEpisodes[0]],
          ]);
        });
      });

      describe('when the delete episode DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'deleteEpisode' }).vm.$emit('click');
        });

        it('emits the deleteEpisode event with track id', () => {
          expect(wrapper.emitted('deleteEpisode')).toEqual([
            [podcastEpisodes[0].id],
          ]);
        });
      });

      describe('when the download media DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'downloadMedia' }).vm.$emit('click');
        });

        it('emits the downloadMedia event with track streamUrlId', () => {
          expect(wrapper.emitted('downloadMedia')).toEqual([
            [podcastEpisodes[0].streamUrlId],
          ]);
        });
      });

      describe('when the add to playlist DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'addToPlaylist' }).vm.$emit('click');
        });

        it('emits the addToPlaylist event with track id', () => {
          expect(wrapper.emitted('addToPlaylist')).toEqual([
            [podcastEpisodes[0].id],
          ]);
        });
      });

      describe('when the add to queue DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'addToQueue' }).vm.$emit('click');
        });

        it('emits the addToQueue event with track', () => {
          expect(wrapper.emitted('addToQueue')).toEqual([[podcastEpisodes[0]]]);
        });
      });

      describe('when the play episode DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'playEpisode' }).vm.$emit('click');
        });

        it('emits the playEpisode event with track', () => {
          expect(wrapper.emitted('playEpisode')).toEqual([
            [podcastEpisodes[0]],
          ]);
        });
      });
    });

    describe('when episode is not downloaded', () => {
      beforeEach(() => {
        podcastEpisodes = getFormattedPodcastEpisodesMock(1, {
          downloaded: false,
        });

        wrapper = factory({
          podcastEpisodes,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
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

      describe('when the download DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({
              ref: 'downloadEpisodeButton',
            })
            .vm.$emit('click');
        });

        it('emits the downloadEpisode event with track id', () => {
          expect(wrapper.emitted('downloadEpisode')).toEqual([
            [podcastEpisodes[0].id],
          ]);
        });
      });

      describe('when the DownloadPodcastEpisode component emits the click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(DownloadPodcastEpisode)
            .vm.$emit('downloadEpisode');
        });

        it('emits the downloadEpisode event with track id', () => {
          expect(wrapper.emitted('downloadEpisode')).toEqual([
            [podcastEpisodes[0].id],
          ]);
        });
      });

      describe('when the download episode DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({
              ref: 'downloadEpisodeDropdownItem',
            })
            .vm.$emit('click');
        });

        it('emits the downloadEpisode event with track id', () => {
          expect(wrapper.emitted('downloadEpisode')).toEqual([
            [podcastEpisodes[0].id],
          ]);
        });
      });
    });

    describe('when the episode information ButtonLink component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({
            ref: 'episodeInformationButton',
          })
          .vm.$emit('click');
      });

      it('emits the episodeInformation event with track', () => {
        expect(wrapper.emitted('episodeInformation')).toEqual([
          [podcastEpisodes[0]],
        ]);
      });
    });

    describe('when the episode information DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({
            ref: 'episodeInformationDropdownItem',
          })
          .vm.$emit('click');
      });

      it('emits the episodeInformation event with track', () => {
        expect(wrapper.emitted('episodeInformation')).toEqual([
          [podcastEpisodes[0]],
        ]);
      });
    });
  });
});
