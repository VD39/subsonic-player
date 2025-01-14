import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAPI } from './index';

vi.unmock('./index');

const $apiMock = vi.fn();

mockNuxtImport('useNuxtApp', () => () => ({
  $api: $apiMock,
}));

const addErrorSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
}));

mockNuxtImport(
  'useCookie',
  () => () =>
    ref(
      'token=token&salt=salt&server=https://www.server.com&username=username',
    ),
);

const { fetchData, getDownloadUrl, getImageUrl, getStreamUrl } = useAPI();

describe('useAPI', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getImageUrl', () => {
    describe('when size is not set', () => {
      it('returns the correct value', () => {
        expect(getImageUrl('id')).toBe(
          'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id&size=500',
        );
      });
    });

    describe('when size is set', () => {
      it('returns the correct value', () => {
        expect(getImageUrl('id', '250')).toBe(
          'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id&size=250',
        );
      });
    });
  });

  describe('getStreamUrl', () => {
    describe('when streamUrlId is a URL', () => {
      it('returns the correct value', () => {
        expect(getStreamUrl('https://streamUrlId.mp3')).toBe(
          'https://streamUrlId.mp3',
        );
      });
    });

    describe('when streamUrlId is not a URL', () => {
      it('returns the correct value', () => {
        expect(getStreamUrl('id')).toBe(
          'https://www.server.com/rest/stream?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id',
        );
      });
    });
  });

  describe('getDownloadUrl', () => {
    it('returns the correct value', () => {
      expect(getDownloadUrl('id')).toBe(
        'https://www.server.com/rest/download?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id',
      );
    });
  });

  describe('when the fetchData function is called', () => {
    let result: Awaited<ReturnType<typeof fetchData>>;

    describe('when baseUrl is not set', () => {
      beforeEach(async () => {
        result = await fetchData('/path');
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
        result = await fetchData('/path', {
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
          result = await fetchData('/path');
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: null,
            error: Error(DEFAULT_ERROR_MESSAGE),
          });
        });
      });

      describe('when api response returns a value', () => {
        beforeEach(async () => {
          $apiMock.mockResolvedValue({});
          result = await fetchData('/path');
        });

        it('does not call the addErrorSnack function', () => {
          expect(addErrorSnackMock).not.toHaveBeenCalled();
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: {},
            error: null,
          });
        });

        describe('when transform is set', () => {
          beforeEach(async () => {
            result = await fetchData('/path', {
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
            result = await fetchData('/path');
          });

          it('calls the addErrorSnack function', () => {
            expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
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

            result = await fetchData('/path');
          });

          it('calls the addErrorSnack function', () => {
            expect(addErrorSnackMock).toHaveBeenCalledWith(
              'new Error message.',
            );
          });

          it('returns the correct response', () => {
            expect(result).toEqual({
              data: null,
              error: new Error('new Error message.'),
            });
          });
        });
      });
    });
  });
});
