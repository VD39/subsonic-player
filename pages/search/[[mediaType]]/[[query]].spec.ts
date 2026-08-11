import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import {
  getFormattedAlbumsMock,
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import SearchPage from './[[query]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  isAuthenticated: ref(true),
}));

const addToPlaylistModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
}));

const searchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSearch', (original) => () => ({
  ...original(),
  search: searchMock,
}));

const { openAlbumInformationModalMock, openTrackInformationModalMock } =
  vi.hoisted(() => ({
    openAlbumInformationModalMock: vi.fn(),
    openTrackInformationModalMock: vi.fn(),
  }));

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openAlbumInformationModal: openAlbumInformationModalMock,
  openTrackInformationModal: openTrackInformationModalMock,
}));

const getMediaTracksMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaTracks', (original) => () => ({
  ...original(),
  getMediaTracks: getMediaTracksMock,
}));

const downloadTrackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  downloadTrack: downloadTrackMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const refreshMock = vi.hoisted(() => vi.fn());
const statusMock = ref('success');
const searchResultsDataMock = ref<{
  searchResults: SearchResultByType[];
}>({
  searchResults: getFormattedAlbumsMock(2),
});

mockNuxtImport('useAsyncData', () => () => ({
  data: searchResultsDataMock,
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: statusMock,
}));

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, addTrackToQueueMock, playTracksMock } =
  useAudioPlayerMock();

const album = getFormattedAlbumsMock()[0];
const albumTracks = getFormattedTracksMock(3);
const track = getFormattedTracksMock()[0];

async function factory(props = {}, route = '/search/albums/test-query') {
  return mountSuspended(SearchPage, {
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
    route,
  });
}

describe('[[query]]', () => {
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

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('test query - albums - Search');
  });

  it('displays the correct search results title', () => {
    expect(wrapper.find({ ref: 'title' }).text()).toBe(
      'Search results for: Test Query',
    );
  });

  describe('when status is not pending', () => {
    it('sets the correct loading prop on the InfiniteScroller component', () => {
      expect(wrapper.findComponent(InfiniteScroller).props('loading')).toBe(
        false,
      );
    });
  });

  describe('when status is pending', () => {
    beforeEach(async () => {
      statusMock.value = 'pending';
      wrapper = await factory();
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

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Albums}`, () => {
    beforeEach(async () => {
      wrapper = await factory();
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

    describe('when the AlbumsList component emits the addToQueue event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(albumTracks);
          wrapper.findComponent(AlbumsList).vm.$emit('addToQueue', album);
        });

        it('calls the addTracksToQueue function with the correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(albumTracks);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper.findComponent(AlbumsList).vm.$emit('addToQueue', album);
        });

        it('does not call the addTracksToQueue function', () => {
          expect(addTracksToQueueMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the AlbumsList component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumsList).vm.$emit('mediaInformation', album);
      });

      it('calls the openAlbumInformationModal function with the correct parameters', () => {
        expect(openAlbumInformationModalMock).toHaveBeenCalledWith(album);
      });
    });

    describe('when the AlbumsList component emits the playAlbum event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(albumTracks);
          wrapper.findComponent(AlbumsList).vm.$emit('playAlbum', album);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(albumTracks);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper.findComponent(AlbumsList).vm.$emit('playAlbum', album);
        });

        it('does not call the playTracks function', () => {
          expect(playTracksMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Artists}`, () => {
    beforeEach(async () => {
      searchResultsDataMock.value = {
        searchResults: getFormattedArtistsMock(2),
      };

      wrapper = await factory({}, '/search/artists/test-query');
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
    beforeEach(async () => {
      searchResultsDataMock.value = {
        searchResults: getFormattedTracksMock(2),
      };

      wrapper = await factory({}, '/search/tracks/test-query');
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

      it('calls the downloadTrack function with the correct parameters', () => {
        expect(downloadTrackMock).toHaveBeenCalledWith(track);
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
        expect(playTracksMock).toHaveBeenCalledWith([
          searchResultsDataMock.value.searchResults[1],
        ]);
      });
    });
  });

  describe.each([['pending'], ['error'], ['success']])(
    'when status is %s',
    (status) => {
      beforeEach(() => {
        statusMock.value = status;
      });

      describe('when searchResults is not an empty array', () => {
        beforeEach(async () => {
          searchResultsDataMock.value = {
            searchResults: getFormattedTracksMock(2),
          };

          wrapper = await factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('sets the correct status prop on the LoadingData component', () => {
          expect(wrapper.findComponent(LoadingData).props('status')).toBe(
            'success',
          );
        });
      });

      describe('when searchResults is an empty array', () => {
        beforeEach(async () => {
          searchResultsDataMock.value = {
            searchResults: [],
          };

          wrapper = await factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('sets the correct status prop on the LoadingData component', () => {
          expect(wrapper.findComponent(LoadingData).props('status')).toBe(
            status,
          );
        });
      });
    },
  );
});
