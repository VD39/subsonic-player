import apiPlugin from './api';

let onResponseCallback: (typeof $fetch)['arguments'][0]['onResponse'];

globalThis.$fetch = {
  create: vi.fn().mockImplementation((options) => {
    onResponseCallback = options.onResponse;

    return vi.fn();
  }),
} as unknown as typeof $fetch;

const blobMock = new Blob(['test-blob']);

describe('api plugin', () => {
  beforeEach(() => {
    apiPlugin(undefined as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the response data is a Blob', () => {
    it('returns undefined (Blob passes through unchanged)', () => {
      const response = { _data: blobMock };
      const result = onResponseCallback({ response });
      expect(result).toBeUndefined();
      expect(response._data).toBe(blobMock);
    });
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
      describe('when the error object has a message', () => {
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
      it('mutates response._data to contain subsonic-response content', () => {
        const response = {
          _data: {
            'subsonic-response': {
              status: 'ok',
              testKey: 'testValue',
            },
          },
        };
        onResponseCallback({ response });
        expect(response._data).toEqual({
          status: 'ok',
          testKey: 'testValue',
        });
      });
    });
  });
});
