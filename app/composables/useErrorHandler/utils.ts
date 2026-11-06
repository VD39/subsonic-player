const SUBSONIC_ERROR_MESSAGES: Record<number, string> = {
  0: 'A generic server error occurred.',
  10: 'A required parameter is missing.',
  20: 'The client application is outdated. Please update your app.',
  30: 'The server version is not compatible. Please update your server.',
  40: 'Invalid username or password.',
  41: 'Token authentication is not supported for this user account.',
  42: 'The provided authentication method is not supported by the server.',
  43: 'Conflicting authentication methods were provided.',
  44: 'The application API key is invalid.',
  50: 'You are not authorized to perform this action.',
  60: 'Your trial period has expired.',
  70: 'The requested data was not found.',
};

export function getFriendlyErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'target' in error) {
    const mediaError = (error as { target: HTMLAudioElement | null }).target
      ?.error;

    if (mediaError) {
      const isMissingSource =
        mediaError.code === 4 ||
        mediaError.message?.toLowerCase().includes('no supported sources');

      let audioMessage = mediaError.message;

      if (isMissingSource) {
        audioMessage =
          'The file could not be played. It may have been deleted from the server or is no longer available.';
      } else if (!audioMessage) {
        switch (mediaError.code) {
          case 1:
            audioMessage = 'The audio playback was aborted.';
            break;
          case 2:
            audioMessage = 'A network error occurred during audio playback.';
            break;
          case 3:
            audioMessage =
              'The audio format is not supported or the URL is invalid.';
            break;
          default:
            audioMessage = 'An unknown audio playback error occurred.';
        }
      }

      return `Playback error: ${audioMessage}`;
    }
  }

  const message = getRawMessage(error);

  const subsonicMatch = message.match(/^\[(\d+)\]\s*/);

  if (subsonicMatch) {
    const code = Number(subsonicMatch[1]);

    if (code in SUBSONIC_ERROR_MESSAGES) {
      return SUBSONIC_ERROR_MESSAGES[code];
    }

    console.warn(
      `[getFriendlyErrorMessage] Unknown Subsonic error code: ${code}`,
    );
  }

  const lower = message.toLowerCase();

  if (
    lower.includes('no supported sources') ||
    (error instanceof DOMException && error.name === 'NotSupportedError')
  ) {
    return 'Playback error: The file could not be played. It may have been deleted from the server or is no longer available.';
  }

  if (
    lower.includes('timeout') ||
    lower.includes('abort') ||
    lower.includes('network') ||
    lower.includes('failed to fetch')
  ) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  if (/\b(401|403)\b/.test(message)) {
    return 'You do not have permission to access this resource. Please log in again.';
  }

  if (/\b(404)\b/.test(message)) {
    return 'The requested resource was not found. Please try again later.';
  }

  if (/\b(500|502|503|504)\b/.test(message)) {
    return 'The server encountered an error. Please try again later.';
  }

  return message;
}

function getRawMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}
