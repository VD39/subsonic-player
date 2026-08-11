import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import GenrePage from './[[genre]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  isAuthenticated: ref(true),
}));

const getMediaByGenreMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useGenre', (original) => () => ({
  ...original(),
  getMediaByGenre: getMediaByGenreMock,
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

const fetchMoreDataMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useInfinityLoading', (original) => () => ({
  ...original(),
  fetchMoreData: fetchMoreDataMock,
  hasMore: ref(true),
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const genreDataMock = ref<{
  genreMedia: (Album | Track)[];
}>({
  genreMedia: [],
});

const refreshMock = vi.hoisted(() => vi.fn());
const statusMock = ref('success');

mockNuxtImport('useAsyncData', () => () => ({
  data: genreDataMock,
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

async function factory(props = {}, route = '/genre/albums/rock') {
  return mountSuspended(GenrePage, {
    global: {
      stubs: {
        AlbumsList: true,
        TracksList: true,
      },
    },
    props: {
      ...props,
    },
    route,
  });
}

describe('[[genre]]', () => {
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
    expect(useHeadTitleMock.value).toBe('rock - albums - Genre');
  });

  it('displays the correct genre title', () => {
    expect(wrapper.find({ ref: 'title' }).text()).toBe('rock');
  });

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Albums}`, () => {
    beforeEach(async () => {
      genreDataMock.value.genreMedia = getFormattedAlbumsMock();
      wrapper = await factory();
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

  describe(`when route params equals ${ROUTE_MEDIA_TYPE_PARAMS.Tracks}`, () => {
    beforeEach(async () => {
      genreDataMock.value.genreMedia = getFormattedTracksMock();

      wrapper = await factory({}, '/genre/tracks/rock');
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

      it('calls the downloadTrack function with the correct parameters', () => {
        expect(downloadTrackMock).toHaveBeenCalledWith(track);
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
        expect(playTracksMock).toHaveBeenCalledWith([
          genreDataMock.value.genreMedia[1],
        ]);
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
});
