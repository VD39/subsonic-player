import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import PlaylistList from '@/components/playlist/PlaylistList.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import { useHeadMock } from '@/test/useHeadMock';

import PlaylistsPage from './playlists.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const {
  addPlaylistModalMock,
  deletePlaylistMock,
  getPlaylistsMock,
  updatePlaylistModalMock,
} = vi.hoisted(() => ({
  addPlaylistModalMock: vi.fn(),
  deletePlaylistMock: vi.fn(),
  getPlaylistsMock: vi.fn(),
  updatePlaylistModalMock: vi.fn(),
}));

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addPlaylistModal: addPlaylistModalMock,
  deletePlaylist: deletePlaylistMock,
  getPlaylists: getPlaylistsMock,
  playlists: ref([]),
  updatePlaylistModal: updatePlaylistModalMock,
}));

const refreshMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAsyncData', () => () => ({
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();

const playlist = getFormattedPlaylistsMock()[0];

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
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'addPlaylistButton' })
        .trigger('click');
    });

    it('calls the addPlaylistModal function', () => {
      expect(addPlaylistModalMock).toHaveBeenCalled();
    });
  });

  describe('when the PlaylistList component emits the deletePlaylist event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(PlaylistList)
        .vm.$emit('deletePlaylist', playlist.id);
    });

    it('calls the deletePlaylist function with the correct parameters', () => {
      expect(deletePlaylistMock).toHaveBeenCalledWith(playlist.id);
    });
  });

  describe('when the PlaylistList component emits the editPlaylist event', () => {
    beforeEach(() => {
      wrapper.findComponent(PlaylistList).vm.$emit('editPlaylist', playlist);
    });

    it('calls the updatePlaylistModal function with the correct parameters', () => {
      expect(updatePlaylistModalMock).toHaveBeenCalledWith(playlist);
    });
  });
});
