import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useUser } from './index';

const getAvatarUrlMock = vi.fn(() => 'http://server/avatar');

mockNuxtImport('useAPI', () => () => ({
  getAvatarUrl: getAvatarUrlMock,
}));

const fetchMock = vi.fn();

globalThis.fetch = fetchMock;

const { clearUser, getAvatar, setUser, user } = useUser();

describe('useUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default user value', () => {
    expect(user.value).toBe(null);
  });

  describe('when the getAvatar function is called', () => {
    describe('when the response is ok and the content type is an image', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          headers: {
            get: vi.fn(() => 'image/jpeg'),
          },
          ok: true,
        });
      });

      it('returns the avatar url', async () => {
        expect(await getAvatar('username')).toBe('http://server/avatar');
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

      it('returns the default user image', async () => {
        expect(await getAvatar('username')).toBe(IMAGE_DEFAULT_BY_TYPE.user);
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

      it('returns the default user image', async () => {
        expect(await getAvatar('username')).toBe(IMAGE_DEFAULT_BY_TYPE.user);
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

      it('returns the default user image', async () => {
        expect(await getAvatar('username')).toBe(IMAGE_DEFAULT_BY_TYPE.user);
      });
    });

    describe('when fetch is called', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          headers: { get: vi.fn(() => 'image/jpeg') },
          ok: true,
        });
      });

      it('calls fetch with a HEAD request to the avatar url', async () => {
        await getAvatar('username');

        expect(fetchMock).toHaveBeenCalledWith('http://server/avatar', {
          method: 'HEAD',
        });
      });

      it('calls getAvatarUrl with the username', async () => {
        await getAvatar('username');

        expect(getAvatarUrlMock).toHaveBeenCalledWith('username');
      });
    });
  });

  describe('when the setUser function is called', () => {
    beforeEach(() => {
      setUser('salt=salt&server=server&token=token&username=username');
    });

    it('sets the user value from the cookie string', () => {
      expect(user.value).toEqual({
        salt: 'salt',
        server: 'server',
        token: 'token',
        username: 'username',
      });
    });
  });

  describe('when the clearUser function is called', () => {
    beforeEach(() => {
      clearUser();
    });

    it('sets the user value to null', () => {
      expect(user.value).toBeNull();
    });
  });
});
