import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAPI } from './index';

vi.unmock('./index');

const { useFetchMock } = vi.hoisted(() => ({
  useFetchMock: vi.fn(() => ({
    data: ref<unknown>(null),
    error: ref<Error | null>(null),
  })),
}));

mockNuxtImport('useFetch', () => useFetchMock);

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
    it('returns the correct value', () => {
      expect(getImageUrl('id')).toBe(
        'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id&size=500',
      );
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
        expect(useFetchMock).toHaveBeenCalledWith(
          '/path',
          expect.objectContaining({
            baseURL: 'https://www.server.com/rest',
          }),
          expect.any(String),
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
        expect(useFetchMock).toHaveBeenCalledWith(
          '/path',
          expect.objectContaining({
            baseURL: 'https://www.baseUrl.com',
          }),
          expect.any(String),
        );
      });
    });

    describe('when fetchData response is successful', () => {
      describe('when response returns null', () => {
        beforeEach(async () => {
          useFetchMock.mockResolvedValue({
            data: ref(null),
            error: ref(null),
          });

          result = await fetchData('/path');
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalled();
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: null,
            error: null,
          });
        });
      });

      describe('when response returns a value', () => {
        describe('when response returns a non array value', () => {
          beforeEach(async () => {
            useFetchMock.mockResolvedValue({
              data: ref({}),
              error: ref(null),
            });

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
        });
      });

      describe('when fetchData response is not successful', () => {
        beforeEach(async () => {
          useFetchMock.mockResolvedValue({
            data: ref(null),
            error: ref(new Error('Error message.')),
          });

          result = await fetchData('/path');
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
        });

        it('returns the correct response', () => {
          expect(result).toEqual({
            data: null,
            error: expect.any(Error),
          });
        });
      });
    });
  });
});
