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
import {
  getFormattedPodcastEpisodesMock,
  getFormattedPodcastsMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import PodcastPage from './[[id]].vue';

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const downloadTrackMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadTrack: downloadTrackMock,
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

const downloadPodcastEpisodeMock = vi.fn();
const getPodcastMock = vi.fn();
const podcastMock = ref<PodcastState>({});

mockNuxtImport('usePodcast', () => () => ({
  downloadPodcastEpisode: downloadPodcastEpisodeMock,
  getPodcast: getPodcastMock,
  podcast: podcastMock,
}));

const deletePodcastEpisodeGloballyMock = vi.fn();
const deletePodcastGloballyMock = vi.fn();

mockNuxtImport('usePodcastCleanup', () => () => ({
  deletePodcastEpisodeGlobally: deletePodcastEpisodeGloballyMock,
  deletePodcastGlobally: deletePodcastGloballyMock,
}));

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/podcast/all/0',
    params: {
      id: 'id',
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

const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

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
    await dropdownMenu.findComponent(ButtonLink).trigger('click');
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
    describe('when podcast has an key with route param id', () => {
      beforeEach(async () => {
        podcastMock.value = {
          id: getFormattedPodcastsMock()[0],
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
            wrapper.findComponent(TextClamp).vm.$emit('expand');
          });

          it('calls the openModal function with the correct parameters', () => {
            expect(openModalMock).toHaveBeenCalledWith(
              MODAL_TYPE.readMoreModal,
              {
                text: podcastMock.value.id!.description,
                title: 'Description',
              },
            );
          });
        });
      });

      describe('when podcast.description does not have a value', () => {
        beforeEach(async () => {
          podcastMock.value = {
            id: {
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
            podcastMock.value.id,
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

        it('calls the deletePodcastGlobally function with correct parameters', () => {
          expect(deletePodcastGloballyMock).toHaveBeenCalledWith(
            podcastMock.value.id!.id,
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
          podcastMock.value = {
            id: getFormattedPodcastsMock(1, {
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

        it('sets the correct disabled prop on the play all podcast episodes ButtonLink component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesButton' })
              .props('disabled'),
          ).toBe(true);
        });

        it('does not show the add downloaded podcast episodes to queue DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({
                ref: 'addDownloadedPodcastEpisodesToQueueDropdownItem',
              })
              .exists(),
          ).toBe(false);
        });

        it('does not show the play latest podcast episode DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playLatestPodcastEpisodeDropdownItem' })
              .exists(),
          ).toBe(false);
        });

        it('does not show the play all podcast episodes DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesDropdownItem' })
              .exists(),
          ).toBe(false);
        });
      });

      describe('when podcast.episodes.downloaded is not an empty array', () => {
        it('sets the correct disabled prop on the play all podcast episodes ButtonLink component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesButton' })
              .props('disabled'),
          ).toBe(false);
        });

        it('shows the add downloaded podcast episodes to queue DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({
                ref: 'addDownloadedPodcastEpisodesToQueueDropdownItem',
              })
              .exists(),
          ).toBe(true);
        });

        it('shows the play latest podcast episode DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playLatestPodcastEpisodeDropdownItem' })
              .exists(),
          ).toBe(true);
        });

        it('shows the play all podcast episodes DropdownItem component', () => {
          expect(
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesDropdownItem' })
              .exists(),
          ).toBe(true);
        });

        describe('when the play all podcast episodes ButtonLink component emits a click event', () => {
          beforeEach(() => {
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesButton' })
              .vm.$emit('click');
          });

          it('calls the playTracks function with correct parameters', () => {
            expect(playTracksMock).toHaveBeenCalledWith(
              podcastMock.value.id!.episodes.downloaded,
            );
          });
        });

        describe('when the add downloaded podcast episodes to queue DropdownItem component emits a click event', () => {
          beforeEach(() => {
            wrapper
              .findComponent({
                ref: 'addDownloadedPodcastEpisodesToQueueDropdownItem',
              })
              .vm.$emit('click');
          });

          it('calls the addTracksToQueue function with correct parameters', () => {
            expect(addTracksToQueueMock).toHaveBeenCalledWith(
              podcastMock.value.id!.episodes.downloaded,
            );
          });
        });

        describe('when the play latest podcast episode DropdownItem component emits a click event', () => {
          beforeEach(() => {
            wrapper
              .findComponent({ ref: 'playLatestPodcastEpisodeDropdownItem' })
              .vm.$emit('click');
          });

          it('calls the playTracks function with correct parameters', () => {
            expect(playTracksMock).toHaveBeenCalledWith([
              podcastMock.value.id!.episodes.downloaded[0],
            ]);
          });
        });

        describe('when the play all podcast episodes DropdownItem component emits a click event', () => {
          beforeEach(() => {
            wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesDropdownItem' })
              .vm.$emit('click');
          });

          it('calls the playTracks function with correct parameters', () => {
            expect(playTracksMock).toHaveBeenCalledWith(
              podcastMock.value.id!.episodes.downloaded,
            );
          });
        });
      });

      describe('when the PodcastEpisodesList component emits the addToPlaylist event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('addToPlaylist', podcastEpisode);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the PodcastEpisodesList component emits the addToQueue event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('addToQueue', podcastEpisode);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the PodcastEpisodesList component emits the deletePodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('deletePodcastEpisode', podcastEpisode);
        });

        it('calls the deletePodcastEpisodeGlobally function with the correct parameters', () => {
          expect(deletePodcastEpisodeGloballyMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the PodcastEpisodesList component emits the downloadPodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('downloadPodcastEpisode', podcastEpisode);
        });

        it('calls the downloadPodcastEpisode function with the correct parameters', () => {
          expect(downloadPodcastEpisodeMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the PodcastEpisodesList component emits the downloadMedia event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('downloadMedia', podcastEpisode);
        });

        it('calls the downloadTrack function with the correct parameters', () => {
          expect(downloadTrackMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the PodcastEpisodesList component emits the dragStart event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('dragStart', podcastEpisode);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the PodcastEpisodesList component emits the podcastEpisodeInformation event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('podcastEpisodeInformation', podcastEpisode);
        });

        it('calls the openTrackInformationModal function with the correct parameters', () => {
          expect(openTrackInformationModalMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the PodcastEpisodesList component emits the playPodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(PodcastEpisodesList)
            .vm.$emit('playPodcastEpisode', podcastEpisode);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith([podcastEpisode]);
        });
      });

      describe.each([['all'], ['downloaded'], ['not-downloaded']])(
        'when the sortBy route param is %s',
        (sortBy) => {
          beforeEach(async () => {
            routeMock.mockReturnValueOnce({
              fullPath: `/podcast/${sortBy}/0`,
              params: {
                id: 'id',
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
              wrapper
                .findComponent(PodcastEpisodesList)
                .props('podcastEpisodes'),
            ).toEqual(
              podcastMock.value.id!.episodes[sortBy as PodcastSortByParam],
            );
          });
        },
      );
    });

    describe('when podcast does not have an key with route param id', () => {
      beforeEach(async () => {
        podcastMock.value = {
          anotherId: getFormattedPodcastsMock()[0],
        };

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

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
  });
});
