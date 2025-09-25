import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';
import { getFormattedPodcastsMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import PodcastPage from './[[id]].vue';

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const deletePodcastMock = vi.fn();
const deletePodcastEpisodeMock = vi.fn();
const downloadPodcastEpisodeMock = vi.fn();
const getPodcastMock = vi.fn();

mockNuxtImport('usePodcast', () => () => ({
  deletePodcast: deletePodcastMock,
  deletePodcastEpisode: deletePodcastEpisodeMock,
  downloadPodcastEpisode: downloadPodcastEpisodeMock,
  getPodcast: getPodcastMock,
}));

const podcastDataMock = ref<{
  podcast: null | Podcast;
}>({
  podcast: null,
});

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  data: podcastDataMock,
  refresh: refreshMock,
  status: ref('success'),
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/podcast/all/0',
    params: {
      id: '0',
      sortBy: 'all',
    },
  })),
}));

mockNuxtImport('useRoute', () => routeMock);

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, addTrackToQueueMock, playTracksMock } =
  useAudioPlayerMock();

const episode = getFormattedPodcastsMock()[0].episodes.downloaded[0];

async function factory(props = {}) {
  const wrapper = mount(PodcastPage, {
    global: {
      stubs: {
        PodcastEpisodesList: true,
      },
    },
    props: {
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

describe('[[id]]', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when getPodcast does not return any data', () => {
    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('all - Podcast');
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });

    it('does not show the podcast content', () => {
      expect(wrapper.find({ ref: 'podcastContent' }).exists()).toBe(false);
    });
  });

  describe('when getPodcast does return data', () => {
    beforeEach(async () => {
      podcastDataMock.value = {
        podcast: getFormattedPodcastsMock()[0],
      };

      wrapper = await factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('title - all - Podcast');
    });

    it('shows the podcast content', () => {
      expect(wrapper.find({ ref: 'podcastContent' }).exists()).toBe(true);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when podcast.description has a value', () => {
      it('shows the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(true);
      });

      describe('when the TextClamp component emits the more event', () => {
        beforeEach(() => {
          wrapper.findComponent(TextClamp).vm.$emit('more');
        });

        it('calls the openModal function with correct parameters', () => {
          expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.readMoreModal, {
            text: podcastDataMock.value.podcast!.description,
            title: 'Description',
          });
        });
      });
    });

    describe('when podcast.description does not have a value', () => {
      beforeEach(async () => {
        podcastDataMock.value = {
          podcast: {
            ...getFormattedPodcastsMock(1, {
              description: '',
            })[0],
          },
        };

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(false);
      });
    });

    describe('when the EntryHeader component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(EntryHeader).vm.$emit('dragStart', DragEvent);
      });

      it('calls the dragStart function with correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(
          podcastDataMock.value.podcast,
          DragEvent,
        );
      });
    });

    describe('when the RefreshButton component emits the refresh event', () => {
      beforeEach(() => {
        wrapper.findComponent(RefreshButton).vm.$emit('refresh');
      });

      it('calls the refresh function', () => {
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    describe('when the delete podcast DropdownItem component emits a click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'deletePodcastDropdownItem' })
          .vm.$emit('click');
      });

      it('calls the deletePodcast function with correct parameters', () => {
        expect(deletePodcastMock).toHaveBeenCalledWith(
          podcastDataMock.value.podcast!.id,
        );
      });

      it('calls the navigateTo function with correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.podcasts,
        });
      });
    });

    describe('when podcast.episodes.downloaded is an empty array', () => {
      beforeEach(async () => {
        podcastDataMock.value = {
          podcast: getFormattedPodcastsMock(1, {
            episodes: {
              all: [],
              downloaded: [],
              'not-downloaded': [],
            },
            totalDownloadedEpisodes: 0,
          })[0],
        };

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct disabled prop on the play all episodes ButtonLink component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playAllEpisodesButton' })
            .props('disabled'),
        ).toBe(true);
      });

      it('does not show the add downloaded episodes to queue DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'addDownloadedEpisodesToQueueDropdownItem' })
            .exists(),
        ).toBe(false);
      });

      it('does not show the play latests episode DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playLatestsEpisodeDropdownItem' })
            .exists(),
        ).toBe(false);
      });

      it('does not show the play all episodes DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playAllEpisodesDropdownItem' })
            .exists(),
        ).toBe(false);
      });
    });

    describe('when podcast.episodes.downloaded is not an empty array', () => {
      it('sets the correct disabled prop on the play all episodes ButtonLink component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playAllEpisodesButton' })
            .props('disabled'),
        ).toBe(false);
      });

      it('shows the add downloaded episodes to queue DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'addDownloadedEpisodesToQueueDropdownItem' })
            .exists(),
        ).toBe(true);
      });

      it('shows the play latests episode DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playLatestsEpisodeDropdownItem' })
            .exists(),
        ).toBe(true);
      });

      it('shows the play all episodes DropdownItem component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'playAllEpisodesDropdownItem' })
            .exists(),
        ).toBe(true);
      });

      describe('when the play all episodes ButtonLink component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'playAllEpisodesButton' })
            .vm.$emit('click');
        });

        it('calls the playTracks function with correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            podcastDataMock.value.podcast!.episodes.downloaded,
            -1,
          );
        });
      });

      describe('when the add downloaded episodes to queue DropdownItem component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'addDownloadedEpisodesToQueueDropdownItem' })
            .vm.$emit('click');
        });

        it('calls the addTracksToQueue function with correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(
            podcastDataMock.value.podcast!.episodes.downloaded,
          );
        });
      });

      describe('when the play latests episode DropdownItem component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'playLatestsEpisodeDropdownItem' })
            .vm.$emit('click');
        });

        it('calls the playTracks function with correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith([
            podcastDataMock.value.podcast!.episodes.downloaded[0],
          ]);
        });
      });

      describe('when the play all episodes DropdownItem component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'playAllEpisodesDropdownItem' })
            .vm.$emit('click');
        });

        it('calls the playTracks function with correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            podcastDataMock.value.podcast!.episodes.downloaded,
            -1,
          );
        });
      });
    });

    describe('when the PodcastEpisodesList component emits the addToPlaylist event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('addToPlaylist', episode);
      });

      it('calls the addToPlaylistModal function with the correct parameters', () => {
        expect(addToPlaylistModalMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the addToQueue event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('addToQueue', episode);
      });

      it('calls the addTrackToQueue function with the correct parameters', () => {
        expect(addTrackToQueueMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the deleteEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('deleteEpisode', episode);
      });

      it('calls the deletePodcastEpisode function with the correct parameters', () => {
        expect(deletePodcastEpisodeMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the downloadEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('downloadEpisode', episode);
      });

      it('calls the downloadPodcastEpisode function with the correct parameters', () => {
        expect(downloadPodcastEpisodeMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the downloadMedia event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('downloadMedia', episode);
      });

      it('calls the downloadMedia function with the correct parameters', () => {
        expect(downloadMediaMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('dragStart', episode);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the episodeInformation event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('episodeInformation', episode);
      });

      it('calls the openTrackInformationModal function with the correct parameters', () => {
        expect(openTrackInformationModalMock).toHaveBeenCalledWith(episode);
      });
    });

    describe('when the PodcastEpisodesList component emits the playEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('playEpisode', episode);
      });

      it('calls the playTracks function with the correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith([episode]);
      });
    });

    describe.each([['all'], ['downloaded'], ['not-downloaded']])(
      'when the sortBy route param is %s',
      (sortBy) => {
        beforeEach(async () => {
          routeMock.mockReturnValueOnce({
            fullPath: `/podcast/${sortBy}/0`,
            params: {
              id: '0',
              sortBy,
            },
          });

          wrapper = await factory();
        });

        it('sets the useHead function with correct title', () => {
          expect(useHeadTitleMock.value).toBe(`title - ${sortBy} - Podcast`);
        });

        it('sets the correct podcastEpisodes prop on the PodcastEpisodesList component', () => {
          expect(
            wrapper.findComponent(PodcastEpisodesList).props('podcastEpisodes'),
          ).toEqual(
            podcastDataMock.value.podcast!.episodes[
              sortBy as PodcastSortByParam
            ],
          );
        });
      },
    );
  });
});
