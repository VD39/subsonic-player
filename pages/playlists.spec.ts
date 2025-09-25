import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';
import { formattedPlaylistMock } from '@/test/fixtures';
import { useHeadMock } from '@/test/useHeadMock';

import PlaylistsPage from './playlists.vue';

const addPlaylistModalMock = vi.fn();
const deletePlaylistMock = vi.fn();
const getPlaylistsMock = vi.fn();
const updatePlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addPlaylistModal: addPlaylistModalMock,
  deletePlaylist: deletePlaylistMock,
  getPlaylists: getPlaylistsMock,
  playlists: ref([]),
  updatePlaylistModal: updatePlaylistModalMock,
}));

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();

function factory(props = {}) {
  return mount(PlaylistsPage, {
    props: {
      ...props,
    },
  });
}

describe('playlists', () => {
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
    expect(useHeadTitleMock.value).toBe('Playlists');
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
      wrapper.findComponent({ ref: 'addPlaylistButton' }).vm.$emit('click');
    });

    it('calls the addPlaylistModal function', () => {
      expect(addPlaylistModalMock).toHaveBeenCalled();
    });
  });

  describe('when the PlaylistsList component emits the deletePlaylist event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(PlaylistsList)
        .vm.$emit('deletePlaylist', formattedPlaylistMock.id);
    });

    it('calls the deletePlaylist function with the correct parameters', () => {
      expect(deletePlaylistMock).toHaveBeenCalledWith(formattedPlaylistMock.id);
    });
  });

  describe('when the PlaylistsList component emits the editPlaylist event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(PlaylistsList)
        .vm.$emit('editPlaylist', formattedPlaylistMock);
    });

    it('calls the updatePlaylistModal function with the correct parameters', () => {
      expect(updatePlaylistModalMock).toHaveBeenCalledWith(
        formattedPlaylistMock,
      );
    });
  });
});
