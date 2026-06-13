import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/Organisms/TrackPlayPauseDropdownItem.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock.js';
import { useQueueMock } from '@/test/useQueueMock';

import PodcastEpisodesListItem from './PodcastEpisodesListItem.vue';

const getBookmarkPositionMock = vi.fn();

mockNuxtImport('useBookmark', () => () => ({
  getBookmarkPosition: getBookmarkPositionMock,
}));

const { isCurrentTrackMock } = useQueueMock();
const { currentTimeMock } = useAudioPlayerMock();

const downloadedEpisode = getFormattedPodcastEpisodesMock()[0];
const noneDownloadedEpisode = getFormattedPodcastEpisodesMock(1, {
  downloaded: false,
})[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(PodcastEpisodesListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
        TrackPlayPause: true,
        TrackPlayPauseDropdownItem: true,
      },
    },
    props: {
      episode: downloadedEpisode,
      index: 0,
      ...props,
    },
  });
}

describe('PodcastEpisodesListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the podcast episode has a description', () => {
    it('shows the description element', () => {
      expect(wrapper.find({ ref: 'description' }).exists()).toBe(true);
    });
  });

  describe('when the podcast episode has no description', () => {
    beforeEach(() => {
      wrapper = factory({
        episode: getFormattedPodcastEpisodesMock(1, {
          description: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the description element', () => {
      expect(wrapper.find({ ref: 'description' }).exists()).toBe(false);
    });
  });

  describe('when the podcast episode has an author', () => {
    it('shows the MarqueeScroll component containing the author', () => {
      expect(
        wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
      ).toBe(true);
    });
  });

  describe('when the podcast episode has no author', () => {
    beforeEach(() => {
      wrapper = factory({
        episode: getFormattedPodcastEpisodesMock(1, {
          author: undefined,
        })[0],
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

  describe('when the podcast episode is downloaded', () => {
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
      expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(true);
    });

    it('shows the add to queue ButtonLink component', () => {
      expect(wrapper.findComponent({ ref: 'addToQueueButton' }).exists()).toBe(
        true,
      );
    });

    it('shows the TrackPlayPauseDropdownItem component', () => {
      expect(wrapper.findComponent(TrackPlayPauseDropdownItem).exists()).toBe(
        true,
      );
    });

    it('does not show the download episode DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'downloadEpisodeDropdownItem' }).exists(),
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
      ['delete episode DropdownItem', 'deleteEpisode', 'deleteEpisode'],
      ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
      ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
      ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
      ['add to queue ButtonLink', 'addToQueueButton', 'addToQueue'],
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

    describe('when the TrackPlayPauseDropdownItem component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPauseDropdownItem).vm.$emit('playTrack');
      });

      it('emits the playEpisode event', () => {
        expect(wrapper.emitted('playEpisode')).toEqual([[]]);
      });
    });

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playEpisode event', () => {
        expect(wrapper.emitted('playEpisode')).toEqual([[]]);
      });
    });
  });

  describe('when the podcast episode is not downloaded', () => {
    beforeEach(() => {
      wrapper = factory({
        episode: noneDownloadedEpisode,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the TrackPlayPause component', () => {
      expect(wrapper.findComponent(TrackPlayPause).exists()).toBe(false);
    });

    it('shows the DownloadPodcastEpisode component', () => {
      expect(wrapper.findComponent(DownloadPodcastEpisode).exists()).toBe(true);
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
      expect(wrapper.findComponent({ ref: 'addToQueue' }).exists()).toBe(false);
    });

    it('does not show the add to queue ButtonLink component', () => {
      expect(wrapper.findComponent({ ref: 'addToQueueButton' }).exists()).toBe(
        false,
      );
    });

    it('does not show the TrackPlayPauseDropdownItem component', () => {
      expect(wrapper.findComponent(TrackPlayPauseDropdownItem).exists()).toBe(
        false,
      );
    });

    it('shows the download episode DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'downloadEpisodeDropdownItem' }).exists(),
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
      ],
      [
        'download episode DropdownItem',
        'downloadEpisodeDropdownItem',
        'downloadEpisode',
      ],
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

    describe('when the DownloadPodcastEpisode component emits the downloadEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(DownloadPodcastEpisode)
          .vm.$emit('downloadEpisode');
      });

      it('emits the downloadEpisode event', () => {
        expect(wrapper.emitted('downloadEpisode')).toEqual([[]]);
      });
    });
  });

  describe('when the podcast episode is not the current track', () => {
    beforeEach(() => {
      isCurrentTrackMock.mockReturnValue(false);
    });

    it('does not show the position time element', () => {
      expect(wrapper.find({ ref: 'positionTime' }).exists()).toBe(false);
    });

    it('does not show the progress bar element', () => {
      expect(wrapper.find({ ref: 'progressBar' }).exists()).toBe(false);
    });

    describe('when getBookmarkPosition returns a position', () => {
      beforeEach(() => {
        getBookmarkPositionMock.mockReturnValue(10);
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the position time element', () => {
        expect(wrapper.find({ ref: 'positionTime' }).exists()).toBe(true);
      });

      it('shows the progress bar element', () => {
        expect(wrapper.find({ ref: 'progressBar' }).exists()).toBe(true);
      });

      it('shows the position time with the formatted bookmark position', () => {
        expect(wrapper.find({ ref: 'positionTime' }).text()).toBe('00:10');
      });

      it('shows the progress bar with the correct width', () => {
        expect(wrapper.find({ ref: 'progress' }).attributes('style')).toContain(
          `--podcast-episodes-progress-width: ${(10 / 19) * 100}%`,
        );
      });
    });
  });

  describe('when the podcast episode is current track', () => {
    beforeEach(() => {
      isCurrentTrackMock.mockReturnValue(true);
    });

    describe('when getBookmarkPosition return false', () => {
      beforeEach(() => {
        getBookmarkPositionMock.mockReturnValue(undefined);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the position time element', () => {
        expect(wrapper.find({ ref: 'positionTime' }).exists()).toBe(true);
      });

      it('shows the progress bar element', () => {
        expect(wrapper.find({ ref: 'progressBar' }).exists()).toBe(true);
      });
    });

    describe('when getBookmarkPosition returns a position', () => {
      beforeEach(() => {
        getBookmarkPositionMock.mockReturnValue(30000);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the position time element', () => {
        expect(wrapper.find({ ref: 'positionTime' }).exists()).toBe(true);
      });

      it('shows the progress bar element', () => {
        expect(wrapper.find({ ref: 'progressBar' }).exists()).toBe(true);
      });

      it('shows the position time with the formatted currentTime', () => {
        expect(wrapper.find({ ref: 'positionTime' }).text()).toBe('00:00');
      });

      it('shows the progress bar with the correct width', () => {
        expect(wrapper.find({ ref: 'progress' }).attributes('style')).toContain(
          '--podcast-episodes-progress-width: 0%',
        );
      });

      describe('when the currentTime value changes', () => {
        beforeEach(async () => {
          currentTimeMock.value = 10;
          await wrapper.vm.$nextTick();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the updated position time', () => {
          expect(wrapper.find({ ref: 'positionTime' }).text()).toBe('00:10');
        });

        it('shows the progress bar with the updated width', () => {
          expect(
            wrapper.find({ ref: 'progress' }).attributes('style'),
          ).toContain(`--podcast-episodes-progress-width: ${(10 / 19) * 100}%`);
        });
      });
    });
  });

  describe.each([
    [
      'episode information ButtonLink',
      'episodeInformationButton',
      'episodeInformation',
    ],
    [
      'episode information DropdownItem',
      'episodeInformationDropdownItem',
      'episodeInformation',
    ],
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

  describe('when the isRecentList prop is true and the podcast episode is downloaded', () => {
    beforeEach(() => {
      wrapper = factory({
        isRecentList: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the go to podcast DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(true);
    });
  });

  describe('when the isRecentList prop is false', () => {
    it('does not show the go to podcast DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    describe('when isCurrentTrack is true', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('does not emit the playEpisode event', () => {
        expect(wrapper.emitted('playEpisode')).toBeUndefined();
      });
    });

    describe('when the podcast episode is not downloaded', () => {
      beforeEach(async () => {
        wrapper = factory({
          episode: noneDownloadedEpisode,
        });

        await wrapper.vm.$nextTick();

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not emit the playEpisode event', () => {
        expect(wrapper.emitted('playEpisode')).toBeUndefined();
      });
    });

    describe('when isCurrentTrack is false and the podcast episode is downloaded', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('emits the playEpisode event', () => {
        expect(wrapper.emitted('playEpisode')).toEqual([[]]);
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

  describe('when the InteractionWrapper component emits the contextMenu event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('contextMenu');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });
});
