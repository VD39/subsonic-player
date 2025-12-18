import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useStateReset } from './index';

const resetFavouritesMock = vi.fn();

mockNuxtImport('useFavourite', () => () => ({
  resetFavourites: resetFavouritesMock,
}));

const resetPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  resetPlaylists: resetPlaylistsMock,
}));

const resetRadioStationsMock = vi.fn();

mockNuxtImport('useRadioStation', () => () => ({
  resetRadioStations: resetRadioStationsMock,
}));

const resetBookmarksMock = vi.fn();

mockNuxtImport('useBookmark', () => () => ({
  resetBookmarks: resetBookmarksMock,
}));

const resetPodcastsMock = vi.fn();

mockNuxtImport('usePodcast', () => () => ({
  resetPodcasts: resetPodcastsMock,
}));

const resetAlbumsMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  resetAlbums: resetAlbumsMock,
}));

const resetAudioPlayerMock = vi.fn();

mockNuxtImport('useAudioPlayer', () => () => ({
  resetAudioPlayer: resetAudioPlayerMock,
}));

const { resetAllUserState } = useStateReset();

describe('useStateReset', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when resetAllUserState is called', () => {
    beforeEach(() => {
      resetAllUserState();
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
  });
});
