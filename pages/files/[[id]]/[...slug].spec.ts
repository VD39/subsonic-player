import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import FilesList from '@/components/Organisms/FilesList.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import FilesPage from './[...slug].vue';

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const downloadMediaMock = vi.fn();
const getFilesMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
  getFiles: getFilesMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const musicDirectoryDataMock = ref<{
  musicDirectory: {
    folders: FormattedMusicFolder[];
    tracks: Track[];
  };
}>({
  musicDirectory: {
    folders: [],
    tracks: getFormattedTracksMock(2),
  },
});

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  data: musicDirectoryDataMock,
  refresh: refreshMock,
  status: ref('success'),
}));

const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn(() => ({
    fullPath: '/files/folder1/subfolder',
    params: {
      id: 'folder1',
      slug: ['subfolder'],
    },
  })),
}));

mockNuxtImport('useRoute', () => routeMock);

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(FilesPage, {
    global: {
      stubs: {
        FilesList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[...slug]', () => {
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
    expect(useHeadTitleMock.value).toBe('Files');
  });

  describe('when the RefreshButton emits the refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  describe('when the FilesList component emits the addToPlaylist event', () => {
    beforeEach(() => {
      wrapper.findComponent(FilesList).vm.$emit('addToPlaylist', track);
    });

    it('calls the addToPlaylistModal function with the correct parameters', () => {
      expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
    });
  });

  describe('when the FilesList component emits the addToQueue event', () => {
    beforeEach(() => {
      wrapper.findComponent(FilesList).vm.$emit('addToQueue', track);
    });

    it('calls the addTrackToQueue function with the correct parameters', () => {
      expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
    });
  });

  describe('when the FilesList component emits the downloadMedia event', () => {
    beforeEach(() => {
      wrapper.findComponent(FilesList).vm.$emit('downloadMedia', track);
    });

    it('calls the downloadMedia function with the correct parameters', () => {
      expect(downloadMediaMock).toHaveBeenCalledWith(track);
    });
  });

  describe('when the FilesList component emits the mediaInformation event', () => {
    beforeEach(() => {
      wrapper.findComponent(FilesList).vm.$emit('mediaInformation', track);
    });

    it('calls the openTrackInformationModal function with the correct parameters', () => {
      expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
    });
  });

  describe('when the FilesList component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(FilesList).vm.$emit('playTrack', 1);
    });

    it('calls the playTracks function with the correct parameters', () => {
      expect(playTracksMock).toHaveBeenCalledWith(
        musicDirectoryDataMock.value.musicDirectory.tracks,
        0,
      );
    });
  });
});
