import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import apiPlugin from './api';

let onResponseCallback: (typeof $fetch)['arguments'][0]['onResponse'];

const $fetchMock = vi.hoisted(() => {
  const baseFetchMock = vi.fn();

  return Object.assign(baseFetchMock, {
    create: vi.fn().mockImplementation((options) => {
      onResponseCallback = options?.onResponse;
      return baseFetchMock;
    }),
  });
});

mockNuxtImport('$fetch', () => $fetchMock);

describe('api plugin', () => {
  beforeEach(() => {
    apiPlugin(undefined as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the response data does not have a subsonic-response key', () => {
    it('throws an error with the correct message', () => {
      expect(() =>
        onResponseCallback({
          response: {
            _data: {},
          },
        }),
      ).toThrow(DEFAULT_ERROR_MESSAGE);
    });
  });

  describe('when the response data has a subsonic-response key', () => {
    describe('when the status is not ok', () => {
      describe('when the error object has a message and code', () => {
        it('throws an error with the code prefix', () => {
          expect(() =>
            onResponseCallback({
              response: {
                _data: {
                  'subsonic-response': {
                    error: {
                      code: 40,
                      message: 'Invalid username or password.',
                    },
                    status: 'failed',
                  },
                },
              },
            }),
          ).toThrow('[40] Invalid username or password.');
        });
      });

      describe('when the error object has a message but no code', () => {
        it('throws an error with the correct message', () => {
          expect(() =>
            onResponseCallback({
              response: {
                _data: {
                  'subsonic-response': {
                    error: {
                      message: 'Test error message',
                    },
                    status: 'failed',
                  },
                },
              },
            }),
          ).toThrow('Test error message');
        });
      });

      describe('when the error object does not have a message', () => {
        it('throws an error with the default message', () => {
          expect(() =>
            onResponseCallback({
              response: {
                _data: {
                  'subsonic-response': {
                    error: {},
                    status: 'failed',
                  },
                },
              },
            }),
          ).toThrow(DEFAULT_ERROR_MESSAGE);
        });
      });
    });

    describe('when the status is ok', () => {
      it('returns the correct response', () => {
        expect(
          onResponseCallback({
            response: {
              _data: {
                'subsonic-response': {
                  status: 'ok',
                  testKey: 'testValue',
                },
              },
            },
          }),
        ).toEqual({
          status: 'ok',
          testKey: 'testValue',
        });
      });
    });
  });
});
