import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import FavouritesPage from './[[mediaType]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  isAuthenticated: ref(true),
}));

// mockNuxtImport('navigateTo', () => vi.fn());

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

const favouritesMock = ref({
  albums: [],
  artists: [],
  tracks: getFormattedTracksMock(2),
});

const getFavouritesMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useFavourite', (original) => () => ({
  ...original(),
  favourites: favouritesMock,
  getFavourites: getFavouritesMock,
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

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
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

const album = getFormattedAlbumsMock()[0];
const tracks = getFormattedTracksMock(3);
const track = getFormattedTracksMock()[0];

async function factory(props = {}, route = '/favourites/albums') {
  return mountSuspended(FavouritesPage, {
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

describe('[[mediaType]]', () => {
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
    expect(useHeadTitleMock.value).toBe('albums - Favourites');
  });

  describe('when RefreshButton emits refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
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
      expect(useHeadTitleMock.value).toBe('albums - Favourites');
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
          getMediaTracksMock.mockResolvedValue(tracks);
          wrapper.findComponent(AlbumsList).vm.$emit('addToQueue', album);
        });

        it('calls the addTracksToQueue function with the correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(tracks);
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
          getMediaTracksMock.mockResolvedValue(tracks);
          wrapper.findComponent(AlbumsList).vm.$emit('playAlbum', album);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(tracks);
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
      wrapper = await factory({}, '/favourites/artists');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('artists - Favourites');
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
      wrapper = await factory({}, '/favourites/tracks');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('tracks - Favourites');
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
        expect(playTracksMock).toHaveBeenCalledWith(
          favouritesMock.value.tracks,
          1,
        );
      });
    });
  });
});
