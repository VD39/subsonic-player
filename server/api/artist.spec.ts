import { artistDataMock, artistInfo2Mock, cookieMock } from '@/test/fixtures';

const mockGetCookie = vi.hoisted(() => vi.fn(() => cookieMock));
const mock$fetch = vi.hoisted(() => vi.fn());

vi.mock('h3', () => ({
  defineEventHandler: (func: unknown) => func,
  getCookie: mockGetCookie,
  getQuery: () => ({ id: 'id' }),
}));

vi.mock('ofetch', () => ({
  $fetch: mock$fetch,
}));

describe('artist-api', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('when getCookie returns undefined', () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue(undefined as unknown as string);
    });

    it('returns the correct response', async () => {
      const { default: artistApiFresh } = await import('./artist');
      expect(await artistApiFresh({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 or getArtist return null', () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue(cookieMock);
      mock$fetch.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    });

    it('returns the correct response', async () => {
      const { default: artistApiFresh } = await import('./artist');
      expect(await artistApiFresh({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe("when $fetch response for getArtistInfo2 or getArtist don't return a subsonic-response key", () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue(cookieMock);
      mock$fetch
        .mockResolvedValueOnce({
          'subsonic-response': {},
        })
        .mockResolvedValueOnce(null);
    });

    it('returns the correct response', async () => {
      const { default: artistApiFresh } = await import('./artist');
      expect(await artistApiFresh({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 or getArtist status is not ok', () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue(cookieMock);
      mock$fetch
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'failed',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'ok',
          },
        });
    });

    it('returns the correct response', async () => {
      const { default: artistApiFresh } = await import('./artist');
      expect(await artistApiFresh({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 and getArtist returns a value', () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue(cookieMock);
      mock$fetch
        .mockResolvedValueOnce({
          'subsonic-response': {
            artistInfo2: artistInfo2Mock,
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            artist: artistDataMock,
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'ok',
          },
        });
    });

    it('returns the correct response', async () => {
      const { default: artistApiFresh } = await import('./artist');
      expect(await artistApiFresh({} as never)).toEqual({
        data: expect.objectContaining({
          id: 'id',
          name: 'name',
        }),
      });
    });
  });
});
