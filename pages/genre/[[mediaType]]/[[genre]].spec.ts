import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import { ROUTE_MEDIA_TYPE_PARAMS } from '@/settings/constants';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import GenrePage from './[[genre]].vue';

const getMediaByGenreMock = vi.fn();

mockNuxtImport('useGenre', () => () => ({
  getMediaByGenre: getMediaByGenreMock,
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

const fetchMoreDataMock = vi.fn();

mockNuxtImport('useInfinityLoading', () => () => ({
  fetchMoreData: fetchMoreDataMock,
  hasMore: ref(true),
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const genreDataMock = ref<{
  genreMedia: (Album | Track)[];
}>({
  genreMedia: [],
});
const refreshMock = vi.fn();
const statusMock = ref('success');

mockNuxtImport('useAsyncData', () => () => ({
  data: genreDataMock,
  refresh: refreshMock,
  status: statusMock,
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/genre/albums/rock',
    params: {
      genre: 'rock',
      mediaType: ROUTE_MEDIA_TYPE_PARAMS.Albums as string,
    },
  })),
}));

mockNuxtImport('useRoute', () => routeMock);

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const album = getFormattedAlbumsMock()[0];
const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(GenrePage, {
    global: {
      stubs: {
        AlbumsList: true,
        TracksList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[[genre]]', () => {
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
    expect(useHeadTitleMock.value).toBe('rock - albums - Genre');
  });

  it('should display the correct genre title', () => {
    expect(wrapper.find({ ref: 'title' }).text()).toBe('rock');
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Albums}`, () => {
    beforeEach(() => {
      genreDataMock.value.genreMedia = getFormattedAlbumsMock();
      wrapper = factory();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('rock - albums - Genre');
    });

    it('shows the AlbumsList component', () => {
      expect(wrapper.findComponent(AlbumsList).exists()).toBe(true);
    });

    it('does not show the TracksList component', () => {
      expect(wrapper.findComponent(TracksList).exists()).toBe(false);
    });

    describe('when the AlbumsList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumsList).vm.$emit('dragStart', album);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(album);
      });
    });
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Tracks}`, () => {
    beforeEach(() => {
      routeMock.mockReturnValue({
        fullPath: '/genre/tracks/rock',
        params: {
          genre: 'rock',
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        },
      });

      genreDataMock.value.genreMedia = getFormattedTracksMock();

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('rock - tracks - Genre');
    });

    it('shows the TracksList component', () => {
      expect(wrapper.findComponent(TracksList).exists()).toBe(true);
    });

    it('does not show the AlbumsList component', () => {
      expect(wrapper.findComponent(AlbumsList).exists()).toBe(false);
    });

    describe('when the TracksList component emits the addToPlaylist event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('addToPlaylist', track);
      });

      it('calls the addToPlaylistModal function with the correct parameters', () => {
        expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracksList component emits the addToQueue event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('addToQueue', track);
      });

      it('calls the addTrackToQueue function with the correct parameters', () => {
        expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracksList component emits the downloadMedia event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('downloadMedia', track);
      });

      it('calls the downloadMedia function with the correct parameters', () => {
        expect(downloadMediaMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracksList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('dragStart', track);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracksList component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('mediaInformation', track);
      });

      it('calls the openTrackInformationModal function with the correct parameters', () => {
        expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracksList component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('playTrack', 1);
      });

      it('calls the playTracks function with the correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(
          [genreDataMock.value.genreMedia[1]],
          -1,
        );
      });
    });
  });

  describe('when status is not pending', () => {
    it('sets the correct loading prop on the InfiniteScroller component', () => {
      expect(wrapper.findComponent(InfiniteScroller).props('loading')).toBe(
        false,
      );
    });
  });

  describe('when status is pending', () => {
    beforeEach(() => {
      statusMock.value = 'pending';
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct loading prop on the InfiniteScroller component', () => {
      expect(wrapper.findComponent(InfiniteScroller).props('loading')).toBe(
        true,
      );
    });
  });

  describe('when InfiniteScroller emits loadMore event', () => {
    beforeEach(() => {
      wrapper.findComponent(InfiniteScroller).vm.$emit('loadMore');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
