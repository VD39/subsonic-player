import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/Organisms/TrackPlayPauseDropdownItem.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import PodcastEpisodesListItem from './PodcastEpisodesListItem.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const getBookmarkPositionMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useBookmark', (original) => () => ({
  ...original(),
  getBookmarkPosition: getBookmarkPositionMock,
}));

const { isCurrentTrackMock } = useQueueMock();
const { currentTimeMock } = useAudioPlayerMock();

const downloadedPodcastEpisode = getFormattedPodcastEpisodesMock()[0];
const noneDownloadedPodcastEpisode = getFormattedPodcastEpisodesMock(1, {
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
      index: 0,
      podcastEpisode: downloadedPodcastEpisode,
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
        podcastEpisode: getFormattedPodcastEpisodesMock(1, {
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
        podcastEpisode: getFormattedPodcastEpisodesMock(1, {
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

    it('shows the delete podcast episode DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'deletePodcastEpisode' }).exists(),
      ).toBe(true);
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

    it('does not show the download podcast episode DropdownItem component', () => {
      expect(
        wrapper
          .findComponent({ ref: 'downloadPodcastEpisodeDropdownItem' })
          .exists(),
      ).toBe(false);
    });

    it('shows the downloaded icon component', () => {
      expect(wrapper.find({ ref: 'downloaded' }).exists()).toBe(true);
    });

    it('does not show the download podcast episode ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'downloadPodcastEpisodeButton' }).exists(),
      ).toBe(false);
    });

    describe.each([
      ['add to queue ButtonLink', 'addToQueueButton', 'addToQueue'],
    ])(
      'when the %s component emits the click event',
      (_text, ref, emitEventName) => {
        beforeEach(async () => {
          await wrapper.findComponent({ ref }).trigger('click');
        });

        it(`emits the ${emitEventName} event`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([[]]);
        });
      },
    );

    describe.each([
      [
        'delete podcast episode DropdownItem',
        'deletePodcastEpisode',
        'deletePodcastEpisode',
      ],
      ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
      ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
      ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
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

      it('emits the playPodcastEpisode event', () => {
        expect(wrapper.emitted('playPodcastEpisode')).toEqual([[]]);
      });
    });

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playPodcastEpisode event', () => {
        expect(wrapper.emitted('playPodcastEpisode')).toEqual([[]]);
      });
    });
  });

  describe('when the podcast episode is not downloaded', () => {
    beforeEach(() => {
      wrapper = factory({
        podcastEpisode: noneDownloadedPodcastEpisode,
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

    it('does not show the delete podcast episode DropdownItem component', () => {
      expect(
        wrapper.findComponent({ ref: 'deletePodcastEpisode' }).exists(),
      ).toBe(false);
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

    it('shows the download podcast episode DropdownItem component', () => {
      expect(
        wrapper
          .findComponent({ ref: 'downloadPodcastEpisodeDropdownItem' })
          .exists(),
      ).toBe(true);
    });

    it('does not show the downloaded icon component', () => {
      expect(wrapper.find({ ref: 'downloaded' }).exists()).toBe(false);
    });

    it('shows the download podcast episode ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'downloadPodcastEpisodeButton' }).exists(),
      ).toBe(true);
    });

    describe.each([
      [
        'download podcast episode ButtonLink',
        'downloadPodcastEpisodeButton',
        'downloadPodcastEpisode',
      ],
    ])(
      'when the %s component emits the click event',
      (_text, ref, emitEventName) => {
        beforeEach(async () => {
          await wrapper.findComponent({ ref }).trigger('click');
        });

        it(`emits the ${emitEventName} event`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([[]]);
        });
      },
    );

    describe.each([
      [
        'download podcast episode DropdownItem',
        'downloadPodcastEpisodeDropdownItem',
        'downloadPodcastEpisode',
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

    describe('when the DownloadPodcastEpisode component emits the downloadPodcastEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(DownloadPodcastEpisode)
          .vm.$emit('downloadPodcastEpisode');
      });

      it('emits the downloadPodcastEpisode event', () => {
        expect(wrapper.emitted('downloadPodcastEpisode')).toEqual([[]]);
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

          await nextTick();
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
      'podcast episode information ButtonLink',
      'podcastEpisodeInformationButton',
      'podcastEpisodeInformation',
    ],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(async () => {
        await wrapper.findComponent({ ref }).trigger('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[]]);
      });
    },
  );

  describe.each([
    [
      'podcast episode information DropdownItem',
      'podcastEpisodeInformationDropdownItem',
      'podcastEpisodeInformation',
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
    describe('when the isCurrentTrack value is true', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('does not emit the playPodcastEpisode event', () => {
        expect(wrapper.emitted('playPodcastEpisode')).toBeUndefined();
      });
    });

    describe('when the podcast episode is not downloaded', () => {
      beforeEach(async () => {
        wrapper = factory({
          podcastEpisode: noneDownloadedPodcastEpisode,
        });

        await nextTick();

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not emit the playPodcastEpisode event', () => {
        expect(wrapper.emitted('playPodcastEpisode')).toBeUndefined();
      });
    });

    describe('when the isCurrentTrack value is false and the podcast episode is downloaded', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('emits the playPodcastEpisode event', () => {
        expect(wrapper.emitted('playPodcastEpisode')).toEqual([[]]);
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
