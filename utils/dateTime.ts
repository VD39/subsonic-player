const DEFAULT_FORMAT_OPTIONS = {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
} as Intl.DateTimeFormatOptions;

export function formatDate(
  inputDate: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = DEFAULT_FORMAT_OPTIONS,
) {
  if (!inputDate) {
    return DEFAULT_VALUE;
  }

  const date = new Date(inputDate);

  return date.toLocaleDateString('en-GB', options);
}

export function secondsToHHMMSS(seconds: number | string | undefined) {
  const totalSeconds = Number(seconds);

  if (!seconds || isNaN(totalSeconds)) {
    return '00:00';
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

export function secondsToTimeFormat(seconds: number | string | undefined) {
  const totalSeconds = Number(seconds);

  if (!seconds || isNaN(totalSeconds)) {
    return '0s';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const hoursString = hours > 0 ? `${hours}h ` : '';
  const minutesString = minutes > 0 ? `${minutes}m ` : '';
  const secondsString = remainingSeconds > 0 ? `${remainingSeconds}s` : '';

  return `${hoursString}${minutesString}${secondsString}`.trim();
}
