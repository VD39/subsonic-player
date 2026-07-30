import { getFriendlyErrorMessage } from './utils';

describe('getFriendlyErrorMessage', () => {
  describe.each([
    [new Error('[0] generic'), 'A generic server error occurred.'],
    [
      new Error('404'),
      'The requested resource was not found. Please try again later.',
    ],
    [
      new Error('401'),
      'You do not have permission to access this resource. Please log in again.',
    ],
    [
      new Error('403'),
      'You do not have permission to access this resource. Please log in again.',
    ],
    [new Error('500Degreez'), '500Degreez'],
    [
      new Error('500'),
      'The server encountered an error. Please try again later.',
    ],
    [
      new Error('502'),
      'The server encountered an error. Please try again later.',
    ],
    [
      new Error('503'),
      'The server encountered an error. Please try again later.',
    ],
    [
      new Error('504'),
      'The server encountered an error. Please try again later.',
    ],
    [
      new Error('timeout'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('Timeout'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('abort'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('AbortError'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('network'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('Failed to fetch'),
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      new Error('[20] client outdated'),
      'The client application is outdated. Please update your app.',
    ],
    [
      new Error('[30] server incompatible'),
      'The server version is not compatible. Please update your server.',
    ],
    [new Error('[40] bad password'), 'Invalid username or password.'],
    [
      new Error('[41] token unsupported'),
      'Token authentication is not supported for this user account.',
    ],
    [
      new Error('[42] unsupported auth method'),
      'The provided authentication method is not supported by the server.',
    ],
    [
      new Error('[43] conflicting auth'),
      'Conflicting authentication methods were provided.',
    ],
    [new Error('[44] invalid api key'), 'The application API key is invalid.'],
    [
      new Error('[50] not allowed'),
      'You are not authorized to perform this action.',
    ],
    [new Error('[70] not found'), 'The requested data was not found.'],
    [new Error('Some other error'), 'Some other error'],
    ['plain string', 'plain string'],
    [null, DEFAULT_ERROR_MESSAGE],
    [undefined, DEFAULT_ERROR_MESSAGE],
    [
      { message: '404' },
      'The requested resource was not found. Please try again later.',
    ],
    [
      { message: 'timeout' },
      'A network error occurred. Please check your connection and try again.',
    ],
    [
      {
        message: [10],
      },
      DEFAULT_ERROR_MESSAGE,
    ],
    [
      {
        target: {
          error: {
            message: 'Decoder error',
          },
        },
      },
      'Playback error: Decoder error',
    ],
    [
      {
        target: {
          error: {
            code: 3,
          },
        },
      },
      'Playback error: The audio format is not supported or the URL is invalid.',
    ],
    [
      {
        target: {
          error: {
            code: 1,
          },
        },
      },
      'Playback error: The audio playback was aborted.',
    ],
    [
      {
        target: {
          error: {
            code: 2,
          },
        },
      },
      'Playback error: A network error occurred during audio playback.',
    ],
    [
      {
        target: {
          error: {
            code: 4,
          },
        },
      },
      'Playback error: The audio source is not supported.',
    ],
    [
      {
        target: null,
      },
      DEFAULT_ERROR_MESSAGE,
    ],
  ])('when the value is %o', (input: unknown, expected: string) => {
    it('returns the correct response', () => {
      expect(getFriendlyErrorMessage(input)).toBe(expected);
    });
  });
});
