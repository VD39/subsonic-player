export function calculateReplayGain(
  mode: ReplayGainMode,
  trackGain?: number,
  albumGain?: number,
  peak?: number,
) {
  if (mode === 'off') {
    return 1;
  }

  const gainDb = mode === 'album' ? albumGain : trackGain;
  const rawGain = Math.pow(10, (gainDb || 0) / 20);
  const maxGain = peak && peak > 0 ? 1 / peak : Infinity;

  return Math.min(rawGain, maxGain);
}
