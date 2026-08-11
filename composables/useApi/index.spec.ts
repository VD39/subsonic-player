import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { cookieMock } from '@/test/fixtures';
import { useRouterMock } from '@/test/useRouterMock';

import { useAPI } from './index';

const { $apiMock } = vi.hoisted(() => ({
  $apiMock: vi.fn(),
}));
const { routerMock } = useRouterMock();

mockNuxtImport('useNuxtApp', (original) => () => ({
  ...original(),
  $api: $apiMock,
  $router: routerMock,
}));

const handleErrorMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useErrorHandler', (original) => () => ({
  ...original(),
  handleError: handleErrorMock,
}));

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  streamBitrate: ref(30),
}));

mockNuxtImport('useCookie', () => () => ref(cookieMock));

describe('useAPI', () => {
  let composable: ReturnType<typeof useAPI>;

  beforeAll(() => {
    composable = useAPI();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getImageUrl', () => {
    describe('when streamUrlId is a URL', () => {
      it('returns the correct response', () => {
        expect(composable.getImageUrl('https://imageId.jpg')).toBe(
          'https://imageId.jpg',
        );
      });
    });

    describe('when streamUrlId is not a URL', () => {
      describe('when size is not set', () => {
        it('returns the correct response', () => {
          expect(composable.getImageUrl('id')).toBe(
            'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.16.1&id=id&size=500',
          );
        });
      });

      describe('when size is set', () => {
        it('returns the correct response', () => {
          expect(composable.getImageUrl('id', '250')).toBe(
            'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.16.1&id=id&size=250',
          );
        });
      });
    });
  });

  describe('getStreamUrl', () => {
    describe('when streamUrlId is a URL', () => {
      it('returns the correct response', () => {
        expect(composable.getStreamUrl('https://streamUrlId.mp3')).toBe(
          'https://streamUrlId.mp3',
        );
      });
    });

    describe('when streamUrlId is not a URL', () => {
      it('returns the correct response', () => {
        expect(composable.getStreamUrl('id')).toBe(
          'https://www.server.com/rest/stream?s=salt&t=token&u=username&c=web&f=json&v=1.16.1&id=id&maxBitRate=30',
        );
      });
    });
  });

  describe('getDownloadUrl', () => {
    it('returns the correct response', () => {
      expect(composable.getDownloadUrl('id')).toBe(
        'https://www.server.com/rest/download?s=salt&t=token&u=username&c=web&f=json&v=1.16.1&id=id',
      );
    });
  });

  describe('when the fetchData function is called', () => {
    let result: Awaited<ReturnType<typeof composable.fetchData>>;

    describe('when baseUrl is not set', () => {
      beforeEach(async () => {
        $apiMock.mockResolvedValue({});

        result = await composable.fetchData('/path');
      });

      it('sets the correct baseUrl', () => {
        expect($apiMock).toHaveBeenCalledWith(
          '/path',
          expect.objectContaining({
            baseURL: 'https://www.server.com/rest',
          }),
        );
      });
    });

    describe('when baseUrl is set', () => {
      beforeEach(async () => {
        $apiMock.mockResolvedValue({});

        result = await composable.fetchData('/path', {
          baseURL: 'https://www.baseUrl.com',
        });
      });

      it('sets the correct baseUrl', () => {
        expect($apiMock).toHaveBeenCalledWith(
          '/path',
          expect.objectContaining({
            baseURL: 'https://www.baseUrl.com',
          }),
        );
      });
    });

    describe('when api response is successful', () => {
      describe('when api response returns null', () => {
        beforeEach(async () => {
          $apiMock.mockResolvedValue(null);
          result = await composable.fetchData('/path');
        });

        it('calls the handleError function with the correct parameters', () => {
          expect(handleErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            'api',
          );
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: null,
            error: expect.any(Error),
          });
        });
      });

      describe('when api response returns a value', () => {
        beforeEach(async () => {
          $apiMock.mockResolvedValue({});

          result = await composable.fetchData('/path');
        });

        it('does not call the handleError function', () => {
          expect(handleErrorMock).not.toHaveBeenCalled();
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: {},
            error: null,
          });
        });

        describe('when transform is set', () => {
          beforeEach(async () => {
            $apiMock.mockResolvedValue({});

            result = await composable.fetchData('/path', {
              transform: () => 'I will return instead of response',
            });
          });

          it('returns the correct response', () => {
            expect(result).toEqual({
              data: 'I will return instead of response',
              error: null,
            });
          });
        });
      });

      describe('when api response is not successful', () => {
        describe('when api response is rejected value', () => {
          beforeEach(async () => {
            $apiMock.mockRejectedValue('Error message.');
            result = await composable.fetchData('/path');
          });

          it('calls the handleError function with the correct parameters', () => {
            expect(handleErrorMock).toHaveBeenCalledWith(
              'Error message.',
              'api',
            );
          });

          it('returns the correct response', () => {
            expect(result).toEqual({
              data: null,
              error: new Error('Error message.'),
            });
          });
        });

        describe('when api response throws an error', () => {
          beforeEach(async () => {
            $apiMock.mockImplementation(() => {
              throw new Error('new Error message.');
            });

            result = await composable.fetchData('/path');
          });

          it('calls the handleError function with the correct parameters', () => {
            expect(handleErrorMock).toHaveBeenCalledWith(
              expect.any(Error),
              'api',
            );
          });

          it('returns the correct response', () => {
            expect(result).toEqual({
              data: null,
              error: new Error('new Error message.'),
            });
          });
        });

        describe('when suppressErrorSnack is set to true', () => {
          beforeEach(async () => {
            $apiMock.mockRejectedValue('Error message.');
            result = await composable.fetchData('/path', {
              suppressErrorSnack: true,
            });
          });

          it('does not call the handleError function', () => {
            expect(handleErrorMock).not.toHaveBeenCalled();
          });

          it('returns the correct response', () => {
            expect(result).toEqual({
              data: null,
              error: new Error('Error message.'),
            });
          });
        });
      });
    });
  });
});
