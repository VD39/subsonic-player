import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistPodcast from '@/components/tracklist/TracklistPodcast.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';
import TextClamp from '@/components/ui/TextClamp.vue';
import {
  getFormattedPodcastEpisodesMock,
  getFormattedPodcastsMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import PodcastPage from './[[id]].vue';

vi.useFakeTimers();

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
}));

const openModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  openModal: openModalMock,
}));

const downloadTrackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  downloadTrack: downloadTrackMock,
}));

const addToPlaylistModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
}));

const openTrackDetailsModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openTrackDetailsModal: openTrackDetailsModalMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const { downloadPodcastEpisodeMock, getPodcastMock } = vi.hoisted(() => ({
  downloadPodcastEpisodeMock: vi.fn(),
  getPodcastMock: vi.fn(),
}));
const podcastMock = ref<PodcastState>({});

mockNuxtImport('usePodcast', (original) => () => ({
  ...original(),
  downloadPodcastEpisode: downloadPodcastEpisodeMock,
  getPodcast: getPodcastMock,
  podcast: podcastMock,
}));

const { deletePodcastEpisodeGloballyMock, deletePodcastGloballyMock } =
  vi.hoisted(() => ({
    deletePodcastEpisodeGloballyMock: vi.fn(),
    deletePodcastGloballyMock: vi.fn(),
  }));

mockNuxtImport('usePodcastCleanup', (original) => () => ({
  ...original(),
  deletePodcastEpisodeGlobally: deletePodcastEpisodeGloballyMock,
  deletePodcastGlobally: deletePodcastGloballyMock,
}));

const refreshMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAsyncData', () => () => ({
  data: ref([]),
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, addTrackToQueueMock, playTracksMock } =
  useAudioPlayerMock();

const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

async function factory(props = {}, route = '/podcast/all/id') {
  return mountSuspended(PodcastPage, {
    global: {
      stubs: {
        TracklistPodcast: true,
      },
    },
    props: {
      ...props,
    },
    route,
  });
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
          beforeEach(async () => {
            await wrapper
              .findComponent({ ref: 'playAllPodcastEpisodesButton' })
              .trigger('click');
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

      describe('when the TracklistPodcast component emits the addToPlaylist event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('addToPlaylist', podcastEpisode);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the TracklistPodcast component emits the addToQueue event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('addToQueue', podcastEpisode);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the TracklistPodcast component emits the deletePodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('deletePodcastEpisode', podcastEpisode);
        });

        it('calls the deletePodcastEpisodeGlobally function with the correct parameters', () => {
          expect(deletePodcastEpisodeGloballyMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the TracklistPodcast component emits the downloadPodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('downloadPodcastEpisode', podcastEpisode);
        });

        it('calls the downloadPodcastEpisode function with the correct parameters', () => {
          expect(downloadPodcastEpisodeMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the TracklistPodcast component emits the downloadMedia event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('downloadMedia', podcastEpisode);
        });

        it('calls the downloadTrack function with the correct parameters', () => {
          expect(downloadTrackMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the TracklistPodcast component emits the dragStart event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('dragStart', podcastEpisode);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(podcastEpisode);
        });
      });

      describe('when the TracklistPodcast component emits the podcastEpisodeInformation event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
            .vm.$emit('podcastEpisodeInformation', podcastEpisode);
        });

        it('calls the openTrackDetailsModal function with the correct parameters', () => {
          expect(openTrackDetailsModalMock).toHaveBeenCalledWith(
            podcastEpisode,
          );
        });
      });

      describe('when the TracklistPodcast component emits the playPodcastEpisode event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracklistPodcast)
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
            wrapper = await factory({}, `/podcast/${sortBy}/id`);
          });

          it('sets the useHead function with correct title', () => {
            expect(useHeadTitleMock.value).toBe(`title - ${sortBy} - Podcast`);
          });

          it('sets the correct podcastEpisodes prop on the TracklistPodcast component', () => {
            expect(
              wrapper.findComponent(TracklistPodcast).props('podcastEpisodes'),
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
