import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';
import { formattedPodcastMock, gridWrapperPropsMock } from '@/test/fixtures';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';
import { getFormattedPodcastEpisodesMock } from '~/test/helpers';

import PodcastsPage from './podcasts.vue';

const viewLayoutMock = ref<Layout>('gridLayout');

mockNuxtImport('useViewLayout', () => () => ({
  viewLayout: viewLayoutMock,
}));

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const addPodcastModalMock = vi.fn();
const deletePodcastEpisodeMock = vi.fn();
const downloadPodcastEpisodeMock = vi.fn();
const getPodcastsAndNewestPodcastEpisodesMock = vi.fn();
const newestPodcastEpisodes = ref<PodcastEpisode[]>([]);
const podcasts = ref<Podcast[]>([]);

mockNuxtImport('usePodcast', () => () => ({
  addPodcastModal: addPodcastModalMock,
  deletePodcastEpisode: deletePodcastEpisodeMock,
  downloadPodcastEpisode: downloadPodcastEpisodeMock,
  getPodcastsAndNewestPodcastEpisodes: getPodcastsAndNewestPodcastEpisodesMock,
  newestPodcastEpisodes,
  podcasts,
}));

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

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
    beforeEach(() => {
      wrapper.findComponent({ ref: 'addPodcastButton' }).vm.$emit('click');
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
        formattedPodcastMock,
        {
          ...formattedPodcastMock,
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
      expect(wrapper.findAllComponents(PodcastItem).length).toBe(2);
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
        expect(wrapper.findComponent(GridWrapper).props('desktop')).toBe(
          expectedProps.desktop,
        );
      });

      it('sets the correct mobile prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('mobile')).toBe(
          expectedProps.mobile,
        );
      });

      it('sets the correct spacing prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('spacing')).toBe(
          expectedProps.spacing,
        );
      });

      it('sets the correct tablet prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('tablet')).toBe(
          expectedProps.tablet,
        );
      });
    });

    describe('when the PodcastItem component triggers the dragstart event', () => {
      beforeEach(async () => {
        await wrapper.findComponent(PodcastItem).trigger('dragstart');
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(
          formattedPodcastMock,
          expect.any(DragEvent),
        );
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

    describe('when the PodcastEpisodesList component emits the deleteEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('deleteEpisode', podcastEpisode);
      });

      it('calls the deletePodcastEpisode function with the correct parameters', () => {
        expect(deletePodcastEpisodeMock).toHaveBeenCalledWith(podcastEpisode);
      });
    });

    describe('when the PodcastEpisodesList component emits the downloadEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('downloadEpisode', podcastEpisode);
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

      it('calls the downloadMedia function with the correct parameters', () => {
        expect(downloadMediaMock).toHaveBeenCalledWith(podcastEpisode);
      });
    });

    describe('when the PodcastEpisodesList component emits the episodeInformation event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('episodeInformation', podcastEpisode);
      });

      it('calls the openTrackInformationModal function with the correct parameters', () => {
        expect(openTrackInformationModalMock).toHaveBeenCalledWith(
          podcastEpisode,
        );
      });
    });

    describe('when the PodcastEpisodesList component emits the playEpisode event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(PodcastEpisodesList)
          .vm.$emit('playEpisode', podcastEpisode);
      });

      it('calls the playTracks function with the correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith([podcastEpisode]);
      });
    });
  });
});
