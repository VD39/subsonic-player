import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';
import { useHeadMock } from '@/test/useHeadMock';

import AlbumsPage from './[[sortBy]].vue';

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const fetchMoreDataMock = vi.fn();
const hasMoreMock = ref(true);

mockNuxtImport('useInfinityLoading', () => () => ({
  fetchMoreData: fetchMoreDataMock,
  hasMore: hasMoreMock,
}));

const albumsDataMock = ref<{
  albums: Album[];
}>({
  albums: getFormattedAlbumsMock(5),
});

const refreshMock = vi.fn();
const statusMock = ref('success');

mockNuxtImport('useAsyncData', () => () => ({
  data: albumsDataMock,
  refresh: refreshMock,
  status: statusMock,
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/albums/newest',
    params: {
      sortBy: 'newest',
    },
  })),
}));

mockNuxtImport('useRoute', () => routeMock);

const { useHeadTitleMock } = useHeadMock();

const album = getFormattedAlbumsMock()[0];

function factory(props = {}) {
  return mount(AlbumsPage, {
    global: {
      stubs: {
        AlbumsList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[[sortBy]]', () => {
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

  describe.each(Object.values(ROUTE_ALBUMS_SORT_BY_PARAMS))(
    'when the sortBy route param is %s',
    (sortBy) => {
      beforeEach(() => {
        routeMock.mockReturnValue({
          fullPath: `/albums/${sortBy}`,
          params: {
            sortBy,
          },
        });

        wrapper = factory();
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
        beforeEach(() => {
          albumsDataMock.value = {
            albums: getFormattedAlbumsMock(5),
          };

          wrapper = factory();
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
        beforeEach(() => {
          albumsDataMock.value = {
            albums: [],
          };

          wrapper = factory();
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
