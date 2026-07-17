export function useSettings() {
  const config = useRuntimeConfig();
  const {
    BITRATE,
    CROSSFADE_DURATION,
    CROSSFADE_ENABLED,
    DELETE_PODCAST_ON_END,
    LAYOUT,
    REPLAY_GAIN_MODE,
    SCROBBLE_ENABLED,
    SHOW_PODCASTS,
    SHOW_RADIO_STATIONS,
    THEME,
  } = config.public;

  const themePreference = useState(STATE_KEYS.themePreference, () =>
    toTheme(THEME as Theme),
  );

  const isDarkTheme = useState(STATE_KEYS.theme, () => resolveDarkTheme(THEME));

  const viewLayout = useState(STATE_KEYS.layout, () =>
    toLayout(LAYOUT as Layout),
  );

  const scrobbleEnabled = useState(
    STATE_KEYS.scrobbleEnabled,
    () => SCROBBLE_ENABLED,
  );

  const streamBitrate = useState(STATE_KEYS.streamBitrate, () =>
    toBitrate(BITRATE as Bitrate),
  );

  const showPodcasts = useState(STATE_KEYS.showPodcasts, () => SHOW_PODCASTS);

  const showRadioStations = useState(
    STATE_KEYS.showRadioStations,
    () => SHOW_RADIO_STATIONS,
  );

  const deletePodcastOnEnd = useState(
    STATE_KEYS.deletePodcastOnEnd,
    () => DELETE_PODCAST_ON_END,
  );

  const replayGainMode = useState(STATE_KEYS.replayGainMode, () =>
    toReplayGainMode(REPLAY_GAIN_MODE as ReplayGainMode),
  );

  const crossfadeEnabled = useState(
    STATE_KEYS.crossfadeEnabled,
    () => CROSSFADE_ENABLED,
  );

  const crossfadeDuration = useState(STATE_KEYS.crossfadeDuration, () =>
    toCrossfadeDuration(CROSSFADE_DURATION),
  );

  const settingsRestored = useState(STATE_KEYS.settingsRestored, () => false);

  function saveSettingsState() {
    const toSave: SettingsData = {
      crossfadeDuration: crossfadeDuration.value,
      crossfadeEnabled: crossfadeEnabled.value,
      deletePodcastOnEnd: deletePodcastOnEnd.value,
      layout: viewLayout.value,
      replayGainMode: replayGainMode.value,
      scrobbleEnabled: scrobbleEnabled.value,
      showPodcasts: showPodcasts.value,
      showRadioStations: showRadioStations.value,
      streamBitrate: streamBitrate.value,
      theme: themePreference.value,
    };

    setLocalStorage(LOCAL_STORAGE_KEYS.settings, toSave);
  }

  function applyThemePreference() {
    isDarkTheme.value = resolveDarkTheme(themePreference.value);
  }

  function restoreSettingsState(persistAfter = true) {
    const stored = getLocalStorage(LOCAL_STORAGE_KEYS.settings) || {};

    // TODO: Remove legacy migration after sufficient time.
    const legacyTheme = getLocalStorage(LOCAL_STORAGE_KEYS.theme);
    const legacyLayout = getLocalStorage(LOCAL_STORAGE_KEYS.layout);

    if (typeof legacyTheme === 'boolean') {
      stored.theme = legacyTheme ? 'dark' : 'light';
      deleteLocalStorage(LOCAL_STORAGE_KEYS.theme);
    }

    if (legacyLayout) {
      stored.layout = toLayout(legacyLayout);
      deleteLocalStorage(LOCAL_STORAGE_KEYS.layout);
    }

    themePreference.value = toTheme(stored.theme ?? THEME);

    applyThemePreference();

    // Guard against missing fields when stored is empty or contains unexpected types.
    if (typeof stored.layout === 'string') {
      viewLayout.value = toLayout(stored.layout);
    }

    if (typeof stored.scrobbleEnabled === 'boolean') {
      scrobbleEnabled.value = stored.scrobbleEnabled;
    }

    if (stored.streamBitrate !== undefined) {
      streamBitrate.value = toBitrate(stored.streamBitrate);
    }

    if (typeof stored.showPodcasts === 'boolean') {
      showPodcasts.value = stored.showPodcasts;
    }

    if (typeof stored.showRadioStations === 'boolean') {
      showRadioStations.value = stored.showRadioStations;
    }

    if (typeof stored.deletePodcastOnEnd === 'boolean') {
      deletePodcastOnEnd.value = stored.deletePodcastOnEnd;
    }

    if (typeof stored.replayGainMode === 'string') {
      replayGainMode.value = toReplayGainMode(stored.replayGainMode);
    }

    if (typeof stored.crossfadeEnabled === 'boolean') {
      crossfadeEnabled.value = stored.crossfadeEnabled;
    }

    if (typeof stored.crossfadeDuration === 'number') {
      crossfadeDuration.value = stored.crossfadeDuration;
    }

    settingsRestored.value = true;

    if (persistAfter) {
      saveSettingsState();
    }
  }

  function loadSettings() {
    if (settingsRestored.value) {
      return;
    }

    restoreSettingsState();
  }

  function setThemeMode(mode: Theme) {
    themePreference.value = toTheme(mode);
    applyThemePreference();
    saveSettingsState();
  }

  function toggleTheme() {
    const theme = themePreference.value === 'dark' ? 'light' : 'dark';
    setThemeMode(theme);
  }

  function setViewLayout(value: Layout = LAYOUTS[0]) {
    viewLayout.value = toLayout(value);
    saveSettingsState();
  }

  function cycleLayout() {
    const currentIndex = LAYOUTS.indexOf(viewLayout.value);
    const nextIndex = (currentIndex + 1) % LAYOUTS.length;
    setViewLayout(LAYOUTS[nextIndex]);
  }

  function toggleScrobble() {
    scrobbleEnabled.value = !scrobbleEnabled.value;
    saveSettingsState();
  }

  function setStreamBitrate(value: Bitrate) {
    streamBitrate.value = toBitrate(value);
    saveSettingsState();
  }

  function toggleShowPodcasts() {
    showPodcasts.value = !showPodcasts.value;
    saveSettingsState();
  }

  function toggleShowRadioStations() {
    showRadioStations.value = !showRadioStations.value;
    saveSettingsState();
  }

  function toggleDeletePodcastOnEnd() {
    deletePodcastOnEnd.value = !deletePodcastOnEnd.value;
    saveSettingsState();
  }

  function setReplayGainMode(mode: ReplayGainMode) {
    replayGainMode.value = toReplayGainMode(mode);
    saveSettingsState();
  }

  function cycleReplayGainMode() {
    const currentIndex = REPLAY_GAIN_MODES.indexOf(replayGainMode.value);
    const nextIndex = (currentIndex + 1) % REPLAY_GAIN_MODES.length;
    replayGainMode.value = REPLAY_GAIN_MODES[nextIndex];
    saveSettingsState();
  }

  function setCrossfadeDuration(value: number) {
    crossfadeDuration.value = toCrossfadeDuration(value);
    saveSettingsState();
  }

  function toggleCrossfade() {
    crossfadeEnabled.value = !crossfadeEnabled.value;
    saveSettingsState();
  }

  function resetSettings() {
    deleteLocalStorage(LOCAL_STORAGE_KEYS.settings);
    themePreference.value = toTheme(THEME as Theme);
    isDarkTheme.value = resolveDarkTheme(THEME);
    viewLayout.value = toLayout(LAYOUT as Layout);
    scrobbleEnabled.value = SCROBBLE_ENABLED;
    streamBitrate.value = toBitrate(BITRATE as Bitrate);
    showPodcasts.value = SHOW_PODCASTS;
    showRadioStations.value = SHOW_RADIO_STATIONS;
    deletePodcastOnEnd.value = DELETE_PODCAST_ON_END;
    replayGainMode.value = toReplayGainMode(REPLAY_GAIN_MODE as ReplayGainMode);
    crossfadeEnabled.value = false;
    crossfadeDuration.value = CROSSFADE_DURATION_MIN;
    settingsRestored.value = false;
    saveSettingsState();
  }

  function syncFromStorage() {
    restoreSettingsState(false);
  }

  return {
    applyThemePreference,
    crossfadeDuration,
    crossfadeEnabled,
    cycleLayout,
    cycleReplayGainMode,
    deletePodcastOnEnd,
    isDarkTheme,
    loadSettings,
    replayGainMode,
    resetSettings,
    scrobbleEnabled,
    setCrossfadeDuration,
    setReplayGainMode,
    setStreamBitrate,
    setThemeMode,
    setViewLayout,
    showPodcasts,
    showRadioStations,
    streamBitrate,
    syncFromStorage,
    themePreference,
    toggleCrossfade,
    toggleDeletePodcastOnEnd,
    toggleScrobble,
    toggleShowPodcasts,
    toggleShowRadioStations,
    toggleTheme,
    viewLayout,
  };
}
