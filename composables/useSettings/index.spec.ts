import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useSettings } from './index';

const getLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const config = vi.hoisted(() => ({
  public: {
    BITRATE: 0,
    DELETE_PODCAST_ON_END: false,
    LAYOUT: 'gridLayout',
    REPLAY_GAIN_MODE: 'off',
    SCROBBLE_ENABLED: true,
    SHOW_PODCASTS: true,
    SHOW_RADIO_STATIONS: true,
    THEME: 'auto',
  },
}));

mockNuxtImport('useRuntimeConfig', () => () => config);

const {
  applyThemePreference,
  cycleLayout,
  cycleReplayGainMode,
  deletePodcastOnEnd,
  isDarkTheme,
  loadSettings,
  replayGainMode,
  resetSettings,
  scrobbleEnabled,
  setReplayGainMode,
  setStreamBitrate,
  setThemeMode,
  setViewLayout,
  showPodcasts,
  showRadioStations,
  streamBitrate,
  syncFromStorage,
  themePreference,
  toggleDeletePodcastOnEnd,
  toggleScrobble,
  toggleShowPodcasts,
  toggleShowRadioStations,
  toggleTheme,
  viewLayout,
} = useSettings();

describe('useSettings', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default themePreference value', () => {
    expect(themePreference.value).toBe('auto');
  });

  it('sets the default isDarkTheme value', () => {
    expect(isDarkTheme.value).toBe(false);
  });

  it('sets the default viewLayout value', () => {
    expect(viewLayout.value).toBe('gridLayout');
  });

  it('sets the default scrobbleEnabled value', () => {
    expect(scrobbleEnabled.value).toBe(true);
  });

  it('sets the default streamBitrate value', () => {
    expect(streamBitrate.value).toBe(0);
  });

  it('sets the default showPodcasts value', () => {
    expect(showPodcasts.value).toBe(true);
  });

  it('sets the default showRadioStations value', () => {
    expect(showRadioStations.value).toBe(true);
  });

  it('sets the default deletePodcastOnEnd value', () => {
    expect(deletePodcastOnEnd.value).toBe(false);
  });

  it('sets the default replayGainMode value', () => {
    expect(replayGainMode.value).toBe('off');
  });

  describe('when the applyThemePreference function is called', () => {
    describe('when the themePreference value is dark', () => {
      beforeAll(() => {
        themePreference.value = 'dark';
        applyThemePreference();
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(true);
      });
    });

    describe('when the themePreference value is light', () => {
      beforeAll(() => {
        themePreference.value = 'light';
        applyThemePreference();
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });

    describe('when the themePreference value is auto', () => {
      beforeEach(() => {
        themePreference.value = 'auto';
        applyThemePreference();
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });
  });

  describe('when the setThemeMode function is called', () => {
    describe('when mode is dark', () => {
      beforeEach(() => {
        setThemeMode('dark');
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('dark');
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(true);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            theme: 'dark',
          }),
        );
      });
    });

    describe('when mode is light', () => {
      beforeEach(() => {
        setThemeMode('light');
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('light');
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });
  });

  describe('when the toggleTheme function is called', () => {
    describe('when the themePreference value is dark', () => {
      beforeEach(() => {
        themePreference.value = 'dark';
        toggleTheme();
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('light');
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            theme: 'light',
          }),
        );
      });
    });

    describe('when the themePreference value is light', () => {
      beforeEach(() => {
        themePreference.value = 'light';
        toggleTheme();
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('dark');
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(true);
      });
    });
  });

  describe('when the setViewLayout function is called', () => {
    describe('when value is listLayout', () => {
      beforeEach(() => {
        setViewLayout('listLayout');
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe('listLayout');
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            layout: 'listLayout',
          }),
        );
      });
    });

    describe('when no value is provided', () => {
      beforeEach(() => {
        viewLayout.value = 'listLayout';
        setViewLayout();
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe('gridLayout');
      });
    });
  });

  describe('when the cycleLayout function is called', () => {
    describe('when the viewLayout value is gridLayout', () => {
      beforeAll(() => {
        viewLayout.value = 'gridLayout';
        cycleLayout();
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe('listLayout');
      });

      describe('when cycleLayout is called again', () => {
        beforeAll(() => {
          cycleLayout();
        });

        it('sets the correct viewLayout value', () => {
          expect(viewLayout.value).toBe('gridLayout');
        });
      });
    });
  });

  describe('when the toggleScrobble function is called', () => {
    describe('when the scrobbleEnabled value is true', () => {
      beforeEach(() => {
        scrobbleEnabled.value = true;
        toggleScrobble();
      });

      it('sets the correct scrobbleEnabled value', () => {
        expect(scrobbleEnabled.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            scrobbleEnabled: false,
          }),
        );
      });
    });

    describe('when the scrobbleEnabled value is false', () => {
      beforeAll(() => {
        scrobbleEnabled.value = false;
        toggleScrobble();
      });

      it('sets the correct scrobbleEnabled value', () => {
        expect(scrobbleEnabled.value).toBe(true);
      });
    });
  });

  describe('when the setStreamBitrate function is called', () => {
    beforeEach(() => {
      setStreamBitrate(320);
    });

    it('sets the correct streamBitrate value', () => {
      expect(streamBitrate.value).toBe(320);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.settings,
        expect.objectContaining({
          streamBitrate: 320,
        }),
      );
    });
  });

  describe('when the toggleShowPodcasts function is called', () => {
    describe('when the showPodcasts value is true', () => {
      beforeEach(() => {
        showPodcasts.value = true;
        toggleShowPodcasts();
      });

      it('sets the correct showPodcasts value', () => {
        expect(showPodcasts.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            showPodcasts: false,
          }),
        );
      });
    });

    describe('when the showPodcasts value is false', () => {
      beforeAll(() => {
        showPodcasts.value = false;
        toggleShowPodcasts();
      });

      it('sets the correct showPodcasts value', () => {
        expect(showPodcasts.value).toBe(true);
      });
    });
  });

  describe('when the toggleShowRadioStations function is called', () => {
    describe('when the showRadioStations value is true', () => {
      beforeEach(() => {
        showRadioStations.value = true;
        toggleShowRadioStations();
      });

      it('sets the correct showRadioStations value', () => {
        expect(showRadioStations.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            showRadioStations: false,
          }),
        );
      });
    });

    describe('when the showRadioStations value is false', () => {
      beforeAll(() => {
        showRadioStations.value = false;
        toggleShowRadioStations();
      });

      it('sets the correct showRadioStations value', () => {
        expect(showRadioStations.value).toBe(true);
      });
    });
  });

  describe('when the toggleDeletePodcastOnEnd function is called', () => {
    describe('when the deletePodcastOnEnd value is false', () => {
      beforeEach(() => {
        deletePodcastOnEnd.value = false;
        toggleDeletePodcastOnEnd();
      });

      it('sets the correct deletePodcastOnEnd value', () => {
        expect(deletePodcastOnEnd.value).toBe(true);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
          expect.objectContaining({
            deletePodcastOnEnd: true,
          }),
        );
      });
    });

    describe('when the deletePodcastOnEnd value is true', () => {
      beforeAll(() => {
        deletePodcastOnEnd.value = true;
        toggleDeletePodcastOnEnd();
      });

      it('sets the correct deletePodcastOnEnd value', () => {
        expect(deletePodcastOnEnd.value).toBe(false);
      });
    });
  });

  describe('when the setReplayGainMode function is called', () => {
    beforeEach(() => {
      setReplayGainMode('album');
    });

    it('sets the correct replayGainMode value', () => {
      expect(replayGainMode.value).toBe('album');
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.settings,
        expect.objectContaining({
          replayGainMode: 'album',
        }),
      );
    });
  });

  describe('when the cycleReplayGainMode function is called', () => {
    describe('when the replayGainMode value is off', () => {
      beforeAll(() => {
        replayGainMode.value = 'off';
        cycleReplayGainMode();
      });

      it('sets the correct replayGainMode value', () => {
        expect(replayGainMode.value).toBe('track');
      });

      describe('when cycleReplayGainMode is called again', () => {
        beforeAll(() => {
          cycleReplayGainMode();
        });

        it('sets the correct replayGainMode value', () => {
          expect(replayGainMode.value).toBe('album');
        });
      });
    });
  });

  describe('when the loadSettings function is called', () => {
    describe('when the settingsRestored value is false', () => {
      beforeAll(() => {
        useState(STATE_KEYS.settingsRestored).value = false;
        getLocalStorageMock.mockReturnValue(null);
        loadSettings();
      });

      it('calls the getLocalStorage function with the correct parameters', () => {
        expect(getLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
        );
      });

      describe('when loadSettings is called again', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          loadSettings();
        });

        it('does not call the getLocalStorage function', () => {
          expect(getLocalStorageMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the syncFromStorage function is called', () => {
    describe('when getLocalStorage returns null', () => {
      beforeEach(() => {
        getLocalStorageMock.mockReturnValue(null);
        syncFromStorage();
      });

      it('calls the getLocalStorage function with the correct parameters', () => {
        expect(getLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.settings,
        );
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a theme value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ theme: 'dark' })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('dark');
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(true);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a layout value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ layout: 'listLayout' })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe('listLayout');
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a scrobbleEnabled value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ scrobbleEnabled: false })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct scrobbleEnabled value', () => {
        expect(scrobbleEnabled.value).toBe(false);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a streamBitrate value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ streamBitrate: 256 })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct streamBitrate value', () => {
        expect(streamBitrate.value).toBe(256);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a showPodcasts value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ showPodcasts: false })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct showPodcasts value', () => {
        expect(showPodcasts.value).toBe(false);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a showRadioStations value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ showRadioStations: false })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct showRadioStations value', () => {
        expect(showRadioStations.value).toBe(false);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a deletePodcastOnEnd value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ deletePodcastOnEnd: true })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct deletePodcastOnEnd value', () => {
        expect(deletePodcastOnEnd.value).toBe(true);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when stored settings contain a replayGainMode value', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce({ replayGainMode: 'track' })
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct replayGainMode value', () => {
        expect(replayGainMode.value).toBe('track');
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when the legacy theme value is boolean true', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('dark');
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.theme,
        );
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when the legacy theme value is boolean false', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(null);
        syncFromStorage();
      });

      it('sets the correct themePreference value', () => {
        expect(themePreference.value).toBe('light');
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.theme,
        );
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when the legacy layout value exists', () => {
      beforeEach(() => {
        getLocalStorageMock
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce('listLayout');
        syncFromStorage();
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe('listLayout');
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.layout,
        );
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the resetSettings function is called', () => {
    beforeEach(() => {
      resetSettings();
    });

    it('calls the deleteLocalStorage function with the correct parameters', () => {
      expect(deleteLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.settings,
      );
    });

    it('calls the setLocalStorage function with the default values', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.settings,
        {
          deletePodcastOnEnd: false,
          layout: 'gridLayout',
          replayGainMode: 'off',
          scrobbleEnabled: true,
          showPodcasts: true,
          showRadioStations: true,
          streamBitrate: 0,
          theme: 'auto',
        },
      );
    });
  });
});
