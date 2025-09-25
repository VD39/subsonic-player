import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import BookmarksTracksList from '@/components/Organisms/TrackLists/BookmarksTracksList.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import BookmarksPage from './bookmarks.vue';

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

const deleteBookmarkMock = vi.fn();
const getBookmarksMock = vi.fn();
const bookmarksMock = ref<Bookmark[]>([]);

mockNuxtImport('useBookmark', () => () => ({
  bookmarks: bookmarksMock,
  deleteBookmark: deleteBookmarkMock,
  getBookmarks: getBookmarksMock,
}));

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { playTracksMock, setCurrentTimeMock } = useAudioPlayerMock();

const bookmark = getFormattedBookmarksMock()[0];

function factory(props = {}) {
  return mount(BookmarksPage, {
    props: {
      ...props,
    },
  });
}

describe('bookmarks', () => {
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
    expect(useHeadTitleMock.value).toBe('Bookmarks');
  });

  describe('when bookmarks is an empty array', () => {
    it('displays zero bookmark count in the title', () => {
      expect(wrapper.find({ ref: 'title' }).text()).toBe('Bookmarks (0)');
    });
  });

  describe('when bookmarks is not an empty array', () => {
    beforeEach(() => {
      bookmarksMock.value = getFormattedBookmarksMock(2);
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('displays the correct bookmark count in the title', () => {
      expect(wrapper.find({ ref: 'title' }).text()).toBe('Bookmarks (2)');
    });
  });

  describe('when the RefreshButton emits the refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  describe('when the BookmarksTracksList component emits the addToPlaylist event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(BookmarksTracksList)
        .vm.$emit('addToPlaylist', bookmark.id, 1);
    });

    it('calls the addToPlaylistModal function with the correct parameters', () => {
      expect(addToPlaylistModalMock).toHaveBeenCalledWith(bookmark.id, 1);
    });
  });

  describe('when the BookmarksTracksList component emits the downloadMedia event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(BookmarksTracksList)
        .vm.$emit('downloadMedia', bookmark);
    });

    it('calls the downloadMedia function with the correct parameters', () => {
      expect(downloadMediaMock).toHaveBeenCalledWith(bookmark);
    });
  });

  describe('when the BookmarksTracksList component emits the mediaInformation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(BookmarksTracksList)
        .vm.$emit('mediaInformation', bookmark);
    });

    it('calls the openTrackInformationModal function with the correct parameters', () => {
      expect(openTrackInformationModalMock).toHaveBeenCalledWith(bookmark);
    });
  });

  describe('when the BookmarksTracksList component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(BookmarksTracksList).vm.$emit('playTrack', 0);
    });

    it('calls the playTracks function with correct bookmark', () => {
      expect(playTracksMock).toHaveBeenCalledWith([bookmarksMock.value[0]], -1);
    });

    it('calls the setCurrentTime function with bookmark position', () => {
      expect(setCurrentTimeMock).toHaveBeenCalledWith(
        bookmarksMock.value[0].position,
      );
    });
  });

  describe('when the BookmarksTracksList component emits the remove event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(BookmarksTracksList)
        .vm.$emit('remove', bookmark.id);
    });

    it('calls the deleteBookmark function with the correct parameters', () => {
      expect(deleteBookmarkMock).toHaveBeenCalledWith(bookmark.id);
    });
  });
});
