import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';
import { gridWrapperPropsMock } from '@/test/fixtures';
import {
  getFormattedPodcastEpisodesMock,
  getFormattedPodcastsMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import PodcastsPage from './podcasts.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const viewLayoutMock = ref<Layout>('gridLayout');

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  viewLayout: viewLayoutMock,
}));

const addToPlaylistModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
}));

const downloadTrackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  downloadTrack: downloadTrackMock,
}));

const { openPodcastInformationModalMock, openTrackInformationModalMock } =
  vi.hoisted(() => ({
    openPodcastInformationModalMock: vi.fn(),
    openTrackInformationModalMock: vi.fn(),
  }));

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openPodcastInformationModal: openPodcastInformationModalMock,
  openTrackInformationModal: openTrackInformationModalMock,
}));

const getMediaTracksMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaTracks', (original) => () => ({
  ...original(),
  getMediaTracks: getMediaTracksMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const {
  addPodcastModalMock,
  downloadPodcastEpisodeMock,
  getPodcastsAndNewestPodcastEpisodesMock,
} = vi.hoisted(() => ({
  addPodcastModalMock: vi.fn(),
  downloadPodcastEpisodeMock: vi.fn(),
  getPodcastsAndNewestPodcastEpisodesMock: vi.fn(),
}));
const newestPodcastEpisodes = ref<PodcastEpisode[]>([]);
const podcasts = ref<Podcast[]>([]);

mockNuxtImport('usePodcast', (original) => () => ({
  ...original(),
  addPodcastModal: addPodcastModalMock,
  downloadPodcastEpisode: downloadPodcastEpisodeMock,
  getPodcastsAndNewestPodcastEpisodes: getPodcastsAndNewestPodcastEpisodesMock,
  newestPodcastEpisodes,
  podcasts,
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
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, addTrackToQueueMock, playTracksMock } =
  useAudioPlayerMock();

const podcast = getFormattedPodcastsMock()[0];
const podcastEpisodes = getFormattedPodcastEpisodesMock(3);
const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

function factory(props = {}) {
  return mount(PodcastsPage, {
    global: {
      stubs: {
        PodcastEpisodesList: true,
        PodcastItem: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('podcasts', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Podcasts');
  });

  describe('when the RefreshButton component emits the refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  describe('when the ButtonLink is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'addPodcastButton' }).trigger('click');
    });

    it('calls the addPodcastModal function', () => {
      expect(addPodcastModalMock).toHaveBeenCalled();
    });
  });

  describe('when getPodcastsAndNewestPodcastEpisodes does not return any data', () => {
    it('does not show the podcasts content', () => {
      expect(wrapper.find({ ref: 'podcastsContent' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when getPodcastsAndNewestPodcastEpisodes does return data', () => {
    beforeEach(() => {
      podcasts.value = [
        podcast,
        {
          ...podcast,
          id: '2',
        },
      ];
      newestPodcastEpisodes.value = getFormattedPodcastEpisodesMock(3);

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the podcasts content', () => {
      expect(wrapper.find({ ref: 'podcastsContent' }).exists()).toBe(true);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    it('shows the correct number of PodcastItem components', () => {
      expect(wrapper.findAllComponents(PodcastItem)).toHaveLength(2);
    });

    it('shows the PodcastEpisodesList component', () => {
      expect(wrapper.findComponent(PodcastEpisodesList).exists()).toBe(true);
    });

    describe.each([
      ['gridLayout', gridWrapperPropsMock.gridView],
      ['listLayout', gridWrapperPropsMock.listView],
    ])('when viewLayout is %s', (layout, expectedProps) => {
      beforeEach(() => {
        viewLayoutMock.value = layout as Layout;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct desktop prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('desktopColumns')).toBe(
          expectedProps.desktop,
        );
      });

      it('sets the correct mobile prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('mobileColumns')).toBe(
          expectedProps.mobile,
        );
      });

      it('sets the correct spacing prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('spacing')).toBe(
          expectedProps.spacing,
        );
      });

      it('sets the correct tablet prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('tabletColumns')).toBe(
          expectedProps.tablet,
        );
      });
    });

    describe('when the PodcastItem component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastItem)
          .vm.$emit('dragStart', podcast, DragEvent);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(podcast, DragEvent);
      });
    });

    describe('when the PodcastItem component emits the addPodcastToQueue event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(podcastEpisodes);
          wrapper
            .findComponent(PodcastItem)
            .vm.$emit('addPodcastToQueue', podcast);
        });

        it('calls the addTracksToQueue function with the correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(podcastEpisodes);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper
            .findComponent(PodcastItem)
            .vm.$emit('addPodcastToQueue', podcast);
        });

        it('does not call the addTracksToQueue function', () => {
          expect(addTracksToQueueMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the PodcastItem component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastItem)
          .vm.$emit('mediaInformation', podcast);
      });

      it('calls the openPodcastInformationModal function with the correct parameters', () => {
        expect(openPodcastInformationModalMock).toHaveBeenCalledWith(podcast);
      });
    });

    describe('when the PodcastItem component emits the playPodcast event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(podcastEpisodes);
          wrapper.findComponent(PodcastItem).vm.$emit('playPodcast', podcast);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(podcastEpisodes);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper.findComponent(PodcastItem).vm.$emit('playPodcast', podcast);
        });

        it('does not call the playTracks function', () => {
          expect(playTracksMock).not.toHaveBeenCalled();
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
        expect(downloadPodcastEpisodeMock).toHaveBeenCalledWith(podcastEpisode);
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

    describe('when the PodcastItem component emits the deletePodcast event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastItem)
          .vm.$emit('deletePodcast', podcast.id);
      });

      it('calls the deletePodcastGlobally function with the correct parameters', () => {
        expect(deletePodcastGloballyMock).toHaveBeenCalledWith(podcast.id);
      });
    });
  });
});
