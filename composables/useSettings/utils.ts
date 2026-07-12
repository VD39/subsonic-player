export function isValidSettings(data: SettingsData) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Added so that if new settings are added in the future, this will cause an error
  // so that we can update the validation logic accordingly.
  const checks: Record<keyof SettingsData, boolean> = {
    deletePodcastOnEnd: typeof data.deletePodcastOnEnd === 'boolean',
    layout: typeof data.layout === 'string' && LAYOUTS.includes(data.layout),
    replayGainMode:
      typeof data.replayGainMode === 'string' &&
      REPLAY_GAIN_MODES.includes(data.replayGainMode),
    scrobbleEnabled: typeof data.scrobbleEnabled === 'boolean',
    showPodcasts: typeof data.showPodcasts === 'boolean',
    showRadioStations: typeof data.showRadioStations === 'boolean',
    streamBitrate:
      typeof data.streamBitrate === 'number' &&
      BITRATES.includes(data.streamBitrate),
    theme: typeof data.theme === 'string' && THEMES.includes(data.theme),
  };

  return Object.values(checks).every(Boolean);
}

export function resolveDarkTheme(theme?: unknown) {
  if (theme === 'dark' || theme === 'true' || theme === true) {
    return true;
  }

  if (theme === 'light' || theme === 'false' || theme === false) {
    return false;
  }

  if (import.meta.client) {
    return !!globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

export function toBitrate(value: Bitrate) {
  const bitrate = Number(value) as Bitrate;

  return BITRATES.includes(bitrate) ? bitrate : BITRATES[0];
}

export function toLayout(value: Layout) {
  return LAYOUTS.includes(value) ? value : LAYOUTS[0];
}

export function toTheme(value: Theme) {
  return THEMES.includes(value) ? value : 'auto';
}
