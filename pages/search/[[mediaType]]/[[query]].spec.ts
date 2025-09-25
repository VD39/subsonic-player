import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import { ROUTE_MEDIA_TYPE_PARAMS } from '@/settings/constants';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import SearchPage from './[[query]].vue';

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const searchMock = vi.fn();

mockNuxtImport('useSearch', () => () => ({
  search: searchMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const searchResultsDataMock = ref<{
  searchResults: AllMedia;
}>({
  searchResults: {
    albums: [],
    artists: [],
    tracks: getFormattedTracksMock(2),
  },
});

mockNuxtImport('useAsyncData', () => () => ({
  data: searchResultsDataMock,
  status: ref('success'),
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/search/albums/test-query',
    params: {
      mediaType: ROUTE_MEDIA_TYPE_PARAMS.Albums as string,
      query: 'test-query',
    },
  })),
}));

mockNuxtImport('useRoute', () => routeMock);

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const album = getFormattedAlbumsMock()[0];
const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(SearchPage, {
    global: {
      stubs: {
        AlbumsList: true,
        ArtistsList: true,
        TracksList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[[query]]', () => {
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
    expect(useHeadTitleMock.value).toBe('test query - albums - Search');
  });

  it('should display the correct search results title', () => {
    expect(wrapper.find({ ref: 'title' }).text()).toBe(
      'Search results for: Test Query',
    );
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Albums}`, () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('test query - albums - Search');
    });

    it('shows the AlbumsList component', () => {
      expect(wrapper.findComponent(AlbumsList).exists()).toBe(true);
    });

    it('does not show the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
    });

    it('does not show the TracksList component', () => {
      expect(wrapper.findComponent(TracksList).exists()).toBe(false);
    });

    describe('when the AlbumItem component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumsList).vm.$emit('dragStart', album);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(album);
      });
    });
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Artists}`, () => {
    beforeEach(() => {
      routeMock.mockReturnValue({
        fullPath: '/search/artists/test-query',
        params: {
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Artists,
          query: 'test-query',
        },
      });

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('test query - artists - Search');
    });

    it('shows the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
    });

    it('does not show the AlbumsList component', () => {
      expect(wrapper.findComponent(AlbumsList).exists()).toBe(false);
    });

    it('does not show the TracksList component', () => {
      expect(wrapper.findComponent(TracksList).exists()).toBe(false);
    });
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Tracks}`, () => {
    beforeEach(() => {
      routeMock.mockReturnValue({
        fullPath: '/search/tracks/test-query',
        params: {
          mediaType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
          query: 'test-query',
        },
      });

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('test query - tracks - Search');
    });

    it('shows the TracksList component', () => {
      expect(wrapper.findComponent(TracksList).exists()).toBe(true);
    });

    it('does not show the AlbumsList component', () => {
      expect(wrapper.findComponent(AlbumsList).exists()).toBe(false);
    });

    it('does not show the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
    });

    describe('when the TrackItem component emits the addToPlaylist event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('addToPlaylist', track);
      });

      it('calls the addToPlaylistModal function with the correct parameters', () => {
        expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TrackItem component emits the addToQueue event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('addToQueue', track);
      });

      it('calls the addTrackToQueue function with the correct parameters', () => {
        expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TrackItem component emits the downloadMedia event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('downloadMedia', track);
      });

      it('calls the downloadMedia function with the correct parameters', () => {
        expect(downloadMediaMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TrackItem component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('dragStart', track);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TrackItem component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('mediaInformation', track);
      });

      it('calls the openTrackInformationModal function with the correct parameters', () => {
        expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TrackItem component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracksList).vm.$emit('playTrack', 1);
      });

      it('calls the playTracks function with the correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(
          [searchResultsDataMock.value.searchResults.tracks[1]],
          -1,
        );
      });
    });
  });
});
