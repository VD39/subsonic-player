import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import { useStateReset } from './index';

const resetFavouritesMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useFavourite', (original) => () => ({
  ...original(),
  resetFavourites: resetFavouritesMock,
}));

const resetPlaylistsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  resetPlaylists: resetPlaylistsMock,
}));

const resetRadioStationsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useRadioStation', (original) => () => ({
  ...original(),
  resetRadioStations: resetRadioStationsMock,
}));

const resetBookmarksMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useBookmark', (original) => () => ({
  ...original(),
  resetBookmarks: resetBookmarksMock,
}));

const resetPodcastsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePodcast', (original) => () => ({
  ...original(),
  resetPodcasts: resetPodcastsMock,
}));

const resetAlbumsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAlbum', (original) => () => ({
  ...original(),
  resetAlbums: resetAlbumsMock,
}));

const resetSettingsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  resetSettings: resetSettingsMock,
}));

const { resetAudioPlayerMock } = useAudioPlayerMock();
const { resetQueueMock } = useQueueMock();

describe('useStateReset', () => {
  let composable: ReturnType<typeof useStateReset>;

  beforeAll(() => {
    composable = useStateReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the resetAllUserState function is called', () => {
    beforeEach(() => {
      composable.resetAllUserState();
    });

    it('calls the resetAudioPlayer function', () => {
      expect(resetAudioPlayerMock).toHaveBeenCalledOnce();
    });

    it('calls the resetFavourites function', () => {
      expect(resetFavouritesMock).toHaveBeenCalledOnce();
    });

    it('calls the resetPlaylists function', () => {
      expect(resetPlaylistsMock).toHaveBeenCalledOnce();
    });

    it('calls the resetRadioStations function', () => {
      expect(resetRadioStationsMock).toHaveBeenCalledOnce();
    });

    it('calls the resetBookmarks function', () => {
      expect(resetBookmarksMock).toHaveBeenCalledOnce();
    });

    it('calls the resetPodcasts function', () => {
      expect(resetPodcastsMock).toHaveBeenCalledOnce();
    });

    it('calls the resetAlbums function', () => {
      expect(resetAlbumsMock).toHaveBeenCalledOnce();
    });

    it('calls the resetQueue function', () => {
      expect(resetQueueMock).toHaveBeenCalledOnce();
    });

    it('calls the resetSettings function', () => {
      expect(resetSettingsMock).toHaveBeenCalledOnce();
    });
  });
});
