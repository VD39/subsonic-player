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

export function toCrossfadeDuration(value: number) {
  return Math.max(
    CROSSFADE_DURATION_MIN,
    Math.min(CROSSFADE_DURATION_MAX, value),
  );
}

export function toLayout(value: Layout) {
  return LAYOUTS.includes(value) ? value : LAYOUTS[0];
}

export function toReplayGainMode(value: ReplayGainMode) {
  return REPLAY_GAIN_MODES.includes(value) ? value : REPLAY_GAIN_MODES[0];
}

export function toTheme(value: Theme) {
  return THEMES.includes(value) ? value : 'auto';
}
