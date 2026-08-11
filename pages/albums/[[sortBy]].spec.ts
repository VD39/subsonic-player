import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import AlbumsPage from './[[sortBy]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  isAuthenticated: ref(true),
}));

mockNuxtImport('navigateTo', () => vi.fn());

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const openAlbumInformationModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openAlbumInformationModal: openAlbumInformationModalMock,
}));

const getMediaTracksMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaTracks', (original) => () => ({
  ...original(),
  getMediaTracks: getMediaTracksMock,
}));

const fetchMoreDataMock = vi.hoisted(() => vi.fn());
const hasMoreMock = ref(true);

mockNuxtImport('useInfinityLoading', (original) => () => ({
  ...original(),
  fetchMoreData: fetchMoreDataMock,
  hasMore: hasMoreMock,
}));

const albumsDataMock = ref({
  albums: getFormattedAlbumsMock(5),
});

const refreshMock = vi.hoisted(() => vi.fn());
const statusMock = ref('success');

mockNuxtImport('useAsyncData', () => () => ({
  data: albumsDataMock,
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: statusMock,
}));

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, playTracksMock } = useAudioPlayerMock();

const album = getFormattedAlbumsMock()[0];
const tracks = getFormattedTracksMock(3);

async function factory(props = {}, route = '/albums/newest') {
  return mountSuspended(AlbumsPage, {
    global: {
      stubs: {
        AlbumsList: true,
      },
    },
    props: {
      ...props,
    },
    route,
  });
}

describe('[[sortBy]]', () => {
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
    expect(useHeadTitleMock.value).toBe('newest - Albums');
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

  describe.each(Object.values(ROUTE_ALBUMS_SORT_BY_PARAMS))(
    'when the sortBy route param is %s',
    (sortBy) => {
      beforeEach(async () => {
        wrapper = await factory({}, `/albums/${sortBy}`);
      });

      it('sets the useHead function with correct title', () => {
        expect(useHeadTitleMock.value).toBe(`${sortBy} - Albums`);
      });
    },
  );

  describe.each([['pending'], ['error'], ['success']])(
    'when status is %s',
    (status) => {
      beforeEach(() => {
        statusMock.value = status;
      });

      describe('when albumsData.album is not an empty array', () => {
        beforeEach(async () => {
          albumsDataMock.value = {
            albums: getFormattedAlbumsMock(5),
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

      describe('when albumsData.album is an empty array', () => {
        beforeEach(async () => {
          albumsDataMock.value = {
            albums: [],
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
