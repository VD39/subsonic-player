import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { cookieMock } from '@/test/fixtures';

import { useUser } from './index';

const getAvatarUrlMock = vi.hoisted(() => vi.fn(() => 'http://server/avatar'));

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  getAvatarUrl: getAvatarUrlMock,
}));

const fetchMock = vi.fn();

globalThis.fetch = fetchMock;

describe('useUser', () => {
  let composable: ReturnType<typeof useUser>;

  beforeAll(() => {
    composable = useUser();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default user value', () => {
    expect(composable.user.value).toBeNull();
  });

  describe('when the resolveAvatarUrl function is called', () => {
    beforeEach(async () => {
      fetchMock.mockResolvedValue({
        headers: {
          get: vi.fn(() => 'image/jpeg'),
        },
        ok: true,
      });

      await composable.resolveAvatarUrl('username');
    });

    it('calls the fetch function with the correct parameters', () => {
      expect(fetchMock).toHaveBeenCalledWith('http://server/avatar', {
        method: 'HEAD',
      });
    });

    it('calls the getAvatarUrl function with the correct parameters', () => {
      expect(getAvatarUrlMock).toHaveBeenCalledWith('username');
    });

    describe('when the response is ok and the content type is an image', () => {
      it('returns the correct response', async () => {
        expect(await composable.resolveAvatarUrl('username')).toBe(
          'http://server/avatar',
        );
      });
    });

    describe('when the response is ok but the content type is not an image', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          headers: {
            get: vi.fn(() => 'text/xml'),
          },
          ok: true,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.resolveAvatarUrl('username')).toBe(
          FALLBACK_ICON_BY_TYPE.user,
        );
      });
    });

    describe('when the response is not ok', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          headers: {
            get: vi.fn(() => 'image/jpeg'),
          },
          ok: false,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.resolveAvatarUrl('username')).toBe(
          FALLBACK_ICON_BY_TYPE.user,
        );
      });
    });

    describe('when the content type is null', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          headers: {
            get: vi.fn(() => null),
          },
          ok: true,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.resolveAvatarUrl('username')).toBe(
          FALLBACK_ICON_BY_TYPE.user,
        );
      });
    });

    describe('when the fetch function throws an error', () => {
      beforeEach(() => {
        fetchMock.mockRejectedValue(new Error('Network error'));
      });

      it('returns the correct response', async () => {
        expect(await composable.resolveAvatarUrl('username')).toBe(
          FALLBACK_ICON_BY_TYPE.user,
        );
      });
    });
  });

  describe('when the setUser function is called', () => {
    beforeEach(() => {
      composable.setUser(cookieMock);
    });

    it('sets the correct user value', () => {
      expect(composable.user.value).toEqual({
        salt: 'salt',
        server: 'https://www.server.com',
        token: 'token',
        username: 'username',
      });
    });
  });

  describe('when the clearUser function is called', () => {
    beforeEach(() => {
      composable.clearUser();
    });

    it('sets the correct user value', () => {
      expect(composable.user.value).toBeNull();
    });
  });
});
