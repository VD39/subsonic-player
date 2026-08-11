import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import FilesList from '@/components/Organisms/FilesList.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import FilesPage from './[...slug].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const addToPlaylistModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
}));

const { downloadTrackMock, getMediaLibraryContentMock } = vi.hoisted(() => ({
  downloadTrackMock: vi.fn(),
  getMediaLibraryContentMock: vi.fn(),
}));

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  downloadTrack: downloadTrackMock,
  getMediaLibraryContent: getMediaLibraryContentMock,
}));

const openTrackInformationModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openTrackInformationModal: openTrackInformationModalMock,
}));

const musicDirectoryDataMock = ref({
  musicDirectory: {
    folders: [],
    tracks: getFormattedTracksMock(2),
  },
});

const refreshMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAsyncData', () => () => ({
  data: musicDirectoryDataMock,
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];

async function factory(props = {}, route = '/files/folder1/subfolder') {
  return mountSuspended(FilesPage, {
    global: {
      stubs: {
        FilesList: true,
      },
    },
    props: {
      ...props,
    },
    route,
  });
}

describe('[...slug]', () => {
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

    it('calls the downloadTrack function with the correct parameters', () => {
      expect(downloadTrackMock).toHaveBeenCalledWith(track);
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
        1,
      );
    });
  });
});
