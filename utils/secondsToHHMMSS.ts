export function secondsToHHMMSS(seconds?: number | string) {
  const totalSeconds = Number(seconds);

  if (isNaN(totalSeconds)) {
    return '-';
  }

  const date = new Date(totalSeconds * 1000).toISOString();

  // 3600 seconds is equal to 60 minutes
  if (totalSeconds <= 3600) {
    // 1970-01-01T00:01:00.000Z = 01:00.
    return date.slice(14, 19);
  }

  // 1970-01-01T01:01:00.000Z = 01:01:00.
  return date.slice(11, 19);
}
